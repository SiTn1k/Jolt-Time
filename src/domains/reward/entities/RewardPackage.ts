/**
 * RewardPackage Entity
 *
 * Domain entity representing a reward package.
 * A package contains multiple reward definitions.
 */

import type { IRewardPackage } from '../interfaces/IRewardPackage';
import { PackageId } from '../value-objects/PackageId';
import type { RewardDefinition } from './RewardDefinition';
import type { RewardPackageMetadata } from '../types/RewardMetadata';

/**
 * RewardPackage entity props for constructor.
 */
export interface RewardPackageProps {
  packageId: PackageId;
  title: string;
  description: string;
  rewards: RewardDefinition[];
  isRepeatable: boolean;
  metadata: RewardPackageMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of RewardPackage.
 */
export interface RewardPackageRecord {
  packageId: string;
  title: string;
  description: string;
  rewardIds: string[];
  rewards?: RewardDefinition[];
  isRepeatable: boolean;
  metadata: RewardPackageMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of RewardPackage.
 */
export interface RewardPackageJSON {
  packageId: string;
  title: string;
  description: string;
  rewardIds: string[];
  rewards: ReturnType<RewardDefinition['toJSON']>[];
  isRepeatable: boolean;
  metadata: RewardPackageMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * RewardPackage entity class.
 * Immutable domain entity representing a reward package.
 */
export class RewardPackage implements IRewardPackage {
  public readonly packageId: PackageId;
  public readonly title: string;
  public readonly description: string;
  public readonly rewards: RewardDefinition[];
  public readonly isRepeatable: boolean;
  public readonly metadata: RewardPackageMetadata;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new RewardPackage instance.
   */
  constructor(props: RewardPackageProps) {
    this.packageId = props.packageId;
    this.title = props.title;
    this.description = props.description;
    this.rewards = props.rewards;
    this.isRepeatable = props.isRepeatable;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new RewardPackage entity.
   */
  public static create(params: {
    packageId: PackageId;
    title: string;
    description: string;
    rewards: RewardDefinition[];
    isRepeatable?: boolean;
    metadata?: RewardPackageMetadata;
  }): RewardPackage {
    const now = new Date();

    return new RewardPackage({
      packageId: params.packageId,
      title: params.title,
      description: params.description,
      rewards: params.rewards,
      isRepeatable: params.isRepeatable ?? false,
      metadata: params.metadata ?? { tier: 'basic', isSurprise: false },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a RewardPackage from stored data.
   */
  public static fromStorage(record: RewardPackageRecord): RewardPackage {
    return new RewardPackage({
      packageId: PackageId.reconstruct(record.packageId),
      title: record.title,
      description: record.description,
      rewards: record.rewards ?? [],
      isRepeatable: record.isRepeatable,
      metadata: record.metadata,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Gets the count of rewards in this package.
   */
  public get rewardCount(): number {
    return this.rewards.length;
  }

  /**
   * Gets the total value of all rewards in this package.
   */
  public get totalValue(): number {
    return this.rewards.reduce((sum, reward) => sum + reward.rewardValue.amount, 0);
  }

  /**
   * Checks if the package is empty.
   */
  public get isEmpty(): boolean {
    return this.rewards.length === 0;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<RewardPackageProps, 'packageId' | 'createdAt'>>): RewardPackage {
    return new RewardPackage({
      packageId: this.packageId,
      title: params.title ?? this.title,
      description: params.description ?? this.description,
      rewards: params.rewards ?? this.rewards,
      isRepeatable: params.isRepeatable ?? this.isRepeatable,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the RewardPackage to a plain object.
   */
  public toJSON(): RewardPackageJSON {
    return {
      packageId: this.packageId.value,
      title: this.title,
      description: this.description,
      rewardIds: this.rewards.map(r => r.rewardId.value),
      rewards: this.rewards.map(r => r.toJSON()),
      isRepeatable: this.isRepeatable,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): RewardPackageRecord {
    return {
      packageId: this.packageId.value,
      title: this.title,
      description: this.description,
      rewardIds: this.rewards.map(r => r.rewardId.value),
      rewards: this.rewards,
      isRepeatable: this.isRepeatable,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}