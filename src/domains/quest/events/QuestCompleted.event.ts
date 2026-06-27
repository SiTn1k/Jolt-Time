/**
 * Quest Completed Event
 *
 * Domain event emitted when a player completes a quest.
 */

import type { QuestCategory } from '../types/QuestCategory';
import type { QuestDifficulty } from '../types/QuestDifficulty';
import type { QuestMetadata } from '../types/QuestMetadata';

/**
 * Event data for quest completion.
 */
export interface QuestCompletedEventData {
  /** Quest ID */
  questId: string;
  /** Player profile ID */
  playerProfileId: string;
  /** Quest slug */
  slug: string;
  /** Quest title */
  title: string;
  /** Quest category */
  category: QuestCategory;
  /** Quest difficulty */
  difficulty: QuestDifficulty;
  /** Progress ID */
  progressId: string;
  /** Time taken in seconds */
  timeTakenSeconds: number;
  /** Rewards available to claim */
  rewardDefinition: QuestMetadata['rewardDefinition'];
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for quest completion.
 */
export interface QuestCompletedEvent {
  /** Event type identifier */
  readonly eventType: 'QuestCompleted';
  /** Event data */
  readonly data: QuestCompletedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a QuestCompletedEvent.
 */
export function createQuestCompletedEvent(params: {
  questId: string;
  playerProfileId: string;
  slug: string;
  title: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  progressId: string;
  timeTakenSeconds: number;
  rewardDefinition: QuestMetadata['rewardDefinition'];
}): QuestCompletedEvent {
  return {
    eventType: 'QuestCompleted',
    version: 1,
    data: {
      questId: params.questId,
      playerProfileId: params.playerProfileId,
      slug: params.slug,
      title: params.title,
      category: params.category,
      difficulty: params.difficulty,
      progressId: params.progressId,
      timeTakenSeconds: params.timeTakenSeconds,
      rewardDefinition: params.rewardDefinition,
      occurredAt: new Date(),
    },
  };
}
