/**
 * RewardStarted Event
 *
 * Event fired when a reward request starts processing.
 */

import type { RequestId } from '../value-objects/RequestId';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import type { RewardSource } from '../types/RewardSource';

/**
 * Event data for reward started.
 */
export interface RewardStartedEventData {
  requestId: string;
  playerProfileId: string;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  timestamp: string;
}

/**
 * RewardStarted event class.
 */
export class RewardStartedEvent {
  public readonly eventType = 'RewardStarted';
  public readonly data: RewardStartedEventData;
  public readonly occurredAt: Date;

  constructor(data: RewardStartedEventData) {
    this.data = data;
    this.occurredAt = new Date();
  }
}

/**
 * Creates a RewardStarted event.
 */
export function createRewardStartedEvent(params: {
  requestId: RequestId;
  playerProfileId: PlayerProfileId;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
}): RewardStartedEvent {
  return new RewardStartedEvent({
    requestId: params.requestId.value,
    playerProfileId: params.playerProfileId.value,
    sourceModule: params.sourceModule,
    sourceId: params.sourceId,
    packageId: params.packageId,
    timestamp: new Date().toISOString(),
  });
}