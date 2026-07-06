/**
 * Hardening Domain Dependency Injection Registration
 *
 * Registers all hardening domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseHardeningRepository } from './repositories/SupabaseHardeningRepository';
import { HardeningMapper } from './mappers/HardeningMapper';
import { ChecklistMapper } from './mappers/ChecklistMapper';
import { SnapshotMapper } from './mappers/SnapshotMapper';
import { RuleValidator } from './validators/RuleValidator';
import { ChecklistValidator } from './validators/ChecklistValidator';
import { SnapshotValidator } from './validators/SnapshotValidator';
import { HardeningService } from './services/HardeningService';

/**
 * Hardening Domain DI configuration keys.
 */
export const HARDENING_TOKENS = {
  HARDENING_REPOSITORY: Symbol.for('SupabaseHardeningRepository'),
  HARDENING_MAPPER: Symbol.for('HardeningMapper'),
  CHECKLIST_MAPPER: Symbol.for('ChecklistMapper'),
  SNAPSHOT_MAPPER: Symbol.for('SnapshotMapper'),
  RULE_VALIDATOR: Symbol.for('RuleValidator'),
  CHECKLIST_VALIDATOR: Symbol.for('ChecklistValidator'),
  SNAPSHOT_VALIDATOR: Symbol.for('SnapshotValidator'),
  HARDENING_SERVICE: Symbol.for('HardeningService'),
} as const;

/**
 * Register all hardening domain dependencies with the container.
 */
export function registerHardeningDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(RuleValidator, new RuleValidator());
  container.registerInstance(ChecklistValidator, new ChecklistValidator());
  container.registerInstance(SnapshotValidator, new SnapshotValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(HardeningMapper, new HardeningMapper());
  container.registerInstance(ChecklistMapper, new ChecklistMapper());
  container.registerInstance(SnapshotMapper, new SnapshotMapper());

  // Repositories (Singleton for simplicity)
  container.register(SupabaseHardeningRepository, { lifetime: Lifetime.Singleton });

  // Services
  container.register(HardeningService, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for hardening domain.
 * Creates and configures all hardening domain components.
 */
export function setupHardeningDomain(config?: {
  systemVersion?: string;
  gitCommit?: string;
}): {
  hardeningRepository: SupabaseHardeningRepository;
  hardeningMapper: HardeningMapper;
  checklistMapper: ChecklistMapper;
  snapshotMapper: SnapshotMapper;
  ruleValidator: RuleValidator;
  checklistValidator: ChecklistValidator;
  snapshotValidator: SnapshotValidator;
  hardeningService: HardeningService;
} {
  const ruleValidator = new RuleValidator();
  const checklistValidator = new ChecklistValidator();
  const snapshotValidator = new SnapshotValidator();
  const hardeningMapper = new HardeningMapper();
  const checklistMapper = new ChecklistMapper();
  const snapshotMapper = new SnapshotMapper();
  const hardeningRepository = new SupabaseHardeningRepository();
  const hardeningService = new HardeningService(hardeningRepository, {
    systemVersion: config?.systemVersion ?? '1.0.0',
    gitCommit: config?.gitCommit,
  });

  return {
    hardeningRepository,
    hardeningMapper,
    checklistMapper,
    snapshotMapper,
    ruleValidator,
    checklistValidator,
    snapshotValidator,
    hardeningService,
  };
}
