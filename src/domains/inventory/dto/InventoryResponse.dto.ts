/**
 * Inventory Response DTOs
 *
 * Data transfer objects for inventory API responses.
 */

import type { InventoryStatistics } from '../types/InventoryStatistics';
import type { InventoryItemStatus } from '../types/InventoryItemStatus';
import type { ItemAcquisitionSource } from '../types/InventoryMetadata';

/**
 * Full inventory response DTO.
 */
export interface InventoryResponseDto {
  /** Unique inventory identifier */
  inventoryId: string;

  /** Associated player profile ID */
  playerProfileId: string;

  /** Total inventory capacity */
  capacity: number;

  /** Number of slots used */
  usedSlots: number;

  /** Number of available slots */
  availableSlots: number;

  /** Whether inventory is full */
  isFull: boolean;

  /** Utilization percentage (0-100) */
  utilizationPercentage: number;

  /** Inventory statistics */
  statistics: InventoryStatistics;

  /** Creation timestamp */
  createdAt: string;

  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Inventory item response DTO.
 */
export interface InventoryItemResponseDto {
  /** Unique item identifier */
  itemId: string;

  /** Associated inventory ID */
  inventoryId: string;

  /** Associated artifact ID */
  artifactId: string;

  /** Owner player profile ID */
  ownerId: string;

  /** Item quantity */
  quantity: number;

  /** Item rarity tier */
  rarity: string;

  /** Current item status */
  status: InventoryItemStatus;

  /** Item metadata */
  metadata: {
    source: ItemAcquisitionSource;
    acquiredAt: string;
    lastUsedAt?: string;
    usageCount: number;
    isFavorite: boolean;
    customFields?: Record<string, unknown>;
    version: number;
  };

  /** When item was obtained */
  obtainedAt: string;

  /** When item expires (null if never) */
  expiresAt: string | null;

  /** Creation timestamp */
  createdAt: string;

  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Inventory summary DTO for list views.
 */
export interface InventorySummaryDto {
  /** Unique inventory identifier */
  inventoryId: string;

  /** Number of used slots */
  usedSlots: number;

  /** Total capacity */
  capacity: number;

  /** Utilization percentage */
  utilizationPercentage: number;

  /** Total unique artifacts */
  uniqueArtifacts: number;

  /** Total items */
  totalItems: number;
}

/**
 * Inventory item summary DTO for list views.
 */
export interface InventoryItemSummaryDto {
  /** Unique item identifier */
  itemId: string;

  /** Associated artifact ID */
  artifactId: string;

  /** Item rarity tier */
  rarity: string;

  /** Current status */
  status: InventoryItemStatus;

  /** Item quantity */
  quantity: number;

  /** Whether item is favorited */
  isFavorite: boolean;

  /** When item was obtained */
  obtainedAt: string;
}