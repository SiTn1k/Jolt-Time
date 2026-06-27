/**
 * Username Value Object
 *
 * Immutable value object representing a Telegram username.
 * Encapsulates validation and normalization logic for usernames.
 */

const USERNAME_MIN_LENGTH = 5;
const USERNAME_MAX_LENGTH = 32;
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

/**
 * Username value object class.
 * Immutable - once created, cannot be modified.
 */
export class Username {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The normalized username string (without @ prefix)
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a Username from a string value.
   * Validates length and allowed characters, normalizes format.
   * @param value The Telegram username (with or without @ prefix)
   * @returns A new Username instance or null if input is null/undefined
   * @throws Error if validation fails
   */
  public static create(value: string | null | undefined): Username | null {
    if (value === null || value === undefined) {
      return null;
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return null;
    }

    // Remove @ prefix if present
    const usernameWithoutAt = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;

    if (usernameWithoutAt.length < USERNAME_MIN_LENGTH) {
      throw new Error(
        `Username must be at least ${USERNAME_MIN_LENGTH} characters, got: ${usernameWithoutAt.length}`
      );
    }

    if (usernameWithoutAt.length > USERNAME_MAX_LENGTH) {
      throw new Error(
        `Username must be at most ${USERNAME_MAX_LENGTH} characters, got: ${usernameWithoutAt.length}`
      );
    }

    if (!USERNAME_REGEX.test(usernameWithoutAt)) {
      throw new Error(
        `Username must start with a letter and contain only letters, numbers, and underscores`
      );
    }

    // Normalize to lowercase
    return new Username(usernameWithoutAt.toLowerCase());
  }

  /**
   * Reconstructs a Username from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The normalized username string (without @ prefix)
   * @returns A new Username instance
   */
  public static reconstruct(value: string): Username {
    return new Username(value);
  }

  /**
   * Gets the underlying username value (without @ prefix).
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Gets the username with @ prefix.
   */
  public get withAtPrefix(): string {
    return `@${this._value}`;
  }

  /**
   * Checks equality with another Username.
   * @param other The other Username to compare
   * @returns true if values are equal
   */
  public equals(other: Username): boolean {
    if (!(other instanceof Username)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the Username.
   */
  public toString(): string {
    return this._value;
  }
}
