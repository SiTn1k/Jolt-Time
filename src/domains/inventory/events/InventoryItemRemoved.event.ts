/**
 * Inventory Item Removed Event
 *
 * Domain event emitted when an item is removed from inventory.
 */

import type { InventoryItemId } from '../value-objects/InventoryItemId';
import type { InventoryId } from '../value-objects/InventoryId';
import type { ItemRarity } from '../entities/InventoryItem';

/**
 * Reason for item removal from inventory.
 */
export enum InventoryItemRemovalReason {
  /** Item was consumed/used */
  CONSUMED = 'consumed',
  
  /** Item was traded to another player */
  TRADED = 'traded',
  
  /** Item was sold on marketplace */
  SOLD = 'sold',
  
  /** Item was deleted/removed by user */
  DELETED = 'deleted',
  
  /** Item expired */
  EXPIRED = 'expired',
  
  /** Item was lost due to game mechanics */
  LOST = 'lost',
}

/**
 * Event data for inventory item removal.
 */
export interface InventoryItemRemovedEventData {
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

  /** Quantity removed */
  quantity: number;

  /** Reason for removal */
  reason: InventoryItemRemovalReason;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for inventory item removal.
 */
export interface InventoryItemRemovedEvent {
  /** Event type identifier */
  readonly eventType: 'InventoryItemRemoved';

  /** Event data */
  readonly data: InventoryItemRemovedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an InventoryItemRemovedEvent.
 */
export function createInventoryItemRemovedEvent(params: {
  itemId: InventoryItemId;
  inventoryId: InventoryId;
  artifactId: string;
  ownerId: string;
  rarity: ItemRarity;
  quantity: number;
  reason: InventoryItemRemovalReason;
}): InventoryItemRemovedEvent {
  return {
    eventType: 'InventoryItemRemoved',
    version: 1,
    data: {
      itemId: params.itemId.value,
      inventoryId: params.inventoryId.value,
      artifactId: params.artifactId,
      ownerId: params.ownerId,
      rarity: params.rarity,
      quantity: params.quantity,
      reason: params.reason,
      occurredAt: new Date(),
    },
  };
}