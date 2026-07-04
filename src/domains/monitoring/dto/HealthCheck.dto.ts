/**
 * HealthCheckDto
 *
 * Data Transfer Object for HealthCheck entities.
 */

/**
 * DTO for creating a new health check.
 */
export interface CreateHealthCheckDto {
  serviceName: string;
  status: string;
  responseTime: number;
  details?: string;
  metadata?: Record<string, unknown>;
}

/**
 * DTO for health check response.
 */
export interface HealthCheckDto {
  healthCheckId: string;
  serviceName: string;
  status: string;
  checkedAt: string;
  responseTime: number;
  details?: string;
  metadata?: Record<string, unknown>;
}

/**
 * DTO for listing health checks with filters.
 */
export interface ListHealthChecksDto {
  page?: number;
  pageSize?: number;
  serviceName?: string;
  status?: string;
  checkedAfter?: string;
  checkedBefore?: string;
}
