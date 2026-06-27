/**
 * Exhibit Validator
 *
 * Validates museum exhibit data according to game rules.
 *
 * IMPORTANT: Exhibits reference InventoryItemId, not ArtifactId directly.
 * This validator ensures proper references are maintained.
 */

import { isValidExhibitCondition } from '../types/ExhibitCondition';
import { DisplayOrder } from '../value-objects/DisplayOrder';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const VALID_EXHIBIT_CONDITIONS = ['excellent', 'good', 'fair', 'poor', 'restoration_needed'];
const MIN_POPULARITY = 0;
const MAX_POPULARITY = 100;
const MIN_ARTIFACT_ID_LENGTH = 1;
const MAX_ARTIFACT_ID_LENGTH = 50;

/**
 * Result of exhibit validation.
 */
export interface ExhibitValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for museum exhibit data.
 */
export class ExhibitValidator {
  /**
   * Validates artifact ID format.
   * @param artifactId The artifact ID to validate
   * @returns true if valid
   */
  public static isValidArtifactId(artifactId: string | null | undefined): boolean {
    if (!artifactId || artifactId.trim().length === 0) {
      return false;
    }
    const trimmed = artifactId.trim();
    return trimmed.length >= MIN_ARTIFACT_ID_LENGTH && trimmed.length <= MAX_ARTIFACT_ID_LENGTH;
  }

  /**
   * Validates exhibit condition.
   * @param condition The condition to validate
   * @returns true if valid
   */
  public static isValidCondition(condition: string | null | undefined): boolean {
    if (!condition) return false;
    return isValidExhibitCondition(condition);
  }

  /**
   * Validates popularity value.
   * @param popularity The popularity to validate
   * @returns true if valid
   */
  public static isValidPopularity(popularity: number | null | undefined): boolean {
    if (popularity === null || popularity === undefined) return true; // Optional
    if (typeof popularity !== 'number' || isNaN(popularity)) return false;
    return popularity >= MIN_POPULARITY && popularity <= MAX_POPULARITY;
  }

  /**
   * Validates display order value.
   * @param displayOrder The display order to validate
   * @returns true if valid
   */
  public static isValidDisplayOrder(displayOrder: number | null | undefined): boolean {
    if (displayOrder === null || displayOrder === undefined) return false;
    if (typeof displayOrder !== 'number' || isNaN(displayOrder)) return false;
    if (!Number.isInteger(displayOrder)) return false;
    return displayOrder >= DisplayOrder.MIN && displayOrder <= DisplayOrder.MAX;
  }

  /**
   * Validates a complete exhibit.
   * @param data The exhibit data to validate
   * @returns Validation result with all errors
   */
  public static validate(data: {
    exhibitId?: string;
    hallId?: string;
    inventoryItemId?: string;
    artifactId?: string;
    displayOrder?: number;
    condition?: string;
    popularity?: number;
  }): ExhibitValidationResult {
    const errors: string[] = [];

    // Validate exhibitId
    if (data.exhibitId !== undefined && !UUID_REGEX.test(data.exhibitId)) {
      errors.push('Exhibit ID must be a valid UUID');
    }

    // Validate hallId
    if (data.hallId !== undefined && !UUID_REGEX.test(data.hallId)) {
      errors.push('Hall ID must be a valid UUID');
    }

    // Validate inventoryItemId
    if (data.inventoryItemId !== undefined && !UUID_REGEX.test(data.inventoryItemId)) {
      errors.push('Inventory Item ID must be a valid UUID');
    }

    // Validate artifactId
    if (!this.isValidArtifactId(data.artifactId)) {
      errors.push(`Artifact ID must be between ${MIN_ARTIFACT_ID_LENGTH} and ${MAX_ARTIFACT_ID_LENGTH} characters`);
    }

    // Validate displayOrder
    if (!this.isValidDisplayOrder(data.displayOrder)) {
      errors.push(`Display order must be between ${DisplayOrder.MIN} and ${DisplayOrder.MAX}`);
    }

    // Validate condition
    if (data.condition !== undefined && !this.isValidCondition(data.condition)) {
      errors.push(`Condition must be one of: ${VALID_EXHIBIT_CONDITIONS.join(', ')}`);
    }

    // Validate popularity
    if (!this.isValidPopularity(data.popularity)) {
      errors.push(`Popularity must be between ${MIN_POPULARITY} and ${MAX_POPULARITY}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates exhibit data and throws if invalid.
   * @param data The exhibit data to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(data: {
    exhibitId?: string;
    hallId?: string;
    inventoryItemId?: string;
    artifactId?: string;
    displayOrder?: number;
    condition?: string;
    popularity?: number;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Exhibit validation failed: ${result.errors.join('; ')}`);
    }
  }

  /**
   * Checks if a condition string is valid.
   * @param condition The condition string to check
   * @returns true if valid
   */
  public static isConditionValid(condition: string): boolean {
    return VALID_EXHIBIT_CONDITIONS.includes(condition.toLowerCase());
  }
}
