/**
 * Scheduler Validator
 *
 * Validates scheduled job data according to scheduler rules.
 */

import { JobId } from '../value-objects/JobId';
import type { ScheduleType } from '../types/ScheduleType';
import type { JobStatus } from '../types/JobStatus';
import type { SchedulerPriority } from '../types/SchedulerPriority';
import {
  requiresCronExpression,
  requiresInterval,
  isTimeBasedSchedule,
} from '../types/ScheduleType';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Cron expression basic validation regex.
 */
const CRON_REGEX = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;

/**
 * Result of scheduler validation.
 */
export interface SchedulerValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for scheduled job data.
 */
export class SchedulerValidator {
  /**
   * Validates a job ID format.
   */
  public static isValidJobId(jobId: string | null | undefined): boolean {
    if (!jobId || jobId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(jobId);
  }

  /**
   * Validates a job key format.
   */
  public static isValidJobKey(jobKey: string | null | undefined): boolean {
    if (!jobKey || jobKey.trim().length === 0) {
      return false;
    }
    // Job key should be alphanumeric with hyphens and underscores
    const JOB_KEY_REGEX = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
    return JOB_KEY_REGEX.test(jobKey) && jobKey.length <= 100;
  }

  /**
   * Validates a job name.
   */
  public static isValidJobName(jobName: string | null | undefined): boolean {
    if (!jobName || jobName.trim().length === 0) {
      return false;
    }
    return jobName.length >= 1 && jobName.length <= 200;
  }

  /**
   * Validates a cron expression.
   */
  public static isValidCronExpression(cron: string | null | undefined): boolean {
    if (!cron || cron.trim().length === 0) {
      return false;
    }
    return CRON_REGEX.test(cron);
  }

  /**
   * Validates an interval value in milliseconds.
   */
  public static isValidIntervalMs(intervalMs: number | null | undefined): boolean {
    if (intervalMs === null || intervalMs === undefined) {
      return false;
    }
    return intervalMs >= 1000 && intervalMs <= 604800000; // 1 second to 7 days
  }

  /**
   * Validates a time of day string (HH:mm format).
   */
  public static isValidTimeOfDay(timeOfDay: string | null | undefined): boolean {
    if (!timeOfDay || timeOfDay.trim().length === 0) {
      return false;
    }
    const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return TIME_REGEX.test(timeOfDay);
  }

  /**
   * Validates a priority value.
   */
  public static isValidPriority(priority: SchedulerPriority | null | undefined): boolean {
    if (priority === null || priority === undefined) {
      return false;
    }
    const validPriorities: SchedulerPriority[] = ['low', 'normal', 'high', 'critical'];
    return validPriorities.includes(priority);
  }

  /**
   * Validates a status value.
   */
  public static isValidStatus(status: JobStatus | null | undefined): boolean {
    if (status === null || status === undefined) {
      return false;
    }
    const validStatuses: JobStatus[] = ['pending', 'scheduled', 'running', 'completed', 'failed', 'cancelled'];
    return validStatuses.includes(status);
  }

  /**
   * Validates complete scheduled job data.
   */
  public static validateJob(data: {
    jobId?: string;
    jobKey?: string;
    jobName?: string;
    scheduleType?: ScheduleType;
    cronExpression?: string;
    intervalMs?: number;
    priority?: SchedulerPriority;
  }): SchedulerValidationResult {
    const errors: string[] = [];

    if (data.jobId !== undefined) {
      if (!data.jobId || data.jobId.trim().length === 0) {
        errors.push('Job ID is required');
      } else if (!UUID_REGEX.test(data.jobId)) {
        errors.push('Job ID must be a valid UUID');
      }
    }

    if (data.jobKey !== undefined) {
      if (!data.jobKey || data.jobKey.trim().length === 0) {
        errors.push('Job key is required');
      } else if (!this.isValidJobKey(data.jobKey)) {
        errors.push('Job key must be alphanumeric with hyphens/underscores, starting with a letter');
      }
    }

    if (data.jobName !== undefined) {
      if (!data.jobName || data.jobName.trim().length === 0) {
        errors.push('Job name is required');
      } else if (data.jobName.length < 1 || data.jobName.length > 200) {
        errors.push('Job name must be between 1 and 200 characters');
      }
    }

    if (data.scheduleType !== undefined) {
      if (!data.scheduleType) {
        errors.push('Schedule type is required');
      } else {
        // Validate schedule type specific requirements
        if (requiresCronExpression(data.scheduleType)) {
          if (!data.cronExpression) {
            errors.push('Cron expression is required for cron schedule type');
          } else if (!this.isValidCronExpression(data.cronExpression)) {
            errors.push('Cron expression is invalid');
          }
        }

        if (requiresInterval(data.scheduleType)) {
          if (!data.intervalMs) {
            errors.push('Interval is required for interval schedule type');
          } else if (!this.isValidIntervalMs(data.intervalMs)) {
            errors.push('Interval must be between 1000ms and 604800000ms (7 days)');
          }
        }
      }
    }

    if (data.cronExpression !== undefined && data.scheduleType === 'cron') {
      if (!data.cronExpression) {
        errors.push('Cron expression is required');
      } else if (!this.isValidCronExpression(data.cronExpression)) {
        errors.push('Cron expression is invalid');
      }
    }

    if (data.priority !== undefined) {
      if (!this.isValidPriority(data.priority)) {
        errors.push('Priority must be one of: low, normal, high, critical');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates job data and throws if invalid.
   */
  public static validateJobOrThrow(data: {
    jobId?: string;
    jobKey?: string;
    jobName?: string;
    scheduleType?: ScheduleType;
    cronExpression?: string;
    intervalMs?: number;
    priority?: SchedulerPriority;
  }): void {
    const result = this.validateJob(data);
    if (!result.isValid) {
      throw new Error(`Scheduler validation failed: ${result.errors.join('; ')}`);
    }
  }
}
