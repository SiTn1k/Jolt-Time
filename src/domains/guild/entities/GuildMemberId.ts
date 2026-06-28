/**
 * GuildMemberId Value Object
 *
 * Unique identifier for a guild member.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Generates a random UUID v4 string.
 */
function generateUUID(): string {
  const hex = '0123456789abcdef';
  return [
    hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
    hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
    hex.slice(0, 12),
  ].join('');
}

/**
 * GuildMemberId value object representing a unique guild member identifier.
 */
export class GuildMemberId {
  private readonly _value: string;

  /**
   * Creates a new GuildMemberId instance.
   * @param value The UUID string value
   */
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('GuildMemberId cannot be empty');
    }
    this._value = value;
  }

  /**
   * Creates a new random GuildMemberId.
   */
  public static create(): GuildMemberId {
    const uuid = generateUUID();
    return new GuildMemberId(uuid);
  }

  /**
   * Reconstructs a GuildMemberId from a string value.
   */
  public static reconstruct(value: string): GuildMemberId {
    return new GuildMemberId(value);
  }

  /**
   * Validates if a string is a valid UUID for GuildMemberId.
   */
  public static isValid(value: string | null | undefined): boolean {
    if (!value || value.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(value);
  }

  /**
   * Gets the string value of the GuildMemberId.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another GuildMemberId.
   */
  public equals(other: GuildMemberId): boolean {
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
