/**
 * AdminAccount Interface
 *
 * Interface defining the contract for AdminAccount entity.
 * All AdminAccount implementations must adhere to this interface.
 */

import type { AdminId } from '../value-objects/AdminId';
import type { AdminRoleId } from '../value-objects/AdminRoleId';
import type { TelegramId } from '../../user/value-objects/TelegramId';
import type { AdminStatus } from '../types/AdminStatus';
import type { AdminRoleType } from '../types/AdminRoleType';
import type { AdminMetadata } from '../types/AdminMetadata';

/**
 * AdminAccount entity interface.
 * Represents an administrative user in the Jolt Time system.
 */
export interface IAdminAccount {
  /** Unique internal identifier */
  readonly id: AdminId;

  /** Telegram user ID */
  readonly telegramId: TelegramId;

  /** Telegram username (optional) */
  readonly username: string | null;

  /** Admin display name */
  readonly displayName: string;

  /** Admin role ID */
  readonly roleId: AdminRoleId;

  /** Admin role type (denormalized for quick access) */
  readonly roleType: AdminRoleType;

  /** Current admin status */
  readonly status: AdminStatus;

  /** Timestamp of last login */
  readonly lastLoginAt: Date | null;

  /** Timestamp when account was created */
  readonly createdAt: Date;

  /** Timestamp when account was last updated */
  readonly updatedAt: Date;

  /** Additional metadata */
  readonly metadata: AdminMetadata;
}