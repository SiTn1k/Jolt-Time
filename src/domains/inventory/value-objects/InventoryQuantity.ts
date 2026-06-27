/**
 * InventoryQuantity Value Object
 *
 * Immutable value object representing item quantity in inventory.
 * Encapsulates quantity constraints and validation logic.
 */

/**
 * Default item quantity.
 */
export const DEFAULT_ITEM_QUANTITY = 1;

/**
 * Maximum quantity for a single item stack.
 */
export const MAX_ITEM_QUANTITY = 99;

/**
 * Inventory quantity constraints.
 */
export const INVENTORY_QUANTITY_CONSTRAINTS = {
  DEFAULT_QUANTITY: DEFAULT_ITEM_QUANTITY,
  MAX_QUANTITY: MAX_ITEM_QUANTITY,
  MIN_QUANTITY: 0,
} as const;

/**
 * InventoryQuantity value object class.
 * Immutable - once created, cannot be modified.
 */
export class InventoryQuantity {
  private readonly _value: number;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The quantity value
   */
  private constructor(value: number) {
    this._value = value;
  }

  /**
   * Creates an InventoryQuantity from a number value.
   * Validates that the value is within acceptable bounds.
   * @param value The quantity number
   * @returns A new InventoryQuantity instance
   * @throws Error if validation fails
   */
  public static create(value: number): InventoryQuantity {
    const quantity = Math.floor(value);

    if (isNaN(quantity)) {
      throw new Error('InventoryQuantity must be a valid number');
    }

    if (quantity < INVENTORY_QUANTITY_CONSTRAINTS.MIN_QUANTITY) {
      throw new Error(
        `InventoryQuantity cannot be less than ${INVENTORY_QUANTITY_CONSTRAINTS.MIN_QUANTITY}`
      );
    }

    if (quantity > INVENTORY_QUANTITY_CONSTRAINTS.MAX_QUANTITY) {
      throw new Error(
        `InventoryQuantity cannot exceed ${INVENTORY_QUANTITY_CONSTRAINTS.MAX_QUANTITY}`
      );
    }

    return new InventoryQuantity(quantity);
  }

  /**
   * Creates an InventoryQuantity with the default quantity.
   * @returns A new InventoryQuantity instance
   */
  public static default(): InventoryQuantity {
    return new InventoryQuantity(INVENTORY_QUANTITY_CONSTRAINTS.DEFAULT_QUANTITY);
  }

  /**
   * Reconstructs an InventoryQuantity from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The quantity number
   * @returns A new InventoryQuantity instance
   */
  public static reconstruct(value: number): InventoryQuantity {
    return new InventoryQuantity(value);
  }

  /**
   * Creates an InventoryQuantity for zero items.
   * @returns A new InventoryQuantity instance with zero quantity
   */
  public static zero(): InventoryQuantity {
    return new InventoryQuantity(INVENTORY_QUANTITY_CONSTRAINTS.MIN_QUANTITY);
  }

  /**
   * Gets the underlying quantity value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks if the quantity is zero.
   * @returns true if quantity is zero
   */
  public isZero(): boolean {
    return this._value === INVENTORY_QUANTITY_CONSTRAINTS.MIN_QUANTITY;
  }

  /**
   * Checks if the quantity is at maximum stack size.
   * @returns true if at max quantity
   */
  public isMaxStack(): boolean {
    return this._value >= INVENTORY_QUANTITY_CONSTRAINTS.MAX_QUANTITY;
  }

  /**
   * Checks if can add more items without exceeding max stack.
   * @param amount The amount to check
   * @returns true if can add the specified amount
   */
  public canAdd(amount: number): boolean {
    return this._value + amount <= INVENTORY_QUANTITY_CONSTRAINTS.MAX_QUANTITY;
  }

  /**
   * Checks equality with another InventoryQuantity.
   * @param other The other InventoryQuantity to compare
   * @returns true if values are equal
   */
  public equals(other: InventoryQuantity): boolean {
    if (!(other instanceof InventoryQuantity)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the InventoryQuantity.
   */
  public toString(): string {
    return String(this._value);
  }
}