/**
 * ResearchPoints Value Object
 *
 * Immutable value object representing research points.
 * Encapsulates validation and comparison logic for research point amounts.
 */

/**
 * Maximum allowed research points value.
 */
export const MAX_RESEARCH_POINTS = 999_999_999;

/**
 * ResearchPoints value object class.
 * Immutable - once created, cannot be modified.
 */
export class ResearchPoints {
  private readonly _amount: number;

  /**
   * Private constructor enforces use of static factory method.
   * @param amount The research points amount
   */
  private constructor(amount: number) {
    this._amount = amount;
  }

  /**
   * Validates that an amount is a valid research points value.
   * @param amount The amount to validate
   * @returns true if valid
   */
  public static isValid(amount: number): boolean {
    return (
      typeof amount === 'number' &&
      Number.isInteger(amount) &&
      amount >= 0 &&
      amount <= MAX_RESEARCH_POINTS
    );
  }

  /**
   * Creates ResearchPoints from a numeric amount.
   * @param amount The amount
   * @returns A new ResearchPoints instance
   * @throws Error if validation fails
   */
  public static create(amount: number): ResearchPoints {
    if (!Number.isInteger(amount)) {
      throw new Error('ResearchPoints amount must be an integer');
    }
    if (amount < 0) {
      throw new Error('ResearchPoints amount cannot be negative');
    }
    if (amount > MAX_RESEARCH_POINTS) {
      throw new Error(`ResearchPoints amount exceeds maximum: ${MAX_RESEARCH_POINTS}`);
    }
    return new ResearchPoints(amount);
  }

  /**
   * Reconstructs ResearchPoints from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param amount The amount
   * @returns A new ResearchPoints instance
   */
  public static reconstruct(amount: number): ResearchPoints {
    return new ResearchPoints(amount);
  }

  /**
   * Gets the research points amount.
   */
  public get amount(): number {
    return this._amount;
  }

  /**
   * Creates a new ResearchPoints with added amount.
   * @param other The amount to add
   * @returns A new ResearchPoints instance
   */
  public add(other: number): ResearchPoints {
    const newAmount = this._amount + other;
    if (newAmount > MAX_RESEARCH_POINTS) {
      throw new Error('ResearchPoints addition would exceed maximum');
    }
    return ResearchPoints.create(newAmount);
  }

  /**
   * Creates a new ResearchPoints with subtracted amount.
   * @param other The amount to subtract
   * @returns A new ResearchPoints instance
   * @throws Error if result would be negative
   */
  public subtract(other: number): ResearchPoints {
    if (other > this._amount) {
      throw new Error('ResearchPoints subtraction would result in negative value');
    }
    return ResearchPoints.create(this._amount - other);
  }

  /**
   * Checks if this ResearchPoints is greater than another.
   * @param other The other ResearchPoints
   * @returns true if greater
   */
  public isGreaterThan(other: ResearchPoints): boolean {
    return this._amount > other._amount;
  }

  /**
   * Checks if this ResearchPoints is less than another.
   * @param other The other ResearchPoints
   * @returns true if less
   */
  public isLessThan(other: ResearchPoints): boolean {
    return this._amount < other._amount;
  }

  /**
   * Checks equality with another ResearchPoints.
   * @param other The other ResearchPoints to compare
   * @returns true if values are equal
   */
  public equals(other: ResearchPoints): boolean {
    if (!(other instanceof ResearchPoints)) {
      return false;
    }
    return this._amount === other._amount;
  }

  /**
   * Returns the string representation of the ResearchPoints.
   */
  public toString(): string {
    return this._amount.toString();
  }
}