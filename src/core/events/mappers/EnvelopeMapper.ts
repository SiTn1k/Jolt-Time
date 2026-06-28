/**
 * Envelope Mapper
 *
 * Maps between EventEnvelope entity and various DTOs.
 * Only mapping - no dispatch logic.
 */

import { EventEnvelope } from '../entities/EventEnvelope';
import type { EventEnvelopeRecord } from '../entities/EventEnvelope';
import type { EventEnvelopeDto, EventEnvelopeSummaryDto } from '../dto/EventEnvelopeDto';
import type { DomainEvent } from '../entities/DomainEvent';
import { EventId } from '../value-objects/EventId';
import type { HandlerId } from '../value-objects/HandlerId';

/**
 * Mapper for converting between EventEnvelope entity and DTOs.
 */
export class EnvelopeMapper {
  /**
   * Converts an EventEnvelope entity to EventEnvelopeDto.
   */
  public static toDto(envelope: EventEnvelope): EventEnvelopeDto {
    return {
      envelopeId: envelope.envelopeId.value,
      eventId: envelope.eventId.value,
      status: envelope.status,
      retryCount: envelope.retryCount,
      maxRetries: envelope.maxRetries,
      publishedAt: envelope.publishedAt.toISOString(),
      processedAt: envelope.processedAt?.toISOString() ?? null,
      processingStartedAt: envelope.processingStartedAt?.toISOString() ?? null,
      targetHandlers: envelope.metadata.targetHandlers.map((h) => h.value),
      priority: envelope.metadata.priority,
      errorMessage: envelope.metadata.errorMessage,
      headers: envelope.metadata.headers,
      timeoutMs: envelope.metadata.timeoutMs,
    };
  }

  /**
   * Converts an EventEnvelope entity to EventEnvelopeSummaryDto.
   */
  public static toSummaryDto(envelope: EventEnvelope): EventEnvelopeSummaryDto {
    return {
      envelopeId: envelope.envelopeId.value,
      eventId: envelope.eventId.value,
      eventType: envelope.event.eventType.value,
      status: envelope.status,
      retryCount: envelope.retryCount,
      publishedAt: envelope.publishedAt.toISOString(),
    };
  }

  /**
   * Converts an EventEnvelope entity to EventEnvelopeRecord.
   */
  public static toRecord(envelope: EventEnvelope): EventEnvelopeRecord {
    return envelope.toRecord();
  }

  /**
   * Converts an EventEnvelopeRecord to EventEnvelope entity.
   * Note: The event must be reconstructed separately.
   */
  public static fromRecord(
    record: EventEnvelopeRecord,
    event: DomainEvent
  ): EventEnvelope {
    return EventEnvelope.create({
      envelopeId: EventId.reconstruct(record.envelope_id),
      event,
      maxRetries: record.max_retries,
      timeoutMs: record.timeout_ms,
      priority: record.priority,
      headers: record.headers,
    });
  }

  /**
   * Converts an EventEnvelopeDto to a partial envelope props object.
   */
  public static fromDto(dto: EventEnvelopeDto): Partial<EventEnvelopeRecord> {
    return {
      envelope_id: dto.envelopeId,
      event_id: dto.eventId,
      status: dto.status,
      retry_count: dto.retryCount,
      max_retries: dto.maxRetries,
      published_at: dto.publishedAt,
      processed_at: dto.processedAt ?? null,
      processing_started_at: dto.processingStartedAt ?? null,
      priority: dto.priority,
      error_message: dto.errorMessage,
      headers: dto.headers,
      timeout_ms: dto.timeoutMs,
    };
  }

  /**
   * Converts an array of EventEnvelopes to EventEnvelopeDto array.
   */
  public static toDtoList(envelopes: EventEnvelope[]): EventEnvelopeDto[] {
    return envelopes.map((envelope) => this.toDto(envelope));
  }

  /**
   * Converts an array of EventEnvelopes to EventEnvelopeSummaryDto array.
   */
  public static toSummaryDtoList(envelopes: EventEnvelope[]): EventEnvelopeSummaryDto[] {
    return envelopes.map((envelope) => this.toSummaryDto(envelope));
  }
}