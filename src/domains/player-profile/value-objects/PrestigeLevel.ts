/**
 * PrestigeLevel Value Object
 *
 * Immutable value object representing a player's prestige level.
 * Encapsulates prestige validation and reset mechanics.
 */

/**
 * Prestige constraints.
 */
export const PRESTIGE_CONSTRAINTS = {
  MIN_PRESTIGE: 0,
  MAX_PRESTIGE: 100,
} as const;

/**
 * PrestigeLevel value object class.
 * Immutable - once created, cannot be modified.
 */
export class PrestigeLevel {
  private readonly _value: number;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The prestige value
   */
  private constructor(value: number) {
    this._value = value;
  }

  /**
   * Creates a PrestigeLevel from a numeric value.
   * Validates that the prestige is within acceptable range.
   * @param value The prestige number
   * @returns A new PrestigeLevel instance
   * @throws Error if validation fails
   */
  public static create(value: number): PrestigeLevel {
    if (!Number.isInteger(value)) {
      throw new Error('Prestige must be an integer');
    }

    if (value < PRESTIGE_CONSTRAINTS.MIN_PRESTIGE) {
      throw new Error('Prestige cannot be negative');
    }

    if (value > PRESTIGE_CONSTRAINTS.MAX_PRESTIGE) {
      throw new Error(
        `Prestige cannot exceed ${PRESTIGE_CONSTRAINTS.MAX_PRESTIGE}`
      );
    }

    return new PrestigeLevel(value);
  }

  /**
   * Reconstructs a PrestigeLevel from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The prestige number
   * @returns A new PrestigeLevel instance
   */
  public static reconstruct(value: number): PrestigeLevel {
    return new PrestigeLevel(value);
  }

  /**
   * Creates starting prestige for new players (no prestige).
   * @returns A PrestigeLevel instance set to zero
   */
  public static start(): PrestigeLevel {
    return new PrestigeLevel(PRESTIGE_CONSTRAINTS.MIN_PRESTIGE);
  }

  /**
   * Gets the underlying prestige value.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks if player has any prestige.
   */
  public get hasPrestige(): boolean {
    return this._value > 0;
  }

  /**
   * Checks if this is the maximum prestige.
   */
  public get isMaxPrestige(): boolean {
    return this._value >= PRESTIGE_CONSTRAINTS.MAX_PRESTIGE;
  }

  /**
   * Gets the next prestige level.
   * @throws Error if already at max prestige
   */
  public getNextPrestige(): PrestigeLevel {
    if (this.isMaxPrestige) {
      throw new Error('Already at maximum prestige');
    }
    return new PrestigeLevel(this._value + 1);
  }

  /**
   * Checks if player can prestige.
   */
  public canPrestige(): boolean {
    return !this.isMaxPrestige;
  }

  /**
   * Increments prestige by 1.
   * @returns A new PrestigeLevel instance with incremented prestige
   * @throws Error if already at max prestige
   */
  public increment(): PrestigeLevel {
    return this.getNextPrestige();
  }

  /**
   * Resets prestige to zero.
   * @returns A new PrestigeLevel instance reset to zero
   */
  public reset(): PrestigeLevel {
    return new PrestigeLevel(PRESTIGE_CONSTRAINTS.MIN_PRESTIGE);
  }

  /**
   * Checks equality with another PrestigeLevel.
   * @param other The other PrestigeLevel to compare
   * @returns true if values are equal
   */
  public equals(other: PrestigeLevel): boolean {
    if (!(other instanceof PrestigeLevel)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Compares two prestige levels.
   * @returns negative if this < other, positive if this > other, 0 if equal
   */
  public compareTo(other: PrestigeLevel): number {
    return this._value - other._value;
  }

  /**
   * Returns the string representation of the PrestigeLevel.
   */
  public toString(): string {
    return this._value.toString();
  }
}