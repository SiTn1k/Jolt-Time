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

/**
 * Optimization Domain DI configuration keys.
 */
export const OPTIMIZATION_TOKENS = {
  OPTIMIZATION_REPOSITORY: Symbol.for('SupabaseOptimizationRepository'),
  PERFORMANCE_MAPPER: Symbol.for('PerformanceMapper'),
  RULE_MAPPER: Symbol.for('RuleMapper'),
  SNAPSHOT_MAPPER: Symbol.for('SnapshotMapper'),
  OPTIMIZATION_MAPPER: Symbol.for('OptimizationMapper'),
  PERFORMANCE_VALIDATOR: Symbol.for('PerformanceValidator'),
  RULE_VALIDATOR: Symbol.for('RuleValidator'),
  SNAPSHOT_VALIDATOR: Symbol.for('SnapshotValidator'),
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
}

/**
 * Quick setup function for optimization domain.
 * Creates and configures all optimization domain components.
 */
export function setupOptimizationDomain(): {
  optimizationRepository: SupabaseOptimizationRepository;
  performanceMapper: PerformanceMapper;
  ruleMapper: RuleMapper;
  snapshotMapper: SnapshotMapper;
  optimizationMapper: OptimizationMapper;
  performanceValidator: PerformanceValidator;
  ruleValidator: RuleValidator;
  snapshotValidator: SnapshotValidator;
} {
  const optimizationRepository = new SupabaseOptimizationRepository();
  const performanceMapper = new PerformanceMapper();
  const ruleMapper = new RuleMapper();
  const snapshotMapper = new SnapshotMapper();
  const optimizationMapper = new OptimizationMapper();
  const performanceValidator = new PerformanceValidator();
  const ruleValidator = new RuleValidator();
  const snapshotValidator = new SnapshotValidator();

  return {
    optimizationRepository,
    performanceMapper,
    ruleMapper,
    snapshotMapper,
    optimizationMapper,
    performanceValidator,
    ruleValidator,
    snapshotValidator,
  };
}

/**
 * Creates optimization repository with optional Supabase client.
 */
export function createOptimizationRepository(client?: SupabaseClient): SupabaseOptimizationRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new SupabaseOptimizationRepository(client as any);
}
