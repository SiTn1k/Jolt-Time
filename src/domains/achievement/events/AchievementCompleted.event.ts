/**
 * Achievement Completed Event
 *
 * Domain event emitted when a player completes an achievement but hasn't claimed the reward.
 */

import type { AchievementCategory } from '../types/AchievementCategory';
import type { AchievementRarity } from '../types/AchievementRarity';

/**
 * Event data for achievement completion.
 */
export interface AchievementCompletedEventData {
  /** Player profile ID */
  playerProfileId: string;
  /** Achievement ID */
  achievementId: string;
  /** Achievement slug */
  slug: string;
  /** Achievement title */
  title: string;
  /** Achievement category */
  category: AchievementCategory;
  /** Achievement rarity */
  rarity: AchievementRarity;
  /** Points awarded */
  points: number;
  /** Completion timestamp */
  completedAt: Date;
  /** Event timestamp */
  occurredAt: Date;
}

/**
 * Domain event for achievement completion.
 */
export interface AchievementCompletedEvent {
  /** Event type identifier */
  readonly eventType: 'AchievementCompleted';
  /** Event data */
  readonly data: AchievementCompletedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AchievementCompletedEvent.
 */
export function createAchievementCompletedEvent(params: {
  playerProfileId: string;
  achievementId: string;
  slug: string;
  title: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  completedAt: Date;
}): AchievementCompletedEvent {
  return {
    eventType: 'AchievementCompleted',
    version: 1,
    data: {
      playerProfileId: params.playerProfileId,
      achievementId: params.achievementId,
      slug: params.slug,
      title: params.title,
      category: params.category,
      rarity: params.rarity,
      points: params.points,
      completedAt: params.completedAt,
      occurredAt: new Date(),
    },
  };
}
