/**
 * Issue Severity Type
 *
 * Defines the severity levels for stabilization issues.
 */

/**
 * Issue severity levels.
 */
export enum IssueSeverity {
  /** Critical issue requiring immediate attention */
  CRITICAL = 'critical',
  /** High severity issue */
  HIGH = 'high',
  /** Medium severity issue */
  MEDIUM = 'medium',
  /** Low severity issue */
  LOW = 'low',
  /** Informational issue */
  INFO = 'info',
}

/**
 * Constraints for issue severity.
 */
export const ISSUE_SEVERITY_CONSTRAINTS = {
  VALID_SEVERITIES: Object.values(IssueSeverity),
} as const;
