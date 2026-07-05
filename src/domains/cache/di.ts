/**
 * Cache Domain Dependency Injection Registration
 *
 * Registers all cache domain services with the DI container.
 */

import type { Container } from '../../core/di/container';
import { Lifetime } from '../../core/di/container';
import { SupabaseCacheRepository } from './repositories/SupabaseCacheRepository';
import { CacheMapper } from './mappers/CacheMapper';
import { RegionMapper } from './mappers/RegionMapper';
import { StatisticsMapper } from './mappers/StatisticsMapper';
import { CacheValidator, RegionValidator, StatisticsValidator } from './validators';
import {
  MemoryCacheEngine,
  TTLEngine,
  CacheInvalidation,
  CacheService,
  type MemoryCacheConfig,
  type CacheServiceConfig,
} from './services';

/**
 * Cache Domain DI configuration tokens.
 */
export const CACHE_TOKENS = {
  // Repository
  CACHE_REPOSITORY: Symbol.for('ICacheRepository'),

  // Mappers
  CACHE_MAPPER: Symbol.for('CacheMapper'),
  REGION_MAPPER: Symbol.for('RegionMapper'),
  STATISTICS_MAPPER: Symbol.for('StatisticsMapper'),

  // Validators
  CACHE_VALIDATOR: Symbol.for('CacheValidator'),
  REGION_VALIDATOR: Symbol.for('RegionValidator'),
  STATISTICS_VALIDATOR: Symbol.for('StatisticsValidator'),

  // Services
  MEMORY_CACHE_ENGINE: Symbol.for('MemoryCacheEngine'),
  TTL_ENGINE: Symbol.for('TTLEngine'),
  CACHE_INVALIDATION: Symbol.for('CacheInvalidation'),
  CACHE_SERVICE: Symbol.for('CacheService'),
} as const;

/**
 * Default cache configurations.
 */
export const DEFAULT_MEMORY_CACHE_CONFIG: MemoryCacheConfig = {
  maxEntries: 10000,
  maxMemoryUsage: 100 * 1024 * 1024, // 100MB
  evictionPolicy: 'LRU',
  defaultTtlSeconds: 3600, // 1 hour
};

export const DEFAULT_CACHE_SERVICE_CONFIG: CacheServiceConfig = {
  enableWriteThrough: true,
  enableReadThrough: true,
  defaultTTLSeconds: 3600,
  maxEntries: 10000,
  maxMemoryUsage: 100 * 1024 * 1024,
  evictionPolicy: 'LRU',
};

/**
 * Register all cache domain dependencies with the container.
 */
export function registerCacheDependencies(
  container: Container,
  memoryCacheConfig?: MemoryCacheConfig,
  cacheServiceConfig?: CacheServiceConfig
): void {
  // Validators (Singleton - stateless)
  container.registerInstance(CacheValidator, new CacheValidator());
  container.registerInstance(RegionValidator, new RegionValidator());
  container.registerInstance(StatisticsValidator, new StatisticsValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(CacheMapper, new CacheMapper());
  container.registerInstance(RegionMapper, new RegionMapper());
  container.registerInstance(StatisticsMapper, new StatisticsMapper());

  // Repository (Singleton)
  container.registerFactory(
    SupabaseCacheRepository,
    () => new SupabaseCacheRepository(),
    { lifetime: Lifetime.Singleton }
  );

  // Memory Cache Engine (Singleton)
  container.registerFactory(
    MemoryCacheEngine,
    () => new MemoryCacheEngine(memoryCacheConfig ?? DEFAULT_MEMORY_CACHE_CONFIG),
    { lifetime: Lifetime.Singleton }
  );

  // TTL Engine (Singleton)
  container.registerFactory(
    TTLEngine,
    () => new TTLEngine(),
    { lifetime: Lifetime.Singleton }
  );

  // Cache Invalidation (Singleton - depends on MemoryCacheEngine)
  // Note: Due to container limitations, we create it directly here
  const memoryCache = new MemoryCacheEngine(memoryCacheConfig ?? DEFAULT_MEMORY_CACHE_CONFIG);
  container.registerInstance(CacheInvalidation, new CacheInvalidation(memoryCache));

  // Cache Service (Singleton)
  // Note: Due to container limitations, we create it directly here
  const ttlEngine = new TTLEngine();
  const invalidation = new CacheInvalidation(memoryCache);
  const repository = new SupabaseCacheRepository();
  const cacheMapper = new CacheMapper();
  const regionMapper = new RegionMapper();
  const statisticsMapper = new StatisticsMapper();
  
  const cacheService = new CacheService(
    repository,
    memoryCache,
    ttlEngine,
    invalidation,
    cacheMapper,
    regionMapper,
    statisticsMapper,
    cacheServiceConfig ?? DEFAULT_CACHE_SERVICE_CONFIG
  );
  
  container.registerInstance(CacheService, cacheService);
}

/**
 * Quick setup function for cache domain.
 * Creates and configures all cache domain components.
 */
export function setupCacheDomain(
  memoryCacheConfig?: MemoryCacheConfig,
  cacheServiceConfig?: CacheServiceConfig
): {
  cacheRepository: SupabaseCacheRepository;
  cacheMapper: CacheMapper;
  regionMapper: RegionMapper;
  statisticsMapper: StatisticsMapper;
  cacheValidator: CacheValidator;
  regionValidator: RegionValidator;
  statisticsValidator: StatisticsValidator;
  memoryCacheEngine: MemoryCacheEngine;
  ttlEngine: TTLEngine;
  cacheInvalidation: CacheInvalidation;
  cacheService: CacheService;
} {
  const cacheRepository = new SupabaseCacheRepository();
  const cacheMapper = new CacheMapper();
  const regionMapper = new RegionMapper();
  const statisticsMapper = new StatisticsMapper();
  const cacheValidator = new CacheValidator();
  const regionValidator = new RegionValidator();
  const statisticsValidator = new StatisticsValidator();
  const memoryCacheEngine = new MemoryCacheEngine(memoryCacheConfig ?? DEFAULT_MEMORY_CACHE_CONFIG);
  const ttlEngine = new TTLEngine();
  const cacheInvalidation = new CacheInvalidation(memoryCacheEngine);
  const cacheService = new CacheService(
    cacheRepository,
    memoryCacheEngine,
    ttlEngine,
    cacheInvalidation,
    cacheMapper,
    regionMapper,
    statisticsMapper,
    cacheServiceConfig ?? DEFAULT_CACHE_SERVICE_CONFIG
  );

  return {
    cacheRepository,
    cacheMapper,
    regionMapper,
    statisticsMapper,
    cacheValidator,
    regionValidator,
    statisticsValidator,
    memoryCacheEngine,
    ttlEngine,
    cacheInvalidation,
    cacheService,
  };
}
