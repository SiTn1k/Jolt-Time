/**
 * Retry Engine
 *
 * Provides retry logic with exponential backoff for external service calls.
 * Handles transient failures with configurable retry policies.
 *
 * IMPORTANT: Retry Engine is a RESILIENCE pattern. It ONLY:
 * - Retries failed operations
 * - Implements backoff strategies
 * - Detects timeouts
 * - Tracks retry attempts
 *
 * Retry Engine MUST NEVER:
 * - Modify business logic
 * - Grant rewards
 * - Modify balances
 * - Execute game logic
 */

import { createLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types/interfaces';

/**
 * Retryable error types.
 */
export type RetryableErrorType = 'timeout' | 'rate_limit' | 'network' | 'server_error' | 'unknown';

/**
 * Retry result.
 */
export interface RetryResult<T> {
  /** Whether the operation succeeded */
  success: boolean;
  /** Result data if successful */
  data?: T;
  /** Error if failed after all retries */
  error?: RetryError;
  /** Number of attempts made */
  attemptsMade: number;
  /** Total time spent in milliseconds */
  totalTimeMs: number;
}

/**
 * Retry error details.
 */
export interface RetryError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Type of error */
  errorType: RetryableErrorType;
  /** Whether this error is retryable */
  isRetryable: boolean;
  /** Original error */
  cause?: Error;
}

/**
 * Retry configuration.
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Initial delay in milliseconds */
  initialDelayMs?: number;
  /** Maximum delay in milliseconds */
  maxDelayMs?: number;
  /** Backoff multiplier */
  backoffMultiplier?: number;
  /** Jitter factor (0-1) for randomness */
  jitterFactor?: number;
  /** List of HTTP status codes that should be retried */
  retryableStatusCodes?: number[];
  /** List of error types that should be retried */
  retryableErrorTypes?: RetryableErrorType[];
  /** Whether to retry on timeout */
  retryOnTimeout?: boolean;
  /** Timeout per attempt in milliseconds */
  timeoutMs?: number;
}

/**
 * Retry operation function type.
 */
export type RetryableOperation<T> = () => Promise<T>;

/**
 * Default retry configuration.
 */
export const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  retryableErrorTypes: ['timeout', 'rate_limit', 'network', 'server_error'],
  retryOnTimeout: true,
  timeoutMs: 30000,
};

/**
 * Retry Engine.
 * Implements retry logic with exponential backoff.
 */
export class RetryEngine {
  private readonly logger: ILogger;
  private readonly config: Required<RetryConfig>;

  /**
   * Creates a new Retry Engine.
   */
  constructor(config?: RetryConfig) {
    this.logger = createLogger('RetryEngine');
    this.config = { ...DEFAULT_RETRY_CONFIG, ...config };
  }

  /**
   * Executes an operation with retry logic.
   */
  async execute<T>(operation: RetryableOperation<T>): Promise<RetryResult<T>> {
    const startTime = Date.now();
    let lastError: RetryError | undefined;
    let attemptsMade = 0;

    while (attemptsMade <= this.config.maxRetries) {
      attemptsMade++;

      try {
        this.logger.debug('Attempting operation', { attempt: attemptsMade, maxRetries: this.config.maxRetries });

        const result = await this.executeWithTimeout(operation);

        this.logger.debug('Operation succeeded', { attempt: attemptsMade });
        return {
          success: true,
          data: result,
          attemptsMade,
          totalTimeMs: Date.now() - startTime,
        };
      } catch (err) {
        lastError = this.normalizeError(err);
        
        this.logger.debug('Operation failed', {
          attempt: attemptsMade,
          error: lastError.message,
          isRetryable: lastError.isRetryable,
        });

        if (!lastError.isRetryable || attemptsMade > this.config.maxRetries) {
          break;
        }

        const delay = this.calculateDelay(attemptsMade - 1);
        this.logger.debug('Waiting before retry', { delayMs: delay, nextAttempt: attemptsMade + 1 });

        await this.sleep(delay);
      }
    }

    this.logger.warn('All retry attempts exhausted', { attemptsMade, totalTimeMs: Date.now() - startTime });
    return {
      success: false,
      error: lastError,
      attemptsMade,
      totalTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Determines if a status code is retryable.
   */
  isRetryableStatusCode(statusCode: number): boolean {
    return this.config.retryableStatusCodes.includes(statusCode);
  }

  /**
   * Determines if an error type is retryable.
   */
  isRetryableErrorType(errorType: RetryableErrorType): boolean {
    return this.config.retryableErrorTypes.includes(errorType);
  }

  /**
   * Calculates delay for given attempt number with exponential backoff and jitter.
   */
  calculateDelay(attempt: number): number {
    // Exponential backoff: initialDelay * multiplier^attempt
    const exponentialDelay = this.config.initialDelayMs * Math.pow(this.config.backoffMultiplier, attempt);
    
    // Cap at max delay
    const cappedDelay = Math.min(exponentialDelay, this.config.maxDelayMs);
    
    // Add jitter for randomness
    const jitter = cappedDelay * this.config.jitterFactor * (Math.random() * 2 - 1);
    
    return Math.floor(cappedDelay + jitter);
  }

  /**
   * Determines if an error is retryable.
   */
  isRetryable(error: unknown): boolean {
    if (error instanceof Error) {
      // Timeout detection
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        return this.config.retryOnTimeout;
      }

      // Network errors
      if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
        return this.isRetryableErrorType('network');
      }
    }

    return false;
  }

