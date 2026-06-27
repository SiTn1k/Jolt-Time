/**
 * Hall Validator
 *
 * Validates museum hall data according to game rules.
 */

import { isValidHallType } from '../types/HallType';
import { HallCapacity } from '../value-objects/HallCapacity';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const VALID_HALL_TYPES = ['ancient', 'classical', 'medieval', 'renaissance', 'industrial', 'modern', 'future', 'special'];
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 100;
const MIN_POSITION = 0;
const MAX_POSITION = 9999;

/**
 * Result of hall validation.
 */
export interface HallValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for museum hall data.
 */
export class HallValidator {
  /**
   * Validates hall name.
   * @param hallName The hall name to validate
   * @returns true if valid
   */
  public static isValidName(hallName: string | null | undefined): boolean {
    if (!hallName || hallName.trim().length === 0) {
      return false;
    }
    const trimmed = hallName.trim();
    return trimmed.length >= MIN_NAME_LENGTH && trimmed.length <= MAX_NAME_LENGTH;
  }

  /**
   * Validates hall type.
   * @param hallType The hall type to validate
   * @returns true if valid
   */
  public static isValidHallType(hallType: string | null | undefined): boolean {
    if (!hallType) return false;
    return isValidHallType(hallType);
  }

  /**
   * Validates position value.
   * @param position The position to validate
   * @returns true if valid
   */
  public static isValidPosition(position: number | null | undefined): boolean {
    if (position === null || position === undefined) return false;
    if (typeof position !== 'number' || isNaN(position)) return false;
    if (!Number.isInteger(position)) return false;
    return position >= MIN_POSITION && position <= MAX_POSITION;
  }

  /**
   * Validates capacity value.
   * @param capacity The capacity to validate
   * @returns true if valid
   */
  public static isValidCapacity(capacity: number | null | undefined): boolean {
    if (capacity === null || capacity === undefined) return true; // Optional
    if (typeof capacity !== 'number' || isNaN(capacity)) return false;
    if (!Number.isInteger(capacity)) return false;
    return capacity >= HallCapacity.MIN && capacity <= HallCapacity.MAX;
  }

  /**
   * Validates a complete hall.
   * @param data The hall data to validate
   * @returns Validation result with all errors
   */
  public static validate(data: {
    hallId?: string;
    museumId?: string;
    hallType?: string;
    hallName?: string;
    position?: number;
    capacity?: number;
  }): HallValidationResult {
    const errors: string[] = [];

    // Validate hallId
    if (data.hallId !== undefined && !UUID_REGEX.test(data.hallId)) {
      errors.push('Hall ID must be a valid UUID');
    }

    // Validate museumId
    if (data.museumId !== undefined && !UUID_REGEX.test(data.museumId)) {
      errors.push('Museum ID must be a valid UUID');
    }

    // Validate hallType
    if (!this.isValidHallType(data.hallType)) {
      errors.push(`Hall type must be one of: ${VALID_HALL_TYPES.join(', ')}`);
    }

    // Validate hallName
    if (!this.isValidName(data.hallName)) {
      errors.push(`Hall name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`);
    }

    // Validate position
    if (!this.isValidPosition(data.position)) {
      errors.push(`Position must be between ${MIN_POSITION} and ${MAX_POSITION}`);
    }

    // Validate capacity
    if (!this.isValidCapacity(data.capacity)) {
      errors.push(`Capacity must be between ${HallCapacity.MIN} and ${HallCapacity.MAX}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates hall data and throws if invalid.
   * @param data The hall data to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(data: {
    hallId?: string;
    museumId?: string;
    hallType?: string;
    hallName?: string;
    position?: number;
    capacity?: number;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Hall validation failed: ${result.errors.join('; ')}`);
    }
  }

  /**
   * Checks if a hall type string is valid.
   * @param hallType The hall type string to check
   * @returns true if valid
   */
  public static isHallTypeValid(hallType: string): boolean {
    return VALID_HALL_TYPES.includes(hallType.toLowerCase());
  }
}
