/**
 * Issue Status Type
 *
 * Defines the status values for stabilization issues.
 */

/**
 * Issue status values.
 */
export enum IssueStatus {
  /** Issue has been detected but not yet reviewed */
  DETECTED = 'detected',
  /** Issue is being investigated */
  INVESTIGATING = 'investigating',
  /** Issue has been identified and logged */
  IDENTIFIED = 'identified',
  /** Fix for the issue is being implemented */
  IN_PROGRESS = 'in_progress',
  /** Issue has been resolved */
  RESOLVED = 'resolved',
  /** Issue has been verified as fixed */
  VERIFIED = 'verified',
  /** Issue was false positive or not reproducible */
  DISMISSED = 'dismissed',
}

/**
 * Constraints for issue status.
 */
export const ISSUE_STATUS_CONSTRAINTS = {
  VALID_STATUSES: Object.values(IssueStatus),
} as const;
