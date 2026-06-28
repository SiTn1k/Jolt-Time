/**
 * GuildLevel Value Object
 *
 * Represents the level of a guild (1-7).
 */

const MIN_LEVEL = 1;
const MAX_LEVEL = 7;

/**
 * Experience thresholds for each guild level.
 */
export const GUILD_LEVEL_THRESHOLDS = [
  0,      // Level 1
  1000,   // Level 2
  3000,   // Level 3
  7500,   // Level 4
  15000,  // Level 5
  30000,  // Level 6
  60000,  // Level 7
] as const;

/**
 * GuildLevel value object representing a guild's level.
 */
export class GuildLevel {
  private readonly _value: number;

  /**
   * Creates a new GuildLevel instance.
   * @param value The level number
   */
  constructor(value: number) {
    if (!Number.isInteger(value)) {
      throw new Error('GuildLevel must be an integer');
    }
    if (value < MIN_LEVEL || value > MAX_LEVEL) {
      throw new Error(`GuildLevel must be between ${MIN_LEVEL} and ${MAX_LEVEL}`);
    }
    this._value = value;
  }

  /**
   * Creates a new GuildLevel after validating the input.
   */
  public static create(value: number): GuildLevel {
    if (!GuildLevel.isValid(value)) {
      throw new Error(`GuildLevel must be between ${MIN_LEVEL} and ${MAX_LEVEL}`);
    }
    return new GuildLevel(value);
  }

  /**
   * Reconstructs a GuildLevel from a number value (without validation).
   */
  public static reconstruct(value: number): GuildLevel {
    return new GuildLevel(value);
  }

  /**
   * Validates if a number is a valid guild level.
   */
  public static isValid(value: number | null | undefined): boolean {
    return (
      Number.isInteger(value) &&
      value !== null &&
      value !== undefined &&
      value >= MIN_LEVEL &&
      value <= MAX_LEVEL
    );
  }

  /**
   * Determines the level based on total experience.
   */
  public static fromExperience(experience: number): GuildLevel {
    let level = MIN_LEVEL;
    for (let i = GUILD_LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (experience >= GUILD_LEVEL_THRESHOLDS[i]) {
        level = i + 1;
        break;
      }
    }
    return new GuildLevel(level);
  }

  /**
   * Gets the experience required for the next level.
   */
  public getExperienceForNextLevel(): number | null {
    if (this._value >= MAX_LEVEL) {
      return null;
    }
    return GUILD_LEVEL_THRESHOLDS[this._value];
  }

  /**
   * Gets the minimum experience required for this level.
   */
  public getMinExperience(): number {
    return GUILD_LEVEL_THRESHOLDS[this._value - 1];
  }

  /**
   * Gets the maximum experience for this level (exclusive).
   */
  public getMaxExperience(): number {
    if (this._value >= MAX_LEVEL) {
      return GUILD_LEVEL_THRESHOLDS[MAX_LEVEL - 1];
    }
    return GUILD_LEVEL_THRESHOLDS[this._value];
  }

  /**
   * Gets the number value of the GuildLevel.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks equality with another GuildLevel.
   */
  public equals(other: GuildLevel): boolean {
    return this._value === other._value;
  }

  /**
   * Checks if this level is less than another.
   */
  public isLessThan(other: GuildLevel): boolean {
    return this._value < other._value;
  }

  /**
   * Checks if this level is greater than another.
   */
  public isGreaterThan(other: GuildLevel): boolean {
    return this._value > other._value;
  }

  /**
   * Returns string representation.
   */
  public toString(): string {
    return this._value.toString();
  }

  /**
   * Serializes to JSON.
   */
  public toJSON(): number {
    return this._value;
  }
}
