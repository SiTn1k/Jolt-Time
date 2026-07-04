/**
 * BackupMetadata
 *
 * Metadata associated with a backup operation.
 */

/**
 * Initial empty backup metadata.
 */
export const INITIAL_BACKUP_METADATA: BackupMetadata = {
  name: '',
  description: '',
  tags: [],
  sourceVersion: '',
  createdBy: 'system',
};

/**
 * Backup metadata interface.
 */
export interface BackupMetadata {
  /** Display name of the backup */
  name: string;

  /** Description of the backup */
  description: string;

  /** Tags for categorization */
  tags: string[];

  /** Version of the system when backup was created */
  sourceVersion: string;

  /** User or system that created the backup */
  createdBy: string;
}

/**
 * Snapshot-specific metadata.
 */
export interface SnapshotMetadata extends BackupMetadata {
  /** Parent snapshot ID for incremental backups */
  parentSnapshotId: string | null;

  /** Number of tables included in backup */
  tableCount: number;

  /** Number of records included in backup */
  recordCount: number;

  /** Compression ratio achieved */
  compressionRatio: number | null;

  /** Encryption algorithm used */
  encryptionAlgorithm: string | null;
}

/**
 * Job-specific metadata.
 */
export interface JobMetadata {
  /** Job type identifier */
  jobType: string;

  /** Cron expression if scheduled */
  cronExpression: string | null;

  /** Interval in milliseconds if interval-based */
  intervalMs: number | null;

  /** Maximum retention days */
  retentionDays: number;

  /** Whether to verify after backup */
  verifyAfterBackup: boolean;

  /** Whether to compress before storage */
  compressBeforeStorage: boolean;

  /** Whether to encrypt before storage */
  encryptBeforeStorage: boolean;

  /** Target storage provider */
  storageProvider: string;

  /** Storage bucket/container name */
  storageBucket: string;

  /** Additional configuration */
  config: Record<string, unknown>;
}

/**
 * Restore-specific metadata.
 */
export interface RestoreMetadata {
  /** Original backup type */
  originalBackupType: string;

  /** Original snapshot ID */
  originalSnapshotId: string;

  /** Tables included in restore */
  tablesRestored: string[];

  /** Records restored */
  recordsRestored: number;

  /** Whether dry run was performed */
  dryRun: boolean;

  /** Rollback available */
  rollbackAvailable: boolean;

  /** User who initiated restore */
  initiatedBy: string;
}
