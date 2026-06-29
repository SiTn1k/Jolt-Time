/**
 * JobFinished Event
 *
 * Domain event emitted when a job execution finishes successfully.
 */

import type { SchedulerExecutionMetadata } from '../types/SchedulerMetadata';

/**
 * Event data for job completion.
 */
export interface JobFinishedEventData {
  /** Job ID */
  jobId: string;
  /** Job key */
  jobKey: string;
  /** Execution ID */
  executionId: string;
  /** Execution duration in milliseconds */
  durationMs: number;
  /** Execution metadata */
  metadata: SchedulerExecutionMetadata;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for job completion.
 */
export interface JobFinishedEvent {
  /** Event type identifier */
  readonly eventType: 'JobFinished';
  /** Event data */
  readonly data: JobFinishedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a JobFinishedEvent.
 */
export function createJobFinishedEvent(params: {
  jobId: string;
  jobKey: string;
  executionId: string;
  durationMs: number;
  metadata?: SchedulerExecutionMetadata;
}): JobFinishedEvent {
  return {
    eventType: 'JobFinished',
    version: 1,
    data: {
      jobId: params.jobId,
      jobKey: params.jobKey,
      executionId: params.executionId,
      durationMs: params.durationMs,
      metadata: params.metadata ?? {},
      occurredAt: new Date(),
    },
  };
}
