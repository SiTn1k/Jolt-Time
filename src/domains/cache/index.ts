/**
 * Cache Domain Index
 *
 * Main export file for the Cache domain.
 * Provides access to all Cache domain entities, types, interfaces, and utilities.
 *
 * Cache Domain Responsibilities:
 * - Store cache entry metadata (key, value, type, status)
 * - Store cache region metadata
 * - Store cache statistics
 * - Provide data access interfaces
 *
 * Cache Domain is NOT:
 * - A cache engine
 * - A cache accessor
 * - A gameplay modifier
 * - A state changer
 * - A reward distributor
 * - A balance modifier
 * - An inventory modifier
 */

// Entities
export {
  CacheEntry,
  type CacheEntryProps,
  type CacheEntryRecord,
  type CacheEntryJSON,
} from './entities/CacheEntry';

export {
  CacheRegion,
  type CacheRegionProps,
  type CacheRegionRecord,
  type CacheRegionJSON,
} from './entities/CacheRegion';

export {
  CacheStatistics,
  type CacheStatisticsProps,
  type CacheStatisticsRecord,
  type CacheStatisticsJSON,
} from './entities/CacheStatistics';

// Value Objects
export { CacheKey } from './value-objects/CacheKey';
export { RegionId } from './value-objects/RegionId';
export { StatisticsId } from './value-objects/StatisticsId';

// Types
export type { CacheType } from './types/CacheType';
export { CACHE_TYPE_DISPLAY, CACHE_TYPE_DESCRIPTIONS, isPersistentCacheType, isSessionCacheType, isConfigurationCacheType, getPersistentCacheTypes, getSessionCacheTypes } from './types/CacheType';

export type { CacheStatus } from './types/CacheStatus';
export { CACHE_STATUS_DISPLAY, CACHE_STATUS_COLORS, isUsableCacheStatus, isTerminalCacheStatus, isRemovedCacheStatus } from './types/CacheStatus';

export type { CacheRegionType } from './types/CacheRegionType';
export { CACHE_REGION_TYPE_DISPLAY, CACHE_REGION_TYPE_DESCRIPTIONS, isUserScopedRegionType, isCommunityScopedRegionType, isSystemScopedRegionType, isGlobalRegionType } from './types/CacheRegionType';

export type { CacheEntryMetadata, CacheRegionMetadata, CacheStatisticsMetadata } from './types/CacheMetadata';
export { INITIAL_CACHE_ENTRY_METADATA, INITIAL_CACHE_REGION_METADATA, INITIAL_CACHE_STATISTICS_METADATA } from './types/CacheMetadata';

export type { CacheMetrics, CacheHitRate, CacheMemoryUsage } from './types/CacheMetrics';
export { createEmptyCacheMetrics, calculateHitRate, calculateMemoryUsage } from './types/CacheMetrics';

// DTOs
export type {
  CacheEntryDto,
  CreateCacheEntryDto,
  UpdateCacheEntryDto,
  CacheEntryListDto,
} from './dto/CacheEntry.dto';

export type {
  CacheRegionDto,
  CreateCacheRegionDto,
  UpdateCacheRegionDto,
  CacheRegionListDto,
} from './dto/CacheRegion.dto';

export type {
  CacheStatisticsDto,
  CreateCacheStatisticsDto,
  UpdateCacheStatisticsDto,
  CacheStatisticsListDto,
} from './dto/CacheStatistics.dto';

export type {
  CacheResponseDto,
  CacheEntryResponseDto,
  CacheRegionResponseDto,
  CacheStatisticsResponseDto,
  CacheHitResponseDto,
  CacheBatchResponseDto,
  CacheHealthDto,
} from './dto/CacheResponse.dto';

// Interfaces
export type { ICacheEntry } from './interfaces/ICacheEntry';
export type { ICacheRegion } from './interfaces/ICacheRegion';
export type { ICacheStatistics } from './interfaces/ICacheStatistics';
export type {
  ICacheRepository,
  CacheEntryFilterParams,
  CacheRegionFilterParams,
  CacheStatisticsFilterParams,
} from './interfaces/ICacheRepository';

// Validators
export { CacheValidator, type ValidationResult } from './validators/CacheValidator';
export { RegionValidator } from './validators/RegionValidator';
export { StatisticsValidator } from './validators/StatisticsValidator';

// Mappers
export { CacheMapper } from './mappers/CacheMapper';
export { RegionMapper } from './mappers/RegionMapper';
export { StatisticsMapper } from './mappers/StatisticsMapper';

// Events
export { CacheCreated, type CacheCreatedJSON } from './events/CacheCreated.event';
export { CacheExpired, type CacheExpiredJSON } from './events/CacheExpired.event';
export { CacheInvalidated, type CacheInvalidatedJSON } from './events/CacheInvalidated.event';
export { RegionCreated, type RegionCreatedJSON } from './events/RegionCreated.event';

// Repositories
export { SupabaseCacheRepository } from './repositories/SupabaseCacheRepository';

// Services
export {
  MemoryCacheEngine,
  TTLEngine,
  CacheInvalidation,
  CacheService,
  type MemoryCacheStats,
  type MemoryCacheConfig,
  type EvictionPolicyType,
  type TTLStatistics,
  type TTLConfig,
  type TTLType,
  type InvalidationResult,
  type InvalidationReason,
  type DependencyMap,
  type CacheServiceConfig,
  type CacheResult,
} from './services';

// DI
export {
  CACHE_TOKENS,
  registerCacheDependencies,
  setupCacheDomain,
  DEFAULT_MEMORY_CACHE_CONFIG,
  DEFAULT_CACHE_SERVICE_CONFIG,
} from './di';
