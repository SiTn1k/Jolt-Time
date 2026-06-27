/**
 * Achievement Entity
 *
 * Domain entity representing an achievement definition.
 * Achievement definitions are static and shared across all players.
 */

import type { IAchievement } from '../interfaces/IAchievement';
import { AchievementId } from '../value-objects/AchievementId';
import { AchievementSlug } from '../value-objects/AchievementSlug';
import { AchievementPoints } from '../value-objects/AchievementPoints';
import type { AchievementCategory } from '../types/AchievementCategory';
import type { AchievementRarity } from '../types/AchievementRarity';
import type { AchievementMetadata } from '../types/AchievementMetadata';

/**
 * Achievement entity props for constructor.
 */
export interface AchievementProps {
  achievementId: AchievementId;
  slug: AchievementSlug;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  icon: string;
  rewardDefinition: AchievementMetadata['rewardDefinition'];
  isHidden: boolean;
  isActive: boolean;
  metadata: AchievementMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of Achievement.
 */
export interface AchievementRecord {
  achievementId: string;
  slug: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  icon: string;
  rewardDefinition: AchievementMetadata['rewardDefinition'];
  isHidden: boolean;
  isActive: boolean;
  metadata: AchievementMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of Achievement.
 */
export interface AchievementJSON {
  achievementId: string;
  slug: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  icon: string;
  rewardDefinition: AchievementMetadata['rewardDefinition'];
  isHidden: boolean;
  isActive: boolean;
  metadata: AchievementMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Achievement entity class.
 * Immutable domain entity representing an achievement definition.
 */
export class Achievement implements IAchievement {
  public readonly achievementId: AchievementId;
  public readonly slug: AchievementSlug;
  public readonly title: string;
  public readonly description: string;
  public readonly category: AchievementCategory;
  public readonly rarity: AchievementRarity;
  public readonly points: number;
  public readonly icon: string;
  public readonly rewardDefinition: AchievementMetadata['rewardDefinition'];
  public readonly isHidden: boolean;
  public readonly isActive: boolean;
  public readonly metadata: AchievementMetadata;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new Achievement instance.
   */
  constructor(props: AchievementProps) {
    this.achievementId = props.achievementId;
    this.slug = props.slug;
    this.title = props.title;
    this.description = props.description;
    this.category = props.category;
    this.rarity = props.rarity;
    this.points = props.points;
    this.icon = props.icon;
    this.rewardDefinition = props.rewardDefinition;
    this.isHidden = props.isHidden;
    this.isActive = props.isActive;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new Achievement entity.
   */
  public static create(params: {
    achievementId: AchievementId;
    slug: AchievementSlug;
    title: string;
    description: string;
    category: AchievementCategory;
    rarity: AchievementRarity;
    points: number;
    icon?: string;
    rewardDefinition: AchievementMetadata['rewardDefinition'];
    isHidden?: boolean;
    isActive?: boolean;
    metadata?: AchievementMetadata;
  }): Achievement {
    const now = new Date();

    return new Achievement({
      achievementId: params.achievementId,
      slug: params.slug,
      title: params.title,
      description: params.description,
      category: params.category,
      rarity: params.rarity,
      points: params.points,
      icon: params.icon ?? 'default',
      rewardDefinition: params.rewardDefinition,
      isHidden: params.isHidden ?? false,
      isActive: params.isActive ?? true,
      metadata: params.metadata ?? {
        category: params.category,
        rarity: params.rarity,
        rewardDefinition: params.rewardDefinition,
      },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs an Achievement from stored data.
   */
  public static fromStorage(record: AchievementRecord): Achievement {
    return new Achievement({
      achievementId: AchievementId.reconstruct(record.achievementId),
      slug: AchievementSlug.reconstruct(record.slug),
      title: record.title,
      description: record.description,
      category: record.category,
      rarity: record.rarity,
      points: record.points,
      icon: record.icon,
      rewardDefinition: record.rewardDefinition,
      isHidden: record.isHidden,
      isActive: record.isActive,
      metadata: record.metadata,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Checks if the achievement is a special/limited achievement.
   */
  public get isSpecial(): boolean {
    return this.category === 'special' || this.category === 'temporal';
  }

  /**
   * Checks if the achievement is visible to players.
   */
  public get isVisible(): boolean {
    return !this.isHidden;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<AchievementProps, 'achievementId' | 'createdAt'>>): Achievement {
    return new Achievement({
      achievementId: this.achievementId,
      slug: params.slug ?? this.slug,
      title: params.title ?? this.title,
      description: params.description ?? this.description,
      category: params.category ?? this.category,
      rarity: params.rarity ?? this.rarity,
      points: params.points ?? this.points,
      icon: params.icon ?? this.icon,
      rewardDefinition: params.rewardDefinition ?? this.rewardDefinition,
      isHidden: params.isHidden ?? this.isHidden,
      isActive: params.isActive ?? this.isActive,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the Achievement to a plain object.
   */
  public toJSON(): AchievementJSON {
    return {
      achievementId: this.achievementId.value,
      slug: this.slug.value,
      title: this.title,
      description: this.description,
      category: this.category,
      rarity: this.rarity,
      points: this.points,
      icon: this.icon,
      rewardDefinition: this.rewardDefinition,
      isHidden: this.isHidden,
      isActive: this.isActive,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): AchievementRecord {
    return {
      achievementId: this.achievementId.value,
      slug: this.slug.value,
      title: this.title,
      description: this.description,
      category: this.category,
      rarity: this.rarity,
      points: this.points,
      icon: this.icon,
      rewardDefinition: this.rewardDefinition,
      isHidden: this.isHidden,
      isActive: this.isActive,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
