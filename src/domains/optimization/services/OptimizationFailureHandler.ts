/**
 * Optimization Failure Handler
 *
 * Handles failures in the optimization module gracefully.
 * Ensures optimization failures never interrupt gameplay.
 *
 * IMPORTANT: Optimization module failures must:
 * - Continue execution
 * - Log errors
 * - Never interrupt gameplay
 * - Return safe default values
 */

import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('OptimizationFailureHandler');

/**
 * Failure recovery strategy.
 */
export enum RecoveryStrategy {
  /** Return safe default value and continue */
  RETURN_DEFAULT = 'return_default',
  /** Retry the operation */
  RETRY = 'retry',
  /** Skip the operation and continue */
  SKIP = 'skip',
  /** Use cached value if available */
  USE_CACHE = 'use_cache',
}

/**
 * Failure context information.
 */
export interface FailureContext {
  operation: string;
  component: string;
  error?: Error;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Recovery action result.
 */
export interface RecoveryResult<T> {
  success: boolean;
  value?: T;
  recovered: boolean;
  error?: string;
  strategy: RecoveryStrategy;
}

/**
 * Failure handler configuration.
 */
export interface FailureHandlerConfig {
  maxRetries?: number;
  retryDelayMs?: number;
  enableFallback?: boolean;
  logFailures?: boolean;
}

/**
 * Optimization failure handler for graceful error handling.
 * Ensures optimization failures never interrupt gameplay.
 */
export class OptimizationFailureHandler {
  private readonly _maxRetries: number;
  private readonly _retryDelayMs: number;
  private readonly _enableFallback: boolean;
  private readonly _logFailures: boolean;
  private readonly _failureLog: FailureContext[] = [];
  private readonly _maxLogSize: number;

  constructor(config?: FailureHandlerConfig) {
    this._maxRetries = config?.maxRetries ?? 3;
    this._retryDelayMs = config?.retryDelayMs ?? 100;
    this._enableFallback = config?.enableFallback ?? true;
    this._logFailures = config?.logFailures ?? true;
    this._maxLogSize = 1000;
  }

  // ============ Execute with Recovery ============

  /**
   * Executes an operation with automatic recovery on failure.
   * Returns safe default value if all recovery strategies fail.
   */
  async executeWithRecovery<T>(
    operation: () => Promise<T>,
    component: string,
    defaultValue: T,
    options?: {
      operationName?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<RecoveryResult<T>> {
    const operationName = options?.operationName ?? 'anonymous';

    // Try the operation
    try {
      const value = await operation();
      return {
        success: true,
        value,
        recovered: false,
        strategy: RecoveryStrategy.RETURN_DEFAULT,
      };
    } catch (error) {
      const context: FailureContext = {
        operation: operationName,
        component,
        error: error instanceof Error ? error : new Error(String(error)),
        timestamp: new Date(),
        metadata: options?.metadata,
      };

      this.logFailure(context);

      // Try recovery strategies
      const retryResult = await this.tryRetry(operation, this._maxRetries);
      if (retryResult.success) {
        return {
          success: true,
          value: retryResult.value,
          recovered: true,
          strategy: RecoveryStrategy.RETRY,
        };
      }

      // Return default value if fallback is enabled
      if (this._enableFallback) {
        logger.warn(`Optimization operation '${operationName}' failed, using default value`, {
          component,
          error: error instanceof Error ? error.message : String(error),
        });

        return {
          success: false,
          value: defaultValue,
          recovered: true,
          error: error instanceof Error ? error.message : String(error),
          strategy: RecoveryStrategy.RETURN_DEFAULT,
        };
      }

      return {
        success: false,
        recovered: false,
        error: error instanceof Error ? error.message : String(error),
        strategy: RecoveryStrategy.SKIP,
      };
    }
  }

  /**
   * Executes a synchronous operation with recovery.
   */
  executeWithRecoverySync<T>(
    operation: () => T,
    component: string,
    defaultValue: T,
    options?: {
      operationName?: string;
      metadata?: Record<string, unknown>;
    }
  ): RecoveryResult<T> {
    const operationName = options?.operationName ?? 'anonymous';

    try {
      const value = operation();
      return {
        success: true,
        value,
        recovered: false,
        strategy: RecoveryStrategy.RETURN_DEFAULT,
      };
    } catch (error) {
      const context: FailureContext = {
        operation: operationName,
        component,
        error: error instanceof Error ? error : new Error(String(error)),
        timestamp: new Date(),
        metadata: options?.metadata,
      };

      this.logFailure(context);

      if (this._enableFallback) {
        logger.warn(`Optimization operation '${operationName}' failed, using default value`, {
          component,
          error: error instanceof Error ? error.message : String(error),
        });

        return {
          success: false,
          value: defaultValue,
          recovered: true,
          error: error instanceof Error ? error.message : String(error),
          strategy: RecoveryStrategy.RETURN_DEFAULT,
        };
      }

      return {
        success: false,
        recovered: false,
        error: error instanceof Error ? error.message : String(error),
        strategy: RecoveryStrategy.SKIP,
      };
    }
  }

  // ============ Try Recovery ============

  /**
   * Attempts to retry an operation.
   */
  private async tryRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number
  ): Promise<RecoveryResult<T>> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 1) {
          await this.delay(this._retryDelayMs * attempt);
        }

