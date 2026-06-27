/**
 * Museum Validator
 *
 * Validates museum data according to game rules.
 */

import { isValidMuseumType } from '../types/MuseumType';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const VALID_MUSEUM_TYPES = ['classic', 'modern', 'themed'];
const MIN_LEVEL = 1;
const MAX_LEVEL = 100;
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 100;

/**
 * Result of museum validation.
 */
export interface MuseumValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for museum data.
 */
export class MuseumValidator {
  /**
   * Validates museum name.
   * @param name The museum name to validate
   * @returns true if valid
   */
  public static isValidName(name: string | null | undefined): boolean {
    if (!name || name.trim().length === 0) {
      return false;
    }
    const trimmed = name.trim();
    return trimmed.length >= MIN_NAME_LENGTH && trimmed.length <= MAX_NAME_LENGTH;
  }

  /**
   * Validates museum type.
   * @param museumType The museum type to validate
   * @returns true if valid
   */
  public static isValidMuseumType(museumType: string | null | undefined): boolean {
    if (!museumType) return false;
    return isValidMuseumType(museumType);
  }

  /**
   * Validates level value.
   * @param level The level to validate
   * @returns true if valid
   */
  public static isValidLevel(level: number | null | undefined): boolean {
    if (level === null || level === undefined) return true; // Optional
    if (typeof level !== 'number' || isNaN(level)) return false;
    return level >= MIN_LEVEL && level <= MAX_LEVEL;
  }

  /**
   * Validates rating value.
   * @param rating The rating to validate
   * @returns true if valid
   */
  public static isValidRating(rating: number | null | undefined): boolean {
    if (rating === null || rating === undefined) return true; // Optional
    if (typeof rating !== 'number' || isNaN(rating)) return false;
    return rating >= 0 && rating <= 5;
  }

  /**
   * Validates a complete museum.
   * @param data The museum data to validate
   * @returns Validation result with all errors
   */
  public static validate(data: {
    museumId?: string;
    playerProfileId?: string;
    museumName?: string;
    museumType?: string;
    level?: number;
    rating?: number;
  }): MuseumValidationResult {
    const errors: string[] = [];

    // Validate museumId
    if (data.museumId !== undefined && !UUID_REGEX.test(data.museumId)) {
      errors.push('Museum ID must be a valid UUID');
    }

    // Validate playerProfileId
    if (data.playerProfileId !== undefined && !UUID_REGEX.test(data.playerProfileId)) {
      errors.push('Player Profile ID must be a valid UUID');
    }

    // Validate museumName
    if (!this.isValidName(data.museumName)) {
      errors.push(`Museum name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`);
    }

    // Validate museumType
    if (data.museumType !== undefined && !this.isValidMuseumType(data.museumType)) {
      errors.push(`Museum type must be one of: ${VALID_MUSEUM_TYPES.join(', ')}`);
    }

    // Validate level
    if (!this.isValidLevel(data.level)) {
      errors.push(`Level must be between ${MIN_LEVEL} and ${MAX_LEVEL}`);
    }

    // Validate rating
    if (!this.isValidRating(data.rating)) {
      errors.push('Rating must be between 0 and 5');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates museum data and throws if invalid.
   * @param data The museum data to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(data: {
    museumId?: string;
    playerProfileId?: string;
    museumName?: string;
    museumType?: string;
    level?: number;
    rating?: number;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Museum validation failed: ${result.errors.join('; ')}`);
    }
  }

  /**
   * Checks if a museum type string is valid.
   * @param museumType The museum type string to check
   * @returns true if valid
   */
  public static isMuseumTypeValid(museumType: string): boolean {
    return VALID_MUSEUM_TYPES.includes(museumType.toLowerCase());
  }
}
