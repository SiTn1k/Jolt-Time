/**
 * Achievement Claim Requested Event
 *
 * Domain event emitted when a player requests to claim an achievement reward.
 */

import type { AchievementCategory } from '../types/AchievementCategory';
import type { AchievementRarity } from '../types/AchievementRarity';

/**
 * Event data for achievement claim request.
 */
export interface AchievementClaimRequestedEventData {
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
  /** Points to be claimed */
  points: number;
  /** Claim request timestamp */
  requestedAt: Date;
  /** Event timestamp */
  occurredAt: Date;
}

/**
 * Domain event for achievement claim request.
 */
export interface AchievementClaimRequestedEvent {
  /** Event type identifier */
  readonly eventType: 'AchievementClaimRequested';
  /** Event data */
  readonly data: AchievementClaimRequestedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AchievementClaimRequestedEvent.
 */
export function createAchievementClaimRequestedEvent(params: {
  playerProfileId: string;
  achievementId: string;
  slug: string;
  title: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  requestedAt: Date;
}): AchievementClaimRequestedEvent {
  return {
    eventType: 'AchievementClaimRequested',
    version: 1,
    data: {
      playerProfileId: params.playerProfileId,
      achievementId: params.achievementId,
      slug: params.slug,
      title: params.title,
      category: params.category,
      rarity: params.rarity,
      points: params.points,
      requestedAt: params.requestedAt,
      occurredAt: new Date(),
    },
  };
}
