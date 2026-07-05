/**
 * Types Index
 *
 * Exports all cache domain types.
 */

export {
  type CacheType,
  CACHE_TYPE_DISPLAY,
  CACHE_TYPE_DESCRIPTIONS,
  isPersistentCacheType,
  isSessionCacheType,
  isConfigurationCacheType,
  getPersistentCacheTypes,
  getSessionCacheTypes,
} from './CacheType';

export {
  type CacheStatus,
  CACHE_STATUS_DISPLAY,
  CACHE_STATUS_COLORS,
  isUsableCacheStatus,
  isTerminalCacheStatus,
  isRemovedCacheStatus,
} from './CacheStatus';

export {
  type CacheRegionType,
  CACHE_REGION_TYPE_DISPLAY,
  CACHE_REGION_TYPE_DESCRIPTIONS,
  isUserScopedRegionType,
  isCommunityScopedRegionType,
  isSystemScopedRegionType,
  isGlobalRegionType,
} from './CacheRegionType';

export type {
  CacheEntryMetadata,
  CacheRegionMetadata,
  CacheStatisticsMetadata,
} from './CacheMetadata';

export {
  INITIAL_CACHE_ENTRY_METADATA,
  INITIAL_CACHE_REGION_METADATA,
  INITIAL_CACHE_STATISTICS_METADATA,
} from './CacheMetadata';

export type {
  CacheMetrics,
  CacheHitRate,
  CacheMemoryUsage,
} from './CacheMetrics';

export {
  createEmptyCacheMetrics,
  calculateHitRate,
  calculateMemoryUsage,
} from './CacheMetrics';
