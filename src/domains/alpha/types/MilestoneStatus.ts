/**
 * MilestoneStatus Type
 *
 * Defines the status of an alpha milestone.
 */

/**
 * Milestone status values.
 */
export enum MilestoneStatus {
  /** Milestone is planned */
  PLANNED = 'planned',
  /** Milestone is in development */
  IN_PROGRESS = 'in_progress',
  /** Milestone is completed */
  COMPLETED = 'completed',
  /** Milestone is delayed */
  DELAYED = 'delayed',
  /** Milestone is cancelled */
  CANCELLED = 'cancelled',
}

/**
 * Status display names.
 */
export const MILESTONE_STATUS_DISPLAY: Record<MilestoneStatus, string> = {
  [MilestoneStatus.PLANNED]: 'Planned',
  [MilestoneStatus.IN_PROGRESS]: 'In Progress',
  [MilestoneStatus.COMPLETED]: 'Completed',
  [MilestoneStatus.DELAYED]: 'Delayed',
  [MilestoneStatus.CANCELLED]: 'Cancelled',
};

/**
 * Checks if a status represents an active milestone.
 */
export function isActiveMilestoneStatus(status: MilestoneStatus): boolean {
  return status === MilestoneStatus.PLANNED || status === MilestoneStatus.IN_PROGRESS;
}

/**
 * Checks if a status represents a completed milestone.
 */
export function isCompletedMilestoneStatus(status: MilestoneStatus): boolean {
  return status === MilestoneStatus.COMPLETED;
}
