/**
 * Inventory Filters Type
 *
 * Filter parameters for querying inventory items.
 */

import type { InventoryItemStatus } from './InventoryItemStatus';
import type { ItemAcquisitionSource } from './InventoryMetadata';

/**
 * Era filter options.
 */
export enum EraFilter {
  ANCIENT_WORLD = 'ancient_world',
  CLASSICAL_ERA = 'classical_era',
  MIDDLE_AGES = 'middle_ages',
  RENAISSANCE = 'renaissance',
  INDUSTRIAL_AGE = 'industrial_age',
  MODERN_ERA = 'modern_era',
}

/**
 * Rarity filter options.
 */
export enum RarityFilter {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
}

/**
 * Artifact type filter options.
 */
export enum TypeFilter {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  DOCUMENT = 'document',
  RELIC = 'relic',
  SCIENTIFIC_ITEM = 'scientific_item',
  ROYAL_ARTIFACT = 'royal_artifact',
  MILITARY_ARTIFACT = 'military_artifact',
  CULTURAL_ARTIFACT = 'cultural_artifact',
}

/**
 * Sort options for inventory items.
 */
export enum InventorySortOption {
  NEWEST_FIRST = 'newest',
  OLDEST_FIRST = 'oldest',
  HIGHEST_RARITY = 'rarity',
  ALPHABETICAL = 'alpha',
  MOST_USED = 'used',
  BY_TYPE = 'type',
}

/**
 * Filters for querying inventory items.
 */
export interface InventoryFilters {
  /** Filter by era */
  era?: EraFilter[];
  
  /** Filter by rarity */
  rarity?: RarityFilter[];
  
  /** Filter by artifact type */
  type?: TypeFilter[];
  
  /** Filter by item status */
  status?: InventoryItemStatus[];
  
  /** Filter by acquisition source */
  source?: ItemAcquisitionSource[];
  
  /** Filter by favorites only */
  favoritesOnly?: boolean;
  
  /** Filter by search query */
  searchQuery?: string;
  
  /** Minimum level filter */
  minLevel?: number;
  
  /** Maximum level filter */
  maxLevel?: number;
  
  /** Filter by artifact ID */
  artifactId?: string;
  
  /** Filter by item ID */
  itemId?: string;
}

/**
 * Default filters for inventory queries.
 */
export const DEFAULT_INVENTORY_FILTERS: InventoryFilters = {
  favoritesOnly: false,
};