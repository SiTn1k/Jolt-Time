/**
 * JobExecution Entity
 *
 * Domain entity representing a job execution.
 * Executions track the runtime history of a scheduled job.
 */

import type { IJobExecution } from '../interfaces/IJobExecution';
import { ExecutionId } from '../value-objects/ExecutionId';
import { JobId } from '../value-objects/JobId';
import type { ExecutionStatus } from '../types/ExecutionStatus';
import type { SchedulerExecutionMetadata } from '../types/SchedulerMetadata';

/**
 * JobExecution entity props for constructor.
 */
export interface JobExecutionProps {
  executionId: ExecutionId;
  jobId: JobId;
  startedAt: Date;
  finishedAt?: Date;
  duration?: number;
  status: ExecutionStatus;
  errorMessage?: string;
  metadata: SchedulerExecutionMetadata;
}

/**
 * Database record representation of JobExecution.
 */
export interface JobExecutionRecord {
  execution_id: string;
  job_id: string;
  started_at: string;
  finished_at?: string;
  duration?: number;
  status: ExecutionStatus;
  error_message?: string;
  metadata: SchedulerExecutionMetadata;
}

/**
 * JSON serialization representation of JobExecution.
 */
export interface JobExecutionJSON {
  executionId: string;
  jobId: string;
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  status: ExecutionStatus;
  errorMessage?: string;
  metadata: SchedulerExecutionMetadata;
}

/**
 * JobExecution entity class.
 * Immutable domain entity representing a job execution.
 */
export class JobExecution implements IJobExecution {
  public readonly executionId: ExecutionId;
  public readonly jobId: JobId;
  public readonly startedAt: Date;
  public readonly finishedAt?: Date;
  public readonly duration?: number;
  public readonly status: ExecutionStatus;
  public readonly errorMessage?: string;
  public readonly metadata: SchedulerExecutionMetadata;

