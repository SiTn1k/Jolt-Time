/**
 * Inventory Quantity Validator
 *
 * Validates inventory item quantity values according to game rules.
 */

import { INVENTORY_QUANTITY_CONSTRAINTS } from '../value-objects/InventoryQuantity';

/**
 * Result of quantity validation.
 */
export interface InventoryQuantityValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for inventory item quantity values.
 */
export class InventoryQuantityValidator {
  /**
   * Validates a quantity value.
   * @param quantity The quantity to validate
   * @returns Validation result with any error message
   */
  public static validate(quantity: number | null | undefined): InventoryQuantityValidationResult {
    if (quantity === null || quantity === undefined) {
      return {
        isValid: false,
        error: 'Quantity is required',
      };
    }

    const quantityNum = Number(quantity);

    if (isNaN(quantityNum)) {
      return {
        isValid: false,
        error: 'Quantity must be a valid number',
      };
    }

    if (quantityNum < INVENTORY_QUANTITY_CONSTRAINTS.MIN_QUANTITY) {
      return {
        isValid: false,
        error: `Quantity cannot be less than ${INVENTORY_QUANTITY_CONSTRAINTS.MIN_QUANTITY}`,
      };
    }

    if (quantityNum > INVENTORY_QUANTITY_CONSTRAINTS.MAX_QUANTITY) {
      return {
        isValid: false,
        error: `Quantity cannot exceed ${INVENTORY_QUANTITY_CONSTRAINTS.MAX_QUANTITY}`,
      };
    }

    if (!Number.isInteger(quantityNum)) {
      return {
        isValid: false,
        error: 'Quantity must be an integer',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a quantity value and throws if invalid.
   * @param quantity The quantity to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(quantity: number | null | undefined): void {
    const result = this.validate(quantity);
    if (!result.isValid) {
      throw new Error(`Inventory quantity validation failed: ${result.error}`);
    }
  }

  /**
   * Validates if adding to a quantity would exceed max stack.
   * @param currentQuantity Current quantity
   * @param amountToAdd Amount to add
   * @returns Validation result
   */
  public static validateStackAddition(
    currentQuantity: number,
    amountToAdd: number
  ): InventoryQuantityValidationResult {
    const newQuantity = currentQuantity + amountToAdd;

    if (newQuantity > INVENTORY_QUANTITY_CONSTRAINTS.MAX_QUANTITY) {
      return {
        isValid: false,
        error: `Stack would exceed maximum quantity of ${INVENTORY_QUANTITY_CONSTRAINTS.MAX_QUANTITY}`,
      };
    }

    if (newQuantity < INVENTORY_QUANTITY_CONSTRAINTS.MIN_QUANTITY) {
      return {
        isValid: false,
        error: 'Resulting quantity cannot be negative',
      };
    }

    return { isValid: true };
  }

  /**
   * Checks if a value is within valid quantity range.
   * @param quantity The quantity to check
   * @returns true if valid
   */
  public static isValidRange(quantity: number): boolean {
    return (
      quantity >= INVENTORY_QUANTITY_CONSTRAINTS.MIN_QUANTITY &&
      quantity <= INVENTORY_QUANTITY_CONSTRAINTS.MAX_QUANTITY
    );
  }

  /**
   * Checks if a quantity is at maximum stack.
   * @param quantity The quantity to check
   * @returns true if at max
   */
  public static isMaxStack(quantity: number): boolean {
    return quantity >= INVENTORY_QUANTITY_CONSTRAINTS.MAX_QUANTITY;
  }

  /**
   * Checks if a quantity is zero.
   * @param quantity The quantity to check
   * @returns true if zero
   */
  public static isZero(quantity: number): boolean {
    return quantity <= INVENTORY_QUANTITY_CONSTRAINTS.MIN_QUANTITY;
  }
}