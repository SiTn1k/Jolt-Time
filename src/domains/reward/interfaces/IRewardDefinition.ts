/**
 * IRewardDefinition Interface
 *
 * Interface defining the contract for RewardDefinition entities.
 */

import type { RewardId } from '../value-objects/RewardId';
import type { RewardSlug } from '../value-objects/RewardSlug';
import type { RewardValue } from '../value-objects/RewardValue';
import type { RewardType } from '../types/RewardType';
import type { RewardTarget } from '../types/RewardTarget';
import type { RewardDefinitionMetadata } from '../types/RewardMetadata';

/**
 * RewardDefinition interface.
 * All reward definition implementations must adhere to this interface.
 */
export interface IRewardDefinition {
  /** Unique reward identifier */
  readonly rewardId: RewardId;

  /** URL-safe identifier */
  readonly slug: RewardSlug;

  /** Display title */
  readonly title: string;

  /** Description of the reward */
  readonly description: string;

  /** Type of reward */
  readonly rewardType: RewardType;

  /** Value/amount of the reward */
  readonly rewardValue: RewardValue;

  /** Target of the reward */
  readonly rewardTarget: RewardTarget;

  /** Additional metadata */
  readonly metadata: RewardDefinitionMetadata;

  /** Creation timestamp */
  readonly createdAt: Date;

  /** Last update timestamp */
  readonly updatedAt: Date;

  /** Check if reward is limited edition */
  readonly isLimited: boolean;

  /** Check if reward has expired */
  readonly isExpired: boolean;
}