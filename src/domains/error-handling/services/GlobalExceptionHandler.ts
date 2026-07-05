/**
 * Global Exception Handler
 *
 * Central exception handler that routes all exceptions through ErrorHandlingService.
 * Supports Application Errors, Infrastructure Errors, Repository Errors,
 * Validation Errors, Authentication Errors, Authorization Errors, and Unknown Exceptions.
 *
 * IMPORTANT: Exception Handler NEVER modifies gameplay.
 * It ONLY captures, classifies, logs, reports, and returns standardized responses.
 */

import type { IErrorHandlingService } from './ErrorHandlingService';
import type { ErrorContext } from '../entities/ErrorContext';
import type { ErrorMetadata } from '../types/ErrorMetadata';
import type { ErrorResponseDto, ValidationErrorResponseDto } from '../dto/ErrorResponse.dto';
import { ErrorSeverity, ErrorCategoryType } from '../types';
import type { ILogger } from '../../../shared/types';
import { createLogger } from '../../../core/logging/logger.service';
import { ValidationError } from '../../../shared/errors/validation.error';
import { ApplicationError } from '../../../shared/errors/application.error';
import { BusinessError } from '../../../shared/errors/business.error';
import { RepositoryError } from '../../../shared/errors/repository.error';

/**
 * Exception handler response wrapper
 */
export interface ExceptionHandlerResponse {
  success: false;
  error: ErrorResponseDto | ValidationErrorResponseDto;
  httpStatus: number;
}

/**
 * Global Exception Handler for capturing and handling all exceptions.
 */
export class GlobalExceptionHandler {
  private readonly errorService: IErrorHandlingService;
  private readonly logger: ILogger;
  private currentContext?: ErrorContext;

  /**
   * Creates a new GlobalExceptionHandler instance.
   */
  constructor(errorService: IErrorHandlingService, logger?: ILogger) {
    this.errorService = errorService;
    this.logger = logger ?? createLogger('GlobalExceptionHandler');
  }

  /**
   * Sets the current error context for the request.
   */
  setContext(context: ErrorContext): void {
    this.currentContext = context;
  }

  /**
   * Clears the current error context.
   */
  clearContext(): void {
    this.currentContext = undefined;
  }

  /**
   * Handles an exception and returns a standardized response.
   * This is the main entry point for exception handling.
   */
  async handleException(
    error: Error,
    options?: {
      metadata?: ErrorMetadata;
      errorCode?: string;
      severity?: ErrorSeverity;
      category?: ErrorCategoryType;
    }
  ): Promise<ExceptionHandlerResponse> {
    const { metadata = {}, errorCode, severity, category } = options || {};

    // Enrich metadata with context if available
    const enrichedMetadata: ErrorMetadata = {
      ...metadata,
      ...(this.currentContext && { contextId: this.currentContext.contextId.value }),
    };

    try {
      // Capture the error in the system
      const capturedError = await this.errorService.captureError({
        error,
        errorCode: errorCode || this.generateErrorCode(error),
        category,
        severity,
        context: this.currentContext,
        metadata: enrichedMetadata,
      });

      // Build the HTTP response
      const httpStatus = this.determineHTTPStatus(error);
      const response = this.errorService.buildHTTPErrorResponse(error, httpStatus);
      response.errorId = capturedError.errorId.value;

      this.logger.info('Exception handled', {
        errorId: capturedError.errorId.value,
        errorCode: response.errorCode,
        httpStatus,
      });

      return {
        success: false,
        error: response,
        httpStatus,
      };
    } catch (handlerError) {
      // If handling itself fails, return a fallback response
      this.logger.error('Exception handler failed - returning fallback response', handlerError as Error);

      const fallbackResponse = this.errorService.buildHTTPErrorResponse(
        error,
        this.determineHTTPStatus(error)
      );

      return {
        success: false,
        error: fallbackResponse,
        httpStatus: this.determineHTTPStatus(error),
      };
    }
  }

