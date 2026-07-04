/**
 * Backup Domain Dependency Injection Registration
 *
 * Registers all backup domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseBackupRepository } from './repositories/SupabaseBackupRepository';
import { SnapshotMapper } from './mappers/SnapshotMapper';
import { JobMapper } from './mappers/JobMapper';
import { RestoreMapper } from './mappers/RestoreMapper';
import { BackupValidator, SnapshotValidator, RestoreValidator } from './validators';

/**
 * Backup Domain DI configuration tokens.
 */
export const BACKUP_TOKENS = {
  // Repository
  BACKUP_REPOSITORY: Symbol.for('IBackupRepository'),

  // Mappers
  SNAPSHOT_MAPPER: Symbol.for('SnapshotMapper'),
  JOB_MAPPER: Symbol.for('JobMapper'),
  RESTORE_MAPPER: Symbol.for('RestoreMapper'),

  // Validators
  BACKUP_VALIDATOR: Symbol.for('BackupValidator'),
  SNAPSHOT_VALIDATOR: Symbol.for('SnapshotValidator'),
  RESTORE_VALIDATOR: Symbol.for('RestoreValidator'),
} as const;

/**
 * Register all backup domain dependencies with the container.
 */
export function registerBackupDependencies(container: Container): void {
  // Validators (Singleton - stateless)
  container.registerInstance(BackupValidator, new BackupValidator());
  container.registerInstance(SnapshotValidator, new SnapshotValidator());
  container.registerInstance(RestoreValidator, new RestoreValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(SnapshotMapper, new SnapshotMapper());
  container.registerInstance(JobMapper, new JobMapper());
  container.registerInstance(RestoreMapper, new RestoreMapper());

  // Repository (Singleton)
  container.registerFactory(
    SupabaseBackupRepository,
    () => new SupabaseBackupRepository(),
    { lifetime: Lifetime.Singleton }
  );
}

/**
 * Quick setup function for backup domain.
 * Creates and configures all backup domain components.
 */
export function setupBackupDomain(): {
  backupRepository: SupabaseBackupRepository;
  snapshotMapper: SnapshotMapper;
  jobMapper: JobMapper;
  restoreMapper: RestoreMapper;
  backupValidator: BackupValidator;
  snapshotValidator: SnapshotValidator;
  restoreValidator: RestoreValidator;
} {
  const backupRepository = new SupabaseBackupRepository();
  const snapshotMapper = new SnapshotMapper();
  const jobMapper = new JobMapper();
  const restoreMapper = new RestoreMapper();
  const backupValidator = new BackupValidator();
  const snapshotValidator = new SnapshotValidator();
  const restoreValidator = new RestoreValidator();

  return {
    backupRepository,
    snapshotMapper,
    jobMapper,
    restoreMapper,
    backupValidator,
    snapshotValidator,
    restoreValidator,
  };
}
