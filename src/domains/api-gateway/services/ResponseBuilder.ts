/**
 * Response Builder
 *
 * Builds structured HTTP responses for the API Gateway.
 * Supports JSON, error, success, and pagination response formats.
 *
 * IMPORTANT: Response Builder is a RESPONSE FORMATTING layer. It MUST NEVER:
 * - Execute gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 * - Execute any business logic
 */

import { ApiResponse } from '../entities/ApiResponse';
import type { ResponsePayload } from '../entities/ApiResponse';
import type { GatewayResponseDto, GatewayErrorDto, PaginatedGatewayResponseDto } from '../dto/GatewayResponse.dto';

/**
 * HTTP status code categories.
 */
export const HttpStatusCodes = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * ResponseBuilder class.
 * Builds structured HTTP responses.
 */
export class ResponseBuilder {
  /**
   * Creates a success response.
   */
  public success<T>(data: T, options?: SuccessResponseOptions): GatewayResponseDto<T> {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      ...options,
    };
  }

  /**
   * Creates an error response.
   */
  public error(error: ErrorResponseOptions): GatewayErrorDto {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Creates a validation error response.
   */
  public validationError(errors: ValidationErrorItem[]): GatewayErrorDto {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: { validationErrors: errors },
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Creates a not found error response.
   */
  public notFound(resource: string): GatewayErrorDto {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `${resource} not found`,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Creates an unauthorized error response.
   */
  public unauthorized(message = 'Authentication required'): GatewayErrorDto {
    return {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Creates a forbidden error response.
   */
  public forbidden(message = 'Access denied'): GatewayErrorDto {
    return {
      success: false,
      error: {
        code: 'FORBIDDEN',
        message,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Creates an internal server error response.
   */
  public internalError(message = 'Internal server error'): GatewayErrorDto {
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Creates a paginated success response.
   */
  public paginated<T>(result: PaginatedResult<T>): PaginatedGatewayResponseDto<T> {
    return {
      success: true,
      data: {
        items: result.items,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: Math.ceil(result.total / result.pageSize),
        hasNextPage: result.page * result.pageSize < result.total,
        hasPreviousPage: result.page > 1,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Creates a JSON response payload.
   */
  public json<T>(data: T, statusCode = HttpStatusCodes.OK): ApiResponse {
    return ApiResponse.create({
      requestId: '', // Will be set by caller
      statusCode,
      responseTime: 0, // Will be set by caller
      payload: this.success(data),
      metadata: {
        contentType: 'application/json', customFields: {},
      },
    });
  }

  /**
   * Creates an error API response.
   */
  public errorResponse(
    requestId: string,
    error: GatewayErrorDto,
    responseTime: number
  ): ApiResponse {
    return ApiResponse.create({
      requestId,
      statusCode: this.getStatusCodeFromError(error.error.code),
      responseTime,
      payload: error,
      metadata: {
        contentType: 'application/json', customFields: {},
      },
    });
  }

  /**
   * Creates a success API response.
   */
  public successResponse<T>(
    requestId: string,
    data: T,
    responseTime: number,
    statusCode = HttpStatusCodes.OK
  ): ApiResponse {
    return ApiResponse.create({
      requestId,
      statusCode,
      responseTime,
      payload: this.success(data),
      metadata: {
        contentType: 'application/json', customFields: {},
      },
    });
  }

  /**
   * Creates a paginated API response.
   */
  public paginatedResponse<T>(
    requestId: string,
    result: PaginatedResult<T>,
    responseTime: number
  ): ApiResponse {
    return ApiResponse.create({
      requestId,
      statusCode: HttpStatusCodes.OK,
      responseTime,
      payload: this.paginated(result),
      metadata: {
        contentType: 'application/json', customFields: {},
      },
    });
  }

  /**
   * Maps error codes to HTTP status codes.
   */
  private getStatusCodeFromError(code: string): number {
    const statusMap: Record<string, number> = {
      VALIDATION_ERROR: HttpStatusCodes.BAD_REQUEST,
      NOT_FOUND: HttpStatusCodes.NOT_FOUND,
      UNAUTHORIZED: HttpStatusCodes.UNAUTHORIZED,
      FORBIDDEN: HttpStatusCodes.FORBIDDEN,
      CONFLICT: HttpStatusCodes.CONFLICT,
      RATE_LIMIT_EXCEEDED: HttpStatusCodes.TOO_MANY_REQUESTS,
      INTERNAL_ERROR: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      SERVICE_UNAVAILABLE: HttpStatusCodes.SERVICE_UNAVAILABLE,
      GATEWAY_TIMEOUT: HttpStatusCodes.GATEWAY_TIMEOUT,
    };

    return statusMap[code] ?? HttpStatusCodes.INTERNAL_SERVER_ERROR;
  }
}

/**
 * Success response options.
 */
export interface SuccessResponseOptions {
  meta?: Record<string, unknown>;
}

/**
 * Error response options.
 */
export interface ErrorResponseOptions {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Validation error item.
 */
export interface ValidationErrorItem {
  field: string;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Paginated result type.
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Gateway error codes.
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  REPOSITORY_ERROR: 'REPOSITORY_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
