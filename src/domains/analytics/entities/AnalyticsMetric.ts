/**
 * AnalyticsMetric Entity
 *
 * Domain entity representing an analytics metric measurement.
 * This entity ONLY records metrics - it never modifies gameplay.
 *
 * AnalyticsMetric Entity Responsibilities:
 * - Store metric measurements
 * - Track metric timing
 * - Provide immutable metric record
 *
 * AnalyticsMetric Entity is NOT:
 * - A metric calculator
 * - A threshold monitor
 * - An alert generator
 */

import type { IAnalyticsMetric } from '../interfaces/IAnalyticsMetric';
import { MetricId } from '../value-objects/MetricId';
import { MetricType, MetricUnit } from '../types/MetricType';
import { AnalyticsMetadata, INITIAL_ANALYTICS_METADATA } from '../types/AnalyticsMetadata';

/**
 * AnalyticsMetric entity class.
 * Immutable domain entity representing a telemetry metric.
 */
export class AnalyticsMetric implements IAnalyticsMetric {
  /** Unique metric identifier */
  public readonly metricId: MetricId;

  /** Metric name */
  public readonly metricName: string;

  /** Metric value */
  public readonly metricValue: number;

  /** Metric type */
  public readonly metricType: MetricType;

  /** Metric unit */
  public readonly metricUnit: MetricUnit;

  /** Timestamp when metric was recorded */
  public readonly recordedAt: Date;

  /** Metric metadata */
  public readonly metadata: AnalyticsMetadata;

  /**
   * Creates a new AnalyticsMetric instance.
   * @param props AnalyticsMetric properties
   */
  constructor(props: AnalyticsMetricProps) {
    this.metricId = props.metricId;
    this.metricName = props.metricName;
    this.metricValue = props.metricValue;
    this.metricType = props.metricType;
    this.metricUnit = props.metricUnit;
    this.recordedAt = props.recordedAt;
    this.metadata = props.metadata ?? { ...INITIAL_ANALYTICS_METADATA };
  }

  /**
   * Creates a new AnalyticsMetric for recording.
   * Factory method for new metric creation.
   */
  public static create(params: {
    metricId: MetricId;
    metricName: string;
    metricValue: number;
    metricType: MetricType;
    metricUnit: MetricUnit;
    metadata?: AnalyticsMetadata;
  }): AnalyticsMetric {
    return new AnalyticsMetric({
      metricId: params.metricId,
      metricName: params.metricName,
      metricValue: params.metricValue,
      metricType: params.metricType,
      metricUnit: params.metricUnit,
      recordedAt: new Date(),
      metadata: params.metadata ?? { ...INITIAL_ANALYTICS_METADATA },
    });
  }

  /**
   * Creates an AnalyticsMetric from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: AnalyticsMetricRecord): AnalyticsMetric {
    return new AnalyticsMetric({
      metricId: MetricId.reconstruct(record.metric_id),
      metricName: record.metric_name,
      metricValue: record.metric_value,
      metricType: record.metric_type as MetricType,
      metricUnit: record.metric_unit as MetricUnit,
      recordedAt: new Date(record.recorded_at),
      metadata: record.metadata ?? { ...INITIAL_ANALYTICS_METADATA },
    });
  }

  /**
   * Serializes the AnalyticsMetric to a plain object.
   */
  public toJSON(): AnalyticsMetricJSON {
    return {
      metricId: this.metricId.value,
      metricName: this.metricName,
      metricValue: this.metricValue,
      metricType: this.metricType,
      metricUnit: this.metricUnit,
      recordedAt: this.recordedAt.toISOString(),
      metadata: this.metadata,
    };
  }
}

/**
 * AnalyticsMetric properties interface for constructor.
 */
export interface AnalyticsMetricProps {
  metricId: MetricId;
  metricName: string;
  metricValue: number;
  metricType: MetricType;
  metricUnit: MetricUnit;
  recordedAt: Date;
  metadata?: AnalyticsMetadata;
}

/**
 * Database record representation of AnalyticsMetric.
 */
export interface AnalyticsMetricRecord {
  metric_id: string;
  metric_name: string;
  metric_value: number;
  metric_type: string;
  metric_unit: string;
  recorded_at: string;
  metadata?: AnalyticsMetadata;
}

/**
 * JSON serialization representation of AnalyticsMetric.
 */
export interface AnalyticsMetricJSON {
  metricId: string;
  metricName: string;
  metricValue: number;
  metricType: MetricType;
  metricUnit: MetricUnit;
  recordedAt: string;
  metadata: AnalyticsMetadata;
}
