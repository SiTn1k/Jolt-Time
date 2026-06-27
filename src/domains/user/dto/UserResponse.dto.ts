/**
 * User Response DTO
 *
 * Data transfer object for user responses.
 * Used for API responses and serialization.
 */

import type { UserStatus } from '../types/UserStatus';
import type { UserRole } from '../types/UserRole';

/**
 * User response data structure.
 */
export interface UserResponseDto {
  /** Unique internal identifier */
  id: string;

  /** Telegram user ID */
  telegramId: number;

  /** Telegram username */
  username: string | null;

  /** User's first name */
  firstName: string;

  /** User's last name */
  lastName: string | null;

  /** Telegram language code */
  languageCode: string | null;

  /** URL to user's Telegram photo */
  photoUrl: string | null;

  /** Whether user has Telegram Premium */
  isPremium: boolean;

  /** User role (resolved separately from User entity) */
  role?: UserRole;

  /** Current user status */
  status: UserStatus;

  /** Timestamp when user was created */
  createdAt: string;

  /** Timestamp when user was last updated */
  updatedAt: string;

  /** Timestamp when user was last seen */
  lastSeenAt: string | null;
}

/**
 * User summary response (minimal data).
 */
export interface UserSummaryDto {
  /** Unique internal identifier */
  id: string;

  /** Telegram username */
  username: string | null;

  /** User's first name */
  firstName: string;

  /** URL to user's Telegram photo */
  photoUrl: string | null;

  /** Whether user has Telegram Premium */
  isPremium: boolean;
}

/**
 * User list response with pagination.
 */
export interface UserListResponseDto {
  /** List of users */
  users: UserResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;
}