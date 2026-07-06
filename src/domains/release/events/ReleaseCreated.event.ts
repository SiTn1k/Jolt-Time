/**
 * ReleaseCreated Event
 *
 * Domain event emitted when a release candidate is created.
 */

import type { ReleaseStatus } from '../types/ReleaseStatus';
import type { ReleaseStage } from '../types/ReleaseStage';

/**
 * Event data for release creation.
 */
export interface ReleaseCreatedEventData {
  /** Release ID */
  releaseId: string;
  /** Semantic version */
  version: string;
  /** Initial status */
  status: ReleaseStatus;
  /** Release stage */
  stage: ReleaseStage;
  /** Creation timestamp */
  occurredAt: Date;
}

/**
 * Domain event for release creation.
 */
export interface ReleaseCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'ReleaseCreated';
  /** Event data */
  readonly data: ReleaseCreatedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ReleaseCreatedEvent.
 */
export function createReleaseCreatedEvent(params: {
  releaseId: string;
  version: string;
  status: ReleaseStatus;
  stage: ReleaseStage;
}): ReleaseCreatedEvent {
  return {
    eventType: 'ReleaseCreated',
    version: 1,
    data: {
      releaseId: params.releaseId,
      version: params.version,
      status: params.status,
      stage: params.stage,
      occurredAt: new Date(),
    },
  };
}
