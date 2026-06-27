/**
 * Username Validator
 *
 * Validates Telegram username format and constraints.
 */

const USERNAME_MIN_LENGTH = 5;
const USERNAME_MAX_LENGTH = 32;
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

/**
 * Validation result for username validation.
 */
export interface UsernameValidationResult {
  isValid: boolean;
  error?: string;
  normalizedValue?: string | null;
}

/**
 * Validates a Telegram username.
 */
export class UsernameValidator {
  /**
   * Validates a username and returns the result.
   * @param value The username to validate (with or without @ prefix)
   * @returns Validation result with normalized value if valid
   */
  public static validate(value: string | null | undefined): UsernameValidationResult {
    if (value === null || value === undefined) {
      return { isValid: true, normalizedValue: null };
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return { isValid: true, normalizedValue: null };
    }

    const usernameWithoutAt = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;

    if (usernameWithoutAt.length < USERNAME_MIN_LENGTH) {
      return {
        isValid: false,
        error: `Username must be at least ${USERNAME_MIN_LENGTH} characters, got: ${usernameWithoutAt.length}`,
      };
    }

    if (usernameWithoutAt.length > USERNAME_MAX_LENGTH) {
      return {
        isValid: false,
        error: `Username must be at most ${USERNAME_MAX_LENGTH} characters, got: ${usernameWithoutAt.length}`,
      };
    }

    if (!USERNAME_REGEX.test(usernameWithoutAt)) {
      return {
        isValid: false,
        error: 'Username must start with a letter and contain only letters, numbers, and underscores',
      };
    }

    return {
      isValid: true,
      normalizedValue: usernameWithoutAt.toLowerCase(),
    };
  }

  /**
   * Validates a username and throws if invalid.
   * @param value The username to validate
   * @returns The normalized username
   * @throws Error if validation fails
   */
  public static validateOrThrow(value: string | null | undefined): string | null {
    const result = this.validate(value);
    if (!result.isValid) {
      throw new Error(result.error);
    }
    return result.normalizedValue ?? null;
  }
}