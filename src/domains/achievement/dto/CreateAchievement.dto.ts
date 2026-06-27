/**
 * Create Achievement DTO
 *
 * Data transfer object for creating a new achievement.
 */

import type { AchievementCategory } from '../types/AchievementCategory';
import type { AchievementRarity } from '../types/AchievementRarity';
import type { AchievementMetadata } from '../types/AchievementMetadata';

/**
 * Input for creating a new achievement.
 */
export interface CreateAchievementDto {
  /** Unique slug identifier */
  slug: string;
  /** Achievement title */
  title: string;
  /** Achievement description */
  description: string;
  /** Achievement category */
  category: AchievementCategory;
  /** Achievement rarity */
  rarity: AchievementRarity;
  /** Points awarded */
  points: number;
  /** Icon identifier */
  icon?: string;
  /** Reward definition */
  rewardDefinition: AchievementMetadata['rewardDefinition'];
  /** Is hidden from player view */
  isHidden?: boolean;
  /** Is active */
  isActive?: boolean;
  /** Additional metadata */
  metadata?: AchievementMetadata;
}

/**
 * Validation rules for CreateAchievementDto.
 */
export const CREATE_ACHIEVEMENT_VALIDATION = {
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
    values: ['combat', 'collection', 'exploration', 'social', 'economy', 'progression', 'temporal', 'special'],
    message: 'Category must be one of: combat, collection, exploration, social, economy, progression, temporal, special',
  },
  rarity: {
    required: true,
    values: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    message: 'Rarity must be one of: common, uncommon, rare, epic, legendary',
  },
  points: {
    required: true,
    min: 0,
    max: 10000,
    message: 'Points must be between 0 and 10000',
  },
} as const;
