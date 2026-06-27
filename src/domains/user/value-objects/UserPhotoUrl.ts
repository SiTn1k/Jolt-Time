/**
 * UserPhotoUrl Value Object
 *
 * Immutable value object representing a user's Telegram avatar URL.
 * Encapsulates validation logic for avatar URLs.
 */

/**
 * UserPhotoUrl value object class.
 * Immutable - once created, cannot be modified.
 */
export class UserPhotoUrl {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The validated URL string
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a UserPhotoUrl from a string value.
   * Validates that the value is a valid URL.
   * @param value The avatar URL string
   * @returns A new UserPhotoUrl instance or null if input is null/undefined
   * @throws Error if validation fails
   */
  public static create(value: string | null | undefined): UserPhotoUrl | null {
    if (value === null || value === undefined) {
      return null;
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return null;
    }

    // Validate URL format
    try {
      new URL(trimmed);
    } catch {
      throw new Error(`Invalid URL format: ${trimmed}`);
    }

    return new UserPhotoUrl(trimmed);
  }

  /**
   * Reconstructs a UserPhotoUrl from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The validated URL string
   * @returns A new UserPhotoUrl instance
   */
  public static reconstruct(value: string): UserPhotoUrl {
    return new UserPhotoUrl(value);
  }

  /**
   * Gets the underlying URL value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another UserPhotoUrl.
   * @param other The other UserPhotoUrl to compare
   * @returns true if values are equal
   */
  public equals(other: UserPhotoUrl): boolean {
    if (!(other instanceof UserPhotoUrl)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the UserPhotoUrl.
   */
  public toString(): string {
    return this._value;
  }
}
