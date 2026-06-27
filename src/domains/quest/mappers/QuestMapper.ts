/**
 * Quest Mapper
 *
 * Maps between Quest entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { Quest } from '../entities/Quest';
import type { QuestRecord } from '../entities/Quest';
import type { CreateQuestDto } from '../dto/CreateQuest.dto';
import type {
  QuestResponseDto,
  QuestWithProgressResponseDto,
  QuestListResponseDto,
  QuestListWithProgressResponseDto,
} from '../dto/QuestResponse.dto';
import type { QuestObjectiveResponseDto } from '../dto/QuestObjective.dto';
import type { QuestProgressResponseDto } from '../dto/QuestProgress.dto';
import type { QuestStatus } from '../types/QuestStatus';

/**
 * Mapper for converting between Quest entity and DTOs.
 */
export class QuestMapper {
  /**
   * Converts a Quest entity to QuestResponseDto.
   */
  public static toResponse(quest: Quest): QuestResponseDto {
    return {
      questId: quest.questId.value,
      slug: quest.slug.value,
      title: quest.title,
      description: quest.description,
      category: quest.category,
      difficulty: quest.difficulty,
      repeatType: quest.repeatType,
      requiredLevel: quest.requiredLevel,
      requiredResearch: quest.requiredResearch,
      rewardDefinition: quest.rewardDefinition,
      isActive: quest.isActive,
      metadata: quest.metadata,
      createdAt: quest.createdAt.toISOString(),
      updatedAt: quest.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a Quest entity to QuestWithProgressResponseDto.
   */
  public static toWithProgressResponse(
    quest: Quest,
    progress?: QuestProgressResponseDto,
    objectives?: QuestObjectiveResponseDto[],
    status?: QuestStatus
  ): QuestWithProgressResponseDto {
    const response = this.toResponse(quest);

    return {
      ...response,
      progress,
      objectives,
      status,
      isAvailable: quest.isAvailableForLevel(quest.requiredLevel),
      isComplete: progress ? status === 'completed' || status === 'claimed' : false,
      canClaim: progress ? status === 'completed' : false,
    };
  }

  /**
   * Converts a Quest entity to a database record format.
   */
  public static toRecord(quest: Quest): QuestRecord {
    return quest.toRecord();
  }

  /**
   * Converts a database record to Quest entity input.
   */
  public static fromRecordToDto(record: QuestRecord): QuestResponseDto {
    return {
      questId: record.questId,
      slug: record.slug,
      title: record.title,
      description: record.description,
      category: record.category,
      difficulty: record.difficulty,
      repeatType: record.repeatType,
      requiredLevel: record.requiredLevel,
      requiredResearch: record.requiredResearch,
      rewardDefinition: record.rewardDefinition,
      isActive: record.isActive,
      metadata: record.metadata,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Converts an array of Quest entities to QuestListResponseDto.
   */
  public static toListResponse(quests: Quest[], total: number, page: number, pageSize: number): QuestListResponseDto {
    return {
      quests: quests.map((quest) => this.toResponse(quest)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts an array of QuestWithProgressResponseDto to QuestListWithProgressResponseDto.
   */
  public static toListWithProgressResponse(
    quests: QuestWithProgressResponseDto[],
    total: number,
    page: number,
    pageSize: number
  ): QuestListWithProgressResponseDto {
    return {
      quests,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
