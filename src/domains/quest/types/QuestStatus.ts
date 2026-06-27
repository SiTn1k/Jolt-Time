/**
 * Quest Status Type
 *
 * Defines the status of a player's quest progress.
 */

/**
 * Quest status values.
 */
export enum QuestStatus {
  /** Quest is available but not started */
  AVAILABLE = 'available',
  /** Quest has been started by the player */
  IN_PROGRESS = 'in_progress',
  /** Quest objectives are complete, reward not claimed */
  COMPLETED = 'completed',
  /** Quest reward has been claimed */
  CLAIMED = 'claimed',
  /** Quest was abandoned or expired without completion */
  EXPIRED = 'expired',
  /** Quest is locked (requirements not met) */
  LOCKED = 'locked',
}

/**
 * Status display names.
 */
export const QUEST_STATUS_DISPLAY: Record<QuestStatus, string> = {
  [QuestStatus.AVAILABLE]: 'Available',
  [QuestStatus.IN_PROGRESS]: 'In Progress',
  [QuestStatus.COMPLETED]: 'Ready to Claim',
  [QuestStatus.CLAIMED]: 'Claimed',
  [QuestStatus.EXPIRED]: 'Expired',
  [QuestStatus.LOCKED]: 'Locked',
};

/**
 * Status colors for UI.
 */
export const QUEST_STATUS_COLORS: Record<QuestStatus, string> = {
  [QuestStatus.AVAILABLE]: '#6B7280',
  [QuestStatus.IN_PROGRESS]: '#3B82F6',
  [QuestStatus.COMPLETED]: '#22C55E',
  [QuestStatus.CLAIMED]: '#9CA3AF',
  [QuestStatus.EXPIRED]: '#EF4444',
  [QuestStatus.LOCKED]: '#6B7280',
};

/**
 * Checks if a status represents an active quest.
 */
export function isActiveStatus(status: QuestStatus): boolean {
  return status === QuestStatus.AVAILABLE || status === QuestStatus.IN_PROGRESS;
}

/**
 * Checks if a status represents a completed quest.
 */
export function isCompletedStatus(status: QuestStatus): boolean {
  return status === QuestStatus.COMPLETED || status === QuestStatus.CLAIMED;
}
