/**
 * ConfigurationId Value Object
 *
 * Immutable value object representing a unique configuration identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * ConfigurationId value object class.
 * Immutable - once created, cannot be modified.
 */
export class ConfigurationId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a ConfigurationId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new ConfigurationId instance
   * @throws Error if validation fails
   */
  public static create(value: string): ConfigurationId {
    if (!value || value.trim().length === 0) {
      throw new Error('ConfigurationId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new ConfigurationId(value);
  }

  /**
   * Reconstructs a ConfigurationId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new ConfigurationId instance
   */
  public static reconstruct(value: string): ConfigurationId {
    return new ConfigurationId(value);
  }

  /**
   * Generates a new random ConfigurationId.
   * @returns A new ConfigurationId instance
   */
  public static generate(): ConfigurationId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new ConfigurationId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another ConfigurationId.
   * @param other The other ConfigurationId to compare
   * @returns true if values are equal
   */
  public equals(other: ConfigurationId): boolean {
    if (!(other instanceof ConfigurationId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the ConfigurationId.
   */
  public toString(): string {
    return this._value;
  }
}
