/**
 * Retry Engine Service
 *
 * Handles retry logic for failed job executions.
 * Supports configurable retry counter, delay, and maximum retries.
 */

import type { JobExecution } from '../entities/JobExecution';
import type { ScheduledJob } from '../entities/ScheduledJob';
import { SchedulerService } from './SchedulerService';
import { createLogger } from '../../../core/logging/logger.service';
import { isRetryableExecutionStatus } from '../types/ExecutionStatus';

const logger = createLogger('RetryEngineService');

/**
 * Retry configuration.
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

/**
 * Default retry configuration.
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 60000,
  backoffMultiplier: 2,
};

/**
 * Retry state for tracking retry attempts.
 */
export interface RetryState {
  executionId: string;
  jobId: string;
  attempt: number;
  nextRetryAt: Date;
  lastError?: string;
}

/**
 * Retry Engine Service
 * Handles retry logic for failed job executions.
 */
export class RetryEngineService {
  private readonly schedulerService: SchedulerService;
  private readonly retryStates: Map<string, RetryState> = new Map();
  private readonly pendingRetries: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private retryConfig: RetryConfig;

  /**
   * Creates a new RetryEngineService instance.
   */
  constructor(
    schedulerService: SchedulerService,
    retryConfig?: Partial<RetryConfig>
  ) {
    this.schedulerService = schedulerService;
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  }

  /**
   * Updates the retry configuration.
   */
  public setConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
    logger.info('Retry configuration updated', { config: this.retryConfig });
  }

  /**
   * Gets the current retry configuration.
   */
  public getConfig(): RetryConfig {
    return { ...this.retryConfig };
  }

  /**
   * Checks if a failed execution should be retried.
   */
  public shouldRetry(execution: JobExecution, job: ScheduledJob): boolean {
    // Check if execution is in a retryable state
    if (!isRetryableExecutionStatus(execution.status)) {
      return false;
    }

    // Check max retries from job metadata
    const maxRetries = job.metadata.maxRetries ?? this.retryConfig.maxRetries;
    const currentAttempt = this.getRetryAttempt(execution);

    return currentAttempt < maxRetries;
  }

  /**
   * Gets the retry attempt number from execution metadata.
   */
  public getRetryAttempt(execution: JobExecution): number {
    return (execution.metadata.retryAttempt as number) ?? 0;
  }

  /**
   * Schedules a retry for a failed execution.
   */
  public async scheduleRetry(
    execution: JobExecution,
    job: ScheduledJob
  ): Promise<RetryState | null> {
    if (!this.shouldRetry(execution, job)) {
      logger.debug('Retry not needed', {
        executionId: execution.executionId.value,
        jobId: job.jobId.value,
      });
      return null;
    }

    const attempt = this.getRetryAttempt(execution) + 1;
    const delay = this.calculateDelay(attempt);
    const nextRetryAt = new Date(Date.now() + delay);

    const retryState: RetryState = {
      executionId: execution.executionId.value,
      jobId: job.jobId.value,
      attempt,
      nextRetryAt,
      lastError: execution.errorMessage,
    };

    // Store retry state
    const stateKey = this.getStateKey(execution.executionId.value, job.jobId.value);
    this.retryStates.set(stateKey, retryState);

    // Schedule the retry
    const timeoutId = setTimeout(async () => {
      await this.executeRetry(retryState);
    }, delay);

    this.pendingRetries.set(stateKey, timeoutId);

    logger.info('Retry scheduled', {
      executionId: execution.executionId.value,
      jobId: job.jobId.value,
      attempt,
      delayMs: delay,
      nextRetryAt: nextRetryAt.toISOString(),
    });

    return retryState;
  }

  /**
   * Executes a scheduled retry.
   */
  private async executeRetry(retryState: RetryState): Promise<void> {
    const stateKey = this.getStateKey(retryState.executionId, retryState.jobId);

    // Clean up tracking maps
    this.pendingRetries.delete(stateKey);
    this.retryStates.delete(stateKey);

    try {
      // Create a new execution for the retry
      const result = await this.schedulerService.executeJob(retryState.jobId, {
        parentExecutionId: retryState.executionId,
        retryAttempt: retryState.attempt,
        previousError: retryState.lastError,
      });

      if (result.success) {
        logger.info('Retry execution started', {
          originalExecutionId: retryState.executionId,
          newExecutionId: result.data.executionId.value,
          attempt: retryState.attempt,
        });
      } else {
        logger.error('Failed to start retry execution', {
          originalExecutionId: retryState.executionId,
          error: result.error,
        });
      }
    } catch (err) {
      logger.error('Retry execution error', err as Error, {
        originalExecutionId: retryState.executionId,
      });
    }
  }

  /**
   * Cancels a pending retry.
   */
  public cancelRetry(executionId: string, jobId: string): boolean {
    const stateKey = this.getStateKey(executionId, jobId);

    const timeoutId = this.pendingRetries.get(stateKey);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.pendingRetries.delete(stateKey);
      this.retryStates.delete(stateKey);
      logger.info('Retry cancelled', { executionId, jobId });
      return true;
    }

    return false;
  }

  /**
   * Gets the retry state for an execution.
   */
  public getRetryState(executionId: string, jobId: string): RetryState | null {
    const stateKey = this.getStateKey(executionId, jobId);
    return this.retryStates.get(stateKey) ?? null;
  }

  /**
   * Calculates the delay for a retry attempt using exponential backoff.
   */
  public calculateDelay(attempt: number): number {
    const delay = Math.min(
      this.retryConfig.baseDelayMs * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1),
      this.retryConfig.maxDelayMs
    );

    // Add jitter (0-10% of delay)
    const jitter = delay * Math.random() * 0.1;

    return Math.floor(delay + jitter);
  }

  /**
   * Gets statistics about retry operations.
   */
  public getStatistics(): {
    pendingRetries: number;
    activeRetryStates: number;
    config: RetryConfig;
  } {
    return {
      pendingRetries: this.pendingRetries.size,
      activeRetryStates: this.retryStates.size,
      config: this.retryConfig,
    };
  }

  /**
   * Clears all pending retries (used during shutdown).
   */
  public clearAllRetries(): void {
    for (const timeoutId of this.pendingRetries.values()) {
      clearTimeout(timeoutId);
    }
    this.pendingRetries.clear();
    this.retryStates.clear();
    logger.info('All pending retries cleared');
  }

  /**
   * Generates a unique key for retry state tracking.
   */
  private getStateKey(executionId: string, jobId: string): string {
    return `${executionId}:${jobId}`;
  }
}
