/**
 * Guild Statistics Type
 *
 * Statistics tracked for guilds.
 */

/**
 * Guild statistics.
 */
export interface GuildStatistics {
  /** Total guild XP (lifetime) */
  totalExperience: number;
  /** Guild XP this week */
  weeklyExperience: number;
  /** Active members count (7-day) */
  activeMembersCount: number;
  /** Average member level */
  averageMemberLevel: number;
  /** Total missions completed */
  missionsCompleted: number;
  /** Mission completion rate */
  missionCompletionRate: number;
  /** Wars participated */
  warsParticipated: number;
  /** Wars won */
  warsWon: number;
  /** Current season standing */
  seasonStanding: number;
  /** All-time season points */
  allTimeSeasonPoints: number;
  /** Total members ever joined */
  totalMembersJoined: number;
  /** Total members left/kicked */
  totalMembersLeft: number;
}

/**
 * Creates empty guild statistics.
 */
export function createEmptyGuildStatistics(): GuildStatistics {
  return {
    totalExperience: 0,
    weeklyExperience: 0,
    activeMembersCount: 0,
    averageMemberLevel: 0,
    missionsCompleted: 0,
    missionCompletionRate: 0,
    warsParticipated: 0,
    warsWon: 0,
    seasonStanding: 0,
    allTimeSeasonPoints: 0,
    totalMembersJoined: 0,
    totalMembersLeft: 0,
  };
}

/**
 * Guild member statistics.
 */
export interface GuildMemberStatistics {
  /** Total missions completed */
  missionsCompleted: number;
  /** Battles won for guild */
  battlesWon: number;
  /** Contributions to guild wars */
  warContributions: number;
  /** Resources donated */
  resourcesDonated: number;
  /** Daily logins count */
  dailyLogins: number;
}
