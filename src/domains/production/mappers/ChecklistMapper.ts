/**
 * Checklist Mapper
 *
 * Maps between ProductionChecklist entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type {
  ProductionChecklist,
  ProductionChecklistRecord,
} from '../entities/ProductionChecklist';
import type {
  ChecklistDto,
  ChecklistResponseDto,
  ChecklistListResponseDto,
} from '../dto/Checklist.dto';

/**
 * Mapper for converting between ProductionChecklist entity and DTOs.
 */
export class ChecklistMapper {
  /**
   * Converts a ProductionChecklist entity to ChecklistDto.
   */
  public static toDto(checklist: ProductionChecklist): ChecklistDto {
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
   * Converts a ProductionChecklist entity to ChecklistResponseDto.
   */
  public static toResponse(checklist: ProductionChecklist): ChecklistResponseDto {
    return {
      checklist: this.toDto(checklist),
    };
  }

  /**
   * Converts a ProductionChecklist entity to a database record format.
   */
  public static toRecord(checklist: ProductionChecklist): ProductionChecklistRecord {
    return checklist.toRecord();
  }

  /**
   * Converts a database record to ChecklistDto.
   */
  public static fromRecordToDto(record: ProductionChecklistRecord): ChecklistDto {
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
   * Converts an array of ProductionChecklist entities to ChecklistListResponseDto.
   */
  public static toListResponse(
    checklists: ProductionChecklist[],
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
