/**
 * Check Mapper
 *
 * Maps between QACheck entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { QACheck, QACheckRecord, QACheckJSON } from '../entities/QACheck';
import type { CreateQACheckDto, QACheckResponseDto, UpdateQACheckDto } from '../dto/QACheck.dto';

/**
 * Mapper for converting between QACheck entity and DTOs.
 */
export class CheckMapper {
  /**
   * Converts a QACheck entity to QACheckResponseDto.
   */
  public static toResponse(check: QACheck): QACheckResponseDto {
    return {
      checkId: check.checkId.value,
      title: check.title,
      status: check.status,
      severity: check.severity,
      completedAt: check.completedAt?.toISOString() ?? null,
      metadata: check.metadata,
    };
  }

  /**
   * Converts an array of QACheck entities to QACheckResponseDto array.
   */
  public static toResponseList(checks: QACheck[]): QACheckResponseDto[] {
    return checks.map((check) => this.toResponse(check));
  }

  /**
   * Converts a CreateQACheckDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateQACheckDto): Omit<CreateQACheckDto, never> {
    return {
      checkId: dto.checkId,
      title: dto.title,
      status: dto.status,
      severity: dto.severity,
      completedAt: dto.completedAt,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateQACheckDto to partial entity input.
   */
  public static fromUpdateDto(dto: UpdateQACheckDto): Partial<CreateQACheckDto> {
    return {
      status: dto.status,
      completedAt: dto.completedAt,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateQACheckDto format.
   */
  public static fromRecordToDto(record: QACheckRecord): CreateQACheckDto {
    return {
      checkId: record.check_id,
      title: record.title,
      status: record.status as CreateQACheckDto['status'],
      severity: record.severity as CreateQACheckDto['severity'],
      completedAt: record.completed_at ?? null,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a QACheck entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(check: QACheck): Omit<QACheckRecord, never> {
    return {
      check_id: check.checkId.value,
      title: check.title,
      status: check.status,
      severity: check.severity,
      completed_at: check.completedAt?.toISOString() ?? null,
      metadata: check.metadata,
    };
  }

  /**
   * Converts a QACheck entity to JSON format.
   */
  public static toJSON(check: QACheck): QACheckJSON {
    return check.toJSON();
  }
}
