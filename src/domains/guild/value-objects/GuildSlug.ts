/**
 * GuildSlug Value Object
 *
 * URL-friendly unique identifier for a guild.
 */

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 24;

/**
 * GuildSlug value object representing a unique URL-friendly guild identifier.
 */
export class GuildSlug {
  private readonly _value: string;

  /**
   * Creates a new GuildSlug instance.
   * @param value The slug string value
   */
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('GuildSlug cannot be empty');
    }
    this._value = value.toLowerCase();
  }

  /**
   * Creates a new GuildSlug after validating the input.
   */
  public static create(value: string): GuildSlug {
    if (!GuildSlug.isValid(value)) {
      throw new Error(
        `GuildSlug must be ${MIN_LENGTH}-${MAX_LENGTH} lowercase alphanumeric characters with hyphens`
      );
    }
    return new GuildSlug(value);
  }

  /**
   * Reconstructs a GuildSlug from a string value (without validation).
   */
  public static reconstruct(value: string): GuildSlug {
    return new GuildSlug(value);
  }

  /**
   * Validates if a string is a valid guild slug.
   */
  public static isValid(value: string | null | undefined): boolean {
    if (!value || value.trim().length === 0) {
      return false;
    }
    const trimmed = value.toLowerCase();
    return (
      SLUG_REGEX.test(trimmed) &&
      trimmed.length >= MIN_LENGTH &&
      trimmed.length <= MAX_LENGTH
    );
  }

  /**
   * Gets the string value of the GuildSlug.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another GuildSlug.
   */
  public equals(other: GuildSlug): boolean {
    return this._value === other._value;
  }

  /**
   * Returns string representation.
   */
  public toString(): string {
    return this._value;
  }

  /**
   * Serializes to JSON.
   */
  public toJSON(): string {
    return this._value;
  }
}
