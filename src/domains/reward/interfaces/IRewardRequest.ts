/**
 * IRewardRequest Interface
 *
 * Interface defining the contract for RewardRequest entities.
 */

import type { RequestId } from '../value-objects/RequestId';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import type { RewardStatus } from '../types/RewardStatus';
import type { RewardSource } from '../types/RewardSource';
import type { RewardRequestMetadata } from '../types/RewardMetadata';

/**
 * RewardRequest interface.
 * All reward request implementations must adhere to this interface.
 */
export interface IRewardRequest {
  /** Unique request identifier */
  readonly requestId: RequestId;

  /** Player profile ID */
  readonly playerProfileId: PlayerProfileId;

  /** Source module that requested the reward */
  readonly sourceModule: RewardSource;

  /** ID within the source module (e.g., quest ID) */
  readonly sourceId: string;

  /** Package ID being requested */
  readonly packageId: string;

  /** Current status of the request */
  readonly status: RewardStatus;

  /** When the request was made */
  readonly requestedAt: Date;

  /** When the request was processed (if applicable) */
  readonly processedAt?: Date;

  /** Additional metadata */
  readonly metadata: RewardRequestMetadata;

  /** Check if request is pending */
  readonly isPending: boolean;

  /** Check if request has been processed */
  readonly isProcessed: boolean;
}