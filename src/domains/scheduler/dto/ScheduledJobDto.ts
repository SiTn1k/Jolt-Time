/**
 * ScheduledJobDto
 *
 * Data transfer object for scheduled job responses.
 */

import type { ScheduleType } from '../types/ScheduleType';
import type { JobStatus } from '../types/JobStatus';
import type { SchedulerPriority } from '../types/SchedulerPriority';
import type { SchedulerJobMetadata } from '../types/SchedulerMetadata';

/**
 * Response DTO for a scheduled job.
 */
export interface ScheduledJobDto {
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
 * Response DTO for scheduled job list.
 */
export interface ScheduledJobListDto {
  jobs: ScheduledJobDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * DTO for creating a new scheduled job.
 */
export interface CreateScheduledJobDto {
  jobKey: string;
  jobName: string;
  scheduleType: ScheduleType;
  cronExpression?: string;
  priority?: SchedulerPriority;
  nextRunAt?: string;
  metadata?: SchedulerJobMetadata;
}

/**
 * DTO for updating a scheduled job.
 */
export interface UpdateScheduledJobDto {
  jobName?: string;
  scheduleType?: ScheduleType;
  cronExpression?: string;
  status?: JobStatus;
  priority?: SchedulerPriority;
  nextRunAt?: string;
  isEnabled?: boolean;
  metadata?: SchedulerJobMetadata;
}
