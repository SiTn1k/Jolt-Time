/**
 * Progress Mapper
 *
 * Maps between QuestProgress entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { QuestProgress } from '../entities/QuestProgress';
import type { QuestProgressRecord } from '../entities/QuestProgress';
import type { QuestProgressDto, QuestProgressResponseDto } from '../dto/QuestProgress.dto';
import { isCompletedStatus } from '../types/QuestStatus';

/**
 * Mapper for converting between QuestProgress entity and DTOs.
 */
export class ProgressMapper {
  /**
   * Converts a QuestProgress entity to QuestProgressResponseDto.
   */
  public static toResponse(progress: QuestProgress): QuestProgressResponseDto {
    return {
      progressId: progress.progressId,
      playerProfileId: progress.playerProfileId,
      questId: progress.questId,
      status: progress.status,
      currentValue: progress.currentValue,
      completedAt: progress.completedAt?.toISOString() ?? null,
      claimedAt: progress.claimedAt?.toISOString() ?? null,
      startedAt: progress.startedAt.toISOString(),
      updatedAt: progress.updatedAt.toISOString(),
      isClaimable: progress.isClaimable,
      metadata: progress.metadata,
    };
  }

  /**
   * Converts a QuestProgress entity to a database record format.
   */
  public static toRecord(progress: QuestProgress): QuestProgressRecord {
    return progress.toRecord();
  }

  /**
   * Converts a database record to QuestProgressResponseDto.
   */
  public static fromRecordToDto(record: QuestProgressRecord): QuestProgressResponseDto {
    return {
      progressId: record.progressId,
      playerProfileId: record.playerProfileId,
      questId: record.questId,
      status: record.status,
      currentValue: record.currentValue,
      completedAt: record.completedAt,
      claimedAt: record.claimedAt,
      startedAt: record.startedAt,
      updatedAt: record.updatedAt,
      isClaimable: record.status === 'completed',
      metadata: record.metadata,
    };
  }

  /**
   * Converts a QuestProgressDto to entity input.
   */
  public static fromDtoToInput(dto: QuestProgressDto): Omit<QuestProgressDto, never> {
    return {
      playerProfileId: dto.playerProfileId,
      questId: dto.questId,
      currentValue: dto.currentValue,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an array of QuestProgress entities to QuestProgressResponseDto array.
   */
  public static toResponseList(progressList: QuestProgress[]): QuestProgressResponseDto[] {
    return progressList.map((progress) => this.toResponse(progress));
  }
}
