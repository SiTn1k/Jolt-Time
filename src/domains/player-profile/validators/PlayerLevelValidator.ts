/**
 * Player Level Validator
 *
 * Validates player level values according to game rules.
 */

import { PLAYER_LEVEL_CONSTRAINTS } from '../value-objects/PlayerLevel';

/**
 * Result of level validation.
 */
export interface PlayerLevelValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for player levels.
 */
export class PlayerLevelValidator {
  /**
   * Validates a level value.
   * @param level The level to validate
   * @returns Validation result with any error message
   */
  public static validate(level: number | null | undefined): PlayerLevelValidationResult {
    if (level === null || level === undefined) {
      return {
        isValid: false,
        error: 'Level is required',
      };
    }

    if (typeof level !== 'number' || !Number.isInteger(level)) {
      return {
        isValid: false,
        error: 'Level must be an integer',
      };
    }

    if (level < PLAYER_LEVEL_CONSTRAINTS.MIN_LEVEL) {
      return {
        isValid: false,
        error: `Level must be at least ${PLAYER_LEVEL_CONSTRAINTS.MIN_LEVEL}`,
      };
    }

    if (level > PLAYER_LEVEL_CONSTRAINTS.MAX_LEVEL) {
      return {
        isValid: false,
        error: `Level cannot exceed ${PLAYER_LEVEL_CONSTRAINTS.MAX_LEVEL}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a level and throws if invalid.
   * @param level The level to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(level: number | null | undefined): void {
    const result = this.validate(level);
    if (!result.isValid) {
      throw new Error(`Level validation failed: ${result.error}`);
    }
  }

  /**
   * Checks if a level is the maximum.
   * @param level The level to check
   * @returns true if at max level
   */
  public static isMaxLevel(level: number): boolean {
    return level >= PLAYER_LEVEL_CONSTRAINTS.MAX_LEVEL;
  }

  /**
   * Checks if a level is the starting level.
   * @param level The level to check
   * @returns true if at starting level
   */
  public static isStartingLevel(level: number): boolean {
    return level === PLAYER_LEVEL_CONSTRAINTS.MIN_LEVEL;
  }

  /**
   * Clamps a level to valid range.
   * @param level The level to clamp
   * @returns Level clamped to valid range
   */
  public static clamp(level: number): number {
    return Math.max(
      PLAYER_LEVEL_CONSTRAINTS.MIN_LEVEL,
      Math.min(level, PLAYER_LEVEL_CONSTRAINTS.MAX_LEVEL)
    );
  }
}