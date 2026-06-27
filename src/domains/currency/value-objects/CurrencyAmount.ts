/**
 * CurrencyAmount Value Object
 *
 * Immutable value object representing an amount of currency.
 * Encapsulates amount validation, non-negative constraint, and comparison logic.
 */

/**
 * CurrencyAmount value object class.
 * Immutable - once created, cannot be modified.
 */
export class CurrencyAmount {
  private readonly _amount: number;

  /**
   * Maximum allowed currency amount (safety limit).
   */
  public static readonly MAX_AMOUNT = Number.MAX_SAFE_INTEGER;

  /**
   * Private constructor enforces use of static factory method.
   * @param amount The currency amount value
   */
  private constructor(amount: number) {
    this._amount = amount;
  }

  /**
   * Creates a CurrencyAmount from a number value.
   * Validates that the value is a non-negative integer.
   * @param amount The currency amount
   * @returns A new CurrencyAmount instance
   * @throws Error if validation fails
   */
  public static create(amount: number): CurrencyAmount {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Currency amount must be a valid number');
    }
    if (!Number.isInteger(amount)) {
      throw new Error('Currency amount must be an integer');
    }
    if (amount < 0) {
      throw new Error('Currency amount cannot be negative');
    }
    if (amount > CurrencyAmount.MAX_AMOUNT) {
      throw new Error(`Currency amount exceeds maximum allowed value: ${CurrencyAmount.MAX_AMOUNT}`);
    }
    return new CurrencyAmount(amount);
  }

  /**
   * Reconstructs a CurrencyAmount from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param amount The currency amount
   * @returns A new CurrencyAmount instance
   */
  public static reconstruct(amount: number): CurrencyAmount {
    return new CurrencyAmount(amount);
  }

  /**
   * Creates a zero CurrencyAmount.
   * @returns A zero CurrencyAmount instance
   */
  public static zero(): CurrencyAmount {
    return new CurrencyAmount(0);
  }

  /**
   * Checks if a value is a valid currency amount.
   * @param amount The amount to check
   * @returns true if valid
   */
  public static isValid(amount: number): boolean {
    if (typeof amount !== 'number' || isNaN(amount)) return false;
    if (!Number.isInteger(amount)) return false;
    if (amount < 0) return false;
    if (amount > CurrencyAmount.MAX_AMOUNT) return false;
    return true;
  }

  /**
   * Gets the underlying amount value.
   */
  public get amount(): number {
    return this._amount;
  }

  /**
   * Gets the amount as a formatted string.
   */
  public get formatted(): string {
    return this._amount.toLocaleString();
  }

  /**
   * Checks if the amount is zero.
   */
  public get isZero(): boolean {
    return this._amount === 0;
  }

  /**
   * Checks if the amount is positive (greater than zero).
   */
  public get isPositive(): boolean {
    return this._amount > 0;
  }

  /**
   * Checks if the amount is negative.
   */
  public get isNegative(): boolean {
    return this._amount < 0;
  }

  /**
   * Checks if this amount is greater than another.
   * @param other The other CurrencyAmount to compare
   * @returns true if this amount is greater
   */
  public isGreaterThan(other: CurrencyAmount): boolean {
    return this._amount > other._amount;
  }

  /**
   * Checks if this amount is greater than or equal to another.
   * @param other The other CurrencyAmount to compare
   * @returns true if this amount is greater or equal
   */
  public isGreaterThanOrEqual(other: CurrencyAmount): boolean {
    return this._amount >= other._amount;
  }

  /**
   * Checks if this amount is less than another.
   * @param other The other CurrencyAmount to compare
   * @returns true if this amount is less
   */
  public isLessThan(other: CurrencyAmount): boolean {
    return this._amount < other._amount;
  }

  /**
   * Checks if this amount is less than or equal to another.
   * @param other The other CurrencyAmount to compare
   * @returns true if this amount is less or equal
   */
  public isLessThanOrEqual(other: CurrencyAmount): boolean {
    return this._amount <= other._amount;
  }

  /**
   * Checks equality with another CurrencyAmount.
   * @param other The other CurrencyAmount to compare
   * @returns true if values are equal
   */
  public equals(other: CurrencyAmount): boolean {
    if (!(other instanceof CurrencyAmount)) {
      return false;
    }
    return this._amount === other._amount;
  }

  /**
   * Returns the string representation of the CurrencyAmount.
   */
  public toString(): string {
    return this._amount.toString();
  }
}
