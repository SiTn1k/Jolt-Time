/**
 * Currency Amount Validator
 *
 * Validates currency amount data according to game rules.
 */

import { CurrencyAmount } from '../value-objects/CurrencyAmount';

/**
 * Result of currency amount validation.
 */
export interface CurrencyAmountValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for currency amount data.
 */
export class CurrencyAmountValidator {
  /**
   * Validates that an amount is a valid currency amount.
   * @param amount The amount to validate
   * @returns true if valid
   */
  public static isValid(amount: number | null | undefined): boolean {
    if (amount === null || amount === undefined) {
      return false;
    }
    return CurrencyAmount.isValid(amount);
  }

  /**
   * Validates that an amount is positive.
   * @param amount The amount to validate
   * @returns true if positive
   */
  public static isPositive(amount: number | null | undefined): boolean {
    if (amount === null || amount === undefined) {
      return false;
    }
    return typeof amount === 'number' && amount > 0 && Number.isInteger(amount);
  }

  /**
   * Validates that an amount is non-negative.
   * @param amount The amount to validate
   * @returns true if non-negative
   */
  public static isNonNegative(amount: number | null | undefined): boolean {
    if (amount === null || amount === undefined) {
      return false;
    }
    return typeof amount === 'number' && amount >= 0 && Number.isInteger(amount);
  }

  /**
   * Validates a complete currency amount operation.
   * @param data The data to validate
   * @returns Validation result with all errors
   */
  public static validate(data: {
    amount?: number;
    currentBalance?: number;
    requiredAmount?: number;
  }): CurrencyAmountValidationResult {
    const errors: string[] = [];

    // Validate amount
    if (data.amount !== undefined) {
      if (typeof data.amount !== 'number' || isNaN(data.amount)) {
        errors.push('Amount must be a valid number');
      } else if (!Number.isInteger(data.amount)) {
        errors.push('Amount must be an integer');
      } else if (data.amount < 0) {
        errors.push('Amount cannot be negative');
      } else if (data.amount > CurrencyAmount.MAX_AMOUNT) {
        errors.push(`Amount exceeds maximum allowed value: ${CurrencyAmount.MAX_AMOUNT}`);
      }
    }

    // Validate currentBalance
    if (data.currentBalance !== undefined) {
      if (typeof data.currentBalance !== 'number' || isNaN(data.currentBalance)) {
        errors.push('Current balance must be a valid number');
      } else if (!Number.isInteger(data.currentBalance)) {
        errors.push('Current balance must be an integer');
      } else if (data.currentBalance < 0) {
        errors.push('Current balance cannot be negative');
      }
    }

    // Validate requiredAmount
    if (data.requiredAmount !== undefined) {
      if (typeof data.requiredAmount !== 'number' || isNaN(data.requiredAmount)) {
        errors.push('Required amount must be a valid number');
      } else if (!Number.isInteger(data.requiredAmount)) {
        errors.push('Required amount must be an integer');
      } else if (data.requiredAmount < 0) {
        errors.push('Required amount cannot be negative');
      }
    }

    // Check if sufficient funds
    if (
      data.currentBalance !== undefined &&
      data.requiredAmount !== undefined &&
      data.currentBalance < data.requiredAmount
    ) {
      errors.push(`Insufficient funds: current=${data.currentBalance}, required=${data.requiredAmount}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates currency amount data and throws if invalid.
   * @param data The data to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(data: {
    amount?: number;
    currentBalance?: number;
    requiredAmount?: number;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Currency amount validation failed: ${result.errors.join('; ')}`);
    }
  }
}
