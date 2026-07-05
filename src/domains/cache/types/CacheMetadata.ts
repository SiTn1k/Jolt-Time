/**
 * CacheMetadata
 *
 * Type definitions for cache metadata.
 * Additional descriptive information about cache entries and regions.
 */

/**
 * Cache entry metadata.
 */
export interface CacheEntryMetadata {
  /** Human-readable description */
  description?: string;

  /** Tags for categorization */
  tags?: string[];

  /** Source of the cached data */
  source?: string;

  /** User ID who created this entry */
  createdBy?: string;

  /** Last access timestamp (ISO string) */
  lastAccessedAt?: string;

  /** Access count */
  accessCount?: number;

  /** Custom metadata fields */
  customFields?: Record<string, string>;
}

/**
 * Cache region metadata.
 */
export interface CacheRegionMetadata {
  /** Human-readable description */
  description?: string;

  /** Tags for categorization */
  tags?: string[];

  /** User ID who created this region */
  createdBy?: string;

  /** Maximum entry count */
  maxEntries?: number;

  /** TTL in seconds */
  defaultTtlSeconds?: number;

  /** Whether compression is enabled */
  compressionEnabled?: boolean;

  /** Custom metadata fields */
  customFields?: Record<string, string>;
}

/**
 * Cache statistics metadata.
 */
export interface CacheStatisticsMetadata {
  /** Time window for statistics */
  timeWindow?: string;

  /** Collection period start */
  periodStart?: string;

  /** Collection period end */
  periodEnd?: string;

  /** Custom metadata fields */
  customFields?: Record<string, string>;
}

/**
 * Initial/empty cache entry metadata.
 */
export const INITIAL_CACHE_ENTRY_METADATA: CacheEntryMetadata = {
  description: '',
  tags: [],
  source: undefined,
  createdBy: undefined,
  lastAccessedAt: undefined,
  accessCount: 0,
  customFields: {},
};

/**
 * Initial/empty cache region metadata.
 */
export const INITIAL_CACHE_REGION_METADATA: CacheRegionMetadata = {
  description: '',
  tags: [],
  createdBy: undefined,
  maxEntries: undefined,
  defaultTtlSeconds: undefined,
  compressionEnabled: false,
  customFields: {},
};

/**
 * Initial/empty cache statistics metadata.
 */
export const INITIAL_CACHE_STATISTICS_METADATA: CacheStatisticsMetadata = {
  timeWindow: undefined,
  periodStart: undefined,
  periodEnd: undefined,
  customFields: {},
};
