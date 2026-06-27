/**
 * PlayerExperience Value Object
 *
 * Immutable value object representing a player's accumulated experience points.
 * Encapsulates XP validation and progression rules.
 */

/**
 * Experience constraints.
 */
export const PLAYER_EXPERIENCE_CONSTRAINTS = {
  MIN_EXPERIENCE: 0,
  MAX_EXPERIENCE: 999_999_999,
  XP_PER_LEVEL: 1000,
} as const;

/**
 * PlayerExperience value object class.
 * Immutable - once created, cannot be modified.
 */
export class PlayerExperience {
  private readonly _value: number;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The experience value
   */
  private constructor(value: number) {
    this._value = value;
  }

  /**
   * Creates a PlayerExperience from a numeric value.
   * Validates that the experience is within acceptable range.
   * @param value The experience number
   * @returns A new PlayerExperience instance
   * @throws Error if validation fails
   */
  public static create(value: number): PlayerExperience {
    if (!Number.isInteger(value)) {
      throw new Error('Experience must be an integer');
    }

    if (value < PLAYER_EXPERIENCE_CONSTRAINTS.MIN_EXPERIENCE) {
      throw new Error('Experience cannot be negative');
    }

    if (value > PLAYER_EXPERIENCE_CONSTRAINTS.MAX_EXPERIENCE) {
      throw new Error(
        `Experience cannot exceed ${PLAYER_EXPERIENCE_CONSTRAINTS.MAX_EXPERIENCE}`
      );
    }

    return new PlayerExperience(value);
  }

  /**
   * Reconstructs a PlayerExperience from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The experience number
   * @returns A new PlayerExperience instance
   */
  public static reconstruct(value: number): PlayerExperience {
    return new PlayerExperience(value);
  }

  /**
   * Creates starting experience for new players.
   * @returns A PlayerExperience instance set to zero
   */
  public static start(): PlayerExperience {
    return new PlayerExperience(PLAYER_EXPERIENCE_CONSTRAINTS.MIN_EXPERIENCE);
  }

  /**
   * Gets the underlying experience value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Gets the experience within current level (not total level progress).
   */
  public get withinLevel(): number {
    return this._value % PLAYER_EXPERIENCE_CONSTRAINTS.XP_PER_LEVEL;
  }

  /**
   * Gets the current level based on total experience.
   */
  public get currentLevel(): number {
    return Math.floor(this._value / PLAYER_EXPERIENCE_CONSTRAINTS.XP_PER_LEVEL) + 1;
  }

  /**
   * Gets the experience required for next level.
   */
  public get xpForNextLevel(): number {
    return PLAYER_EXPERIENCE_CONSTRAINTS.XP_PER_LEVEL;
  }

  /**
   * Gets the progress percentage to next level (0-100).
   */
  public get progressToNextLevel(): number {
    return (this.withinLevel / PLAYER_EXPERIENCE_CONSTRAINTS.XP_PER_LEVEL) * 100;
  }

  /**
   * Checks if player has any experience.
   */
  public get hasExperience(): boolean {
    return this._value > 0;
  }

  /**
   * Adds experience to this instance.
   * @param amount The amount to add
   * @returns A new PlayerExperience instance with added experience
   * @throws Error if result would exceed maximum
   */
  public add(amount: number): PlayerExperience {
    const newValue = this._value + amount;
    if (newValue > PLAYER_EXPERIENCE_CONSTRAINTS.MAX_EXPERIENCE) {
      throw new Error('Experience would exceed maximum allowed');
    }
    return new PlayerExperience(newValue);
  }

  /**
   * Checks equality with another PlayerExperience.
   * @param other The other PlayerExperience to compare
   * @returns true if values are equal
   */
  public equals(other: PlayerExperience): boolean {
    if (!(other instanceof PlayerExperience)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Compares two experience values.
   * @returns negative if this < other, positive if this > other, 0 if equal
   */
  public compareTo(other: PlayerExperience): number {
    return this._value - other._value;
  }

  /**
   * Returns the string representation of the PlayerExperience.
   */
  public toString(): string {
    return this._value.toString();
  }
}