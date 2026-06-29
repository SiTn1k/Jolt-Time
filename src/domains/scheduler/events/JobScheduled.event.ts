/**
 * JobScheduled Event
 *
 * Domain event emitted when a job is scheduled for execution.
 */

import type { ScheduleType } from '../types/ScheduleType';
import type { SchedulerPriority } from '../types/SchedulerPriority';

/**
 * Event data for job scheduling.
 */
export interface JobScheduledEventData {
  /** Job ID */
  jobId: string;
  /** Job key */
  jobKey: string;
  /** Job name */
  jobName: string;
  /** Schedule type */
  scheduleType: ScheduleType;
  /** Next run time */
  nextRunAt: Date;
  /** Priority */
  priority: SchedulerPriority;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for job scheduling.
 */
export interface JobScheduledEvent {
  /** Event type identifier */
  readonly eventType: 'JobScheduled';
  /** Event data */
  readonly data: JobScheduledEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a JobScheduledEvent.
 */
export function createJobScheduledEvent(params: {
  jobId: string;
  jobKey: string;
  jobName: string;
  scheduleType: ScheduleType;
  nextRunAt: Date;
  priority: SchedulerPriority;
}): JobScheduledEvent {
  return {
    eventType: 'JobScheduled',
    version: 1,
    data: {
      jobId: params.jobId,
      jobKey: params.jobKey,
      jobName: params.jobName,
      scheduleType: params.scheduleType,
      nextRunAt: params.nextRunAt,
      priority: params.priority,
      occurredAt: new Date(),
    },
  };
}
