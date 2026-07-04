/**
 * Actor Mapper
 *
 * Maps between AuditActor entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { AuditActor, AuditActorRecord } from '../entities/AuditActor';
import type { CreateAuditActorDto, AuditActorResponseDto } from '../dto/AuditActor.dto';

/**
 * Mapper for converting between AuditActor entity and DTOs.
 */
export class ActorMapper {
  /**
   * Converts an AuditActor entity to AuditActorResponseDto.
   */
  public static toResponse(actor: AuditActor): AuditActorResponseDto {
    return {
      actorId: actor.actorId.value,
      actorType: actor.actorType,
      displayName: actor.displayName,
      metadata: actor.metadata,
    };
  }

  /**
   * Converts an array of AuditActor entities to AuditActorResponseDto array.
   */
  public static toResponseList(actors: AuditActor[]): AuditActorResponseDto[] {
    return actors.map((actor) => this.toResponse(actor));
  }

  /**
   * Converts a CreateAuditActorDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateAuditActorDto): Omit<CreateAuditActorDto, never> {
    return {
      actorId: dto.actorId,
      actorType: dto.actorType,
      displayName: dto.displayName,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateAuditActorDto format.
   */
  public static fromRecordToDto(record: AuditActorRecord): CreateAuditActorDto {
    return {
      actorId: record.actor_id,
      actorType: record.actor_type as CreateAuditActorDto['actorType'],
      displayName: record.display_name,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an AuditActor entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(actor: AuditActor): Omit<AuditActorRecord, never> {
    return {
      actor_id: actor.actorId.value,
      actor_type: actor.actorType,
      display_name: actor.displayName,
      metadata: actor.metadata,
    };
  }
}
