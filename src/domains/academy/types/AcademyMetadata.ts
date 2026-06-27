/**
 * Academy Metadata
 *
 * Extended metadata for the Academy entity.
 */

import type { ResearchCategory } from './ResearchCategory';
import type { ResearchTier } from './ResearchTier';

/**
 * Metadata for a research node.
 */
export interface ResearchNodeMetadata {
  /** Era associated with this research */
  era?: string;
  /** Region associated with this research */
  region?: string;
  /** Key historical figures involved */
  figures?: string[];
  /** Related artifacts */
  relatedArtifacts?: string[];
  /** Key dates or time periods */
  keyDates?: string[];
  /** Educational facts */
  facts?: string[];
  /** Visual asset identifiers */
  assets?: {
    icon?: string;
    thumbnail?: string;
    background?: string;
  };
  /** Additional custom fields */
  custom?: Record<string, unknown>;
}

/**
 * Metadata for the Academy entity.
 */
export interface AcademyMetadata {
  /** Current research slot count */
  researchSlots?: number;
  /** Total research points ever earned */
  totalPointsEarned?: number;
  /** Total research time invested (in seconds) */
  totalResearchTime?: number;
  /** Categories explored */
  categoriesExplored?: ResearchCategory[];
  /** Highest tier reached */
  highestTierReached?: ResearchTier;
  /** Current research streak */
  researchStreak?: number;
  /** Last research completed at */
  lastResearchCompletedAt?: string;
  /** Additional custom fields */
  custom?: Record<string, unknown>;
}

/**
 * Creates default academy metadata.
 */
export function createDefaultAcademyMetadata(): AcademyMetadata {
  return {
    researchSlots: 1,
    totalPointsEarned: 0,
    totalResearchTime: 0,
    categoriesExplored: [],
    highestTierReached: 1,
    researchStreak: 0,
  };
}