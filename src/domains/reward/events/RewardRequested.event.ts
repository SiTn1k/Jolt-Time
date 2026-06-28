/**
 * RewardRequested Event
 *
 * Event fired when a reward is requested.
 */

import type { RequestId } from '../value-objects/RequestId';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import type { RewardSource } from '../types/RewardSource';

/**
 * Event data for reward requested.
 */
export interface RewardRequestedEventData {
  requestId: string;
  playerProfileId: string;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  timestamp: string;
}

/**
 * RewardRequested event class.
 */
export class RewardRequestedEvent {
  public readonly eventType = 'RewardRequested';
  public readonly data: RewardRequestedEventData;
  public readonly occurredAt: Date;

  constructor(data: RewardRequestedEventData) {
    this.data = data;
    this.occurredAt = new Date();
  }
}

/**
 * Creates a RewardRequested event.
 */
export function createRewardRequestedEvent(params: {
  requestId: RequestId;
  playerProfileId: PlayerProfileId;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
}): RewardRequestedEvent {
  return new RewardRequestedEvent({
    requestId: params.requestId.value,
    playerProfileId: params.playerProfileId.value,
    sourceModule: params.sourceModule,
    sourceId: params.sourceId,
    packageId: params.packageId,
    timestamp: new Date().toISOString(),
  });
}