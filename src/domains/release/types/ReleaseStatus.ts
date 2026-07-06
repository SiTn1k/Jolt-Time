/**
 * ReleaseStatus Type
 *
 * Defines the status values for release candidates.
 */

/**
 * Release status values.
 */
export enum ReleaseStatus {
  /** Release is in draft state */
  DRAFT = 'draft',
  /** Release is pending approval */
  PENDING_APPROVAL = 'pending_approval',
  /** Release is approved */
  APPROVED = 'approved',
  /** Release is rejected */
  REJECTED = 'rejected',
  /** Release is published */
  PUBLISHED = 'published',
  /** Release is archived */
  ARCHIVED = 'archived',
}

/**
 * Status display names.
 */
export const RELEASE_STATUS_DISPLAY: Record<ReleaseStatus, string> = {
  [ReleaseStatus.DRAFT]: 'Draft',
  [ReleaseStatus.PENDING_APPROVAL]: 'Pending Approval',
  [ReleaseStatus.APPROVED]: 'Approved',
  [ReleaseStatus.REJECTED]: 'Rejected',
  [ReleaseStatus.PUBLISHED]: 'Published',
  [ReleaseStatus.ARCHIVED]: 'Archived',
};

/**
 * Checks if a status represents an active state.
 */
export function isActiveReleaseStatus(status: ReleaseStatus): boolean {
  return (
    status === ReleaseStatus.DRAFT ||
    status === ReleaseStatus.PENDING_APPROVAL ||
    status === ReleaseStatus.APPROVED
  );
}

/**
 * Checks if a status represents a terminal state.
 */
export function isTerminalReleaseStatus(status: ReleaseStatus): boolean {
  return status === ReleaseStatus.PUBLISHED || status === ReleaseStatus.ARCHIVED;
}
