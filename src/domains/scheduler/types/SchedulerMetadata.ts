/**
 * SchedulerMetadata
 *
 * Metadata types for the scheduler domain.
 */

import type { ScheduleType } from './ScheduleType';
import type { SchedulerPriority } from './SchedulerPriority';

/**
 * Metadata associated with a scheduled job.
 */
export interface SchedulerJobMetadata {
  /** Job key for identification */
  jobKey: string;
  /** Schedule type */
  scheduleType: ScheduleType;
  /** Cron expression (if applicable) */
  cronExpression?: string;
  /** Interval in milliseconds (if applicable) */
  intervalMs?: number;
  /** Time of day for daily/weekly/monthly jobs (HH:mm format) */
  timeOfDay?: string;
  /** Day of week for weekly jobs (0-6, Sunday-Saturday) */
  dayOfWeek?: number;
  /** Day of month for monthly jobs (1-31) */
  dayOfMonth?: number;
  /** Job priority */
  priority: SchedulerPriority;
  /** Whether the job is enabled */
  isEnabled: boolean;
  /** Maximum retry attempts */
  maxRetries: number;
  /** Timeout in milliseconds */
  timeoutMs: number;
  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * Metadata associated with a job execution.
 */
export interface SchedulerExecutionMetadata {
  /** Execution context */
  context?: string;
  /** Trigger type (scheduled, manual, etc.) */
  triggerType?: string;
  /** Parent execution ID (for retries) */
  parentExecutionId?: string;
  /** Retry attempt number */
  retryAttempt?: number;
  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * Metadata associated with a job definition.
 */
export interface SchedulerDefinitionMetadata {
  /** Definition name */
  name: string;
  /** Description */
  description: string;
  /** Handler name */
  handler: string;
  /** Module path */
  modulePath?: string;
  /** Default timeout */
  defaultTimeoutMs: number;
  /** Required parameters */
  requiredParams?: string[];
  /** Optional parameters */
  optionalParams?: string[];
  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * Default metadata for a new scheduled job.
 */
export function createDefaultJobMetadata(jobKey: string): SchedulerJobMetadata {
  return {
    jobKey,
    scheduleType: 'manual',
    priority: 'normal',
    isEnabled: true,
    maxRetries: 3,
    timeoutMs: 60000,
  };
}

/**
 * Default metadata for a new job execution.
 */
export function createDefaultExecutionMetadata(): SchedulerExecutionMetadata {
  return {};
}

/**
 * Default metadata for a new job definition.
 */
export function createDefaultDefinitionMetadata(
  name: string,
  description: string,
  handler: string
): SchedulerDefinitionMetadata {
  return {
    name,
    description,
    handler,
    defaultTimeoutMs: 60000,
  };
}
