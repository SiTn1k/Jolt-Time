/**
 * Metric Mapper
 *
 * Maps between AnalyticsMetric entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { AnalyticsMetric } from '../entities/AnalyticsMetric';
import type { AnalyticsMetricRecord } from '../entities/AnalyticsMetric';
import type { CreateAnalyticsMetricDto, AnalyticsMetricResponseDto } from '../dto/AnalyticsMetric.dto';

/**
 * Mapper for converting between AnalyticsMetric entity and DTOs.
 */
export class MetricMapper {
  /**
   * Converts an AnalyticsMetric entity to AnalyticsMetricResponseDto.
   */
  public static toResponse(metric: AnalyticsMetric): AnalyticsMetricResponseDto {
    return {
      metricId: metric.metricId.value,
      metricName: metric.metricName,
      metricValue: metric.metricValue,
      metricType: metric.metricType,
      metricUnit: metric.metricUnit,
      recordedAt: metric.recordedAt.toISOString(),
      metadata: metric.metadata,
    };
  }

  /**
   * Converts an array of AnalyticsMetric entities to AnalyticsMetricResponseDto array.
   */
  public static toResponseList(metrics: AnalyticsMetric[]): AnalyticsMetricResponseDto[] {
    return metrics.map((metric) => this.toResponse(metric));
  }

  /**
   * Converts a CreateAnalyticsMetricDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateAnalyticsMetricDto): Omit<CreateAnalyticsMetricDto, never> {
    return {
      metricName: dto.metricName,
      metricValue: dto.metricValue,
      metricType: dto.metricType,
      metricUnit: dto.metricUnit,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateAnalyticsMetricDto format.
   */
  public static fromRecordToDto(record: AnalyticsMetricRecord): CreateAnalyticsMetricDto {
    return {
      metricName: record.metric_name,
      metricValue: record.metric_value,
      metricType: record.metric_type as CreateAnalyticsMetricDto['metricType'],
      metricUnit: record.metric_unit as CreateAnalyticsMetricDto['metricUnit'],
      metadata: record.metadata,
    };
  }

  /**
   * Converts an AnalyticsMetric entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(metric: AnalyticsMetric): Omit<AnalyticsMetricRecord, never> {
    return {
      metric_id: metric.metricId.value,
      metric_name: metric.metricName,
      metric_value: metric.metricValue,
      metric_type: metric.metricType,
      metric_unit: metric.metricUnit,
      recorded_at: metric.recordedAt.toISOString(),
      metadata: metric.metadata,
    };
  }
}
