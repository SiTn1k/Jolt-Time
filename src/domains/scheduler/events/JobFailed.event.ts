/**
 * JobFailed Event
 *
 * Domain event emitted when a job execution fails.
 */

import type { SchedulerExecutionMetadata } from '../types/SchedulerMetadata';

/**
 * Event data for job failure.
 */
export interface JobFailedEventData {
  /** Job ID */
  jobId: string;
  /** Job key */
  jobKey: string;
  /** Execution ID */
  executionId: string;
  /** Error message */
  errorMessage: string;
  /** Execution duration in milliseconds */
  durationMs?: number;
  /** Execution metadata */
  metadata: SchedulerExecutionMetadata;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for job failure.
 */
export interface JobFailedEvent {
  /** Event type identifier */
  readonly eventType: 'JobFailed';
  /** Event data */
  readonly data: JobFailedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a JobFailedEvent.
 */
export function createJobFailedEvent(params: {
  jobId: string;
  jobKey: string;
  executionId: string;
  errorMessage: string;
  durationMs?: number;
  metadata?: SchedulerExecutionMetadata;
}): JobFailedEvent {
  return {
    eventType: 'JobFailed',
    version: 1,
    data: {
      jobId: params.jobId,
      jobKey: params.jobKey,
      executionId: params.executionId,
      errorMessage: params.errorMessage,
      durationMs: params.durationMs,
      metadata: params.metadata ?? {},
      occurredAt: new Date(),
    },
  };
}
