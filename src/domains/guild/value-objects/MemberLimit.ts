/**
 * MemberLimit Value Object
 *
 * Maximum number of members allowed in a guild based on guild level.
 */

/**
 * Member limits for each guild level.
 */
export const MEMBER_LIMITS: Record<number, number> = {
  1: 10,
  2: 15,
  3: 25,
  4: 35,
  5: 50,
  6: 75,
  7: 100,
} as const;

/**
 * Officer limits for each guild level.
 */
export const OFFICER_LIMITS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 8,
} as const;

const MIN_LIMIT = 1;
const MAX_LIMIT = 100;

/**
 * MemberLimit value object representing the maximum members in a guild.
 */
export class MemberLimit {
  private readonly _value: number;

  /**
   * Creates a new MemberLimit instance.
   * @param value The limit number
   */
  constructor(value: number) {
    if (!Number.isInteger(value)) {
      throw new Error('MemberLimit must be an integer');
    }
    if (value < MIN_LIMIT || value > MAX_LIMIT) {
      throw new Error(`MemberLimit must be between ${MIN_LIMIT} and ${MAX_LIMIT}`);
    }
    this._value = value;
  }

  /**
   * Creates a new MemberLimit after validating the input.
   */
  public static create(value: number): MemberLimit {
    if (!MemberLimit.isValid(value)) {
      throw new Error(`MemberLimit must be between ${MIN_LIMIT} and ${MAX_LIMIT}`);
    }
    return new MemberLimit(value);
  }

  /**
   * Reconstructs a MemberLimit from a number value (without validation).
   */
  public static reconstruct(value: number): MemberLimit {
    return new MemberLimit(value);
  }

  /**
   * Gets the default member limit for a guild level.
   */
  public static fromGuildLevel(level: number): MemberLimit {
    const limit = MEMBER_LIMITS[level] ?? MEMBER_LIMITS[1];
    return new MemberLimit(limit);
  }

  /**
   * Gets the officer limit for a guild level.
   */
  public static getOfficerLimit(level: number): number {
    return OFFICER_LIMITS[level] ?? OFFICER_LIMITS[1];
  }

  /**
   * Validates if a number is a valid member limit.
   */
  public static isValid(value: number | null | undefined): boolean {
    return (
      Number.isInteger(value) &&
      value !== null &&
      value !== undefined &&
      value >= MIN_LIMIT &&
      value <= MAX_LIMIT
    );
  }

  /**
   * Gets the number value of the MemberLimit.
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks if a given count is within the limit.
   */
  public hasCapacity(currentCount: number): boolean {
    return currentCount < this._value;
  }

  /**
   * Gets the remaining capacity.
   */
  public getRemainingCapacity(currentCount: number): number {
    return Math.max(0, this._value - currentCount);
  }

  /**
   * Checks equality with another MemberLimit.
   */
  public equals(other: MemberLimit): boolean {
    return this._value === other._value;
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
