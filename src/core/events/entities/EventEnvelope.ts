/**
 * Event Envelope Entity
 *
 * Entity representing an event envelope for tracking event delivery and processing.
 * The envelope wraps a domain event with processing metadata.
 */

import { EventId } from '../value-objects/EventId';
import type { HandlerId } from '../value-objects/HandlerId';
import { EventStatus } from '../types/EventStatus';
import { EventPriority } from '../types/EventPriority';
import type { DomainEvent } from './DomainEvent';

/**
 * EventEnvelope entity properties.
 */
export interface EventEnvelopeProps {
  /** Unique envelope identifier */
  envelopeId: EventId;

  /** ID of the event this envelope contains */
  eventId: EventId;

  /** Current processing status */
  status: EventStatus;

  /** Number of retry attempts */
  retryCount: number;

  /** Maximum number of retry attempts */
  maxRetries: number;

  /** Timestamp when the event was published */
  publishedAt: Date;

  /** Timestamp when the event was last processed */
  processedAt: Date | null;

  /** Timestamp when the last processing attempt started */
  processingStartedAt: Date | null;

  /** Envelope metadata */
  metadata: EventEnvelopeMetadata;

  /** The wrapped domain event */
  event: DomainEvent;
}

/**
 * Event envelope metadata.
 */
export interface EventEnvelopeMetadata {
  /** Target handler IDs for this envelope */
  targetHandlers: HandlerId[];

  /** Processing priority */
  priority: EventPriority;

  /** Error message if processing failed */
  errorMessage?: string;

  /** Stack trace of the last error */
  errorStack?: string;

  /** Headers for event routing */
  headers: Record<string, string>;

  /** Timeout in milliseconds */
  timeoutMs: number;
}

/**
 * EventEnvelope entity class.
 * Wraps a domain event with processing metadata.
 */
export class EventEnvelope {
  /** Unique envelope identifier */
  public readonly envelopeId: EventId;

  /** ID of the event this envelope contains */
  public readonly eventId: EventId;

  /** Current processing status */
  public readonly status: EventStatus;

  /** Number of retry attempts */
  public readonly retryCount: number;

  /** Maximum number of retry attempts */
  public readonly maxRetries: number;

  /** Timestamp when the event was published */
  public readonly publishedAt: Date;

  /** Timestamp when the event was last processed */
  public readonly processedAt: Date | null;

  /** Timestamp when the last processing attempt started */
  public readonly processingStartedAt: Date | null;

  /** Envelope metadata */
  public readonly metadata: EventEnvelopeMetadata;

  /** The wrapped domain event */
  public readonly event: DomainEvent;

  /**
   * Creates a new EventEnvelope instance.
   */
  constructor(props: EventEnvelopeProps) {
    this.envelopeId = props.envelopeId;
    this.eventId = props.eventId;
    this.status = props.status;
    this.retryCount = props.retryCount;
    this.maxRetries = props.maxRetries;
    this.publishedAt = props.publishedAt;
    this.processedAt = props.processedAt;
    this.processingStartedAt = props.processingStartedAt;
    this.metadata = props.metadata;
    this.event = props.event;
  }

  /**
   * Creates a new EventEnvelope wrapping a domain event.
   */
  public static create(params: {
    envelopeId?: EventId;
    event: DomainEvent;
    targetHandlers?: HandlerId[];
    priority?: EventPriority;
    maxRetries?: number;
    timeoutMs?: number;
    headers?: Record<string, string>;
  }): EventEnvelope {
    const now = new Date();
    return new EventEnvelope({
      envelopeId: params.envelopeId ?? EventId.generate(),
      eventId: params.event.eventId,
      status: EventStatus.PENDING,
      retryCount: 0,
      maxRetries: params.maxRetries ?? 3,
      publishedAt: now,
      processedAt: null,
      processingStartedAt: null,
      metadata: {
        targetHandlers: params.targetHandlers ?? [],
        priority: params.priority ?? EventPriority.NORMAL,
        headers: params.headers ?? {},
        timeoutMs: params.timeoutMs ?? 30000,
      },
      event: params.event,
    });
  }

  /**
   * Creates a copy with updated status.
   */
  public withStatus(status: EventStatus): EventEnvelope {
    return new EventEnvelope({
      ...this.toProps(),
      status,
      processedAt: status === EventStatus.PROCESSED ? new Date() : this.processedAt,
      processingStartedAt: status === EventStatus.PROCESSING ? new Date() : this.processingStartedAt,
    });
  }

  /**
   * Creates a copy with incremented retry count.
   */
  public withRetry(): EventEnvelope {
    return new EventEnvelope({
      ...this.toProps(),
      status: EventStatus.RETRYING,
      retryCount: this.retryCount + 1,
    });
  }

  /**
   * Creates a copy with error information.
   */
  public withError(errorMessage: string, errorStack?: string): EventEnvelope {
    return new EventEnvelope({
      ...this.toProps(),
      status: EventStatus.FAILED,
      metadata: {
        ...this.metadata,
        errorMessage,
        errorStack,
      },
    });
  }

  /**
   * Converts the envelope to a plain object.
   */
  public toRecord(): EventEnvelopeRecord {
    return {
      envelope_id: this.envelopeId.value,
      event_id: this.eventId.value,
      status: this.status,
      retry_count: this.retryCount,
      max_retries: this.maxRetries,
      published_at: this.publishedAt.toISOString(),
      processed_at: this.processedAt?.toISOString() ?? null,
      processing_started_at: this.processingStartedAt?.toISOString() ?? null,
      target_handlers: this.metadata.targetHandlers.map((h) => h.value),
      priority: this.metadata.priority,
      error_message: this.metadata.errorMessage,
      error_stack: this.metadata.errorStack,
      headers: this.metadata.headers,
      timeout_ms: this.metadata.timeoutMs,
    };
  }

  /**
   * Converts to props object for copying.
   */
  public toProps(): EventEnvelopeProps {
    return {
      envelopeId: this.envelopeId,
      eventId: this.eventId,
      status: this.status,
      retryCount: this.retryCount,
      maxRetries: this.maxRetries,
      publishedAt: this.publishedAt,
      processedAt: this.processedAt,
      processingStartedAt: this.processingStartedAt,
      metadata: this.metadata,
      event: this.event,
    };
  }

  /**
   * Checks if this envelope can be retried.
   */
  public canRetry(): boolean {
    return this.retryCount < this.maxRetries && this.status === EventStatus.FAILED;
  }
}

/**
 * Database record representation of EventEnvelope.
 */
export interface EventEnvelopeRecord {
  envelope_id: string;
  event_id: string;
  status: EventStatus;
  retry_count: number;
  max_retries: number;
  published_at: string;
  processed_at: string | null;
  processing_started_at: string | null;
  target_handlers: string[];
  priority: EventPriority;
  error_message?: string;
  error_stack?: string;
  headers: Record<string, string>;
  timeout_ms: number;
}