/**
 * Failure Handler
 *
 * Handles all failure scenarios in the API Gateway.
 * Provides structured error responses for unknown routes, validation errors,
 * internal errors, and repository failures.
 *
 * IMPORTANT: Failure Handler is an ERROR HANDLING layer. It MUST NEVER:
 * - Execute gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 * - Execute any business logic
 */

import type { ApiRequest } from '../entities/ApiRequest';
import { ApiResponse } from '../entities/ApiResponse';
import type { ILogger } from '../../../shared/types/interfaces';
import { ResponseBuilder, ErrorCodes, HttpStatusCodes } from './ResponseBuilder';
import { RepositoryError } from '../../../database/errors/repository.error';

/**
 * Failure context for error handling.
 */
export interface FailureContext {
  request: ApiRequest;
  requestId: string;
  responseTime: number;
}

/**
 * Failure type enumeration.
 */
export type FailureType =
  | 'UNKNOWN_ROUTE'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'REPOSITORY_ERROR'
  | 'METHOD_NOT_ALLOWED'
  | 'SERVICE_UNAVAILABLE';

/**
 * FailureHandler class.
 * Handles all failure scenarios with structured error responses.
 */
export class FailureHandler {
  private readonly _logger: ILogger;
  private readonly _responseBuilder: ResponseBuilder;

  /**
   * Creates a new FailureHandler.
   */
  constructor(logger?: ILogger) {
    this._logger = logger || this.createDefaultLogger();
    this._responseBuilder = new ResponseBuilder();
  }

  /**
   * Creates a default logger.
   */
  private createDefaultLogger(): ILogger {
    const { createLogger } = require('../../../core/logging/logger.service');
    return createLogger('FailureHandler');
  }

  /**
   * Handles an unknown route failure.
   */
  public handleUnknownRoute(context: FailureContext): ApiResponse {
    this._logger.warn('Unknown route accessed', {
      path: context.request.path,
      method: context.request.method,
      requestId: context.requestId,
    });

    const error = this._responseBuilder.error({
      code: ErrorCodes.ROUTE_NOT_FOUND,
      message: `Route ${context.request.method} ${context.request.path} not found`,
      details: {
        path: context.request.path,
        method: context.request.method,
        suggestion: 'Please check the URL or API documentation',
      },
    });

    return this.buildErrorResponse(context, error, HttpStatusCodes.NOT_FOUND);
  }

  /**
   * Handles a validation error failure.
   */
  public handleValidationError(
    context: FailureContext,
    errors: Array<{ field: string; code: string; message: string }>
  ): ApiResponse {
    this._logger.warn('Validation failed', {
      path: context.request.path,
      errors,
      requestId: context.requestId,
    });

    const error = this._responseBuilder.validationError(
      errors.map((e) => ({
        field: e.field,
        code: e.code,
        message: e.message,
      }))
    );

    return this.buildErrorResponse(context, error, HttpStatusCodes.BAD_REQUEST);
  }

