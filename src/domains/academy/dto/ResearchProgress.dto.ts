/**
 * Research Progress DTO
 *
 * Data transfer objects for ResearchProgress responses.
 */

import type { ResearchStatus } from '../types/ResearchStatus';

/**
 * ResearchProgress response DTO.
 */
export interface ResearchProgressDto {
  /** Unique progress identifier */
  progressId: string;

  /** Associated academy ID */
  academyId: string;

  /** Research node ID */
  nodeId: string;

  /** Current research status */
  status: ResearchStatus;

  /** Status display name */
  statusDisplayName: string;

  /** Progress percentage (0-100) */
  progress: number;

  /** Whether research is complete */
  isComplete: boolean;

  /** Completion timestamp if completed */
  completedAt: string | null;

  /** Extended metadata */
  metadata: Record<string, unknown>;
}

/**
 * Research progress summary DTO.
 */
export interface ResearchProgressSummaryDto {
  /** Unique progress identifier */
  progressId: string;

  /** Research node ID */
  nodeId: string;

  /** Current research status */
  status: ResearchStatus;

  /** Progress percentage (0-100) */
  progress: number;

  /** Whether research is complete */
  isComplete: boolean;
}

/**
 * Active research DTO.
 */
export interface ActiveResearchDto {
  /** Unique progress identifier */
  progressId: string;

  /** Research node details */
  node: {
    nodeId: string;
    title: string;
    slug: string;
    category: string;
    tier: number;
  };

  /** Progress percentage (0-100) */
  progress: number;

  /** Remaining progress percentage */
  remainingProgress: number;

  /** Estimated completion details */
  estimatedCompletion?: {
    /** Estimated time remaining in seconds */
    timeRemaining: number;
    /** Formatted time string */
    formattedTime: string;
  };
}