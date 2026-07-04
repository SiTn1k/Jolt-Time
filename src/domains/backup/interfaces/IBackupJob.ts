/**
 * IBackupJob Interface
 *
 * Interface defining the contract for BackupJob entities.
 */

import type { BackupJobId } from '../value-objects/BackupJobId';
import type { BackupStatus } from '../types/BackupStatus';
import type { JobMetadata } from '../types/BackupMetadata';
import type { JobScheduleType } from '../entities/BackupJob';

/**
 * BackupJob interface.
 * Defines the contract for backup job entities.
 */
export interface IBackupJob {
  /** Unique job identifier */
  readonly jobId: BackupJobId;

  /** Display name of the job */
  readonly jobName: string;

  /** Schedule type */
  readonly scheduleType: JobScheduleType;

  /** Current status */
  readonly status: BackupStatus;

  /** Last execution timestamp */
  readonly lastRunAt: Date | null;

  /** Next scheduled execution timestamp */
  readonly nextRunAt: Date | null;

  /** Additional metadata */
  readonly metadata: JobMetadata;

  /** Checks if job is scheduled to run */
  readonly isScheduled: boolean;

  /** Checks if job is currently active */
  readonly isActive: boolean;

  /** Checks if job is in a terminal state */
  readonly isTerminal: boolean;

  /** Checks if job runs at startup */
  readonly runsAtStartup: boolean;
}
