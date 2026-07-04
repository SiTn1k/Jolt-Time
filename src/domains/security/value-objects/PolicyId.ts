/**
 * PolicyId Value Object
 *
 * Immutable value object representing a security policy identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * PolicyId value object class.
 * Immutable - once created, cannot be modified.
 */
export class PolicyId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a PolicyId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new PolicyId instance
   * @throws Error if validation fails
   */
  public static create(value: string): PolicyId {
    if (!value || value.trim().length === 0) {
      throw new Error('PolicyId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new PolicyId(value);
  }

  /**
   * Reconstructs a PolicyId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new PolicyId instance
   */
  public static reconstruct(value: string): PolicyId {
    return new PolicyId(value);
  }

  /**
   * Generates a new random PolicyId.
   * @returns A new PolicyId instance
   */
  public static generate(): PolicyId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new PolicyId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another PolicyId.
   * @param other The other PolicyId to compare
   * @returns true if values are equal
   */
  public equals(other: PolicyId): boolean {
    if (!(other instanceof PolicyId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the PolicyId.
   */
  public toString(): string {
    return this._value;
  }
}
