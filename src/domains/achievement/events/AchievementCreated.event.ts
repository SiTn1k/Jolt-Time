/**
 * Achievement Created Event
 *
 * Domain event emitted when a new achievement is created.
 */

import type { AchievementCategory } from '../types/AchievementCategory';
import type { AchievementRarity } from '../types/AchievementRarity';

/**
 * Event data for achievement creation.
 */
export interface AchievementCreatedEventData {
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
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for achievement creation.
 */
export interface AchievementCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'AchievementCreated';
  /** Event data */
  readonly data: AchievementCreatedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AchievementCreatedEvent.
 */
export function createAchievementCreatedEvent(params: {
  achievementId: string;
  slug: string;
  title: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
}): AchievementCreatedEvent {
  return {
    eventType: 'AchievementCreated',
    version: 1,
    data: {
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
