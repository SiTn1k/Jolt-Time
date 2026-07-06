/**
 * ChecklistMapper
 *
 * Maps between ReleaseChecklist entity and DTOs.
 * No database logic - pure transformation only.
 */

import type {
  ReleaseChecklist,
  ReleaseChecklistRecord,
} from '../entities/ReleaseChecklist';
import type {
  ReleaseChecklistDto,
  ChecklistResponseDto,
  ChecklistListResponseDto,
} from '../dto/Checklist.dto';

/**
 * Mapper for converting between ReleaseChecklist entity and DTOs.
 */
export class ChecklistMapper {
  /**
   * Converts a ReleaseChecklist entity to ReleaseChecklistDto.
   */
  public static toDto(checklist: ReleaseChecklist): ReleaseChecklistDto {
    return {
      checklistId: checklist.checklistId.value,
      title: checklist.title,
      status: checklist.status,
      owner: checklist.owner,
      completedAt: checklist.completedAt?.toISOString() ?? null,
      metadata: checklist.metadata,
      createdAt: checklist.createdAt.toISOString(),
      updatedAt: checklist.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a ReleaseChecklist entity to ChecklistResponseDto.
   */
  public static toResponse(checklist: ReleaseChecklist): ChecklistResponseDto {
    return {
      checklist: this.toDto(checklist),
    };
  }

  /**
   * Converts a ReleaseChecklist entity to a database record format.
   */
  public static toRecord(checklist: ReleaseChecklist): ReleaseChecklistRecord {
    return checklist.toRecord();
  }

  /**
   * Converts a database record to ReleaseChecklistDto.
   */
  public static fromRecordToDto(record: ReleaseChecklistRecord): ReleaseChecklistDto {
    return {
      checklistId: record.checklistId,
      title: record.title,
      status: record.status,
      owner: record.owner,
      completedAt: record.completedAt,
      metadata: record.metadata,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Converts an array of ReleaseChecklist entities to ChecklistListResponseDto.
   */
  public static toListResponse(
    checklists: ReleaseChecklist[],
    total: number,
    page: number,
    pageSize: number
  ): ChecklistListResponseDto {
    return {
      checklists: checklists.map((checklist) => this.toDto(checklist)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
