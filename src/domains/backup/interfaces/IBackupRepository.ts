/**
 * IBackupRepository Interface
 *
 * Interface defining the contract for Backup persistence.
 * All backup repository implementations must adhere to this interface.
 *
 * NOTE: This is the foundation interface. Backup execution, compression,
 * encryption, cloud storage, restore process, integrity check, and retention
 * belong to P-186.2.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { BackupJobId } from '../value-objects/BackupJobId';
import type { RestorePointId } from '../value-objects/RestorePointId';
import type { BackupSnapshot } from '../entities/BackupSnapshot';
import type { BackupJob } from '../entities/BackupJob';
import type { RestorePoint } from '../entities/RestorePoint';
import type { BackupType } from '../types/BackupType';
import type { BackupStatus } from '../types/BackupStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying snapshots.
 */
export interface SnapshotFilterParams {
  /** Filter by snapshot name */
  snapshotName?: string;

  /** Filter by backup type */
  backupType?: BackupType;

  /** Filter by status */
  status?: BackupStatus;

  /** Filter by storage location */
  storageLocation?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying backup jobs.
 */
export interface BackupJobFilterParams {
  /** Filter by job name */
  jobName?: string;

  /** Filter by schedule type */
  scheduleType?: string;

  /** Filter by status */
  status?: BackupStatus;

  /** Filter by last run after */
  lastRunAfter?: Date;

  /** Filter by last run before */
  lastRunBefore?: Date;
}

/**
 * Filter parameters for querying restore points.
 */
export interface RestorePointFilterParams {
  /** Filter by snapshot ID */
  snapshotId?: string;

  /** Filter by description (partial match) */
  description?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Backup repository interface.
 * Defines all data access operations for backup entities.
 *
 * IMPORTANT: Backup is a METADATA management layer. It ONLY stores backup metadata,
 * jobs, and restore points. Backup MUST NEVER:
 * - Execute backups
 * - Restore data automatically
 * - Modify gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 */
export interface IBackupRepository {
  // ============ Backup Snapshot Operations ============

  /**
   * Creates a new backup snapshot record.
   * @param snapshot The snapshot to create
   * @returns The created snapshot
   */
  createSnapshot(snapshot: BackupSnapshot): Promise<BackupSnapshot>;

  /**
   * Finds a snapshot by its ID.
   * @param id The snapshot ID to find
   * @returns The snapshot if found, null otherwise
   */
  findSnapshotById(id: SnapshotId): Promise<BackupSnapshot | null>;

  /**
   * Lists snapshots with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of snapshots
   */
  listSnapshots(
    params: PaginationParams,
    filters?: SnapshotFilterParams
  ): Promise<PaginatedResult<BackupSnapshot>>;

  /**
   * Counts snapshots with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching snapshots
   */
  countSnapshots(filters?: SnapshotFilterParams): Promise<number>;

  /**
   * Updates an existing snapshot.
   * @param snapshot The snapshot to update
   * @returns The updated snapshot
   */
  updateSnapshot(snapshot: BackupSnapshot): Promise<BackupSnapshot>;

  /**
   * Deletes a snapshot record.
   * @param id The snapshot ID to delete
   * @returns True if deleted, false if not found
   */
  deleteSnapshot(id: SnapshotId): Promise<boolean>;

  // ============ Backup Job Operations ============

  /**
   * Creates a new backup job record.
   * @param job The job to create
   * @returns The created job
   */
  createJob(job: BackupJob): Promise<BackupJob>;

  /**
   * Finds a job by its ID.
   * @param id The job ID to find
   * @returns The job if found, null otherwise
   */
  findJobById(id: BackupJobId): Promise<BackupJob | null>;

  /**
   * Lists jobs with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of jobs
   */
  listJobs(
    params: PaginationParams,
    filters?: BackupJobFilterParams
  ): Promise<PaginatedResult<BackupJob>>;

  /**
   * Counts jobs with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching jobs
   */
  countJobs(filters?: BackupJobFilterParams): Promise<number>;

  /**
   * Updates an existing job.
   * @param job The job to update
   * @returns The updated job
   */
  updateJob(job: BackupJob): Promise<BackupJob>;

  /**
   * Deletes a job record.
   * @param id The job ID to delete
   * @returns True if deleted, false if not found
   */
  deleteJob(id: BackupJobId): Promise<boolean>;

  // ============ Restore Point Operations ============

  /**
   * Creates a new restore point record.
   * @param restorePoint The restore point to create
   * @returns The created restore point
   */
  createRestorePoint(restorePoint: RestorePoint): Promise<RestorePoint>;

  /**
   * Finds a restore point by its ID.
   * @param id The restore point ID to find
   * @returns The restore point if found, null otherwise
   */
  findRestorePointById(id: RestorePointId): Promise<RestorePoint | null>;

  /**
   * Lists restore points with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of restore points
   */
  listRestorePoints(
    params: PaginationParams,
    filters?: RestorePointFilterParams
  ): Promise<PaginatedResult<RestorePoint>>;

  /**
   * Counts restore points with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching restore points
   */
  countRestorePoints(filters?: RestorePointFilterParams): Promise<number>;

  /**
   * Deletes a restore point record.
   * @param id The restore point ID to delete
   * @returns True if deleted, false if not found
   */
  deleteRestorePoint(id: RestorePointId): Promise<boolean>;
}
