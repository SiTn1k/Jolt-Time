/**
 * Admin Domain Events
 *
 * Domain events for the admin domain.
 */

export type { AdminCreatedEvent, AdminCreatedEventData } from './AdminCreated.event';
export { createAdminCreatedEvent } from './AdminCreated.event';

export type { AdminRoleChangedEvent, AdminRoleChangedEventData } from './AdminRoleChanged.event';
export { createAdminRoleChangedEvent } from './AdminRoleChanged.event';

export type { AdminPermissionUpdatedEvent, AdminPermissionUpdatedEventData } from './AdminPermissionUpdated.event';
export { createAdminPermissionUpdatedEvent } from './AdminPermissionUpdated.event';

export type { AdminLoggedInEvent, AdminLoggedInEventData } from './AdminLoggedIn.event';
export { createAdminLoggedInEvent } from './AdminLoggedIn.event';