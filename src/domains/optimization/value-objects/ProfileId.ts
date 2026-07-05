/**
 * ProfileId Value Object
 *
 * Immutable value object representing a performance profile identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * ProfileId value object class.
 * Immutable - once created, cannot be modified.
 */
export class ProfileId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a ProfileId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new ProfileId instance
   * @throws Error if validation fails
   */
  public static create(value: string): ProfileId {
    if (!value || value.trim().length === 0) {
      throw new Error('ProfileId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new ProfileId(value);
  }

  /**
   * Reconstructs a ProfileId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new ProfileId instance
   */
  public static reconstruct(value: string): ProfileId {
    return new ProfileId(value);
  }

  /**
   * Generates a new random ProfileId.
   * @returns A new ProfileId instance
   */
  public static generate(): ProfileId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new ProfileId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another ProfileId.
   * @param other The other ProfileId to compare
   * @returns true if values are equal
   */
  public equals(other: ProfileId): boolean {
    if (!(other instanceof ProfileId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the ProfileId.
   */
  public toString(): string {
    return this._value;
  }
}
