/**
 * Health Value Object
 *
 * Immutable value object representing player's health in the game.
 * Encapsulates health value validation and business rules.
 */

/**
 * Health validation constraints.
 */
export const HEALTH_CONSTRAINTS = {
  MIN_VALUE: 0,
  DEFAULT_MAX_HEALTH: 100,
  MAX_HEALTH_LIMIT: 9999,
} as const;

/**
 * Health value object class.
 * Immutable - once created, cannot be modified.
 */
export class Health {
  private readonly _value: number;
  private readonly _maximum: number;

  /**
   * Private constructor enforces use of static factory method.
   * @param value Current health value
   * @param maximum Maximum health capacity
   */
  private constructor(value: number, maximum: number) {
    this._value = value;
    this._maximum = maximum;
  }

  /**
   * Creates a Health instance from raw values.
   * Validates that the values are within acceptable ranges.
   * @param value Current health value
   * @param maximum Maximum health capacity
   * @returns A new Health instance
   * @throws Error if validation fails
   */
  public static create(value: number, maximum: number): Health {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Health value must be a valid number');
    }
    if (typeof maximum !== 'number' || isNaN(maximum)) {
      throw new Error('Maximum health must be a valid number');
    }
    if (value < HEALTH_CONSTRAINTS.MIN_VALUE) {
      throw new Error(`Health value cannot be less than ${HEALTH_CONSTRAINTS.MIN_VALUE}`);
    }
    if (maximum < HEALTH_CONSTRAINTS.MIN_VALUE) {
      throw new Error(`Maximum health cannot be less than ${HEALTH_CONSTRAINTS.MIN_VALUE}`);
    }
    if (maximum > HEALTH_CONSTRAINTS.MAX_HEALTH_LIMIT) {
      throw new Error(`Maximum health cannot exceed ${HEALTH_CONSTRAINTS.MAX_HEALTH_LIMIT}`);
    }
    if (value > maximum) {
      throw new Error('Current health cannot exceed maximum health');
    }
    return new Health(value, maximum);
  }

  /**
   * Reconstructs a Health from values that were already validated.
   * Use this only when the values are guaranteed to be valid.
   * @param value Current health value
   * @param maximum Maximum health capacity
   * @returns A new Health instance
   */
  public static reconstruct(value: number, maximum: number): Health {
    return new Health(value, maximum);
  }

  /**
   * Creates a starting Health with full value.
   * @param maximum Maximum health capacity (defaults to DEFAULT_MAX_HEALTH)
   * @returns A new Health instance with full health
   */
  public static start(maximum: number = HEALTH_CONSTRAINTS.DEFAULT_MAX_HEALTH): Health {
    return new Health(maximum, maximum);
  }

  /**
   * Gets the current health value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Gets the maximum health capacity.
   */
  public get maximum(): number {
    return this._maximum;
  }

  /**
   * Gets the percentage of health remaining (0-100).
   */
  public get percentage(): number {
    if (this._maximum === 0) return 0;
    return Math.round((this._value / this._maximum) * 100);
  }

  /**
   * Checks if health is full.
   */
  public get isFull(): boolean {
    return this._value >= this._maximum;
  }

  /**
   * Checks if health is depleted (player is dead).
   */
  public get isDepleted(): boolean {
    return this._value <= 0;
  }

  /**
   * Checks if player is in critical health state (below 25%).
   */
  public get isCritical(): boolean {
    return this.percentage <= 25 && this.percentage > 0;
  }

  /**
   * Checks if player can survive the specified damage.
   * @param damage The damage amount to check
   * @returns true if player would survive
   */
  public canSurvive(damage: number): boolean {
    return this._value - damage > 0;
  }

  /**
   * Creates a new Health with updated value.
   * Returns a new instance (immutable operation).
   * @param newValue New health value
   * @returns A new Health instance
   */
  public withValue(newValue: number): Health {
    return Health.create(newValue, this._maximum);
  }

  /**
   * Creates a new Health with updated maximum.
   * Returns a new instance (immutable operation).
   * @param newMaximum New maximum health
   * @returns A new Health instance
   */
  public withMaximum(newMaximum: number): Health {
    const clampedValue = Math.min(this._value, newMaximum);
    return Health.create(clampedValue, newMaximum);
  }

  /**
   * Checks equality with another Health.
   * @param other The other Health to compare
   * @returns true if values are equal
   */
  public equals(other: Health): boolean {
    if (!(other instanceof Health)) {
      return false;
    }
    return this._value === other._value && this._maximum === other._maximum;
  }

  /**
   * Returns the string representation of the Health.
   */
  public toString(): string {
    return `${this._value}/${this._maximum}`;
  }
}