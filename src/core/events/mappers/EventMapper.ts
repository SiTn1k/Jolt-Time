/**
 * Event Mapper
 *
 * Maps between DomainEvent entity and various DTOs.
 * Only mapping - no dispatch logic.
 */

import { DomainEvent } from '../entities/DomainEvent';
import type { DomainEventRecord } from '../entities/DomainEvent';
import type { DomainEventDto, DomainEventMetadataDto } from '../dto/DomainEventDto';
import type { PublishEventDto } from '../dto/PublishEventDto';
import { EventId } from '../value-objects/EventId';
import { EventType } from '../value-objects/EventType';
import { AggregateId } from '../value-objects/AggregateId';
import type { EventSource } from '../types/EventSource';
import type { EventMetadataCore } from '../types/EventMetadata';

/**
 * Mapper for converting between DomainEvent entity and DTOs.
 */
export class EventMapper {
  /**
   * Converts a DomainEvent entity to DomainEventDto.
   */
  public static toDto(event: DomainEvent): DomainEventDto {
    return {
      eventId: event.eventId.value,
      eventType: event.eventType.value,
      aggregateId: event.aggregateId.value,
      aggregateType: event.aggregateType,
      sourceModule: event.sourceModule,
      occurredAt: event.occurredAt.toISOString(),
      payload: event.payload,
      metadata: {
        source: event.metadata.source,
        correlationId: event.metadata.correlationId,
        causationId: event.metadata.causationId,
        userId: event.metadata.userId,
        sessionId: event.metadata.sessionId,
        requestId: event.metadata.requestId,
        version: event.metadata.version,
      },
    };
  }

  /**
   * Converts a DomainEvent entity to DomainEventRecord.
   */
  public static toRecord(event: DomainEvent): DomainEventRecord {
    return event.toRecord();
  }

  /**
   * Converts a DomainEventRecord to DomainEvent entity.
   */
  public static fromRecord(record: DomainEventRecord): DomainEvent {
    return DomainEvent.fromRecord(record);
  }

  /**
   * Converts a DomainEventDto to DomainEvent entity.
   */
  public static fromDto(dto: DomainEventDto): DomainEvent {
    return DomainEvent.create({
      eventId: EventId.reconstruct(dto.eventId),
      eventType: EventType.reconstruct(dto.eventType),
      aggregateId: AggregateId.reconstruct(dto.aggregateId),
      aggregateType: dto.aggregateType,
      sourceModule: dto.sourceModule,
      payload: dto.payload,
      occurredAt: new Date(dto.occurredAt),
      metadata: {
        source: dto.metadata.source,
        correlationId: dto.metadata.correlationId,
        causationId: dto.metadata.causationId,
        userId: dto.metadata.userId,
        sessionId: dto.metadata.sessionId,
        requestId: dto.metadata.requestId,
        timestamp: new Date(dto.occurredAt),
        version: dto.metadata.version,
      },
    });
  }

  /**
   * Converts a PublishEventDto to DomainEvent entity.
   */
  public static fromPublishDto(dto: PublishEventDto): DomainEvent {
    return DomainEvent.create({
      eventId: EventId.generate(),
      eventType: EventType.create(dto.eventType),
      aggregateId: AggregateId.create(dto.aggregateId),
      aggregateType: dto.aggregateType,
      sourceModule: dto.sourceModule,
      payload: dto.payload,
      occurredAt: new Date(),
      metadata: {
        source: dto.sourceModule,
        correlationId: dto.correlationId,
        causationId: dto.causationId,
        userId: dto.userId,
        sessionId: dto.sessionId,
        requestId: dto.requestId,
        timestamp: new Date(),
        version: 1,
      },
    });
  }

  /**
   * Converts a DomainEvent entity to JSON object.
   */
  public static toJson(event: DomainEvent): Record<string, unknown> {
    return {
      eventId: event.eventId.value,
      eventType: event.eventType.value,
      aggregateId: event.aggregateId.value,
      aggregateType: event.aggregateType,
      sourceModule: event.sourceModule,
      occurredAt: event.occurredAt.toISOString(),
      payload: event.payload,
      metadata: event.metadata,
    };
  }

  /**
   * Converts a DomainEventMetadataDto to EventMetadataCore.
   */
  public static metadataFromDto(dto: DomainEventMetadataDto): EventMetadataCore {
    return {
      source: dto.source,
      correlationId: dto.correlationId,
      causationId: dto.causationId,
      userId: dto.userId,
      sessionId: dto.sessionId,
      requestId: dto.requestId,
      timestamp: new Date(),
      version: dto.version,
    };
  }

  /**
   * Converts EventMetadataCore to DomainEventMetadataDto.
   */
  public static metadataToDto(metadata: EventMetadataCore): DomainEventMetadataDto {
    return {
      source: metadata.source,
      correlationId: metadata.correlationId,
      causationId: metadata.causationId,
      userId: metadata.userId,
      sessionId: metadata.sessionId,
      requestId: metadata.requestId,
      version: metadata.version,
    };
  }
}