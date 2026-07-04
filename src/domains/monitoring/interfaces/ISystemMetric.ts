/**
 * ISystemMetric Interface
 *
 * Interface defining the contract for SystemMetric entities.
 */

import type { MetricId } from '../value-objects/MetricId';
import type { MetricUnit } from '../types/MetricUnit';
import type { MonitoringMetadata } from '../types/MonitoringMetadata';

/**
 * System metric entity interface.
 * Defines the contract for system metric domain entities.
 */
export interface ISystemMetric {
  /** Unique metric identifier */
  readonly metricId: MetricId;

  /** Metric name */
  readonly metricName: string;

  /** Metric value */
  readonly metricValue: number;

  /** Metric unit */
  readonly unit: MetricUnit;

  /** Timestamp when metric was recorded */
  readonly recordedAt: Date;

  /** Metric metadata */
  readonly metadata: MonitoringMetadata;
}
