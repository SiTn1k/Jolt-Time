/**
 * Publish Event DTO
 *
 * Data transfer object for publishing events.
 */

import type { EventSource } from '../types/EventSource';
import type { EventPriority } from '../types/EventPriority';

/**
 * Input DTO for publishing an event.
 */
export interface PublishEventDto {
  /** Event type identifier (e.g., "PlayerProfile.Created") */
  eventType: string;

  /** Aggregate root ID this event belongs to */
  aggregateId: string;

  /** Type of aggregate that published this event */
  aggregateType: string;

  /** Source module/domain that published this event */
  sourceModule: EventSource;

  /** Event payload/data */
  payload: Record<string, unknown>;

  /** Optional correlation ID for tracing */
  correlationId?: string;

  /** Optional causation ID */
  causationId?: string;

  /** Optional user ID associated with this event */
  userId?: string;

  /** Optional session ID */
  sessionId?: string;

  /** Optional request ID */
  requestId?: string;

  /** Processing priority */
  priority?: EventPriority;

  /** Tags for filtering and routing */
  tags?: string[];

  /** Custom headers for event routing */
  headers?: Record<string, string>;

  /** Maximum retry attempts (default: 3) */
  maxRetries?: number;

  /** Timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

/**
 * Response DTO after publishing an event.
 */
export interface PublishEventResponseDto {
  /** Event ID */
  eventId: string;

  /** Envelope ID */
  envelopeId: string;

  /** Status message */
  message: string;

  /** Timestamp when published */
  publishedAt: string;
}