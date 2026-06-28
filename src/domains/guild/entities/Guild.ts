/**
 * Guild Entity
 *
 * Domain entity representing a guild (clan/community).
 * Guilds are independent domains that manage communities.
 * Guilds never own player assets.
 */

import type { IGuild } from '../interfaces/IGuild';
import { GuildId } from '../value-objects/GuildId';
import { GuildSlug } from '../value-objects/GuildSlug';
import { GuildName } from '../value-objects/GuildName';
import { GuildLevel } from '../value-objects/GuildLevel';
import type { GuildMetadata } from '../types/GuildMetadata';
import type { GuildPrivacy } from '../types/GuildStatus';
import type { GuildStatistics } from '../types/GuildStatistics';

/**
 * Guild entity props for constructor.
 */
export interface GuildProps {
  guildId: GuildId;
  slug: GuildSlug;
  name: GuildName;
  description: string;
  ownerPlayerId: string;
  guildLevel: GuildLevel;
  guildExperience: number;
  memberLimit: number;
  privacy: GuildPrivacy;
  statistics: GuildStatistics;
  metadata: GuildMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of Guild.
 */
export interface GuildRecord {
  guildId: string;
  slug: string;
  name: string;
  description: string;
  ownerPlayerId: string;
  guildLevel: number;
  guildExperience: number;
  memberLimit: number;
  privacy: GuildPrivacy;
  statistics: GuildStatistics;
  metadata: GuildMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of Guild.
 */
export interface GuildJSON {
  guildId: string;
  slug: string;
  name: string;
  description: string;
  ownerPlayerId: string;
  guildLevel: number;
  guildExperience: number;
  memberLimit: number;
  privacy: GuildPrivacy;
  statistics: GuildStatistics;
  metadata: GuildMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Guild entity class.
 * Immutable domain entity representing a guild.
 */
export class Guild implements IGuild {
  public readonly guildId: GuildId;
  public readonly slug: GuildSlug;
  public readonly name: GuildName;
  public readonly description: string;
  public readonly ownerPlayerId: string;
  public readonly guildLevel: GuildLevel;
  public readonly guildExperience: number;
  public readonly memberLimit: number;
  public readonly privacy: GuildPrivacy;
  public readonly statistics: GuildStatistics;
  public readonly metadata: GuildMetadata;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new Guild instance.
   */
  constructor(props: GuildProps) {
    this.guildId = props.guildId;
    this.slug = props.slug;
    this.name = props.name;
    this.description = props.description;
    this.ownerPlayerId = props.ownerPlayerId;
    this.guildLevel = props.guildLevel;
    this.guildExperience = props.guildExperience;
    this.memberLimit = props.memberLimit;
    this.privacy = props.privacy;
    this.statistics = props.statistics;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new Guild entity.
   */
  public static create(params: {
    guildId?: GuildId;
    slug: GuildSlug;
    name: GuildName;
    description?: string;
    ownerPlayerId: string;
    privacy?: GuildPrivacy;
    metadata?: GuildMetadata;
  }): Guild {
    const now = new Date();

    return new Guild({
      guildId: params.guildId ?? GuildId.create(),
      slug: params.slug,
      name: params.name,
      description: params.description ?? '',
      ownerPlayerId: params.ownerPlayerId,
      guildLevel: GuildLevel.create(1),
      guildExperience: 0,
      memberLimit: 10, // Default for level 1
      privacy: params.privacy ?? 'public',
      statistics: {
        totalExperience: 0,
        weeklyExperience: 0,
        activeMembersCount: 1,
        averageMemberLevel: 0,
        missionsCompleted: 0,
        missionCompletionRate: 0,
        warsParticipated: 0,
        warsWon: 0,
        seasonStanding: 0,
        allTimeSeasonPoints: 0,
        totalMembersJoined: 1,
        totalMembersLeft: 0,
      },
      metadata: params.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a Guild from stored data.
   */
  public static fromStorage(record: GuildRecord): Guild {
    return new Guild({
      guildId: GuildId.reconstruct(record.guildId),
      slug: GuildSlug.reconstruct(record.slug),
      name: GuildName.reconstruct(record.name),
      description: record.description,
      ownerPlayerId: record.ownerPlayerId,
      guildLevel: GuildLevel.reconstruct(record.guildLevel),
      guildExperience: record.guildExperience,
      memberLimit: record.memberLimit,
      privacy: record.privacy,
      statistics: record.statistics,
      metadata: record.metadata,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Checks if guild is public.
   */
  public get isPublic(): boolean {
    return this.privacy === 'public';
  }

  /**
   * Checks if guild is private.
   */
  public get isPrivate(): boolean {
    return this.privacy === 'private';
  }

  /**
   * Gets the level from current experience.
   */
  public getLevelFromExperience(): GuildLevel {
    return GuildLevel.fromExperience(this.guildExperience);
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<GuildProps, 'guildId' | 'createdAt'>>): Guild {
    return new Guild({
      guildId: this.guildId,
      slug: params.slug ?? this.slug,
      name: params.name ?? this.name,
      description: params.description ?? this.description,
      ownerPlayerId: params.ownerPlayerId ?? this.ownerPlayerId,
      guildLevel: params.guildLevel ?? this.guildLevel,
      guildExperience: params.guildExperience ?? this.guildExperience,
      memberLimit: params.memberLimit ?? this.memberLimit,
      privacy: params.privacy ?? this.privacy,
      statistics: params.statistics ?? this.statistics,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the Guild to a plain object.
   */
  public toJSON(): GuildJSON {
    return {
      guildId: this.guildId.value,
      slug: this.slug.value,
      name: this.name.value,
      description: this.description,
      ownerPlayerId: this.ownerPlayerId,
      guildLevel: this.guildLevel.value,
      guildExperience: this.guildExperience,
      memberLimit: this.memberLimit,
      privacy: this.privacy,
      statistics: this.statistics,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): GuildRecord {
    return {
      guildId: this.guildId.value,
      slug: this.slug.value,
      name: this.name.value,
      description: this.description,
      ownerPlayerId: this.ownerPlayerId,
      guildLevel: this.guildLevel.value,
      guildExperience: this.guildExperience,
      memberLimit: this.memberLimit,
      privacy: this.privacy,
      statistics: this.statistics,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
