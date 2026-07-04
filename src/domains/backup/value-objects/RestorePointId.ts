/**
 * RestorePointId Value Object
 *
 * Immutable value object representing a restore point identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * RestorePointId value object class.
 * Immutable - once created, cannot be modified.
 */
export class RestorePointId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a RestorePointId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new RestorePointId instance
   * @throws Error if validation fails
   */
  public static create(value: string): RestorePointId {
    if (!value || value.trim().length === 0) {
      throw new Error('RestorePointId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new RestorePointId(value);
  }

  /**
   * Reconstructs a RestorePointId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new RestorePointId instance
   */
  public static reconstruct(value: string): RestorePointId {
    return new RestorePointId(value);
  }

  /**
   * Generates a new random RestorePointId.
   * @returns A new RestorePointId instance
   */
  public static generate(): RestorePointId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new RestorePointId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another RestorePointId.
   * @param other The other RestorePointId to compare
   * @returns true if values are equal
   */
  public equals(other: RestorePointId): boolean {
    if (!(other instanceof RestorePointId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the RestorePointId.
   */
  public toString(): string {
    return this._value;
  }
}
