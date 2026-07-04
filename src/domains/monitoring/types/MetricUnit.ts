/**
 * MetricUnit Type
 *
 * Type definitions for system metric units.
 */

/**
 * Units for system metrics.
 */
export enum MetricUnit {
  /** No unit (count) */
  NONE = 'none',
  /** Percentage (0-100) */
  PERCENT = 'percent',
  /** Milliseconds */
  MILLISECONDS = 'ms',
  /** Seconds */
  SECONDS = 's',
  /** Bytes */
  BYTES = 'bytes',
  /** Kilobytes */
  KILOBYTES = 'KB',
  /** Megabytes */
  MEGABYTES = 'MB',
  /** Gigabytes */
  GIGABYTES = 'GB',
  /** Requests per second */
  REQUESTS_PER_SECOND = 'req/s',
  /** Operations per second */
  OPERATIONS_PER_SECOND = 'ops/s',
  /** Count per second */
  COUNT_PER_SECOND = 'count/s',
  /** Temperature in Celsius */
  CELSIUS = '°C',
  /** Temperature in Fahrenheit */
  FAHRENHEIT = '°F',
}

/**
 * Metric unit constraints for validation.
 */
export const METRIC_UNIT_CONSTRAINTS = {
  /** Maximum length for custom unit string */
  MAX_UNIT_LENGTH: 20,
} as const;
