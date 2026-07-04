/**
 * Audit Mapper
 *
 * Maps between AuditRecord entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { AuditRecord, AuditRecordRecord } from '../entities/AuditRecord';
import type { CreateAuditRecordDto, AuditRecordResponseDto } from '../dto/AuditRecord.dto';

/**
 * Mapper for converting between AuditRecord entity and DTOs.
 */
export class AuditMapper {
  /**
   * Converts an AuditRecord entity to AuditRecordResponseDto.
   */
  public static toResponse(record: AuditRecord): AuditRecordResponseDto {
    return {
      auditId: record.auditId.value,
      actorId: record.actorId.value,
      actorType: record.actorType,
      action: record.action,
      targetType: record.targetType,
      targetId: record.targetId,
      categoryId: record.categoryId?.value ?? null,
      result: record.result,
      createdAt: record.createdAt.toISOString(),
      metadata: record.metadata,
    };
  }

  /**
   * Converts an array of AuditRecord entities to AuditRecordResponseDto array.
   */
  public static toResponseList(records: AuditRecord[]): AuditRecordResponseDto[] {
    return records.map((record) => this.toResponse(record));
  }

  /**
   * Converts a CreateAuditRecordDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateAuditRecordDto): Omit<CreateAuditRecordDto, never> {
    return {
      actorId: dto.actorId,
      actorType: dto.actorType,
      action: dto.action,
      targetType: dto.targetType,
      targetId: dto.targetId,
      categoryId: dto.categoryId,
      result: dto.result,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateAuditRecordDto format.
   */
  public static fromRecordToDto(record: AuditRecordRecord): CreateAuditRecordDto {
    return {
      actorId: record.actor_id,
      actorType: record.actor_type as CreateAuditRecordDto['actorType'],
      action: record.action as CreateAuditRecordDto['action'],
      targetType: record.target_type,
      targetId: record.target_id,
      categoryId: record.category_id ?? undefined,
      result: record.result as CreateAuditRecordDto['result'],
      metadata: record.metadata,
    };
  }

  /**
   * Converts an AuditRecord entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(record: AuditRecord): Omit<AuditRecordRecord, never> {
    return {
      audit_id: record.auditId.value,
      actor_id: record.actorId.value,
      actor_type: record.actorType,
      action: record.action,
      target_type: record.targetType,
      target_id: record.targetId,
      category_id: record.categoryId?.value ?? null,
      result: record.result,
      created_at: record.createdAt.toISOString(),
      metadata: record.metadata,
    };
  }
}
