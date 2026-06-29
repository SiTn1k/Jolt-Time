/**
 * Admin Account DTO
 *
 * Data transfer objects for admin account operations.
 */

import type { AdminStatus } from '../types/AdminStatus';
import type { AdminRoleType } from '../types/AdminRoleType';
import type { AdminMetadata } from '../types/AdminMetadata';

/**
 * Create admin account request DTO.
 */
export interface CreateAdminAccountDto {
  /** Telegram user ID */
  telegramId: number;

  /** Telegram username (optional) */
  username?: string;

  /** Admin display name */
  displayName: string;

  /** Admin role ID */
  roleId: string;

  /** Admin role type */
  roleType: AdminRoleType;

  /** Initial status (default: PENDING) */
  status?: AdminStatus;

  /** Additional metadata */
  metadata?: Partial<AdminMetadata>;
}

/**
 * Update admin account request DTO.
 */
export interface UpdateAdminAccountDto {
  /** Admin display name */
  displayName?: string;

  /** Admin role ID */
  roleId?: string;

  /** Admin role type */
  roleType?: AdminRoleType;

  /** Admin status */
  status?: AdminStatus;

  /** Additional metadata */
  metadata?: Partial<AdminMetadata>;
}

/**
 * Admin account response DTO.
 */
export interface AdminAccountResponseDto {
  /** Unique internal identifier */
  id: string;

  /** Telegram user ID */
  telegramId: number;

  /** Telegram username */
  username: string | null;

  /** Admin display name */
  displayName: string;

  /** Admin role ID */
  roleId: string;

  /** Admin role type */
  roleType: AdminRoleType;

  /** Current admin status */
  status: AdminStatus;

  /** Timestamp of last login */
  lastLoginAt: string | null;

  /** Timestamp when account was created */
  createdAt: string;

  /** Timestamp when account was last updated */
  updatedAt: string;

  /** Additional metadata */
  metadata: AdminMetadata;
}

/**
 * Admin account summary DTO (minimal data).
 */
export interface AdminAccountSummaryDto {
  /** Unique internal identifier */
  id: string;

  /** Telegram username */
  username: string | null;

  /** Admin display name */
  displayName: string;

  /** Admin role type */
  roleType: AdminRoleType;

  /** Current admin status */
  status: AdminStatus;
}

/**
 * Admin account list response with pagination.
 */
export interface AdminAccountListResponseDto {
  /** List of admin accounts */
  admins: AdminAccountResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;
}