/**
 * Security Session Closed Event
 *
 * Domain event emitted when a security session is closed.
 */

import type { SecuritySessionId } from '../value-objects/SecuritySessionId';
import type { SessionStatus } from '../types/SessionStatus';

/**
 * Event data for session closure.
 */
export interface SecuritySessionClosedEventData {
  /** Session ID */
  sessionId: string;

  /** Actor ID */
  actorId: string;

  /** Final status */
  status: SessionStatus;

  /** IP address */
  ipAddress: string;

  /** Duration in milliseconds */
  durationMs: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for session closure.
 */
export interface SecuritySessionClosedEvent {
  /** Event type identifier */
  readonly eventType: 'SecuritySessionClosed';

  /** Event data */
  readonly data: SecuritySessionClosedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a SecuritySessionClosedEvent.
 */
export function createSecuritySessionClosedEvent(params: {
  sessionId: SecuritySessionId;
  actorId: string;
  status: SessionStatus;
  ipAddress: string;
  durationMs: number;
}): SecuritySessionClosedEvent {
  return {
    eventType: 'SecuritySessionClosed',
    version: 1,
    data: {
      sessionId: params.sessionId.value,
      actorId: params.actorId,
      status: params.status,
      ipAddress: params.ipAddress,
      durationMs: params.durationMs,
      occurredAt: new Date(),
    },
  };
}
