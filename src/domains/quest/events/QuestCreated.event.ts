/**
 * Quest Created Event
 *
 * Domain event emitted when a new quest is created.
 */

import type { QuestCategory } from '../types/QuestCategory';
import type { QuestDifficulty } from '../types/QuestDifficulty';
import type { RepeatType } from '../types/RepeatType';

/**
 * Event data for quest creation.
 */
export interface QuestCreatedEventData {
  /** Quest ID */
  questId: string;
  /** Quest slug */
  slug: string;
  /** Quest title */
  title: string;
  /** Quest category */
  category: QuestCategory;
  /** Quest difficulty */
  difficulty: QuestDifficulty;
  /** Repeat type */
  repeatType: RepeatType;
  /** Required level */
  requiredLevel: number;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for quest creation.
 */
export interface QuestCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'QuestCreated';
  /** Event data */
  readonly data: QuestCreatedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a QuestCreatedEvent.
 */
export function createQuestCreatedEvent(params: {
  questId: string;
  slug: string;
  title: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  repeatType: RepeatType;
  requiredLevel: number;
}): QuestCreatedEvent {
  return {
    eventType: 'QuestCreated',
    version: 1,
    data: {
      questId: params.questId,
      slug: params.slug,
      title: params.title,
      category: params.category,
      difficulty: params.difficulty,
      repeatType: params.repeatType,
      requiredLevel: params.requiredLevel,
      occurredAt: new Date(),
    },
  };
}
