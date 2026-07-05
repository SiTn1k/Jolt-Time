/**
 * Gateway Response DTOs
 *
 * Generic response wrappers for gateway operations.
 */

/**
 * Generic success response wrapper.
 */
export interface GatewayResponseDto<T> {
  success: true;
  data: T;
  timestamp: string;
}

/**
 * Generic error response wrapper.
 */
export interface GatewayErrorDto {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

/**
 * Paginated response wrapper.
 */
export interface PaginatedGatewayResponseDto<T> {
  success: true;
  data: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  timestamp: string;
}

/**
 * Health check response.
 */
export interface GatewayHealthDto {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: boolean;
    cache: boolean;
    external: boolean;
  };
}

/**
 * Statistics response.
 */
export interface GatewayStatisticsDto {
  totalRequests: number;
  successfulRequests: number;
  clientErrors: number;
  serverErrors: number;
  averageResponseTime: number;
  requestsPerMinute: number;
  timestamp: string;
}
