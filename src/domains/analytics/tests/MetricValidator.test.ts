/**
 * MetricValidator Tests
 *
 * Unit tests for the MetricValidator.
 */

import { describe, it, expect } from 'vitest';
import { MetricValidator } from '../validators/MetricValidator';
import { MetricType, MetricUnit } from '../types/MetricType';

describe('MetricValidator', () => {
  describe('validateMetricName', () => {
    it('should return valid for a valid metric name', () => {
      const result = MetricValidator.validateMetricName('play_time.seconds');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for simple metric name', () => {
      const result = MetricValidator.validateMetricName('counter');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null metric name', () => {
      const result = MetricValidator.validateMetricName(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Metric name is required');
    });

    it('should return invalid for empty metric name', () => {
      const result = MetricValidator.validateMetricName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Metric name cannot be empty');
    });

    it('should return invalid for too long metric name', () => {
      const longName = 'a'.repeat(129);
      const result = MetricValidator.validateMetricName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at most 128 characters');
    });

    it('should return invalid for name starting with number', () => {
      const result = MetricValidator.validateMetricName('1metric');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must start with a letter');
    });

    it('should return invalid for name with special characters', () => {
      const result = MetricValidator.validateMetricName('metric-name');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('letters, numbers, underscores, and dots');
    });

    it('should return valid for name with underscores and dots', () => {
      const result = MetricValidator.validateMetricName('my_metric.name.value');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateMetricValue', () => {
    it('should return valid for a positive number', () => {
      const result = MetricValidator.validateMetricValue(100);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for zero', () => {
      const result = MetricValidator.validateMetricValue(0);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for negative number', () => {
      const result = MetricValidator.validateMetricValue(-50);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for decimal number', () => {
      const result = MetricValidator.validateMetricValue(99.99);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null value', () => {
      const result = MetricValidator.validateMetricValue(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Metric value is required');
    });

    it('should return invalid for undefined value', () => {
      const result = MetricValidator.validateMetricValue(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Metric value is required');
    });

    it('should return invalid for NaN', () => {
      const result = MetricValidator.validateMetricValue(NaN);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('finite');
    });

    it('should return invalid for Infinity', () => {
      const result = MetricValidator.validateMetricValue(Infinity);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Metric value must be a finite number');
    });
  });

  describe('validateMetricType', () => {
    it('should return valid for COUNTER type', () => {
      const result = MetricValidator.validateMetricType(MetricType.COUNTER);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for GAUGE type', () => {
      const result = MetricValidator.validateMetricType(MetricType.GAUGE);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for DURATION type', () => {
      const result = MetricValidator.validateMetricType(MetricType.DURATION);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null type', () => {
      const result = MetricValidator.validateMetricType(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Metric type is required');
    });

    it('should return invalid for unknown type', () => {
      const result = MetricValidator.validateMetricType('unknown_type');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid metric type');
    });
  });

  describe('validateMetricUnit', () => {
    it('should return valid for COUNT unit', () => {
      const result = MetricValidator.validateMetricUnit(MetricUnit.COUNT);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for MILLISECONDS unit', () => {
      const result = MetricValidator.validateMetricUnit(MetricUnit.MILLISECONDS);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for SECONDS unit', () => {
      const result = MetricValidator.validateMetricUnit(MetricUnit.SECONDS);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for PERCENT unit', () => {
      const result = MetricValidator.validateMetricUnit(MetricUnit.PERCENT);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null unit', () => {
      const result = MetricValidator.validateMetricUnit(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Metric unit is required');
    });

    it('should return invalid for unknown unit', () => {
      const result = MetricValidator.validateMetricUnit('unknown_unit');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid metric unit');
    });

    it('should return invalid for too long unit', () => {
      const longUnit = 'a'.repeat(17);
      const result = MetricValidator.validateMetricUnit(longUnit);
      expect(result.isValid).toBe(false);
      // Should be invalid because it's not in the enum, regardless of length
      expect(result.error).toContain('Invalid metric unit');
    });
  });

  describe('validateMetric', () => {
    it('should return valid for complete valid metric', () => {
      const result = MetricValidator.validateMetric({
        metricName: 'play_time',
        metricValue: 3600,
        metricType: MetricType.COUNTER,
        metricUnit: MetricUnit.SECONDS,
      });
      expect(result.isValid).toBe(true);
    });

    it('should return invalid if name is invalid', () => {
      const result = MetricValidator.validateMetric({
        metricName: '',
        metricValue: 3600,
        metricType: MetricType.COUNTER,
        metricUnit: MetricUnit.SECONDS,
      });
      expect(result.isValid).toBe(false);
    });

    it('should return invalid if value is invalid', () => {
      const result = MetricValidator.validateMetric({
        metricName: 'play_time',
        metricValue: NaN,
        metricType: MetricType.COUNTER,
        metricUnit: MetricUnit.SECONDS,
      });
      expect(result.isValid).toBe(false);
    });

    it('should return invalid if type is invalid', () => {
      const result = MetricValidator.validateMetric({
        metricName: 'play_time',
        metricValue: 3600,
        metricType: 'invalid',
        metricUnit: MetricUnit.SECONDS,
      });
      expect(result.isValid).toBe(false);
    });

    it('should return invalid if unit is invalid', () => {
      const result = MetricValidator.validateMetric({
        metricName: 'play_time',
        metricValue: 3600,
        metricType: MetricType.COUNTER,
        metricUnit: 'invalid',
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateMetricOrThrow', () => {
    it('should not throw for valid metric', () => {
      expect(() => {
        MetricValidator.validateMetricOrThrow({
          metricName: 'play_time',
          metricValue: 3600,
          metricType: MetricType.COUNTER,
          metricUnit: MetricUnit.SECONDS,
        });
      }).not.toThrow();
    });

    it('should throw for invalid metric', () => {
      expect(() => {
        MetricValidator.validateMetricOrThrow({
          metricName: '',
          metricValue: 3600,
          metricType: MetricType.COUNTER,
          metricUnit: MetricUnit.SECONDS,
        });
      }).toThrow('Metric validation failed');
    });
  });
});
