/**
 * Memory Cache Engine
 *
 * In-memory cache implementation with support for:
 * - Key Lookup
 * - Object Cache
 * - Region Cache
 * - Versioning
 * - Lazy Loading
 * - Read Through
 * - Write Through
 *
 * IMPORTANT: Cache is a METADATA management layer. It ONLY stores cache entries,
 * regions, and statistics. Cache MUST NEVER modify gameplay, grant rewards,
 * modify balances, modify inventory, or execute business logic.
 */

import type { CacheEntry } from '../entities/CacheEntry';
import type { CacheKey } from '../value-objects/CacheKey';
import type { CacheType } from '../types/CacheType';

/**
 * Cache entry stored in memory.
 */
interface MemoryCacheItem {
  key: string;
  value: unknown;
  cacheType: CacheType;
  version: number;
  createdAt: Date;
  expiresAt: Date | null;
  lastAccessedAt: Date;
  accessCount: number;
  regionName?: string;
}

/**
 * Memory cache statistics.
 */
export interface MemoryCacheStats {
  totalEntries: number;
  totalMemoryUsage: number;
  hits: number;
  misses: number;
  evictions: number;
  averageLifetime: number;
}

/**
 * Eviction policy type.
 */
export type EvictionPolicyType = 'LRU' | 'FIFO';

/**
 * Memory Cache Engine configuration.
 */
export interface MemoryCacheConfig {
  maxEntries?: number;
  maxMemoryUsage?: number;
  evictionPolicy?: EvictionPolicyType;
  defaultTtlSeconds?: number;
}

/**
 * Memory Cache Engine.
 * Provides in-memory caching with region support and eviction policies.
 */
export class MemoryCacheEngine {
  private readonly _cache: Map<string, MemoryCacheItem>;
  private readonly _regionIndex: Map<string, Set<string>>;
  private readonly _accessOrder: string[];
  private readonly _maxEntries: number;
  private readonly _maxMemoryUsage: number;
  private readonly _evictionPolicy: EvictionPolicyType;
  private readonly _defaultTtlSeconds: number | null;

  private _hits = 0;
  private _misses = 0;
  private _evictions = 0;
  private _totalLifetime = 0;

  constructor(config: MemoryCacheConfig = {}) {
    this._cache = new Map();
    this._regionIndex = new Map();
    this._accessOrder = [];
    this._maxEntries = config.maxEntries ?? 10000;
    this._maxMemoryUsage = config.maxMemoryUsage ?? 100 * 1024 * 1024; // 100MB default
    this._evictionPolicy = config.evictionPolicy ?? 'LRU';
    this._defaultTtlSeconds = config.defaultTtlSeconds ?? null;
  }

  /**
   * Get cache entry by key.
   */
  public get(key: string): { hit: boolean; value?: unknown; item?: MemoryCacheItem } {
    const item = this._cache.get(key);

    if (!item) {
      this._misses++;
      return { hit: false };
    }

    // Check expiration
    if (item.expiresAt && new Date() > item.expiresAt) {
      this.delete(key);
      this._misses++;
      return { hit: false };
    }

    // Update access tracking for LRU
    this._updateAccessOrder(key);
    item.lastAccessedAt = new Date();
    item.accessCount++;

    this._hits++;
    return { hit: true, value: item.value, item };
  }

  /**
   * Get cache entry with lazy loading from loader function.
   */
  public getOrLoad(
    key: string,
    loader: () => unknown,
    options?: {
      ttlSeconds?: number;
      cacheType?: CacheType;
      region?: string;
    }
  ): unknown {
    const existing = this.get(key);
    if (existing.hit && existing.value !== undefined) {
      return existing.value;
    }

    // Lazy load
    const value = loader();
    if (value !== undefined) {
      this.set(key, value, options);
    }

    return value;
  }

