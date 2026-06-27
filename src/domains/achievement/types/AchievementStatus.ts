/**
 * Achievement Status Type
 *
 * Defines the status of a player's achievement progress.
 */

/**
 * Achievement progress statuses.
 */
export enum AchievementStatus {
  /** Achievement not yet started */
  LOCKED = 'locked',
  /** Achievement in progress */
  IN_PROGRESS = 'in_progress',
  /** Achievement requirements met, reward not claimed */
  COMPLETED = 'completed',
  /** Achievement reward claimed */
  CLAIMED = 'claimed',
}

/**
 * Status display names.
 */
export const ACHIEVEMENT_STATUS_DISPLAY: Record<AchievementStatus, string> = {
  [AchievementStatus.LOCKED]: 'Locked',
  [AchievementStatus.IN_PROGRESS]: 'In Progress',
  [AchievementStatus.COMPLETED]: 'Ready to Claim',
  [AchievementStatus.CLAIMED]: 'Claimed',
};

/**
 * Status colors for UI.
 */
export const ACHIEVEMENT_STATUS_COLORS: Record<AchievementStatus, string> = {
  [AchievementStatus.LOCKED]: '#6B7280',
  [AchievementStatus.IN_PROGRESS]: '#3B82F6',
  [AchievementStatus.COMPLETED]: '#10B981',
  [AchievementStatus.CLAIMED]: '#8B5CF6',
};

/**
 * Checks if status represents an active achievement.
 */
export function isActiveStatus(status: AchievementStatus): boolean {
  return status === AchievementStatus.IN_PROGRESS;
}

/**
 * Checks if status represents a completed achievement.
 */
export function isCompletedStatus(status: AchievementStatus): boolean {
  return status === AchievementStatus.COMPLETED || status === AchievementStatus.CLAIMED;
}

/**
 * Checks if status represents a claimable achievement.
 */
export function isClaimableStatus(status: AchievementStatus): boolean {
  return status === AchievementStatus.COMPLETED;
}
