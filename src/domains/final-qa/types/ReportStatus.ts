/**
 * Report Status Type
 *
 * Defines the possible statuses for a QA report.
 */

/**
 * Report status enumeration.
 */
export enum ReportStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Constraints for report status values.
 */
export const REPORT_STATUS_CONSTRAINTS = {
  VALID_STATUSES: Object.values(ReportStatus) as string[],
  MAX_STATUS_LENGTH: 20,
} as const;
