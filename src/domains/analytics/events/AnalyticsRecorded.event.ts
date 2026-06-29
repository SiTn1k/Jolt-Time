/**
 * Analytics Recorded Event
 *
 * Domain event emitted when an analytics event is recorded.
 */

import type { AnalyticsEventId } from '../value-objects/AnalyticsEventId';
import type { AnalyticsEventType } from '../types/AnalyticsEventType';

/**
 * Event data for analytics recording.
 */
export interface AnalyticsRecordedEventData {
  /** Event ID */
  eventId: string;

  /** Event type */
  eventType: AnalyticsEventType;

  /** Player profile ID */
  playerProfileId: string;

  /** Session ID */
  sessionId: string;

  /** Source module */
  sourceModule: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for analytics recording.
 */
export interface AnalyticsRecordedEvent {
  /** Event type identifier */
  readonly eventType: 'AnalyticsRecorded';

  /** Event data */
  readonly data: AnalyticsRecordedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AnalyticsRecordedEvent.
 */
export function createAnalyticsRecordedEvent(params: {
  eventId: AnalyticsEventId;
  eventType: AnalyticsEventType;
  playerProfileId: string;
  sessionId: string;
  sourceModule: string;
}): AnalyticsRecordedEvent {
  return {
    eventType: 'AnalyticsRecorded',
    version: 1,
    data: {
      eventId: params.eventId.value,
      eventType: params.eventType,
      playerProfileId: params.playerProfileId,
      sessionId: params.sessionId,
      sourceModule: params.sourceModule,
      occurredAt: new Date(),
    },
  };
}
