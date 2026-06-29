/**
 * FeatureFlagId Value Object
 *
 * Immutable value object representing a feature flag identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * FeatureFlagId value object class.
 * Immutable - once created, cannot be modified.
 */
export class FeatureFlagId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a FeatureFlagId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new FeatureFlagId instance
   * @throws Error if validation fails
   */
  public static create(value: string): FeatureFlagId {
    if (!value || value.trim().length === 0) {
      throw new Error('FeatureFlagId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new FeatureFlagId(value);
  }

  /**
   * Reconstructs a FeatureFlagId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new FeatureFlagId instance
   */
  public static reconstruct(value: string): FeatureFlagId {
    return new FeatureFlagId(value);
  }

  /**
   * Generates a new random FeatureFlagId.
   * @returns A new FeatureFlagId instance
   */
  public static generate(): FeatureFlagId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new FeatureFlagId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another FeatureFlagId.
   * @param other The other FeatureFlagId to compare
   * @returns true if values are equal
   */
  public equals(other: FeatureFlagId): boolean {
    if (!(other instanceof FeatureFlagId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the FeatureFlagId.
   */
  public toString(): string {
    return this._value;
  }
}
