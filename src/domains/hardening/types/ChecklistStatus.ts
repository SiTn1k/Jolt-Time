/**
 * ChecklistStatus Enum
 *
 * Status values for hardening checklist items.
 */

/**
 * Possible statuses for a hardening checklist item.
 */
export enum ChecklistStatus {
  /** Checklist item is pending */
  PENDING = 'pending',
  /** Checklist item is in progress */
  IN_PROGRESS = 'in_progress',
  /** Checklist item has been completed */
  COMPLETED = 'completed',
  /** Checklist item is blocked */
  BLOCKED = 'blocked',
  /** Checklist item was skipped */
  SKIPPED = 'skipped',
}

/**
 * Display labels for checklist statuses.
 */
export const CHECKLIST_STATUS_DISPLAY: Record<ChecklistStatus, string> = {
  [ChecklistStatus.PENDING]: 'Pending',
  [ChecklistStatus.IN_PROGRESS]: 'In Progress',
  [ChecklistStatus.COMPLETED]: 'Completed',
  [ChecklistStatus.BLOCKED]: 'Blocked',
  [ChecklistStatus.SKIPPED]: 'Skipped',
};

/**
 * Checks if a status represents an active checklist item.
 */
export function isActiveChecklistStatus(status: ChecklistStatus): boolean {
  return status === ChecklistStatus.PENDING || status === ChecklistStatus.IN_PROGRESS;
}

/**
 * Checks if a status represents a completed checklist item.
 */
export function isCompletedChecklistStatus(status: ChecklistStatus): boolean {
  return status === ChecklistStatus.COMPLETED || status === ChecklistStatus.SKIPPED;
}
