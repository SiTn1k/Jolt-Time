/**
 * Artifact Slug Validator
 *
 * Validates artifact slug values according to URL-safe slug rules.
 */

import { ARTIFACT_SLUG_CONSTRAINTS } from '../value-objects/ArtifactSlug';

/**
 * Result of slug validation.
 */
export interface ArtifactSlugValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for artifact slugs.
 */
export class ArtifactSlugValidator {
  /**
   * Validates a slug string.
   * @param slug The slug to validate
   * @returns Validation result with any error message
   */
  public static validate(slug: string | null | undefined): ArtifactSlugValidationResult {
    if (slug === null || slug === undefined) {
      return {
        isValid: false,
        error: 'Slug is required',
      };
    }

    const trimmed = slug.trim().toLowerCase();

    if (trimmed.length === 0) {
      return {
        isValid: false,
        error: 'Slug cannot be empty',
      };
    }

    if (trimmed.length < ARTIFACT_SLUG_CONSTRAINTS.MIN_LENGTH) {
      return {
        isValid: false,
        error: `Slug must be at least ${ARTIFACT_SLUG_CONSTRAINTS.MIN_LENGTH} characters`,
      };
    }

    if (trimmed.length > ARTIFACT_SLUG_CONSTRAINTS.MAX_LENGTH) {
      return {
        isValid: false,
        error: `Slug must be at most ${ARTIFACT_SLUG_CONSTRAINTS.MAX_LENGTH} characters`,
      };
    }

    if (!ARTIFACT_SLUG_CONSTRAINTS.ALLOWED_PATTERN.test(trimmed)) {
      return {
        isValid: false,
        error: 'Slug can only contain lowercase letters, numbers, and hyphens',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a slug and throws if invalid.
   * @param slug The slug to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(slug: string | null | undefined): void {
    const result = this.validate(slug);
    if (!result.isValid) {
      throw new Error(`ArtifactSlug validation failed: ${result.error}`);
    }
  }

  /**
   * Sanitizes a slug by trimming, lowercasing, and normalizing.
   * @param slug The slug to sanitize
   * @returns Sanitized slug or null if empty
   */
  public static sanitize(slug: string | null | undefined): string | null {
    if (slug === null || slug === undefined) {
      return null;
    }
    const trimmed = slug.trim().toLowerCase();
    if (trimmed.length === 0) {
      return null;
    }
    return trimmed;
  }
}