  /**
   * Handles an error synchronously without capturing.
   * Used for middleware-style error handling.
   */
  handleSync(error: Error, options?: {
    metadata?: ErrorMetadata;
    errorCode?: string;
  }): ExceptionHandlerResponse {
    const { metadata = {}, errorCode } = options || {};

    const enrichedMetadata: ErrorMetadata = {
      ...metadata,
      ...(this.currentContext && { contextId: this.currentContext.contextId.value }),
    };

    const httpStatus = this.determineHTTPStatus(error);
    const response = this.errorService.buildHTTPErrorResponse(error, httpStatus);

    // Log the error
    this.logger.error('Unhandled exception', error, {
      errorCode: errorCode || response.errorCode,
      httpStatus,
      metadata: enrichedMetadata,
    });

    return {
      success: false,
      error: response,
      httpStatus,
    };
  }

  /**
   * Wraps an async function with exception handling.
   */
  async wrapAsync<T>(
    fn: () => Promise<T>,
    options?: {
      metadata?: ErrorMetadata;
      errorCode?: string;
    }
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      const response = await this.handleException(
        error as Error,
        options
      );
      throw this.createHandledError(response);
    }
  }

  /**
   * Wraps a sync function with exception handling.
   */
  wrapSync<T>(
    fn: () => T,
    options?: {
      metadata?: ErrorMetadata;
      errorCode?: string;
    }
  ): T {
    try {
      return fn();
    } catch (error) {
      const response = this.handleSync(error as Error, options);
      throw this.createHandledError(response);
    }
  }

  /**
   * Creates an error from a handled response.
   */
  private createHandledError(response: ExceptionHandlerResponse): Error {
    const error = new Error(response.error.message);
    error.name = 'HandledError';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).errorResponse = response.error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).httpStatus = response.httpStatus;
    return error;
  }

  /**
   * Determines the HTTP status code for an error.
   */
  private determineHTTPStatus(error: Error): number {
    // Validation errors -> 422
    if (error instanceof ValidationError) {
      return 422;
    }

    // Business errors (extends ApplicationError, so check before ApplicationError)
    if (error instanceof BusinessError) {
      switch (error.code) {
        case 'INSUFFICIENT_BALANCE':
        case 'NOT_ELIGIBLE':
        case 'COOLDOWN_ACTIVE':
        case 'MAX_LIMIT_REACHED':
        case 'REQUIREMENT_NOT_MET':
        case 'OPERATION_NOT_ALLOWED':
          return 400;
        case 'NOT_FOUND':
          return 404;
        case 'ALREADY_CLAIMED':
        case 'ALREADY_EXISTS':
        case 'CONFLICT':
          return 409;
        default:
          return 400;
      }
    }

    // Application errors - check for specific types
    if (error instanceof ApplicationError) {
      switch (error.code) {
        case 'UNAUTHORIZED':
        case 'AUTH_FAILED':
          return 401;
        case 'FORBIDDEN':
        case 'ACCESS_DENIED':
          return 403;
        case 'NOT_FOUND':
          return 404;
        case 'CONFLICT':
        case 'ALREADY_EXISTS':
          return 409;
        case 'RATE_LIMITED':
          return 429;
        default:
          return 500;
      }
    }

    // Repository errors -> 500
    if (error instanceof RepositoryError) {
      return 500;
    }

    // Check error name for common patterns
    const errorName = error.name?.toLowerCase() || '';
    const errorMessage = error.message?.toLowerCase() || '';

    if (errorName.includes('unauthorized') || errorMessage.includes('unauthorized')) {
      return 401;
    }

    if (errorName.includes('forbidden') || errorMessage.includes('forbidden')) {
      return 403;
    }

    if (errorName.includes('notfound') || errorName.includes('not_found') || errorMessage.includes('not found')) {
      return 404;
    }

    if (errorName.includes('conflict') || errorMessage.includes('conflict')) {
      return 409;
    }

    if (errorName.includes('validation') || errorMessage.includes('validation')) {
      return 422;
    }

    if (errorName.includes('ratelimit') || errorName.includes('rate_limit') || errorMessage.includes('rate limit')) {
      return 429;
    }

    // Default to 500
    return 500;
  }

  /**
   * Generates an error code from an error type.
   */
  private generateErrorCode(error: Error): string {
    const baseCode = error.constructor.name.replace('Error', '').toUpperCase();
    return `ERR_${baseCode}`;
  }
}

/**
 * Creates a GlobalExceptionHandler instance.
 */
export function createGlobalExceptionHandler(
  errorService: IErrorHandlingService,
  logger?: ILogger
): GlobalExceptionHandler {
  return new GlobalExceptionHandler(errorService, logger);
}
