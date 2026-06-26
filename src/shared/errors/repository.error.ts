/**
 * Repository Error
 *
 * Error class for data access layer errors.
 */

import { ApplicationError } from './application.error';
import { ErrorCategory, ErrorSeverity } from '../constants';
import { DatabaseErrorCodes } from '../types';

/**
 * Repository error for database operation failures.
 */
export class RepositoryError extends ApplicationError {
  public readonly table?: string;
  public readonly constraint?: string;

  constructor(params: {
    message: string;
    code?: string;
    table?: string;
    constraint?: string;
    details?: Record<string, unknown>;
    context?: Record<string, unknown>;
    cause?: Error;
  }) {
    super({
      message: params.message,
      code: params.code || DatabaseErrorCodes.QUERY_FAILED,
      category: ErrorCategory.DATABASE,
      severity: ErrorSeverity.HIGH,
      details: params.details,
      recoverable: false,
      context: params.context as never,
      cause: params.cause,
    });
    this.name = 'RepositoryError';
    this.table = params.table;
    this.constraint = params.constraint;
  }

  /**
   * Create a not found error.
   */
  static notFound(id: string, table?: string): RepositoryError {
    return new RepositoryError({
      message: `Entity not found: ${id}`,
      code: DatabaseErrorCodes.QUERY_FAILED,
      table,
      context: { entityId: id },
    });
  }

  /**
   * Create a constraint violation error.
   */
  static constraintViolation(
    message: string,
    table: string,
    constraint: string,
    details?: Record<string, unknown>
  ): RepositoryError {
    return new RepositoryError({
      message,
      code: DatabaseErrorCodes.CONSTRAINT_VIOLATION,
      table,
      constraint,
      details,
      context: { table, constraint },
    });
  }

  /**
   * Create a connection error.
   */
  static connectionFailed(cause: Error): RepositoryError {
    return new RepositoryError({
      message: 'Database connection failed',
      code: DatabaseErrorCodes.CONNECTION_FAILED,
      details: { originalError: cause.message },
      cause,
    });
  }

  /**
   * Create a query error.
   */
  static queryFailed(message: string, cause?: Error): RepositoryError {
    return new RepositoryError({
      message: `Query failed: ${message}`,
      code: DatabaseErrorCodes.QUERY_FAILED,
      cause,
    });
  }
}
