/**
 * HardeningStatus Enum
 *
 * Status values for hardening rules and processes.
 */

/**
 * Possible statuses for a hardening rule.
 */
export enum HardeningStatus {
  /** Rule is pending implementation */
  PENDING = 'pending',
  /** Rule is being implemented */
  IN_PROGRESS = 'in_progress',
  /** Rule has been implemented and is active */
  ACTIVE = 'active',
  /** Rule has been disabled */
  DISABLED = 'disabled',
  /** Rule has been deprecated */
  DEPRECATED = 'deprecated',
}

/**
 * Display labels for hardening statuses.
 */
export const HARDENING_STATUS_DISPLAY: Record<HardeningStatus, string> = {
  [HardeningStatus.PENDING]: 'Pending',
  [HardeningStatus.IN_PROGRESS]: 'In Progress',
  [HardeningStatus.ACTIVE]: 'Active',
  [HardeningStatus.DISABLED]: 'Disabled',
  [HardeningStatus.DEPRECATED]: 'Deprecated',
};

/**
 * Checks if a status represents an active hardening rule.
 */
export function isActiveHardeningStatus(status: HardeningStatus): boolean {
  return status === HardeningStatus.ACTIVE;
}

/**
 * Checks if a status represents a completed hardening rule.
 */
export function isCompletedHardeningStatus(status: HardeningStatus): boolean {
  return status === HardeningStatus.DEPRECATED || status === HardeningStatus.DISABLED;
}
