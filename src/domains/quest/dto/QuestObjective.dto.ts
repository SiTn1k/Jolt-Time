/**
 * Quest Objective DTO
 *
 * Data transfer object for quest objectives.
 */

import type { ObjectiveType } from '../types/ObjectiveType';

/**
 * Input for creating a quest objective.
 */
export interface QuestObjectiveDto {
  /** Objective type */
  objectiveType: ObjectiveType;
  /** Target identifier (e.g., artifact ID, era ID) */
  target?: string | null;
  /** Required progress value */
  requiredValue: number;
  /** Order within the quest */
  order?: number;
  /** Additional metadata */
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Response DTO for quest objective.
 */
export interface QuestObjectiveResponseDto {
  objectiveId: string;
  questId: string;
  objectiveType: ObjectiveType;
  target: string | null;
  requiredValue: number;
  currentValue?: number;
  progress?: number;
  metadata: Record<string, string | number | boolean>;
  order: number;
  isComplete?: boolean;
}
