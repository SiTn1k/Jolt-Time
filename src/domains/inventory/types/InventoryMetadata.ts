/**
 * Inventory Metadata Type
 *
 * Extended metadata for inventory items.
 */

/**
 * Source of item acquisition.
 */
export enum ItemAcquisitionSource {
  MISSION_REWARD = 'mission_reward',
  CAPSULE_OPEN = 'capsule_open',
  EVENT_REWARD = 'event_reward',
  ACHIEVEMENT_REWARD = 'achievement_reward',
  DAILY_LOGIN = 'daily_login',
  PURCHASED = 'purchased',
  GIFTED = 'gifted',
  CRAFTED = 'crafted',
  TRADED = 'traded',
}

/**
 * Extended metadata for an inventory item.
 */
export interface InventoryMetadata {
  /** Source of how the item was acquired */
  source: ItemAcquisitionSource;
  
  /** Acquisition timestamp */
  acquiredAt: string;
  
  /** Last used timestamp */
  lastUsedAt?: string;
  
  /** Number of times item has been used */
  usageCount: number;
  
  /** Whether item is marked as favorite */
  isFavorite: boolean;
  
  /** Custom metadata fields */
  customFields?: Record<string, unknown>;
  
  /** Schema version for migrations */
  version: number;
}

/**
 * Initial metadata for a newly acquired item.
 */
export const INITIAL_INVENTORY_METADATA: InventoryMetadata = {
  source: ItemAcquisitionSource.MISSION_REWARD,
  acquiredAt: new Date().toISOString(),
  usageCount: 0,
  isFavorite: false,
  version: 1,
};