/**
 * InventoryCapacity Value Object
 *
 * Immutable value object representing inventory slot capacity.
 * Encapsulates capacity constraints and validation logic.
 */

/**
 * Default inventory capacity.
 */
export const DEFAULT_INVENTORY_CAPACITY = 100;

/**
 * Maximum inventory capacity.
 */
export const MAX_INVENTORY_CAPACITY = 1000;

/**
 * Inventory capacity constraints.
 */
export const INVENTORY_CAPACITY_CONSTRAINTS = {
  DEFAULT_CAPACITY: DEFAULT_INVENTORY_CAPACITY,
  MAX_CAPACITY: MAX_INVENTORY_CAPACITY,
  MIN_CAPACITY: 1,
} as const;

/**
 * InventoryCapacity value object class.
 * Immutable - once created, cannot be modified.
 */
export class InventoryCapacity {
  private readonly _value: number;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The capacity value
   */
  private constructor(value: number) {
    this._value = value;
  }

  /**
   * Creates an InventoryCapacity from a number value.
   * Validates that the value is within acceptable bounds.
   * @param value The capacity number
   * @returns A new InventoryCapacity instance
   * @throws Error if validation fails
   */
  public static create(value: number): InventoryCapacity {
    const capacity = Math.floor(value);

    if (isNaN(capacity)) {
      throw new Error('InventoryCapacity must be a valid number');
    }

    if (capacity < INVENTORY_CAPACITY_CONSTRAINTS.MIN_CAPACITY) {
      throw new Error(
        `InventoryCapacity must be at least ${INVENTORY_CAPACITY_CONSTRAINTS.MIN_CAPACITY}`
      );
    }

    if (capacity > INVENTORY_CAPACITY_CONSTRAINTS.MAX_CAPACITY) {
      throw new Error(
        `InventoryCapacity cannot exceed ${INVENTORY_CAPACITY_CONSTRAINTS.MAX_CAPACITY}`
      );
    }

    return new InventoryCapacity(capacity);
  }

  /**
   * Creates an InventoryCapacity with the default capacity.
   * @returns A new InventoryCapacity instance
   */
  public static default(): InventoryCapacity {
    return new InventoryCapacity(INVENTORY_CAPACITY_CONSTRAINTS.DEFAULT_CAPACITY);
  }

  /**
   * Reconstructs an InventoryCapacity from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The capacity number
   * @returns A new InventoryCapacity instance
   */
  public static reconstruct(value: number): InventoryCapacity {
    return new InventoryCapacity(value);
  }

  /**
   * Gets the underlying capacity value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks if the capacity is at its maximum.
   * @returns true if at max capacity
   */
  public isMaxCapacity(): boolean {
    return this._value >= INVENTORY_CAPACITY_CONSTRAINTS.MAX_CAPACITY;
  }

  /**
   * Checks if the capacity is at its default value.
   * @returns true if at default capacity
   */
  public isDefault(): boolean {
    return this._value === INVENTORY_CAPACITY_CONSTRAINTS.DEFAULT_CAPACITY;
  }

  /**
   * Checks equality with another InventoryCapacity.
   * @param other The other InventoryCapacity to compare
   * @returns true if values are equal
   */
  public equals(other: InventoryCapacity): boolean {
    if (!(other instanceof InventoryCapacity)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the InventoryCapacity.
   */
  public toString(): string {
    return String(this._value);
  }
}