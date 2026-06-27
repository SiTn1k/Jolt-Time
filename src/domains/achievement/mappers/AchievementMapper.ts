/**
 * Achievement Mapper
 *
 * Maps between Achievement entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { Achievement } from '../entities/Achievement';
import type { AchievementRecord } from '../entities/Achievement';
import type { CreateAchievementDto } from '../dto/CreateAchievement.dto';
import type {
  AchievementResponseDto,
  AchievementWithProgressResponseDto,
  AchievementListResponseDto,
  AchievementListWithProgressResponseDto,
} from '../dto/AchievementResponse.dto';
import type { ConditionResponseDto } from '../dto/AchievementCondition.dto';
import type { ProgressResponseDto } from '../dto/AchievementProgress.dto';
import type { AchievementStatus } from '../types/AchievementStatus';

/**
 * Mapper for converting between Achievement entity and DTOs.
 */
export class AchievementMapper {
  /**
   * Converts an Achievement entity to AchievementResponseDto.
   */
  public static toResponse(achievement: Achievement): AchievementResponseDto {
    return {
      achievementId: achievement.achievementId.value,
      slug: achievement.slug.value,
      title: achievement.title,
      description: achievement.description,
      category: achievement.category,
      rarity: achievement.rarity,
      points: achievement.points,
      icon: achievement.icon,
      rewardDefinition: achievement.rewardDefinition,
      isHidden: achievement.isHidden,
      isActive: achievement.isActive,
      metadata: achievement.metadata,
      createdAt: achievement.createdAt.toISOString(),
      updatedAt: achievement.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an Achievement entity to AchievementWithProgressResponseDto.
   */
  public static toWithProgressResponse(
    achievement: Achievement,
    progress?: ProgressResponseDto,
    conditions?: ConditionResponseDto[],
    status?: AchievementStatus,
    completionPercentage?: number
  ): AchievementWithProgressResponseDto {
    const response = this.toResponse(achievement);

    return {
      ...response,
      progress,
      conditions,
      status,
      completionPercentage,
      isComplete: status === 'completed' || status === 'claimed',
      canClaim: status === 'completed',
    };
  }

  /**
   * Converts an Achievement entity to a database record format.
   */
  public static toRecord(achievement: Achievement): AchievementRecord {
    return achievement.toRecord();
  }

  /**
   * Converts a database record to AchievementResponseDto.
   */
  public static fromRecordToDto(record: AchievementRecord): AchievementResponseDto {
    return {
      achievementId: record.achievementId,
      slug: record.slug,
      title: record.title,
      description: record.description,
      category: record.category,
      rarity: record.rarity,
      points: record.points,
      icon: record.icon,
      rewardDefinition: record.rewardDefinition,
      isHidden: record.isHidden,
      isActive: record.isActive,
      metadata: record.metadata,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Converts an array of Achievement entities to AchievementListResponseDto.
   */
  public static toListResponse(achievements: Achievement[], total: number, page: number, pageSize: number): AchievementListResponseDto {
    return {
      achievements: achievements.map((achievement) => this.toResponse(achievement)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts an array of AchievementWithProgressResponseDto to AchievementListWithProgressResponseDto.
   */
  public static toListWithProgressResponse(
    achievements: AchievementWithProgressResponseDto[],
    total: number,
    page: number,
    pageSize: number
  ): AchievementListWithProgressResponseDto {
    return {
      achievements,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
