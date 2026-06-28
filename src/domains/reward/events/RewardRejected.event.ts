/**
 * RewardRejected Event
 *
 * Event fired when a reward request is rejected.
 */

import type { RequestId } from '../value-objects/RequestId';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import type { RewardSource } from '../types/RewardSource';

/**
 * Event data for reward rejected.
 */
export interface RewardRejectedEventData {
  requestId: string;
  playerProfileId: string;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  reason: string;
  timestamp: string;
}

/**
 * RewardRejected event class.
 */
export class RewardRejectedEvent {
  public readonly eventType = 'RewardRejected';
  public readonly data: RewardRejectedEventData;
  public readonly occurredAt: Date;

  constructor(data: RewardRejectedEventData) {
    this.data = data;
    this.occurredAt = new Date();
  }
}

/**
 * Creates a RewardRejected event.
 */
export function createRewardRejectedEvent(params: {
  requestId: RequestId;
  playerProfileId: PlayerProfileId;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  reason: string;
}): RewardRejectedEvent {
  return new RewardRejectedEvent({
    requestId: params.requestId.value,
    playerProfileId: params.playerProfileId.value,
    sourceModule: params.sourceModule,
    sourceId: params.sourceId,
    packageId: params.packageId,
    reason: params.reason,
    timestamp: new Date().toISOString(),
  });
}