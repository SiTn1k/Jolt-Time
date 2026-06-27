/**
 * Update User DTO
 *
 * Data transfer object for updating an existing user.
 * All fields are optional - only provided fields will be updated.
 */

import type { UserStatus } from '../types/UserStatus';

/**
 * Input for updating an existing user.
 * All fields are optional.
 */
export interface UpdateUserDto {
  /** User's first name */
  firstName?: string;

  /** User's last name */
  lastName?: string;

  /** Telegram username */
  username?: string;

  /** Telegram language code (ISO 639-1) */
  languageCode?: string;

  /** URL to user's Telegram photo */
  photoUrl?: string;

  /** Whether user has Telegram Premium */
  isPremium?: boolean;

  /** User status */
  status?: UserStatus;

  /** Last seen timestamp */
  lastSeenAt?: Date;
}

/**
 * Validation rules for UpdateUserDto.
 */
export const UPDATE_USER_VALIDATION = {
  firstName: {
    required: false,
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
  isPremium: {
    required: false,
  },
  status: {
    required: false,
    allowedValues: ['active', 'inactive', 'banned', 'deleted'],
  },
} as const;