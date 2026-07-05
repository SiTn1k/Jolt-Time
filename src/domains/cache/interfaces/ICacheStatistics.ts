/**
 * ICacheStatistics Interface
 *
 * Interface defining the contract for CacheStatistics entities.
 */

import type { StatisticsId } from '../value-objects/StatisticsId';
import type { CacheStatisticsMetadata } from '../types/CacheMetadata';

/**
 * CacheStatistics interface.
 * Defines the contract for cache statistics entities.
 */
export interface ICacheStatistics {
  /** Unique statistics identifier */
  readonly statisticsId: StatisticsId;

  /** Total number of cache hits */
  readonly hits: number;

  /** Total number of cache misses */
  readonly misses: number;

  /** Total number of cache evictions */
  readonly evictions: number;

  /** Current number of entries */
  readonly entries: number;

  /** Estimated memory usage in bytes */
  readonly memoryUsage: number;

  /** Last updated timestamp */
  readonly updatedAt: Date;

  /** Additional metadata */
  readonly metadata: CacheStatisticsMetadata;

  /** Total number of requests (hits + misses) */
  readonly totalRequests: number;

  /** Hit rate as a percentage (0-100) */
  readonly hitRatePercent: number;

  /** Whether this statistics has any data */
  readonly hasData: boolean;
}
