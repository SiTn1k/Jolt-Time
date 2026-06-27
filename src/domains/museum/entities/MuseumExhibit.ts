/**
 * MuseumExhibit Entity
 *
 * Domain entity representing an exhibit in a museum hall.
 * An exhibit displays an inventory item (NOT an artifact directly).
 *
 * MuseumExhibit Entity Responsibilities:
 * - Link inventory items to museum display
 * - Track exhibit position and condition
 * - Store display metadata
 *
 * CRITICAL DESIGN PRINCIPLES:
 * - MuseumExhibit references InventoryItemId, NOT Artifact
 * - MuseumExhibit references ArtifactId for display context
 * - MuseumExhibit does NOT duplicate artifact data
 * - Museum never owns artifacts - it displays inventory items
 *
 * This separation ensures:
 * - Single source of truth for artifact data (Inventory/Artifact domains)
 * - Clean separation of concerns
 * - Proper DDD bounded contexts
 */
import type { IMuseumExhibit } from '../interfaces/IMuseumExhibit';
import { ExhibitId } from '../value-objects/ExhibitId';
import { HallId } from '../value-objects/HallId';
import { InventoryItemId } from '../../inventory/value-objects/InventoryItemId';
import { DisplayOrder } from '../value-objects/DisplayOrder';
import type { ExhibitCondition } from '../types/ExhibitCondition';
import { ExhibitCondition as ExhibitConditionEnum } from '../types/ExhibitCondition';

/**
 * MuseumExhibit entity class.
 * Immutable domain entity representing a museum exhibit.
 */
export class MuseumExhibit implements IMuseumExhibit {
  /** Unique internal exhibit identifier */
  public readonly exhibitId: ExhibitId;

  /** Associated hall ID */
  public readonly hallId: HallId;

  /** Associated inventory item ID (the item being displayed) */
  public readonly inventoryItemId: InventoryItemId;

  /** Associated artifact ID (for display context) */
  public readonly artifactId: string;

  /** Display order within the hall */
  public readonly displayOrder: DisplayOrder;

  /** Exhibit condition status */
  public readonly condition: ExhibitCondition;

  /** Popularity score (affects museum rating) */
  public readonly popularity: number;

  /** Timestamp when exhibit was placed */
  public readonly placedAt: Date;

  /** Exhibit metadata */
  public readonly metadata: ExhibitMetadata;

  /** Timestamp when exhibit was created */
  public readonly createdAt: Date;

