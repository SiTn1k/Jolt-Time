/**
 * CacheMetrics
 *
 * Type definitions for cache performance metrics.
 * Tracks cache hit/miss rates and memory usage.
 */

/**
 * Cache performance metrics.
 */
export interface CacheMetrics {
  /** Total number of cache hits */
  hits: number;

  /** Total number of cache misses */
  misses: number;

  /** Total number of cache evictions */
  evictions: number;

  /** Current number of entries */
  entries: number;

  /** Estimated memory usage in bytes */
  memoryUsage: number;

  /** Last updated timestamp */
  updatedAt: Date;
}

/**
 * Cache hit rate metrics.
 */
export interface CacheHitRate {
  /** Number of hits */
  hits: number;

  /** Number of misses */
  misses: number;

  /** Hit rate as percentage (0-100) */
  hitRatePercent: number;

  /** Total requests */
  totalRequests: number;
}

/**
 * Memory usage metrics.
 */
export interface CacheMemoryUsage {
  /** Used memory in bytes */
  used: number;

  /** Maximum memory in bytes */
  max: number;

  /** Usage percentage (0-100) */
  usagePercent: number;
}

/**
 * Creates empty/initial cache metrics.
 */
export function createEmptyCacheMetrics(): CacheMetrics {
  return {
    hits: 0,
    misses: 0,
    evictions: 0,
    entries: 0,
    memoryUsage: 0,
    updatedAt: new Date(),
  };
}

/**
 * Creates cache hit rate from hits and misses.
 */
export function calculateHitRate(hits: number, misses: number): CacheHitRate {
  const totalRequests = hits + misses;
  const hitRatePercent = totalRequests > 0 ? (hits / totalRequests) * 100 : 0;

  return {
    hits,
    misses,
    hitRatePercent: Math.round(hitRatePercent * 100) / 100,
    totalRequests,
  };
}

/**
 * Creates memory usage from used and max values.
 */
export function calculateMemoryUsage(used: number, max: number): CacheMemoryUsage {
  const usagePercent = max > 0 ? (used / max) * 100 : 0;

  return {
    used,
    max,
    usagePercent: Math.round(usagePercent * 100) / 100,
  };
}
