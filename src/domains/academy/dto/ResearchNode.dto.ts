/**
 * Research Node DTO
 *
 * Data transfer objects for ResearchNode responses.
 */

import type { ResearchCategory } from '../types/ResearchCategory';
import type { ResearchTier } from '../types/ResearchTier';
import type { UnlockType } from '../types/UnlockType';
import type { ResearchNodeMetadata } from '../types/AcademyMetadata';

/**
 * ResearchNode response DTO.
 */
export interface ResearchNodeDto {
  /** Unique research node identifier */
  nodeId: string;

  /** URL-friendly identifier */
  slug: string;

  /** Display title */
  title: string;

  /** Research description */
  description: string;

  /** Research category */
  category: ResearchCategory;

  /** Category display name */
  categoryDisplayName: string;

  /** Research tier */
  tier: ResearchTier;

  /** Tier display name */
  tierDisplayName: string;

  /** IDs of required research nodes */
  requiredNodes: string[];

  /** Research cost in research points */
  researchCost: number;

  /** How this research is unlocked */
  unlockType: UnlockType;

  /** Extended metadata */
  metadata: ResearchNodeMetadata;

  /** Whether this node has prerequisites */
  hasPrerequisites: boolean;

  /** Whether this node is free */
  isFree: boolean;

  /** Creation timestamp */
  createdAt: string;

  /** Update timestamp */
  updatedAt: string;
}

/**
 * Research node summary DTO (for lists).
 */
export interface ResearchNodeSummaryDto {
  /** Unique research node identifier */
  nodeId: string;

  /** URL-friendly identifier */
  slug: string;

  /** Display title */
  title: string;

  /** Research category */
  category: ResearchCategory;

  /** Research tier */
  tier: ResearchTier;

  /** Research cost in research points */
  researchCost: number;
}

/**
 * Research node detail DTO with full information.
 */
export interface ResearchNodeDetailDto extends ResearchNodeDto {
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
}