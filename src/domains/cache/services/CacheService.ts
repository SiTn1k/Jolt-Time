/**
 * Cache Service
 *
 * Main cache service that orchestrates:
 * - Store
 * - Load
 * - Refresh
 * - Invalidate
 * - Delete
 * - Region Summary
 * - Statistics Summary
 *
 * Implements failure handling: If cache fails, load directly from repository.
 * Log failure. Cache must never block gameplay.
 *
 * IMPORTANT: Cache is a METADATA management layer. It ONLY stores cache entries,
 * regions, and statistics. Cache MUST NEVER:
 * - Modify gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 * - Execute business logic
 */

import type { CacheEntry } from '../entities/CacheEntry';
import { CacheStatistics } from '../entities/CacheStatistics';
import type { CacheKey } from '../value-objects/CacheKey';
import type { CacheType } from '../types/CacheType';
import type { ICacheRepository } from '../interfaces/ICacheRepository';
import type { MemoryCacheEngine, MemoryCacheStats } from './MemoryCacheEngine';
import type { TTLEngine } from './TTLEngine';
import type { CacheInvalidation, InvalidationResult } from './CacheInvalidation';
import type { CacheMapper } from '../mappers/CacheMapper';
import type { RegionMapper } from '../mappers/RegionMapper';
import type { StatisticsMapper } from '../mappers/StatisticsMapper';
import { CacheEntry as CacheEntryEntity } from '../entities/CacheEntry';
import { CacheKey as CacheKeyVO } from '../value-objects/CacheKey';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('CacheService');

/**
 * Cache service configuration.
 */
export interface CacheServiceConfig {
  enableWriteThrough?: boolean;
  enableReadThrough?: boolean;
  defaultTTLSeconds?: number;
  maxEntries?: number;
  maxMemoryUsage?: number;
  evictionPolicy?: 'LRU' | 'FIFO';
}

/**
 * Cache operation result.
 */
export interface CacheResult<T> {
  success: boolean;
  data?: T;
  source: 'cache' | 'repository' | 'loader';
  error?: string;
  cachedAt?: Date;
}

/**
 * Cache service for managing cache operations.
 */
export class CacheService {
  private readonly _repository: ICacheRepository;
  private readonly _cache: MemoryCacheEngine;
  private readonly _ttlEngine: TTLEngine;
  private readonly _invalidation: CacheInvalidation;
  private readonly _cacheMapper: CacheMapper;
  private readonly _regionMapper: RegionMapper;
  private readonly _statisticsMapper: StatisticsMapper;
  private readonly _enableWriteThrough: boolean;
  private readonly _enableReadThrough: boolean;
  private readonly _defaultTTLSeconds: number | null;

  constructor(
    repository: ICacheRepository,
    cache: MemoryCacheEngine,
    ttlEngine: TTLEngine,
    invalidation: CacheInvalidation,
    cacheMapper: CacheMapper,
    regionMapper: RegionMapper,
    statisticsMapper: StatisticsMapper,
    config: CacheServiceConfig = {}
  ) {
    this._repository = repository;
    this._cache = cache;
    this._ttlEngine = ttlEngine;
    this._invalidation = invalidation;
    this._cacheMapper = cacheMapper;
    this._regionMapper = regionMapper;
    this._statisticsMapper = statisticsMapper;
    this._enableWriteThrough = config.enableWriteThrough ?? true;
    this._enableReadThrough = config.enableReadThrough ?? true;
    this._defaultTTLSeconds = config.defaultTTLSeconds ?? 3600;
  }

