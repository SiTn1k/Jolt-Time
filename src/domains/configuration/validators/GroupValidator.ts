/**
 * Group Validator
 *
 * Validates configuration group data.
 */

/**
 * Result of group validation.
 */
export interface GroupValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for configuration groups.
 */
export class GroupValidator {
  /**
   * Validates a group name.
   * @param name The name to validate
   * @returns Validation result with any error message
   */
  public static validateName(name: string | null | undefined): GroupValidationResult {
    if (name === null || name === undefined) {
      return {
        isValid: false,
        error: 'Group name is required',
      };
    }

    const trimmed = name.trim();

    if (trimmed.length === 0) {
      return {
        isValid: false,
        error: 'Group name cannot be empty',
      };
    }

    if (trimmed.length > 64) {
      return {
        isValid: false,
        error: 'Group name exceeds maximum length of 64',
      };
    }

    const namePattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!namePattern.test(trimmed)) {
      return {
        isValid: false,
        error: 'Group name must start with a letter and contain only letters, numbers, and underscores',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a group description.
   * @param description The description to validate
   * @returns Validation result with any error message
   */
  public static validateDescription(description: string | null | undefined): GroupValidationResult {
    if (description === null || description === undefined) {
      return { isValid: true };
    }

    if (description.length > 500) {
      return {
        isValid: false,
        error: 'Group description exceeds maximum length of 500',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a group.
   * @param name The group name
   * @param description The group description (optional)
   * @returns Validation result with any error message
   */
  public static validate(name: string | null | undefined, description?: string | null | undefined): GroupValidationResult {
    const nameResult = this.validateName(name);
    if (!nameResult.isValid) {
      return nameResult;
    }

    const descResult = this.validateDescription(description);
    if (!descResult.isValid) {
      return descResult;
    }

    return { isValid: true };
  }

  /**
   * Validates a group name and throws if invalid.
   * @param name The name to validate
   * @throws Error with validation details if invalid
   */
  public static validateNameOrThrow(name: string | null | undefined): void {
    const result = this.validateName(name);
    if (!result.isValid) {
      throw new Error(`Group name validation failed: ${result.error}`);
    }
  }

  /**
   * Validates a group description and throws if invalid.
   * @param description The description to validate
   * @throws Error with validation details if invalid
   */
  public static validateDescriptionOrThrow(description: string | null | undefined): void {
    const result = this.validateDescription(description);
    if (!result.isValid) {
      throw new Error(`Group description validation failed: ${result.error}`);
    }
  }

  /**
   * Sanitizes a group name by trimming.
   * @param name The name to sanitize
   * @returns Sanitized name or null if invalid
   */
  public static sanitizeName(name: string | null | undefined): string | null {
    if (name === null || name === undefined) {
      return null;
    }
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      return null;
    }
    return trimmed;
  }
}
