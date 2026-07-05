/**
 * CategoryId Value Object
 *
 * Immutable value object representing an error category identifier.
 * Encapsulates validation and comparison logic.
 */

const CATEGORY_ID_REGEX = /^[a-z][a-z0-9_]*$/i;

/**
 * CategoryId value object class.
 * Immutable - once created, cannot be modified.
 */
export class CategoryId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The category ID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a CategoryId from a string value.
   * Validates that the value is a non-empty, valid identifier format.
   * @param value The category ID string
   * @returns A new CategoryId instance
   * @throws Error if validation fails
   */
  public static create(value: string): CategoryId {
    if (!value || value.trim().length === 0) {
      throw new Error('CategoryId cannot be empty');
    }
    const trimmed = value.trim().toLowerCase();
    if (!CATEGORY_ID_REGEX.test(trimmed)) {
      throw new Error(`Invalid CategoryId format: ${value}. Must be lowercase alphanumeric with underscores.`);
    }
    if (trimmed.length > 64) {
      throw new Error(`CategoryId cannot exceed 64 characters: ${value}`);
    }
    return new CategoryId(trimmed);
  }

  /**
   * Reconstructs a CategoryId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The category ID string
   * @returns A new CategoryId instance
   */
  public static reconstruct(value: string): CategoryId {
    return new CategoryId(value);
  }

  /**
   * Gets the underlying value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another CategoryId.
   * @param other The other CategoryId to compare
   * @returns true if values are equal
   */
  public equals(other: CategoryId): boolean {
    if (!(other instanceof CategoryId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the CategoryId.
   */
  public toString(): string {
    return this._value;
  }
}
