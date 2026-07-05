/**
 * Error Severity Types
 *
 * Defines all supported error severity levels in the system.
 * Error Handling Foundation ONLY stores errors - it never modifies gameplay.
 */

/**
 * Supported error severity levels.
 * Ordered from least to most severe.
 */
export enum ErrorSeverity {
  /** Informational message - no action required */
  Info = 'info',

  /** Warning condition - may require attention */
  Warning = 'warning',

  /** Error condition - something failed */
  Error = 'error',

  /** Critical condition - immediate attention required */
  Critical = 'critical',

  /** Fatal condition - system cannot continue */
  Fatal = 'fatal',
}

/**
 * Constraints for error severity levels.
 */
export const ERROR_SEVERITY_CONSTRAINTS = {
  MAX_SEVERITY_LENGTH: 16,
} as const;

/**
 * Error severity level rankings for comparison.
 */
export const ERROR_SEVERITY_RANK: Record<ErrorSeverity, number> = {
  [ErrorSeverity.Info]: 0,
  [ErrorSeverity.Warning]: 1,
  [ErrorSeverity.Error]: 2,
  [ErrorSeverity.Critical]: 3,
  [ErrorSeverity.Fatal]: 4,
} as const;
