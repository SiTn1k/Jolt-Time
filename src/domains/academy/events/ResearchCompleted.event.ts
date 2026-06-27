/**
 * Research Completed Event
 *
 * Domain event emitted when a research node is completed.
 */

import type { AcademyId } from '../value-objects/AcademyId';
import type { ResearchNodeId } from '../value-objects/ResearchNodeId';
import type { ResearchCategory } from '../types/ResearchCategory';
import type { ResearchTier } from '../types/ResearchTier';

/**
 * Event data for research completion.
 */
export interface ResearchCompletedEventData {
  /** Academy ID */
  academyId: string;

  /** Research node ID */
  nodeId: string;

  /** Node slug for reference */
  nodeSlug: string;

  /** Node title */
  nodeTitle: string;

  /** Research category */
  category: ResearchCategory;

  /** Research tier */
  tier: ResearchTier;

  /** Research cost in points */
  researchCost: number;

  /** Research duration in seconds */
  durationSeconds: number;

  /** Player profile ID */
  playerProfileId: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for research completion.
 */
export interface ResearchCompletedEvent {
  /** Event type identifier */
  readonly eventType: 'ResearchCompleted';

  /** Event data */
  readonly data: ResearchCompletedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ResearchCompletedEvent.
 */
export function createResearchCompletedEvent(params: {
  academyId: AcademyId;
  nodeId: ResearchNodeId;
  nodeSlug: string;
  nodeTitle: string;
  category: ResearchCategory;
  tier: ResearchTier;
  researchCost: number;
  durationSeconds: number;
  playerProfileId: string;
}): ResearchCompletedEvent {
  return {
    eventType: 'ResearchCompleted',
    version: 1,
    data: {
      academyId: params.academyId.value,
      nodeId: params.nodeId.value,
      nodeSlug: params.nodeSlug,
      nodeTitle: params.nodeTitle,
      category: params.category,
      tier: params.tier,
      researchCost: params.researchCost,
      durationSeconds: params.durationSeconds,
      playerProfileId: params.playerProfileId,
      occurredAt: new Date(),
    },
  };
}