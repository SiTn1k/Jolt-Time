/**
 * Category Validator
 *
 * Validates error category data according to game rules.
 * Error Handling Foundation ONLY stores categories - it never modifies gameplay.
 */

import { ErrorCategoryType, ERROR_CATEGORY_TYPE_CONSTRAINTS } from '../types/ErrorCategoryType';

/**
 * Result of category validation.
 */
export interface CategoryValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for error categories.
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

    if (typeof name !== 'string') {
      return {
        isValid: false,
        error: 'Category name must be a string',
      };
    }

    if (name.trim().length === 0) {
      return {
        isValid: false,
        error: 'Category name cannot be empty',
      };
    }

    if (name.length > 128) {
      return {
        isValid: false,
        error: 'Category name must be at most 128 characters',
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

    if (typeof description !== 'string') {
      return {
        isValid: false,
        error: 'Category description must be a string',
      };
    }

    if (description.trim().length === 0) {
      return {
        isValid: false,
        error: 'Category description cannot be empty',
      };
    }

    if (description.length > 512) {
      return {
        isValid: false,
        error: 'Category description must be at most 512 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a category type.
   * @param categoryType The category type to validate
   * @returns Validation result with any error message
   */
  public static validateCategoryType(categoryType: string | null | undefined): CategoryValidationResult {
    if (categoryType === null || categoryType === undefined) {
      return {
        isValid: false,
        error: 'Category type is required',
      };
    }

    const validTypes = Object.values(ErrorCategoryType);
    if (!validTypes.includes(categoryType as ErrorCategoryType)) {
      return {
        isValid: false,
        error: `Invalid category type. Must be one of: ${validTypes.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates category metadata.
   * @param metadata The metadata to validate
   * @returns Validation result with any error message
   */
  public static validateMetadata(metadata: Record<string, unknown> | null | undefined): CategoryValidationResult {
    if (metadata === null || metadata === undefined) {
      return { isValid: true }; // Optional field
    }

    if (typeof metadata !== 'object') {
      return {
        isValid: false,
        error: 'Metadata must be an object',
      };
    }

    const metadataSize = JSON.stringify(metadata).length;
    if (metadataSize > 10000) {
      return {
        isValid: false,
        error: 'Metadata size exceeds maximum of 10000 bytes',
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
    categoryType?: string;
    metadata?: Record<string, unknown>;
  }): CategoryValidationResult {
    const nameResult = this.validateName(params.name);
    if (!nameResult.isValid) return nameResult;

    const descriptionResult = this.validateDescription(params.description);
    if (!descriptionResult.isValid) return descriptionResult;

    const typeResult = this.validateCategoryType(params.categoryType);
    if (!typeResult.isValid) return typeResult;

    const metadataResult = this.validateMetadata(params.metadata);
    if (!metadataResult.isValid) return metadataResult;

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
    categoryType?: string;
    metadata?: Record<string, unknown>;
  }): void {
    const result = this.validateCategory(params);
    if (!result.isValid) {
      throw new Error(`Error category validation failed: ${result.error}`);
    }
  }
}
