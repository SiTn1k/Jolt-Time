/**
 * Quest Reset Event
 *
 * Domain event emitted when a quest is reset (e.g., daily/weekly reset).
 */

import type { QuestCategory } from '../types/QuestCategory';
import type { RepeatType } from '../types/RepeatType';

/**
 * Event data for quest reset.
 */
export interface QuestResetEventData {
  /** Quest ID */
  questId: string;
  /** Player profile ID */
  playerProfileId: string;
  /** Quest slug */
  slug: string;
  /** Quest category */
  category: QuestCategory;
  /** Repeat type that triggered reset */
  repeatType: RepeatType;
  /** Previous progress ID (for reference) */
  previousProgressId: string;
  /** New progress ID */
  newProgressId: string;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for quest reset.
 */
export interface QuestResetEvent {
  /** Event type identifier */
  readonly eventType: 'QuestReset';
  /** Event data */
  readonly data: QuestResetEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a QuestResetEvent.
 */
export function createQuestResetEvent(params: {
  questId: string;
  playerProfileId: string;
  slug: string;
  category: QuestCategory;
  repeatType: RepeatType;
  previousProgressId: string;
  newProgressId: string;
}): QuestResetEvent {
  return {
    eventType: 'QuestReset',
    version: 1,
    data: {
      questId: params.questId,
      playerProfileId: params.playerProfileId,
      slug: params.slug,
      category: params.category,
      repeatType: params.repeatType,
      previousProgressId: params.previousProgressId,
      newProgressId: params.newProgressId,
      occurredAt: new Date(),
    },
  };
}
