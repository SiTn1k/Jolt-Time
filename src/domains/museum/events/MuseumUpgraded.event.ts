/**
 * Museum Upgraded Event
 *
 * Domain event emitted when a museum is upgraded.
 */

import type { MuseumId } from '../value-objects/MuseumId';

/**
 * Event data for museum upgrade.
 */
export interface MuseumUpgradedEventData {
  /** Museum ID */
  museumId: string;

  /** Previous level */
  previousLevel: number;

  /** New level */
  newLevel: number;

  /** Previous rating */
  previousRating: number;

  /** New rating */
  newRating: number;

  /** Features unlocked (if any) */
  featuresUnlocked?: string[];

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for museum upgrade.
 */
export interface MuseumUpgradedEvent {
  /** Event type identifier */
  readonly eventType: 'MuseumUpgraded';

  /** Event data */
  readonly data: MuseumUpgradedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a MuseumUpgradedEvent.
 */
export function createMuseumUpgradedEvent(params: {
  museumId: MuseumId;
  previousLevel: number;
  newLevel: number;
  previousRating: number;
  newRating: number;
  featuresUnlocked?: string[];
}): MuseumUpgradedEvent {
  return {
    eventType: 'MuseumUpgraded',
    version: 1,
    data: {
      museumId: params.museumId.value,
      previousLevel: params.previousLevel,
      newLevel: params.newLevel,
      previousRating: params.previousRating,
      newRating: params.newRating,
      featuresUnlocked: params.featuresUnlocked,
      occurredAt: new Date(),
    },
  };
}
