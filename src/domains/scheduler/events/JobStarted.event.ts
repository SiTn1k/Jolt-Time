/**
 * JobStarted Event
 *
 * Domain event emitted when a job execution starts.
 */

import type { SchedulerExecutionMetadata } from '../types/SchedulerMetadata';

/**
 * Event data for job start.
 */
export interface JobStartedEventData {
  /** Job ID */
  jobId: string;
  /** Job key */
  jobKey: string;
  /** Execution ID */
  executionId: string;
  /** Execution metadata */
  metadata: SchedulerExecutionMetadata;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for job start.
 */
export interface JobStartedEvent {
  /** Event type identifier */
  readonly eventType: 'JobStarted';
  /** Event data */
  readonly data: JobStartedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a JobStartedEvent.
 */
export function createJobStartedEvent(params: {
  jobId: string;
  jobKey: string;
  executionId: string;
  metadata?: SchedulerExecutionMetadata;
}): JobStartedEvent {
  return {
    eventType: 'JobStarted',
    version: 1,
    data: {
      jobId: params.jobId,
      jobKey: params.jobKey,
      executionId: params.executionId,
      metadata: params.metadata ?? {},
      occurredAt: new Date(),
    },
  };
}