  /**
   * Handles an internal error failure.
   */
  public handleInternalError(
    context: FailureContext,
    error: Error,
    includeStackTrace = false
  ): ApiResponse {
    this._logger.error('Internal error occurred', error, {
      path: context.request.path,
      requestId: context.requestId,
    });

    const errorResponse = this._responseBuilder.error({
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'An internal error occurred',
      details: includeStackTrace
        ? {
            stack: error.stack,
            name: error.name,
          }
        : undefined,
    });

    return this.buildErrorResponse(context, errorResponse, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  /**
   * Handles a repository failure.
   */
  public handleRepositoryError(context: FailureContext, error: RepositoryError): ApiResponse {
    this._logger.error('Repository error occurred', error, {
      path: context.request.path,
      requestId: context.requestId,
      operation: error.operation,
      table: error.table,
    });

    // Determine appropriate status code based on repository error
    let statusCode: number = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    let errorCode: string = ErrorCodes.REPOSITORY_ERROR;
    let message: string = 'Database operation failed';

    if (error.code === 'DB_NOT_FOUND') {
      statusCode = HttpStatusCodes.NOT_FOUND;
      errorCode = ErrorCodes.NOT_FOUND;
      message = 'Requested resource not found';
    } else if (error.code === 'DB_CONSTRAINT_VIOLATION') {
      statusCode = HttpStatusCodes.CONFLICT;
      message = 'Data constraint violation';
    } else if (error.code === 'DB_UNIQUE_VIOLATION') {
      statusCode = HttpStatusCodes.CONFLICT;
      message = 'Resource already exists';
    } else if (error.code === 'DB_PERMISSION_DENIED') {
      statusCode = HttpStatusCodes.FORBIDDEN;
      errorCode = ErrorCodes.FORBIDDEN;
      message = 'Permission denied';
    }

    const errorResponse = this._responseBuilder.error({
      code: errorCode,
      message,
      details: {
        operation: error.operation,
        table: error.table,
      },
    });

    return this.buildErrorResponse(context, errorResponse, statusCode);
  }

  /**
   * Handles method not allowed failure.
   */
  public handleMethodNotAllowed(
    context: FailureContext,
    allowedMethods: string[]
  ): ApiResponse {
    this._logger.warn('Method not allowed', {
      path: context.request.path,
      method: context.request.method,
      allowedMethods,
      requestId: context.requestId,
    });

    const error = this._responseBuilder.error({
      code: ErrorCodes.METHOD_NOT_ALLOWED,
      message: `Method ${context.request.method} is not allowed for this route`,
      details: {
        allowedMethods,
      },
    });

    return this.buildErrorResponse(context, error, HttpStatusCodes.METHOD_NOT_ALLOWED);
  }

  /**
   * Handles service unavailable failure.
   */
  public handleServiceUnavailable(
    context: FailureContext,
    service: string,
    retryAfter?: number
  ): ApiResponse {
    this._logger.error('Service unavailable', undefined, {
      path: context.request.path,
      service,
      requestId: context.requestId,
    });

    const error = this._responseBuilder.error({
      code: ErrorCodes.SERVICE_UNAVAILABLE,
      message: `Service ${service} is currently unavailable`,
      details: retryAfter
        ? {
            retryAfter,
            suggestion: `Please retry after ${retryAfter} seconds`,
          }
        : undefined,
    });

    return this.buildErrorResponse(context, error, HttpStatusCodes.SERVICE_UNAVAILABLE);
  }

  /**
   * Handles an unknown failure with a generic error.
   */
  public handleUnknownFailure(
    context: FailureContext,
    error: unknown,
    type: FailureType
  ): ApiResponse {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    this._logger.error(`Unknown failure: ${type}`, undefined, {
      path: context.request.path,
      requestId: context.requestId,
      type,
      error: errorMessage,
    });

    const errorResponse = this._responseBuilder.error({
      code: ErrorCodes.UNKNOWN_ERROR,
      message: 'An unexpected error occurred',
      details: {
        type,
        originalError: errorMessage,
      },
    });

    return this.buildErrorResponse(context, errorResponse, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  /**
   * Builds an error API response.
   */
  private buildErrorResponse(
    context: FailureContext,
    error: ReturnType<ResponseBuilder['error']>,
    statusCode: number
  ): ApiResponse {
    return ApiResponse.create({
      requestId: context.requestId,
      statusCode,
      responseTime: context.responseTime,
      payload: error,
      metadata: {
        contentType: 'application/json', customFields: {},
      },
    });
  }

  /**
   * Determines if an error is a repository error.
   */
  public isRepositoryError(error: unknown): error is RepositoryError {
    return error instanceof RepositoryError;
  }

  /**
   * Determines if an error is a validation error.
   */
  public isValidationError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'code' in error) {
      return (error as { code: string }).code === ErrorCodes.VALIDATION_ERROR;
    }
    return false;
  }
}