  /**
   * Set cache entry.
   */
  public set(
    key: string,
    value: unknown,
    options?: {
      ttlSeconds?: number;
      cacheType?: CacheType;
      region?: string;
      version?: number;
    }
  ): void {
    // Check if we need to evict
    this._ensureCapacity();

    const now = new Date();
    let expiresAt: Date | null = null;

    if (options?.ttlSeconds !== undefined && options.ttlSeconds > 0) {
      expiresAt = new Date(now.getTime() + options.ttlSeconds * 1000);
    } else if (this._defaultTtlSeconds !== null) {
      expiresAt = new Date(now.getTime() + this._defaultTtlSeconds * 1000);
    }

    const item: MemoryCacheItem = {
      key,
      value,
      cacheType: options?.cacheType ?? 'memory',
      version: options?.version ?? 1,
      createdAt: now,
      expiresAt,
      lastAccessedAt: now,
      accessCount: 0,
      regionName: options?.region,
    };

    // Update region index
    if (options?.region) {
      this._addToRegion(options.region, key);
    }

    // Store in cache
    const existing = this._cache.get(key);
    if (existing) {
      this._removeFromRegion(existing.regionName, key);
    }

    this._cache.set(key, item);
    this._updateAccessOrder(key);
  }

  /**
   * Set multiple entries atomically (write-through behavior).
   */
  public setMany(
    entries: Array<{ key: string; value: unknown; options?: { ttlSeconds?: number; cacheType?: CacheType; region?: string } }>
  ): void {
    for (const entry of entries) {
      this.set(entry.key, entry.value, entry.options);
    }
  }

  /**
   * Delete cache entry.
   */
  public delete(key: string): boolean {
    const item = this._cache.get(key);
    if (!item) {
      return false;
    }

    this._removeFromRegion(item.regionName, key);
    this._cache.delete(key);
    this._removeFromAccessOrder(key);

    // Track eviction
    this._evictions++;
    this._totalLifetime += Date.now() - item.createdAt.getTime();

    return true;
  }

  /**
   * Delete all entries in a region.
   */
  public deleteRegion(regionName: string): number {
    const keys = this._regionIndex.get(regionName);
    if (!keys) {
      return 0;
    }

    let count = 0;
    for (const key of keys) {
      const item = this._cache.get(key);
      if (item) {
        this._evictions++;
        this._totalLifetime += Date.now() - item.createdAt.getTime();
        this._cache.delete(key);
        count++;
      }
    }

    this._regionIndex.delete(regionName);
    return count;
  }

  /**
   * Clear all entries.
   */
  public clear(): void {
    this._cache.clear();
    this._regionIndex.clear();
    this._accessOrder.length = 0;
  }

