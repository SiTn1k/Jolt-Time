/**
 * Checklist Validator
 *
 * Validates checklist data according to production readiness rules.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
    return UUID_REGEX.test(checklistId);
  }

  /**
   * Validates a title field.
   */
  public static isValidTitle(title: string | null | undefined): boolean {
    if (!title || title.trim().length === 0) {
      return false;
    }
    return title.length >= 3 && title.length <= 200;
  }

  /**
   * Validates an owner field.
   */
  public static isValidOwner(owner: string | null | undefined): boolean {
    if (!owner || owner.trim().length === 0) {
      return true; // Owner is optional
    }
    return owner.length <= 100;
  }

  /**
   * Validates a priority value.
   */
  public static isValidPriority(priority: number | null | undefined): boolean {
    if (priority === null || priority === undefined) {
      return true; // Priority is optional
    }
    return Number.isInteger(priority) && priority >= 1 && priority <= 5;
  }

  /**
   * Validates a complete checklist.
   */
  public static validate(data: {
    checklistId?: string;
    title?: string;
    owner?: string;
    priority?: number;
  }): ChecklistValidationResult {
    const errors: string[] = [];

    if (data.checklistId !== undefined) {
      if (!data.checklistId || data.checklistId.trim().length === 0) {
        errors.push('Checklist ID is required');
      } else if (!UUID_REGEX.test(data.checklistId)) {
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

    if (data.owner !== undefined && !this.isValidOwner(data.owner)) {
      errors.push('Owner must not exceed 100 characters');
    }

    if (data.priority !== undefined && !this.isValidPriority(data.priority)) {
      errors.push('Priority must be an integer between 1 and 5');
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
    priority?: number;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Checklist validation failed: ${result.errors.join('; ')}`);
    }
  }
}
