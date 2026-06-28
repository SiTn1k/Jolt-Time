/**
 * Domain Event Interface
 *
 * Contract for all domain events in the system.
 */

import type { EventId } from '../value-objects/EventId';
import type { EventType } from '../value-objects/EventType';
import type { AggregateId } from '../value-objects/AggregateId';

/**
 * Base interface for all domain events.
 * Events are immutable and represent something that happened in the domain.
 */
export interface IDomainEvent {
  /** Unique event identifier */
  readonly eventId: EventId;

  /** Event type identifier */
  readonly eventType: EventType;

  /** Aggregate root ID this event belongs to */
  readonly aggregateId: AggregateId;

  /** Type of aggregate that published this event */
  readonly aggregateType: string;

  /** Timestamp when the event occurred */
  readonly occurredAt: Date;

  /** Event payload/data */
  readonly payload: Record<string, unknown>;
}

/**
 * Event data interface for creating domain events.
 * Used as a base for event creation.
 */
export interface EventData {
  /** Event type identifier */
  eventType: string;

  /** Aggregate root ID */
  aggregateId: string;

  /** Aggregate type */
  aggregateType: string;

  /** Event payload */
  payload: Record<string, unknown>;
}