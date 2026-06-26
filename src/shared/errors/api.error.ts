/**
 * API Error
 *
 * Error class for API communication errors.
 */

import { ApplicationError } from './application.error';
import { ErrorCategory, ErrorSeverity } from '../constants';
import { ApiErrorCodes } from '../types';

/**
 * API error for HTTP/API operation failures.
 */
export class ApiError extends ApplicationError {
  public readonly statusCode?: number;
  public readonly url?: string;
  public readonly method?: string;

  constructor(params: {
    message: string;
    code?: string;
    statusCode?: number;
    url?: string;
    method?: string;
    details?: Record<string, unknown>;
    context?: Record<string, unknown>;
    cause?: Error;
  }) {
    super({
      message: params.message,
      code: params.code || ApiErrorCodes.SERVER_ERROR,
      category: ErrorCategory.API,
      severity: determineSeverity(params.statusCode),
      details: params.details,
      recoverable: isRecoverable(params.statusCode),
      context: params.context as never,
      cause: params.cause,
    });
    this.name = 'ApiError';
    this.statusCode = params.statusCode;
    this.url = params.url;
    this.method = params.method;
  }

  /**
   * Create an unauthorized error.
   */
  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError({
      message,
      code: ApiErrorCodes.UNAUTHORIZED,
      statusCode: 401,
    });
  }

  /**
   * Create a forbidden error.
   */
  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError({
      message,
      code: ApiErrorCodes.FORBIDDEN,
      statusCode: 403,
    });
  }

  /**
   * Create a not found error.
   */
  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError({
      message,
      code: ApiErrorCodes.NOT_FOUND,
      statusCode: 404,
    });
  }

  /**
   * Create a rate limit error.
   */
  static rateLimited(retryAfterMs?: number): ApiError {
    return new ApiError({
      message: 'Rate limit exceeded',
      code: ApiErrorCodes.RATE_LIMITED,
      statusCode: 429,
      details: retryAfterMs ? { retryAfterMs } : undefined,
    });
  }

  /**
   * Create a timeout error.
   */
  static timeout(url?: string, method?: string): ApiError {
    return new ApiError({
      message: 'Request timed out',
      code: ApiErrorCodes.TIMEOUT,
      statusCode: 408,
      url,
      method,
    });
  }

  /**
   * Create a server error.
   */
  static serverError(message = 'Internal server error', cause?: Error): ApiError {
    return new ApiError({
      message,
      code: ApiErrorCodes.SERVER_ERROR,
      statusCode: 500,
      cause,
    });
  }

  /**
   * Create from fetch response.
   */
  static async fromResponse(response: Response, body?: unknown): Promise<ApiError> {
    let message = `HTTP ${response.status}: ${response.statusText}`;
    let details: Record<string, unknown> | undefined;

    if (body && typeof body === 'object' && 'message' in body) {
      message = String((body as { message: unknown }).message);
      details = body as Record<string, unknown>;
    }

    return new ApiError({
      message,
      statusCode: response.status,
      url: response.url,
      method: response.headers.get('method') || undefined,
      details,
    });
  }
}

/**
 * Determine severity based on status code.
 */
function determineSeverity(statusCode?: number): ErrorSeverity {
  if (!statusCode) return ErrorSeverity.HIGH;

  if (statusCode >= 500) return ErrorSeverity.HIGH;
  if (statusCode >= 400) return ErrorSeverity.MEDIUM;
  return ErrorSeverity.LOW;
}

/**
 * Check if error is recoverable based on status code.
 */
function isRecoverable(statusCode?: number): boolean {
  if (!statusCode) return true;
  if (statusCode >= 500) return true;
  if (statusCode === 408) return true;
  if (statusCode === 429) return true;
  return false;
}
