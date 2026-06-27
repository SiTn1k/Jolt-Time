/**
 * Museum Entity
 *
 * Domain entity representing a player's virtual museum.
 * The museum is the collection showcase displaying all discovered artifacts.
 *
 * Museum Entity Responsibilities:
 * - Represent player's museum ownership
 * - Track museum level and rating
 * - Store museum name and configuration
 *
 * Museum Entity is NOT:
 * - An artifact owner (artifacts live in Inventory)
 * - An exhibit owner directly (exhibits reference inventory items)
 *
 * CRITICAL: Museum MUST NOT own artifacts. Museum displays Inventory Items.
 */
import type { IMuseum } from '../interfaces/IMuseum';
import { MuseumId } from '../value-objects/MuseumId';
import { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import { MuseumType } from '../types/MuseumType';
import type { MuseumStatistics } from '../types/MuseumStatistics';
import { INITIAL_MUSEUM_STATISTICS } from '../types/MuseumStatistics';
import type { MuseumMetadata } from '../types/MuseumMetadata';
import { INITIAL_MUSEUM_METADATA } from '../types/MuseumMetadata';

/**
 * Museum entity class.
 * Immutable domain entity representing a player's museum.
 */
export class Museum implements IMuseum {
  /** Unique internal museum identifier */
  public readonly museumId: MuseumId;

  /** Associated player profile ID (owner) */
  public readonly playerProfileId: PlayerProfileId;

  /** Museum display name */
  public readonly museumName: string;

  /** Museum type/classification */
  public readonly museumType: MuseumType;

  /** Museum level (affects capacity and features) */
  public readonly level: number;

  /** Museum rating (player satisfaction score) */
  public readonly rating: number;

  /** Museum statistics */
  public readonly statistics: MuseumStatistics;

  /** Museum metadata/configuration */
  public readonly metadata: MuseumMetadata;

  /** Timestamp when museum was created */
  public readonly createdAt: Date;

  /** Timestamp when museum was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new Museum instance.
   * @param props Museum properties
   */
  constructor(props: MuseumProps) {
    this.museumId = props.museumId;
    this.playerProfileId = props.playerProfileId;
    this.museumName = props.museumName;
    this.museumType = props.museumType;
    this.level = props.level;
    this.rating = props.rating;
    this.statistics = props.statistics ?? { ...INITIAL_MUSEUM_STATISTICS };
    this.metadata = props.metadata ?? { ...INITIAL_MUSEUM_METADATA };
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new Museum for a player profile.
   * Factory method for new museum creation.
   */
  public static create(params: {
    museumId: MuseumId;
    playerProfileId: PlayerProfileId;
    museumName: string;
    museumType?: MuseumType;
    level?: number;
  }): Museum {
    const now = new Date();

    return new Museum({
      museumId: params.museumId,
      playerProfileId: params.playerProfileId,
      museumName: params.museumName,
      museumType: params.museumType ?? MuseumType.CLASSIC,
      level: params.level ?? 1,
      rating: 0,
      statistics: { ...INITIAL_MUSEUM_STATISTICS },
      metadata: { ...INITIAL_MUSEUM_METADATA },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a Museum from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: MuseumRecord): Museum {
    return new Museum({
      museumId: MuseumId.reconstruct(record.museum_id),
      playerProfileId: PlayerProfileId.reconstruct(record.player_profile_id),
      museumName: record.museum_name,
      museumType: record.museum_type as MuseumType,
      level: record.level,
      rating: record.rating,
      statistics: record.statistics,
      metadata: record.metadata,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }

  /**
   * Serializes the Museum to a plain object.
   */
  public toJSON(): MuseumJSON {
    return {
      museumId: this.museumId.value,
      playerProfileId: this.playerProfileId.value,
      museumName: this.museumName,
      museumType: this.museumType,
      level: this.level,
      rating: this.rating,
      statistics: this.statistics,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new Museum instance.
   */
  public copyWith(params: Partial<MuseumProps>): Museum {
    return new Museum({
      museumId: params.museumId ?? this.museumId,
      playerProfileId: params.playerProfileId ?? this.playerProfileId,
      museumName: params.museumName ?? this.museumName,
      museumType: params.museumType ?? this.museumType,
      level: params.level ?? this.level,
      rating: params.rating ?? this.rating,
      statistics: params.statistics ?? this.statistics,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Creates a copy with updated name.
   * Returns a new Museum instance.
   */
  public rename(newName: string): Museum {
    return this.copyWith({
      museumName: newName,
    });
  }

  /**
   * Creates a copy with updated level.
   * Returns a new Museum instance.
   */
  public upgradeLevel(newLevel: number): Museum {
    return this.copyWith({
      level: newLevel,
    });
  }

  /**
   * Creates a copy with updated rating.
   * Returns a new Museum instance.
   */
  public updateRating(newRating: number): Museum {
    return this.copyWith({
      rating: Math.max(0, Math.min(5, newRating)),
    });
  }

  /**
   * Creates a copy with updated statistics.
   * Returns a new Museum instance.
   */
  public updateStatistics(stats: Partial<MuseumStatistics>): Museum {
    return this.copyWith({
      statistics: {
        ...this.statistics,
        ...stats,
      },
    });
  }
}

/**
 * Museum properties interface for constructor.
 */
export interface MuseumProps {
  museumId: MuseumId;
  playerProfileId: PlayerProfileId;
  museumName: string;
  museumType: MuseumType;
  level: number;
  rating: number;
  statistics?: MuseumStatistics;
  metadata?: MuseumMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of Museum.
 */
export interface MuseumRecord {
  museum_id: string;
  player_profile_id: string;
  museum_name: string;
  museum_type: string;
  level: number;
  rating: number;
  statistics: MuseumStatistics;
  metadata: MuseumMetadata;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of Museum.
 */
export interface MuseumJSON {
  museumId: string;
  playerProfileId: string;
  museumName: string;
  museumType: MuseumType;
  level: number;
  rating: number;
  statistics: MuseumStatistics;
  metadata: MuseumMetadata;
  createdAt: string;
  updatedAt: string;
}
