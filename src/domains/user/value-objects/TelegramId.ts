/**
 * TelegramId Value Object
 *
 * Immutable value object representing a Telegram user ID.
 * Encapsulates validation and comparison logic for Telegram numeric IDs.
 */

/**
 * TelegramId value object class.
 * Immutable - once created, cannot be modified.
 */
export class TelegramId {
  private readonly _value: number;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The Telegram numeric ID
   */
  private constructor(value: number) {
    this._value = value;
  }

  /**
   * Creates a TelegramId from a numeric value.
   * Validates that the value is a positive integer greater than zero.
   * @param value The Telegram numeric ID
   * @returns A new TelegramId instance
   * @throws Error if validation fails
   */
  public static create(value: number): TelegramId {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      throw new Error(`TelegramId must be an integer, got: ${typeof value}`);
    }
    if (value <= 0) {
      throw new Error(`TelegramId must be greater than zero, got: ${value}`);
    }
    return new TelegramId(value);
  }

  /**
   * Reconstructs a TelegramId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The Telegram numeric ID
   * @returns A new TelegramId instance
   */
  public static reconstruct(value: number): TelegramId {
    return new TelegramId(value);
  }

  /**
   * Gets the underlying Telegram numeric ID value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks equality with another TelegramId.
   * @param other The other TelegramId to compare
   * @returns true if values are equal
   */
  public equals(other: TelegramId): boolean {
    if (!(other instanceof TelegramId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the TelegramId.
   */
  public toString(): string {
    return String(this._value);
  }
}
