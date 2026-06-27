/**
 * Objective Mapper
 *
 * Maps between QuestObjective entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { QuestObjective } from '../entities/QuestObjective';
import type { QuestObjectiveRecord } from '../entities/QuestObjective';
import type { QuestObjectiveDto, QuestObjectiveResponseDto } from '../dto/QuestObjective.dto';

/**
 * Mapper for converting between QuestObjective entity and DTOs.
 */
export class ObjectiveMapper {
  /**
   * Converts a QuestObjective entity to QuestObjectiveResponseDto.
   */
  public static toResponse(
    objective: QuestObjective,
    currentValue?: number
  ): QuestObjectiveResponseDto {
    const progress = currentValue !== undefined ? currentValue / objective.requiredValue : undefined;
    const isComplete = currentValue !== undefined ? currentValue >= objective.requiredValue : false;

    return {
      objectiveId: objective.objectiveId.value,
      questId: objective.questId.value,
      objectiveType: objective.objectiveType,
      target: objective.target,
      requiredValue: objective.requiredValue,
      currentValue,
      progress,
      metadata: objective.metadata,
      order: objective.order,
      isComplete,
    };
  }

  /**
   * Converts a QuestObjective entity to a database record format.
   */
  public static toRecord(objective: QuestObjective): QuestObjectiveRecord {
    return objective.toRecord();
  }

  /**
   * Converts a database record to QuestObjectiveResponseDto.
   */
  public static fromRecordToDto(record: QuestObjectiveRecord): QuestObjectiveResponseDto {
    return {
      objectiveId: record.objectiveId,
      questId: record.questId,
      objectiveType: record.objectiveType,
      target: record.target,
      requiredValue: record.requiredValue,
      metadata: record.metadata,
      order: record.order,
    };
  }

  /**
   * Converts a QuestObjectiveDto to entity input.
   */
  public static fromDtoToInput(dto: QuestObjectiveDto): Omit<QuestObjectiveDto, never> {
    return {
      objectiveType: dto.objectiveType,
      target: dto.target,
      requiredValue: dto.requiredValue,
      order: dto.order,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an array of QuestObjective entities to QuestObjectiveResponseDto array.
   */
  public static toResponseList(objectives: QuestObjective[]): QuestObjectiveResponseDto[] {
    return objectives.map((objective) => this.toResponse(objective));
  }
}
