/**
 * Artifact Validator
 *
 * Validates artifact data according to game rules.
 */

import type { CreateArtifactDto, UpdateArtifactDto } from '../dto';
import type { ArtifactCategory, ArtifactRarity, ArtifactEra, ArtifactRegion } from '../types';
import { isArtifactCategory } from '../types/ArtifactCategory';
import { isArtifactRarity } from '../types/ArtifactRarity';
import { isArtifactEra } from '../types/ArtifactEra';
import { isArtifactRegion } from '../types/ArtifactRegion';
import { ARTIFACT_SLUG_CONSTRAINTS } from '../value-objects/ArtifactSlug';
import { ARTIFACT_TITLE_CONSTRAINTS } from '../value-objects/ArtifactTitle';
import { ARTIFACT_DESCRIPTION_CONSTRAINTS } from '../value-objects/ArtifactDescription';

/**
 * Result of artifact validation.
 */
export interface ArtifactValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for artifact data.
 */
export class ArtifactValidator {
  /**
   * Validates a CreateArtifactDto.
   * @param dto The DTO to validate
   * @returns Validation result with any error messages
   */
  public static validateCreate(dto: CreateArtifactDto): ArtifactValidationResult {
    const errors: string[] = [];

    // Validate slug
    const slugValidation = ArtifactValidator.validateSlug(dto.slug);
    if (!slugValidation.isValid) {
      errors.push(...slugValidation.errors);
    }

    // Validate title
    const titleValidation = ArtifactValidator.validateTitle(dto.title);
    if (!titleValidation.isValid) {
      errors.push(...titleValidation.errors);
    }

    // Validate description
    const descValidation = ArtifactValidator.validateDescription(dto.description);
    if (!descValidation.isValid) {
      errors.push(...descValidation.errors);
    }

    // Validate category
    if (!isArtifactCategory(dto.category)) {
      errors.push(`Invalid category: ${dto.category}`);
    }

    // Validate rarity
    if (!isArtifactRarity(dto.rarity)) {
      errors.push(`Invalid rarity: ${dto.rarity}`);
    }

    // Validate era
    if (!isArtifactEra(dto.era)) {
      errors.push(`Invalid era: ${dto.era}`);
    }

    // Validate region
    if (!isArtifactRegion(dto.region)) {
      errors.push(`Invalid region: ${dto.region}`);
    }

    // Validate required strings
    if (!dto.culture || dto.culture.trim().length === 0) {
      errors.push('Culture is required');
    }
    if (!dto.material || dto.material.trim().length === 0) {
      errors.push('Material is required');
    }
    if (!dto.condition || dto.condition.trim().length === 0) {
      errors.push('Condition is required');
    }
    if (!dto.image || dto.image.trim().length === 0) {
      errors.push('Image is required');
    }
    if (!dto.thumbnail || dto.thumbnail.trim().length === 0) {
      errors.push('Thumbnail is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an UpdateArtifactDto.
   * @param dto The DTO to validate
   * @returns Validation result with any error messages
   */
  public static validateUpdate(dto: UpdateArtifactDto): ArtifactValidationResult {
    const errors: string[] = [];

    // Validate slug if provided
    if (dto.slug !== undefined) {
      const slugValidation = ArtifactValidator.validateSlug(dto.slug);
      if (!slugValidation.isValid) {
        errors.push(...slugValidation.errors);
      }
    }

    // Validate title if provided
    if (dto.title !== undefined) {
      const titleValidation = ArtifactValidator.validateTitle(dto.title);
      if (!titleValidation.isValid) {
        errors.push(...titleValidation.errors);
      }
    }

    // Validate description if provided
    if (dto.description !== undefined) {
      const descValidation = ArtifactValidator.validateDescription(dto.description);
      if (!descValidation.isValid) {
        errors.push(...descValidation.errors);
      }
    }

    // Validate category if provided
    if (dto.category !== undefined && !isArtifactCategory(dto.category)) {
      errors.push(`Invalid category: ${dto.category}`);
    }

    // Validate rarity if provided
    if (dto.rarity !== undefined && !isArtifactRarity(dto.rarity)) {
      errors.push(`Invalid rarity: ${dto.rarity}`);
    }

    // Validate era if provided
    if (dto.era !== undefined && !isArtifactEra(dto.era)) {
      errors.push(`Invalid era: ${dto.era}`);
    }

    // Validate region if provided
    if (dto.region !== undefined && !isArtifactRegion(dto.region)) {
      errors.push(`Invalid region: ${dto.region}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a slug value.
   */
  public static validateSlug(slug: string | null | undefined): ArtifactValidationResult {
    const errors: string[] = [];

    if (slug === null || slug === undefined) {
      errors.push('Slug is required');
      return { isValid: false, errors };
    }

    const trimmed = slug.trim().toLowerCase();

    if (trimmed.length < ARTIFACT_SLUG_CONSTRAINTS.MIN_LENGTH) {
      errors.push(`Slug must be at least ${ARTIFACT_SLUG_CONSTRAINTS.MIN_LENGTH} characters`);
    }

    if (trimmed.length > ARTIFACT_SLUG_CONSTRAINTS.MAX_LENGTH) {
      errors.push(`Slug must be at most ${ARTIFACT_SLUG_CONSTRAINTS.MAX_LENGTH} characters`);
    }

    if (!ARTIFACT_SLUG_CONSTRAINTS.ALLOWED_PATTERN.test(trimmed)) {
      errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a title value.
   */
  public static validateTitle(title: string | null | undefined): ArtifactValidationResult {
    const errors: string[] = [];

    if (title === null || title === undefined) {
      errors.push('Title is required');
      return { isValid: false, errors };
    }

    const trimmed = title.trim();

    if (trimmed.length < ARTIFACT_TITLE_CONSTRAINTS.MIN_LENGTH) {
      errors.push(`Title must be at least ${ARTIFACT_TITLE_CONSTRAINTS.MIN_LENGTH} characters`);
    }

    if (trimmed.length > ARTIFACT_TITLE_CONSTRAINTS.MAX_LENGTH) {
      errors.push(`Title must be at most ${ARTIFACT_TITLE_CONSTRAINTS.MAX_LENGTH} characters`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a description value.
   */
  public static validateDescription(description: string | null | undefined): ArtifactValidationResult {
    const errors: string[] = [];

    if (description === null || description === undefined) {
      errors.push('Description is required');
      return { isValid: false, errors };
    }

    const trimmed = description.trim();

    if (trimmed.length < ARTIFACT_DESCRIPTION_CONSTRAINTS.MIN_LENGTH) {
      errors.push(`Description must be at least ${ARTIFACT_DESCRIPTION_CONSTRAINTS.MIN_LENGTH} characters`);
    }

    if (trimmed.length > ARTIFACT_DESCRIPTION_CONSTRAINTS.MAX_LENGTH) {
      errors.push(`Description must be at most ${ARTIFACT_DESCRIPTION_CONSTRAINTS.MAX_LENGTH} characters`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateCreateOrThrow(dto: CreateArtifactDto): void {
    const result = this.validateCreate(dto);
    if (!result.isValid) {
      throw new Error(`Artifact validation failed: ${result.errors.join(', ')}`);
    }
  }

  /**
   * Validates update and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateUpdateOrThrow(dto: UpdateArtifactDto): void {
    const result = this.validateUpdate(dto);
    if (!result.isValid) {
      throw new Error(`Artifact validation failed: ${result.errors.join(', ')}`);
    }
  }
}