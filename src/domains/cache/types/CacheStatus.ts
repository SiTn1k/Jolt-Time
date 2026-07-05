/**
 * CacheStatus
 *
 * Type definitions for cache entry status.
 * Defines the lifecycle states of cache entries.
 */

/**
 * Supported cache statuses.
 */
export type CacheStatus =
  | 'active'
  | 'expired'
  | 'invalidated'
  | 'evicted';

/**
 * Display names for cache statuses.
 */
export const CACHE_STATUS_DISPLAY: Record<CacheStatus, string> = {
  active: 'Active',
  expired: 'Expired',
  invalidated: 'Invalidated',
  evicted: 'Evicted',
} as const;

/**
 * Colors for cache statuses (for UI display).
 */
export const CACHE_STATUS_COLORS: Record<CacheStatus, string> = {
  active: '#00D9FF',
  expired: '#FFB800',
  invalidated: '#FF4757',
  evicted: '#8E8E93',
} as const;

/**
 * Checks if a cache status indicates the entry is usable.
 */
export function isUsableCacheStatus(status: CacheStatus): boolean {
  return status === 'active';
}

/**
 * Checks if a cache status indicates the entry is no longer usable.
 */
export function isTerminalCacheStatus(status: CacheStatus): boolean {
  return ['expired', 'invalidated', 'evicted'].includes(status);
}

/**
 * Checks if a cache status indicates the entry was intentionally removed.
 */
export function isRemovedCacheStatus(status: CacheStatus): boolean {
  return ['invalidated', 'evicted'].includes(status);
}
