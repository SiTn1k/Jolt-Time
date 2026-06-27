/**
 * IAchievement Interface
 *
 * Interface for Achievement domain entity.
 */

import type { AchievementId } from '../value-objects/AchievementId';
import type { AchievementSlug } from '../value-objects/AchievementSlug';
import type { AchievementCategory } from '../types/AchievementCategory';
import type { AchievementRarity } from '../types/AchievementRarity';
import type { AchievementMetadata } from '../types/AchievementMetadata';

/**
 * Achievement entity interface.
 */
export interface IAchievement {
  /** Unique achievement identifier */
  readonly achievementId: AchievementId;
  /** URL-friendly identifier */
  readonly slug: AchievementSlug;
  /** Achievement title */
  readonly title: string;
  /** Achievement description */
  readonly description: string;
  /** Achievement category */
  readonly category: AchievementCategory;
  /** Achievement rarity */
  readonly rarity: AchievementRarity;
  /** Points awarded */
  readonly points: number;
  /** Icon identifier */
  readonly icon: string;
  /** Reward definition */
  readonly rewardDefinition: AchievementMetadata['rewardDefinition'];
  /** Is hidden from player view */
  readonly isHidden: boolean;
  /** Is active */
  readonly isActive: boolean;
  /** Additional metadata */
  readonly metadata: AchievementMetadata;
  /** Creation timestamp */
  readonly createdAt: Date;
  /** Last update timestamp */
  readonly updatedAt: Date;

  /**
   * Checks if the achievement is a special/limited achievement.
   */
  isSpecial: boolean;

  /**
   * Checks if the achievement is visible to players.
   */
  isVisible: boolean;
}
