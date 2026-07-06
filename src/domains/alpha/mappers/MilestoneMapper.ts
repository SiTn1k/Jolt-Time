/**
 * Milestone Mapper
 *
 * Maps between AlphaMilestone entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { AlphaMilestone, AlphaMilestoneRecord } from '../entities/AlphaMilestone';
import type {
  MilestoneDto,
  MilestoneResponseDto,
  MilestoneListResponseDto,
} from '../dto/Milestone.dto';

/**
 * Mapper for converting between AlphaMilestone entity and DTOs.
 */
export class MilestoneMapper {
  /**
   * Converts an AlphaMilestone entity to MilestoneDto.
   */
  public static toDto(milestone: AlphaMilestone): MilestoneDto {
    return {
      milestoneId: milestone.milestoneId.value,
      title: milestone.title,
      status: milestone.status,
      targetDate: milestone.targetDate?.toISOString() ?? null,
      completedAt: milestone.completedAt?.toISOString() ?? null,
      metadata: milestone.metadata,
      createdAt: milestone.createdAt.toISOString(),
      updatedAt: milestone.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an AlphaMilestone entity to MilestoneResponseDto.
   */
  public static toResponse(milestone: AlphaMilestone): MilestoneResponseDto {
    return {
      milestone: this.toDto(milestone),
    };
  }

  /**
   * Converts an AlphaMilestone entity to a database record format.
   */
  public static toRecord(milestone: AlphaMilestone): AlphaMilestoneRecord {
    return milestone.toRecord();
  }

  /**
   * Converts a database record to MilestoneDto.
   */
  public static fromRecordToDto(record: AlphaMilestoneRecord): MilestoneDto {
    return {
      milestoneId: record.milestoneId,
      title: record.title,
      status: record.status,
      targetDate: record.targetDate,
      completedAt: record.completedAt,
      metadata: record.metadata,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Converts an array of AlphaMilestone entities to MilestoneListResponseDto.
   */
  public static toListResponse(
    milestones: AlphaMilestone[],
    total: number,
    page: number,
    pageSize: number
  ): MilestoneListResponseDto {
    return {
      milestones: milestones.map((milestone) => this.toDto(milestone)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
