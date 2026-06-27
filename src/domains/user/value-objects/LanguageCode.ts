/**
 * LanguageCode Value Object
 *
 * Immutable value object representing an ISO 639-1 language code.
 * Encapsulates validation and normalization logic for language codes.
 */

const LANGUAGE_CODE_REGEX = /^[a-z]{2}$/;

/**
 * LanguageCode value object class.
 * Immutable - once created, cannot be modified.
 */
export class LanguageCode {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The normalized language code (lowercase 2-letter)
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a LanguageCode from a string value.
   * Validates that the value is a 2-letter lowercase ISO language code.
   * @param value The ISO 639-1 language code
   * @returns A new LanguageCode instance or null if input is null/undefined
   * @throws Error if validation fails
   */
  public static create(value: string | null | undefined): LanguageCode | null {
    if (value === null || value === undefined) {
      return null;
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return null;
    }

    // Normalize to lowercase
    const normalized = trimmed.toLowerCase();

    if (!LANGUAGE_CODE_REGEX.test(normalized)) {
      throw new Error(
        `LanguageCode must be a 2-letter lowercase ISO 639-1 code, got: ${value}`
      );
    }

    return new LanguageCode(normalized);
  }

  /**
   * Reconstructs a LanguageCode from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The normalized language code
   * @returns A new LanguageCode instance
   */
  public static reconstruct(value: string): LanguageCode {
    return new LanguageCode(value);
  }

  /**
   * Gets the underlying language code value (2-letter lowercase).
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another LanguageCode.
   * @param other The other LanguageCode to compare
   * @returns true if values are equal
   */
  public equals(other: LanguageCode): boolean {
    if (!(other instanceof LanguageCode)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the LanguageCode.
   */
  public toString(): string {
    return this._value;
  }
}
