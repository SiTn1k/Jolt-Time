/**
 * AchievementPoints Value Object
 *
 * Represents points awarded for completing an achievement.
 */

/**
 * AchievementPoints value object representing achievement reward points.
 */
export class AchievementPoints {
  private readonly _value: number;

  /**
   * Creates a new AchievementPoints instance.
   * @param value The points value (must be non-negative)
   */
  constructor(value: number) {
    if (!Number.isInteger(value)) {
      throw new Error('AchievementPoints must be an integer');
    }
    if (value < 0) {
      throw new Error('AchievementPoints cannot be negative');
    }
    this._value = value;
  }

  /**
   * Creates AchievementPoints from a number.
   */
  public static create(value: number): AchievementPoints {
    return new AchievementPoints(value);
  }

  /**
   * Reconstructs AchievementPoints from a number value.
   */
  public static reconstruct(value: number): AchievementPoints {
    return new AchievementPoints(value);
  }

  /**
   * Validates if a value is valid for AchievementPoints.
   */
  public static isValid(value: number | null | undefined): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    return Number.isInteger(value) && value >= 0;
  }

  /**
   * Gets the points value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks equality with another AchievementPoints.
   */
  public equals(other: AchievementPoints): boolean {
    return this._value === other._value;
  }

  /**
   * Adds points to this instance.
   */
  public add(other: AchievementPoints): AchievementPoints {
    return new AchievementPoints(this._value + other._value);
  }

  /**
   * Returns string representation.
   */
  public toString(): string {
    return String(this._value);
  }

  /**
   * Serializes to JSON.
   */
  public toJSON(): number {
    return this._value;
  }
}
