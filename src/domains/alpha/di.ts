/**
 * Alpha Domain Dependency Injection Registration
 *
 * Registers all alpha domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseAlphaRepository } from './repositories/SupabaseAlphaRepository';
import { ChecklistMapper } from './mappers/ChecklistMapper';
import { MilestoneMapper } from './mappers/MilestoneMapper';
import { SnapshotMapper } from './mappers/SnapshotMapper';
import { AlphaMapper } from './mappers/AlphaMapper';
import { ChecklistValidator, MilestoneValidator, SnapshotValidator } from './validators';

/**
 * Alpha Domain DI configuration keys.
 */
export const ALPHA_TOKENS = {
  ALPHA_REPOSITORY: Symbol.for('SupabaseAlphaRepository'),
  CHECKLIST_MAPPER: Symbol.for('ChecklistMapper'),
  MILESTONE_MAPPER: Symbol.for('MilestoneMapper'),
  SNAPSHOT_MAPPER: Symbol.for('SnapshotMapper'),
  ALPHA_MAPPER: Symbol.for('AlphaMapper'),
  CHECKLIST_VALIDATOR: Symbol.for('ChecklistValidator'),
  MILESTONE_VALIDATOR: Symbol.for('MilestoneValidator'),
  SNAPSHOT_VALIDATOR: Symbol.for('SnapshotValidator'),
} as const;

/**
 * Register all alpha domain dependencies with the container.
 */
export function registerAlphaDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(ChecklistValidator, new ChecklistValidator());
  container.registerInstance(MilestoneValidator, new MilestoneValidator());
  container.registerInstance(SnapshotValidator, new SnapshotValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(ChecklistMapper, new ChecklistMapper());
  container.registerInstance(MilestoneMapper, new MilestoneMapper());
  container.registerInstance(SnapshotMapper, new SnapshotMapper());
  container.registerInstance(AlphaMapper, new AlphaMapper());

  // Repositories (Singleton for simplicity)
  container.register(SupabaseAlphaRepository, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for alpha domain.
 * Creates and configures all alpha domain components.
 */
export function setupAlphaDomain(): {
  alphaRepository: SupabaseAlphaRepository;
  checklistMapper: ChecklistMapper;
  milestoneMapper: MilestoneMapper;
  snapshotMapper: SnapshotMapper;
  alphaMapper: AlphaMapper;
  checklistValidator: ChecklistValidator;
  milestoneValidator: MilestoneValidator;
  snapshotValidator: SnapshotValidator;
} {
  const checklistValidator = new ChecklistValidator();
  const milestoneValidator = new MilestoneValidator();
  const snapshotValidator = new SnapshotValidator();
  const checklistMapper = new ChecklistMapper();
  const milestoneMapper = new MilestoneMapper();
  const snapshotMapper = new SnapshotMapper();
  const alphaMapper = new AlphaMapper();
  const alphaRepository = new SupabaseAlphaRepository();

  return {
    alphaRepository,
    checklistMapper,
    milestoneMapper,
    snapshotMapper,
    alphaMapper,
    checklistValidator,
    milestoneValidator,
    snapshotValidator,
  };
}
