/**
 * Check Severity Type
 *
 * Defines the severity levels for QA checks.
 */

/**
 * Check severity enumeration.
 */
export enum CheckSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

/**
 * Constraints for check severity values.
 */
export const CHECK_SEVERITY_CONSTRAINTS = {
  VALID_SEVERITIES: Object.values(CheckSeverity) as string[],
  MAX_SEVERITY_LENGTH: 20,
} as const;
