/**
 * HallCapacity Value Object
 *
 * Immutable value object representing the capacity of a museum hall.
 * Encapsulates validation and comparison logic for hall capacity.
 */

export const MIN_HALL_CAPACITY = 1;
export const MAX_HALL_CAPACITY = 100;
export const DEFAULT_HALL_CAPACITY = 10;

/**
 * HallCapacity value object class.
 * Immutable - once created, cannot be modified.
 */
export class HallCapacity {
  private readonly _value: number;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The capacity value
   */
  private constructor(value: number) {
    this._value = value;
  }

  /**
   * Creates a HallCapacity from a number value.
   * Validates that the value is within acceptable range.
   * @param value The capacity number
   * @returns A new HallCapacity instance
   * @throws Error if validation fails
   */
  public static create(value: number): HallCapacity {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('HallCapacity must be a valid number');
    }
    if (!Number.isInteger(value)) {
      throw new Error('HallCapacity must be an integer');
    }
    if (value < MIN_HALL_CAPACITY) {
      throw new Error(`HallCapacity must be at least ${MIN_HALL_CAPACITY}`);
    }
    if (value > MAX_HALL_CAPACITY) {
      throw new Error(`HallCapacity cannot exceed ${MAX_HALL_CAPACITY}`);
    }
    return new HallCapacity(value);
  }

  /**
   * Reconstructs a HallCapacity from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The capacity number
   * @returns A new HallCapacity instance
   */
  public static reconstruct(value: number): HallCapacity {
    return new HallCapacity(value);
  }

  /**
   * Gets the default hall capacity.
   * @returns Default HallCapacity instance
   */
  public static default(): HallCapacity {
    return new HallCapacity(DEFAULT_HALL_CAPACITY);
  }

  /**
   * Gets the minimum capacity.
   */
  public static get MIN(): number {
    return MIN_HALL_CAPACITY;
  }

  /**
   * Gets the maximum capacity.
   */
  public static get MAX(): number {
    return MAX_HALL_CAPACITY;
  }

  /**
   * Gets the underlying capacity value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks if a hall with this capacity has room for more exhibits.
   * @param currentCount Current number of exhibits
   * @returns true if there is room for more
   */
  public hasRoom(currentCount: number): boolean {
    return currentCount < this._value;
  }

  /**
   * Gets the remaining capacity.
   * @param currentCount Current number of exhibits
   * @returns Remaining capacity
   */
  public remaining(currentCount: number): number {
    return Math.max(0, this._value - currentCount);
  }

  /**
   * Checks equality with another HallCapacity.
   * @param other The other HallCapacity to compare
   * @returns true if values are equal
   */
  public equals(other: HallCapacity): boolean {
    if (!(other instanceof HallCapacity)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the HallCapacity.
   */
  public toString(): string {
    return this._value.toString();
  }
}
