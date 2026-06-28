/**
 * Event Processed Event
 *
 * Core event emitted when an event is successfully processed.
 */

import type { EventId } from '../value-objects/EventId';
import type { HandlerId } from '../value-objects/HandlerId';

/**
 * Event data for event processing completion.
 */
export interface EventProcessedEventData {
  /** Event ID */
  eventId: string;

  /** Envelope ID */
  envelopeId: string;

  /** Handler ID that processed the event */
  handlerId: string;

  /** Handler name */
  handlerName: string;

  /** Processing duration in milliseconds */
  processingTimeMs: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for event processing completion.
 */
export interface EventProcessedEvent {
  /** Event type identifier */
  readonly eventType: 'EventProcessed';

  /** Event data */
  readonly data: EventProcessedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an EventProcessedEvent.
 */
export function createEventProcessedEvent(params: {
  eventId: EventId;
  envelopeId: EventId;
  handlerId: HandlerId;
  handlerName: string;
  processingTimeMs: number;
}): EventProcessedEvent {
  return {
    eventType: 'EventProcessed',
    version: 1,
    data: {
      eventId: params.eventId.value,
      envelopeId: params.envelopeId.value,
      handlerId: params.handlerId.value,
      handlerName: params.handlerName,
      processingTimeMs: params.processingTimeMs,
      occurredAt: new Date(),
    },
  };
}