/**
 * IJobExecution Interface
 *
 * Interface defining the contract for JobExecution entities.
 */

import type { ExecutionId } from '../value-objects/ExecutionId';
import type { JobId } from '../value-objects/JobId';
import type { ExecutionStatus } from '../types/ExecutionStatus';
import type { SchedulerExecutionMetadata } from '../types/SchedulerMetadata';

/**
 * Interface for JobExecution domain entity.
 */
export interface IJobExecution {
  /** Unique execution identifier */
  readonly executionId: ExecutionId;
  /** Associated job identifier */
  readonly jobId: JobId;
  /** Execution start time */
  readonly startedAt: Date;
  /** Execution end time */
  readonly finishedAt?: Date;
  /** Execution duration in milliseconds */
  readonly duration?: number;
  /** Current execution status */
  readonly status: ExecutionStatus;
  /** Error message if failed */
  readonly errorMessage?: string;
  /** Execution metadata */
  readonly metadata: SchedulerExecutionMetadata;

  /** Checks if execution is running */
  isRunning: boolean;
  /** Checks if execution is in terminal state */
  isTerminal: boolean;
  /** Checks if execution was successful */
  isSuccessful: boolean;
  /** Checks if execution failed */
  hasFailed: boolean;
}
