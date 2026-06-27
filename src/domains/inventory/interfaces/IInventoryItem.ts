/**
 * Inventory Item Interface
 *
 * Interface defining the contract for InventoryItem entity.
 * All InventoryItem implementations must adhere to this interface.
 */

import type { InventoryItemId } from '../value-objects/InventoryItemId';
import type { InventoryId } from '../value-objects/InventoryId';
import type { InventoryQuantity } from '../value-objects/InventoryQuantity';
import type { InventoryItemStatus } from '../types/InventoryItemStatus';
import type { InventoryMetadata } from '../types/InventoryMetadata';
import type { ItemRarity } from '../entities/InventoryItem';

/**
 * InventoryItem entity interface.
 * Represents an item in a player's inventory.
 */
export interface IInventoryItem {
  /** Unique internal inventory item identifier */
  readonly itemId: InventoryItemId;

  /** Associated inventory ID */
  readonly inventoryId: InventoryId;

  /** Associated artifact ID */
  readonly artifactId: string;

  /** Associated player profile ID (owner) */
  readonly ownerId: string;

  /** Item quantity (for stackable items) */
  readonly quantity: InventoryQuantity;

  /** Item rarity tier */
  readonly rarity: ItemRarity;

  /** Current item status */
  readonly status: InventoryItemStatus;

  /** Item metadata */
  readonly metadata: InventoryMetadata;

  /** Timestamp when item was obtained */
  readonly obtainedAt: Date;

  /** Timestamp when item expires (null if never) */
  readonly expiresAt: Date | null;

  /** Timestamp when item was created */
  readonly createdAt: Date;

  /** Timestamp when item was last updated */
  readonly updatedAt: Date;

  /** Whether the item is expired */
  readonly isExpired: boolean;

  /** Whether the item is available for use */
  readonly isAvailable: boolean;

  /** Whether the item is stackable */
  readonly isStackable: boolean;
}