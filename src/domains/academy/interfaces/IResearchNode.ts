/**
 * ResearchNode Interface
 *
 * Interface defining the contract for ResearchNode entity.
 * All ResearchNode implementations must adhere to this interface.
 */

import type { ResearchNodeId } from '../value-objects/ResearchNodeId';
import type { ResearchCategory } from '../types/ResearchCategory';
import type { ResearchTier } from '../types/ResearchTier';
import type { UnlockType } from '../types/UnlockType';
import type { ResearchNodeMetadata } from '../types/AcademyMetadata';

/**
 * ResearchNode entity interface.
 * Represents a research node definition in the technology tree.
 */
export interface IResearchNode {
  /** Unique research node identifier */
  readonly nodeId: ResearchNodeId;

  /** URL-friendly identifier */
  readonly slug: string;

  /** Display title */
  readonly title: string;

  /** Research description */
  readonly description: string;

  /** Research category */
  readonly category: ResearchCategory;

  /** Research tier */
  readonly tier: ResearchTier;

  /** IDs of required research nodes that must be completed first */
  readonly requiredNodes: ResearchNodeId[];

  /** Research cost in research points */
  readonly researchCost: number;

  /** How this research is unlocked */
  readonly unlockType: UnlockType;

  /** Extended metadata */
  readonly metadata: ResearchNodeMetadata;

  /** Timestamp when node was created */
  readonly createdAt: Date;

  /** Timestamp when node was last updated */
  readonly updatedAt: Date;

  /**
   * Checks if this node has any prerequisites.
   */
  readonly hasPrerequisites: boolean;

  /**
   * Checks if this node is free (cost = 0).
   */
  readonly isFree: boolean;

  /**
   * Checks if this node is a starting node (no prerequisites).
   */
  readonly isStartingNode: boolean;
}