/**
 * Achievement Unlocked Event
 *
 * Domain event emitted when a player's progress on an achievement starts.
 */

import type { AchievementCategory } from '../types/AchievementCategory';
import type { AchievementRarity } from '../types/AchievementRarity';

/**
 * Event data for achievement unlock.
 */
export interface AchievementUnlockedEventData {
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
  /** Points available */
  points: number;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for achievement unlock.
 */
export interface AchievementUnlockedEvent {
  /** Event type identifier */
  readonly eventType: 'AchievementUnlocked';
  /** Event data */
  readonly data: AchievementUnlockedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AchievementUnlockedEvent.
 */
export function createAchievementUnlockedEvent(params: {
  playerProfileId: string;
  achievementId: string;
  slug: string;
  title: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
}): AchievementUnlockedEvent {
  return {
    eventType: 'AchievementUnlocked',
    version: 1,
    data: {
      playerProfileId: params.playerProfileId,
      achievementId: params.achievementId,
      slug: params.slug,
      title: params.title,
      category: params.category,
      rarity: params.rarity,
      points: params.points,
      occurredAt: new Date(),
    },
  };
}
