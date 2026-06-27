/**
 * Inventory Capacity Validator
 *
 * Validates inventory capacity values according to game rules.
 */

import { INVENTORY_CAPACITY_CONSTRAINTS } from '../value-objects/InventoryCapacity';

/**
 * Result of capacity validation.
 */
export interface InventoryCapacityValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for inventory capacity values.
 */
export class InventoryCapacityValidator {
  /**
   * Validates a capacity value.
   * @param capacity The capacity to validate
   * @returns Validation result with any error message
   */
  public static validate(capacity: number | null | undefined): InventoryCapacityValidationResult {
    if (capacity === null || capacity === undefined) {
      return {
        isValid: false,
        error: 'Capacity is required',
      };
    }

    const capacityNum = Number(capacity);

    if (isNaN(capacityNum)) {
      return {
        isValid: false,
        error: 'Capacity must be a valid number',
      };
    }

    if (capacityNum < INVENTORY_CAPACITY_CONSTRAINTS.MIN_CAPACITY) {
      return {
        isValid: false,
        error: `Capacity must be at least ${INVENTORY_CAPACITY_CONSTRAINTS.MIN_CAPACITY}`,
      };
    }

    if (capacityNum > INVENTORY_CAPACITY_CONSTRAINTS.MAX_CAPACITY) {
      return {
        isValid: false,
        error: `Capacity cannot exceed ${INVENTORY_CAPACITY_CONSTRAINTS.MAX_CAPACITY}`,
      };
    }

    if (!Number.isInteger(capacityNum)) {
      return {
        isValid: false,
        error: 'Capacity must be an integer',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a capacity value and throws if invalid.
   * @param capacity The capacity to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(capacity: number | null | undefined): void {
    const result = this.validate(capacity);
    if (!result.isValid) {
      throw new Error(`Inventory capacity validation failed: ${result.error}`);
    }
  }

  /**
   * Validates if a capacity expansion is allowed.
   * @param currentCapacity Current capacity
   * @param newCapacity New capacity to expand to
   * @returns Validation result
   */
  public static validateExpansion(
    currentCapacity: number,
    newCapacity: number
  ): InventoryCapacityValidationResult {
    if (newCapacity <= currentCapacity) {
      return {
        isValid: false,
        error: 'New capacity must be greater than current capacity',
      };
    }

    if (newCapacity > INVENTORY_CAPACITY_CONSTRAINTS.MAX_CAPACITY) {
      return {
        isValid: false,
        error: `Capacity cannot exceed ${INVENTORY_CAPACITY_CONSTRAINTS.MAX_CAPACITY}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Checks if a value is within valid capacity range.
   * @param capacity The capacity to check
   * @returns true if valid
   */
  public static isValidRange(capacity: number): boolean {
    return (
      capacity >= INVENTORY_CAPACITY_CONSTRAINTS.MIN_CAPACITY &&
      capacity <= INVENTORY_CAPACITY_CONSTRAINTS.MAX_CAPACITY
    );
  }
}