/**
 * Event Envelope DTO
 *
 * Data transfer object for event envelopes.
 */

import type { EventStatus } from '../types/EventStatus';
import type { EventPriority } from '../types/EventPriority';

/**
 * Event envelope DTO.
 */
export interface EventEnvelopeDto {
  /** Unique envelope identifier */
  envelopeId: string;

  /** ID of the event this envelope contains */
  eventId: string;

  /** Current processing status */
  status: EventStatus;

  /** Number of retry attempts */
  retryCount: number;

  /** Maximum number of retry attempts */
  maxRetries: number;

  /** Timestamp when the event was published */
  publishedAt: string;

  /** Timestamp when the event was last processed */
  processedAt: string | null;

  /** Timestamp when processing started */
  processingStartedAt: string | null;

  /** Target handler IDs */
  targetHandlers: string[];

  /** Processing priority */
  priority: EventPriority;

  /** Error message if processing failed */
  errorMessage?: string;

  /** Headers for event routing */
  headers: Record<string, string>;

  /** Timeout in milliseconds */
  timeoutMs: number;
}

/**
 * Event envelope summary DTO (lightweight version).
 */
export interface EventEnvelopeSummaryDto {
  /** Unique envelope identifier */
  envelopeId: string;

  /** Event ID */
  eventId: string;

  /** Event type */
  eventType: string;

  /** Current status */
  status: EventStatus;

  /** Retry count */
  retryCount: number;

  /** Timestamp when published */
  publishedAt: string;
}