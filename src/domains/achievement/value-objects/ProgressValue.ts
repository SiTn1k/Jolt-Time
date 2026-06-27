/**
 * ProgressValue Value Object
 *
 * Represents progress value towards completing an achievement.
 */

/**
 * ProgressValue value object representing a progress amount.
 */
export class ProgressValue {
  private readonly _value: number;

  /**
   * Creates a new ProgressValue instance.
   * @param value The progress value (must be non-negative)
   */
  constructor(value: number) {
    if (!Number.isInteger(value)) {
      throw new Error('ProgressValue must be an integer');
    }
    if (value < 0) {
      throw new Error('ProgressValue cannot be negative');
    }
    this._value = value;
  }

  /**
   * Creates ProgressValue from a number.
   */
  public static create(value: number): ProgressValue {
    return new ProgressValue(value);
  }

  /**
   * Reconstructs ProgressValue from a number value.
   */
  public static reconstruct(value: number): ProgressValue {
    return new ProgressValue(value);
  }

  /**
   * Validates if a value is valid for ProgressValue.
   */
  public static isValid(value: number | null | undefined): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    return Number.isInteger(value) && value >= 0;
  }

  /**
   * Gets the progress value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks if progress meets or exceeds a target.
   */
  public meetsTarget(target: number): boolean {
    return this._value >= target;
  }

  /**
   * Calculates completion percentage for a target.
   */
  public getCompletionPercentage(target: number): number {
    if (target <= 0) {
      return 1;
    }
    const percentage = this._value / target;
    return Math.min(1, Math.max(0, percentage));
  }

  /**
   * Checks equality with another ProgressValue.
   */
  public equals(other: ProgressValue): boolean {
    return this._value === other._value;
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
