/**
 * Release Domain Dependency Injection Registration
 *
 * Registers all release domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseReleaseRepository } from './repositories/SupabaseReleaseRepository';
import { ReleaseMapper } from './mappers/ReleaseMapper';
import { CandidateMapper } from './mappers/CandidateMapper';
import { ChecklistMapper } from './mappers/ChecklistMapper';
import { SnapshotMapper } from './mappers/SnapshotMapper';
import { ReleaseValidator } from './validators/ReleaseValidator';
import { ChecklistValidator } from './validators/ChecklistValidator';
import { SnapshotValidator } from './validators/SnapshotValidator';

/**
 * Release Domain DI configuration keys.
 */
export const RELEASE_TOKENS = {
  RELEASE_REPOSITORY: Symbol.for('SupabaseReleaseRepository'),
  RELEASE_MAPPER: Symbol.for('ReleaseMapper'),
  CANDIDATE_MAPPER: Symbol.for('CandidateMapper'),
  CHECKLIST_MAPPER: Symbol.for('ChecklistMapper'),
  SNAPSHOT_MAPPER: Symbol.for('SnapshotMapper'),
  RELEASE_VALIDATOR: Symbol.for('ReleaseValidator'),
  CHECKLIST_VALIDATOR: Symbol.for('ChecklistValidator'),
  SNAPSHOT_VALIDATOR: Symbol.for('SnapshotValidator'),
} as const;

/**
 * Register all release domain dependencies with the container.
 */
export function registerReleaseDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(ReleaseValidator, new ReleaseValidator());
  container.registerInstance(ChecklistValidator, new ChecklistValidator());
  container.registerInstance(SnapshotValidator, new SnapshotValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(ReleaseMapper, new ReleaseMapper());
  container.registerInstance(CandidateMapper, new CandidateMapper());
  container.registerInstance(ChecklistMapper, new ChecklistMapper());
  container.registerInstance(SnapshotMapper, new SnapshotMapper());

  // Repositories (Singleton for simplicity)
  container.register(SupabaseReleaseRepository, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for release domain.
 * Creates and configures all release domain components.
 */
export function setupReleaseDomain(): {
  releaseRepository: SupabaseReleaseRepository;
  releaseMapper: ReleaseMapper;
  candidateMapper: CandidateMapper;
  checklistMapper: ChecklistMapper;
  snapshotMapper: SnapshotMapper;
  releaseValidator: ReleaseValidator;
  checklistValidator: ChecklistValidator;
  snapshotValidator: SnapshotValidator;
} {
  const releaseValidator = new ReleaseValidator();
  const checklistValidator = new ChecklistValidator();
  const snapshotValidator = new SnapshotValidator();
  const releaseMapper = new ReleaseMapper();
  const candidateMapper = new CandidateMapper();
  const checklistMapper = new ChecklistMapper();
  const snapshotMapper = new SnapshotMapper();
  const releaseRepository = new SupabaseReleaseRepository();

  return {
    releaseRepository,
    releaseMapper,
    candidateMapper,
    checklistMapper,
    snapshotMapper,
    releaseValidator,
    checklistValidator,
    snapshotValidator,
  };
}
