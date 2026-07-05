/**
 * RegionId Value Object
 *
 * Immutable value object representing a cache region identifier.
 * Encapsulates region ID validation and comparison logic.
 */

const MAX_REGION_ID_LENGTH = 64;
const MIN_REGION_ID_LENGTH = 1;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * RegionId value object class.
 * Immutable - once created, cannot be modified.
 */
export class RegionId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The region ID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a RegionId from a string value.
   * Validates that the value is a non-empty, valid format.
   * @param value The region ID string
   * @returns A new RegionId instance
   * @throws Error if validation fails
   */
  public static create(value: string): RegionId {
    if (!value || value.trim().length === 0) {
      throw new Error('RegionId cannot be empty');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length > MAX_REGION_ID_LENGTH) {
      throw new Error(`RegionId exceeds maximum length of ${MAX_REGION_ID_LENGTH}`);
    }

    // Allow alphanumeric, dash, underscore
    const validFormatRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validFormatRegex.test(trimmedValue)) {
      throw new Error('RegionId can only contain alphanumeric characters, dashes, and underscores');
    }

    return new RegionId(trimmedValue);
  }

  /**
   * Reconstructs a RegionId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The region ID string
   * @returns A new RegionId instance
   */
  public static reconstruct(value: string): RegionId {
    return new RegionId(value);
  }

  /**
   * Generates a new random RegionId using UUID v4 format.
   * @returns A new RegionId instance
   */
  public static generate(): RegionId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new RegionId(uuid);
  }

  /**
   * Gets the underlying value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks if this is a generated UUID-based ID.
   */
  public get isUuid(): boolean {
    return UUID_REGEX.test(this._value);
  }

  /**
   * Checks equality with another RegionId.
   * @param other The other RegionId to compare
   * @returns true if values are equal
   */
  public equals(other: RegionId): boolean {
    if (!(other instanceof RegionId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the RegionId.
   */
  public toString(): string {
    return this._value;
  }
}
