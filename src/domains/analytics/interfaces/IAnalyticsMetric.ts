/**
 * Analytics Metric Interface
 *
 * Interface defining the contract for AnalyticsMetric entities.
 */

import type { MetricId } from '../value-objects/MetricId';
import type { MetricType } from '../types/MetricType';
import type { MetricUnit } from '../types/MetricType';
import type { AnalyticsMetadata } from '../types/AnalyticsMetadata';

/**
 * AnalyticsMetric interface.
 * Defines the contract for analytics metric entities.
 */
export interface IAnalyticsMetric {
  /** Unique metric identifier */
  readonly metricId: MetricId;

  /** Metric name */
  readonly metricName: string;

  /** Metric value */
  readonly metricValue: number;

  /** Metric type */
  readonly metricType: MetricType;

  /** Metric unit */
  readonly metricUnit: MetricUnit;

  /** Timestamp when metric was recorded */
  readonly recordedAt: Date;

  /** Metric metadata */
  readonly metadata: AnalyticsMetadata;
}