  /**
   * Store a value in the cache.
   */
  public async store(
    key: string,
    value: unknown,
    options?: {
      ttlSeconds?: number;
      cacheType?: CacheType;
      region?: string;
      version?: number;
    }
  ): Promise<CacheResult<void>> {
    try {
      // Store in memory cache
      this._cache.set(key, value, {
        ttlSeconds: options?.ttlSeconds ?? this._defaultTTLSeconds ?? undefined,
        cacheType: options?.cacheType,
        region: options?.region,
        version: options?.version,
      });

      // Write through to repository if enabled
      if (this._enableWriteThrough) {
        try {
          const entry = CacheEntryEntity.create({
            cacheKey: CacheKeyVO.create(key),
            cacheValue: value,
            cacheType: options?.cacheType ?? 'memory',
            expiresAt: options?.ttlSeconds
              ? new Date(Date.now() + options.ttlSeconds * 1000)
              : null,
            version: options?.version ?? 1,
          });

          await this._repository.createEntry(entry);
          logger.debug(`Cache stored in repository: ${key}`);
        } catch (repoError) {
          // Log but don't fail - cache is primary
          logger.warn(`Failed to write-through cache to repository: ${key}`, {
            error: repoError instanceof Error ? repoError.message : String(repoError),
          });
        }
      }

      return { success: true, source: 'cache' };
    } catch (error) {
      logger.error(`Failed to store cache: ${key}`, error as Error);
      return {
        success: false,
        source: 'cache',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Load a value from cache or repository.
   */
  public async load(
    key: string,
    loader?: () => Promise<unknown>
  ): Promise<CacheResult<unknown>> {
    // Try memory cache first
    const cached = this._cache.get(key);
    if (cached.hit && cached.value !== undefined) {
      return {
        success: true,
        data: cached.value,
        source: 'cache',
        cachedAt: cached.item?.createdAt,
      };
    }

    // Try repository if read-through is enabled
    if (this._enableReadThrough) {
      try {
        const repoKey = CacheKeyVO.create(key);
        const entry = await this._repository.findEntryByKey(repoKey);

        if (entry && entry.canUse) {
          // Store in memory cache
          this._cache.set(key, entry.cacheValue, {
            cacheType: entry.cacheType,
            version: entry.version,
          });

          return {
            success: true,
            data: entry.cacheValue,
            source: 'repository',
            cachedAt: entry.createdAt,
          };
        }
      } catch (repoError) {
        logger.warn(`Failed to load from repository: ${key}`, {
          error: repoError instanceof Error ? repoError.message : String(repoError),
        });
      }
    }

    // Try loader if provided
    if (loader) {
      try {
        const value = await loader();

        if (value !== undefined) {
          // Store in cache
          this._cache.set(key, value, {
            ttlSeconds: this._defaultTTLSeconds ?? undefined,
          });

          return {
            success: true,
            data: value,
            source: 'loader',
          };
        }
      } catch (loadError) {
        logger.error(`Loader failed for: ${key}`, loadError as Error);
        return {
          success: false,
          source: 'loader',
          error: loadError instanceof Error ? loadError.message : String(loadError),
        };
      }
    }

    return {
      success: false,
      source: 'cache',
      error: 'Cache miss',
    };
  }

  /**
   * Refresh a cache entry (update TTL and return fresh data).
   */
  public async refresh(
    key: string,
    loader?: () => Promise<unknown>
  ): Promise<CacheResult<unknown>> {
    // Invalidate existing entry
    this._invalidation.invalidateKey(key, 'manual');

    // Reload
    return this.load(key, loader);
  }

  /**
   * Invalidate a cache entry.
   */
  public invalidate(key: string, reason?: string): InvalidationResult {
    return this._invalidation.invalidateKey(key, 'manual');
  }

  /**
   * Invalidate all entries in a region.
   */
  public invalidateRegion(regionName: string): InvalidationResult {
    return this._invalidation.invalidateRegion(regionName, 'region_cleared');
  }

  /**
   * Invalidate all cache entries (global flush).
   */
  public invalidateAll(): InvalidationResult {
    return this._invalidation.invalidateAll('global_flush');
  }

  /**
   * Invalidate by version.
   */
  public invalidateByVersion(version: number): InvalidationResult {
    return this._invalidation.invalidateByVersion(version, 'version_changed');
  }

  /**
   * Delete a cache entry.
   */
  public async delete(key: string): Promise<boolean> {
    // Delete from memory cache
    const deleted = this._cache.delete(key);

    // Delete from repository
    try {
      const repoKey = CacheKeyVO.create(key);
      await this._repository.deleteEntry(repoKey);
    } catch (error) {
      logger.warn(`Failed to delete from repository: ${key}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return deleted;
  }

  /**
   * Check if key exists in cache.
   */
  public has(key: string): boolean {
    return this._cache.has(key);
  }

  /**
   * Get memory cache statistics.
   */
  public getMemoryStats(): MemoryCacheStats {
    return this._cache.getStats();
  }

  /**
   * Get cache hit ratio.
   */
  public getHitRatio(): number {
    return this._cache.getHitRatio();
  }

  /**
   * Get cache summary statistics.
   */
  public async getStatisticsSummary(): Promise<CacheStatistics> {
    const stats = this._cache.getStats();

    return CacheStatistics.create({
      hits: stats.hits,
      misses: stats.misses,
      evictions: stats.evictions,
      entries: stats.totalEntries,
      memoryUsage: stats.totalMemoryUsage,
    });
  }

  /**
   * Get region summary.
   */
  public getRegionSummary(): Array<{
    regionName: string;
    entryCount: number;
    keys: string[];
  }> {
    const summary: Array<{
      regionName: string;
      entryCount: number;
      keys: string[];
    }> = [];

    // Get unique regions from cache
    const allKeys = this._cache.keys();
    const regionMap = new Map<string, string[]>();

    for (const key of allKeys) {
      const item = this._cache.get(key);
      if (item.item?.regionName) {
        const regionName = item.item.regionName;
        if (!regionMap.has(regionName)) {
          regionMap.set(regionName, []);
        }
        regionMap.get(regionName)!.push(key);
      }
    }

    for (const [regionName, keys] of regionMap) {
      summary.push({
        regionName,
        entryCount: keys.length,
        keys,
      });
    }

    return summary;
  }

  /**
   * Store many entries at once.
   */
  public async storeMany(
    entries: Array<{
      key: string;
      value: unknown;
      options?: {
        ttlSeconds?: number;
        cacheType?: CacheType;
        region?: string;
        version?: number;
      };
    }>
  ): Promise<CacheResult<void>> {
    try {
      for (const entry of entries) {
        this._cache.set(entry.key, entry.value, entry.options);
      }

      if (this._enableWriteThrough) {
        try {
          for (const entry of entries) {
            const cacheEntry = CacheEntryEntity.create({
              cacheKey: CacheKeyVO.create(entry.key),
              cacheValue: entry.value,
              cacheType: entry.options?.cacheType ?? 'memory',
              expiresAt: entry.options?.ttlSeconds
                ? new Date(Date.now() + entry.options.ttlSeconds * 1000)
                : null,
              version: entry.options?.version ?? 1,
            });

            await this._repository.createEntry(cacheEntry);
          }
        } catch (repoError) {
          logger.warn(`Failed to write-through cache entries to repository`, {
            error: repoError instanceof Error ? repoError.message : String(repoError),
          });
        }
      }

      return { success: true, source: 'cache' };
    } catch (error) {
      logger.error('Failed to store many cache entries', error as Error);
      return {
        success: false,
        source: 'cache',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Clear all cache entries.
   */
  public clear(): void {
    this._cache.clear();
  }

  /**
   * Register a dependency for cache invalidation.
   */
  public registerDependency(dependentKey: string, dependencyKeys: string[]): void {
    this._invalidation.registerDependency(dependentKey, dependencyKeys);
  }

  /**
   * Get cache size.
   */
  public get size(): number {
    return this._cache.size;
  }

  /**
   * Get estimated memory usage.
   */
  public get memoryUsage(): number {
    return this._cache.memoryUsage;
  }

  /**
   * Reset cache statistics.
   */
  public resetStats(): void {
    this._cache.resetStats();
  }

  /**
   * Check cache health.
   */
  public isHealthy(): boolean {
    // Basic health check - cache should be operational
    return this._cache.size >= 0;
  }
}
