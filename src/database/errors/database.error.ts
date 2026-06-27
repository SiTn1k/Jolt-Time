/**
 * Database Error
 *
 * Base error class for database layer errors.
 */

import { ApplicationError } from '../../shared/errors/application.error';
import { ErrorCategory, ErrorSeverity } from '../../shared/constants';

/**
 * Database error codes.
 */
export const DatabaseErrorCodes = {
  CONNECTION_FAILED: 'DB_CONNECTION_FAILED',
  CONNECTION_TIMEOUT: 'DB_CONNECTION_TIMEOUT',
  QUERY_FAILED: 'DB_QUERY_FAILED',
  QUERY_TIMEOUT: 'DB_QUERY_TIMEOUT',
  CONSTRAINT_VIOLATION: 'DB_CONSTRAINT_VIOLATION',
  UNIQUE_VIOLATION: 'DB_UNIQUE_VIOLATION',
  FOREIGN_KEY_VIOLATION: 'DB_FOREIGN_KEY_VIOLATION',
  NOT_NULL_VIOLATION: 'DB_NOT_NULL_VIOLATION',
  CHECK_VIOLATION: 'DB_CHECK_VIOLATION',
  TRANSACTION_FAILED: 'DB_TRANSACTION_FAILED',
  TRANSACTION_TIMEOUT: 'DB_TRANSACTION_TIMEOUT',
  RPC_FAILED: 'DB_RPC_FAILED',
  RPC_TIMEOUT: 'DB_RPC_TIMEOUT',
  PERMISSION_DENIED: 'DB_PERMISSION_DENIED',
  VALIDATION_FAILED: 'DB_VALIDATION_FAILED',
  NOT_FOUND: 'DB_NOT_FOUND',
} as const;

/**
 * Database error class.
 */
export class DatabaseError extends ApplicationError {
  public readonly table?: string;
  public readonly constraint?: string;
  public readonly operation?: string;

  constructor(params: {
    message: string;
    code?: string;
    table?: string;
    constraint?: string;
    operation?: string;
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
      recoverable: isRecoverable(params.code),
      context: params.context as Record<string, unknown> | undefined,
      cause: params.cause,
    });

    this.name = 'DatabaseError';
    this.table = params.table;
    this.constraint = params.constraint;
    this.operation = params.operation;
  }

  /**
   * Create a not found error.
   */
  static notFound(id: string, table?: string): DatabaseError {
    return new DatabaseError({
      message: `Entity not found: ${id}`,
      code: DatabaseErrorCodes.NOT_FOUND,
      table,
      operation: 'SELECT',
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
  ): DatabaseError {
    return new DatabaseError({
      message,
      code: DatabaseErrorCodes.CONSTRAINT_VIOLATION,
      table,
      constraint,
      operation: 'INSERT/UPDATE',
      details,
      context: { table, constraint },
    });
  }

  /**
   * Create a connection error.
   */
  static connectionFailed(cause: Error): DatabaseError {
    return new DatabaseError({
      message: 'Database connection failed',
      code: DatabaseErrorCodes.CONNECTION_FAILED,
      cause,
      context: { originalError: cause.message },
    });
  }

  /**
   * Create a connection timeout error.
   */
  static connectionTimeout(cause?: Error): DatabaseError {
    return new DatabaseError({
      message: 'Database connection timed out',
      code: DatabaseErrorCodes.CONNECTION_TIMEOUT,
      cause,
    });
  }

  /**
   * Create a query failed error.
   */
  static queryFailed(message: string, cause?: Error): DatabaseError {
    return new DatabaseError({
      message: `Query failed: ${message}`,
      code: DatabaseErrorCodes.QUERY_FAILED,
      cause,
    });
  }

  /**
   * Create a query timeout error.
   */
  static queryTimeout(query: string, timeoutMs: number): DatabaseError {
    return new DatabaseError({
      message: `Query timed out after ${timeoutMs}ms`,
      code: DatabaseErrorCodes.QUERY_TIMEOUT,
      details: { query, timeoutMs },
    });
  }

  /**
   * Create a transaction failed error.
   */
  static transactionFailed(message: string, cause?: Error): DatabaseError {
    return new DatabaseError({
      message: `Transaction failed: ${message}`,
      code: DatabaseErrorCodes.TRANSACTION_FAILED,
      cause,
    });
  }

  /**
   * Create an RPC failed error.
   */
  static rpcFailed(functionName: string, cause?: Error): DatabaseError {
    return new DatabaseError({
      message: `RPC call failed: ${functionName}`,
      code: DatabaseErrorCodes.RPC_FAILED,
      operation: functionName,
      cause,
    });
  }

  /**
   * Create a permission denied error.
   */
  static permissionDenied(operation: string, cause?: Error): DatabaseError {
    return new DatabaseError({
      message: `Permission denied: ${operation}`,
      code: DatabaseErrorCodes.PERMISSION_DENIED,
      operation,
      cause,
    });
  }

  /**
   * Create a validation error.
   */
  static validationFailed(message: string, details?: Record<string, unknown>): DatabaseError {
    return new DatabaseError({
      message,
      code: DatabaseErrorCodes.VALIDATION_FAILED,
      details,
    });
  }
}

/**
 * Check if error code represents a recoverable error.
 */
function isRecoverable(code?: string): boolean {
  const nonRecoverableCodes = [
    DatabaseErrorCodes.NOT_FOUND,
    DatabaseErrorCodes.CONSTRAINT_VIOLATION,
    DatabaseErrorCodes.UNIQUE_VIOLATION,
    DatabaseErrorCodes.NOT_NULL_VIOLATION,
    DatabaseErrorCodes.CHECK_VIOLATION,
    DatabaseErrorCodes.PERMISSION_DENIED,
    DatabaseErrorCodes.VALIDATION_FAILED,
  ];

  return !code || !nonRecoverableCodes.includes(code as typeof nonRecoverableCodes[number]);
}

/**
 * Check if value is a DatabaseError.
 */
export function isDatabaseError(value: unknown): value is DatabaseError {
  return value instanceof DatabaseError;
}