  /**
   * Creates a new JobExecution instance.
   */
  constructor(props: JobExecutionProps) {
    this.executionId = props.executionId;
    this.jobId = props.jobId;
    this.startedAt = props.startedAt;
    this.finishedAt = props.finishedAt;
    this.duration = props.duration;
    this.status = props.status;
    this.errorMessage = props.errorMessage;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new JobExecution entity.
   */
  public static create(params: {
    executionId?: ExecutionId;
    jobId: JobId;
    metadata?: SchedulerExecutionMetadata;
  }): JobExecution {
    return new JobExecution({
      executionId: params.executionId ?? ExecutionId.create(),
      jobId: params.jobId,
      startedAt: new Date(),
      finishedAt: undefined,
      duration: undefined,
      status: 'pending',
      errorMessage: undefined,
      metadata: params.metadata ?? {},
    });
  }

  /**
   * Marks execution as waiting in queue.
   */
  public markWaiting(): JobExecution {
    if (this.status !== 'pending') {
      throw new Error(`Cannot mark waiting execution in ${this.status} status`);
    }
    return new JobExecution({
      executionId: this.executionId,
      jobId: this.jobId,
      startedAt: this.startedAt,
      finishedAt: undefined,
      duration: undefined,
      status: 'waiting',
      errorMessage: undefined,
      metadata: this.metadata,
    });
  }

  /**
   * Marks execution as retrying.
   */
  public markRetrying(errorMessage?: string): JobExecution {
    if (this.status !== 'running' && this.status !== 'failed' && this.status !== 'timeout') {
      throw new Error(`Cannot mark retrying execution in ${this.status} status`);
    }
    return new JobExecution({
      executionId: this.executionId,
      jobId: this.jobId,
      startedAt: this.startedAt,
      finishedAt: undefined,
      duration: undefined,
      status: 'retrying',
      errorMessage: errorMessage ?? this.errorMessage,
      metadata: {
        ...this.metadata,
        lastRetryAt: new Date().toISOString(),
      },
    });
  }

  /**
   * Marks execution as timed out.
   */
  public markTimeout(): JobExecution {
    if (this.status !== 'running') {
      throw new Error(`Cannot timeout execution in ${this.status} status`);
    }
    const finishedAt = new Date();
    const duration = finishedAt.getTime() - this.startedAt.getTime();
    return new JobExecution({
      executionId: this.executionId,
      jobId: this.jobId,
      startedAt: this.startedAt,
      finishedAt,
      duration,
      status: 'timeout',
      errorMessage: 'Execution timed out',
      metadata: this.metadata,
    });
  }

  /**
   * Reconstructs a JobExecution from stored data.
   */
  public static fromStorage(record: JobExecutionRecord): JobExecution {
    return new JobExecution({
      executionId: ExecutionId.reconstruct(record.execution_id),
      jobId: JobId.reconstruct(record.job_id),
      startedAt: new Date(record.started_at),
      finishedAt: record.finished_at ? new Date(record.finished_at) : undefined,
      duration: record.duration,
      status: record.status,
      errorMessage: record.error_message,
      metadata: record.metadata,
    });
  }

  /**
   * Starts the execution (transitions from pending to running).
   */
  public start(): JobExecution {
    if (this.status !== 'pending') {
      throw new Error(`Cannot start execution in ${this.status} status`);
    }
    return new JobExecution({
      executionId: this.executionId,
      jobId: this.jobId,
      startedAt: this.startedAt,
      finishedAt: undefined,
      duration: undefined,
      status: 'running',
      errorMessage: undefined,
      metadata: this.metadata,
    });
  }

  /**
   * Completes the execution successfully.
   */
  public complete(): JobExecution {
    if (this.status !== 'running' && this.status !== 'waiting' && this.status !== 'retrying') {
      throw new Error(`Cannot complete execution in ${this.status} status`);
    }
    const finishedAt = new Date();
    const duration = finishedAt.getTime() - this.startedAt.getTime();
    return new JobExecution({
      executionId: this.executionId,
      jobId: this.jobId,
      startedAt: this.startedAt,
      finishedAt,
      duration,
      status: 'success',
      errorMessage: undefined,
      metadata: this.metadata,
    });
  }

  /**
   * Fails the execution with an error message.
   */
  public fail(errorMessage: string): JobExecution {
    if (this.status !== 'running' && this.status !== 'pending' && this.status !== 'waiting' && this.status !== 'retrying') {
      throw new Error(`Cannot fail execution in ${this.status} status`);
    }
    const finishedAt = new Date();
    const duration = finishedAt.getTime() - this.startedAt.getTime();
    return new JobExecution({
      executionId: this.executionId,
      jobId: this.jobId,
      startedAt: this.startedAt,
      finishedAt,
      duration,
      status: 'failed',
      errorMessage,
      metadata: this.metadata,
    });
  }

  /**
   * Cancels the execution.
   */
  public cancel(): JobExecution {
    if (this.status !== 'pending' && this.status !== 'waiting' && this.status !== 'running' && this.status !== 'retrying') {
      throw new Error(`Cannot cancel execution in ${this.status} status`);
    }
    const finishedAt = new Date();
    const duration = finishedAt.getTime() - this.startedAt.getTime();
    return new JobExecution({
      executionId: this.executionId,
      jobId: this.jobId,
      startedAt: this.startedAt,
      finishedAt,
      duration,
      status: 'cancelled',
      errorMessage: this.errorMessage,
      metadata: this.metadata,
    });
  }

  /**
   * Checks if the execution is running.
   */
  public get isRunning(): boolean {
    return this.status === 'running';
  }

  /**
   * Checks if the execution is in a terminal state.
   */
  public get isTerminal(): boolean {
    return this.status === 'success' || this.status === 'failed' || this.status === 'timeout' || this.status === 'cancelled';
  }

  /**
   * Checks if the execution was successful.
   */
  public get isSuccessful(): boolean {
    return this.status === 'success';
  }

  /**
   * Checks if the execution failed.
   */
  public get hasFailed(): boolean {
    return this.status === 'failed' || this.status === 'timeout';
  }

  /**
   * Serializes the JobExecution to a plain object.
   */
  public toJSON(): JobExecutionJSON {
    return {
      executionId: this.executionId.value,
      jobId: this.jobId.value,
      startedAt: this.startedAt.toISOString(),
      finishedAt: this.finishedAt?.toISOString(),
      duration: this.duration,
      status: this.status,
      errorMessage: this.errorMessage,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): JobExecutionRecord {
    return {
      execution_id: this.executionId.value,
      job_id: this.jobId.value,
      started_at: this.startedAt.toISOString(),
      finished_at: this.finishedAt?.toISOString(),
      duration: this.duration,
      status: this.status,
      error_message: this.errorMessage,
      metadata: this.metadata,
    };
  }
}
