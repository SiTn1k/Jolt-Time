/**
 * Optimization Domain Dependency Injection Registration
 *
 * Registers all optimization domain services with the DI container.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { Container, Lifetime } from '../../core/di';
import { SupabaseOptimizationRepository } from './repositories/SupabaseOptimizationRepository';
import { PerformanceMapper } from './mappers/PerformanceMapper';
import { RuleMapper } from './mappers/RuleMapper';
import { SnapshotMapper } from './mappers/SnapshotMapper';
import { OptimizationMapper } from './mappers/OptimizationMapper';
import { PerformanceValidator } from './validators/PerformanceValidator';
import { RuleValidator } from './validators/RuleValidator';
import { SnapshotValidator } from './validators/SnapshotValidator';
import { OptimizationService } from './services/OptimizationService';
import { PerformanceAnalyzer } from './services/PerformanceAnalyzer';
import { DatabaseOptimizationAnalyzer } from './services/DatabaseOptimizationAnalyzer';
import { CacheOptimizationAnalyzer } from './services/CacheOptimizationAnalyzer';
import { MemoryAnalyzer } from './services/MemoryAnalyzer';
import { OptimizationFailureHandler } from './services/OptimizationFailureHandler';

/**
 * Optimization Domain DI configuration keys.
 */
export const OPTIMIZATION_TOKENS = {
  // Repository
  OPTIMIZATION_REPOSITORY: Symbol.for('SupabaseOptimizationRepository'),

  // Mappers
  PERFORMANCE_MAPPER: Symbol.for('PerformanceMapper'),
  RULE_MAPPER: Symbol.for('RuleMapper'),
  SNAPSHOT_MAPPER: Symbol.for('SnapshotMapper'),
  OPTIMIZATION_MAPPER: Symbol.for('OptimizationMapper'),

  // Validators
  PERFORMANCE_VALIDATOR: Symbol.for('PerformanceValidator'),
  RULE_VALIDATOR: Symbol.for('RuleValidator'),
  SNAPSHOT_VALIDATOR: Symbol.for('SnapshotValidator'),

  // Services
  OPTIMIZATION_SERVICE: Symbol.for('OptimizationService'),
  PERFORMANCE_ANALYZER: Symbol.for('PerformanceAnalyzer'),
  DATABASE_ANALYZER: Symbol.for('DatabaseOptimizationAnalyzer'),
  CACHE_ANALYZER: Symbol.for('CacheOptimizationAnalyzer'),
  MEMORY_ANALYZER: Symbol.for('MemoryAnalyzer'),
  FAILURE_HANDLER: Symbol.for('OptimizationFailureHandler'),
} as const;

/**
 * Register all optimization domain dependencies with the container.
 */
