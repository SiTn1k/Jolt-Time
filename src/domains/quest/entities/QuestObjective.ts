/**
 * QuestObjective Entity
 *
 * Domain entity representing a quest objective.
 * Objectives define what a player must accomplish to complete a quest.
 */

import type { IQuestObjective } from '../interfaces/IQuestObjective';
import { ObjectiveId } from '../value-objects/ObjectiveId';
import { QuestId } from '../value-objects/QuestId';
import type { ObjectiveType } from '../types/ObjectiveType';
import type { ProgressValue } from '../value-objects/ProgressValue';

/**
 * QuestObjective entity props for constructor.
 */
export interface QuestObjectiveProps {
  objectiveId: ObjectiveId;
  questId: QuestId;
  objectiveType: ObjectiveType;
  target: string | null;
  requiredValue: number;
  metadata: Record<string, string | number | boolean>;
  order: number;
}

/**
 * Database record representation of QuestObjective.
 */
export interface QuestObjectiveRecord {
  objectiveId: string;
  questId: string;
  objectiveType: ObjectiveType;
  target: string | null;
  requiredValue: number;
  metadata: Record<string, string | number | boolean>;
  order: number;
}

/**
 * JSON serialization representation of QuestObjective.
 */
export interface QuestObjectiveJSON {
  objectiveId: string;
  questId: string;
  objectiveType: ObjectiveType;
  target: string | null;
  requiredValue: number;
  metadata: Record<string, string | number | boolean>;
  order: number;
}

/**
 * QuestObjective entity class.
 * Immutable domain entity representing a quest objective.
 */
export class QuestObjective implements IQuestObjective {
  public readonly objectiveId: ObjectiveId;
  public readonly questId: QuestId;
  public readonly objectiveType: ObjectiveType;
  public readonly target: string | null;
  public readonly requiredValue: number;
  public readonly metadata: Record<string, string | number | boolean>;
  public readonly order: number;

  /**
   * Creates a new QuestObjective instance.
   */
  constructor(props: QuestObjectiveProps) {
    this.objectiveId = props.objectiveId;
    this.questId = props.questId;
    this.objectiveType = props.objectiveType;
    this.target = props.target;
    this.requiredValue = props.requiredValue;
    this.metadata = props.metadata;
    this.order = props.order;
  }

  /**
   * Creates a new QuestObjective entity.
   */
  public static create(params: {
    objectiveId: ObjectiveId;
    questId: QuestId;
    objectiveType: ObjectiveType;
    target?: string | null;
    requiredValue: number;
    metadata?: Record<string, string | number | boolean>;
    order?: number;
  }): QuestObjective {
    return new QuestObjective({
      objectiveId: params.objectiveId,
      questId: params.questId,
      objectiveType: params.objectiveType,
      target: params.target ?? null,
      requiredValue: params.requiredValue,
      metadata: params.metadata ?? {},
      order: params.order ?? 0,
    });
  }

  /**
   * Reconstructs a QuestObjective from stored data.
   */
  public static fromStorage(record: QuestObjectiveRecord): QuestObjective {
    return new QuestObjective({
      objectiveId: ObjectiveId.reconstruct(record.objectiveId),
      questId: QuestId.reconstruct(record.questId),
      objectiveType: record.objectiveType,
      target: record.target,
      requiredValue: record.requiredValue,
      metadata: record.metadata,
      order: record.order,
    });
  }

  /**
   * Checks if the objective requires a specific target.
   */
  public get hasTarget(): boolean {
    return this.target !== null && this.target !== undefined;
  }

  /**
   * Gets the progress required to complete this objective.
   */
  public get progressRequired(): number {
    return this.requiredValue;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<QuestObjectiveProps, 'objectiveId' | 'questId'>>): QuestObjective {
    return new QuestObjective({
      objectiveId: this.objectiveId,
      questId: this.questId,
      objectiveType: params.objectiveType ?? this.objectiveType,
      target: params.target ?? this.target,
      requiredValue: params.requiredValue ?? this.requiredValue,
      metadata: params.metadata ?? this.metadata,
      order: params.order ?? this.order,
    });
  }

  /**
   * Serializes the QuestObjective to a plain object.
   */
  public toJSON(): QuestObjectiveJSON {
    return {
      objectiveId: this.objectiveId.value,
      questId: this.questId.value,
      objectiveType: this.objectiveType,
      target: this.target,
      requiredValue: this.requiredValue,
      metadata: this.metadata,
      order: this.order,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): QuestObjectiveRecord {
    return {
      objectiveId: this.objectiveId.value,
      questId: this.questId.value,
      objectiveType: this.objectiveType,
      target: this.target,
      requiredValue: this.requiredValue,
      metadata: this.metadata,
      order: this.order,
    };
  }
}
