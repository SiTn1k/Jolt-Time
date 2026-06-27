/**
 * Research Started Event
 *
 * Domain event emitted when a player starts researching a node.
 */

import type { AcademyId } from '../value-objects/AcademyId';
import type { ResearchNodeId } from '../value-objects/ResearchNodeId';

/**
 * Event data for research start.
 */
export interface ResearchStartedEventData {
  /** Academy ID */
  academyId: string;

  /** Research node ID */
  nodeId: string;

  /** Node slug for reference */
  nodeSlug: string;

  /** Research cost in points */
  researchCost: number;

  /** Player profile ID */
  playerProfileId: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for research start.
 */
export interface ResearchStartedEvent {
  /** Event type identifier */
  readonly eventType: 'ResearchStarted';

  /** Event data */
  readonly data: ResearchStartedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ResearchStartedEvent.
 */
export function createResearchStartedEvent(params: {
  academyId: AcademyId;
  nodeId: ResearchNodeId;
  nodeSlug: string;
  researchCost: number;
  playerProfileId: string;
}): ResearchStartedEvent {
  return {
    eventType: 'ResearchStarted',
    version: 1,
    data: {
      academyId: params.academyId.value,
      nodeId: params.nodeId.value,
      nodeSlug: params.nodeSlug,
      researchCost: params.researchCost,
      playerProfileId: params.playerProfileId,
      occurredAt: new Date(),
    },
  };
}