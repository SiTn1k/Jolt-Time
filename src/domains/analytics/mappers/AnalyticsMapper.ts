/**
 * Analytics Mapper
 *
 * Maps between AnalyticsEvent entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { AnalyticsEvent } from '../entities/AnalyticsEvent';
import type { AnalyticsEventRecord } from '../entities/AnalyticsEvent';
import type { CreateAnalyticsEventDto, AnalyticsEventResponseDto } from '../dto/AnalyticsEvent.dto';

/**
 * Mapper for converting between AnalyticsEvent entity and DTOs.
 */
export class AnalyticsMapper {
  /**
   * Converts an AnalyticsEvent entity to AnalyticsEventResponseDto.
   */
  public static toResponse(event: AnalyticsEvent): AnalyticsEventResponseDto {
    return {
      eventId: event.eventId.value,
      eventType: event.eventType,
      playerProfileId: event.playerProfileId,
      sessionId: event.sessionId.value,
      sourceModule: event.sourceModule,
      payload: event.payload,
      createdAt: event.createdAt.toISOString(),
      metadata: event.metadata,
    };
  }

  /**
   * Converts an array of AnalyticsEvent entities to AnalyticsEventResponseDto array.
   */
  public static toResponseList(events: AnalyticsEvent[]): AnalyticsEventResponseDto[] {
    return events.map((event) => this.toResponse(event));
  }

  /**
   * Converts a CreateAnalyticsEventDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateAnalyticsEventDto): Omit<CreateAnalyticsEventDto, never> {
    return {
      eventType: dto.eventType,
      playerProfileId: dto.playerProfileId,
      sessionId: dto.sessionId,
      sourceModule: dto.sourceModule,
      payload: dto.payload,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateAnalyticsEventDto format.
   */
  public static fromRecordToDto(record: AnalyticsEventRecord): CreateAnalyticsEventDto {
    return {
      eventType: record.event_type as CreateAnalyticsEventDto['eventType'],
      playerProfileId: record.player_profile_id,
      sessionId: record.session_id,
      sourceModule: record.source_module,
      payload: record.payload,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an AnalyticsEvent entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(event: AnalyticsEvent): Omit<AnalyticsEventRecord, never> {
    return {
      event_id: event.eventId.value,
      event_type: event.eventType,
      player_profile_id: event.playerProfileId,
      session_id: event.sessionId.value,
      source_module: event.sourceModule,
      payload: event.payload,
      created_at: event.createdAt.toISOString(),
      metadata: event.metadata,
    };
  }
}
