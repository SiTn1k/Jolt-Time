/**
 * Create Quest DTO
 *
 * Data transfer object for creating a new quest.
 */

import type { QuestCategory } from '../types/QuestCategory';
import type { QuestDifficulty } from '../types/QuestDifficulty';
import type { RepeatType } from '../types/RepeatType';
import type { QuestMetadata } from '../types/QuestMetadata';

/**
 * Input for creating a new quest.
 */
export interface CreateQuestDto {
  /** Unique slug identifier */
  slug: string;
  /** Quest title */
  title: string;
  /** Quest description */
  description: string;
  /** Quest category */
  category: QuestCategory;
  /** Quest difficulty */
  difficulty: QuestDifficulty;
  /** Repeat type */
  repeatType?: RepeatType;
  /** Required player level */
  requiredLevel?: number;
  /** Required research IDs */
  requiredResearch?: string[];
  /** Reward definition */
  rewardDefinition: QuestMetadata['rewardDefinition'];
  /** Is active */
  isActive?: boolean;
  /** Additional metadata */
  metadata?: QuestMetadata;
}

/**
 * Validation rules for CreateQuestDto.
 */
export const CREATE_QUEST_VALIDATION = {
  slug: {
    required: true,
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    message: 'Slug must be lowercase alphanumeric with hyphens',
  },
  title: {
    required: true,
    minLength: 1,
    maxLength: 200,
    message: 'Title must be between 1 and 200 characters',
  },
  description: {
    required: true,
    minLength: 1,
    maxLength: 2000,
    message: 'Description must be between 1 and 2000 characters',
  },
  category: {
    required: true,
    values: ['main', 'daily', 'weekly', 'achievement', 'event', 'era'],
    message: 'Category must be one of: main, daily, weekly, achievement, event, era',
  },
  difficulty: {
    required: true,
    values: ['easy', 'medium', 'hard', 'legendary'],
    message: 'Difficulty must be one of: easy, medium, hard, legendary',
  },
  requiredLevel: {
    required: false,
    min: 1,
    max: 100,
    message: 'Required level must be between 1 and 100',
  },
} as const;
