/**
 * Session Compromised Event
 *
 * Domain event emitted when a security session is detected as compromised.
 */

import type { SecuritySessionId } from '../value-objects/SecuritySessionId';
import type { IncidentSeverity } from '../types/IncidentSeverity';

/**
 * Event data for session compromise.
 */
export interface SessionCompromisedEventData {
  /** Session ID */
  sessionId: string;

  /** Actor ID */
  actorId: string;

  /** Compromise type */
  compromiseType: string;

  /** Severity */
  severity: IncidentSeverity;

  /** Description */
  description: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for session compromise.
 */
export interface SessionCompromisedEvent {
  /** Event type identifier */
  readonly eventType: 'SessionCompromised';

  /** Event data */
  readonly data: SessionCompromisedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a SessionCompromisedEvent.
 */
export function createSessionCompromisedEvent(params: {
  sessionId: SecuritySessionId;
  actorId: string;
  compromiseType: string;
  severity: IncidentSeverity;
  description: string;
}): SessionCompromisedEvent {
  return {
    eventType: 'SessionCompromised',
    version: 1,
    data: {
      sessionId: params.sessionId.value,
      actorId: params.actorId,
      compromiseType: params.compromiseType,
      severity: params.severity,
      description: params.description,
      occurredAt: new Date(),
    },
  };
}
