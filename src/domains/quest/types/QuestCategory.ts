/**
 * Quest Category Type
 *
 * Defines the category of a quest.
 */

/**
 * Quest categories.
 */
export enum QuestCategory {
  /** Main story progression quests */
  MAIN = 'main',
  /** Daily quests that reset */
  DAILY = 'daily',
  /** Weekly quests that reset */
  WEEKLY = 'weekly',
  /** Achievement quests for milestones */
  ACHIEVEMENT = 'achievement',
  /** Limited-time event quests */
  EVENT = 'event',
  /** Era-specific quests */
  ERA = 'era',
}

/**
 * Category display names.
 */
export const QUEST_CATEGORY_DISPLAY: Record<QuestCategory, string> = {
  [QuestCategory.MAIN]: 'Main Story',
  [QuestCategory.DAILY]: 'Daily Quest',
  [QuestCategory.WEEKLY]: 'Weekly Quest',
  [QuestCategory.ACHIEVEMENT]: 'Achievement',
  [QuestCategory.EVENT]: 'Event Quest',
  [QuestCategory.ERA]: 'Era Quest',
};

/**
 * Checks if a category is a repeating quest type.
 */
export function isRepeatingCategory(category: QuestCategory): boolean {
  return category === QuestCategory.DAILY || category === QuestCategory.WEEKLY;
}
