/**
 * Create Inventory Item DTO
 *
 * Data transfer object for creating a new inventory item.
 * Contains all required and optional data for item creation.
 */

import type { ItemAcquisitionSource } from '../types/InventoryMetadata';

/**
 * Input for creating a new inventory item.
 */
export interface CreateInventoryItemDto {
  /** Associated inventory ID */
  inventoryId: string;

  /** Associated artifact ID */
  artifactId: string;

  /** Associated player profile ID (owner) */
  ownerId: string;

  /** Item rarity tier */
  rarity: string;

  /** Item quantity (optional, defaults to 1) */
  quantity?: number;

  /** Expiration timestamp (optional) */
  expiresAt?: string;

  /** Acquisition source (optional) */
  source?: ItemAcquisitionSource;
}

/**
 * Validation rules for CreateInventoryItemDto.
 */
export const CREATE_INVENTORY_ITEM_VALIDATION = {
  inventoryId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  artifactId: {
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  ownerId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  rarity: {
    required: true,
    pattern: /^(common|uncommon|rare|epic|legendary|mythic)$/i,
  },
  quantity: {
    required: false,
    min: 0,
    max: 99,
    default: 1,
  },
} as const;