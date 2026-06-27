/**
 * AchievementCondition Entity
 *
 * Domain entity representing a condition for achievement completion.
 * Conditions define what a player must accomplish to unlock an achievement.
 */

import type { IAchievementCondition } from '../interfaces/IAchievementCondition';
import { ConditionId } from '../value-objects/ConditionId';
import { AchievementId } from '../value-objects/AchievementId';
import type { ConditionType } from '../types/ConditionType';
import type { ConditionMetadata } from '../types/AchievementMetadata';

/**
 * AchievementCondition entity props for constructor.
 */
export interface AchievementConditionProps {
  conditionId: ConditionId;
  achievementId: AchievementId;
  conditionType: ConditionType;
  target: string | null;
  requiredValue: number;
  metadata: ConditionMetadata;
  order: number;
}

/**
 * Database record representation of AchievementCondition.
 */
export interface AchievementConditionRecord {
  conditionId: string;
  achievementId: string;
  conditionType: ConditionType;
  target: string | null;
  requiredValue: number;
  metadata: ConditionMetadata;
  order: number;
}

/**
 * JSON serialization representation of AchievementCondition.
 */
export interface AchievementConditionJSON {
  conditionId: string;
  achievementId: string;
  conditionType: ConditionType;
  target: string | null;
  requiredValue: number;
  metadata: ConditionMetadata;
  order: number;
}

/**
 * AchievementCondition entity class.
 * Immutable domain entity representing an achievement condition.
 */
export class AchievementCondition implements IAchievementCondition {
  public readonly conditionId: ConditionId;
  public readonly achievementId: AchievementId;
  public readonly conditionType: ConditionType;
  public readonly target: string | null;
  public readonly requiredValue: number;
  public readonly metadata: ConditionMetadata;
  public readonly order: number;

  /**
   * Creates a new AchievementCondition instance.
   */
  constructor(props: AchievementConditionProps) {
    this.conditionId = props.conditionId;
    this.achievementId = props.achievementId;
    this.conditionType = props.conditionType;
    this.target = props.target;
    this.requiredValue = props.requiredValue;
    this.metadata = props.metadata;
    this.order = props.order;
  }

  /**
   * Creates a new AchievementCondition entity.
   */
  public static create(params: {
    conditionId: ConditionId;
    achievementId: AchievementId;
    conditionType: ConditionType;
    target?: string | null;
    requiredValue: number;
    metadata?: ConditionMetadata;
    order?: number;
  }): AchievementCondition {
    return new AchievementCondition({
      conditionId: params.conditionId,
      achievementId: params.achievementId,
      conditionType: params.conditionType,
      target: params.target ?? null,
      requiredValue: params.requiredValue,
      metadata: params.metadata ?? {
        conditionType: params.conditionType,
      },
      order: params.order ?? 0,
    });
  }

  /**
   * Reconstructs an AchievementCondition from stored data.
   */
  public static fromStorage(record: AchievementConditionRecord): AchievementCondition {
    return new AchievementCondition({
      conditionId: ConditionId.reconstruct(record.conditionId),
      achievementId: AchievementId.reconstruct(record.achievementId),
      conditionType: record.conditionType,
      target: record.target,
      requiredValue: record.requiredValue,
      metadata: record.metadata,
      order: record.order,
    });
  }

  /**
   * Checks if the condition requires a specific target.
   */
  public get hasTarget(): boolean {
    return this.target !== null && this.target !== undefined;
  }

  /**
   * Checks if the condition is count-based.
   */
  public get isCountBased(): boolean {
    return this.conditionType === 'count';
  }

  /**
   * Checks if the condition is time-based.
   */
  public get isTimeBased(): boolean {
    return this.conditionType === 'time' || this.conditionType === 'streak';
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<AchievementConditionProps, 'conditionId' | 'achievementId'>>): AchievementCondition {
    return new AchievementCondition({
      conditionId: this.conditionId,
      achievementId: this.achievementId,
      conditionType: params.conditionType ?? this.conditionType,
      target: params.target ?? this.target,
      requiredValue: params.requiredValue ?? this.requiredValue,
      metadata: params.metadata ?? this.metadata,
      order: params.order ?? this.order,
    });
  }

  /**
   * Serializes the AchievementCondition to a plain object.
   */
  public toJSON(): AchievementConditionJSON {
    return {
      conditionId: this.conditionId.value,
      achievementId: this.achievementId.value,
      conditionType: this.conditionType,
      target: this.target,
      requiredValue: this.requiredValue,
      metadata: this.metadata,
      order: this.order,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): AchievementConditionRecord {
    return {
      conditionId: this.conditionId.value,
      achievementId: this.achievementId.value,
      conditionType: this.conditionType,
      target: this.target,
      requiredValue: this.requiredValue,
      metadata: this.metadata,
      order: this.order,
    };
  }
}
