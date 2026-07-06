/**
 * ChecklistMapper
 *
 * Maps between HardeningChecklist entity and DTOs.
 * No database logic - pure transformation only.
 */

import type { HardeningChecklist, HardeningChecklistRecord } from '../entities/HardeningChecklist';
import type {
  HardeningChecklistDto,
  HardeningChecklistResponseDto,
  HardeningChecklistListResponseDto,
} from '../dto/HardeningChecklist.dto';

/**
 * Mapper for converting between HardeningChecklist entity and DTOs.
 */
export class ChecklistMapper {
  /**
   * Converts a HardeningChecklist entity to HardeningChecklistDto.
   */
  public static toDto(checklist: HardeningChecklist): HardeningChecklistDto {
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
   * Converts a HardeningChecklist entity to HardeningChecklistResponseDto.
   */
  public static toResponse(checklist: HardeningChecklist): HardeningChecklistResponseDto {
    return {
      checklist: this.toDto(checklist),
    };
  }

  /**
   * Converts a HardeningChecklist entity to a database record format.
   */
  public static toRecord(checklist: HardeningChecklist): HardeningChecklistRecord {
    return checklist.toRecord();
  }

  /**
   * Converts a database record to HardeningChecklistDto.
   */
  public static fromRecordToDto(record: HardeningChecklistRecord): HardeningChecklistDto {
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
   * Converts an array of HardeningChecklist entities to HardeningChecklistListResponseDto.
   */
  public static toListResponse(
    checklists: HardeningChecklist[],
    total: number,
    page: number,
    pageSize: number
  ): HardeningChecklistListResponseDto {
    return {
      checklists: checklists.map((checklist) => this.toDto(checklist)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