        const value = await operation();
        return {
          success: true,
          value,
          recovered: true,
          strategy: RecoveryStrategy.RETRY,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logger.debug(`Retry attempt ${attempt}/${maxRetries} failed`, {
          error: lastError.message,
        });
      }
    }

    return {
      success: false,
      recovered: false,
      error: lastError?.message,
      strategy: RecoveryStrategy.RETRY,
    };
  }

  /**
   * Delays execution.
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ============ Failure Logging ============

  /**
   * Logs a failure context.
   */
  private logFailure(context: FailureContext): void {
    if (this._logFailures) {
      logger.error(`Optimization failure in ${context.component}:${context.operation}`, context.error, {
        metadata: context.metadata,
        timestamp: context.timestamp.toISOString(),
      });

      this._failureLog.push(context);
      this.trimLog();
    }
  }

  /**
   * Trims failure log to max size.
   */
  private trimLog(): void {
    if (this._failureLog.length > this._maxLogSize) {
      this._failureLog.splice(0, this._failureLog.length - this._maxLogSize);
    }
  }

  // ============ Query Methods ============

  /**
   * Gets recent failures.
   */
  getRecentFailures(count: number = 10): FailureContext[] {
    return this._failureLog.slice(-count);
  }

  /**
   * Gets failures by component.
   */
  getFailuresByComponent(component: string): FailureContext[] {
    return this._failureLog.filter((f) => f.component === component);
  }

  /**
   * Gets failures by operation.
   */
  getFailuresByOperation(operation: string): FailureContext[] {
    return this._failureLog.filter((f) => f.operation === operation);
  }

  /**
   * Gets total failure count.
   */
  getTotalFailureCount(): number {
    return this._failureLog.length;
  }

  /**
   * Gets failure count by component.
   */
  getFailureCountByComponent(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const failure of this._failureLog) {
      counts[failure.component] = (counts[failure.component] || 0) + 1;
    }
    return counts;
  }

  /**
   * Clears failure log.
   */
  clearLog(): void {
    this._failureLog.length = 0;
  }

  // ============ Utility Methods ============

  /**
   * Wraps a function with failure handling.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrap<T extends (...args: any[]) => any>(
    fn: T,
    component: string,
    defaultValue: ReturnType<T>
  ): (...args: Parameters<T>) => RecoveryResult<ReturnType<T>> {
    return (...args: Parameters<T>): RecoveryResult<ReturnType<T>> => {
      return this.executeWithRecoverySync(
        () => fn(...args) as ReturnType<T>,
        component,
        defaultValue,
        { operationName: fn.name }
      );
    };
  }

  /**
   * Wraps an async function with failure handling.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    component: string,
    defaultValue: Awaited<ReturnType<T>>
  ): (...args: Parameters<T>) => Promise<RecoveryResult<Awaited<ReturnType<T>>>> {
    return async (...args: Parameters<T>): Promise<RecoveryResult<Awaited<ReturnType<T>>>> => {
      return this.executeWithRecovery(
        () => fn(...args) as Promise<Awaited<ReturnType<T>>>,
        component,
        defaultValue,
        { operationName: fn.name }
      );
    };
  }

  /**
   * Creates a safe wrapper that continues execution on any error.
   */
  createSafeExecutor<T>(
    component: string,
    operationName: string
  ): {
    execute: (fn: () => Promise<T>, defaultValue: T) => Promise<RecoveryResult<T>>;
    executeSync: (fn: () => T, defaultValue: T) => RecoveryResult<T>;
  } {
    return {
      execute: (fn, defaultValue) =>
        this.executeWithRecovery(fn, component, defaultValue, { operationName }),
      executeSync: (fn, defaultValue) =>
        this.executeWithRecoverySync(fn, component, defaultValue, { operationName }),
    };
  }
}
