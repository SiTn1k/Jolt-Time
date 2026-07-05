/**
 * ICacheEntry Interface
 *
 * Interface defining the contract for CacheEntry entities.
 */

import type { CacheKey } from '../value-objects/CacheKey';
import type { CacheType } from '../types/CacheType';
import type { CacheStatus } from '../types/CacheStatus';
import type { CacheEntryMetadata } from '../types/CacheMetadata';

/**
 * CacheEntry interface.
 * Defines the contract for cache entry entities.
 */
export interface ICacheEntry {
  /** Cache key identifier */
  readonly cacheKey: CacheKey;

  /** Cached value */
  readonly cacheValue: unknown;

  /** Type of cached data */
  readonly cacheType: CacheType;

  /** Current status */
  readonly status: CacheStatus;

  /** Creation timestamp */
  readonly createdAt: Date;

  /** Expiration timestamp (null if no expiration) */
  readonly expiresAt: Date | null;

  /** Version for cache invalidation */
  readonly version: number;

  /** Additional metadata */
  readonly metadata: CacheEntryMetadata;

  /** Whether the entry is active */
  readonly isActive: boolean;

  /** Whether the entry is expired */
  readonly isExpired: boolean;

  /** Whether the entry can be used (active and not expired) */
  readonly canUse: boolean;

  /** Whether the entry has a TTL set */
  readonly hasTtl: boolean;
}