  /** Timestamp when exhibit was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new MuseumExhibit instance.
   * @param props MuseumExhibit properties
   */
  constructor(props: MuseumExhibitProps) {
    this.exhibitId = props.exhibitId;
    this.hallId = props.hallId;
    this.inventoryItemId = props.inventoryItemId;
    this.artifactId = props.artifactId;
    this.displayOrder = props.displayOrder;
    this.condition = props.condition ?? ExhibitConditionEnum.GOOD;
    this.popularity = props.popularity ?? 0;
    this.placedAt = props.placedAt;
    this.metadata = props.metadata ?? this.createDefaultMetadata();
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new MuseumExhibit for placement in a hall.
   * Factory method for new exhibit creation.
   */
  public static create(params: {
    exhibitId: ExhibitId;
    hallId: HallId;
    inventoryItemId: InventoryItemId;
    artifactId: string;
    displayOrder: DisplayOrder;
    condition?: ExhibitCondition;
    popularity?: number;
  }): MuseumExhibit {
    const now = new Date();

    return new MuseumExhibit({
      exhibitId: params.exhibitId,
      hallId: params.hallId,
      inventoryItemId: params.inventoryItemId,
      artifactId: params.artifactId,
      displayOrder: params.displayOrder,
      condition: params.condition ?? ExhibitConditionEnum.GOOD,
      popularity: params.popularity ?? 0,
      placedAt: now,
      metadata: {
        placedBy: 'system',
        views: 0,
        version: 1,
      },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a MuseumExhibit from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: MuseumExhibitRecord): MuseumExhibit {
    return new MuseumExhibit({
      exhibitId: ExhibitId.reconstruct(record.exhibit_id),
      hallId: HallId.reconstruct(record.hall_id),
      inventoryItemId: InventoryItemId.reconstruct(record.inventory_item_id),
      artifactId: record.artifact_id,
      displayOrder: DisplayOrder.reconstruct(record.display_order),
      condition: record.condition as ExhibitCondition,
      popularity: record.popularity,
      placedAt: new Date(record.placed_at),
      metadata: record.metadata,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }

  /**
   * Creates default exhibit metadata.
   */
  private createDefaultMetadata(): ExhibitMetadata {
    return {
      placedBy: 'system',
      views: 0,
      version: 1,
    };
  }

  /**
   * Serializes the MuseumExhibit to a plain object.
   */
  public toJSON(): MuseumExhibitJSON {
    return {
      exhibitId: this.exhibitId.value,
      hallId: this.hallId.value,
      inventoryItemId: this.inventoryItemId.value,
      artifactId: this.artifactId,
      displayOrder: this.displayOrder.value,
      condition: this.condition,
      popularity: this.popularity,
      placedAt: this.placedAt.toISOString(),
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new MuseumExhibit instance.
   */
  public copyWith(params: Partial<MuseumExhibitProps>): MuseumExhibit {
    return new MuseumExhibit({
      exhibitId: params.exhibitId ?? this.exhibitId,
      hallId: params.hallId ?? this.hallId,
      inventoryItemId: params.inventoryItemId ?? this.inventoryItemId,
      artifactId: params.artifactId ?? this.artifactId,
      displayOrder: params.displayOrder ?? this.displayOrder,
      condition: params.condition ?? this.condition,
      popularity: params.popularity ?? this.popularity,
      placedAt: params.placedAt ?? this.placedAt,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Creates a copy with updated condition.
   * Returns a new MuseumExhibit instance.
   */
  public updateCondition(newCondition: ExhibitCondition): MuseumExhibit {
    return this.copyWith({
      condition: newCondition,
    });
  }

  /**
   * Creates a copy with updated popularity.
   * Returns a new MuseumExhibit instance.
   */
  public updatePopularity(newPopularity: number): MuseumExhibit {
    return this.copyWith({
      popularity: Math.max(0, Math.min(100, newPopularity)),
    });
  }

  /**
   * Creates a copy with updated display order.
   * Returns a new MuseumExhibit instance.
   */
  public reorder(newOrder: DisplayOrder): MuseumExhibit {
    return this.copyWith({
      displayOrder: newOrder,
    });
  }

  /**
   * Creates a copy with incremented view count.
   * Returns a new MuseumExhibit instance.
   */
  public recordView(): MuseumExhibit {
    return this.copyWith({
      metadata: {
        ...this.metadata,
        views: this.metadata.views + 1,
      },
    });
  }

  /**
   * Creates a copy moved to a different hall.
   * Returns a new MuseumExhibit instance.
   */
  public moveTo(newHallId: HallId, newOrder: DisplayOrder): MuseumExhibit {
    return this.copyWith({
      hallId: newHallId,
      displayOrder: newOrder,
    });
  }
}

/**
 * MuseumExhibit properties interface for constructor.
 */
export interface MuseumExhibitProps {
  exhibitId: ExhibitId;
  hallId: HallId;
  inventoryItemId: InventoryItemId;
  artifactId: string;
  displayOrder: DisplayOrder;
  condition?: ExhibitCondition;
  popularity?: number;
  placedAt: Date;
  metadata?: ExhibitMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Exhibit metadata for tracking.
 */
export interface ExhibitMetadata {
  /** Who placed the exhibit */
  placedBy: string;

  /** View count */
  views: number;

  /** Custom fields */
  customFields?: Record<string, unknown>;

  /** Schema version */
  version: number;
}

/**
 * Database record representation of MuseumExhibit.
 */
export interface MuseumExhibitRecord {
  exhibit_id: string;
  hall_id: string;
  inventory_item_id: string;
  artifact_id: string;
  display_order: number;
  condition: string;
  popularity: number;
  placed_at: string;
  metadata: ExhibitMetadata;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of MuseumExhibit.
 */
export interface MuseumExhibitJSON {
  exhibitId: string;
  hallId: string;
  inventoryItemId: string;
  artifactId: string;
  displayOrder: number;
  condition: ExhibitCondition;
  popularity: number;
  placedAt: string;
  metadata: ExhibitMetadata;
  createdAt: string;
  updatedAt: string;
}
