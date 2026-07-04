/**
 * BackupStatistics
 *
 * Statistics and metrics for backup operations.
 */

/**
 * Backup statistics interface.
 */
export interface BackupStatistics {
  /** Total number of snapshots */
  totalSnapshots: number;

  /** Total storage used in bytes */
  totalStorageBytes: number;

  /** Number of successful backups */
  successfulBackups: number;

  /** Number of failed backups */
  failedBackups: number;

  /** Average backup duration in milliseconds */
  averageBackupDurationMs: number;

  /** Last successful backup timestamp */
  lastSuccessfulBackup: Date | null;

  /** Last backup attempt timestamp */
  lastBackupAttempt: Date | null;

  /** Storage provider breakdown */
  storageByProvider: Record<string, number>;

  /** Backup type breakdown */
  backupsByType: Record<string, number>;
}

/**
 * Create empty backup statistics.
 */
export function createEmptyBackupStatistics(): BackupStatistics {
  return {
    totalSnapshots: 0,
    totalStorageBytes: 0,
    successfulBackups: 0,
    failedBackups: 0,
    averageBackupDurationMs: 0,
    lastSuccessfulBackup: null,
    lastBackupAttempt: null,
    storageByProvider: {},
    backupsByType: {},
  };
}

/**
 * Snapshot statistics interface.
 */
export interface SnapshotStatistics {
  /** Total size in bytes */
  sizeBytes: number;

  /** Checksum of the snapshot */
  checksum: string;

  /** Creation timestamp */
  createdAt: Date;

  /** Verification timestamp */
  verifiedAt: Date | null;

  /** Restore count */
  restoreCount: number;

  /** Last restore timestamp */
  lastRestoredAt: Date | null;
}

/**
 * Job execution statistics.
 */
export interface JobExecutionStatistics {
  /** Total executions */
  totalExecutions: number;

  /** Successful executions */
  successfulExecutions: number;

  /** Failed executions */
  failedExecutions: number;

  /** Average execution duration in milliseconds */
  averageDurationMs: number;

  /** Last execution timestamp */
  lastExecutedAt: Date | null;

  /** Next scheduled execution */
  nextScheduledAt: Date | null;
}

/**
 * Create empty job execution statistics.
 */
export function createEmptyJobExecutionStatistics(): JobExecutionStatistics {
  return {
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    averageDurationMs: 0,
    lastExecutedAt: null,
    nextScheduledAt: null,
  };
}
