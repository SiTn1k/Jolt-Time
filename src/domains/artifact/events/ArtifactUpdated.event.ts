/**
 * Artifact Updated Event
 *
 * Domain event emitted when an artifact is updated.
 */

import type { ArtifactId } from '../value-objects/ArtifactId';

/**
 * Event data for artifact update.
 */
export interface ArtifactUpdatedEventData {
  /** Artifact ID */
  artifactId: string;

  /** Artifact slug */
  slug: string;

  /** Fields that were updated */
  updatedFields: string[];

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for artifact update.
 */
export interface ArtifactUpdatedEvent {
  /** Event type identifier */
  readonly eventType: 'ArtifactUpdated';

  /** Event data */
  readonly data: ArtifactUpdatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an ArtifactUpdatedEvent.
 */
export function createArtifactUpdatedEvent(params: {
  artifactId: ArtifactId;
  slug: string;
  updatedFields: string[];
}): ArtifactUpdatedEvent {
  return {
    eventType: 'ArtifactUpdated',
    version: 1,
    data: {
      artifactId: params.artifactId.value,
      slug: params.slug,
      updatedFields: params.updatedFields,
      occurredAt: new Date(),
    },
  };
}