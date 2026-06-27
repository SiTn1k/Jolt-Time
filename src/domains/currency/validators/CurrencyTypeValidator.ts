/**
 * Currency Type Validator
 *
 * Validates currency type data according to game rules.
 */

import { CurrencyType, CurrencyTypeEnum } from '../value-objects/CurrencyType';

/**
 * Result of currency type validation.
 */
export interface CurrencyTypeValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for currency type data.
 */
export class CurrencyTypeValidator {
  /**
   * Validates that a value is a valid currency type.
   * @param currencyType The currency type to validate
   * @returns true if valid
   */
  public static isValid(currencyType: string | null | undefined): boolean {
    if (!currencyType) {
      return false;
    }
    return CurrencyType.isValid(currencyType);
  }

  /**
   * Validates that a value is a valid currency type enum.
   * @param currencyType The currency type to validate
   * @returns true if valid
   */
  public static isValidEnum(currencyType: string | null | undefined): currencyType is CurrencyTypeEnum {
    return this.isValid(currencyType);
  }

  /**
   * Gets all valid currency type values.
   * @returns Array of valid currency type values
   */
  public static getValidTypes(): CurrencyTypeEnum[] {
    return CurrencyType.values();
  }

  /**
   * Validates a complete currency type operation.
   * @param data The data to validate
   * @returns Validation result with all errors
   */
  public static validate(data: {
    currencyType?: string;
    targetCurrencyType?: string;
  }): CurrencyTypeValidationResult {
    const errors: string[] = [];

    // Validate currencyType
    if (data.currencyType !== undefined) {
      if (!data.currencyType || data.currencyType.trim().length === 0) {
        errors.push('Currency type is required');
      } else if (!CurrencyType.isValid(data.currencyType)) {
        errors.push(`Invalid currency type: ${data.currencyType}. Must be one of: ${CurrencyType.values().join(', ')}`);
      }
    }

    // Validate targetCurrencyType
    if (data.targetCurrencyType !== undefined) {
      if (!data.targetCurrencyType || data.targetCurrencyType.trim().length === 0) {
        errors.push('Target currency type is required');
      } else if (!CurrencyType.isValid(data.targetCurrencyType)) {
        errors.push(`Invalid target currency type: ${data.targetCurrencyType}. Must be one of: ${CurrencyType.values().join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates currency type data and throws if invalid.
   * @param data The data to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(data: {
    currencyType?: string;
    targetCurrencyType?: string;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Currency type validation failed: ${result.errors.join('; ')}`);
    }
  }

  /**
   * Checks if a currency type is premium (purchased with real money).
   * @param currencyType The currency type to check
   * @returns true if premium
   */
  public static isPremium(currencyType: string | null | undefined): boolean {
    if (!currencyType) return false;
    try {
      const type = CurrencyType.create(currencyType);
      return type.isPremium;
    } catch {
      return false;
    }
  }
}
