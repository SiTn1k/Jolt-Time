/**
 * Quest Difficulty Type
 *
 * Defines the difficulty level of a quest.
 */

/**
 * Quest difficulty levels.
 */
export enum QuestDifficulty {
  /** Easy difficulty - 5-15 min completion */
  EASY = 'easy',
  /** Medium difficulty - 15-45 min completion */
  MEDIUM = 'medium',
  /** Hard difficulty - 45-120 min completion */
  HARD = 'hard',
  /** Legendary difficulty - 2-4 hours completion */
  LEGENDARY = 'legendary',
}

/**
 * Difficulty display names.
 */
export const QUEST_DIFFICULTY_DISPLAY: Record<QuestDifficulty, string> = {
  [QuestDifficulty.EASY]: 'Easy',
  [QuestDifficulty.MEDIUM]: 'Medium',
  [QuestDifficulty.HARD]: 'Hard',
  [QuestDifficulty.LEGENDARY]: 'Legendary',
};

/**
 * Difficulty colors for UI (hex codes).
 */
export const QUEST_DIFFICULTY_COLORS: Record<QuestDifficulty, string> = {
  [QuestDifficulty.EASY]: '#22C55E',
  [QuestDifficulty.MEDIUM]: '#3B82F6',
  [QuestDifficulty.HARD]: '#8B5CF6',
  [QuestDifficulty.LEGENDARY]: '#F59E0B',
};

/**
 * Difficulty reward multipliers.
 */
export const QUEST_DIFFICULTY_MULTIPLIERS: Record<QuestDifficulty, number> = {
  [QuestDifficulty.EASY]: 1.0,
  [QuestDifficulty.MEDIUM]: 1.5,
  [QuestDifficulty.HARD]: 2.5,
  [QuestDifficulty.LEGENDARY]: 5.0,
};

/**
 * Returns the recommended player level for a difficulty.
 */
export function getRecommendedLevel(difficulty: QuestDifficulty): number {
  switch (difficulty) {
    case QuestDifficulty.EASY:
      return 1;
    case QuestDifficulty.MEDIUM:
      return 5;
    case QuestDifficulty.HARD:
      return 10;
    case QuestDifficulty.LEGENDARY:
      return 25;
  }
}
