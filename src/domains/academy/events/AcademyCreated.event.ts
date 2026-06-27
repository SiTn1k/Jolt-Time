/**
 * Academy Created Event
 *
 * Domain event emitted when a new Academy is created.
 */

import type { AcademyId } from '../value-objects/AcademyId';

/**
 * Event data for academy creation.
 */
export interface AcademyCreatedEventData {
  /** Academy ID */
  academyId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Initial research points */
  initialResearchPoints: number;

  /** Initial academy level */
  initialLevel: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for academy creation.
 */
export interface AcademyCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'AcademyCreated';

  /** Event data */
  readonly data: AcademyCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AcademyCreatedEvent.
 */
export function createAcademyCreatedEvent(params: {
  academyId: AcademyId;
  playerProfileId: string;
  initialResearchPoints: number;
}): AcademyCreatedEvent {
  return {
    eventType: 'AcademyCreated',
    version: 1,
    data: {
      academyId: params.academyId.value,
      playerProfileId: params.playerProfileId,
      initialResearchPoints: params.initialResearchPoints,
      initialLevel: 1,
      occurredAt: new Date(),
    },
  };
}