  /**
   * Executes operation with timeout.
   */
  private async executeWithTimeout<T>(operation: RetryableOperation<T>): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(this.createTimeoutError());
      }, this.config.timeoutMs);
    });

    return Promise.race([operation(), timeoutPromise]);
  }

  /**
   * Creates a timeout error.
   */
  private createTimeoutError(): Error {
    const error = new Error('Operation timed out');
    error.name = 'TimeoutError';
    return error;
  }

  /**
   * Normalizes an error into RetryError format.
   */
  private normalizeError(error: unknown): RetryError {
    if (error instanceof Error) {
      const errorType = this.determineErrorType(error);
      return {
        code: error.name || 'UNKNOWN',
        message: error.message,
        errorType,
        isRetryable: this.isRetryableErrorType(errorType) || this.isRetryable(error),
        cause: error,
      };
    }

    return {
      code: 'UNKNOWN',
      message: String(error),
      errorType: 'unknown',
      isRetryable: this.isRetryableErrorType('unknown'),
    };
  }

  /**
   * Determines the type of error.
   */
  private determineErrorType(error: Error): RetryableErrorType {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return 'timeout';
    }

    if (error.message.includes('rate limit') || error.message.includes('429')) {
      return 'rate_limit';
    }

    if (error.message.includes('network') || error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      return 'network';
    }

    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503') || error.message.includes('504')) {
      return 'server_error';
    }

    return 'unknown';
  }

  /**
   * Sleeps for specified milliseconds.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Factory for creating retry engines.
 */
export class RetryEngineFactory {
  /**
   * Creates a default retry engine.
   */
  static createDefault(): RetryEngine {
    return new RetryEngine();
  }

  /**
   * Creates a retry engine with custom configuration.
   */
  static create(config: RetryConfig): RetryEngine {
    return new RetryEngine(config);
  }

  /**
   * Creates a retry engine for high-latency operations.
   */
  static createForHighLatency(): RetryEngine {
    return new RetryEngine({
      maxRetries: 5,
      initialDelayMs: 2000,
      maxDelayMs: 60000,
      backoffMultiplier: 2,
    });
  }

  /**
   * Creates a retry engine for quick operations.
   */
  static createForQuickOperations(): RetryEngine {
    return new RetryEngine({
      maxRetries: 2,
      initialDelayMs: 100,
      maxDelayMs: 1000,
      backoffMultiplier: 2,
    });
  }

  /**
   * Creates a retry engine for rate-limited APIs.
   */
  static createForRateLimitedApi(): RetryEngine {
    return new RetryEngine({
      maxRetries: 5,
      initialDelayMs: 5000,
      maxDelayMs: 120000,
      backoffMultiplier: 2,
      jitterFactor: 0.2,
      retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    });
  }
}
