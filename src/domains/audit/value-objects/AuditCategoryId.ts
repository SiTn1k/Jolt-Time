/**
 * AuditCategoryId Value Object
 *
 * Immutable value object representing an audit category identifier.
 * Encapsulates ID validation and comparison logic.
 */

/**
 * AuditCategoryId value object class.
 * Immutable - once created, cannot be modified.
 */
export class AuditCategoryId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates an AuditCategoryId from a string value.
   * Validates that the value is a non-empty string.
   * @param value The string value
   * @returns A new AuditCategoryId instance
   * @throws Error if validation fails
   */
  public static create(value: string): AuditCategoryId {
    if (!value || value.trim().length === 0) {
      throw new Error('AuditCategoryId cannot be empty');
    }
    return new AuditCategoryId(value.trim());
  }

  /**
   * Reconstructs an AuditCategoryId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The string value
   * @returns A new AuditCategoryId instance
   */
  public static reconstruct(value: string): AuditCategoryId {
    return new AuditCategoryId(value);
  }

  /**
   * Gets the underlying string value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another AuditCategoryId.
   * @param other The other AuditCategoryId to compare
   * @returns true if values are equal
   */
  public equals(other: AuditCategoryId): boolean {
    if (!(other instanceof AuditCategoryId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the AuditCategoryId.
   */
  public toString(): string {
    return this._value;
  }
}
