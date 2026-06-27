/**
 * Health Validator
 *
 * Validates health values according to game rules.
 */

import { HEALTH_CONSTRAINTS } from '../value-objects/Health';

/**
 * Result of health validation.
 */
export interface HealthValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for health values.
 */
export class HealthValidator {
  /**
   * Validates a health value.
   * @param value The health value to validate
   * @param maximum The maximum health value
   * @returns Validation result with any error message
   */
  public static validate(value: number, maximum: number): HealthValidationResult {
    if (typeof value !== 'number' || isNaN(value)) {
      return {
        isValid: false,
        error: 'Health value must be a valid number',
      };
    }

    if (typeof maximum !== 'number' || isNaN(maximum)) {
      return {
        isValid: false,
        error: 'Maximum health must be a valid number',
      };
    }

    if (value < HEALTH_CONSTRAINTS.MIN_VALUE) {
      return {
        isValid: false,
        error: `Health value cannot be less than ${HEALTH_CONSTRAINTS.MIN_VALUE}`,
      };
    }

    if (maximum < HEALTH_CONSTRAINTS.MIN_VALUE) {
      return {
        isValid: false,
        error: `Maximum health cannot be less than ${HEALTH_CONSTRAINTS.MIN_VALUE}`,
      };
    }

    if (maximum > HEALTH_CONSTRAINTS.MAX_HEALTH_LIMIT) {
      return {
        isValid: false,
        error: `Maximum health cannot exceed ${HEALTH_CONSTRAINTS.MAX_HEALTH_LIMIT}`,
      };
    }

    if (value > maximum) {
      return {
        isValid: false,
        error: 'Current health cannot exceed maximum health',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a health value and throws if invalid.
   * @param value The health value to validate
   * @param maximum The maximum health value
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(value: number, maximum: number): void {
    const result = this.validate(value, maximum);
    if (!result.isValid) {
      throw new Error(`Health validation failed: ${result.error}`);
    }
  }

  /**
   * Validates a damage amount.
   * @param currentHealth Current health value
   * @param damage Damage amount to apply
   * @returns Validation result with any error message
   */
  public static validateDamage(currentHealth: number, damage: number): HealthValidationResult {
    if (typeof damage !== 'number' || isNaN(damage)) {
      return {
        isValid: false,
        error: 'Damage must be a valid number',
      };
    }

    if (damage < 0) {
      return {
        isValid: false,
        error: 'Damage cannot be negative',
      };
    }

    if (damage > currentHealth) {
      return {
        isValid: false,
        error: 'Damage cannot exceed current health',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates maximum health setting.
   * @param maximum The maximum health value to validate
   * @returns Validation result with any error message
   */
  public static validateMaximum(maximum: number): HealthValidationResult {
    if (typeof maximum !== 'number' || isNaN(maximum)) {
      return {
        isValid: false,
        error: 'Maximum health must be a valid number',
      };
    }

    if (maximum < HEALTH_CONSTRAINTS.MIN_VALUE) {
      return {
        isValid: false,
        error: `Maximum health cannot be less than ${HEALTH_CONSTRAINTS.MIN_VALUE}`,
      };
    }

    if (maximum > HEALTH_CONSTRAINTS.MAX_HEALTH_LIMIT) {
      return {
        isValid: false,
        error: `Maximum health cannot exceed ${HEALTH_CONSTRAINTS.MAX_HEALTH_LIMIT}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates healing amount.
   * @param currentHealth Current health value
   * @param maximum Maximum health value
   * @param healing Healing amount to apply
   * @returns Validation result with any error message
   */
  public static validateHealing(
    currentHealth: number,
    maximum: number,
    healing: number
  ): HealthValidationResult {
    if (typeof healing !== 'number' || isNaN(healing)) {
      return {
        isValid: false,
        error: 'Healing must be a valid number',
      };
    }

    if (healing < 0) {
      return {
        isValid: false,
        error: 'Healing cannot be negative',
      };
    }

    if (currentHealth + healing > maximum) {
      return {
        isValid: false,
        error: 'Healing would exceed maximum health',
      };
    }

    return { isValid: true };
  }
}