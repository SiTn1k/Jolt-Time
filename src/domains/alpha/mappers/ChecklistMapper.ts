/**
 * Checklist Mapper
 *
 * Maps between AlphaChecklist entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { AlphaChecklist, AlphaChecklistRecord } from '../entities/AlphaChecklist';
import type {
  ChecklistDto,
  ChecklistResponseDto,
  ChecklistListResponseDto,
} from '../dto/Checklist.dto';

/**
 * Mapper for converting between AlphaChecklist entity and DTOs.
 */
export class ChecklistMapper {
  /**
   * Converts an AlphaChecklist entity to ChecklistDto.
   */
  public static toDto(checklist: AlphaChecklist): ChecklistDto {
    return {
      checklistId: checklist.checklistId.value,
      title: checklist.title,
      status: checklist.status,
      completedAt: checklist.completedAt?.toISOString() ?? null,
      owner: checklist.owner,
      metadata: checklist.metadata,
      createdAt: checklist.createdAt.toISOString(),
      updatedAt: checklist.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an AlphaChecklist entity to ChecklistResponseDto.
   */
  public static toResponse(checklist: AlphaChecklist): ChecklistResponseDto {
    return {
      checklist: this.toDto(checklist),
    };
  }

  /**
   * Converts an AlphaChecklist entity to a database record format.
   */
  public static toRecord(checklist: AlphaChecklist): AlphaChecklistRecord {
    return checklist.toRecord();
  }

  /**
   * Converts a database record to ChecklistDto.
   */
  public static fromRecordToDto(record: AlphaChecklistRecord): ChecklistDto {
    return {
      checklistId: record.checklistId,
      title: record.title,
      status: record.status,
      completedAt: record.completedAt,
      owner: record.owner,
      metadata: record.metadata,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Converts an array of AlphaChecklist entities to ChecklistListResponseDto.
   */
  public static toListResponse(
    checklists: AlphaChecklist[],
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
