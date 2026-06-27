/**
 * IQuestObjective Interface
 *
 * Interface for QuestObjective domain entity.
 */

import type { ObjectiveId } from '../value-objects/ObjectiveId';
import type { QuestId } from '../value-objects/QuestId';
import type { ObjectiveType } from '../types/ObjectiveType';

/**
 * QuestObjective entity interface.
 */
export interface IQuestObjective {
  /** Unique objective identifier */
  readonly objectiveId: ObjectiveId;
  /** Associated quest ID */
  readonly questId: QuestId;
  /** Objective type */
  readonly objectiveType: ObjectiveType;
  /** Target identifier (optional) */
  readonly target: string | null;
  /** Required progress value */
  readonly requiredValue: number;
  /** Additional metadata */
  readonly metadata: Record<string, string | number | boolean>;
  /** Order within quest */
  readonly order: number;

  /**
   * Checks if the objective has a specific target.
   */
  hasTarget: boolean;

  /**
   * Gets the progress required to complete.
   */
  progressRequired: number;
}
