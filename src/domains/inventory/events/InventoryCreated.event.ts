/**
 * Inventory Created Event
 *
 * Domain event emitted when a new inventory is created.
 */

import type { InventoryId } from '../value-objects/InventoryId';

/**
 * Event data for inventory creation.
 */
export interface InventoryCreatedEventData {
  /** Inventory ID */
  inventoryId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Initial capacity */
  capacity: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for inventory creation.
 */
export interface InventoryCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'InventoryCreated';

  /** Event data */
  readonly data: InventoryCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an InventoryCreatedEvent.
 */
export function createInventoryCreatedEvent(params: {
  inventoryId: InventoryId;
  playerProfileId: string;
  capacity: number;
}): InventoryCreatedEvent {
  return {
    eventType: 'InventoryCreated',
    version: 1,
    data: {
      inventoryId: params.inventoryId.value,
      playerProfileId: params.playerProfileId,
      capacity: params.capacity,
      occurredAt: new Date(),
    },
  };
}