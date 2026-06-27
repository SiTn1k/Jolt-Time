/**
 * ProgressValue Value Object
 *
 * Represents a quest objective's current progress value.
 */

/**
 * ProgressValue value object representing progress towards an objective.
 */
export class ProgressValue {
  private readonly _value: number;

  /**
   * Creates a new ProgressValue instance.
   * @param value The progress value (must be >= 0)
   */
  constructor(value: number) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('ProgressValue must be a valid number');
    }
    if (value < 0) {
      throw new Error('ProgressValue cannot be negative');
    }
    if (!Number.isFinite(value)) {
      throw new Error('ProgressValue must be finite');
    }
    this._value = Math.floor(value);
  }

  /**
   * Creates a ProgressValue with value 0.
   */
  public static zero(): ProgressValue {
    return new ProgressValue(0);
  }

  /**
   * Reconstructs a ProgressValue from a number.
   * @param value The number value to reconstruct
   */
  public static reconstruct(value: number): ProgressValue {
    return new ProgressValue(value);
  }

  /**
   * Gets the numeric value of the ProgressValue.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks if progress is complete relative to a target.
   * @param target The target value to compare against
   */
  public isComplete(target: number): boolean {
    return this._value >= target;
  }

  /**
   * Gets the completion percentage relative to a target.
   * @param target The target value
   * @returns A value between 0 and 1
   */
  public getPercentage(target: number): number {
    if (target <= 0) {
      return 1;
    }
    const percentage = this._value / target;
    return Math.min(1, Math.max(0, percentage));
  }

  /**
   * Adds to the current progress value.
   * @param amount The amount to add
   */
  public add(amount: number): ProgressValue {
    return new ProgressValue(this._value + amount);
  }

  /**
   * Checks equality with another ProgressValue.
   */
  public equals(other: ProgressValue): boolean {
    return this._value === other._value;
  }

  /**
   * Compares two ProgressValue instances.
   * @returns -1 if less, 0 if equal, 1 if greater
   */
  public compareTo(other: ProgressValue): number {
    return this._value - other._value;
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
