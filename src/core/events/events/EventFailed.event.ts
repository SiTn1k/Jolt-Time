/**
 * Event Failed Event
 *
 * Core event emitted when event processing fails.
 */

import type { EventId } from '../value-objects/EventId';
import type { HandlerId } from '../value-objects/HandlerId';

/**
 * Event data for event processing failure.
 */
export interface EventFailedEventData {
  /** Event ID */
  eventId: string;

  /** Envelope ID */
  envelopeId: string;

  /** Handler ID that attempted to process the event */
  handlerId: string;

  /** Handler name */
  handlerName: string;

  /** Error message */
  errorMessage: string;

  /** Error stack trace */
  errorStack?: string;

  /** Current retry count */
  retryCount: number;

  /** Whether the error is retriable */
  retriable: boolean;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for event processing failure.
 */
export interface EventFailedEvent {
  /** Event type identifier */
  readonly eventType: 'EventFailed';

  /** Event data */
  readonly data: EventFailedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an EventFailedEvent.
 */
export function createEventFailedEvent(params: {
  eventId: EventId;
  envelopeId: EventId;
  handlerId: HandlerId;
  handlerName: string;
  errorMessage: string;
  errorStack?: string;
  retryCount: number;
  retriable: boolean;
}): EventFailedEvent {
  return {
    eventType: 'EventFailed',
    version: 1,
    data: {
      eventId: params.eventId.value,
      envelopeId: params.envelopeId.value,
      handlerId: params.handlerId.value,
      handlerName: params.handlerName,
      errorMessage: params.errorMessage,
      errorStack: params.errorStack,
      retryCount: params.retryCount,
      retriable: params.retriable,
      occurredAt: new Date(),
    },
  };
}