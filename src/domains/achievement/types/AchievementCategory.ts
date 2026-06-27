/**
 * Achievement Category Type
 *
 * Defines the category of an achievement.
 */

/**
 * Achievement categories.
 */
export enum AchievementCategory {
  /** Combat-related achievements */
  COMBAT = 'combat',
  /** Collection-related achievements */
  COLLECTION = 'collection',
  /** Exploration achievements */
  EXPLORATION = 'exploration',
  /** Social interaction achievements */
  SOCIAL = 'social',
  /** Economic/Trading achievements */
  ECONOMY = 'economy',
  /** Progression achievements */
  PROGRESSION = 'progression',
  /** Time-based achievements */
  TEMPORAL = 'temporal',
  /** Special/Event achievements */
  SPECIAL = 'special',
}

/**
 * Category display names.
 */
export const ACHIEVEMENT_CATEGORY_DISPLAY: Record<AchievementCategory, string> = {
  [AchievementCategory.COMBAT]: 'Combat',
  [AchievementCategory.COLLECTION]: 'Collection',
  [AchievementCategory.EXPLORATION]: 'Exploration',
  [AchievementCategory.SOCIAL]: 'Social',
  [AchievementCategory.ECONOMY]: 'Economy',
  [AchievementCategory.PROGRESSION]: 'Progression',
  [AchievementCategory.TEMPORAL]: 'Temporal',
  [AchievementCategory.SPECIAL]: 'Special',
};

/**
 * Checks if a category is a special/limited category.
 */
export function isSpecialCategory(category: AchievementCategory): boolean {
  return category === AchievementCategory.SPECIAL || category === AchievementCategory.TEMPORAL;
}
