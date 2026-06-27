/**
 * Player Profile Created Event
 *
 * Domain event emitted when a new player profile is created.
 */

import type { PlayerProfileId } from '../value-objects/PlayerProfileId';

/**
 * Event data for profile creation.
 */
export interface PlayerProfileCreatedEventData {
  /** Profile ID */
  profileId: string;

  /** User ID */
  userId: string;

  /** Nickname */
  nickname: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for profile creation.
 */
export interface PlayerProfileCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'PlayerProfileCreated';

  /** Event data */
  readonly data: PlayerProfileCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a PlayerProfileCreatedEvent.
 */
export function createPlayerProfileCreatedEvent(params: {
  profileId: PlayerProfileId;
  userId: string;
  nickname: string;
}): PlayerProfileCreatedEvent {
  return {
    eventType: 'PlayerProfileCreated',
    version: 1,
    data: {
      profileId: params.profileId.value,
      userId: params.userId,
      nickname: params.nickname,
      occurredAt: new Date(),
    },
  };
}