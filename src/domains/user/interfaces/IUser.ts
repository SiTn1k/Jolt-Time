/**
 * User Interface
 *
 * Interface defining the contract for User entity.
 * All User implementations must adhere to this interface.
 */

import type { BaseEntity } from '../../../shared/types';
import type { UserStatus } from '../types/UserStatus';

/**
 * User entity interface.
 * Represents an authenticated user in the Jolt Time system.
 */
export interface IUser extends BaseEntity {
  /** Unique internal identifier */
  readonly id: string;

  /** Telegram user ID */
  readonly telegramId: number;

  /** Telegram username (optional) */
  readonly username: string | null;

  /** User's first name */
  readonly firstName: string;

  /** User's last name (optional) */
  readonly lastName: string | null;

  /** Telegram language code */
  readonly languageCode: string | null;

  /** URL to user's Telegram photo */
  readonly photoUrl: string | null;

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