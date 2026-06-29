/**
 * Configuration Type Enum
 *
 * Supported value types for configuration entries.
 */

export enum ConfigurationType {
  /** String value type */
  STRING = 'string',

  /** Number value type (integer or float) */
  NUMBER = 'number',

  /** Boolean value type */
  BOOLEAN = 'boolean',

  /** JSON object value type */
  JSON = 'json',

  /** Array value type */
  ARRAY = 'array',

  /** Duration value in milliseconds */
  DURATION = 'duration',

  /** Percentage value (0-100) */
  PERCENTAGE = 'percentage',
}
