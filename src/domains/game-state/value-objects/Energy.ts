/**
 * Energy Value Object
 *
 * Immutable value object representing player's energy in the game.
 * Encapsulates energy value validation and business rules.
 */

/**
 * Energy validation constraints.
 */
export const ENERGY_CONSTRAINTS = {
  MIN_VALUE: 0,
  DEFAULT_MAX_ENERGY: 100,
  MAX_ENERGY_LIMIT: 999,
} as const;

/**
 * Energy value object class.
 * Immutable - once created, cannot be modified.
 */
export class Energy {
  private readonly _value: number;
  private readonly _maximum: number;

  /**
   * Private constructor enforces use of static factory method.
   * @param value Current energy value
   * @param maximum Maximum energy capacity
   */
  private constructor(value: number, maximum: number) {
    this._value = value;
    this._maximum = maximum;
  }

  /**
   * Creates an Energy instance from raw values.
   * Validates that the values are within acceptable ranges.
   * @param value Current energy value
   * @param maximum Maximum energy capacity
   * @returns A new Energy instance
   * @throws Error if validation fails
   */
  public static create(value: number, maximum: number): Energy {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Energy value must be a valid number');
    }
    if (typeof maximum !== 'number' || isNaN(maximum)) {
      throw new Error('Maximum energy must be a valid number');
    }
    if (value < ENERGY_CONSTRAINTS.MIN_VALUE) {
      throw new Error(`Energy value cannot be less than ${ENERGY_CONSTRAINTS.MIN_VALUE}`);
    }
    if (maximum < ENERGY_CONSTRAINTS.MIN_VALUE) {
      throw new Error(`Maximum energy cannot be less than ${ENERGY_CONSTRAINTS.MIN_VALUE}`);
    }
    if (maximum > ENERGY_CONSTRAINTS.MAX_ENERGY_LIMIT) {
      throw new Error(`Maximum energy cannot exceed ${ENERGY_CONSTRAINTS.MAX_ENERGY_LIMIT}`);
    }
    if (value > maximum) {
      throw new Error('Current energy cannot exceed maximum energy');
    }
    return new Energy(value, maximum);
  }

  /**
   * Reconstructs an Energy from values that were already validated.
   * Use this only when the values are guaranteed to be valid.
   * @param value Current energy value
   * @param maximum Maximum energy capacity
   * @returns A new Energy instance
   */
  public static reconstruct(value: number, maximum: number): Energy {
    return new Energy(value, maximum);
  }

  /**
   * Creates a starting Energy with full value.
   * @param maximum Maximum energy capacity (defaults to DEFAULT_MAX_ENERGY)
   * @returns A new Energy instance with full energy
   */
  public static start(maximum: number = ENERGY_CONSTRAINTS.DEFAULT_MAX_ENERGY): Energy {
    return new Energy(maximum, maximum);
  }

  /**
   * Gets the current energy value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Gets the maximum energy capacity.
   */
  public get maximum(): number {
    return this._maximum;
  }

  /**
   * Gets the percentage of energy remaining (0-100).
   */
  public get percentage(): number {
    if (this._maximum === 0) return 0;
    return Math.round((this._value / this._maximum) * 100);
  }

  /**
   * Checks if energy is full.
   */
  public get isFull(): boolean {
    return this._value >= this._maximum;
  }

  /**
   * Checks if energy is depleted.
   */
  public get isEmpty(): boolean {
    return this._value <= 0;
  }

  /**
   * Checks if player can perform an action requiring the specified energy cost.
   * @param cost The energy cost of the action
   * @returns true if player has enough energy
   */
  public canAfford(cost: number): boolean {
    return this._value >= cost;
  }

  /**
   * Creates a new Energy with updated value.
   * Returns a new instance (immutable operation).
   * @param newValue New energy value
   * @returns A new Energy instance
   */
  public withValue(newValue: number): Energy {
    return Energy.create(newValue, this._maximum);
  }

  /**
   * Creates a new Energy with updated maximum.
   * Returns a new instance (immutable operation).
   * @param newMaximum New maximum energy
   * @returns A new Energy instance
   */
  public withMaximum(newMaximum: number): Energy {
    const clampedValue = Math.min(this._value, newMaximum);
    return Energy.create(clampedValue, newMaximum);
  }

  /**
   * Checks equality with another Energy.
   * @param other The other Energy to compare
   * @returns true if values are equal
   */
  public equals(other: Energy): boolean {
    if (!(other instanceof Energy)) {
      return false;
    }
    return this._value === other._value && this._maximum === other._maximum;
  }

  /**
   * Returns the string representation of the Energy.
   */
  public toString(): string {
    return `${this._value}/${this._maximum}`;
  }
}