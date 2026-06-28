/**
 * RewardExpired Event
 *
 * Event fired when a reward expires.
 */

import type { RequestId } from '../value-objects/RequestId';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import type { RewardSource } from '../types/RewardSource';

/**
 * Event data for reward expired.
 */
export interface RewardExpiredEventData {
  requestId: string;
  playerProfileId: string;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  expiredAt: string;
  timestamp: string;
}

/**
 * RewardExpired event class.
 */
export class RewardExpiredEvent {
  public readonly eventType = 'RewardExpired';
  public readonly data: RewardExpiredEventData;
  public readonly occurredAt: Date;

  constructor(data: RewardExpiredEventData) {
    this.data = data;
    this.occurredAt = new Date();
  }
}

/**
 * Creates a RewardExpired event.
 */
export function createRewardExpiredEvent(params: {
  requestId: RequestId;
  playerProfileId: PlayerProfileId;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  expiredAt: Date;
}): RewardExpiredEvent {
  return new RewardExpiredEvent({
    requestId: params.requestId.value,
    playerProfileId: params.playerProfileId.value,
    sourceModule: params.sourceModule,
    sourceId: params.sourceId,
    packageId: params.packageId,
    expiredAt: params.expiredAt.toISOString(),
    timestamp: new Date().toISOString(),
  });
}