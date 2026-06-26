/**
 * Cache Manager
 *
 * Abstraction layer for caching with support for multiple backends.
 */

/**
 * Cache options.
 */
export interface CacheOptions {
  /** Time to live in milliseconds */
  ttlMs?: number;
  /** Whether to use compression */
  compress?: boolean;
  /** Cache namespace */
  namespace?: string;
}

/**
 * Cache entry metadata.
 */
export interface CacheEntry<T> {
  key: string;
  value: T;
  expiresAt: Date | null;
  createdAt: Date;
  hitCount: number;
}

/**
 * Cache statistics.
 */
export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
  totalKeys: number;
  memorySizeBytes?: number;
}

/**
 * Cache backend interface.
 */
export interface ICacheBackend {
  /**
   * Get a value from cache.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Set a value in cache.
   */
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;

  /**
   * Delete a value from cache.
   */
  delete(key: string): Promise<boolean>;

  /**
   * Check if key exists.
   */
  has(key: string): Promise<boolean>;

  /**
   * Clear all cache.
   */
  clear(): Promise<void>;

  /**
   * Get multiple values.
   */
  getMany<T>(keys: string[]): Promise<(T | null)[]>;

  /**
   * Set multiple values.
   */
  setMany<T>(entries: Array<{ key: string; value: T; options?: CacheOptions }>): Promise<void>;

  /**
   * Delete multiple values by pattern.
   */
  deleteMany(keys: string[]): Promise<number>;

  /**
   * Get cache statistics.
   */
  getStats(): Promise<CacheStats>;
}

/**
 * Memory cache backend implementation.
 */
export class MemoryCacheBackend implements ICacheBackend {
  private cache = new Map<string, CacheEntry<unknown>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    hitRate: 0,
    totalKeys: 0,
  };
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;
  private defaultTtlMs = 60000;

  constructor(defaultTtlMs = 60000) {
    this.defaultTtlMs = defaultTtlMs;
    this.startCleanup();
  }

  /**
   * Get a value from cache.
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    if (entry.expiresAt && entry.expiresAt <= new Date()) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    entry.hitCount++;
    this.stats.hits++;
    this.updateHitRate();
    return entry.value as T;
  }

  /**
   * Set a value in cache.
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const ttlMs = options?.ttlMs || this.defaultTtlMs;
    const expiresAt = ttlMs > 0 ? new Date(Date.now() + ttlMs) : null;

    this.cache.set(key, {
      key,
      value,
      expiresAt,
      createdAt: new Date(),
      hitCount: 0,
    });

    this.stats.sets++;
    this.stats.totalKeys = this.cache.size;
  }

  /**
   * Delete a value from cache.
   */
  async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
      this.stats.totalKeys = this.cache.size;
    }
    return deleted;
  }

  /**
   * Check if key exists.
   */
  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (entry.expiresAt && entry.expiresAt <= new Date()) {
      this.cache.delete(key);
      this.stats.totalKeys = this.cache.size;
      return false;
    }
    return true;
  }

  /**
   * Clear all cache.
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.stats.totalKeys = 0;
  }

  /**
   * Get multiple values.
   */
  async getMany<T>(keys: string[]): Promise<(T | null)[]> {
    return Promise.all(keys.map((key) => this.get<T>(key)));
  }

  /**
   * Set multiple values.
   */
  async setMany<T>(entries: Array<{ key: string; value: T; options?: CacheOptions }>): Promise<void> {
    await Promise.all(entries.map(({ key, value, options }) => this.set(key, value, options)));
  }

  /**
   * Delete multiple values.
   */
  async deleteMany(keys: string[]): Promise<number> {
    let deleted = 0;
    for (const key of keys) {
      if (await this.delete(key)) deleted++;
    }
    return deleted;
  }

  /**
   * Get cache statistics.
   */
  async getStats(): Promise<CacheStats> {
    return { ...this.stats };
  }

  /**
   * Start cleanup of expired entries.
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = new Date();
      for (const [key, entry] of this.cache.entries()) {
        if (entry.expiresAt && entry.expiresAt <= now) {
          this.cache.delete(key);
        }
      }
      this.stats.totalKeys = this.cache.size;
    }, this.defaultTtlMs);
  }

  /**
   * Update hit rate calculation.
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  /**
   * Cleanup resources.
   */
  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }
}

/**
 * Cache manager providing caching interface.
 */
export class CacheManager {
  private backend: ICacheBackend;
  private namespace: string;

  constructor(backend: ICacheBackend, namespace = 'jolt') {
    this.backend = backend;
    this.namespace = namespace;
  }

  /**
   * Get a namespaced key.
   */
  private getNamespacedKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  /**
   * Get a value from cache.
   */
  async get<T>(key: string): Promise<T | null> {
    return this.backend.get<T>(this.getNamespacedKey(key));
  }

  /**
   * Set a value in cache.
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    return this.backend.set(this.getNamespacedKey(key), value, options);
  }

  /**
   * Delete a value from cache.
   */
  async delete(key: string): Promise<boolean> {
    return this.backend.delete(this.getNamespacedKey(key));
  }

  /**
   * Check if key exists.
   */
  async has(key: string): Promise<boolean> {
    return this.backend.has(this.getNamespacedKey(key));
  }

  /**
   * Clear all cache.
   */
  async clear(): Promise<void> {
    return this.backend.clear();
  }

  /**
   * Get or set a value (cache-aside pattern).
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);
    return value;
  }

  /**
   * Delete by pattern (simple prefix match).
   */
  async deleteByPattern(_pattern: string): Promise<number> {
    // Note: This is a simplified implementation
    // Real pattern deletion would require backend support
    return 0;
  }

  /**
   * Get cache statistics.
   */
  async getStats(): Promise<CacheStats> {
    return this.backend.getStats();
  }

  /**
   * Get the underlying backend.
   */
  getBackend(): ICacheBackend {
    return this.backend;
  }
}

/**
 * Create a cache manager with memory backend.
 */
export function createMemoryCacheManager(namespace = 'jolt'): CacheManager {
  return new CacheManager(new MemoryCacheBackend(), namespace);
}