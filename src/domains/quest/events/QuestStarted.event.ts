/**
 * Quest Started Event
 *
 * Domain event emitted when a player starts a quest.
 */

import type { QuestCategory } from '../types/QuestCategory';
import type { QuestDifficulty } from '../types/QuestDifficulty';

/**
 * Event data for quest start.
 */
export interface QuestStartedEventData {
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
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for quest start.
 */
export interface QuestStartedEvent {
  /** Event type identifier */
  readonly eventType: 'QuestStarted';
  /** Event data */
  readonly data: QuestStartedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a QuestStartedEvent.
 */
export function createQuestStartedEvent(params: {
  questId: string;
  playerProfileId: string;
  slug: string;
  title: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  progressId: string;
}): QuestStartedEvent {
  return {
    eventType: 'QuestStarted',
    version: 1,
    data: {
      questId: params.questId,
      playerProfileId: params.playerProfileId,
      slug: params.slug,
      title: params.title,
      category: params.category,
      difficulty: params.difficulty,
      progressId: params.progressId,
      occurredAt: new Date(),
    },
  };
}
