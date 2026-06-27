/**
 * WalletId Value Object
 *
 * Immutable value object representing a currency wallet identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * WalletId value object class.
 * Immutable - once created, cannot be modified.
 */
export class WalletId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a WalletId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new WalletId instance
   * @throws Error if validation fails
   */
  public static create(value: string): WalletId {
    if (!value || value.trim().length === 0) {
      throw new Error('WalletId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new WalletId(value);
  }

  /**
   * Reconstructs a WalletId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new WalletId instance
   */
  public static reconstruct(value: string): WalletId {
    return new WalletId(value);
  }

  /**
   * Generates a new random WalletId.
   * @returns A new WalletId instance
   */
  public static generate(): WalletId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new WalletId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another WalletId.
   * @param other The other WalletId to compare
   * @returns true if values are equal
   */
  public equals(other: WalletId): boolean {
    if (!(other instanceof WalletId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the WalletId.
   */
  public toString(): string {
    return this._value;
  }
}
