/**
 * Admin Logged In Event
 *
 * Domain event emitted when an admin successfully logs in.
 */

import type { AdminId } from '../value-objects/AdminId';

/**
 * Event data for admin login.
 */
export interface AdminLoggedInEventData {
  /** Admin ID */
  adminId: string;

  /** Session ID */
  sessionId: string;

  /** IP address */
  ipAddress?: string;

  /** User agent */
  userAgent?: string;

  /** Login method */
  loginMethod: 'telegram' | 'api_key' | 'session';

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for admin login.
 */
export interface AdminLoggedInEvent {
  /** Event type identifier */
  readonly eventType: 'AdminLoggedIn';

  /** Event data */
  readonly data: AdminLoggedInEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AdminLoggedInEvent.
 */
export function createAdminLoggedInEvent(params: {
  adminId: AdminId;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  loginMethod?: 'telegram' | 'api_key' | 'session';
}): AdminLoggedInEvent {
  return {
    eventType: 'AdminLoggedIn',
    version: 1,
    data: {
      adminId: params.adminId.value,
      sessionId: params.sessionId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      loginMethod: params.loginMethod ?? 'telegram',
      occurredAt: new Date(),
    },
  };
}