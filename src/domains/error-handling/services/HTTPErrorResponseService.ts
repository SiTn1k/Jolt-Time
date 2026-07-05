/**
 * HTTP Error Response Service
 *
 * Centralized HTTP error response handling for all error types.
 * Supports HTTP status codes: 400, 401, 403, 404, 409, 422, 429, 500, 503
 *
 * IMPORTANT: HTTP Error Response NEVER modifies gameplay.
 * It ONLY generates standardized error responses.
 */

import type { ErrorResponseDto, ValidationErrorResponseDto } from '../dto/ErrorResponse.dto';
import { ErrorSeverity, ErrorCategoryType } from '../types';
import type { ILogger } from '../../../shared/types';
import { createLogger } from '../../../core/logging/logger.service';
import { ValidationError } from '../../../shared/errors/validation.error';
import { ApplicationError } from '../../../shared/errors/application.error';
import { BusinessError } from '../../../shared/errors/business.error';
import { RepositoryError } from '../../../shared/errors/repository.error';

/**
 * HTTP Status codes supported
 */
export const HTTP_ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HTTPStatusCode = typeof HTTP_ERROR_CODES[keyof typeof HTTP_ERROR_CODES];

/**
 * Standard error response structure
 */
export interface HTTPErrorResult {
  statusCode: HTTPStatusCode;
  response: ErrorResponseDto | ValidationErrorResponseDto;
  isValidationError: boolean;
}

/**
 * HTTP Error Response Service
 */
export class HTTPErrorResponseService {
  private readonly logger: ILogger;
  private readonly isDevelopment: boolean;

