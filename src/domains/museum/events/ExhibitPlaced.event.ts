/**
 * Exhibit Placed Event
 *
 * Domain event emitted when an exhibit is placed in a hall.
 *
 * IMPORTANT: This event references an inventory item, not an artifact directly.
 * The inventory item provides the actual display data.
 */

import type { ExhibitId } from '../value-objects/ExhibitId';
import type { HallId } from '../value-objects/HallId';
import type { InventoryItemId } from '../../inventory/value-objects/InventoryItemId';

/**
 * Event data for exhibit placement.
 */
export interface ExhibitPlacedEventData {
  /** Exhibit ID */
  exhibitId: string;

  /** Hall ID */
  hallId: string;

  /** Inventory item ID (the item being displayed) */
  inventoryItemId: string;

  /** Artifact ID (for display context) */
  artifactId: string;

  /** Display order */
  displayOrder: number;

  /** Condition */
  condition: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for exhibit placement.
 */
export interface ExhibitPlacedEvent {
  /** Event type identifier */
  readonly eventType: 'ExhibitPlaced';

  /** Event data */
  readonly data: ExhibitPlacedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an ExhibitPlacedEvent.
 */
export function createExhibitPlacedEvent(params: {
  exhibitId: ExhibitId;
  hallId: HallId;
  inventoryItemId: InventoryItemId;
  artifactId: string;
  displayOrder: number;
  condition: string;
}): ExhibitPlacedEvent {
  return {
    eventType: 'ExhibitPlaced',
    version: 1,
    data: {
      exhibitId: params.exhibitId.value,
      hallId: params.hallId.value,
      inventoryItemId: params.inventoryItemId.value,
      artifactId: params.artifactId,
      displayOrder: params.displayOrder,
      condition: params.condition,
      occurredAt: new Date(),
    },
  };
}
