/**
 * Repository Error
 *
 * Error class for repository layer errors.
 */

import { DatabaseError, DatabaseErrorCodes } from './database.error';

/**
 * Repository error class.
 */
export class RepositoryError extends DatabaseError {
  public readonly entityType?: string;

  constructor(params: {
    message: string;
    code?: string;
    entityType?: string;
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
      table: params.table,
      constraint: params.constraint,
      operation: params.operation,
      details: params.details,
      context: params.context,
      cause: params.cause,
    });

    this.name = 'RepositoryError';
    this.entityType = params.entityType;
  }

  /**
   * Create an entity not found error.
   */
  static entityNotFound(entityType: string, id: string, table?: string): RepositoryError {
    return new RepositoryError({
      message: `${entityType} not found: ${id}`,
      code: DatabaseErrorCodes.NOT_FOUND,
      entityType,
      table,
      operation: 'SELECT',
      context: { entityType, entityId: id },
    });
  }

  /**
   * Create an entity already exists error.
   */
  static alreadyExists(
    entityType: string,
    field: string,
    value: unknown,
    table?: string
  ): RepositoryError {
    return new RepositoryError({
      message: `${entityType} already exists: ${field} = ${value}`,
      code: DatabaseErrorCodes.UNIQUE_VIOLATION,
      entityType,
      table,
      operation: 'INSERT',
      details: { field, value },
    });
  }

  /**
   * Create a create failed error.
   */
  static createFailed(entityType: string, cause?: Error): RepositoryError {
    return new RepositoryError({
      message: `Failed to create ${entityType}`,
      code: DatabaseErrorCodes.QUERY_FAILED,
      entityType,
      operation: 'INSERT',
      cause,
    });
  }

  /**
   * Create an update failed error.
   */
  static updateFailed(entityType: string, id: string, cause?: Error): RepositoryError {
    return new RepositoryError({
      message: `Failed to update ${entityType}: ${id}`,
      code: DatabaseErrorCodes.QUERY_FAILED,
      entityType,
      operation: 'UPDATE',
      cause,
      context: { entityId: id },
    });
  }

  /**
   * Create a delete failed error.
   */
  static deleteFailed(entityType: string, id: string, cause?: Error): RepositoryError {
    return new RepositoryError({
      message: `Failed to delete ${entityType}: ${id}`,
      code: DatabaseErrorCodes.QUERY_FAILED,
      entityType,
      operation: 'DELETE',
      cause,
      context: { entityId: id },
    });
  }
}

/**
 * Check if value is a RepositoryError.
 */
export function isRepositoryError(value: unknown): value is RepositoryError {
  return value instanceof RepositoryError;
}