  /**
   * Creates a new HTTPErrorResponseService instance.
   */
  constructor(logger?: ILogger) {
    this.logger = logger ?? createLogger('HTTPErrorResponseService');
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Creates a 400 Bad Request error response.
   */
  badRequest(message: string, details?: Record<string, unknown>): HTTPErrorResult {
    return this.createResponse(
      HTTP_ERROR_CODES.BAD_REQUEST,
      'BAD_REQUEST',
      ErrorCategoryType.Validation,
      ErrorSeverity.Error,
      message,
      details
    );
  }

  /**
   * Creates a 401 Unauthorized error response.
   */
  unauthorized(message = 'Authentication required', details?: Record<string, unknown>): HTTPErrorResult {
    return this.createResponse(
      HTTP_ERROR_CODES.UNAUTHORIZED,
      'UNAUTHORIZED',
      ErrorCategoryType.Security,
      ErrorSeverity.Warning,
      message,
      details
    );
  }

  /**
   * Creates a 403 Forbidden error response.
   */
  forbidden(message = 'Access denied', details?: Record<string, unknown>): HTTPErrorResult {
    return this.createResponse(
      HTTP_ERROR_CODES.FORBIDDEN,
      'FORBIDDEN',
      ErrorCategoryType.Security,
      ErrorSeverity.Warning,
      message,
      details
    );
  }

  /**
   * Creates a 404 Not Found error response.
   */
  notFound(resource: string, id?: string): HTTPErrorResult {
    const message = id ? `${resource} not found: ${id}` : `${resource} not found`;
    return this.createResponse(
      HTTP_ERROR_CODES.NOT_FOUND,
      'NOT_FOUND',
      ErrorCategoryType.Service,
      ErrorSeverity.Info,
      message,
      { resource, id }
    );
  }

  /**
   * Creates a 409 Conflict error response.
   */
  conflict(message: string, details?: Record<string, unknown>): HTTPErrorResult {
    return this.createResponse(
      HTTP_ERROR_CODES.CONFLICT,
      'CONFLICT',
      ErrorCategoryType.Service,
      ErrorSeverity.Warning,
      message,
      details
    );
  }

  /**
   * Creates a 422 Unprocessable Entity error response.
   */
  unprocessableEntity(message: string, details?: Record<string, unknown>): HTTPErrorResult {
    return this.createResponse(
      HTTP_ERROR_CODES.UNPROCESSABLE_ENTITY,
      'VALIDATION_ERROR',
      ErrorCategoryType.Validation,
      ErrorSeverity.Warning,
      message,
      details
    );
  }

  /**
   * Creates a 429 Too Many Requests error response.
   */
  tooManyRequests(retryAfterSeconds?: number): HTTPErrorResult {
    const message = retryAfterSeconds
      ? `Rate limit exceeded. Retry after ${retryAfterSeconds} seconds.`
      : 'Rate limit exceeded. Please try again later.';
    return this.createResponse(
      HTTP_ERROR_CODES.TOO_MANY_REQUESTS,
      'RATE_LIMITED',
      ErrorCategoryType.Service,
      ErrorSeverity.Warning,
      message,
      retryAfterSeconds ? { retryAfterSeconds } : undefined
    );
  }

  /**
   * Creates a 500 Internal Server Error response.
   */
  internalError(message = 'An unexpected error occurred', details?: Record<string, unknown>): HTTPErrorResult {
    return this.createResponse(
      HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR,
      'INTERNAL_ERROR',
      ErrorCategoryType.System,
      ErrorSeverity.Error,
      message,
      details
    );
  }

  /**
   * Creates a 503 Service Unavailable error response.
   */
  serviceUnavailable(message = 'Service temporarily unavailable', details?: Record<string, unknown>): HTTPErrorResult {
    return this.createResponse(
      HTTP_ERROR_CODES.SERVICE_UNAVAILABLE,
      'SERVICE_UNAVAILABLE',
      ErrorCategoryType.System,
      ErrorSeverity.Error,
      message,
      details
    );
  }

  /**
   * Converts an Error to an HTTP error response.
   */
  fromError(error: Error): HTTPErrorResult {
    // Check for specific error types - order matters! More specific types first
    if (error instanceof ValidationError) {
      return this.fromValidationError(error);
    }

    // More specific errors before their parent classes
    if (error instanceof RepositoryError) {
      return this.fromRepositoryError(error);
    }

    if (error instanceof BusinessError) {
      return this.fromBusinessError(error);
    }

    // Generic ApplicationError last (since specific ones extend it)
    if (error instanceof ApplicationError) {
      return this.fromApplicationError(error);
    }

    // Handle unknown errors
    return this.fromUnknownError(error);
  }

  /**
   * Converts a ValidationError to an HTTP error response.
   */
  fromValidationError(error: ValidationError): HTTPErrorResult {
    const response: ValidationErrorResponseDto = {
      errorCode: 'VALIDATION_ERROR',
      message: error.message,
      validationErrors: error.errors.map((e) => ({
        field: e.field || 'unknown',
        message: e.message,
        code: e.code || 'INVALID',
      })),
      timestamp: new Date().toISOString(),
    };

    return {
      statusCode: HTTP_ERROR_CODES.UNPROCESSABLE_ENTITY,
      response,
      isValidationError: true,
    };
  }

  /**
   * Converts an ApplicationError to an HTTP error response.
   */
  fromApplicationError(error: ApplicationError): HTTPErrorResult {
    const statusCode = this.mapSeverityToStatus(error.severity as unknown as ErrorSeverity);
    const category = this.mapCategoryToErrorCategory(error.category);

    const response: ErrorResponseDto = {
      errorCode: error.code,
      category,
      severity: this.mapSeverityToErrorSeverity(String(error.severity)) as unknown as ErrorSeverity,
      message: this.sanitizeMessage(error.message),
      details: this.isDevelopment ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      metadata: error.details,
      userAction: this.getUserAction(error.code),
    };

    return {
      statusCode,
      response,
      isValidationError: false,
    };
  }

  /**
   * Converts a BusinessError to an HTTP error response.
   */
  fromBusinessError(error: BusinessError): HTTPErrorResult {
    const statusCode = this.mapBusinessCodeToStatus(error.code);

    const response: ErrorResponseDto = {
      errorCode: error.code,
      category: ErrorCategoryType.Service,
      severity: ErrorSeverity.Warning,
      message: this.sanitizeMessage(error.message),
      details: this.isDevelopment ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      metadata: error.details,
      userAction: this.getUserAction(error.code),
    };

    return {
      statusCode,
      response,
      isValidationError: false,
    };
  }

  /**
   * Converts a RepositoryError to an HTTP error response.
   */
  fromRepositoryError(error: RepositoryError): HTTPErrorResult {
    const response: ErrorResponseDto = {
      errorCode: error.code,
      category: 'repository' as ErrorCategoryType,
      severity: ErrorSeverity.Error,
      message: this.sanitizeMessage(error.message),
      details: this.isDevelopment ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      metadata: {
        table: error.table,
        constraint: error.constraint,
        ...error.details,
      },
      userAction: 'Please contact support if the problem persists.',
    };

    return {
      statusCode: HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR,
      response,
      isValidationError: false,
    };
  }

  /**
   * Converts an unknown error to an HTTP error response.
   */
  fromUnknownError(error: Error): HTTPErrorResult {
    const errorMessage = error.message?.toLowerCase() || '';

    // Check for common patterns
    if (errorMessage.includes('unauthorized') || errorMessage.includes('auth')) {
      return this.unauthorized(error.message);
    }
    if (errorMessage.includes('forbidden') || errorMessage.includes('denied')) {
      return this.forbidden(error.message);
    }
    if (errorMessage.includes('not found') || errorMessage.includes('not_found')) {
      return this.notFound('Resource');
    }
    if (errorMessage.includes('validation')) {
      return this.unprocessableEntity(error.message);
    }
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
      return this.tooManyRequests();
    }

    // Default to internal error
    return this.internalError(this.isDevelopment ? error.message : 'An unexpected error occurred');
  }

  /**
   * Creates a generic error response.
   */
  private createResponse(
    statusCode: HTTPStatusCode,
    errorCode: string,
    category: ErrorCategoryType,
    severity: ErrorSeverity,
    message: string,
    details?: Record<string, unknown>
  ): HTTPErrorResult {
    const response: ErrorResponseDto = {
      errorCode,
      category,
      severity,
      message: this.sanitizeMessage(message),
      details: this.isDevelopment && details ? JSON.stringify(details) : undefined,
      timestamp: new Date().toISOString(),
      metadata: details,
      userAction: this.getUserAction(errorCode),
    };

    return {
      statusCode,
      response,
      isValidationError: false,
    };
  }

