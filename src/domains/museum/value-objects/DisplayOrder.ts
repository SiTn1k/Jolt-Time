/**
 * DisplayOrder Value Object
 *
 * Immutable value object representing the display order of an exhibit.
 * Encapsulates validation and comparison logic for ordering.
 */

const MIN_ORDER = 0;
const MAX_ORDER = 9999;
const DEFAULT_ORDER = 0;

/**
 * DisplayOrder value object class.
 * Immutable - once created, cannot be modified.
 */
export class DisplayOrder {
  private readonly _value: number;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The order value
   */
  private constructor(value: number) {
    this._value = value;
  }

  /**
   * Creates a DisplayOrder from a number value.
   * Validates that the value is within acceptable range.
   * @param value The order number
   * @returns A new DisplayOrder instance
   * @throws Error if validation fails
   */
  public static create(value: number): DisplayOrder {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('DisplayOrder must be a valid number');
    }
    if (!Number.isInteger(value)) {
      throw new Error('DisplayOrder must be an integer');
    }
    if (value < MIN_ORDER) {
      throw new Error(`DisplayOrder must be at least ${MIN_ORDER}`);
    }
    if (value > MAX_ORDER) {
      throw new Error(`DisplayOrder cannot exceed ${MAX_ORDER}`);
    }
    return new DisplayOrder(value);
  }

  /**
   * Reconstructs a DisplayOrder from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The order number
   * @returns A new DisplayOrder instance
   */
  public static reconstruct(value: number): DisplayOrder {
    return new DisplayOrder(value);
  }

  /**
   * Gets the default display order.
   * @returns Default DisplayOrder instance
   */
  public static default(): DisplayOrder {
    return new DisplayOrder(DEFAULT_ORDER);
  }

  /**
   * Creates the next display order after the given value.
   * @param currentMax Maximum current order
   * @returns Next DisplayOrder instance
   */
  public static nextAfter(currentMax: number): DisplayOrder {
    return DisplayOrder.create(currentMax + 1);
  }

  /**
   * Gets the minimum order.
   */
  public static get MIN(): number {
    return MIN_ORDER;
  }

  /**
   * Gets the maximum order.
   */
  public static get MAX(): number {
    return MAX_ORDER;
  }

  /**
   * Gets the underlying order value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks equality with another DisplayOrder.
   * @param other The other DisplayOrder to compare
   * @returns true if values are equal
   */
  public equals(other: DisplayOrder): boolean {
    if (!(other instanceof DisplayOrder)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Compares this order to another.
   * @param other The other DisplayOrder to compare
   * @returns -1 if less, 0 if equal, 1 if greater
   */
  public compareTo(other: DisplayOrder): number {
    if (!(other instanceof DisplayOrder)) {
      return 1;
    }
    return this._value - other._value;
  }

  /**
   * Returns the string representation of the DisplayOrder.
   */
  public toString(): string {
    return this._value.toString();
  }
}
