/**
 * Research Reset Event
 *
 * Domain event emitted when a research is reset.
 */

import type { AcademyId } from '../value-objects/AcademyId';
import type { ResearchNodeId } from '../value-objects/ResearchNodeId';

/**
 * Event data for research reset.
 */
export interface ResearchResetEventData {
  /** Academy ID */
  academyId: string;

  /** Research node ID */
  nodeId: string;

  /** Node slug for reference */
  nodeSlug: string;

  /** Previous status before reset */
  previousStatus: string;

  /** Points refunded (if any) */
  pointsRefunded: number;

  /** Player profile ID */
  playerProfileId: string;

  /** Reason for reset */
  reason: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for research reset.
 */
export interface ResearchResetEvent {
  /** Event type identifier */
  readonly eventType: 'ResearchReset';

  /** Event data */
  readonly data: ResearchResetEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ResearchResetEvent.
 */
export function createResearchResetEvent(params: {
  academyId: AcademyId;
  nodeId: ResearchNodeId;
  nodeSlug: string;
  previousStatus: string;
  pointsRefunded: number;
  playerProfileId: string;
  reason?: string;
}): ResearchResetEvent {
  return {
    eventType: 'ResearchReset',
    version: 1,
    data: {
      academyId: params.academyId.value,
      nodeId: params.nodeId.value,
      nodeSlug: params.nodeSlug,
      previousStatus: params.previousStatus,
      pointsRefunded: params.pointsRefunded,
      playerProfileId: params.playerProfileId,
      reason: params.reason ?? 'User requested reset',
      occurredAt: new Date(),
    },
  };
}