  /**
   * Maps error severity to HTTP status code.
   */
  private mapSeverityToStatus(severity: ErrorSeverity): HTTPStatusCode {
    switch (severity) {
      case ErrorSeverity.Info:
        return HTTP_ERROR_CODES.BAD_REQUEST;
      case ErrorSeverity.Warning:
        return HTTP_ERROR_CODES.BAD_REQUEST;
      case ErrorSeverity.Error:
        return HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR;
      case ErrorSeverity.Critical:
        return HTTP_ERROR_CODES.SERVICE_UNAVAILABLE;
      case ErrorSeverity.Fatal:
        return HTTP_ERROR_CODES.SERVICE_UNAVAILABLE;
      default:
        return HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Maps ApplicationError category to ErrorCategoryType.
   */
  private mapCategoryToErrorCategory(category: string): ErrorCategoryType {
    switch (category.toLowerCase()) {
      case 'ui':
        return ErrorCategoryType.UI;
      case 'validation':
        return ErrorCategoryType.Validation;
      case 'business':
        return ErrorCategoryType.Service;
      case 'service':
        return ErrorCategoryType.Service;
      case 'repository':
        return ErrorCategoryType.Repository;
      case 'api':
        return ErrorCategoryType.API;
      case 'database':
        return ErrorCategoryType.Database;
      case 'telegram':
        return ErrorCategoryType.Telegram;
      case 'external':
      case 'external_service':
        return ErrorCategoryType.ExternalService;
      case 'system':
        return ErrorCategoryType.System;
      case 'security':
        return ErrorCategoryType.Security;
      case 'configuration':
        return ErrorCategoryType.Configuration;
      case 'network':
        return ErrorCategoryType.Network;
      default:
        return ErrorCategoryType.System;
    }
  }

  /**
   * Maps error severity string to ErrorSeverity enum.
   */
  private mapSeverityToErrorSeverity(severity: string): ErrorSeverity {
    switch (severity.toLowerCase()) {
      case 'info':
        return ErrorSeverity.Info;
      case 'warning':
        return ErrorSeverity.Warning;
      case 'error':
        return ErrorSeverity.Error;
      case 'critical':
        return ErrorSeverity.Critical;
      case 'fatal':
        return ErrorSeverity.Fatal;
      default:
        return ErrorSeverity.Error;
    }
  }

  /**
   * Maps business error codes to HTTP status.
   */
  private mapBusinessCodeToStatus(code: string): HTTPStatusCode {
    switch (code) {
      case 'INSUFFICIENT_BALANCE':
      case 'NOT_ELIGIBLE':
      case 'COOLDOWN_ACTIVE':
      case 'MAX_LIMIT_REACHED':
      case 'REQUIREMENT_NOT_MET':
      case 'OPERATION_NOT_ALLOWED':
        return HTTP_ERROR_CODES.BAD_REQUEST;
      case 'NOT_FOUND':
        return HTTP_ERROR_CODES.NOT_FOUND;
      case 'ALREADY_CLAIMED':
      case 'ALREADY_EXISTS':
      case 'CONFLICT':
        return HTTP_ERROR_CODES.CONFLICT;
      default:
        return HTTP_ERROR_CODES.BAD_REQUEST;
    }
  }

  /**
   * Gets user action hint based on error code.
   */
  private getUserAction(code: string): string {
    switch (code) {
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again.';
      case 'UNAUTHORIZED':
        return 'Please log in and try again.';
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action.';
      case 'NOT_FOUND':
        return 'The requested resource could not be found.';
      case 'CONFLICT':
        return 'The operation could not be completed due to a conflict.';
      case 'RATE_LIMITED':
        return 'Please wait a moment and try again.';
      case 'INTERNAL_ERROR':
      default:
        return 'Please contact support if the problem persists.';
    }
  }

  /**
   * Sanitizes error messages to prevent information leakage.
   */
  private sanitizeMessage(message: string): string {
    if (!message) return 'An error occurred';

    // Remove potential sensitive data patterns
    const sensitivePatterns = [
      /Bearer\s+[^\s]+/gi,
      /password[=:]\s*[^\s]+/gi,
      /token[=:]\s*[^\s]+/gi,
      /api[_-]?key[=:]\s*[^\s]+/gi,
      /secret[=:]\s*[^\s]+/gi,
      /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}/g,
    ];

    let sanitized = message;
    for (const pattern of sensitivePatterns) {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }

    // Truncate if too long
    if (sanitized.length > 1024) {
      sanitized = sanitized.substring(0, 1021) + '...';
    }

    return sanitized;
  }
}

/**
 * Creates an HTTPErrorResponseService instance.
 */
export function createHTTPErrorResponseService(logger?: ILogger): HTTPErrorResponseService {
  return new HTTPErrorResponseService(logger);
}
