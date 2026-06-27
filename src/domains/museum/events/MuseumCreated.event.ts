/**
 * Museum Created Event
 *
 * Domain event emitted when a new museum is created.
 */

import type { MuseumId } from '../value-objects/MuseumId';
import type { MuseumType } from '../types/MuseumType';

/**
 * Event data for museum creation.
 */
export interface MuseumCreatedEventData {
  /** Museum ID */
  museumId: string;

  /** Player profile ID (owner) */
  playerProfileId: string;

  /** Museum name */
  museumName: string;

  /** Museum type */
  museumType: MuseumType;

  /** Initial level */
  level: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for museum creation.
 */
export interface MuseumCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'MuseumCreated';

  /** Event data */
  readonly data: MuseumCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a MuseumCreatedEvent.
 */
export function createMuseumCreatedEvent(params: {
  museumId: MuseumId;
  playerProfileId: string;
  museumName: string;
  museumType: MuseumType;
  level: number;
}): MuseumCreatedEvent {
  return {
    eventType: 'MuseumCreated',
    version: 1,
    data: {
      museumId: params.museumId.value,
      playerProfileId: params.playerProfileId,
      museumName: params.museumName,
      museumType: params.museumType,
      level: params.level,
      occurredAt: new Date(),
    },
  };
}
