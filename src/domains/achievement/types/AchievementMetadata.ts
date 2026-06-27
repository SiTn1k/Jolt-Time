/**
 * Achievement Metadata Type
 *
 * Additional metadata for achievements.
 */

import type { AchievementCategory } from './AchievementCategory';
import type { AchievementRarity } from './AchievementRarity';
import type { ConditionType } from './ConditionType';

/**
 * Reward definition for achievement.
 */
export interface AchievementRewardDefinition {
  /** Points awarded */
  points: number;
  /** Optional bonus rewards */
  bonus?: {
    type: string;
    amount: number;
  }[];
}

/**
 * Achievement metadata.
 */
export interface AchievementMetadata {
  /** Achievement category */
  category: AchievementCategory;
  /** Achievement rarity */
  rarity: AchievementRarity;
  /** Associated event ID if special */
  eventId?: string;
  /** Display order */
  displayOrder?: number;
  /** Parent achievement ID for chained achievements */
  parentAchievementId?: string;
  /** Next achievement ID in chain */
  nextAchievementId?: string;
  /** Icon identifier */
  iconId?: string;
  /** Reward definition */
  rewardDefinition: AchievementRewardDefinition;
  /** Target value for progress tracking (default: 1) */
  targetValue?: number;
  /** Target category for filtering related events */
  targetCategory?: string;
  /** Target ID for specific item achievements */
  targetId?: string;
  /** Minimum amount required for currency-type achievements */
  minAmount?: number;
}

/**
 * Condition metadata.
 */
export interface ConditionMetadata {
  /** Condition type */
  conditionType: ConditionType;
  /** Target identifier if applicable */
  targetId?: string;
  /** Time window in seconds for time-based conditions */
  timeWindow?: number;
  /** Progress increment value */
  increment?: number;
}

/**
 * Creates default achievement metadata.
 */
export function createDefaultAchievementMetadata(
  category: AchievementCategory,
  rarity: AchievementRarity,
  rewardDefinition: AchievementRewardDefinition
): AchievementMetadata {
  return {
    category,
    rarity,
    rewardDefinition,
  };
}
