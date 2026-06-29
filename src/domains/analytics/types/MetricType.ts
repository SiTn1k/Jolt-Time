/**
 * Metric Type
 *
 * Defines all supported metric types for analytics telemetry.
 */

/**
 * Supported metric types.
 */
export enum MetricType {
  // Numeric metrics
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',

  // Time-based metrics
  DURATION = 'duration',

  // Size metrics
  BYTES = 'bytes',
}

/**
 * Metric type units.
 */
export enum MetricUnit {
  // Numeric
  COUNT = 'count',
  PERCENT = 'percent',
  RATIO = 'ratio',

  // Time
  MILLISECONDS = 'ms',
  SECONDS = 's',
  MINUTES = 'min',
  HOURS = 'h',

  // Size
  BYTES = 'bytes',
  KILOBYTES = 'kb',
  MEGABYTES = 'mb',

  // Currency
  COINS = 'coins',
  GEMS = 'gems',

  // Gameplay
  LEVEL = 'level',
  XP = 'xp',
}

/**
 * Constraints for metric types.
 */
export const METRIC_CONSTRAINTS = {
  MAX_METRIC_NAME_LENGTH: 128,
  MAX_UNIT_LENGTH: 16,
  MAX_VALUE_PRECISION: 6,
} as const;
