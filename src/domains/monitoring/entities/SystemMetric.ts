/**
 * SystemMetric Entity
 *
 * Domain entity representing a system metric measurement.
 * This entity ONLY records metrics - it never modifies gameplay.
 *
 * SystemMetric Entity Responsibilities:
 * - Store metric measurements
 * - Track metric timing
 * - Provide immutable metric record
 *
 * SystemMetric Entity is NOT:
 * - A metric calculator
 * - A threshold monitor
 * - An alert generator
 */

import type { ISystemMetric } from '../interfaces/ISystemMetric';
import { MetricId } from '../value-objects/MetricId';
import { MetricUnit } from '../types/MetricUnit';
import { MonitoringMetadata, INITIAL_MONITORING_METADATA } from '../types/MonitoringMetadata';

/**
 * SystemMetric entity properties interface.
 */
export interface SystemMetricProps {
  metricId: MetricId;
  metricName: string;
  metricValue: number;
  unit: MetricUnit;
  recordedAt: Date;
  metadata?: MonitoringMetadata;
}

/**
 * Database record representation of SystemMetric.
 */
export interface SystemMetricRecord {
  metric_id: string;
  metric_name: string;
  metric_value: number;
  unit: string;
  recorded_at: string;
  metadata?: MonitoringMetadata;
}

/**
 * JSON serialization representation of SystemMetric.
 */
export interface SystemMetricJSON {
  metricId: string;
  metricName: string;
  metricValue: number;
  unit: MetricUnit;
  recordedAt: string;
  metadata: MonitoringMetadata;
}

/**
 * SystemMetric entity class.
 * Immutable domain entity representing a system metric.
 */
export class SystemMetric implements ISystemMetric {
  /** Unique metric identifier */
  public readonly metricId: MetricId;

  /** Metric name */
  public readonly metricName: string;

  /** Metric value */
  public readonly metricValue: number;

  /** Metric unit */
  public readonly unit: MetricUnit;

  /** Timestamp when metric was recorded */
  public readonly recordedAt: Date;

  /** Metric metadata */
  public readonly metadata: MonitoringMetadata;

  /**
   * Creates a new SystemMetric instance.
   * @param props SystemMetric properties
   */
  constructor(props: SystemMetricProps) {
    this.metricId = props.metricId;
    this.metricName = props.metricName;
    this.metricValue = props.metricValue;
    this.unit = props.unit;
    this.recordedAt = props.recordedAt;
    this.metadata = props.metadata ?? { ...INITIAL_MONITORING_METADATA };
  }

  /**
   * Creates a new SystemMetric for recording.
   * Factory method for new metric creation.
   */
  public static create(params: {
    metricId: MetricId;
    metricName: string;
    metricValue: number;
    unit: MetricUnit;
    metadata?: MonitoringMetadata;
  }): SystemMetric {
    return new SystemMetric({
      metricId: params.metricId,
      metricName: params.metricName,
      metricValue: params.metricValue,
      unit: params.unit,
      recordedAt: new Date(),
      metadata: params.metadata ?? { ...INITIAL_MONITORING_METADATA },
    });
  }

  /**
   * Creates a SystemMetric from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: SystemMetricRecord): SystemMetric {
    return new SystemMetric({
      metricId: MetricId.reconstruct(record.metric_id),
      metricName: record.metric_name,
      metricValue: record.metric_value,
      unit: record.unit as MetricUnit,
      recordedAt: new Date(record.recorded_at),
      metadata: record.metadata ?? { ...INITIAL_MONITORING_METADATA },
    });
  }

  /**
   * Serializes the SystemMetric to a plain object.
   */
  public toJSON(): SystemMetricJSON {
    return {
      metricId: this.metricId.value,
      metricName: this.metricName,
      metricValue: this.metricValue,
      unit: this.unit,
      recordedAt: this.recordedAt.toISOString(),
      metadata: this.metadata,
    };
  }
}
