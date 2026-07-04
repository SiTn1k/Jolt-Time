/**
 * Security Session Created Event
 *
 * Domain event emitted when a security session is created.
 */

import type { SecuritySessionId } from '../value-objects/SecuritySessionId';
import type { SessionStatus } from '../types/SessionStatus';

/**
 * Event data for session creation.
 */
export interface SecuritySessionCreatedEventData {
  /** Session ID */
  sessionId: string;

  /** Actor ID */
  actorId: string;

  /** Status */
  status: SessionStatus;

  /** IP address */
  ipAddress: string;

  /** Device */
  device: string;

  /** Expiration timestamp */
  expiresAt: Date;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for session creation.
 */
export interface SecuritySessionCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'SecuritySessionCreated';

  /** Event data */
  readonly data: SecuritySessionCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a SecuritySessionCreatedEvent.
 */
export function createSecuritySessionCreatedEvent(params: {
  sessionId: SecuritySessionId;
  actorId: string;
  status: SessionStatus;
  ipAddress: string;
  device: string;
  expiresAt: Date;
}): SecuritySessionCreatedEvent {
  return {
    eventType: 'SecuritySessionCreated',
    version: 1,
    data: {
      sessionId: params.sessionId.value,
      actorId: params.actorId,
      status: params.status,
      ipAddress: params.ipAddress,
      device: params.device,
      expiresAt: params.expiresAt,
      occurredAt: new Date(),
    },
  };
}
