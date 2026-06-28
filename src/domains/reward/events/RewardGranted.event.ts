/**
 * RewardGranted Event
 *
 * Event fired when a reward is granted.
 */

import type { RequestId } from '../value-objects/RequestId';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import type { RewardSource } from '../types/RewardSource';
import type { RewardType } from '../types/RewardType';

/**
 * Event data for reward granted.
 */
export interface RewardGrantedEventData {
  requestId: string;
  playerProfileId: string;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  rewardTypes: RewardType[];
  totalValue: number;
  timestamp: string;
}

/**
 * RewardGranted event class.
 */
export class RewardGrantedEvent {
  public readonly eventType = 'RewardGranted';
  public readonly data: RewardGrantedEventData;
  public readonly occurredAt: Date;

  constructor(data: RewardGrantedEventData) {
    this.data = data;
    this.occurredAt = new Date();
  }
}

/**
 * Creates a RewardGranted event.
 */
export function createRewardGrantedEvent(params: {
  requestId: RequestId;
  playerProfileId: PlayerProfileId;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  rewardTypes: RewardType[];
  totalValue: number;
}): RewardGrantedEvent {
  return new RewardGrantedEvent({
    requestId: params.requestId.value,
    playerProfileId: params.playerProfileId.value,
    sourceModule: params.sourceModule,
    sourceId: params.sourceId,
    packageId: params.packageId,
    rewardTypes: params.rewardTypes,
    totalValue: params.totalValue,
    timestamp: new Date().toISOString(),
  });
}