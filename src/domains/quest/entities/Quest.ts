/**
 * Quest Entity
 *
 * Domain entity representing a quest definition.
 * Quest definitions are static and shared across all players.
 */

import type { IQuest } from '../interfaces/IQuest';
import { QuestId } from '../value-objects/QuestId';
import { QuestSlug } from '../value-objects/QuestSlug';
import { QuestCategory } from '../types/QuestCategory';
import { QuestDifficulty } from '../types/QuestDifficulty';
import { RepeatType } from '../types/RepeatType';
import type { QuestMetadata } from '../types/QuestMetadata';
import type { QuestObjective, QuestObjectiveProps, QuestObjectiveRecord, QuestObjectiveJSON } from './QuestObjective';

/**
 * Quest entity props for constructor.
 */
export interface QuestProps {
  questId: QuestId;
  slug: QuestSlug;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  repeatType: RepeatType;
  requiredLevel: number;
  requiredResearch: string[];
  rewardDefinition: QuestMetadata['rewardDefinition'];
  isActive: boolean;
  metadata: QuestMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of Quest.
 */
export interface QuestRecord {
  questId: string;
  slug: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  repeatType: RepeatType;
  requiredLevel: number;
  requiredResearch: string[];
  rewardDefinition: QuestMetadata['rewardDefinition'];
  isActive: boolean;
  metadata: QuestMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of Quest.
 */
export interface QuestJSON {
  questId: string;
  slug: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  repeatType: RepeatType;
  requiredLevel: number;
  requiredResearch: string[];
  rewardDefinition: QuestMetadata['rewardDefinition'];
  isActive: boolean;
  metadata: QuestMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Quest entity class.
 * Immutable domain entity representing a quest definition.
 */
export class Quest implements IQuest {
  public readonly questId: QuestId;
  public readonly slug: QuestSlug;
  public readonly title: string;
  public readonly description: string;
  public readonly category: QuestCategory;
  public readonly difficulty: QuestDifficulty;
  public readonly repeatType: RepeatType;
  public readonly requiredLevel: number;
  public readonly requiredResearch: string[];
  public readonly rewardDefinition: QuestMetadata['rewardDefinition'];
  public readonly isActive: boolean;
  public readonly metadata: QuestMetadata;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new Quest instance.
   */
  constructor(props: QuestProps) {
    this.questId = props.questId;
    this.slug = props.slug;
    this.title = props.title;
    this.description = props.description;
    this.category = props.category;
    this.difficulty = props.difficulty;
    this.repeatType = props.repeatType;
    this.requiredLevel = props.requiredLevel;
    this.requiredResearch = props.requiredResearch;
    this.rewardDefinition = props.rewardDefinition;
    this.isActive = props.isActive;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new Quest entity.
   */
  public static create(params: {
    questId: QuestId;
    slug: QuestSlug;
    title: string;
    description: string;
    category: QuestCategory;
    difficulty: QuestDifficulty;
    repeatType?: RepeatType;
    requiredLevel?: number;
    requiredResearch?: string[];
    rewardDefinition: QuestMetadata['rewardDefinition'];
    isActive?: boolean;
    metadata?: QuestMetadata;
  }): Quest {
    const now = new Date();
    const repeatType = params.repeatType ?? (params.category === QuestCategory.DAILY ? RepeatType.DAILY : params.category === QuestCategory.WEEKLY ? RepeatType.WEEKLY : RepeatType.NONE);

    return new Quest({
      questId: params.questId,
      slug: params.slug,
      title: params.title,
      description: params.description,
      category: params.category,
      difficulty: params.difficulty,
      repeatType,
      requiredLevel: params.requiredLevel ?? 1,
      requiredResearch: params.requiredResearch ?? [],
      rewardDefinition: params.rewardDefinition,
      isActive: params.isActive ?? true,
      metadata: params.metadata ?? {
        category: params.category,
        difficulty: params.difficulty,
        repeatType,
        rewardDefinition: params.rewardDefinition,
      },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a Quest from stored data.
   */
  public static fromStorage(record: QuestRecord): Quest {
    return new Quest({
      questId: QuestId.reconstruct(record.questId),
      slug: QuestSlug.reconstruct(record.slug),
      title: record.title,
      description: record.description,
      category: record.category,
      difficulty: record.difficulty,
      repeatType: record.repeatType,
      requiredLevel: record.requiredLevel,
      requiredResearch: record.requiredResearch,
      rewardDefinition: record.rewardDefinition,
      isActive: record.isActive,
      metadata: record.metadata,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Checks if the quest is a repeating quest.
   */
  public get isRepeating(): boolean {
    return this.repeatType !== 'none';
  }

  /**
   * Checks if the quest requires any prerequisites.
   */
  public get hasPrerequisites(): boolean {
    return this.requiredLevel > 1 || this.requiredResearch.length > 0;
  }

  /**
   * Checks if the quest is available for a player level.
   */
  public isAvailableForLevel(level: number): boolean {
    return level >= this.requiredLevel;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<QuestProps, 'questId' | 'createdAt'>>): Quest {
    return new Quest({
      questId: this.questId,
      slug: params.slug ?? this.slug,
      title: params.title ?? this.title,
      description: params.description ?? this.description,
      category: params.category ?? this.category,
      difficulty: params.difficulty ?? this.difficulty,
      repeatType: params.repeatType ?? this.repeatType,
      requiredLevel: params.requiredLevel ?? this.requiredLevel,
      requiredResearch: params.requiredResearch ?? this.requiredResearch,
      rewardDefinition: params.rewardDefinition ?? this.rewardDefinition,
      isActive: params.isActive ?? this.isActive,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the Quest to a plain object.
   */
  public toJSON(): QuestJSON {
    return {
      questId: this.questId.value,
      slug: this.slug.value,
      title: this.title,
      description: this.description,
      category: this.category,
      difficulty: this.difficulty,
      repeatType: this.repeatType,
      requiredLevel: this.requiredLevel,
      requiredResearch: this.requiredResearch,
      rewardDefinition: this.rewardDefinition,
      isActive: this.isActive,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): QuestRecord {
    return {
      questId: this.questId.value,
      slug: this.slug.value,
      title: this.title,
      description: this.description,
      category: this.category,
      difficulty: this.difficulty,
      repeatType: this.repeatType,
      requiredLevel: this.requiredLevel,
      requiredResearch: this.requiredResearch,
      rewardDefinition: this.rewardDefinition,
      isActive: this.isActive,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
