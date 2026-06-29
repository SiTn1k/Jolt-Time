/**
 * IScheduledJob Interface
 *
 * Interface defining the contract for ScheduledJob entities.
 */

import type { JobId } from '../value-objects/JobId';
import type { ScheduleType } from '../types/ScheduleType';
import type { JobStatus } from '../types/JobStatus';
import type { SchedulerPriority } from '../types/SchedulerPriority';
import type { SchedulerJobMetadata } from '../types/SchedulerMetadata';

/**
 * Interface for ScheduledJob domain entity.
 */
export interface IScheduledJob {
  /** Unique job identifier */
  readonly jobId: JobId;
  /** Job key for identification */
  readonly jobKey: string;
  /** Human-readable job name */
  readonly jobName: string;
  /** Schedule type */
  readonly scheduleType: ScheduleType;
  /** Cron expression (if applicable) */
  readonly cronExpression?: string;
  /** Current job status */
  readonly status: JobStatus;
  /** Job priority */
  readonly priority: SchedulerPriority;
  /** Next scheduled run time */
  readonly nextRunAt?: Date;
  /** Last execution time */
  readonly lastRunAt?: Date;
  /** Creation timestamp */
  readonly createdAt: Date;
  /** Last update timestamp */
  readonly updatedAt: Date;
  /** Job metadata */
  readonly metadata: SchedulerJobMetadata;

  /** Checks if job is scheduled */
  isScheduled: boolean;
  /** Checks if job is running */
  isRunning: boolean;
  /** Checks if job is in terminal state */
  isTerminal: boolean;
  /** Checks if job can execute */
  canExecute: boolean;
}
