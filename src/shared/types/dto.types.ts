/**
 * DTO Types
 *
 * Data Transfer Object type definitions.
 */

/**
 * Base request DTO interface.
 */
export interface BaseRequest {
  timestamp?: number;
  requestId?: string;
}

/**
 * Base response DTO interface.
 */
export interface BaseResponse {
  timestamp: number;
  requestId?: string;
}

/**
 * API response wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorData;
  metadata?: ResponseMetadata;
}

/**
 * API error details.
 */
export interface ApiErrorData {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Response metadata.
 */
export interface ResponseMetadata {
  timestamp: number;
  requestId: string;
  version: string;
}

/**
 * RPC response wrapper.
 */
export interface RpcResponse<T> {
  data: T | null;
  error: RpcError | null;
}

/**
 * RPC error details.
 */
export interface RpcError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Create success API response helper.
 */
export function createSuccessResponse<T>(data: T, requestId?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      timestamp: Date.now(),
      requestId: requestId || generateRequestId(),
      version: '1.0',
    },
  };
}

/**
 * Create error API response helper.
 */
export function createErrorResponse<T>(error: ApiErrorData, requestId?: string): ApiResponse<T> {
  return {
    success: false,
    error,
    metadata: {
      timestamp: Date.now(),
      requestId: requestId || generateRequestId(),
      version: '1.0',
    },
  };
}

/**
 * Generate unique request ID.
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
