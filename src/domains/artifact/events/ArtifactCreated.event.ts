/**
 * Artifact Created Event
 *
 * Domain event emitted when a new artifact is created.
 */

import type { ArtifactId } from '../value-objects/ArtifactId';

/**
 * Event data for artifact creation.
 */
export interface ArtifactCreatedEventData {
  /** Artifact ID */
  artifactId: string;

  /** Artifact slug */
  slug: string;

  /** Artifact title */
  title: string;

  /** Artifact category */
  category: string;

  /** Artifact rarity */
  rarity: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for artifact creation.
 */
export interface ArtifactCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'ArtifactCreated';

  /** Event data */
  readonly data: ArtifactCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an ArtifactCreatedEvent.
 */
export function createArtifactCreatedEvent(params: {
  artifactId: ArtifactId;
  slug: string;
  title: string;
  category: string;
  rarity: string;
}): ArtifactCreatedEvent {
  return {
    eventType: 'ArtifactCreated',
    version: 1,
    data: {
      artifactId: params.artifactId.value,
      slug: params.slug,
      title: params.title,
      category: params.category,
      rarity: params.rarity,
      occurredAt: new Date(),
    },
  };
}