/**
 * Category Validator
 *
 * Validates audit category data according to game rules.
 */

import { AUDIT_METADATA_CONSTRAINTS } from '../types/AuditMetadata';

/**
 * Result of category validation.
 */
export interface CategoryValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Constraints for category validation.
 */
const CATEGORY_CONSTRAINTS = {
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 64,
  MIN_DESCRIPTION_LENGTH: 1,
  MAX_DESCRIPTION_LENGTH: 256,
} as const;

/**
 * Validator for audit categories.
 */
export class CategoryValidator {
  /**
   * Validates a category name.
   * @param name The name to validate
   * @returns Validation result with any error message
   */
  public static validateName(name: string | null | undefined): CategoryValidationResult {
    if (name === null || name === undefined) {
      return {
        isValid: false,
        error: 'Category name is required',
      };
    }

    if (name.trim().length === 0) {
      return {
        isValid: false,
        error: 'Category name cannot be empty',
      };
    }

    if (name.trim().length < CATEGORY_CONSTRAINTS.MIN_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Category name must be at least ${CATEGORY_CONSTRAINTS.MIN_NAME_LENGTH} character(s)`,
      };
    }

    if (name.length > CATEGORY_CONSTRAINTS.MAX_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Category name must be at most ${CATEGORY_CONSTRAINTS.MAX_NAME_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a category description.
   * @param description The description to validate
   * @returns Validation result with any error message
   */
  public static validateDescription(description: string | null | undefined): CategoryValidationResult {
    if (description === null || description === undefined) {
      return {
        isValid: false,
        error: 'Category description is required',
      };
    }

    if (description.trim().length === 0) {
      return {
        isValid: false,
        error: 'Category description cannot be empty',
      };
    }

    if (description.length > CATEGORY_CONSTRAINTS.MAX_DESCRIPTION_LENGTH) {
      return {
        isValid: false,
        error: `Category description must be at most ${CATEGORY_CONSTRAINTS.MAX_DESCRIPTION_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all category fields together.
   * @param params Category fields to validate
   * @returns Validation result with any error message
   */
  public static validateCategory(params: {
    name?: string;
    description?: string;
  }): CategoryValidationResult {
    const nameResult = this.validateName(params.name);
    if (!nameResult.isValid) return nameResult;

    const descriptionResult = this.validateDescription(params.description);
    if (!descriptionResult.isValid) return descriptionResult;

    return { isValid: true };
  }

  /**
   * Validates a category and throws if invalid.
   * @param params Category fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateCategoryOrThrow(params: {
    name?: string;
    description?: string;
  }): void {
    const result = this.validateCategory(params);
    if (!result.isValid) {
      throw new Error(`Category validation failed: ${result.error}`);
    }
  }
}