export function registerOptimizationDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(PerformanceValidator, new PerformanceValidator());
  container.registerInstance(RuleValidator, new RuleValidator());
  container.registerInstance(SnapshotValidator, new SnapshotValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(PerformanceMapper, new PerformanceMapper());
  container.registerInstance(RuleMapper, new RuleMapper());
  container.registerInstance(SnapshotMapper, new SnapshotMapper());
  container.registerInstance(OptimizationMapper, new OptimizationMapper());

  // Repository (Singleton)
  container.register(SupabaseOptimizationRepository, { lifetime: Lifetime.Singleton });

  // Services (Singleton)
  container.register(OptimizationService, { lifetime: Lifetime.Singleton });
  container.register(PerformanceAnalyzer, { lifetime: Lifetime.Singleton });
  container.register(DatabaseOptimizationAnalyzer, { lifetime: Lifetime.Singleton });
  container.register(CacheOptimizationAnalyzer, { lifetime: Lifetime.Singleton });
  container.register(MemoryAnalyzer, { lifetime: Lifetime.Singleton });
  container.register(OptimizationFailureHandler, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for optimization domain.
 * Creates and configures all optimization domain components.
 */
export function setupOptimizationDomain(): {
  // Repository
  optimizationRepository: SupabaseOptimizationRepository;

  // Mappers
  performanceMapper: PerformanceMapper;
  ruleMapper: RuleMapper;
  snapshotMapper: SnapshotMapper;
  optimizationMapper: OptimizationMapper;

  // Validators
  performanceValidator: PerformanceValidator;
  ruleValidator: RuleValidator;
  snapshotValidator: SnapshotValidator;

  // Services
  optimizationService: OptimizationService;
  performanceAnalyzer: PerformanceAnalyzer;
  databaseAnalyzer: DatabaseOptimizationAnalyzer;
  cacheAnalyzer: CacheOptimizationAnalyzer;
  memoryAnalyzer: MemoryAnalyzer;
  failureHandler: OptimizationFailureHandler;
} {
  // Repository
  const optimizationRepository = new SupabaseOptimizationRepository();

  // Mappers
  const performanceMapper = new PerformanceMapper();
  const ruleMapper = new RuleMapper();
  const snapshotMapper = new SnapshotMapper();
  const optimizationMapper = new OptimizationMapper();

  // Validators
  const performanceValidator = new PerformanceValidator();
  const ruleValidator = new RuleValidator();
  const snapshotValidator = new SnapshotValidator();

  // Services
  const optimizationService = new OptimizationService(optimizationRepository);
  const performanceAnalyzer = new PerformanceAnalyzer();
  const databaseAnalyzer = new DatabaseOptimizationAnalyzer();
  const cacheAnalyzer = new CacheOptimizationAnalyzer();
  const memoryAnalyzer = new MemoryAnalyzer();
  const failureHandler = new OptimizationFailureHandler();

  return {
    optimizationRepository,
    performanceMapper,
    ruleMapper,
    snapshotMapper,
    optimizationMapper,
    performanceValidator,
    ruleValidator,
    snapshotValidator,
    optimizationService,
    performanceAnalyzer,
    databaseAnalyzer,
    cacheAnalyzer,
    memoryAnalyzer,
    failureHandler,
  };
}

/**
 * Creates optimization repository with optional Supabase client.
 */
export function createOptimizationRepository(client?: SupabaseClient): SupabaseOptimizationRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new SupabaseOptimizationRepository(client as any);
}

/**
 * Creates optimization service with repository.
 */
export function createOptimizationService(
  repository: SupabaseOptimizationRepository,
  config?: {
    autoSnapshotEnabled?: boolean;
    snapshotIntervalMs?: number;
  }
): OptimizationService {
  return new OptimizationService(repository, config);
}

/**
 * Creates performance analyzer.
 */
export function createPerformanceAnalyzer(config?: {
  slowQueryThresholdMs?: number;
  maxSamples?: number;
}): PerformanceAnalyzer {
  return new PerformanceAnalyzer(config);
}

/**
 * Creates database optimization analyzer.
 */
export function createDatabaseAnalyzer(config?: {
  slowQueryThresholdMs?: number;
  duplicateQueryWindowMs?: number;
  maxRecommendations?: number;
}): DatabaseOptimizationAnalyzer {
  return new DatabaseOptimizationAnalyzer(config);
}

/**
 * Creates cache optimization analyzer.
 */
export function createCacheAnalyzer(config?: {
  hitRatioThreshold?: number;
  missRatioThreshold?: number;
  slowAccessThresholdMs?: number;
  maxRecommendations?: number;
}): CacheOptimizationAnalyzer {
  return new CacheOptimizationAnalyzer(config);
}

/**
 * Creates memory analyzer.
 */
export function createMemoryAnalyzer(config?: {
  highMemoryThresholdBytes?: number;
  growthThresholdPercent?: number;
  maxSnapshots?: number;
  maxRecommendations?: number;
  sampleIntervalMs?: number;
}): MemoryAnalyzer {
  return new MemoryAnalyzer(config);
}

/**
 * Creates optimization failure handler.
 */
export function createFailureHandler(config?: {
  maxRetries?: number;
  retryDelayMs?: number;
  enableFallback?: boolean;
  logFailures?: boolean;
}): OptimizationFailureHandler {
  return new OptimizationFailureHandler(config);
}
