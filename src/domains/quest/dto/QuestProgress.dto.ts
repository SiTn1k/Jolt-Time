/**
 * Quest Progress DTO
 *
 * Data transfer object for quest progress.
 */

import type { QuestStatus } from '../types/QuestStatus';

/**
 * Input for updating quest progress.
 */
export interface QuestProgressDto {
  /** Player profile ID */
  playerProfileId: string;
  /** Quest ID */
  questId: string;
  /** Progress value */
  currentValue?: number;
  /** Additional metadata */
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Response DTO for quest progress.
 */
export interface QuestProgressResponseDto {
  progressId: string;
  playerProfileId: string;
  questId: string;
  status: QuestStatus;
  currentValue: number;
  requiredValue?: number;
  progress?: number;
  completedAt: string | null;
  claimedAt: string | null;
  startedAt: string;
  updatedAt: string;
  isClaimable?: boolean;
  metadata: Record<string, string | number | boolean>;
}
