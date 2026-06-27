/**
 * ResearchProgressValue Value Object
 *
 * Immutable value object representing research progress (0-100 percentage).
 * Encapsulates validation and comparison logic for progress tracking.
 */

/**
 * ResearchProgressValue value object class.
 * Immutable - once created, cannot be modified.
 */
export class ResearchProgressValue {
  private readonly _value: number;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The progress percentage (0-100)
   */
  private constructor(value: number) {
    this._value = value;
  }

  /**
   * Validates that a value is a valid progress percentage.
   * @param value The value to validate
   * @returns true if valid
   */
  public static isValid(value: number): boolean {
    return typeof value === 'number' && value >= 0 && value <= 100 && Number.isFinite(value);
  }

  /**
   * Creates ResearchProgressValue from a numeric percentage.
   * @param value The progress percentage (0-100)
   * @returns A new ResearchProgressValue instance
   * @throws Error if validation fails
   */
  public static create(value: number): ResearchProgressValue {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error('ResearchProgressValue must be a finite number');
    }
    if (value < 0) {
      throw new Error('ResearchProgressValue cannot be negative');
    }
    if (value > 100) {
      throw new Error('ResearchProgressValue cannot exceed 100');
    }
    return new ResearchProgressValue(value);
  }

  /**
   * Reconstructs ResearchProgressValue from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The progress percentage
   * @returns A new ResearchProgressValue instance
   */
  public static reconstruct(value: number): ResearchProgressValue {
    return new ResearchProgressValue(value);
  }

  /**
   * Creates a zero progress value.
   * @returns A new ResearchProgressValue instance at 0%
   */
  public static zero(): ResearchProgressValue {
    return new ResearchProgressValue(0);
  }

  /**
   * Creates a complete progress value.
   * @returns A new ResearchProgressValue instance at 100%
   */
  public static complete(): ResearchProgressValue {
    return new ResearchProgressValue(100);
  }

  /**
   * Gets the progress value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks if research is complete (100%).
   */
  public get isComplete(): boolean {
    return this._value >= 100;
  }

  /**
   * Checks if research has started (greater than 0%).
   */
  public get hasStarted(): boolean {
    return this._value > 0;
  }

  /**
   * Creates a new ResearchProgressValue with added progress.
   * @param amount The amount to add
   * @returns A new ResearchProgressValue instance
   * @throws Error if result would exceed 100
   */
  public addProgress(amount: number): ResearchProgressValue {
    const newValue = this._value + amount;
    if (newValue > 100) {
      return ResearchProgressValue.complete();
    }
    return ResearchProgressValue.create(newValue);
  }

  /**
   * Checks equality with another ResearchProgressValue.
   * @param other The other ResearchProgressValue to compare
   * @returns true if values are equal
   */
  public equals(other: ResearchProgressValue): boolean {
    if (!(other instanceof ResearchProgressValue)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the ResearchProgressValue.
   */
  public toString(): string {
    return `${this._value}%`;
  }
}