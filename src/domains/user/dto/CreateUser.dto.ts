/**
 * Create User DTO
 *
 * Data transfer object for creating a new user.
 * Contains all required and optional data for user creation.
 */

import type { UserStatus } from '../types/UserStatus';

/**
 * Input for creating a new user.
 */
export interface CreateUserDto {
  /** Telegram user ID */
  telegramId: number;

  /** User's first name */
  firstName: string;

  /** User's last name (optional) */
  lastName?: string;

  /** Telegram username (optional) */
  username?: string;

  /** Telegram language code (ISO 639-1) */
  languageCode?: string;

  /** URL to user's Telegram photo */
  photoUrl?: string;

  /** Whether user has Telegram Premium */
  isPremium?: boolean;

  /** Initial status (defaults to ACTIVE) */
  status?: UserStatus;

  /** Registration source */
  registrationSource?: 'telegram_mini_app' | 'telegram_bot' | 'web' | 'imported' | 'system';
}

/**
 * Validation rules for CreateUserDto.
 */
export const CREATE_USER_VALIDATION = {
  telegramId: {
    required: true,
    min: 1,
  },
  firstName: {
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  lastName: {
    required: false,
    maxLength: 255,
  },
  username: {
    required: false,
    minLength: 5,
    maxLength: 32,
  },
  languageCode: {
    required: false,
    pattern: /^[a-z]{2}$/,
  },
  photoUrl: {
    required: false,
    maxLength: 2048,
  },
} as const;