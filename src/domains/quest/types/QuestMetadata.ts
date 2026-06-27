/**
 * Quest Metadata Type
 *
 * Additional metadata associated with a quest.
 */

import { QuestCategory } from './QuestCategory';
import { QuestDifficulty } from './QuestDifficulty';
import { ObjectiveType } from './ObjectiveType';
import { RepeatType } from './RepeatType';

/**
 * Reward definition within quest metadata.
 */
export interface QuestRewardDefinition {
  /** Currency rewards */
  coins?: number;
  gems?: number;
  energy?: number;
  /** Experience points */
  xp?: number;
  /** Artifact fragments */
  fragments?: number;
  /** Specific artifact ID */
  artifactId?: string;
  /** Badge ID */
  badgeId?: string;
  /** Frame ID */
  frameId?: string;
  /** Title ID */
  titleId?: string;
  /** Event token ID */
  eventTokenId?: string;
  /** Custom rewards */
  customRewards?: Array<{
    type: string;
    id: string;
    quantity: number;
  }>;
}

/**
 * Quest requirement metadata.
 */
export interface QuestRequirement {
  /** Minimum player level required */
  requiredLevel?: number;
  /** Required research completion */
  requiredResearch?: string[];
  /** Required quest completion */
  requiredQuests?: string[];
  /** Required artifacts */
  requiredArtifacts?: string[];
  /** Required era */
  requiredEra?: string;
  /** Previous chapter requirement */
  previousChapter?: string;
}

/**
 * Quest tracking metadata for UI.
 */
export interface QuestTracking {
  /** Show progress bar */
  showProgressBar: boolean;
  /** Show percentage */
  showPercentage: boolean;
  /** Auto claim when complete */
  autoClaim: boolean;
  /** Notification on complete */
  notifyOnComplete: boolean;
}

/**
 * Quest limit metadata.
 */
export interface QuestLimit {
  /** Maximum attempts (null = unlimited) */
  maxAttempts: number | null;
  /** Time limit in seconds (null = unlimited) */
  timeLimitSeconds: number | null;
  /** Start timestamp for time limit */
  startTimeLimit?: Date;
}

/**
 * Complete quest metadata.
 */
export interface QuestMetadata {
  /** Quest category */
  category: QuestCategory;
  /** Quest difficulty */
  difficulty: QuestDifficulty;
  /** Repeat type */
  repeatType: RepeatType;
  /** Objectives */
  objectives?: Array<{
    type: ObjectiveType;
    target?: string;
    requiredValue: number;
    order: number;
  }>;
  /** Reward definition */
  rewardDefinition: QuestRewardDefinition;
  /** Requirements */
  requirements?: QuestRequirement;
  /** Tracking settings */
  tracking?: QuestTracking;
  /** Limits */
  limits?: QuestLimit;
  /** Chapter for main quests */
  chapter?: string;
  /** Era for era quests */
  era?: string;
  /** Event ID for event quests */
  eventId?: string;
  /** Custom metadata extras */
  extras?: Record<string, string | number | boolean>;
}

/**
 * Creates default quest metadata.
 */
export function createDefaultQuestMetadata(
  category: QuestCategory,
  difficulty: QuestDifficulty,
  rewardDefinition: QuestRewardDefinition
): QuestMetadata {
  return {
    category,
    difficulty,
    repeatType: category === QuestCategory.DAILY
      ? RepeatType.DAILY
      : category === QuestCategory.WEEKLY
        ? RepeatType.WEEKLY
        : RepeatType.NONE,
    rewardDefinition,
    tracking: {
      showProgressBar: true,
      showPercentage: true,
      autoClaim: false,
      notifyOnComplete: true,
    },
    limits: {
      maxAttempts: null,
      timeLimitSeconds: null,
    },
  };
}
