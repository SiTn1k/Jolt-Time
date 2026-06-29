/**
 * JobCreated Event
 *
 * Domain event emitted when a new scheduled job is created.
 */

import type { ScheduleType } from '../types/ScheduleType';
import type { SchedulerPriority } from '../types/SchedulerPriority';

/**
 * Event data for job creation.
 */
export interface JobCreatedEventData {
  /** Job ID */
  jobId: string;
  /** Job key */
  jobKey: string;
  /** Job name */
  jobName: string;
  /** Schedule type */
  scheduleType: ScheduleType;
  /** Cron expression (if applicable) */
  cronExpression?: string;
  /** Priority */
  priority: SchedulerPriority;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for job creation.
 */
export interface JobCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'JobCreated';
  /** Event data */
  readonly data: JobCreatedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a JobCreatedEvent.
 */
export function createJobCreatedEvent(params: {
  jobId: string;
  jobKey: string;
  jobName: string;
  scheduleType: ScheduleType;
  cronExpression?: string;
  priority: SchedulerPriority;
}): JobCreatedEvent {
  return {
    eventType: 'JobCreated',
    version: 1,
    data: {
      jobId: params.jobId,
      jobKey: params.jobKey,
      jobName: params.jobName,
      scheduleType: params.scheduleType,
      cronExpression: params.cronExpression,
      priority: params.priority,
      occurredAt: new Date(),
    },
  };
}
