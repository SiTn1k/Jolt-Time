/**
 * Configuration Runtime Cache
 *
 * In-memory cache with TTL support for configuration entries and feature flags.
 * Provides lazy loading, cache refresh, and cache invalidation capabilities.
 */

import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('ConfigurationCache');

/**
 * Cache entry with metadata.
 */
export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  createdAt: number;
  hitCount: number;
}

/**
 * Cache statistics.
 */
export interface CacheStatistics {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  hitRate: number;
}

/**
 * Configuration cache options.
 */
export interface ConfigurationCacheOptions {
  /** Default TTL in milliseconds */
  defaultTtlMs?: number;
  /** Maximum cache size */
  maxSize?: number;
  /** Enable lazy loading */
  lazyLoading?: boolean;
}

/**
 * Default cache options.
 */
export const DEFAULT_CACHE_OPTIONS: Required<ConfigurationCacheOptions> = {
  defaultTtlMs: 5 * 60 * 1000, // 5 minutes
  maxSize: 1000,
  lazyLoading: true,
};

/**
 * Runtime cache for configuration entries and feature flags.
 * Supports TTL, lazy loading, cache refresh, and invalidation.
 */
export class ConfigurationCache {
  private readonly entryCache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly flagCache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly options: Required<ConfigurationCacheOptions>;
  private hits = 0;
  private misses = 0;
  private evictions = 0;

  /**
   * Creates a new ConfigurationCache instance.
   */
  constructor(options: ConfigurationCacheOptions = {}) {
    this.options = { ...DEFAULT_CACHE_OPTIONS, ...options };
    logger.debug('ConfigurationCache initialized', { options: this.options });
  }

  /**
   * Gets a value from cache.
   * @param key Cache key
   * @param cacheType Type of cache ('entry' or 'flag')
   * @returns Cached value or null if not found/expired
   */
  public get<T>(key: string, cacheType: 'entry' | 'flag' = 'entry'): T | null {
    const cache = cacheType === 'entry' ? this.entryCache : this.flagCache;
    const entry = cache.get(key);

    if (!entry) {
      this.misses++;
      logger.debug('Cache miss', { key, cacheType });
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      cache.delete(key);
      this.misses++;
      this.evictions++;
      logger.debug('Cache expired', { key, cacheType });
      return null;
    }

    entry.hitCount++;
    this.hits++;
    logger.debug('Cache hit', { key, cacheType, hitCount: entry.hitCount });
    return entry.value as T;
  }

  /**
   * Sets a value in cache.
   * @param key Cache key
   * @param value Value to cache
   * @param ttlMs TTL in milliseconds (uses default if not specified)
   * @param cacheType Type of cache ('entry' or 'flag')
   */
  public set<T>(key: string, value: T, ttlMs?: number, cacheType: 'entry' | 'flag' = 'entry'): void {
    const cache = cacheType === 'entry' ? this.entryCache : this.flagCache;
    const ttl = ttlMs ?? this.options.defaultTtlMs;
    const now = Date.now();

    // Evict if at max size
    if (cache.size >= this.options.maxSize && !cache.has(key)) {
      this.evictOldest(cache);
    }

    const entry: CacheEntry<T> = {
      value,
      expiresAt: now + ttl,
      createdAt: now,
      hitCount: 0,
    };

    cache.set(key, entry as CacheEntry<unknown>);
    logger.debug('Cache set', { key, cacheType, ttlMs: ttl });
  }

  /**
   * Deletes a value from cache.
   * @param key Cache key
   * @param cacheType Type of cache ('entry' or 'flag')
   */
  public delete(key: string, cacheType: 'entry' | 'flag' = 'entry'): void {
    const cache = cacheType === 'entry' ? this.entryCache : this.flagCache;
    if (cache.delete(key)) {
      logger.debug('Cache deleted', { key, cacheType });
    }
  }

