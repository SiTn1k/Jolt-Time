/**
 * GuildName Value Object
 *
 * Display name for a guild.
 */

const MIN_LENGTH = 3;
const MAX_LENGTH = 24;
const NAME_REGEX = /^[a-zA-Z0-9\s]+$/;

/**
 * GuildName value object representing a guild's display name.
 */
export class GuildName {
  private readonly _value: string;

  /**
   * Creates a new GuildName instance.
   * @param value The name string value
   */
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('GuildName cannot be empty');
    }
    this._value = value.trim();
  }

  /**
   * Creates a new GuildName after validating the input.
   */
  public static create(value: string): GuildName {
    if (!GuildName.isValid(value)) {
      throw new Error(
        `GuildName must be ${MIN_LENGTH}-${MAX_LENGTH} alphanumeric characters or spaces`
      );
    }
    return new GuildName(value);
  }

  /**
   * Reconstructs a GuildName from a string value (without validation).
   */
  public static reconstruct(value: string): GuildName {
    return new GuildName(value);
  }

  /**
   * Validates if a string is a valid guild name.
   */
  public static isValid(value: string | null | undefined): boolean {
    if (!value || value.trim().length === 0) {
      return false;
    }
    const trimmed = value.trim();
    return (
      NAME_REGEX.test(trimmed) &&
      trimmed.length >= MIN_LENGTH &&
      trimmed.length <= MAX_LENGTH
    );
  }

  /**
   * Gets the string value of the GuildName.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another GuildName.
   */
  public equals(other: GuildName): boolean {
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
