/**
 * MetricRecorded Event
 *
 * Domain event emitted when a system metric is recorded.
 */

import type { MetricId } from '../value-objects/MetricId';
import type { MetricUnit } from '../types/MetricUnit';

/**
 * Event data for metric recording.
 */
export interface MetricRecordedEventData {
  /** Metric ID */
  metricId: string;

  /** Metric name */
  metricName: string;

  /** Metric value */
  metricValue: number;

  /** Metric unit */
  unit: MetricUnit;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for metric recording.
 */
export interface MetricRecordedEvent {
  /** Event type identifier */
  readonly eventType: 'MetricRecorded';

  /** Event data */
  readonly data: MetricRecordedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a MetricRecordedEvent.
 */
export function createMetricRecordedEvent(params: {
  metricId: MetricId;
  metricName: string;
  metricValue: number;
  unit: MetricUnit;
}): MetricRecordedEvent {
  return {
    eventType: 'MetricRecorded',
    version: 1,
    data: {
      metricId: params.metricId.value,
      metricName: params.metricName,
      metricValue: params.metricValue,
      unit: params.unit,
      occurredAt: new Date(),
    },
  };
}
