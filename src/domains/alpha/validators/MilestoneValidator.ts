/**
 * Milestone Validator
 *
 * Validates milestone data according to alpha rules.
 */

import { MilestoneStatus } from '../types/MilestoneStatus';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of milestone validation.
 */
export interface MilestoneValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for milestone data.
 */
export class MilestoneValidator {
  /**
   * Validates a milestone ID format.
   */
  public static isValidMilestoneId(milestoneId: string | null | undefined): boolean {
    if (!milestoneId || milestoneId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(milestoneId);
  }

  /**
   * Validates a title.
   */
  public static isValidTitle(title: string | null | undefined): boolean {
    if (!title || title.trim().length === 0) {
      return false;
    }
    return title.length >= 1 && title.length <= 200;
  }

  /**
   * Validates a target date.
   */
  public static isValidTargetDate(targetDate: Date | string | null | undefined): boolean {
    if (!targetDate) {
      return true; // Optional
    }
    const date = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    return !isNaN(date.getTime());
  }

  /**
   * Validates a status.
   */
  public static isValidStatus(status: MilestoneStatus | null | undefined): boolean {
    if (status === null || status === undefined) {
      return true; // Optional
    }
    const validStatuses: MilestoneStatus[] = [
      MilestoneStatus.PLANNED,
      MilestoneStatus.IN_PROGRESS,
      MilestoneStatus.COMPLETED,
      MilestoneStatus.DELAYED,
      MilestoneStatus.CANCELLED,
    ];
    return validStatuses.includes(status);
  }

  /**
   * Validates a complete milestone.
   */
  public static validate(data: {
    milestoneId?: string;
    title?: string;
    targetDate?: Date | string | null;
    status?: MilestoneStatus;
  }): MilestoneValidationResult {
    const errors: string[] = [];

    if (data.milestoneId !== undefined) {
      if (!data.milestoneId || data.milestoneId.trim().length === 0) {
        errors.push('Milestone ID is required');
      } else if (!UUID_REGEX.test(data.milestoneId)) {
        errors.push('Milestone ID must be a valid UUID');
      }
    }

    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length === 0) {
        errors.push('Title is required');
      } else if (data.title.length < 1 || data.title.length > 200) {
        errors.push('Title must be between 1 and 200 characters');
      }
    }

    if (data.targetDate !== undefined) {
      if (!this.isValidTargetDate(data.targetDate)) {
        errors.push('Target date must be a valid date');
      }
    }

    if (data.status !== undefined) {
      if (!this.isValidStatus(data.status)) {
        errors.push('Status must be one of: planned, in_progress, completed, delayed, cancelled');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates milestone data and throws if invalid.
   */
  public static validateOrThrow(data: {
    milestoneId?: string;
    title?: string;
    targetDate?: Date | string | null;
    status?: MilestoneStatus;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Milestone validation failed: ${result.errors.join('; ')}`);
    }
  }
}
