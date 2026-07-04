/**
 * BackupJob Entity
 *
 * Domain entity representing a backup job.
 * A job defines a scheduled or manual backup operation.
 *
 * BackupJob Entity Responsibilities:
 * - Store job metadata (ID, name, schedule)
 * - Track job status (last run, next run)
 * - Record job configuration
 *
 * BackupJob Entity is NOT:
 * - A job executor
 * - A scheduler
 * - A gameplay modifier
 * - A state changer
 */

import type { IBackupJob } from '../interfaces/IBackupJob';
import { BackupJobId } from '../value-objects/BackupJobId';
import type { BackupType } from '../types/BackupType';
import type { BackupStatus } from '../types/BackupStatus';
import type { JobMetadata } from '../types/BackupMetadata';

/**
 * Schedule type for backup jobs.
 */
export type JobScheduleType = 'cron' | 'interval' | 'daily' | 'weekly' | 'monthly' | 'manual' | 'startup';

/**
 * BackupJob entity props for constructor.
 */
export interface BackupJobProps {
  jobId: BackupJobId;
  jobName: string;
  scheduleType: JobScheduleType;
  status: BackupStatus;
  lastRunAt: Date | null;
  nextRunAt: Date | null;
  metadata: JobMetadata;
}

/**
 * Database record representation of BackupJob.
 */
export interface BackupJobRecord {
  job_id: string;
  job_name: string;
  schedule_type: string;
  status: string;
  last_run_at: string | null;
  next_run_at: string | null;
  metadata: JobMetadata;
}

/**
 * JSON serialization representation of BackupJob.
 */
export interface BackupJobJSON {
  jobId: string;
  jobName: string;
  scheduleType: JobScheduleType;
  status: BackupStatus;
  lastRunAt: string | null;
  nextRunAt: string | null;
  metadata: JobMetadata;
}

/**
 * BackupJob entity class.
 * Immutable domain entity representing a backup job.
 */
export class BackupJob implements IBackupJob {
  public readonly jobId: BackupJobId;
  public readonly jobName: string;
  public readonly scheduleType: JobScheduleType;
  public readonly status: BackupStatus;
  public readonly lastRunAt: Date | null;
  public readonly nextRunAt: Date | null;
  public readonly metadata: JobMetadata;

  /**
   * Creates a new BackupJob instance.
   */
  constructor(props: BackupJobProps) {
    this.jobId = props.jobId;
    this.jobName = props.jobName;
    this.scheduleType = props.scheduleType;
    this.status = props.status;
    this.lastRunAt = props.lastRunAt;
    this.nextRunAt = props.nextRunAt;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new BackupJob entity.
   * Factory method for new job creation.
   */
  public static create(params: {
    jobId?: BackupJobId;
    jobName: string;
    scheduleType: JobScheduleType;
    status?: BackupStatus;
    lastRunAt?: Date | null;
    nextRunAt?: Date | null;
    metadata?: JobMetadata;
  }): BackupJob {
    return new BackupJob({
      jobId: params.jobId ?? BackupJobId.generate(),
      jobName: params.jobName,
      scheduleType: params.scheduleType,
      status: params.status ?? 'pending',
      lastRunAt: params.lastRunAt ?? null,
      nextRunAt: params.nextRunAt ?? null,
      metadata: params.metadata ?? {
        jobType: 'backup',
        cronExpression: null,
        intervalMs: null,
        retentionDays: 30,
        verifyAfterBackup: false,
        compressBeforeStorage: false,
        encryptBeforeStorage: false,
        storageProvider: 'supabase',
        storageBucket: 'backups',
        config: {},
      },
    });
  }

  /**
   * Reconstructs a BackupJob from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: BackupJobRecord): BackupJob {
    return new BackupJob({
      jobId: BackupJobId.reconstruct(record.job_id),
      jobName: record.job_name,
      scheduleType: record.schedule_type as JobScheduleType,
      status: record.status as BackupStatus,
      lastRunAt: record.last_run_at ? new Date(record.last_run_at) : null,
      nextRunAt: record.next_run_at ? new Date(record.next_run_at) : null,
      metadata: record.metadata,
    });
  }

  /**
   * Checks if this job is scheduled to run.
   */
  public get isScheduled(): boolean {
    return this.scheduleType !== 'manual';
  }

  /**
   * Checks if this job is currently active.
   */
  public get isActive(): boolean {
    return this.status === 'pending' || this.status === 'in_progress';
  }

  /**
   * Checks if this job is in a terminal state.
   */
  public get isTerminal(): boolean {
    return this.status === 'completed' || this.status === 'failed' || this.status === 'cancelled';
  }

  /**
   * Checks if this job should run at startup.
   */
  public get runsAtStartup(): boolean {
    return this.scheduleType === 'startup';
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<BackupJobProps, 'jobId'>>): BackupJob {
    return new BackupJob({
      jobId: this.jobId,
      jobName: params.jobName ?? this.jobName,
      scheduleType: params.scheduleType ?? this.scheduleType,
      status: params.status ?? this.status,
      lastRunAt: params.lastRunAt ?? this.lastRunAt,
      nextRunAt: params.nextRunAt ?? this.nextRunAt,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the BackupJob to a plain object.
   */
  public toJSON(): BackupJobJSON {
    return {
      jobId: this.jobId.value,
      jobName: this.jobName,
      scheduleType: this.scheduleType,
      status: this.status,
      lastRunAt: this.lastRunAt?.toISOString() ?? null,
      nextRunAt: this.nextRunAt?.toISOString() ?? null,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): BackupJobRecord {
    return {
      job_id: this.jobId.value,
      job_name: this.jobName,
      schedule_type: this.scheduleType,
      status: this.status,
      last_run_at: this.lastRunAt?.toISOString() ?? null,
      next_run_at: this.nextRunAt?.toISOString() ?? null,
      metadata: this.metadata,
    };
  }
}
