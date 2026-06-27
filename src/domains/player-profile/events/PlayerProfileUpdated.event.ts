/**
 * Player Profile Updated Event
 *
 * Domain event emitted when a player profile is updated.
 */

import type { PlayerProfileId } from '../value-objects/PlayerProfileId';

/**
 * Event data for profile update.
 */
export interface PlayerProfileUpdatedEventData {
  /** Profile ID */
  profileId: string;

  /** User ID */
  userId: string;

  /** Updated nickname (if changed) */
  nickname?: string;

  /** Updated level (if changed) */
  level?: number;

  /** Updated experience (if changed) */
  experience?: number;

  /** Updated prestige (if changed) */
  prestige?: number;

  /** Fields that were updated */
  updatedFields: string[];

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for profile update.
 */
export interface PlayerProfileUpdatedEvent {
  /** Event type identifier */
  readonly eventType: 'PlayerProfileUpdated';

  /** Event data */
  readonly data: PlayerProfileUpdatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a PlayerProfileUpdatedEvent.
 */
export function createPlayerProfileUpdatedEvent(params: {
  profileId: PlayerProfileId;
  userId: string;
  updatedFields: string[];
  nickname?: string;
  level?: number;
  experience?: number;
  prestige?: number;
}): PlayerProfileUpdatedEvent {
  return {
    eventType: 'PlayerProfileUpdated',
    version: 1,
    data: {
      profileId: params.profileId.value,
      userId: params.userId,
      nickname: params.nickname,
      level: params.level,
      experience: params.experience,
      prestige: params.prestige,
      updatedFields: params.updatedFields,
      occurredAt: new Date(),
    },
  };
}