/**
 * Exhibit Removed Event
 *
 * Domain event emitted when an exhibit is removed from a hall.
 */

import type { ExhibitId } from '../value-objects/ExhibitId';
import type { HallId } from '../value-objects/HallId';
import type { InventoryItemId } from '../../inventory/value-objects/InventoryItemId';

/**
 * Event data for exhibit removal.
 */
export interface ExhibitRemovedEventData {
  /** Exhibit ID */
  exhibitId: string;

  /** Hall ID */
  hallId: string;

  /** Inventory item ID (the item that was displayed) */
  inventoryItemId: string;

  /** Artifact ID */
  artifactId: string;

  /** Reason for removal */
  reason: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for exhibit removal.
 */
export interface ExhibitRemovedEvent {
  /** Event type identifier */
  readonly eventType: 'ExhibitRemoved';

  /** Event data */
  readonly data: ExhibitRemovedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an ExhibitRemovedEvent.
 */
export function createExhibitRemovedEvent(params: {
  exhibitId: ExhibitId;
  hallId: HallId;
  inventoryItemId: InventoryItemId;
  artifactId: string;
  reason?: string;
}): ExhibitRemovedEvent {
  return {
    eventType: 'ExhibitRemoved',
    version: 1,
    data: {
      exhibitId: params.exhibitId.value,
      hallId: params.hallId.value,
      inventoryItemId: params.inventoryItemId.value,
      artifactId: params.artifactId,
      reason: params.reason ?? 'manual_removal',
      occurredAt: new Date(),
    },
  };
}
