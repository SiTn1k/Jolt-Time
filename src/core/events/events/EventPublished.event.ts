/**
 * Event Published Event
 *
 * Core event emitted when an event is published to the event bus.
 */

import type { EventId } from '../value-objects/EventId';
import type { EventType } from '../value-objects/EventType';
import type { AggregateId } from '../value-objects/AggregateId';

/**
 * Event data for event publication.
 */
export interface EventPublishedEventData {
  /** Event ID */
  eventId: string;

  /** Event type */
  eventType: string;

  /** Aggregate ID */
  aggregateId: string;

  /** Aggregate type */
  aggregateType: string;

  /** Envelope ID */
  envelopeId: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for event publication.
 */
export interface EventPublishedEvent {
  /** Event type identifier */
  readonly eventType: 'EventPublished';

  /** Event data */
  readonly data: EventPublishedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an EventPublishedEvent.
 */
export function createEventPublishedEvent(params: {
  eventId: EventId;
  eventType: EventType;
  aggregateId: AggregateId;
  aggregateType: string;
  envelopeId: EventId;
}): EventPublishedEvent {
  return {
    eventType: 'EventPublished',
    version: 1,
    data: {
      eventId: params.eventId.value,
      eventType: params.eventType.value,
      aggregateId: params.aggregateId.value,
      aggregateType: params.aggregateType,
      envelopeId: params.envelopeId.value,
      occurredAt: new Date(),
    },
  };
}