/**
 * Domain Event DTO
 *
 * Data transfer object for domain events.
 */

import type { EventSource } from '../types/EventSource';

/**
 * Input DTO for publishing an event.
 */
export interface DomainEventDto {
  /** Unique event identifier */
  eventId: string;

  /** Event type identifier (e.g., "PlayerProfile.Created") */
  eventType: string;

  /** Aggregate root ID this event belongs to */
  aggregateId: string;

  /** Type of aggregate that published this event */
  aggregateType: string;

  /** Source module/domain that published this event */
  sourceModule: EventSource;

  /** Timestamp when the event occurred */
  occurredAt: string;

  /** Event payload/data */
  payload: Record<string, unknown>;

  /** Event metadata */
  metadata: DomainEventMetadataDto;
}

/**
 * Domain event metadata DTO.
 */
export interface DomainEventMetadataDto {
  /** Source domain that published the event */
  source: EventSource;

  /** Correlation ID for tracing related events */
  correlationId?: string;

  /** Causation ID - the event ID that caused this event */
  causationId?: string;

  /** User ID associated with this event (if applicable) */
  userId?: string;

  /** Session ID for tracking user sessions */
  sessionId?: string;

  /** Request ID for tracing HTTP requests */
  requestId?: string;

  /** Schema version for evolution */
  version: number;
}