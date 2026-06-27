/**
 * Achievement DTOs Index
 *
 * Exports all achievement domain DTOs.
 */

export type { CreateAchievementDto } from './CreateAchievement.dto';
export { CREATE_ACHIEVEMENT_VALIDATION } from './CreateAchievement.dto';

export type { CreateConditionDto, ConditionResponseDto } from './AchievementCondition.dto';

export type { CreateProgressDto, ProgressResponseDto, ProgressWithPercentageDto } from './AchievementProgress.dto';

export type {
  AchievementResponseDto,
  AchievementWithProgressResponseDto,
  AchievementListResponseDto,
  AchievementListWithProgressResponseDto,
  AchievementStatisticsResponseDto,
} from './AchievementResponse.dto';
