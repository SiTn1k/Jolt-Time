/**
 * User Created Event
 *
 * Domain event emitted when a new user is created.
 */

import type { UserId } from '../value-objects/UserId';
import type { TelegramId } from '../value-objects/TelegramId';

/**
 * Event data for user creation.
 */
export interface UserCreatedEventData {
  /** User ID */
  userId: string;

  /** Telegram ID */
  telegramId: number;

  /** Username (if available) */
  username: string | null;

  /** First name */
  firstName: string;

  /** Registration source */
  registrationSource: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for user creation.
 */
export interface UserCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'UserCreated';

  /** Event data */
  readonly data: UserCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a UserCreatedEvent.
 */
export function createUserCreatedEvent(params: {
  userId: UserId;
  telegramId: TelegramId;
  username: string | null;
  firstName: string;
  registrationSource: string;
}): UserCreatedEvent {
  return {
    eventType: 'UserCreated',
    version: 1,
    data: {
      userId: params.userId.value,
      telegramId: params.telegramId.value,
      username: params.username,
      firstName: params.firstName,
      registrationSource: params.registrationSource,
      occurredAt: new Date(),
    },
  };
}