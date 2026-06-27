/**
 * Inventory Item Updated Event
 *
 * Domain event emitted when an inventory item is updated.
 */

import type { InventoryItemId } from '../value-objects/InventoryItemId';
import type { InventoryItemStatus } from '../types/InventoryItemStatus';

/**
 * Type of update performed on inventory item.
 */
export type InventoryItemUpdateType =
  | 'status_changed'
  | 'quantity_changed'
  | 'favorite_toggled'
  | 'metadata_updated'
  | 'expires_at_changed';

/**
 * Event data for inventory item update.
 */
export interface InventoryItemUpdatedEventData {
  /** Item ID */
  itemId: string;

  /** Inventory ID */
  inventoryId: string;

  /** Owner player profile ID */
  ownerId: string;

  /** Type of update */
  updateType: InventoryItemUpdateType;

  /** Previous value (if applicable) */
  previousValue?: string | number | boolean;

  /** New value (if applicable) */
  newValue?: string | number | boolean;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for inventory item update.
 */
export interface InventoryItemUpdatedEvent {
  /** Event type identifier */
  readonly eventType: 'InventoryItemUpdated';

  /** Event data */
  readonly data: InventoryItemUpdatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an InventoryItemUpdatedEvent.
 */
export function createInventoryItemUpdatedEvent(params: {
  itemId: InventoryItemId;
  inventoryId: string;
  ownerId: string;
  updateType: InventoryItemUpdateType;
  previousValue?: string | number | boolean;
  newValue?: string | number | boolean;
}): InventoryItemUpdatedEvent {
  return {
    eventType: 'InventoryItemUpdated',
    version: 1,
    data: {
      itemId: params.itemId.value,
      inventoryId: params.inventoryId,
      ownerId: params.ownerId,
      updateType: params.updateType,
      previousValue: params.previousValue,
      newValue: params.newValue,
      occurredAt: new Date(),
    },
  };
}