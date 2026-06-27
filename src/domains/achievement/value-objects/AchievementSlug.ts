/**
 * AchievementSlug Value Object
 *
 * URL-friendly identifier for an achievement.
 */

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * AchievementSlug value object representing a unique slug identifier.
 */
export class AchievementSlug {
  private readonly _value: string;

  /**
   * Creates a new AchievementSlug instance.
   * @param value The slug string value
   */
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('AchievementSlug cannot be empty');
    }
    this._value = value.toLowerCase();
  }

  /**
   * Creates a new AchievementSlug from a string.
   */
  public static create(value: string): AchievementSlug {
    return new AchievementSlug(value);
  }

  /**
   * Reconstructs an AchievementSlug from a string value.
   * @param value The string value to reconstruct
   */
  public static reconstruct(value: string): AchievementSlug {
    return new AchievementSlug(value);
  }

  /**
   * Validates if a string is a valid slug format.
   */
  public static isValid(value: string | null | undefined): boolean {
    if (!value || value.trim().length === 0) {
      return false;
    }
    return SLUG_REGEX.test(value.toLowerCase());
  }

  /**
   * Gets the string value of the AchievementSlug.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another AchievementSlug.
   */
  public equals(other: AchievementSlug): boolean {
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
