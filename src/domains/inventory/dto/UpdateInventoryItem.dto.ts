/**
 * Update Inventory Item DTO
 *
 * Data transfer object for updating an existing inventory item.
 * Contains all updatable fields for inventory items.
 */

import type { InventoryItemStatus } from '../types/InventoryItemStatus';
import type { ItemAcquisitionSource } from '../types/InventoryMetadata';

/**
 * Input for updating an inventory item.
 */
export interface UpdateInventoryItemDto {
  /** Item ID to update */
  itemId: string;

  /** New quantity (optional) */
  quantity?: number;

  /** New status (optional) */
  status?: InventoryItemStatus;

  /** New expiration timestamp (optional) */
  expiresAt?: string | null;

  /** Mark/unmark as favorite (optional) */
  isFavorite?: boolean;

  /** New acquisition source (optional) */
  source?: ItemAcquisitionSource;

  /** Custom metadata fields to merge (optional) */
  customFields?: Record<string, unknown>;
}

/**
 * Validation rules for UpdateInventoryItemDto.
 */
export const UPDATE_INVENTORY_ITEM_VALIDATION = {
  itemId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  quantity: {
    required: false,
    min: 0,
    max: 99,
  },
  status: {
    required: false,
    pattern: /^(active|equipped|vaulted|listed|trading|locked|expired|pending)$/i,
  },
} as const;