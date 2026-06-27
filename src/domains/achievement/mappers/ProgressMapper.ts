/**
 * Progress Mapper
 *
 * Maps between AchievementProgress entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { AchievementProgress } from '../entities/AchievementProgress';
import type { AchievementProgressRecord } from '../entities/AchievementProgress';
import type { CreateProgressDto, ProgressResponseDto, ProgressWithPercentageDto } from '../dto/AchievementProgress.dto';

/**
 * Mapper for converting between AchievementProgress entity and DTOs.
 */
export class ProgressMapper {
  /**
   * Converts an AchievementProgress entity to ProgressResponseDto.
   */
  public static toResponse(progress: AchievementProgress): ProgressResponseDto {
    return {
      progressId: progress.progressId,
      playerProfileId: progress.playerProfileId,
      achievementId: progress.achievementId,
      status: progress.status,
      currentValue: progress.currentValue,
      completedAt: progress.completedAt?.toISOString() ?? null,
      claimedAt: progress.claimedAt?.toISOString() ?? null,
      metadata: progress.metadata,
      startedAt: progress.startedAt.toISOString(),
      updatedAt: progress.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an AchievementProgress entity to ProgressWithPercentageDto.
   */
  public static toWithPercentageResponse(
    progress: AchievementProgress,
    targetValue: number
  ): ProgressWithPercentageDto {
    const response = this.toResponse(progress);
    const completionPercentage = progress.getCompletionPercentage(targetValue);
    const isComplete = progress.isCompleteForTarget(targetValue);

    return {
      ...response,
      completionPercentage,
      targetValue,
      isComplete,
    };
  }

  /**
   * Converts an AchievementProgress entity to a database record format.
   */
  public static toRecord(progress: AchievementProgress): AchievementProgressRecord {
    return progress.toRecord();
  }

  /**
   * Converts a database record to ProgressResponseDto.
   */
  public static fromRecordToDto(record: AchievementProgressRecord): ProgressResponseDto {
    return {
      progressId: record.progressId,
      playerProfileId: record.playerProfileId,
      achievementId: record.achievementId,
      status: record.status,
      currentValue: record.currentValue,
      completedAt: record.completedAt,
      claimedAt: record.claimedAt,
      metadata: record.metadata,
      startedAt: record.startedAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Converts an array of AchievementProgress entities to ProgressResponseDto array.
   */
  public static toResponseArray(progress: AchievementProgress[]): ProgressResponseDto[] {
    return progress.map((p) => this.toResponse(p));
  }
}
