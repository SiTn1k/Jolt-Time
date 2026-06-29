/**
 * Execution Validator
 *
 * Validates job execution data according to scheduler rules.
 */

import { ExecutionId } from '../value-objects/ExecutionId';
import { JobId } from '../value-objects/JobId';
import type { ExecutionStatus } from '../types/ExecutionStatus';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of execution validation.
 */
export interface ExecutionValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for job execution data.
 */
export class ExecutionValidator {
  /**
   * Validates an execution ID format.
   */
  public static isValidExecutionId(executionId: string | null | undefined): boolean {
    if (!executionId || executionId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(executionId);
  }

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
   * Validates a duration value in milliseconds.
   */
  public static isValidDuration(duration: number | null | undefined): boolean {
    if (duration === null || duration === undefined) {
      return true; // Optional
    }
    return duration >= 0;
  }

  /**
   * Validates an error message.
   */
  public static isValidErrorMessage(errorMessage: string | null | undefined): boolean {
    if (errorMessage === null || errorMessage === undefined) {
      return true; // Optional
    }
    return errorMessage.length <= 5000;
  }

  /**
   * Validates an execution status value.
   */
  public static isValidStatus(status: ExecutionStatus | null | undefined): boolean {
    if (status === null || status === undefined) {
      return false;
    }
    const validStatuses: ExecutionStatus[] = ['pending', 'running', 'completed', 'failed', 'cancelled'];
    return validStatuses.includes(status);
  }

  /**
   * Validates complete execution data.
   */
  public static validateExecution(data: {
    executionId?: string;
    jobId?: string;
    status?: ExecutionStatus;
    duration?: number;
    errorMessage?: string;
    startedAt?: Date;
    finishedAt?: Date;
  }): ExecutionValidationResult {
    const errors: string[] = [];

    if (data.executionId !== undefined) {
      if (!data.executionId || data.executionId.trim().length === 0) {
        errors.push('Execution ID is required');
      } else if (!UUID_REGEX.test(data.executionId)) {
        errors.push('Execution ID must be a valid UUID');
      }
    }

    if (data.jobId !== undefined) {
      if (!data.jobId || data.jobId.trim().length === 0) {
        errors.push('Job ID is required');
      } else if (!UUID_REGEX.test(data.jobId)) {
        errors.push('Job ID must be a valid UUID');
      }
    }

    if (data.status !== undefined) {
      if (!this.isValidStatus(data.status)) {
        errors.push('Status must be one of: pending, running, completed, failed, cancelled');
      }
    }

    if (data.duration !== undefined && data.duration !== null) {
      if (data.duration < 0) {
        errors.push('Duration cannot be negative');
      }
    }

    if (data.errorMessage !== undefined && data.errorMessage !== null) {
      if (data.errorMessage.length > 5000) {
        errors.push('Error message cannot exceed 5000 characters');
      }
    }

    if (data.startedAt !== undefined && data.finishedAt !== undefined) {
      if (data.finishedAt && data.startedAt && data.finishedAt < data.startedAt) {
        errors.push('Finished at cannot be before started at');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates execution data and throws if invalid.
   */
  public static validateExecutionOrThrow(data: {
    executionId?: string;
    jobId?: string;
    status?: ExecutionStatus;
    duration?: number;
    errorMessage?: string;
    startedAt?: Date;
    finishedAt?: Date;
  }): void {
    const result = this.validateExecution(data);
    if (!result.isValid) {
      throw new Error(`Execution validation failed: ${result.errors.join('; ')}`);
    }
  }

  /**
   * Validates that an execution can transition to a new status.
   */
  public static canTransitionTo(currentStatus: ExecutionStatus, newStatus: ExecutionStatus): boolean {
    const validTransitions: Record<ExecutionStatus, ExecutionStatus[]> = {
      pending: ['running', 'cancelled'],
      running: ['completed', 'failed', 'cancelled'],
      completed: [],
      failed: [],
      cancelled: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
  }
}
