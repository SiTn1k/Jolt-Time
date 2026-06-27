/**
 * PlayerLevel Value Object
 *
 * Immutable value object representing a player's level.
 * Encapsulates level validation and progression rules.
 */

/**
 * Level constraints.
 */
export const PLAYER_LEVEL_CONSTRAINTS = {
  MIN_LEVEL: 1,
  MAX_LEVEL: 100,
} as const;

/**
 * PlayerLevel value object class.
 * Immutable - once created, cannot be modified.
 */
export class PlayerLevel {
  private readonly _value: number;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The level value
   */
  private constructor(value: number) {
    this._value = value;
  }

  /**
   * Creates a PlayerLevel from a numeric value.
   * Validates that the level is within acceptable range.
   * @param value The level number
   * @returns A new PlayerLevel instance
   * @throws Error if validation fails
   */
  public static create(value: number): PlayerLevel {
    if (!Number.isInteger(value)) {
      throw new Error('Level must be an integer');
    }

    if (value < PLAYER_LEVEL_CONSTRAINTS.MIN_LEVEL) {
      throw new Error(
        `Level must be at least ${PLAYER_LEVEL_CONSTRAINTS.MIN_LEVEL}`
      );
    }

    if (value > PLAYER_LEVEL_CONSTRAINTS.MAX_LEVEL) {
      throw new Error(
        `Level cannot exceed ${PLAYER_LEVEL_CONSTRAINTS.MAX_LEVEL}`
      );
    }

    return new PlayerLevel(value);
  }

  /**
   * Reconstructs a PlayerLevel from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The level number
   * @returns A new PlayerLevel instance
   */
  public static reconstruct(value: number): PlayerLevel {
    return new PlayerLevel(value);
  }

  /**
   * Creates the starting level for new players.
   * @returns A PlayerLevel instance set to minimum level
   */
  public static start(): PlayerLevel {
    return new PlayerLevel(PLAYER_LEVEL_CONSTRAINTS.MIN_LEVEL);
  }

  /**
   * Gets the underlying level value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks if this is the maximum level.
   */
  public get isMaxLevel(): boolean {
    return this._value >= PLAYER_LEVEL_CONSTRAINTS.MAX_LEVEL;
  }

  /**
   * Checks if this is the starting level.
   */
  public get isStartingLevel(): boolean {
    return this._value === PLAYER_LEVEL_CONSTRAINTS.MIN_LEVEL;
  }

  /**
   * Gets the next level.
   * @throws Error if already at max level
   */
  public getNextLevel(): PlayerLevel {
    if (this.isMaxLevel) {
      throw new Error('Already at maximum level');
    }
    return new PlayerLevel(this._value + 1);
  }

  /**
   * Checks if player can level up.
   */
  public canLevelUp(): boolean {
    return !this.isMaxLevel;
  }

  /**
   * Checks equality with another PlayerLevel.
   * @param other The other PlayerLevel to compare
   * @returns true if values are equal
   */
  public equals(other: PlayerLevel): boolean {
    if (!(other instanceof PlayerLevel)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Compares two levels.
   * @returns negative if this < other, positive if this > other, 0 if equal
   */
  public compareTo(other: PlayerLevel): number {
    return this._value - other._value;
  }

  /**
   * Returns the string representation of the PlayerLevel.
   */
  public toString(): string {
    return this._value.toString();
  }
}