/**
 * Player Statistics Type
 *
 * Aggregated gameplay statistics for a player profile.
 * Contains all-time and periodic stats.
 */

/**
 * Player gameplay statistics.
 */
export interface PlayerStatistics {
  /** Total expeditions completed */
  expeditionsCompleted: number;

  /** Total artifacts collected */
  artifactsCollected: number;

  /** Total quests completed */
  questsCompleted: number;

  /** Total PVP battles won */
  pvpBattlesWon: number;

  /** Total PVP battles lost */
  pvpBattlesLost: number;

  /** Total energy spent */
  energySpent: number;

  /** Total play time in seconds */
  playTimeSeconds: number;

  /** Current streak days */
  currentStreak: number;

  /** Longest streak days */
  longestStreak: number;

  /** Total rewards claimed */
  rewardsClaimed: number;

  /** Total discoveries made */
  discoveriesMade: number;

  /** Total historical facts learned */
  factsLearned: number;
}

/**
 * Initial statistics for new players.
 */
export const INITIAL_PLAYER_STATISTICS: PlayerStatistics = {
  expeditionsCompleted: 0,
  artifactsCollected: 0,
  questsCompleted: 0,
  pvpBattlesWon: 0,
  pvpBattlesLost: 0,
  energySpent: 0,
  playTimeSeconds: 0,
  currentStreak: 0,
  longestStreak: 0,
  rewardsClaimed: 0,
  discoveriesMade: 0,
  factsLearned: 0,
} as const;