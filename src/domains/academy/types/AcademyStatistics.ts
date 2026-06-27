/**
 * Academy Statistics
 *
 * Statistics tracking for the Academy domain.
 */

import type { ResearchCategory } from './ResearchCategory';
import type { ResearchTier } from './ResearchTier';

/**
 * Academy statistics for a player.
 */
export interface AcademyStatistics {
  /** Total research completed */
  totalResearchCompleted: number;
  /** Total research points spent */
  totalPointsSpent: number;
  /** Total research points earned */
  totalPointsEarned: number;
  /** Current research points balance */
  currentPoints: number;
  /** Current academy level */
  academyLevel: number;
  /** Total research time in seconds */
  totalResearchTime: number;
  /** Research completed by category */
  completedByCategory: Partial<Record<ResearchCategory, number>>;
  /** Research completed by tier */
  completedByTier: Partial<Record<ResearchTier, number>>;
  /** Longest research streak */
  longestStreak: number;
  /** Current research streak */
  currentStreak: number;
  /** Average research duration in seconds */
  averageResearchDuration: number;
  /** Fastest research completion */
  fastestResearchCompletion: number;
  /** Most productive research session */
  mostProductiveSession: number;
  /** Last research timestamp */
  lastResearchAt: string | null;
}

/**
 * Creates initial academy statistics.
 */
export function createInitialAcademyStatistics(): AcademyStatistics {
  return {
    totalResearchCompleted: 0,
    totalPointsSpent: 0,
    totalPointsEarned: 0,
    currentPoints: 0,
    academyLevel: 1,
    totalResearchTime: 0,
    completedByCategory: {},
    completedByTier: {},
    longestStreak: 0,
    currentStreak: 0,
    averageResearchDuration: 0,
    fastestResearchCompletion: 0,
    mostProductiveSession: 0,
    lastResearchAt: null,
  };
}

/**
 * Initial academy statistics constant for convenience.
 */
export const INITIAL_ACADEMY_STATISTICS = createInitialAcademyStatistics();