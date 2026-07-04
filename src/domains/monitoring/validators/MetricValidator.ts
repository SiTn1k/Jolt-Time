/**
 * MetricValidator
 *
 * Validates system metric data according to monitoring rules.
 */

import { MetricUnit, METRIC_UNIT_CONSTRAINTS } from '../types/MetricUnit';

/**
 * Result of metric validation.
 */
export interface MetricValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Constraints for metric names.
 */
const METRIC_NAME_CONSTRAINTS = {
  MAX_LENGTH: 100,
  MIN_LENGTH: 1,
} as const;

/**
 * Validator for system metrics.
 */
export class MetricValidator {
  /**
   * Validates a metric name.
   * @param metricName The metric name to validate
   * @returns Validation result with any error message
   */
  public static validateMetricName(metricName: string | null | undefined): MetricValidationResult {
    if (metricName === null || metricName === undefined) {
      return {
        isValid: false,
        error: 'Metric name is required',
      };
    }

    if (metricName.trim().length === 0) {
      return {
        isValid: false,
        error: 'Metric name cannot be empty',
      };
    }

    if (metricName.length > METRIC_NAME_CONSTRAINTS.MAX_LENGTH) {
      return {
        isValid: false,
        error: `Metric name must be at most ${METRIC_NAME_CONSTRAINTS.MAX_LENGTH} characters`,
      };
    }

    // Metric name should be alphanumeric with underscores, dots, and dashes
    const metricNamePattern = /^[a-zA-Z][a-zA-Z0-9_.-]*$/;
    if (!metricNamePattern.test(metricName)) {
      return {
        isValid: false,
        error: 'Metric name must start with a letter and contain only letters, numbers, underscores, dots, and dashes',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a metric value.
   * @param metricValue The metric value to validate
   * @returns Validation result with any error message
   */
  public static validateMetricValue(metricValue: number | null | undefined): MetricValidationResult {
    if (metricValue === null || metricValue === undefined) {
      return {
        isValid: false,
        error: 'Metric value is required',
      };
    }

    if (!Number.isFinite(metricValue)) {
      return {
        isValid: false,
        error: 'Metric value must be a finite number',
      };
    }

    if (Number.isNaN(metricValue)) {
      return {
        isValid: false,
        error: 'Metric value cannot be NaN',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a metric unit.
   * @param metricUnit The metric unit to validate
   * @returns Validation result with any error message
   */
  public static validateMetricUnit(metricUnit: string | null | undefined): MetricValidationResult {
    if (metricUnit === null || metricUnit === undefined) {
      return {
        isValid: false,
        error: 'Metric unit is required',
      };
    }

    const validUnits = Object.values(MetricUnit);
    if (!validUnits.includes(metricUnit as MetricUnit)) {
      return {
        isValid: false,
        error: `Invalid metric unit. Must be one of: ${validUnits.join(', ')}`,
      };
    }

    if (metricUnit.length > METRIC_UNIT_CONSTRAINTS.MAX_UNIT_LENGTH) {
      return {
        isValid: false,
        error: `Metric unit must be at most ${METRIC_UNIT_CONSTRAINTS.MAX_UNIT_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all metric fields together.
   * @param params Metric fields to validate
   * @returns Validation result with any error message
   */
  public static validateMetric(params: {
    metricName?: string;
    metricValue?: number;
    metricUnit?: string;
  }): MetricValidationResult {
    const nameResult = this.validateMetricName(params.metricName);
    if (!nameResult.isValid) return nameResult;

    const valueResult = this.validateMetricValue(params.metricValue);
    if (!valueResult.isValid) return valueResult;

    const unitResult = this.validateMetricUnit(params.metricUnit);
    if (!unitResult.isValid) return unitResult;

    return { isValid: true };
  }

  /**
   * Validates a metric and throws if invalid.
   * @param params Metric fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateMetricOrThrow(params: {
    metricName?: string;
    metricValue?: number;
    metricUnit?: string;
  }): void {
    const result = this.validateMetric(params);
    if (!result.isValid) {
      throw new Error(`Metric validation failed: ${result.error}`);
    }
  }
}
