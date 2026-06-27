/**
 * Condition Mapper
 *
 * Maps between AchievementCondition entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { AchievementCondition } from '../entities/AchievementCondition';
import type { AchievementConditionRecord } from '../entities/AchievementCondition';
import type { CreateConditionDto, ConditionResponseDto } from '../dto/AchievementCondition.dto';

/**
 * Mapper for converting between AchievementCondition entity and DTOs.
 */
export class ConditionMapper {
  /**
   * Converts an AchievementCondition entity to ConditionResponseDto.
   */
  public static toResponse(condition: AchievementCondition): ConditionResponseDto {
    return {
      conditionId: condition.conditionId.value,
      achievementId: condition.achievementId.value,
      conditionType: condition.conditionType,
      target: condition.target,
      requiredValue: condition.requiredValue,
      metadata: condition.metadata,
      order: condition.order,
    };
  }

  /**
   * Converts an AchievementCondition entity to a database record format.
   */
  public static toRecord(condition: AchievementCondition): AchievementConditionRecord {
    return condition.toRecord();
  }

  /**
   * Converts a database record to ConditionResponseDto.
   */
  public static fromRecordToDto(record: AchievementConditionRecord): ConditionResponseDto {
    return {
      conditionId: record.conditionId,
      achievementId: record.achievementId,
      conditionType: record.conditionType,
      target: record.target,
      requiredValue: record.requiredValue,
      metadata: record.metadata,
      order: record.order,
    };
  }

  /**
   * Converts an array of AchievementCondition entities to ConditionResponseDto array.
   */
  public static toResponseArray(conditions: AchievementCondition[]): ConditionResponseDto[] {
    return conditions.map((condition) => this.toResponse(condition));
  }
}
