/**
 * ICacheRepository Interface
 *
 * Interface defining the contract for cache persistence operations.
 * Implemented by SupabaseCacheRepository.
 */

import type { CacheEntry } from '../entities/CacheEntry';
import type { CacheRegion } from '../entities/CacheRegion';
import type { CacheStatistics } from '../entities/CacheStatistics';
import type { CacheKey } from '../value-objects/CacheKey';
import type { RegionId } from '../value-objects/RegionId';
import type { StatisticsId } from '../value-objects/StatisticsId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for cache entry queries.
 */
export interface CacheEntryFilterParams {
  cacheType?: string;
  status?: string;
  regionId?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  expiresAfter?: Date;
  expiresBefore?: Date;
}

/**
 * Filter parameters for cache region queries.
 */
export interface CacheRegionFilterParams {
  regionType?: string;
  enabled?: boolean;
  regionName?: string;
}

/**
 * Filter parameters for cache statistics queries.
 */
export interface CacheStatisticsFilterParams {
  periodStart?: Date;
  periodEnd?: Date;
}

/**
 * CacheRepository interface.
 * Defines the contract for cache persistence operations.
 */
export interface ICacheRepository {
  // ============ Cache Entry Operations ============

  /**
   * Creates a new cache entry.
   */
  createEntry(entry: CacheEntry): Promise<CacheEntry>;

  /**
   * Finds a cache entry by its key.
   */
  findEntryByKey(key: CacheKey): Promise<CacheEntry | null>;

  /**
   * Lists cache entries with pagination and filtering.
   */
  listEntries(
    params: PaginationParams,
    filters?: CacheEntryFilterParams
  ): Promise<PaginatedResult<CacheEntry>>;

  /**
   * Counts cache entries with optional filtering.
   */
  countEntries(filters?: CacheEntryFilterParams): Promise<number>;

  /**
   * Updates an existing cache entry.
   */
  updateEntry(entry: CacheEntry): Promise<CacheEntry>;

  /**
   * Deletes a cache entry by key.
   */
  deleteEntry(key: CacheKey): Promise<boolean>;

  /**
   * Deletes multiple cache entries by keys.
   */
  deleteEntries(keys: CacheKey[]): Promise<number>;

  // ============ Cache Region Operations ============

  /**
   * Creates a new cache region.
   */
  createRegion(region: CacheRegion): Promise<CacheRegion>;

  /**
   * Finds a cache region by its ID.
   */
  findRegionById(id: RegionId): Promise<CacheRegion | null>;

  /**
   * Finds a cache region by its name.
   */
  findRegionByName(name: string): Promise<CacheRegion | null>;

  /**
   * Lists cache regions with pagination and filtering.
   */
  listRegions(
    params: PaginationParams,
    filters?: CacheRegionFilterParams
  ): Promise<PaginatedResult<CacheRegion>>;

  /**
   * Counts cache regions with optional filtering.
   */
  countRegions(filters?: CacheRegionFilterParams): Promise<number>;

  /**
   * Updates an existing cache region.
   */
  updateRegion(region: CacheRegion): Promise<CacheRegion>;

  /**
   * Deletes a cache region by ID.
   */
  deleteRegion(id: RegionId): Promise<boolean>;

  // ============ Cache Statistics Operations ============

  /**
   * Creates a new cache statistics record.
   */
  createStatistics(statistics: CacheStatistics): Promise<CacheStatistics>;

  /**
   * Finds cache statistics by ID.
   */
  findStatisticsById(id: StatisticsId): Promise<CacheStatistics | null>;

  /**
   * Lists cache statistics with pagination and filtering.
   */
  listStatistics(
    params: PaginationParams,
    filters?: CacheStatisticsFilterParams
  ): Promise<PaginatedResult<CacheStatistics>>;

  /**
   * Counts cache statistics records with optional filtering.
   */
  countStatistics(filters?: CacheStatisticsFilterParams): Promise<number>;

  /**
   * Updates existing cache statistics.
   */
  updateStatistics(statistics: CacheStatistics): Promise<CacheStatistics>;

  /**
   * Deletes cache statistics by ID.
   */
  deleteStatistics(id: StatisticsId): Promise<boolean>;
}
