/**
 * Job Executor Service
 *
 * Executes scheduled jobs based on their schedule type.
 * Supports cron, interval, daily, weekly, monthly, startup, and manual jobs.
 */

import { SchedulerService } from './SchedulerService';
import type { ScheduledJob } from '../entities/ScheduledJob';
import type { JobExecution } from '../entities/JobExecution';
import { createLogger } from '../../../core/logging/logger.service';
import { isActiveExecutionStatus, isTerminalExecutionStatus } from '../types/ExecutionStatus';

const logger = createLogger('JobExecutorService');

/**
 * Job handler function type.
 */
export type JobHandler = (context: JobExecutionContext) => Promise<JobExecutionResult>;

/**
 * Context passed to job handlers.
 */
export interface JobExecutionContext {
  execution: JobExecution;
  job: ScheduledJob;
  metadata?: Record<string, unknown>;
}

/**
 * Result from job execution.
 */
export interface JobExecutionResult {
  success: boolean;
  errorMessage?: string;
  output?: unknown;
}

/**
 * Job Executor Service
 * Executes scheduled jobs based on their type.
 */
export class JobExecutorService {
  private readonly schedulerService: SchedulerService;
  private readonly handlers: Map<string, JobHandler> = new Map();
  private readonly activeExecutions: Map<string, AbortController> = new Map();
  private isRunning = false;
  private executionInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Creates a new JobExecutorService instance.
   */
  constructor(schedulerService: SchedulerService) {
    this.schedulerService = schedulerService;
  }

  /**
   * Registers a job handler.
   */
  public registerHandler(handlerName: string, handler: JobHandler): void {
    this.handlers.set(handlerName, handler);
    logger.debug('Job handler registered', { handlerName });
  }

  /**
   * Unregisters a job handler.
   */
  public unregisterHandler(handlerName: string): void {
    this.handlers.delete(handlerName);
    logger.debug('Job handler unregistered', { handlerName });
  }

  /**
   * Starts the job executor.
   */
  public start(intervalMs: number = 1000): void {
    if (this.isRunning) {
      logger.warn('Job executor already running');
      return;
    }

    this.isRunning = true;
    this.executionInterval = setInterval(() => this.processJobs(), intervalMs);
    logger.info('Job executor started', { intervalMs });
  }

  /**
   * Stops the job executor.
   */
  public stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.executionInterval) {
      clearInterval(this.executionInterval);
      this.executionInterval = null;
    }

    // Cancel all active executions
    for (const [executionId, controller] of this.activeExecutions) {
      controller.abort();
      logger.debug('Cancelled active execution', { executionId });
    }
    this.activeExecutions.clear();

    logger.info('Job executor stopped');
  }

  /**
   * Processes jobs due for execution.
   */
  private async processJobs(): Promise<void> {
    if (!this.isRunning) return;

    try {
      const result = await this.schedulerService.getJobsDueForExecution();
      if (!result.success) {
        logger.error('Failed to get jobs due for execution', { error: result.error });
        return;
      }

      const jobs = result.data;
      logger.debug('Processing jobs', { count: jobs.length });

      for (const job of jobs) {
        await this.executeJob(job);
      }
    } catch (err) {
      logger.error('Error processing jobs', err as Error);
    }
  }

  /**
   * Executes a single job.
   */
  public async executeJob(job: ScheduledJob): Promise<JobExecutionResult> {
    logger.debug('Executing job', { jobId: job.jobId.value, jobKey: job.jobKey });

    try {
      // Execute the job
      const result = await this.schedulerService.executeJob(job.jobId.value);

      if (!result.success) {
        logger.error('Failed to start job execution', { jobId: job.jobId.value, error: result.error });
        return { success: false, errorMessage: result.error };
      }

      const execution = result.data;

      // Get the handler
      const handler = this.handlers.get(job.jobKey);
      if (!handler) {
        const errorMessage = `No handler registered for job: ${job.jobKey}`;
        logger.error(errorMessage);
        await this.schedulerService.failJobExecution(execution.executionId.value, job.jobId.value, errorMessage);
        return { success: false, errorMessage };
      }

      // Execute with timeout
      const timeoutMs = job.metadata.timeoutMs ?? 60000;
      const executionResult = await this.executeWithTimeout(
        handler,
        { execution, job, metadata: job.metadata },
        timeoutMs,
        execution.executionId.value
      );

      if (executionResult.success) {
        await this.schedulerService.completeJobExecution(execution.executionId.value, job.jobId.value);
        logger.info('Job execution completed', { jobId: job.jobId.value, executionId: execution.executionId.value });
      } else {
        await this.schedulerService.failJobExecution(
          execution.executionId.value,
          job.jobId.value,
          executionResult.errorMessage ?? 'Unknown error'
        );
        logger.warn('Job execution failed', { jobId: job.jobId.value, error: executionResult.errorMessage });
      }

      return executionResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Job execution failed';
      logger.error('Job execution error', err as Error, { jobId: job.jobId.value });
      return { success: false, errorMessage };
    }
  }

  /**
   * Executes a handler with timeout support.
   */
  private async executeWithTimeout(
    handler: JobHandler,
    context: JobExecutionContext,
    timeoutMs: number,
    executionId: string
  ): Promise<JobExecutionResult> {
    const controller = new AbortController();
    this.activeExecutions.set(executionId, controller);

    const timeoutPromise = new Promise<JobExecutionResult>((_, reject) => {
      const timeout = setTimeout(() => {
        controller.abort();
        reject(new Error(`Job execution timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([
        handler(context),
        timeoutPromise,
      ]);

      return result;
    } catch (err) {
      if (err instanceof Error && err.message.includes('timed out')) {
        return { success: false, errorMessage: err.message };
      }
      throw err;
    } finally {
      this.activeExecutions.delete(executionId);
    }
  }

  /**
   * Cancels an active execution.
   */
  public cancelExecution(executionId: string): boolean {
    const controller = this.activeExecutions.get(executionId);
    if (controller) {
      controller.abort();
      this.activeExecutions.delete(executionId);
      logger.info('Execution cancelled', { executionId });
      return true;
    }
    return false;
  }

  /**
   * Checks if an execution is active.
   */
  public isExecutionActive(executionId: string): boolean {
    return this.activeExecutions.has(executionId);
  }

  /**
   * Gets the count of active executions.
   */
  public getActiveExecutionCount(): number {
    return this.activeExecutions.size;
  }

  /**
   * Checks if executor is running.
   */
  public getIsRunning(): boolean {
    return this.isRunning;
  }
}
