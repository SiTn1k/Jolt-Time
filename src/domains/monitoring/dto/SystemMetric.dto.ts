/**
 * SystemMetricDto
 *
 * Data Transfer Object for SystemMetric entities.
 */

/**
 * DTO for creating a new system metric.
 */
export interface CreateSystemMetricDto {
  metricName: string;
  metricValue: number;
  unit: string;
  metadata?: Record<string, unknown>;
}

/**
 * DTO for system metric response.
 */
export interface SystemMetricDto {
  metricId: string;
  metricName: string;
  metricValue: number;
  unit: string;
  recordedAt: string;
  metadata?: Record<string, unknown>;
}

/**
 * DTO for listing metrics with filters.
 */
export interface ListMetricsDto {
  page?: number;
  pageSize?: number;
  metricName?: string;
  minValue?: number;
  maxValue?: number;
  recordedAfter?: string;
  recordedBefore?: string;
}
