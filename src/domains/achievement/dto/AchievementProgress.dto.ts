/**
 * Achievement Progress DTO
 *
 * Data transfer objects for achievement progress.
 */

import type { AchievementStatus } from '../types/AchievementStatus';

/**
 * Input for creating achievement progress.
 */
export interface CreateProgressDto {
  /** Player profile ID */
  playerProfileId: string;
  /** Achievement ID */
  achievementId: string;
  /** Initial progress value */
  initialValue?: number;
  /** Additional metadata */
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Response DTO for achievement progress.
 */
export interface ProgressResponseDto {
  progressId: string;
  playerProfileId: string;
  achievementId: string;
  status: AchievementStatus;
  currentValue: number;
  completedAt: string | null;
  claimedAt: string | null;
  metadata: Record<string, string | number | boolean>;
  startedAt: string;
  updatedAt: string;
}

/**
 * Response DTO for progress with percentage.
 */
export interface ProgressWithPercentageDto extends ProgressResponseDto {
  completionPercentage: number;
  targetValue: number;
  isComplete: boolean;
}
