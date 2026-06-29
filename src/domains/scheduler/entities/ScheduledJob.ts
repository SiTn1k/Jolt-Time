/**
 * ScheduledJob Entity
 *
 * Domain entity representing a scheduled job.
 * Jobs define what should run and when.
 */

import type { IScheduledJob } from '../interfaces/IScheduledJob';
import { JobId } from '../value-objects/JobId';
import type { ScheduleType } from '../types/ScheduleType';
import type { JobStatus } from '../types/JobStatus';
import type { SchedulerPriority } from '../types/SchedulerPriority';
import type { SchedulerJobMetadata } from '../types/SchedulerMetadata';

/**
 * ScheduledJob entity props for constructor.
 */
export interface ScheduledJobProps {
  jobId: JobId;
  jobKey: string;
  jobName: string;
  scheduleType: ScheduleType;
  cronExpression?: string;
  status: JobStatus;
  priority: SchedulerPriority;
  nextRunAt?: Date;
  lastRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata: SchedulerJobMetadata;
}

/**
 * Database record representation of ScheduledJob.
 */
export interface ScheduledJobRecord {
  job_id: string;
  job_key: string;
  job_name: string;
  schedule_type: ScheduleType;
  cron_expression?: string;
  status: JobStatus;
  priority: SchedulerPriority;
  next_run_at?: string;
  last_run_at?: string;
  created_at: string;
  updated_at: string;
  metadata: SchedulerJobMetadata;
}

/**
 * JSON serialization representation of ScheduledJob.
 */
export interface ScheduledJobJSON {
  jobId: string;
  jobKey: string;
  jobName: string;
  scheduleType: ScheduleType;
  cronExpression?: string;
  status: JobStatus;
  priority: SchedulerPriority;
  nextRunAt?: string;
  lastRunAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata: SchedulerJobMetadata;
}

/**
 * ScheduledJob entity class.
 * Immutable domain entity representing a scheduled job.
 */
export class ScheduledJob implements IScheduledJob {
  public readonly jobId: JobId;
  public readonly jobKey: string;
  public readonly jobName: string;
  public readonly scheduleType: ScheduleType;
  public readonly cronExpression?: string;
  public readonly status: JobStatus;
  public readonly priority: SchedulerPriority;
  public readonly nextRunAt?: Date;
  public readonly lastRunAt?: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly metadata: SchedulerJobMetadata;

  /**
   * Creates a new ScheduledJob instance.
   */
  constructor(props: ScheduledJobProps) {
    this.jobId = props.jobId;
    this.jobKey = props.jobKey;
    this.jobName = props.jobName;
    this.scheduleType = props.scheduleType;
    this.cronExpression = props.cronExpression;
    this.status = props.status;
    this.priority = props.priority;
    this.nextRunAt = props.nextRunAt;
    this.lastRunAt = props.lastRunAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new ScheduledJob entity.
   */
  public static create(params: {
    jobId?: JobId;
    jobKey: string;
    jobName: string;
    scheduleType: ScheduleType;
    cronExpression?: string;
    priority?: SchedulerPriority;
    nextRunAt?: Date;
    metadata?: SchedulerJobMetadata;
  }): ScheduledJob {
    const now = new Date();

    return new ScheduledJob({
      jobId: params.jobId ?? JobId.create(),
      jobKey: params.jobKey,
      jobName: params.jobName,
      scheduleType: params.scheduleType,
      cronExpression: params.cronExpression,
      status: 'pending',
      priority: params.priority ?? 'normal',
      nextRunAt: params.nextRunAt,
      lastRunAt: undefined,
      createdAt: now,
      updatedAt: now,
      metadata: params.metadata ?? {
        jobKey: params.jobKey,
        scheduleType: params.scheduleType,
        priority: params.priority ?? 'normal',
        isEnabled: true,
        maxRetries: 3,
        timeoutMs: 60000,
      },
    });
  }

  /**
   * Reconstructs a ScheduledJob from stored data.
   */
  public static fromStorage(record: ScheduledJobRecord): ScheduledJob {
    return new ScheduledJob({
      jobId: JobId.reconstruct(record.job_id),
      jobKey: record.job_key,
      jobName: record.job_name,
      scheduleType: record.schedule_type,
      cronExpression: record.cron_expression,
      status: record.status,
      priority: record.priority,
      nextRunAt: record.next_run_at ? new Date(record.next_run_at) : undefined,
      lastRunAt: record.last_run_at ? new Date(record.last_run_at) : undefined,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      metadata: record.metadata,
    });
  }

  /**
   * Checks if the job is scheduled to run.
   */
  public get isScheduled(): boolean {
    return this.status === 'scheduled';
  }

  /**
   * Checks if the job is currently running.
   */
  public get isRunning(): boolean {
    return this.status === 'running';
  }

  /**
   * Checks if the job is in a terminal state.
   */
  public get isTerminal(): boolean {
    return this.status === 'completed' || this.status === 'failed' || this.status === 'cancelled';
  }

  /**
   * Checks if the job can be executed.
   */
  public get canExecute(): boolean {
    return this.status === 'scheduled' || this.status === 'pending';
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<ScheduledJobProps, 'jobId' | 'createdAt'>>): ScheduledJob {
    return new ScheduledJob({
      jobId: this.jobId,
      jobKey: params.jobKey ?? this.jobKey,
      jobName: params.jobName ?? this.jobName,
      scheduleType: params.scheduleType ?? this.scheduleType,
      cronExpression: params.cronExpression ?? this.cronExpression,
      status: params.status ?? this.status,
      priority: params.priority ?? this.priority,
      nextRunAt: params.nextRunAt ?? this.nextRunAt,
      lastRunAt: params.lastRunAt ?? this.lastRunAt,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the ScheduledJob to a plain object.
   */
  public toJSON(): ScheduledJobJSON {
    return {
      jobId: this.jobId.value,
      jobKey: this.jobKey,
      jobName: this.jobName,
      scheduleType: this.scheduleType,
      cronExpression: this.cronExpression,
      status: this.status,
      priority: this.priority,
      nextRunAt: this.nextRunAt?.toISOString(),
      lastRunAt: this.lastRunAt?.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): ScheduledJobRecord {
    return {
      job_id: this.jobId.value,
      job_key: this.jobKey,
      job_name: this.jobName,
      schedule_type: this.scheduleType,
      cron_expression: this.cronExpression,
      status: this.status,
      priority: this.priority,
      next_run_at: this.nextRunAt?.toISOString(),
      last_run_at: this.lastRunAt?.toISOString(),
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
      metadata: this.metadata,
    };
  }
}
