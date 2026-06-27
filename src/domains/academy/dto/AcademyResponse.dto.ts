/**
 * Academy Response DTO
 *
 * Data transfer objects for Academy responses.
 */

import type { AcademyMetadata } from '../types/AcademyMetadata';
import type { AcademyStatistics } from '../types/AcademyStatistics';

/**
 * Academy response DTO.
 */
export interface AcademyResponseDto {
  /** Unique academy identifier */
  academyId: string;

  /** Associated player profile ID */
  playerProfileId: string;

  /** Current academy level */
  academyLevel: number;

  /** Current research points */
  researchPoints: number;

  /** Extended metadata */
  metadata: AcademyMetadata;

  /** Creation timestamp */
  createdAt: string;

  /** Update timestamp */
  updatedAt: string;
}

/**
 * Academy summary DTO (for lists).
 */
export interface AcademySummaryDto {
  /** Unique academy identifier */
  academyId: string;

  /** Current academy level */
  academyLevel: number;

  /** Current research points */
  researchPoints: number;
}

/**
 * Academy detail DTO with full information.
 */
export interface AcademyDetailDto extends AcademyResponseDto {
  /** Academy statistics */
  statistics: AcademyStatistics;

  /** Total research completed */
  totalResearchCompleted: number;

  /** Current research slots */
  researchSlots: number;

  /** Available research slots */
  availableSlots: number;

  /** Categories explored count */
  categoriesExploredCount: number;

  /** Highest tier reached */
  highestTierReached: number;
}

/**
 * Academy statistics response DTO.
 */
export interface AcademyStatisticsResponseDto {
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
  completedByCategory: Record<string, number>;

  /** Research completed by tier */
  completedByTier: Record<string, number>;

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