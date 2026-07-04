/**
 * IBackupSnapshot Interface
 *
 * Interface defining the contract for BackupSnapshot entities.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { BackupType } from '../types/BackupType';
import type { BackupStatus } from '../types/BackupStatus';
import type { SnapshotMetadata } from '../types/BackupMetadata';

/**
 * BackupSnapshot interface.
 * Defines the contract for backup snapshot entities.
 */
export interface IBackupSnapshot {
  /** Unique snapshot identifier */
  readonly snapshotId: SnapshotId;

  /** Display name of the snapshot */
  readonly snapshotName: string;

  /** Type of backup */
  readonly backupType: BackupType;

  /** Current status */
  readonly status: BackupStatus;

  /** Size in bytes */
  readonly size: number;

  /** Checksum for integrity verification */
  readonly checksum: string | null;

  /** Storage location identifier */
  readonly storageLocation: string;

  /** Creation timestamp */
  readonly createdAt: Date;

  /** Additional metadata */
  readonly metadata: SnapshotMetadata;

  /** Checks if snapshot is in a terminal state */
  readonly isTerminal: boolean;

  /** Checks if snapshot is verified */
  readonly isVerified: boolean;

  /** Checks if snapshot can be restored */
  readonly canRestore: boolean;
}
