/**
 * Player Profile Reset Event
 *
 * Domain event emitted when a player profile is reset (prestige).
 */

import type { PlayerProfileId } from '../value-objects/PlayerProfileId';

/**
 * Event data for profile reset.
 */
export interface PlayerProfileResetEventData {
  /** Profile ID */
  profileId: string;

  /** User ID */
  userId: string;

  /** Previous prestige level */
  previousPrestige: number;

  /** New prestige level */
  newPrestige: number;

  /** Whether statistics were reset */
  statisticsReset: boolean;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for profile reset.
 */
export interface PlayerProfileResetEvent {
  /** Event type identifier */
  readonly eventType: 'PlayerProfileReset';

  /** Event data */
  readonly data: PlayerProfileResetEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a PlayerProfileResetEvent.
 */
export function createPlayerProfileResetEvent(params: {
  profileId: PlayerProfileId;
  userId: string;
  previousPrestige: number;
  newPrestige: number;
  statisticsReset: boolean;
}): PlayerProfileResetEvent {
  return {
    eventType: 'PlayerProfileReset',
    version: 1,
    data: {
      profileId: params.profileId.value,
      userId: params.userId,
      previousPrestige: params.previousPrestige,
      newPrestige: params.newPrestige,
      statisticsReset: params.statisticsReset,
      occurredAt: new Date(),
    },
  };
}