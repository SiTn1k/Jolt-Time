/**
 * RewardDefinition Entity
 *
 * Domain entity representing a reward definition.
 * Defines what rewards can be distributed.
 */

import type { IRewardDefinition } from '../interfaces/IRewardDefinition';
import { RewardId } from '../value-objects/RewardId';
import { RewardSlug } from '../value-objects/RewardSlug';
import { RewardValue } from '../value-objects/RewardValue';
import type { RewardType } from '../types/RewardType';
import type { RewardTarget } from '../types/RewardTarget';
import type { RewardDefinitionMetadata } from '../types/RewardMetadata';

/**
 * RewardDefinition entity props for constructor.
 */
export interface RewardDefinitionProps {
  rewardId: RewardId;
  slug: RewardSlug;
  title: string;
  description: string;
  rewardType: RewardType;
  rewardValue: RewardValue;
  rewardTarget: RewardTarget;
  metadata: RewardDefinitionMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of RewardDefinition.
 */
export interface RewardDefinitionRecord {
  rewardId: string;
  slug: string;
  title: string;
  description: string;
  rewardType: RewardType;
  amount: number;
  rewardTarget: RewardTarget;
  metadata: RewardDefinitionMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of RewardDefinition.
 */
export interface RewardDefinitionJSON {
  rewardId: string;
  slug: string;
  title: string;
  description: string;
  rewardType: RewardType;
  amount: number;
  rewardTarget: RewardTarget;
  metadata: RewardDefinitionMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * RewardDefinition entity class.
 * Immutable domain entity representing a reward definition.
 */
export class RewardDefinition implements IRewardDefinition {
  public readonly rewardId: RewardId;
  public readonly slug: RewardSlug;
  public readonly title: string;
  public readonly description: string;
  public readonly rewardType: RewardType;
  public readonly rewardValue: RewardValue;
  public readonly rewardTarget: RewardTarget;
  public readonly metadata: RewardDefinitionMetadata;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new RewardDefinition instance.
   */
  constructor(props: RewardDefinitionProps) {
    this.rewardId = props.rewardId;
    this.slug = props.slug;
    this.title = props.title;
    this.description = props.description;
    this.rewardType = props.rewardType;
    this.rewardValue = props.rewardValue;
    this.rewardTarget = props.rewardTarget;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new RewardDefinition entity.
   */
  public static create(params: {
    rewardId: RewardId;
    slug: RewardSlug;
    title: string;
    description: string;
    rewardType: RewardType;
    amount: number;
    rewardTarget?: RewardTarget;
    metadata?: RewardDefinitionMetadata;
  }): RewardDefinition {
    const now = new Date();
    const rewardValue = RewardValue.create({ amount: params.amount, type: params.rewardType });

    return new RewardDefinition({
      rewardId: params.rewardId,
      slug: params.slug,
      title: params.title,
      description: params.description,
      rewardType: params.rewardType,
      rewardValue,
      rewardTarget: params.rewardTarget ?? { type: 'player' },
      metadata: params.metadata ?? { rarity: 'common', limited: false },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a RewardDefinition from stored data.
   */
  public static fromStorage(record: RewardDefinitionRecord): RewardDefinition {
    const rewardValue = RewardValue.reconstruct(record.amount, record.rewardType);

    return new RewardDefinition({
      rewardId: RewardId.reconstruct(record.rewardId),
      slug: RewardSlug.reconstruct(record.slug),
      title: record.title,
      description: record.description,
      rewardType: record.rewardType,
      rewardValue,
      rewardTarget: record.rewardTarget,
      metadata: record.metadata,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Checks if this is a limited reward.
   */
  public get isLimited(): boolean {
    return this.metadata.limited ?? false;
  }

  /**
   * Checks if this reward has expired.
   */
  public get isExpired(): boolean {
    if (!this.metadata.expiresAt) return false;
    return new Date(this.metadata.expiresAt) < new Date();
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<RewardDefinitionProps, 'rewardId' | 'createdAt'>>): RewardDefinition {
    return new RewardDefinition({
      rewardId: this.rewardId,
      slug: params.slug ?? this.slug,
      title: params.title ?? this.title,
      description: params.description ?? this.description,
      rewardType: params.rewardType ?? this.rewardType,
      rewardValue: params.rewardValue ?? this.rewardValue,
      rewardTarget: params.rewardTarget ?? this.rewardTarget,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the RewardDefinition to a plain object.
   */
  public toJSON(): RewardDefinitionJSON {
    return {
      rewardId: this.rewardId.value,
      slug: this.slug.value,
      title: this.title,
      description: this.description,
      rewardType: this.rewardType,
      amount: this.rewardValue.amount,
      rewardTarget: this.rewardTarget,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): RewardDefinitionRecord {
    return {
      rewardId: this.rewardId.value,
      slug: this.slug.value,
      title: this.title,
      description: this.description,
      rewardType: this.rewardType,
      amount: this.rewardValue.amount,
      rewardTarget: this.rewardTarget,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}