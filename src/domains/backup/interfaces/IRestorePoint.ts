/**
 * IRestorePoint Interface
 *
 * Interface defining the contract for RestorePoint entities.
 */

import type { RestorePointId } from '../value-objects/RestorePointId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { RestoreMetadata } from '../types/BackupMetadata';

/**
 * RestorePoint interface.
 * Defines the contract for restore point entities.
 */
export interface IRestorePoint {
  /** Unique restore point identifier */
  readonly restorePointId: RestorePointId;

  /** Associated snapshot ID */
  readonly snapshotId: SnapshotId;

  /** Creation timestamp */
  readonly createdAt: Date;

  /** Description of the restore point */
  readonly description: string;

  /** Additional metadata */
  readonly metadata: RestoreMetadata;

  /** Checks if rollback is available */
  readonly hasRollback: boolean;

  /** Checks if this was a dry run */
  readonly wasDryRun: boolean;
}