  /**
   * Invalidates all entries in a cache type.
   * @param cacheType Type of cache ('entry' or 'flag' or 'all')
   */
  public invalidate(cacheType: 'entry' | 'flag' | 'all' = 'all'): void {
    if (cacheType === 'entry' || cacheType === 'all') {
      const count = this.entryCache.size;
      this.entryCache.clear();
      logger.info('Entry cache invalidated', { count });
    }
    if (cacheType === 'flag' || cacheType === 'all') {
      const count = this.flagCache.size;
      this.flagCache.clear();
      logger.info('Feature flag cache invalidated', { count });
    }
  }

  /**
   * Refreshes a cache entry by updating its TTL.
   * @param key Cache key
   * @param cacheType Type of cache ('entry' or 'flag')
   * @param ttlMs New TTL in milliseconds
   * @returns true if entry was refreshed
   */
  public refresh(key: string, cacheType: 'entry' | 'flag' = 'entry', ttlMs?: number): boolean {
    const cache = cacheType === 'entry' ? this.entryCache : this.flagCache;
    const entry = cache.get(key);

    if (!entry) {
      return false;
    }

    const ttl = ttlMs ?? this.options.defaultTtlMs;
    entry.expiresAt = Date.now() + ttl;
    logger.debug('Cache refreshed', { key, cacheType, ttlMs: ttl });
    return true;
  }

  /**
   * Checks if a key exists in cache and is not expired.
   * @param key Cache key
   * @param cacheType Type of cache ('entry' or 'flag')
   * @returns true if key exists and is not expired
   */
  public has(key: string, cacheType: 'entry' | 'flag' = 'entry'): boolean {
    const cache = cacheType === 'entry' ? this.entryCache : this.flagCache;
    const entry = cache.get(key);

    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      cache.delete(key);
      this.evictions++;
      return false;
    }

    return true;
  }

  /**
   * Gets cache statistics.
   * @returns Cache statistics
   */
  public getStatistics(): CacheStatistics {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? this.hits / total : 0;

    return {
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      size: this.entryCache.size + this.flagCache.size,
      hitRate,
    };
  }

  /**
   * Clears all statistics.
   */
  public clearStatistics(): void {
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    logger.debug('Cache statistics cleared');
  }

  /**
   * Gets the size of a specific cache.
   * @param cacheType Type of cache ('entry' or 'flag')
   * @returns Number of entries in cache
   */
  public size(cacheType: 'entry' | 'flag'): number {
    return cacheType === 'entry' ? this.entryCache.size : this.flagCache.size;
  }

  /**
   * Gets all keys in a cache.
   * @param cacheType Type of cache ('entry' or 'flag')
   * @returns Array of cache keys
   */
  public keys(cacheType: 'entry' | 'flag'): string[] {
    const cache = cacheType === 'entry' ? this.entryCache : this.flagCache;
    return Array.from(cache.keys());
  }

  /**
   * Cleans up expired entries.
   * @returns Number of entries cleaned
   */
  public cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.entryCache) {
      if (now > entry.expiresAt) {
        this.entryCache.delete(key);
        this.evictions++;
        cleaned++;
      }
    }

    for (const [key, entry] of this.flagCache) {
      if (now > entry.expiresAt) {
        this.flagCache.delete(key);
        this.evictions++;
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug('Cache cleanup completed', { cleaned });
    }

    return cleaned;
  }

  /**
   * Preloads data into cache.
   * @param entries Array of key-value pairs to preload
   * @param cacheType Type of cache ('entry' or 'flag')
   * @param ttlMs TTL in milliseconds
   */
  public preload<T>(entries: Array<{ key: string; value: T }>, cacheType: 'entry' | 'flag' = 'entry', ttlMs?: number): void {
    for (const { key, value } of entries) {
      this.set(key, value, ttlMs, cacheType);
    }
    logger.info('Cache preloaded', { count: entries.length, cacheType });
  }

  /**
   * Evicts the oldest entry from cache.
   */
  private evictOldest(cache: Map<string, CacheEntry<unknown>>): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of cache) {
      if (entry.createdAt < oldestTime) {
        oldestTime = entry.createdAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      cache.delete(oldestKey);
      this.evictions++;
      logger.debug('Cache evicted oldest', { key: oldestKey });
    }
  }
}
