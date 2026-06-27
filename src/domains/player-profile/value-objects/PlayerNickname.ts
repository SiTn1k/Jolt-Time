/**
 * PlayerNickname Value Object
 *
 * Immutable value object representing a player's in-game nickname.
 * Encapsulates validation rules and character restrictions.
 */

/**
 * Nickname validation constraints.
 */
export const NICKNAME_CONSTRAINTS = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 32,
  ALLOWED_PATTERN: /^[a-zA-Z0-9_]+$/,
} as const;

/**
 * PlayerNickname value object class.
 * Immutable - once created, cannot be modified.
 */
export class PlayerNickname {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The nickname string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a PlayerNickname from a string value.
   * Validates length and character restrictions.
   * @param value The nickname string
   * @returns A new PlayerNickname instance
   * @throws Error if validation fails
   */
  public static create(value: string | null | undefined): PlayerNickname {
    if (value === null || value === undefined) {
      throw new Error('Nickname cannot be null or undefined');
    }

    const trimmed = value.trim();

    if (trimmed.length < NICKNAME_CONSTRAINTS.MIN_LENGTH) {
      throw new Error(
        `Nickname must be at least ${NICKNAME_CONSTRAINTS.MIN_LENGTH} characters`
      );
    }

    if (trimmed.length > NICKNAME_CONSTRAINTS.MAX_LENGTH) {
      throw new Error(
        `Nickname must be at most ${NICKNAME_CONSTRAINTS.MAX_LENGTH} characters`
      );
    }

    if (!NICKNAME_CONSTRAINTS.ALLOWED_PATTERN.test(trimmed)) {
      throw new Error(
        'Nickname can only contain letters, numbers, and underscores'
      );
    }

    return new PlayerNickname(trimmed);
  }

  /**
   * Reconstructs a PlayerNickname from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The nickname string
   * @returns A new PlayerNickname instance
   */
  public static reconstruct(value: string): PlayerNickname {
    return new PlayerNickname(value);
  }

  /**
   * Creates a PlayerNickname without validation.
   * Use with caution - only for trusted input.
   * @param value The nickname string
   * @returns A new PlayerNickname instance
   */
  public static createUnchecked(value: string): PlayerNickname {
    return new PlayerNickname(value.trim());
  }

  /**
   * Gets the underlying nickname value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Gets the nickname length.
   */
  public get length(): number {
    return this._value.length;
  }

  /**
   * Checks if nickname starts with a letter.
   */
  public get startsWithLetter(): boolean {
    return /^[a-zA-Z]/.test(this._value);
  }

  /**
   * Checks equality with another PlayerNickname.
   * @param other The other PlayerNickname to compare
   * @returns true if values are equal
   */
  public equals(other: PlayerNickname): boolean {
    if (!(other instanceof PlayerNickname)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the PlayerNickname.
   */
  public toString(): string {
    return this._value;
  }
}