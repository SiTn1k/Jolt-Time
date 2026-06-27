/**
 * Inventory Item Added Event
 *
 * Domain event emitted when an item is added to inventory.
 */

import type { InventoryItemId } from '../value-objects/InventoryItemId';
import type { InventoryId } from '../value-objects/InventoryId';
import type { ItemRarity } from '../entities/InventoryItem';

/**
 * Event data for inventory item addition.
 */
export interface InventoryItemAddedEventData {
  /** Item ID */
  itemId: string;

  /** Inventory ID */
  inventoryId: string;

  /** Artifact ID */
  artifactId: string;

  /** Owner player profile ID */
  ownerId: string;

  /** Item rarity */
  rarity: ItemRarity;

  /** Quantity added */
  quantity: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for inventory item addition.
 */
export interface InventoryItemAddedEvent {
  /** Event type identifier */
  readonly eventType: 'InventoryItemAdded';

  /** Event data */
  readonly data: InventoryItemAddedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an InventoryItemAddedEvent.
 */
export function createInventoryItemAddedEvent(params: {
  itemId: InventoryItemId;
  inventoryId: InventoryId;
  artifactId: string;
  ownerId: string;
  rarity: ItemRarity;
  quantity: number;
}): InventoryItemAddedEvent {
  return {
    eventType: 'InventoryItemAdded',
    version: 1,
    data: {
      itemId: params.itemId.value,
      inventoryId: params.inventoryId.value,
      artifactId: params.artifactId,
      ownerId: params.ownerId,
      rarity: params.rarity,
      quantity: params.quantity,
      occurredAt: new Date(),
    },
  };
}