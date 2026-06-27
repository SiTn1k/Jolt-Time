/**
 * Artifact Events
 *
 * Exports all artifact domain events.
 */

export type { ArtifactCreatedEvent, ArtifactCreatedEventData } from './ArtifactCreated.event';
export type { ArtifactUpdatedEvent, ArtifactUpdatedEventData } from './ArtifactUpdated.event';
export type { ArtifactArchivedEvent, ArtifactArchivedEventData } from './ArtifactArchived.event';

export { createArtifactCreatedEvent } from './ArtifactCreated.event';
export { createArtifactUpdatedEvent } from './ArtifactUpdated.event';
export { createArtifactArchivedEvent } from './ArtifactArchived.event';