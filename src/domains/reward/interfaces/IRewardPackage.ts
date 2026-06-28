/**
 * IRewardPackage Interface
 *
 * Interface defining the contract for RewardPackage entities.
 */

import type { PackageId } from '../value-objects/PackageId';
import type { RewardDefinition } from '../entities/RewardDefinition';
import type { RewardPackageMetadata } from '../types/RewardMetadata';

/**
 * RewardPackage interface.
 * All reward package implementations must adhere to this interface.
 */
export interface IRewardPackage {
  /** Unique package identifier */
  readonly packageId: PackageId;

  /** Display title */
  readonly title: string;

  /** Description of the package */
  readonly description: string;

  /** Rewards included in this package */
  readonly rewards: RewardDefinition[];

  /** Whether the package can be claimed multiple times */
  readonly isRepeatable: boolean;

  /** Additional metadata */
  readonly metadata: RewardPackageMetadata;

  /** Creation timestamp */
  readonly createdAt: Date;

  /** Last update timestamp */
  readonly updatedAt: Date;

  /** Number of rewards in the package */
  readonly rewardCount: number;

  /** Total value of all rewards */
  readonly totalValue: number;

  /** Check if package is empty */
  readonly isEmpty: boolean;
}