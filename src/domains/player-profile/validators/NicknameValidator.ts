/**
 * Nickname Validator
 *
 * Validates player nicknames according to game rules.
 */

import { NICKNAME_CONSTRAINTS } from '../value-objects/PlayerNickname';

/**
 * Result of nickname validation.
 */
export interface NicknameValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for player nicknames.
 */
export class NicknameValidator {
  /**
   * Validates a nickname string.
   * @param nickname The nickname to validate
   * @returns Validation result with any error message
   */
  public static validate(nickname: string | null | undefined): NicknameValidationResult {
    if (nickname === null || nickname === undefined) {
      return {
        isValid: false,
        error: 'Nickname is required',
      };
    }

    const trimmed = nickname.trim();

    if (trimmed.length === 0) {
      return {
        isValid: false,
        error: 'Nickname cannot be empty',
      };
    }

    if (trimmed.length < NICKNAME_CONSTRAINTS.MIN_LENGTH) {
      return {
        isValid: false,
        error: `Nickname must be at least ${NICKNAME_CONSTRAINTS.MIN_LENGTH} characters`,
      };
    }

    if (trimmed.length > NICKNAME_CONSTRAINTS.MAX_LENGTH) {
      return {
        isValid: false,
        error: `Nickname must be at most ${NICKNAME_CONSTRAINTS.MAX_LENGTH} characters`,
      };
    }

    if (!NICKNAME_CONSTRAINTS.ALLOWED_PATTERN.test(trimmed)) {
      return {
        isValid: false,
        error: 'Nickname can only contain letters, numbers, and underscores',
      };
    }

    // Check for reserved words (basic list)
    const reservedWords = ['admin', 'moderator', 'system', 'bot', 'null', 'undefined'];
    if (reservedWords.includes(trimmed.toLowerCase())) {
      return {
        isValid: false,
        error: 'This nickname is reserved',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a nickname and throws if invalid.
   * @param nickname The nickname to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(nickname: string | null | undefined): void {
    const result = this.validate(nickname);
    if (!result.isValid) {
      throw new Error(`Nickname validation failed: ${result.error}`);
    }
  }

  /**
   * Sanitizes a nickname by trimming and normalizing.
   * @param nickname The nickname to sanitize
   * @returns Sanitized nickname
   */
  public static sanitize(nickname: string | null | undefined): string | null {
    if (nickname === null || nickname === undefined) {
      return null;
    }
    const trimmed = nickname.trim();
    if (trimmed.length === 0) {
      return null;
    }
    return trimmed;
  }
}