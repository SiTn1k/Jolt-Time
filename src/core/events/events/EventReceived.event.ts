/**
 * Event Received Event
 *
 * Core event emitted when an event is received by a handler.
 */

import type { EventId } from '../value-objects/EventId';
import type { HandlerId } from '../value-objects/HandlerId';

/**
 * Event data for event receipt.
 */
export interface EventReceivedEventData {
  /** Event ID */
  eventId: string;

  /** Envelope ID */
  envelopeId: string;

  /** Handler ID that received the event */
  handlerId: string;

  /** Handler name */
  handlerName: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for event receipt.
 */
export interface EventReceivedEvent {
  /** Event type identifier */
  readonly eventType: 'EventReceived';

  /** Event data */
  readonly data: EventReceivedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an EventReceivedEvent.
 */
export function createEventReceivedEvent(params: {
  eventId: EventId;
  envelopeId: EventId;
  handlerId: HandlerId;
  handlerName: string;
}): EventReceivedEvent {
  return {
    eventType: 'EventReceived',
    version: 1,
    data: {
      eventId: params.eventId.value,
      envelopeId: params.envelopeId.value,
      handlerId: params.handlerId.value,
      handlerName: params.handlerName,
      occurredAt: new Date(),
    },
  };
}