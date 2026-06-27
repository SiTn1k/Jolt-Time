/**
 * Artifact Archived Event
 *
 * Domain event emitted when an artifact is archived (soft deleted).
 */

import type { ArtifactId } from '../value-objects/ArtifactId';

/**
 * Event data for artifact archival.
 */
export interface ArtifactArchivedEventData {
  /** Artifact ID */
  artifactId: string;

  /** Artifact slug */
  slug: string;

  /** Reason for archival */
  reason?: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for artifact archival.
 */
export interface ArtifactArchivedEvent {
  /** Event type identifier */
  readonly eventType: 'ArtifactArchived';

  /** Event data */
  readonly data: ArtifactArchivedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an ArtifactArchivedEvent.
 */
export function createArtifactArchivedEvent(params: {
  artifactId: ArtifactId;
  slug: string;
  reason?: string;
}): ArtifactArchivedEvent {
  return {
    eventType: 'ArtifactArchived',
    version: 1,
    data: {
      artifactId: params.artifactId.value,
      slug: params.slug,
      reason: params.reason,
      occurredAt: new Date(),
    },
  };
}