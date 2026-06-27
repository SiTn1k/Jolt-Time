/**
 * ReservedAmount Value Object
 *
 * Immutable value object representing a reserved amount of currency.
 * Reserved amounts are currency set aside for pending transactions.
 * Encapsulates validation and comparison logic.
 */

/**
 * ReservedAmount value object class.
 * Immutable - once created, cannot be modified.
 */
export class ReservedAmount {
  private readonly _amount: number;

  /**
   * Maximum allowed reserved amount (safety limit).
   */
  public static readonly MAX_RESERVED = Number.MAX_SAFE_INTEGER;

  /**
   * Private constructor enforces use of static factory method.
   * @param amount The reserved amount value
   */
  private constructor(amount: number) {
    this._amount = amount;
  }

  /**
   * Creates a ReservedAmount from a number value.
   * Validates that the value is a non-negative integer.
   * @param amount The reserved amount
   * @returns A new ReservedAmount instance
   * @throws Error if validation fails
   */
  public static create(amount: number): ReservedAmount {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Reserved amount must be a valid number');
    }
    if (!Number.isInteger(amount)) {
      throw new Error('Reserved amount must be an integer');
    }
    if (amount < 0) {
      throw new Error('Reserved amount cannot be negative');
    }
    if (amount > ReservedAmount.MAX_RESERVED) {
      throw new Error(`Reserved amount exceeds maximum allowed value: ${ReservedAmount.MAX_RESERVED}`);
    }
    return new ReservedAmount(amount);
  }

  /**
   * Reconstructs a ReservedAmount from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param amount The reserved amount
   * @returns A new ReservedAmount instance
   */
  public static reconstruct(amount: number): ReservedAmount {
    return new ReservedAmount(amount);
  }

  /**
   * Creates a zero ReservedAmount.
   * @returns A zero ReservedAmount instance
   */
  public static zero(): ReservedAmount {
    return new ReservedAmount(0);
  }

  /**
   * Checks if a value is a valid reserved amount.
   * @param amount The amount to check
   * @returns true if valid
   */
  public static isValid(amount: number): boolean {
    if (typeof amount !== 'number' || isNaN(amount)) return false;
    if (!Number.isInteger(amount)) return false;
    if (amount < 0) return false;
    if (amount > ReservedAmount.MAX_RESERVED) return false;
    return true;
  }

  /**
   * Gets the underlying amount value.
   */
  public get amount(): number {
    return this._amount;
  }

  /**
   * Checks if the reserved amount is zero (no reservations).
   */
  public get isZero(): boolean {
    return this._amount === 0;
  }

  /**
   * Checks if there are any reservations.
   */
  public get hasReservations(): boolean {
    return this._amount > 0;
  }

  /**
   * Checks equality with another ReservedAmount.
   * @param other The other ReservedAmount to compare
   * @returns true if values are equal
   */
  public equals(other: ReservedAmount): boolean {
    if (!(other instanceof ReservedAmount)) {
      return false;
    }
    return this._amount === other._amount;
  }

  /**
   * Returns the string representation of the ReservedAmount.
   */
  public toString(): string {
    return this._amount.toString();
  }
}
