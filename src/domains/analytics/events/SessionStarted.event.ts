/**
 * Session Started Event
 *
 * Domain event emitted when an analytics session starts.
 */

import type { SessionId } from '../value-objects/SessionId';

/**
 * Event data for session start.
 */
export interface SessionStartedEventData {
  /** Session ID */
  sessionId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Device */
  device: string;

  /** Platform */
  platform: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for session start.
 */
export interface SessionStartedEvent {
  /** Event type identifier */
  readonly eventType: 'SessionStarted';

  /** Event data */
  readonly data: SessionStartedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a SessionStartedEvent.
 */
export function createSessionStartedEvent(params: {
  sessionId: SessionId;
  playerProfileId: string;
  device: string;
  platform: string;
}): SessionStartedEvent {
  return {
    eventType: 'SessionStarted',
    version: 1,
    data: {
      sessionId: params.sessionId.value,
      playerProfileId: params.playerProfileId,
      device: params.device,
      platform: params.platform,
      occurredAt: new Date(),
    },
  };
}
