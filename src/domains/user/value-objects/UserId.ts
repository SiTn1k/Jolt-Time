/**
 * UserId Value Object
 *
 * Immutable value object representing an internal user identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * UserId value object class.
 * Immutable - once created, cannot be modified.
 */
export class UserId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a UserId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new UserId instance
   * @throws Error if validation fails
   */
  public static create(value: string): UserId {
    if (!value || value.trim().length === 0) {
      throw new Error('UserId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new UserId(value);
  }

  /**
   * Reconstructs a UserId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new UserId instance
   */
  public static reconstruct(value: string): UserId {
    return new UserId(value);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another UserId.
   * @param other The other UserId to compare
   * @returns true if values are equal
   */
  public equals(other: UserId): boolean {
    if (!(other instanceof UserId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the UserId.
   */
  public toString(): string {
    return this._value;
  }
}
