/**
 * QA Status Type
 *
 * Defines the possible statuses for a QA check.
 */

/**
 * QA check status enumeration.
 */
export enum QAStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

/**
 * Constraints for QA status values.
 */
export const QA_STATUS_CONSTRAINTS = {
  VALID_STATUSES: Object.values(QAStatus) as string[],
  MAX_STATUS_LENGTH: 20,
} as const;
