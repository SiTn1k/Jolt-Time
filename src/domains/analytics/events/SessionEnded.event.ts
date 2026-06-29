/**
 * Session Ended Event
 *
 * Domain event emitted when an analytics session ends.
 */

import type { SessionId } from '../value-objects/SessionId';
import type { SessionStatus } from '../types/SessionStatus';

/**
 * Event data for session end.
 */
export interface SessionEndedEventData {
  /** Session ID */
  sessionId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Session duration in milliseconds */
  duration: number;

  /** Session status at end */
  status: SessionStatus;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for session end.
 */
export interface SessionEndedEvent {
  /** Event type identifier */
  readonly eventType: 'SessionEnded';

  /** Event data */
  readonly data: SessionEndedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a SessionEndedEvent.
 */
export function createSessionEndedEvent(params: {
  sessionId: SessionId;
  playerProfileId: string;
  duration: number;
  status: SessionStatus;
}): SessionEndedEvent {
  return {
    eventType: 'SessionEnded',
    version: 1,
    data: {
      sessionId: params.sessionId.value,
      playerProfileId: params.playerProfileId,
      duration: params.duration,
      status: params.status,
      occurredAt: new Date(),
    },
  };
}
