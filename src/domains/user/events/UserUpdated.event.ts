/**
 * User Updated Event
 *
 * Domain event emitted when a user is updated.
 */

import type { UserId } from '../value-objects/UserId';

/**
 * Fields that can be updated.
 */
export type UpdatedField =
  | 'username'
  | 'firstName'
  | 'lastName'
  | 'languageCode'
  | 'photoUrl'
  | 'isPremium'
  | 'status';

/**
 * Event data for user update.
 */
export interface UserUpdatedEventData {
  /** User ID */
  userId: string;

  /** List of fields that were updated */
  updatedFields: UpdatedField[];

  /** Previous values (before update) */
  previousValues: Partial<Record<UpdatedField, unknown>>;

  /** New values (after update) */
  newValues: Partial<Record<UpdatedField, unknown>>;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for user updates.
 */
export interface UserUpdatedEvent {
  /** Event type identifier */
  readonly eventType: 'UserUpdated';

  /** Event data */
  readonly data: UserUpdatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a UserUpdatedEvent.
 */
export function createUserUpdatedEvent(params: {
  userId: UserId;
  updatedFields: UpdatedField[];
  previousValues: Partial<Record<UpdatedField, unknown>>;
  newValues: Partial<Record<UpdatedField, unknown>>;
}): UserUpdatedEvent {
  return {
    eventType: 'UserUpdated',
    version: 1,
    data: {
      userId: params.userId.value,
      updatedFields: params.updatedFields,
      previousValues: params.previousValues,
      newValues: params.newValues,
      occurredAt: new Date(),
    },
  };
}