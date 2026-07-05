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
} as const;

/**
 * Register all cache domain dependencies with the container.
 */
export function registerCacheDependencies(container: Container): void {
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
}

/**
 * Quick setup function for cache domain.
 * Creates and configures all cache domain components.
 */
export function setupCacheDomain(): {
  cacheRepository: SupabaseCacheRepository;
  cacheMapper: CacheMapper;
  regionMapper: RegionMapper;
  statisticsMapper: StatisticsMapper;
  cacheValidator: CacheValidator;
  regionValidator: RegionValidator;
  statisticsValidator: StatisticsValidator;
} {
  const cacheRepository = new SupabaseCacheRepository();
  const cacheMapper = new CacheMapper();
  const regionMapper = new RegionMapper();
  const statisticsMapper = new StatisticsMapper();
  const cacheValidator = new CacheValidator();
  const regionValidator = new RegionValidator();
  const statisticsValidator = new StatisticsValidator();

  return {
    cacheRepository,
    cacheMapper,
    regionMapper,
    statisticsMapper,
    cacheValidator,
    regionValidator,
    statisticsValidator,
  };
}
