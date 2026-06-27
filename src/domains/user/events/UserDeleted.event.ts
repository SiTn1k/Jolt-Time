/**
 * User Deleted Event
 *
 * Domain event emitted when a user is deleted.
 */

import type { UserId } from '../value-objects/UserId';
import type { TelegramId } from '../value-objects/TelegramId';

/**
 * Delete type enumeration.
 */
export enum DeleteType {
  /** User requested deletion */
  SELF_DELETE = 'self_delete',
  /** Admin deleted the user */
  ADMIN_DELETE = 'admin_delete',
  /** System deleted the user (e.g., GDPR request) */
  SYSTEM_DELETE = 'system_delete',
  /** User was banned and deleted */
  BAN_DELETE = 'ban_delete',
}

/**
 * Event data for user deletion.
 */
export interface UserDeletedEventData {
  /** User ID */
  userId: string;

  /** Telegram ID (preserved for audit) */
  telegramId: number;

  /** Username at time of deletion */
  username: string | null;

  /** Type of deletion */
  deleteType: DeleteType;

  /** Who initiated the deletion */
  deletedBy: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for user deletion.
 */
export interface UserDeletedEvent {
  /** Event type identifier */
  readonly eventType: 'UserDeleted';

  /** Event data */
  readonly data: UserDeletedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a UserDeletedEvent.
 */
export function createUserDeletedEvent(params: {
  userId: UserId;
  telegramId: TelegramId;
  username: string | null;
  deleteType: DeleteType;
  deletedBy: string;
}): UserDeletedEvent {
  return {
    eventType: 'UserDeleted',
    version: 1,
    data: {
      userId: params.userId.value,
      telegramId: params.telegramId.value,
      username: params.username,
      deleteType: params.deleteType,
      deletedBy: params.deletedBy,
      occurredAt: new Date(),
    },
  };
}