/**
 * User Events
 *
 * Domain events for user lifecycle changes.
 */

export type { UserCreatedEvent, UserCreatedEventData } from './UserCreated.event';
export { createUserCreatedEvent } from './UserCreated.event';

export type { UserUpdatedEvent, UserUpdatedEventData, UpdatedField } from './UserUpdated.event';
export { createUserUpdatedEvent } from './UserUpdated.event';

export type { UserDeletedEvent, UserDeletedEventData } from './UserDeleted.event';
export { createUserDeletedEvent, DeleteType } from './UserDeleted.event';
