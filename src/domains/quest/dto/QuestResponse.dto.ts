/**
 * Quest Response DTO
 *
 * Data transfer object for quest responses.
 */

import type { QuestCategory } from '../types/QuestCategory';
import type { QuestDifficulty } from '../types/QuestDifficulty';
import type { RepeatType } from '../types/RepeatType';
import type { QuestStatus } from '../types/QuestStatus';
import type { QuestMetadata, QuestRewardDefinition } from '../types/QuestMetadata';
import type { QuestObjectiveResponseDto } from './QuestObjective.dto';
import type { QuestProgressResponseDto } from './QuestProgress.dto';

/**
 * Response DTO for a quest.
 */
export interface QuestResponseDto {
  questId: string;
  slug: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  repeatType: RepeatType;
  requiredLevel: number;
  requiredResearch: string[];
  rewardDefinition: QuestRewardDefinition;
  isActive: boolean;
  metadata: QuestMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response DTO for a quest with player progress.
 */
export interface QuestWithProgressResponseDto extends QuestResponseDto {
  progress?: QuestProgressResponseDto;
  objectives?: QuestObjectiveResponseDto[];
  status?: QuestStatus;
  isAvailable?: boolean;
  isComplete?: boolean;
  canClaim?: boolean;
}

/**
 * Response DTO for quest list.
 */
export interface QuestListResponseDto {
  quests: QuestResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Response DTO for quest list with progress.
 */
export interface QuestListWithProgressResponseDto {
  quests: QuestWithProgressResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
