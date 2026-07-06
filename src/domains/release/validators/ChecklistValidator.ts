/**
 * Checklist Validator
 *
 * Validates checklist data according to release rules.
 */

import { ChecklistStatus } from '../types/ChecklistStatus';
import { ChecklistId } from '../value-objects/ChecklistId';

/**
 * Result of checklist validation.
 */
export interface ChecklistValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for checklist data.
 */
export class ChecklistValidator {
  /**
   * Validates a checklist ID format.
   */
  public static isValidChecklistId(checklistId: string | null | undefined): boolean {
    if (!checklistId || checklistId.trim().length === 0) {
      return false;
    }
    return ChecklistId.isValid(checklistId);
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
   * Validates an owner.
   */
  public static isValidOwner(owner: string | null | undefined): boolean {
    if (!owner || owner.trim().length === 0) {
      return true; // Optional
    }
    return owner.length <= 100;
  }

  /**
   * Validates a status.
   */
  public static isValidStatus(status: ChecklistStatus | null | undefined): boolean {
    if (status === null || status === undefined) {
      return true; // Optional
    }
    const validStatuses: ChecklistStatus[] = [
      ChecklistStatus.PENDING,
      ChecklistStatus.IN_PROGRESS,
      ChecklistStatus.COMPLETED,
      ChecklistStatus.BLOCKED,
      ChecklistStatus.SKIPPED,
    ];
    return validStatuses.includes(status);
  }

  /**
   * Validates a complete checklist.
   */
  public static validate(data: {
    checklistId?: string;
    title?: string;
    owner?: string;
    status?: ChecklistStatus;
  }): ChecklistValidationResult {
    const errors: string[] = [];

    if (data.checklistId !== undefined) {
      if (!data.checklistId || data.checklistId.trim().length === 0) {
        errors.push('Checklist ID is required');
      } else if (!ChecklistId.isValid(data.checklistId)) {
        errors.push('Checklist ID must be a valid UUID');
      }
    }

    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length === 0) {
        errors.push('Title is required');
      } else if (data.title.length < 1 || data.title.length > 200) {
        errors.push('Title must be between 1 and 200 characters');
      }
    }

    if (data.owner !== undefined) {
      if (data.owner && data.owner.length > 100) {
        errors.push('Owner must be at most 100 characters');
      }
    }

    if (data.status !== undefined) {
      if (!this.isValidStatus(data.status)) {
        errors.push('Status must be one of: pending, in_progress, completed, blocked, skipped');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates checklist data and throws if invalid.
   */
  public static validateOrThrow(data: {
    checklistId?: string;
    title?: string;
    owner?: string;
    status?: ChecklistStatus;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Checklist validation failed: ${result.errors.join('; ')}`);
    }
  }
}
