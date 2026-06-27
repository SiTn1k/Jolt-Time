/**
 * Quest DTOs Index
 *
 * Exports all quest domain DTOs.
 */

export type { CreateQuestDto } from './CreateQuest.dto';
export { CREATE_QUEST_VALIDATION } from './CreateQuest.dto';

export type { QuestObjectiveDto, QuestObjectiveResponseDto } from './QuestObjective.dto';

export type { QuestProgressDto, QuestProgressResponseDto } from './QuestProgress.dto';

export type {
  QuestResponseDto,
  QuestWithProgressResponseDto,
  QuestListResponseDto,
  QuestListWithProgressResponseDto,
} from './QuestResponse.dto';
