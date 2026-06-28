/**
 * Event Retried Event
 *
 * Core event emitted when an event is scheduled for retry.
 */

import type { EventId } from '../value-objects/EventId';

/**
 * Event data for event retry.
 */
export interface EventRetriedEventData {
  /** Event ID */
  eventId: string;

  /** Envelope ID */
  envelopeId: string;

  /** Current retry count */
  retryCount: number;

  /** Maximum retries allowed */
  maxRetries: number;

  /** Reason for retry */
  reason?: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for event retry.
 */
export interface EventRetriedEvent {
  /** Event type identifier */
  readonly eventType: 'EventRetried';

  /** Event data */
  readonly data: EventRetriedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an EventRetriedEvent.
 */
export function createEventRetriedEvent(params: {
  eventId: EventId;
  envelopeId: EventId;
  retryCount: number;
  maxRetries: number;
  reason?: string;
}): EventRetriedEvent {
  return {
    eventType: 'EventRetried',
    version: 1,
    data: {
      eventId: params.eventId.value,
      envelopeId: params.envelopeId.value,
      retryCount: params.retryCount,
      maxRetries: params.maxRetries,
      reason: params.reason,
      occurredAt: new Date(),
    },
  };
}