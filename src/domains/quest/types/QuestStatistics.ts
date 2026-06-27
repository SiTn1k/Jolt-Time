/**
 * Quest Statistics Type
 *
 * Statistics for a player's quest activity.
 */

/**
 * Player quest statistics.
 */
export interface QuestStatistics {
  /** Total quests completed */
  totalCompleted: number;
  /** Total quests claimed */
  totalClaimed: number;
  /** Total quests expired */
  totalExpired: number;
  /** Daily quests completed */
  dailyCompleted: number;
  /** Weekly quests completed */
  weeklyCompleted: number;
  /** Achievement quests completed */
  achievementCompleted: number;
  /** Current daily streak */
  dailyStreak: number;
  /** Longest daily streak */
  longestDailyStreak: number;
  /** Current weekly streak */
  weeklyStreak: number;
  /** Longest weekly streak */
  longestWeeklyStreak: number;
  /** Total coins earned from quests */
  totalCoinsEarned: number;
  /** Total gems earned from quests */
  totalGemsEarned: number;
  /** Total fragments earned from quests */
  totalFragmentsEarned: number;
  /** Total XP earned from quests */
  totalXpEarned: number;
  /** Last quest completed timestamp */
  lastCompletedAt: Date | null;
  /** Last quest claimed timestamp */
  lastClaimedAt: Date | null;
  /** Quest completion by difficulty */
  completedByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
    legendary: number;
  };
}

/**
 * Initial quest statistics with zero values.
 */
export const INITIAL_QUEST_STATISTICS: QuestStatistics = {
  totalCompleted: 0,
  totalClaimed: 0,
  totalExpired: 0,
  dailyCompleted: 0,
  weeklyCompleted: 0,
  achievementCompleted: 0,
  dailyStreak: 0,
  longestDailyStreak: 0,
  weeklyStreak: 0,
  longestWeeklyStreak: 0,
  totalCoinsEarned: 0,
  totalGemsEarned: 0,
  totalFragmentsEarned: 0,
  totalXpEarned: 0,
  lastCompletedAt: null,
  lastClaimedAt: null,
  completedByDifficulty: {
    easy: 0,
    medium: 0,
    hard: 0,
    legendary: 0,
  },
};
