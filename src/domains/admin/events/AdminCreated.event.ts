/**
 * Admin Created Event
 *
 * Domain event emitted when a new admin account is created.
 */

import type { AdminId } from '../value-objects/AdminId';
import type { TelegramId } from '../../user/value-objects/TelegramId';

/**
 * Event data for admin creation.
 */
export interface AdminCreatedEventData {
  /** Admin ID */
  adminId: string;

  /** Telegram ID */
  telegramId: number;

  /** Username (if available) */
  username: string | null;

  /** Display name */
  displayName: string;

  /** Role ID */
  roleId: string;

  /** Role type */
  roleType: string;

  /** Initial status */
  status: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for admin creation.
 */
export interface AdminCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'AdminCreated';

  /** Event data */
  readonly data: AdminCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AdminCreatedEvent.
 */
export function createAdminCreatedEvent(params: {
  adminId: AdminId;
  telegramId: TelegramId;
  username: string | null;
  displayName: string;
  roleId: string;
  roleType: string;
  status: string;
}): AdminCreatedEvent {
  return {
    eventType: 'AdminCreated',
    version: 1,
    data: {
      adminId: params.adminId.value,
      telegramId: params.telegramId.value,
      username: params.username,
      displayName: params.displayName,
      roleId: params.roleId,
      roleType: params.roleType,
      status: params.status,
      occurredAt: new Date(),
    },
  };
}