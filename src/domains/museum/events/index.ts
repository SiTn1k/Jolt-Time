/**
 * Museum Events
 *
 * Exports all domain events for the Museum domain.
 */

export { createMuseumCreatedEvent } from './MuseumCreated.event';
export type { MuseumCreatedEvent, MuseumCreatedEventData } from './MuseumCreated.event';

export { createHallCreatedEvent } from './HallCreated.event';
export type { HallCreatedEvent, HallCreatedEventData } from './HallCreated.event';

export { createExhibitPlacedEvent } from './ExhibitPlaced.event';
export type { ExhibitPlacedEvent, ExhibitPlacedEventData } from './ExhibitPlaced.event';

export { createExhibitRemovedEvent } from './ExhibitRemoved.event';
export type { ExhibitRemovedEvent, ExhibitRemovedEventData } from './ExhibitRemoved.event';

export { createMuseumUpgradedEvent } from './MuseumUpgraded.event';
export type { MuseumUpgradedEvent, MuseumUpgradedEventData } from './MuseumUpgraded.event';
