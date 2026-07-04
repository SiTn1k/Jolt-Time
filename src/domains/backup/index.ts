/**
 * Backup Domain Index
 *
 * Main export file for the Backup domain.
 * Provides access to all Backup domain entities, types, interfaces, and utilities.
 *
 * Backup Domain Responsibilities:
 * - Store backup metadata (snapshots, jobs, restore points)
 * - Track backup operations and status
 * - Provide data access interfaces
 *
 * Backup Domain is NOT:
 * - A backup executor
 * - A restorer
 * - A gameplay modifier
 * - A state changer
 * - A reward distributor
 * - A balance modifier
 */

// Entities
export {
  BackupSnapshot,
  type BackupSnapshotProps,
  type BackupSnapshotRecord,
  type BackupSnapshotJSON,
} from './entities/BackupSnapshot';

export {
  BackupJob,
  type BackupJobProps,
  type BackupJobRecord,
  type BackupJobJSON,
  type JobScheduleType,
} from './entities/BackupJob';

export {
  RestorePoint,
  type RestorePointProps,
  type RestorePointRecord,
  type RestorePointJSON,
} from './entities/RestorePoint';

// Value Objects
export { SnapshotId } from './value-objects/SnapshotId';
export { BackupJobId } from './value-objects/BackupJobId';
export { RestorePointId } from './value-objects/RestorePointId';

// Types
export {
  BackupType,
  BACKUP_TYPE_DISPLAY,
  BACKUP_TYPE_DESCRIPTIONS,
  isDataBackupType,
  isSystemBackupType,
  isMetadataBackupType,
  getCriticalBackupTypes,
} from './types/BackupType';

export {
  BackupStatus,
  BACKUP_STATUS_DISPLAY,
  BACKUP_STATUS_COLORS,
  isActiveBackupStatus,
  isTerminalBackupStatus,
  isCancellableBackupStatus,
  isSuccessfulBackupStatus,
} from './types/BackupStatus';

export {
  RestoreStatus,
  RESTORE_STATUS_DISPLAY,
  RESTORE_STATUS_COLORS,
  isActiveRestoreStatus,
  isTerminalRestoreStatus,
  isCancellableRestoreStatus,
  isSuccessfulRestoreStatus,
} from './types/RestoreStatus';

export {
  StorageProvider,
  STORAGE_PROVIDER_DISPLAY,
  STORAGE_PROVIDER_DESCRIPTIONS,
  isCloudStorageProvider,
  isSupabaseStorageProvider,
  requiresCredentials,
} from './types/StorageProvider';

export {
  BackupMetadata,
  INITIAL_BACKUP_METADATA,
  SnapshotMetadata,
  JobMetadata,
  RestoreMetadata,
} from './types/BackupMetadata';

export {
  BackupStatistics,
  createEmptyBackupStatistics,
  SnapshotStatistics,
  JobExecutionStatistics,
  createEmptyJobExecutionStatistics,
} from './types/BackupStatistics';

// DTOs
export {
  BackupSnapshotDto,
  CreateSnapshotDto,
  UpdateSnapshotDto,
  SnapshotListDto,
} from './dto/BackupSnapshot.dto';

export {
  BackupJobDto,
  CreateBackupJobDto,
  UpdateBackupJobDto,
  JobListDto,
} from './dto/BackupJob.dto';

export {
  RestorePointDto,
  CreateRestorePointDto,
  RestorePointListDto,
} from './dto/RestorePoint.dto';

export {
  BackupResponseDto,
  RestoreResponseDto,
  BackupStatisticsDto,
  BackupStatusDto,
  BackupOperationStatusDto,
} from './dto/BackupResponse.dto';

// Interfaces
export type { IBackupSnapshot } from './interfaces/IBackupSnapshot';
export type { IBackupJob } from './interfaces/IBackupJob';
export type { IRestorePoint } from './interfaces/IRestorePoint';
export type {
  IBackupRepository,
  SnapshotFilterParams,
  BackupJobFilterParams,
  RestorePointFilterParams,
} from './interfaces/IBackupRepository';

// Validators
export { BackupValidator } from './validators/BackupValidator';
export { SnapshotValidator } from './validators/SnapshotValidator';
export { RestoreValidator } from './validators/RestoreValidator';

// Mappers
export { SnapshotMapper } from './mappers/SnapshotMapper';
export { JobMapper } from './mappers/JobMapper';
export { RestoreMapper } from './mappers/RestoreMapper';

// Events
export { BackupCreated, type BackupCreatedJSON } from './events/BackupCreated.event';
export { BackupCompleted, type BackupCompletedJSON } from './events/BackupCompleted.event';
export { BackupFailed, type BackupFailedJSON } from './events/BackupFailed.event';
export { RestorePointCreated, type RestorePointCreatedJSON } from './events/RestorePointCreated.event';

// Repositories
export { SupabaseBackupRepository } from './repositories/SupabaseBackupRepository';

// DI
export { BACKUP_TOKENS, registerBackupDependencies, setupBackupDomain } from './di';
