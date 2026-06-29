/**
 * Admin Permission Updated Event
 *
 * Domain event emitted when admin permissions are updated (role or direct permissions).
 */

import type { AdminRoleId } from '../value-objects/AdminRoleId';
import type { PermissionId } from '../value-objects/PermissionId';
import type { AdminPermissionType } from '../types/AdminPermissionType';

/**
 * Event data for admin permission update.
 */
export interface AdminPermissionUpdatedEventData {
  /** Role ID (if permission change is on a role) */
  roleId?: string;

  /** Admin ID (if permission change is on an admin) */
  adminId?: string;

  /** Previous permissions */
  previousPermissions: AdminPermissionType[];

  /** New permissions */
  newPermissions: AdminPermissionType[];

  /** ID of admin who performed the change */
  changedBy: string;

  /** Type of change */
  changeType: 'role_updated' | 'permissions_assigned' | 'permissions_revoked';

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for admin permission update.
 */
export interface AdminPermissionUpdatedEvent {
  /** Event type identifier */
  readonly eventType: 'AdminPermissionUpdated';

  /** Event data */
  readonly data: AdminPermissionUpdatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AdminPermissionUpdatedEvent.
 */
export function createAdminPermissionUpdatedEvent(params: {
  roleId?: AdminRoleId;
  adminId?: string;
  previousPermissions: AdminPermissionType[];
  newPermissions: AdminPermissionType[];
  changedBy: string;
  changeType: 'role_updated' | 'permissions_assigned' | 'permissions_revoked';
}): AdminPermissionUpdatedEvent {
  return {
    eventType: 'AdminPermissionUpdated',
    version: 1,
    data: {
      roleId: params.roleId?.value,
      adminId: params.adminId,
      previousPermissions: params.previousPermissions,
      newPermissions: params.newPermissions,
      changedBy: params.changedBy,
      changeType: params.changeType,
      occurredAt: new Date(),
    },
  };
}