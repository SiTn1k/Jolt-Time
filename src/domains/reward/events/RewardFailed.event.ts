/**
 * RewardFailed Event
 *
 * Event fired when a reward request fails during processing.
 */

import type { RequestId } from '../value-objects/RequestId';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import type { RewardSource } from '../types/RewardSource';

/**
 * Event data for reward failed.
 */
export interface RewardFailedEventData {
  requestId: string;
  playerProfileId: string;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  errorMessage: string;
  errorCode?: string;
  timestamp: string;
}

/**
 * RewardFailed event class.
 */
export class RewardFailedEvent {
  public readonly eventType = 'RewardFailed';
  public readonly data: RewardFailedEventData;
  public readonly occurredAt: Date;

  constructor(data: RewardFailedEventData) {
    this.data = data;
    this.occurredAt = new Date();
  }
}

/**
 * Creates a RewardFailed event.
 */
export function createRewardFailedEvent(params: {
  requestId: RequestId;
  playerProfileId: PlayerProfileId;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  errorMessage: string;
  errorCode?: string;
}): RewardFailedEvent {
  return new RewardFailedEvent({
    requestId: params.requestId.value,
    playerProfileId: params.playerProfileId.value,
    sourceModule: params.sourceModule,
    sourceId: params.sourceId,
    packageId: params.packageId,
    errorMessage: params.errorMessage,
    errorCode: params.errorCode,
    timestamp: new Date().toISOString(),
  });
}