/**
 * ChecklistValidator
 *
 * Validates hardening checklist data.
 */

import { ChecklistStatus } from '../types/ChecklistStatus';
import { ChecklistId } from '../value-objects/ChecklistId';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of checklist validation.
 */
export interface ChecklistValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for hardening checklist data.
 */
export class ChecklistValidator {
  /**
   * Validates a checklist ID format.
   */
  public static isValidChecklistId(checklistId: string | null | undefined): boolean {
    if (!checklistId || checklistId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(checklistId);
  }

  /**
   * Validates a checklist title.
   */
  public static isValidTitle(title: string | null | undefined): boolean {
    if (!title || title.trim().length === 0) {
      return false;
    }
    return title.trim().length >= 3 && title.trim().length <= 200;
  }

  /**
   * Validates a checklist owner.
   */
  public static isValidOwner(owner: string | null | undefined): boolean {
    if (owner === null || owner === undefined) {
      return true; // Optional
    }
    return owner.length <= 100;
  }

  /**
   * Validates a checklist status.
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
    status?: ChecklistStatus;
    owner?: string;
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
      } else if (!this.isValidTitle(data.title)) {
        errors.push('Title must be between 3 and 200 characters');
      }
    }

    if (data.status !== undefined && !this.isValidStatus(data.status)) {
      errors.push('Status must be one of: pending, in_progress, completed, blocked, skipped');
    }

    if (data.owner !== undefined && !this.isValidOwner(data.owner)) {
      errors.push('Owner must not exceed 100 characters');
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
    status?: ChecklistStatus;
    owner?: string;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Checklist validation failed: ${result.errors.join('; ')}`);
    }
  }
}
