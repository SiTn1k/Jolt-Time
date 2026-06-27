/**
 * Application Error
 *
 * Base application error class with full context and error handling support.
 */

import type { ErrorCategory, ErrorSeverity } from '../constants';
import type { ErrorContext } from '../types';

/**
 * Application error with comprehensive error information.
 */
export class ApplicationError extends Error {
  public readonly id: string;
  public readonly code: string;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly details?: Record<string, unknown>;
  public readonly recoverable: boolean;
  public readonly timestamp: Date;
  public readonly context?: ErrorContext;

  constructor(params: {
    message: string;
    code: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    details?: Record<string, unknown>;
    recoverable?: boolean;
    context?: ErrorContext;
    cause?: Error;
  }) {
    super(params.message);
    this.name = 'ApplicationError';
    this.id = generateErrorId();
    this.code = params.code;
    this.category = params.category;
    this.severity = params.severity;
    this.details = params.details;
    this.recoverable = params.recoverable ?? true;
    this.timestamp = new Date();
    this.context = params.context;

    if (params.cause) {
      this.cause = params.cause;
    }

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a copy with additional context.
   */
  withContext(context: ErrorContext): ApplicationError {
    return new ApplicationError({
      message: this.message,
      code: this.code,
      category: this.category,
      severity: this.severity,
      details: this.details,
      recoverable: this.recoverable,
      context: {
        ...this.context,
        ...context,
      },
      cause: this.cause as Error | undefined,
    });
  }

  /**
   * Convert to plain object for serialization.
   */
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      category: this.category,
      severity: this.severity,
      message: this.message,
      details: this.details,
      recoverable: this.recoverable,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
      cause: this.cause instanceof Error ? this.cause.message : undefined,
    };
  }

  /**
   * Create a summary for logging.
   */
  toSummary(): string {
    return `[${this.code}] ${this.category}:${this.severity} - ${this.message}`;
  }
}

/**
 * Generate unique error ID.
 */
function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Check if value is an ApplicationError.
 */
export function isApplicationError(value: unknown): value is ApplicationError {
  return value instanceof ApplicationError;
}
