/**
 * ConfigurationKey Value Object
 *
 * Immutable value object representing a configuration key.
 * Configuration keys follow a hierarchical dot-notation pattern.
 */

const KEY_MAX_LENGTH = 255;
const KEY_SEGMENT_MAX_LENGTH = 64;
const KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)*$/;

/**
 * ConfigurationKey value object class.
 * Immutable - once created, cannot be modified.
 */
export class ConfigurationKey {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The key string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a ConfigurationKey from a string value.
   * Validates format: lowercase letters, numbers, dots, and underscores.
   * @param value The key string
   * @returns A new ConfigurationKey instance
   * @throws Error if validation fails
   */
  public static create(value: string): ConfigurationKey {
    if (!value || value.trim().length === 0) {
      throw new Error('ConfigurationKey cannot be empty');
    }

    const trimmed = value.trim();

    if (trimmed.length > KEY_MAX_LENGTH) {
      throw new Error(`ConfigurationKey exceeds maximum length of ${KEY_MAX_LENGTH}`);
    }

    if (!KEY_PATTERN.test(trimmed)) {
      throw new Error(
        'ConfigurationKey must start with a letter and contain only letters, numbers, dots, and underscores'
      );
    }

    const segments = trimmed.split('.');
    for (const segment of segments) {
      if (segment.length > KEY_SEGMENT_MAX_LENGTH) {
        throw new Error(`ConfigurationKey segment "${segment}" exceeds maximum length of ${KEY_SEGMENT_MAX_LENGTH}`);
      }
    }

    return new ConfigurationKey(trimmed);
  }

  /**
   * Reconstructs a ConfigurationKey from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The key string
   * @returns A new ConfigurationKey instance
   */
  public static reconstruct(value: string): ConfigurationKey {
    return new ConfigurationKey(value);
  }

  /**
   * Gets the underlying key value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Gets the key segments as an array.
   */
  public get segments(): string[] {
    return this._value.split('.');
  }

  /**
   * Gets the parent key (all but the last segment).
   */
  public get parent(): ConfigurationKey | null {
    const segs = this.segments;
    if (segs.length <= 1) {
      return null;
    }
    return ConfigurationKey.reconstruct(segs.slice(0, -1).join('.'));
  }

  /**
   * Checks equality with another ConfigurationKey.
   * @param other The other ConfigurationKey to compare
   * @returns true if values are equal
   */
  public equals(other: ConfigurationKey): boolean {
    if (!(other instanceof ConfigurationKey)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the ConfigurationKey.
   */
  public toString(): string {
    return this._value;
  }
}
