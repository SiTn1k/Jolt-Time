/**
 * Analytics Metric DTO
 *
 * Data Transfer Object for analytics metric requests.
 */

import type { MetricType } from '../types/MetricType';
import type { MetricUnit } from '../types/MetricType';
import type { AnalyticsMetadata } from '../types/AnalyticsMetadata';

/**
 * DTO for creating a new analytics metric.
 */
export interface CreateAnalyticsMetricDto {
  /** Metric name */
  metricName: string;

  /** Metric value */
  metricValue: number;

  /** Metric type */
  metricType: MetricType;

  /** Metric unit */
  metricUnit: MetricUnit;

  /** Metric metadata */
  metadata?: AnalyticsMetadata;
}

/**
 * DTO for analytics metric response.
 */
export interface AnalyticsMetricResponseDto {
  /** Metric ID */
  metricId: string;

  /** Metric name */
  metricName: string;

  /** Metric value */
  metricValue: number;

  /** Metric type */
  metricType: MetricType;

  /** Metric unit */
  metricUnit: MetricUnit;

  /** Recording timestamp */
  recordedAt: string;

  /** Metric metadata */
  metadata: AnalyticsMetadata;
}
