/**
 * ChecklistStatus Type
 *
 * Defines the status values for release checklists.
 */

/**
 * Checklist status values.
 */
export enum ChecklistStatus {
  /** Checklist item is pending */
  PENDING = 'pending',
  /** Checklist item is in progress */
  IN_PROGRESS = 'in_progress',
  /** Checklist item is completed */
  COMPLETED = 'completed',
  /** Checklist item is blocked */
  BLOCKED = 'blocked',
  /** Checklist item is skipped */
  SKIPPED = 'skipped',
}

/**
 * Status display names.
 */
export const CHECKLIST_STATUS_DISPLAY: Record<ChecklistStatus, string> = {
  [ChecklistStatus.PENDING]: 'Pending',
  [ChecklistStatus.IN_PROGRESS]: 'In Progress',
  [ChecklistStatus.COMPLETED]: 'Completed',
  [ChecklistStatus.BLOCKED]: 'Blocked',
  [ChecklistStatus.SKIPPED]: 'Skipped',
};

/**
 * Checks if a status represents an active (non-terminal) state.
 */
export function isActiveChecklistStatus(status: ChecklistStatus): boolean {
  return status === ChecklistStatus.PENDING || status === ChecklistStatus.IN_PROGRESS;
}

/**
 * Checks if a status represents a completed (terminal) state.
 */
export function isCompletedChecklistStatus(status: ChecklistStatus): boolean {
  return status === ChecklistStatus.COMPLETED || status === ChecklistStatus.SKIPPED;
}
