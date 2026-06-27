/**
 * IQuest Interface
 *
 * Interface for Quest domain entity.
 */

import type { QuestId } from '../value-objects/QuestId';
import type { QuestSlug } from '../value-objects/QuestSlug';
import type { QuestCategory } from '../types/QuestCategory';
import type { QuestDifficulty } from '../types/QuestDifficulty';
import type { RepeatType } from '../types/RepeatType';
import type { QuestMetadata } from '../types/QuestMetadata';

/**
 * Quest entity interface.
 */
export interface IQuest {
  /** Unique quest identifier */
  readonly questId: QuestId;
  /** URL-friendly identifier */
  readonly slug: QuestSlug;
  /** Quest title */
  readonly title: string;
  /** Quest description */
  readonly description: string;
  /** Quest category */
  readonly category: QuestCategory;
  /** Quest difficulty */
  readonly difficulty: QuestDifficulty;
  /** Repeat type */
  readonly repeatType: RepeatType;
  /** Required player level */
  readonly requiredLevel: number;
  /** Required research IDs */
  readonly requiredResearch: string[];
  /** Reward definition */
  readonly rewardDefinition: QuestMetadata['rewardDefinition'];
  /** Is active */
  readonly isActive: boolean;
  /** Additional metadata */
  readonly metadata: QuestMetadata;
  /** Creation timestamp */
  readonly createdAt: Date;
  /** Last update timestamp */
  readonly updatedAt: Date;

  /**
   * Checks if the quest is a repeating quest.
   */
  isRepeating: boolean;

  /**
   * Checks if the quest has any prerequisites.
   */
  hasPrerequisites: boolean;

  /**
   * Checks if the quest is available for a player level.
   */
  isAvailableForLevel(level: number): boolean;
}
