/**
 * Session Expired Event
 *
 * Domain event emitted when a security session expires.
 */

import type { SecuritySessionId } from '../value-objects/SecuritySessionId';

/**
 * Event data for session expiration.
 */
export interface SessionExpiredEventData {
  /** Session ID */
  sessionId: string;

  /** Actor ID */
  actorId: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for session expiration.
 */
export interface SessionExpiredEvent {
  /** Event type identifier */
  readonly eventType: 'SessionExpired';

  /** Event data */
  readonly data: SessionExpiredEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a SessionExpiredEvent.
 */
export function createSessionExpiredEvent(params: {
  sessionId: SecuritySessionId;
  actorId: string;
}): SessionExpiredEvent {
  return {
    eventType: 'SessionExpired',
    version: 1,
    data: {
      sessionId: params.sessionId.value,
      actorId: params.actorId,
      occurredAt: new Date(),
    },
  };
}
