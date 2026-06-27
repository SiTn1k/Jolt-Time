/**
 * Achievement Statistics Type
 *
 * Tracks achievement-related statistics for a player.
 */

/**
 * Achievement completion statistics.
 */
export interface AchievementStatistics {
  /** Total achievements unlocked */
  totalUnlocked: number;
  /** Total achievements claimed */
  totalClaimed: number;
  /** Total points earned */
  totalPoints: number;
  /** Achievements by category */
  byCategory: Record<string, number>;
  /** Achievements by rarity */
  byRarity: Record<string, number>;
  /** Current streak days */
  currentStreak: number;
  /** Longest streak days */
  longestStreak: number;
  /** Last achievement claim date */
  lastClaimedAt: string | null;
}

/**
 * Initial achievement statistics.
 */
export const INITIAL_ACHIEVEMENT_STATISTICS: AchievementStatistics = {
  totalUnlocked: 0,
  totalClaimed: 0,
  totalPoints: 0,
  byCategory: {},
  byRarity: {},
  currentStreak: 0,
  longestStreak: 0,
  lastClaimedAt: null,
};

/**
 * Calculates completion percentage for a category.
 */
export function calculateCategoryCompletion(
  statistics: AchievementStatistics,
  category: string,
  totalInCategory: number
): number {
  const unlocked = statistics.byCategory[category] ?? 0;
  if (totalInCategory <= 0) {
    return 0;
  }
  return Math.min(1, unlocked / totalInCategory);
}
