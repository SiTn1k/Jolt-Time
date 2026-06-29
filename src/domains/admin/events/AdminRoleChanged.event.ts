/**
 * Admin Role Changed Event
 *
 * Domain event emitted when an admin's role is changed.
 */

import type { AdminId } from '../value-objects/AdminId';
import type { AdminRoleId } from '../value-objects/AdminRoleId';

/**
 * Event data for admin role change.
 */
export interface AdminRoleChangedEventData {
  /** Admin ID */
  adminId: string;

  /** Previous role ID */
  previousRoleId: string;

  /** New role ID */
  newRoleId: string;

  /** Previous role type */
  previousRoleType: string;

  /** New role type */
  newRoleType: string;

  /** ID of admin who performed the change */
  changedBy: string;

  /** Reason for the change */
  reason?: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for admin role change.
 */
export interface AdminRoleChangedEvent {
  /** Event type identifier */
  readonly eventType: 'AdminRoleChanged';

  /** Event data */
  readonly data: AdminRoleChangedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AdminRoleChangedEvent.
 */
export function createAdminRoleChangedEvent(params: {
  adminId: AdminId;
  previousRoleId: AdminRoleId;
  newRoleId: AdminRoleId;
  previousRoleType: string;
  newRoleType: string;
  changedBy: string;
  reason?: string;
}): AdminRoleChangedEvent {
  return {
    eventType: 'AdminRoleChanged',
    version: 1,
    data: {
      adminId: params.adminId.value,
      previousRoleId: params.previousRoleId.value,
      newRoleId: params.newRoleId.value,
      previousRoleType: params.previousRoleType,
      newRoleType: params.newRoleType,
      changedBy: params.changedBy,
      reason: params.reason,
      occurredAt: new Date(),
    },
  };
}