/**
 * MuseumHall Entity
 *
 * Domain entity representing a hall within a museum.
 * A hall is a themed section organized by historical era or category.
 *
 * MuseumHall Entity Responsibilities:
 * - Represent a themed exhibition area
 * - Track hall capacity and position
 * - Store hall configuration and metadata
 *
 * MuseumHall Entity is NOT:
 * - An exhibit container that owns artifacts
 * - A display that duplicates artifact data
 */
import type { IMuseumHall } from '../interfaces/IMuseumHall';
import { HallId } from '../value-objects/HallId';
import { MuseumId } from '../value-objects/MuseumId';
import { HallCapacity, DEFAULT_HALL_CAPACITY } from '../value-objects/HallCapacity';
import type { HallType } from '../types/HallType';
import type { HallMetadata } from '../types/MuseumMetadata';
import { INITIAL_HALL_METADATA } from '../types/MuseumMetadata';
import { HALL_TYPE_METADATA } from '../types/HallType';

/**
 * MuseumHall entity class.
 * Immutable domain entity representing a museum hall.
 */
export class MuseumHall implements IMuseumHall {
  /** Unique internal hall identifier */
  public readonly hallId: HallId;

  /** Associated museum ID */
  public readonly museumId: MuseumId;

  /** Hall type (era/category classification) */
  public readonly hallType: HallType;

  /** Hall display name */
  public readonly hallName: string;

  /** Hall capacity (max exhibits) */
  public readonly capacity: HallCapacity;

  /** Hall position/order in museum */
  public readonly position: number;

  /** Hall metadata/configuration */
  public readonly metadata: HallMetadata;

  /** Timestamp when hall was created */
  public readonly createdAt: Date;

  /** Timestamp when hall was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new MuseumHall instance.
   * @param props MuseumHall properties
   */
  constructor(props: MuseumHallProps) {
    this.hallId = props.hallId;
    this.museumId = props.museumId;
    this.hallType = props.hallType;
    this.hallName = props.hallName;
    this.capacity = props.capacity;
    this.position = props.position;
    this.metadata = props.metadata ?? { ...INITIAL_HALL_METADATA };
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new MuseumHall for a museum.
   * Factory method for new hall creation.
   */
  public static create(params: {
    hallId: HallId;
    museumId: MuseumId;
    hallType: HallType;
    hallName: string;
    position: number;
    capacity?: HallCapacity;
  }): MuseumHall {
    const now = new Date();
    const hallMetadata = HALL_TYPE_METADATA[params.hallType];
    const defaultCapacity = HallCapacity.create(hallMetadata?.defaultCapacity ?? DEFAULT_HALL_CAPACITY);

    return new MuseumHall({
      hallId: params.hallId,
      museumId: params.museumId,
      hallType: params.hallType,
      hallName: params.hallName ?? hallMetadata?.name ?? 'Unnamed Hall',
      capacity: params.capacity ?? defaultCapacity,
      position: params.position,
      metadata: { ...INITIAL_HALL_METADATA },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a MuseumHall from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: MuseumHallRecord): MuseumHall {
    return new MuseumHall({
      hallId: HallId.reconstruct(record.hall_id),
      museumId: MuseumId.reconstruct(record.museum_id),
      hallType: record.hall_type as HallType,
      hallName: record.hall_name,
      capacity: HallCapacity.reconstruct(record.capacity),
      position: record.position,
      metadata: record.metadata,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }

  /**
   * Checks if the hall has room for more exhibits.
   * @param currentExhibitCount Current number of exhibits
   */
  public hasRoom(currentExhibitCount: number): boolean {
    return this.capacity.hasRoom(currentExhibitCount);
  }

  /**
   * Gets the remaining capacity.
   * @param currentExhibitCount Current number of exhibits
   */
  public getRemainingCapacity(currentExhibitCount: number): number {
    return this.capacity.remaining(currentExhibitCount);
  }

  /**
   * Serializes the MuseumHall to a plain object.
   */
  public toJSON(): MuseumHallJSON {
    return {
      hallId: this.hallId.value,
      museumId: this.museumId.value,
      hallType: this.hallType,
      hallName: this.hallName,
      capacity: this.capacity.value,
      position: this.position,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new MuseumHall instance.
   */
  public copyWith(params: Partial<MuseumHallProps>): MuseumHall {
    return new MuseumHall({
      hallId: params.hallId ?? this.hallId,
      museumId: params.museumId ?? this.museumId,
      hallType: params.hallType ?? this.hallType,
      hallName: params.hallName ?? this.hallName,
      capacity: params.capacity ?? this.capacity,
      position: params.position ?? this.position,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Creates a copy with updated name.
   * Returns a new MuseumHall instance.
   */
  public rename(newName: string): MuseumHall {
    return this.copyWith({
      hallName: newName,
    });
  }

  /**
   * Creates a copy with updated capacity.
   * Returns a new MuseumHall instance.
   */
  public resize(newCapacity: HallCapacity): MuseumHall {
    return this.copyWith({
      capacity: newCapacity,
    });
  }

  /**
   * Creates a copy with updated position.
   * Returns a new MuseumHall instance.
   */
  public reposition(newPosition: number): MuseumHall {
    return this.copyWith({
      position: newPosition,
    });
  }
}

/**
 * MuseumHall properties interface for constructor.
 */
export interface MuseumHallProps {
  hallId: HallId;
  museumId: MuseumId;
  hallType: HallType;
  hallName: string;
  capacity: HallCapacity;
  position: number;
  metadata?: HallMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of MuseumHall.
 */
export interface MuseumHallRecord {
  hall_id: string;
  museum_id: string;
  hall_type: string;
  hall_name: string;
  capacity: number;
  position: number;
  metadata: HallMetadata;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of MuseumHall.
 */
export interface MuseumHallJSON {
  hallId: string;
  museumId: string;
  hallType: HallType;
  hallName: string;
  capacity: number;
  position: number;
  metadata: HallMetadata;
  createdAt: string;
  updatedAt: string;
}
