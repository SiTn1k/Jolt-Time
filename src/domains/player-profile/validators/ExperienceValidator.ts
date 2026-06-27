/**
 * Experience Validator
 *
 * Validates experience values according to game rules.
 */

import { PLAYER_EXPERIENCE_CONSTRAINTS } from '../value-objects/PlayerExperience';

/**
 * Result of experience validation.
 */
export interface ExperienceValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for experience values.
 */
export class ExperienceValidator {
  /**
   * Validates an experience value.
   * @param experience The experience to validate
   * @returns Validation result with any error message
   */
  public static validate(experience: number | null | undefined): ExperienceValidationResult {
    if (experience === null || experience === undefined) {
      return {
        isValid: false,
        error: 'Experience is required',
      };
    }

    if (typeof experience !== 'number' || !Number.isInteger(experience)) {
      return {
        isValid: false,
        error: 'Experience must be an integer',
      };
    }

    if (experience < PLAYER_EXPERIENCE_CONSTRAINTS.MIN_EXPERIENCE) {
      return {
        isValid: false,
        error: 'Experience cannot be negative',
      };
    }

    if (experience > PLAYER_EXPERIENCE_CONSTRAINTS.MAX_EXPERIENCE) {
      return {
        isValid: false,
        error: `Experience cannot exceed ${PLAYER_EXPERIENCE_CONSTRAINTS.MAX_EXPERIENCE}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an experience value and throws if invalid.
   * @param experience The experience to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(experience: number | null | undefined): void {
    const result = this.validate(experience);
    if (!result.isValid) {
      throw new Error(`Experience validation failed: ${result.error}`);
    }
  }

  /**
   * Checks if experience is at maximum.
   * @param experience The experience to check
   * @returns true if at max experience
   */
  public static isMaxExperience(experience: number): boolean {
    return experience >= PLAYER_EXPERIENCE_CONSTRAINTS.MAX_EXPERIENCE;
  }

  /**
   * Checks if experience value is at zero.
   * @param experience The experience to check
   * @returns true if at zero experience
   */
  public static isZero(experience: number): boolean {
    return experience === PLAYER_EXPERIENCE_CONSTRAINTS.MIN_EXPERIENCE;
  }

  /**
   * Clamps experience to valid range.
   * @param experience The experience to clamp
   * @returns Experience clamped to valid range
   */
  public static clamp(experience: number): number {
    return Math.max(
      PLAYER_EXPERIENCE_CONSTRAINTS.MIN_EXPERIENCE,
      Math.min(experience, PLAYER_EXPERIENCE_CONSTRAINTS.MAX_EXPERIENCE)
    );
  }

  /**
   * Calculates the level from experience.
   * @param experience The experience value
   * @returns The calculated level
   */
  public static calculateLevel(experience: number): number {
    return Math.floor(experience / PLAYER_EXPERIENCE_CONSTRAINTS.XP_PER_LEVEL) + 1;
  }

  /**
   * Calculates experience required for a specific level.
   * @param level The target level
   * @returns Experience required to reach that level
   */
  public static experienceForLevel(level: number): number {
    return (level - 1) * PLAYER_EXPERIENCE_CONSTRAINTS.XP_PER_LEVEL;
  }

  /**
   * Calculates experience remaining until next level.
   * @param experience The current experience
   * @returns Experience remaining for next level
   */
  public static experienceToNextLevel(experience: number): number {
    const currentLevel = this.calculateLevel(experience);
    const nextLevelExperience = this.experienceForLevel(currentLevel + 1);
    return nextLevelExperience - experience;
  }
}