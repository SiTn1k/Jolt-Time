/**
 * Academy Entity
 *
 * Domain entity representing a player's Academy.
 * The Academy manages research progression only - it does NOT own currency, artifacts, or modify player state.
 *
 * Academy Entity Responsibilities:
 * - Store academy level and research points
 * - Track research progression for the player
 * - Provide read-only access to research state
 *
 * Academy Entity is NOT:
 * - Currency storage (use Currency domain)
 * - Artifact storage (use Inventory/Museum domains)
 * - Player profile modification
 * - Game state modification
 */

import type { IAcademy } from '../interfaces/IAcademy';
import { AcademyId } from '../value-objects/AcademyId';
import { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import { ResearchPoints } from '../value-objects/ResearchPoints';
import type { AcademyMetadata } from '../types/AcademyMetadata';
import type { AcademyStatistics } from '../types/AcademyStatistics';

/**
 * Academy entity class.
 * Immutable domain entity representing a player's Academy.
 */
export class Academy implements IAcademy {
  /** Unique academy identifier */
  public readonly academyId: AcademyId;

  /** Associated player profile ID */
  public readonly playerProfileId: PlayerProfileId;

  /** Current academy level */
  public readonly academyLevel: number;

  /** Current research points */
  public readonly researchPoints: ResearchPoints;

  /** Extended metadata */
  public readonly metadata: AcademyMetadata;

  /** Timestamp when academy was created */
  public readonly createdAt: Date;

  /** Timestamp when academy was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new Academy instance.
   * @param props Academy properties
   */
  constructor(props: AcademyProps) {
    this.academyId = props.academyId;
    this.playerProfileId = props.playerProfileId;
    this.academyLevel = props.academyLevel;
    this.researchPoints = props.researchPoints;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new Academy for a player profile.
   * Factory method for new academy creation.
   */
  public static create(params: {
    academyId: AcademyId;
    playerProfileId: PlayerProfileId;
    initialResearchPoints?: number;
    metadata?: AcademyMetadata;
  }): Academy {
    const now = new Date();

    return new Academy({
      academyId: params.academyId,
      playerProfileId: params.playerProfileId,
      academyLevel: 1,
      researchPoints: ResearchPoints.create(params.initialResearchPoints ?? 0),
      metadata: params.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs an Academy from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromStorage(record: AcademyRecord): Academy {
    return new Academy({
      academyId: AcademyId.reconstruct(record.academyId),
      playerProfileId: PlayerProfileId.reconstruct(record.playerProfileId),
      academyLevel: record.academyLevel,
      researchPoints: ResearchPoints.reconstruct(record.researchPoints),
      metadata: record.metadata ?? {},
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new Academy instance.
   */
  public copyWith(params: Partial<AcademyProps>): Academy {
    return new Academy({
      academyId: params.academyId ?? this.academyId,
      playerProfileId: params.playerProfileId ?? this.playerProfileId,
      academyLevel: params.academyLevel ?? this.academyLevel,
      researchPoints: params.researchPoints ?? this.researchPoints,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Gets the research points amount.
   */
  public getPoints(): number {
    return this.researchPoints.amount;
  }

  /**
   * Serializes the Academy to a plain object.
   */
  public toJSON(): AcademyJSON {
    return {
      academyId: this.academyId.value,
      playerProfileId: this.playerProfileId.value,
      academyLevel: this.academyLevel,
      researchPoints: this.researchPoints.amount,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

/**
 * Academy properties interface for constructor.
 */
export interface AcademyProps {
  academyId: AcademyId;
  playerProfileId: PlayerProfileId;
  academyLevel: number;
  researchPoints: ResearchPoints;
  metadata: AcademyMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of Academy.
 */
export interface AcademyRecord {
  academyId: string;
  playerProfileId: string;
  academyLevel: number;
  researchPoints: number;
  metadata: AcademyMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of Academy.
 */
export interface AcademyJSON {
  academyId: string;
  playerProfileId: string;
  academyLevel: number;
  researchPoints: number;
  metadata: AcademyMetadata;
  createdAt: string;
  updatedAt: string;
}