/**
 * Museum Exhibit Interface
 *
 * Interface defining the contract for MuseumExhibit entity.
 * All MuseumExhibit implementations must adhere to this interface.
 *
 * CRITICAL: MuseumExhibit references InventoryItemId, NOT Artifact.
 * This interface represents display state, not artifact ownership.
 */

import type { ExhibitId } from '../value-objects/ExhibitId';
import type { HallId } from '../value-objects/HallId';
import type { InventoryItemId } from '../../inventory/value-objects/InventoryItemId';
import type { DisplayOrder } from '../value-objects/DisplayOrder';
import type { ExhibitCondition } from '../types/ExhibitCondition';

/**
 * MuseumExhibit entity interface.
 * Represents an exhibit in a museum hall.
 *
 * An exhibit displays an inventory item (collected artifact).
 * The exhibit references the inventory item for the actual display data.
 */
export interface IMuseumExhibit {
  /** Unique internal exhibit identifier */
  readonly exhibitId: ExhibitId;

  /** Associated hall ID */
  readonly hallId: HallId;

  /** Associated inventory item ID (the item being displayed) */
  readonly inventoryItemId: InventoryItemId;

  /** Associated artifact ID (for display context) */
  readonly artifactId: string;

  /** Display order within the hall */
  readonly displayOrder: DisplayOrder;

  /** Exhibit condition status */
  readonly condition: ExhibitCondition;

  /** Popularity score */
  readonly popularity: number;

  /** Timestamp when exhibit was placed */
  readonly placedAt: Date;

  /** Timestamp when exhibit was created */
  readonly createdAt: Date;

  /** Timestamp when exhibit was last updated */
  readonly updatedAt: Date;

  /**
   * Serializes the MuseumExhibit to a plain object.
   */
  toJSON(): MuseumExhibitJSON;
}

/**
 * JSON serialization representation.
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
  metadata: ExhibitMetadataJSON;
  createdAt: string;
  updatedAt: string;
}

/**
 * Exhibit metadata JSON representation.
 */
export interface ExhibitMetadataJSON {
  placedBy: string;
  views: number;
  customFields?: Record<string, unknown>;
  version: number;
}
