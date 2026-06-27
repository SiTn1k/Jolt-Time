/**
 * User Interface
 *
 * Interface defining the contract for User entity.
 * All User implementations must adhere to this interface.
 */

import type { UserStatus } from '../types/UserStatus';
import type { UserId } from '../value-objects/UserId';
import type { TelegramId } from '../value-objects/TelegramId';
import type { Username } from '../value-objects/Username';
import type { LanguageCode } from '../value-objects/LanguageCode';
import type { UserPhotoUrl } from '../value-objects/UserPhotoUrl';

/**
 * User entity interface.
 * Represents an authenticated user in the Jolt Time system.
 */
export interface IUser {
  /** Unique internal identifier */
  readonly id: UserId;

  /** Telegram user ID */
  readonly telegramId: TelegramId;

  /** Telegram username (optional) */
  readonly username: Username | null;

  /** User's first name */
  readonly firstName: string;

  /** User's last name (optional) */
  readonly lastName: string | null;

  /** Telegram language code */
  readonly languageCode: LanguageCode | null;

  /** URL to user's Telegram photo */
  readonly photoUrl: UserPhotoUrl | null;

  /** Whether user has Telegram Premium */
  readonly isPremium: boolean;

  /** Timestamp when user was created */
  readonly createdAt: Date;

  /** Timestamp when user was last updated */
  readonly updatedAt: Date;

  /** Timestamp when user was last seen */
  readonly lastSeenAt: Date | null;

  /** Current user status */
  readonly status: UserStatus;
}