/**
 * Energy Validator
 *
 * Validates energy values according to game rules.
 */

import { ENERGY_CONSTRAINTS } from '../value-objects/Energy';

/**
 * Result of energy validation.
 */
export interface EnergyValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for energy values.
 */
export class EnergyValidator {
  /**
   * Validates an energy value.
   * @param value The energy value to validate
   * @param maximum The maximum energy value
   * @returns Validation result with any error message
   */
  public static validate(value: number, maximum: number): EnergyValidationResult {
    if (typeof value !== 'number' || isNaN(value)) {
      return {
        isValid: false,
        error: 'Energy value must be a valid number',
      };
    }

    if (typeof maximum !== 'number' || isNaN(maximum)) {
      return {
        isValid: false,
        error: 'Maximum energy must be a valid number',
      };
    }

    if (value < ENERGY_CONSTRAINTS.MIN_VALUE) {
      return {
        isValid: false,
        error: `Energy value cannot be less than ${ENERGY_CONSTRAINTS.MIN_VALUE}`,
      };
    }

    if (maximum < ENERGY_CONSTRAINTS.MIN_VALUE) {
      return {
        isValid: false,
        error: `Maximum energy cannot be less than ${ENERGY_CONSTRAINTS.MIN_VALUE}`,
      };
    }

    if (maximum > ENERGY_CONSTRAINTS.MAX_ENERGY_LIMIT) {
      return {
        isValid: false,
        error: `Maximum energy cannot exceed ${ENERGY_CONSTRAINTS.MAX_ENERGY_LIMIT}`,
      };
    }

    if (value > maximum) {
      return {
        isValid: false,
        error: 'Current energy cannot exceed maximum energy',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an energy value and throws if invalid.
   * @param value The energy value to validate
   * @param maximum The maximum energy value
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(value: number, maximum: number): void {
    const result = this.validate(value, maximum);
    if (!result.isValid) {
      throw new Error(`Energy validation failed: ${result.error}`);
    }
  }

  /**
   * Validates an energy change (consumption).
   * @param currentEnergy Current energy value
   * @param cost Cost to deduct
   * @returns Validation result with any error message
   */
  public static validateConsumption(currentEnergy: number, cost: number): EnergyValidationResult {
    if (typeof cost !== 'number' || isNaN(cost)) {
      return {
        isValid: false,
        error: 'Cost must be a valid number',
      };
    }

    if (cost < 0) {
      return {
        isValid: false,
        error: 'Cost cannot be negative',
      };
    }

    if (cost > currentEnergy) {
      return {
        isValid: false,
        error: 'Insufficient energy',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates maximum energy setting.
   * @param maximum The maximum energy value to validate
   * @returns Validation result with any error message
   */
  public static validateMaximum(maximum: number): EnergyValidationResult {
    if (typeof maximum !== 'number' || isNaN(maximum)) {
      return {
        isValid: false,
        error: 'Maximum energy must be a valid number',
      };
    }

    if (maximum < ENERGY_CONSTRAINTS.MIN_VALUE) {
      return {
        isValid: false,
        error: `Maximum energy cannot be less than ${ENERGY_CONSTRAINTS.MIN_VALUE}`,
      };
    }

    if (maximum > ENERGY_CONSTRAINTS.MAX_ENERGY_LIMIT) {
      return {
        isValid: false,
        error: `Maximum energy cannot exceed ${ENERGY_CONSTRAINTS.MAX_ENERGY_LIMIT}`,
      };
    }

    return { isValid: true };
  }
}