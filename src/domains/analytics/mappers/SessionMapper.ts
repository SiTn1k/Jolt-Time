/**
 * Session Mapper
 *
 * Maps between AnalyticsSession entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { AnalyticsSession } from '../entities/AnalyticsSession';
import type { AnalyticsSessionRecord } from '../entities/AnalyticsSession';
import type { CreateAnalyticsSessionDto, AnalyticsSessionResponseDto } from '../dto/AnalyticsSession.dto';

/**
 * Mapper for converting between AnalyticsSession entity and DTOs.
 */
export class SessionMapper {
  /**
   * Converts an AnalyticsSession entity to AnalyticsSessionResponseDto.
   */
  public static toResponse(session: AnalyticsSession): AnalyticsSessionResponseDto {
    return {
      sessionId: session.sessionId.value,
      playerProfileId: session.playerProfileId,
      startedAt: session.startedAt.toISOString(),
      endedAt: session.endedAt?.toISOString() ?? null,
      duration: session.duration,
      device: session.device,
      platform: session.platform,
      status: session.status,
      metadata: session.metadata,
    };
  }

  /**
   * Converts an array of AnalyticsSession entities to AnalyticsSessionResponseDto array.
   */
  public static toResponseList(sessions: AnalyticsSession[]): AnalyticsSessionResponseDto[] {
    return sessions.map((session) => this.toResponse(session));
  }

  /**
   * Converts a CreateAnalyticsSessionDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateAnalyticsSessionDto): Omit<CreateAnalyticsSessionDto, never> {
    return {
      playerProfileId: dto.playerProfileId,
      device: dto.device,
      platform: dto.platform,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateAnalyticsSessionDto format.
   */
  public static fromRecordToDto(record: AnalyticsSessionRecord): CreateAnalyticsSessionDto {
    return {
      playerProfileId: record.player_profile_id,
      device: record.device,
      platform: record.platform,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an AnalyticsSession entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(session: AnalyticsSession): Omit<AnalyticsSessionRecord, never> {
    return {
      session_id: session.sessionId.value,
      player_profile_id: session.playerProfileId,
      started_at: session.startedAt.toISOString(),
      ended_at: session.endedAt?.toISOString() ?? null,
      duration: session.duration,
      device: session.device,
      platform: session.platform,
      metadata: session.metadata,
    };
  }
}
