/**
 * Achievement Response DTO
 *
 * Data transfer objects for achievement responses.
 */

import type { AchievementCategory } from '../types/AchievementCategory';
import type { AchievementRarity } from '../types/AchievementRarity';
import type { AchievementMetadata } from '../types/AchievementMetadata';
import type { ConditionResponseDto } from './AchievementCondition.dto';
import type { ProgressResponseDto } from './AchievementProgress.dto';
import type { AchievementStatus } from '../types/AchievementStatus';

/**
 * Response DTO for an achievement.
 */
export interface AchievementResponseDto {
  achievementId: string;
  slug: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  icon: string;
  rewardDefinition: AchievementMetadata['rewardDefinition'];
  isHidden: boolean;
  isActive: boolean;
  metadata: AchievementMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response DTO for an achievement with player progress.
 */
export interface AchievementWithProgressResponseDto extends AchievementResponseDto {
  progress?: ProgressResponseDto;
  conditions?: ConditionResponseDto[];
  status?: AchievementStatus;
  completionPercentage?: number;
  isComplete?: boolean;
  canClaim?: boolean;
}

/**
 * Response DTO for achievement list.
 */
export interface AchievementListResponseDto {
  achievements: AchievementResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Response DTO for achievement list with progress.
 */
export interface AchievementListWithProgressResponseDto {
  achievements: AchievementWithProgressResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Response DTO for achievement statistics.
 */
export interface AchievementStatisticsResponseDto {
  totalUnlocked: number;
  totalClaimed: number;
  totalPoints: number;
  byCategory: Record<string, number>;
  byRarity: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  lastClaimedAt: string | null;
}
