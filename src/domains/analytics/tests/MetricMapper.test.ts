/**
 * MetricMapper Tests
 *
 * Unit tests for the MetricMapper.
 */

import { describe, it, expect } from 'vitest';
import { MetricMapper } from '../mappers/MetricMapper';
import { AnalyticsMetric } from '../entities/AnalyticsMetric';
import { MetricId } from '../value-objects/MetricId';
import { MetricType, MetricUnit } from '../types/MetricType';
import type { CreateAnalyticsMetricDto } from '../dto/AnalyticsMetric.dto';

describe('MetricMapper', () => {
  const TEST_METRIC_ID = '123e4567-e89b-42d3-a456-426614174000';

  const createTestMetric = (): AnalyticsMetric => {
    return AnalyticsMetric.create({
      metricId: MetricId.reconstruct(TEST_METRIC_ID),
      metricName: 'play_time',
      metricValue: 3600,
      metricType: MetricType.COUNTER,
      metricUnit: MetricUnit.SECONDS,
    });
  };

  describe('toResponse', () => {
    it('should convert metric to response DTO', () => {
      const metric = createTestMetric();
      const response = MetricMapper.toResponse(metric);

      expect(response.metricId).toBe(TEST_METRIC_ID);
      expect(response.metricName).toBe('play_time');
      expect(response.metricValue).toBe(3600);
      expect(response.metricType).toBe(MetricType.COUNTER);
      expect(response.metricUnit).toBe(MetricUnit.SECONDS);
      expect(response.recordedAt).toBeDefined();
    });
  });

  describe('toResponseList', () => {
    it('should convert array of metrics to response DTOs', () => {
      const metrics = [createTestMetric(), createTestMetric()];
      const responses = MetricMapper.toResponseList(metrics);

      expect(responses).toHaveLength(2);
      expect(responses[0].metricId).toBe(TEST_METRIC_ID);
      expect(responses[1].metricId).toBe(TEST_METRIC_ID);
    });
  });

  describe('fromCreateDto', () => {
    it('should convert DTO to entity input', () => {
      const dto: CreateAnalyticsMetricDto = {
        metricName: 'play_time',
        metricValue: 3600,
        metricType: MetricType.COUNTER,
        metricUnit: MetricUnit.SECONDS,
      };

      const input = MetricMapper.fromCreateDto(dto);

      expect(input.metricName).toBe('play_time');
      expect(input.metricValue).toBe(3600);
      expect(input.metricType).toBe(MetricType.COUNTER);
      expect(input.metricUnit).toBe(MetricUnit.SECONDS);
    });
  });

  describe('fromRecordToDto', () => {
    it('should convert database record to DTO', () => {
      const record = {
        metric_id: TEST_METRIC_ID,
        metric_name: 'play_time',
        metric_value: 3600,
        metric_type: MetricType.COUNTER,
        metric_unit: MetricUnit.SECONDS,
        recorded_at: new Date().toISOString(),
      };

      const dto = MetricMapper.fromRecordToDto(record);

      expect(dto.metricName).toBe('play_time');
      expect(dto.metricValue).toBe(3600);
      expect(dto.metricType).toBe(MetricType.COUNTER);
      expect(dto.metricUnit).toBe(MetricUnit.SECONDS);
    });
  });

  describe('toRecord', () => {
    it('should convert metric to database record format', () => {
      const metric = createTestMetric();
      const record = MetricMapper.toRecord(metric);

      expect(record.metric_id).toBe(TEST_METRIC_ID);
      expect(record.metric_name).toBe('play_time');
      expect(record.metric_value).toBe(3600);
      expect(record.metric_type).toBe(MetricType.COUNTER);
      expect(record.metric_unit).toBe(MetricUnit.SECONDS);
    });
  });
});
