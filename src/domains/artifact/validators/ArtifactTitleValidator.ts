/**
 * Artifact Title Validator
 *
 * Validates artifact title values according to game rules.
 */

import { ARTIFACT_TITLE_CONSTRAINTS } from '../value-objects/ArtifactTitle';

/**
 * Result of title validation.
 */
export interface ArtifactTitleValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for artifact titles.
 */
export class ArtifactTitleValidator {
  /**
   * Validates a title string.
   * @param title The title to validate
   * @returns Validation result with any error message
   */
  public static validate(title: string | null | undefined): ArtifactTitleValidationResult {
    if (title === null || title === undefined) {
      return {
        isValid: false,
        error: 'Title is required',
      };
    }

    const trimmed = title.trim();

    if (trimmed.length === 0) {
      return {
        isValid: false,
        error: 'Title cannot be empty',
      };
    }

    if (trimmed.length < ARTIFACT_TITLE_CONSTRAINTS.MIN_LENGTH) {
      return {
        isValid: false,
        error: `Title must be at least ${ARTIFACT_TITLE_CONSTRAINTS.MIN_LENGTH} characters`,
      };
    }

    if (trimmed.length > ARTIFACT_TITLE_CONSTRAINTS.MAX_LENGTH) {
      return {
        isValid: false,
        error: `Title must be at most ${ARTIFACT_TITLE_CONSTRAINTS.MAX_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a title and throws if invalid.
   * @param title The title to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(title: string | null | undefined): void {
    const result = this.validate(title);
    if (!result.isValid) {
      throw new Error(`ArtifactTitle validation failed: ${result.error}`);
    }
  }

  /**
   * Sanitizes a title by trimming and normalizing whitespace.
   * @param title The title to sanitize
   * @returns Sanitized title or null if empty
   */
  public static sanitize(title: string | null | undefined): string | null {
    if (title === null || title === undefined) {
      return null;
    }
    const trimmed = title.trim();
    if (trimmed.length === 0) {
      return null;
    }
    // Normalize multiple spaces to single space
    return trimmed.replace(/\s+/g, ' ');
  }
}