/**
 * Language Validator
 *
 * Validates ISO 639-1 language codes.
 */

import { SUPPORTED_LANGUAGES, type UserLanguage } from '../types/UserLanguage';

const LANGUAGE_CODE_REGEX = /^[a-z]{2}$/;

/**
 * Validation result for language code validation.
 */
export interface LanguageValidationResult {
  isValid: boolean;
  error?: string;
  normalizedValue?: string | null;
  isSupported?: boolean;
}

/**
 * Validates ISO 639-1 language codes.
 */
export class LanguageValidator {
  /**
   * Validates a language code.
   * @param value The language code to validate
   * @param checkSupported Whether to check if the language is supported
   * @returns Validation result with normalized value if valid
   */
  public static validate(
    value: string | null | undefined,
    checkSupported = false
  ): LanguageValidationResult {
    if (value === null || value === undefined) {
      return { isValid: true, normalizedValue: null, isSupported: true };
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return { isValid: true, normalizedValue: null, isSupported: true };
    }

    const normalized = trimmed.toLowerCase();

    if (!LANGUAGE_CODE_REGEX.test(normalized)) {
      return {
        isValid: false,
        error: `LanguageCode must be a 2-letter lowercase ISO 639-1 code, got: ${value}`,
      };
    }

    const isSupported = (SUPPORTED_LANGUAGES as readonly string[]).includes(normalized);

    if (checkSupported && !isSupported) {
      return {
        isValid: true,
        normalizedValue: normalized,
        isSupported: false,
        error: `Language code '${normalized}' is not supported. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`,
      };
    }

    return {
      isValid: true,
      normalizedValue: normalized,
      isSupported: true,
    };
  }

  /**
   * Validates a language code and throws if invalid.
   * @param value The language code to validate
   * @param checkSupported Whether to check if the language is supported
   * @returns The normalized language code
   * @throws Error if validation fails
   */
  public static validateOrThrow(value: string | null | undefined, checkSupported = false): string | null {
    const result = this.validate(value, checkSupported);
    if (!result.isValid) {
      throw new Error(result.error);
    }
    if (checkSupported && !result.isSupported) {
      throw new Error(result.error);
    }
    return result.normalizedValue ?? null;
  }

  /**
   * Checks if a language code is supported.
   * @param value The language code to check
   * @returns True if supported
   */
  public static isSupported(value: string): value is UserLanguage {
    return (SUPPORTED_LANGUAGES as readonly string[]).includes(value.toLowerCase());
  }
}