  /**
   * Check if key exists.
   */
  public has(key: string): boolean {
    const item = this._cache.get(key);
    if (!item) {
      return false;
    }

    if (item.expiresAt && new Date() > item.expiresAt) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get version of cached entry.
   */
  public getVersion(key: string): number | null {
    const item = this._cache.get(key);
    return item?.version ?? null;
  }

  /**
   * Increment version of cached entry.
   */
  public incrementVersion(key: string): number | null {
    const item = this._cache.get(key);
    if (!item) {
      return null;
    }

    item.version++;
    return item.version;
  }

  /**
   * Get all keys matching a pattern.
   */
  public keys(pattern?: string): string[] {
    if (!pattern) {
      return Array.from(this._cache.keys());
    }

    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return Array.from(this._cache.keys()).filter((key) => regex.test(key));
  }

  /**
   * Get keys in a region.
   */
  public keysInRegion(regionName: string): string[] {
    const keys = this._regionIndex.get(regionName);
    return keys ? Array.from(keys) : [];
  }

  /**
   * Get total entries count.
   */
  public get size(): number {
    return this._cache.size;
  }

  /**
   * Get estimated memory usage.
   */
  public get memoryUsage(): number {
    let total = 0;
    for (const item of this._cache.values()) {
      total += this._estimateSize(item);
    }
    return total;
  }

  /**
   * Get cache statistics.
   */
  public getStats(): MemoryCacheStats {
    const entries = Array.from(this._cache.values());
    const avgLifetime = entries.length > 0
      ? this._totalLifetime / entries.length
      : 0;

    return {
      totalEntries: this._cache.size,
      totalMemoryUsage: this.memoryUsage,
      hits: this._hits,
      misses: this._misses,
      evictions: this._evictions,
      averageLifetime: avgLifetime,
    };
  }

  /**
   * Get hit ratio.
   */
  public getHitRatio(): number {
    const total = this._hits + this._misses;
    if (total === 0) {
      return 0;
    }
    return this._hits / total;
  }

  /**
   * Reset statistics.
   */
  public resetStats(): void {
    this._hits = 0;
    this._misses = 0;
    this._evictions = 0;
    this._totalLifetime = 0;
  }

  /**
   * Invalidate entries by version.
   */
  public invalidateByVersion(version: number): number {
    let count = 0;
    for (const [key, item] of this._cache.entries()) {
      if (item.version === version) {
        this.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Invalidate entries by minimum version.
   */
  public invalidateByMinVersion(minVersion: number): number {
    let count = 0;
    for (const [key, item] of this._cache.entries()) {
      if (item.version >= minVersion) {
        this.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Get all entries as array.
   */
  public entries(): Array<{ key: string; value: unknown; item: MemoryCacheItem }> {
    return Array.from(this._cache.entries()).map(([key, item]) => ({
      key,
      value: item.value,
      item,
    }));
  }

  /**
   * Update access order for LRU policy.
   */
  private _updateAccessOrder(key: string): void {
    if (this._evictionPolicy === 'LRU') {
      this._removeFromAccessOrder(key);
      this._accessOrder.push(key);
    }
  }

  /**
   * Remove from access order.
   */
  private _removeFromAccessOrder(key: string): void {
    const index = this._accessOrder.indexOf(key);
    if (index !== -1) {
      this._accessOrder.splice(index, 1);
    }
  }

  /**
   * Add key to region index.
   */
  private _addToRegion(regionName: string, key: string): void {
    if (!this._regionIndex.has(regionName)) {
      this._regionIndex.set(regionName, new Set());
    }
    this._regionIndex.get(regionName)!.add(key);
  }

  /**
   * Remove key from region index.
   */
  private _removeFromRegion(regionName: string | undefined, key: string): void {
    if (!regionName) {
      return;
    }
    const keys = this._regionIndex.get(regionName);
    if (keys) {
      keys.delete(key);
      if (keys.size === 0) {
        this._regionIndex.delete(regionName);
      }
    }
  }

  /**
   * Ensure capacity is available.
   */
  private _ensureCapacity(): void {
    // Check entry count
    while (this._cache.size >= this._maxEntries) {
      this._evictOne();
    }

    // Check memory usage
    while (this.memoryUsage >= this._maxMemoryUsage && this._cache.size > 0) {
      this._evictOne();
    }
  }

  /**
   * Evict one entry based on policy.
   */
  private _evictOne(): boolean {
    if (this._cache.size === 0) {
      return false;
    }

    let keyToEvict: string | null = null;

    if (this._evictionPolicy === 'LRU') {
      // Evict least recently used (first in access order)
      keyToEvict = this._accessOrder.shift() ?? null;
    } else if (this._evictionPolicy === 'FIFO') {
      // Evict oldest (last in access order)
      keyToEvict = this._accessOrder.pop() ?? null;
    }

    if (keyToEvict) {
      const item = this._cache.get(keyToEvict);
      if (item) {
        this._removeFromRegion(item.regionName, keyToEvict);
        this._cache.delete(keyToEvict);
        this._evictions++;
        this._totalLifetime += Date.now() - item.createdAt.getTime();
        return true;
      }
    }

    return false;
  }

  /**
   * Estimate size of an item in bytes.
   */
  private _estimateSize(item: MemoryCacheItem): number {
    const keySize = item.key.length * 2; // UTF-16
    const valueSize = JSON.stringify(item.value).length * 2;
    return keySize + valueSize + 200; // overhead for other fields
  }
}
