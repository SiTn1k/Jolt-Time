/**
 * Inventory Statistics Type
 *
 * Statistics about a player's inventory.
 */

/**
 * Statistics for an inventory.
 */
export interface InventoryStatistics {
  /** Total items in inventory */
  totalItems: number;
  
  /** Total unique artifacts */
  uniqueArtifacts: number;
  
  /** Total duplicates */
  totalDuplicates: number;
  
  /** Total item slots used */
  usedSlots: number;
  
  /** Available slots remaining */
  availableSlots: number;
  
  /** Capacity utilization percentage */
  utilizationPercentage: number;
  
  /** Count by rarity */
  itemsByRarity: Record<string, number>;
  
  /** Count by item type */
  itemsByType: Record<string, number>;
  
  /** Most recent acquisition timestamp */
  lastAcquiredAt?: string;
  
  /** Total value estimate */
  totalValue: number;
}

/**
 * Initial inventory statistics.
 */
export const INITIAL_INVENTORY_STATISTICS: InventoryStatistics = {
  totalItems: 0,
  uniqueArtifacts: 0,
  totalDuplicates: 0,
  usedSlots: 0,
  availableSlots: 100,
  utilizationPercentage: 0,
  itemsByRarity: {},
  itemsByType: {},
  totalValue: 0,
};