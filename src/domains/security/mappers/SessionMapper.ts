/**
 * Session Mapper
 *
 * Maps between SecuritySession entity and DTOs.
 * No database logic - pure transformation only.
 */

import type { SecuritySession, SecuritySessionRecord } from '../entities/SecuritySession';
import type { SecuritySessionResponseDto, CreateSecuritySessionDto, UpdateSecuritySessionDto } from '../dto/SecuritySession.dto';

/**
 * Mapper for converting between SecuritySession entity and DTOs.
 */
export class SessionMapper {
  /**
   * Converts a SecuritySession entity to SecuritySessionResponseDto.
   */
  public static toResponse(session: SecuritySession): SecuritySessionResponseDto {
    return {
      sessionId: session.sessionId.value,
      actorId: session.actorId,
      status: session.status,
      ipAddress: session.ipAddress,
      device: session.device,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      metadata: session.metadata,
    };
  }

  /**
   * Converts an array of SecuritySession entities to SecuritySessionResponseDto array.
   */
  public static toResponseList(sessions: SecuritySession[]): SecuritySessionResponseDto[] {
    return sessions.map((session) => this.toResponse(session));
  }

  /**
   * Converts a CreateSecuritySessionDto to entity input.
   */
  public static fromCreateDto(dto: CreateSecuritySessionDto): Omit<CreateSecuritySessionDto, never> {
    return {
      actorId: dto.actorId,
      status: dto.status,
      ipAddress: dto.ipAddress,
      device: dto.device,
      expiresAt: dto.expiresAt,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateSecuritySessionDto format.
   */
  public static fromRecordToDto(record: SecuritySessionRecord): CreateSecuritySessionDto {
    return {
      actorId: record.actor_id,
      status: record.status as CreateSecuritySessionDto['status'],
      ipAddress: record.ip_address,
      device: record.device,
      expiresAt: record.expires_at,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a SecuritySession entity to a database record format.
   */
  public static toRecord(session: SecuritySession): Omit<SecuritySessionRecord, never> {
    return {
      session_id: session.sessionId.value,
      actor_id: session.actorId,
      status: session.status,
      ip_address: session.ipAddress,
      device: session.device,
      created_at: session.createdAt.toISOString(),
      expires_at: session.expiresAt.toISOString(),
      metadata: session.metadata,
    };
  }

  /**
   * Converts an UpdateSecuritySessionDto to partial entity input.
   */
  public static fromUpdateDto(dto: UpdateSecuritySessionDto): Partial<SecuritySession> {
    return {
      status: dto.status,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      metadata: dto.metadata,
    } as Partial<SecuritySession>;
  }
}
