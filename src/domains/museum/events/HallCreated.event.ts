/**
 * Hall Created Event
 *
 * Domain event emitted when a new hall is created in a museum.
 */

import type { HallId } from '../value-objects/HallId';
import type { MuseumId } from '../value-objects/MuseumId';
import type { HallType } from '../types/HallType';

/**
 * Event data for hall creation.
 */
export interface HallCreatedEventData {
  /** Hall ID */
  hallId: string;

  /** Museum ID */
  museumId: string;

  /** Hall type */
  hallType: HallType;

  /** Hall name */
  hallName: string;

  /** Hall capacity */
  capacity: number;

  /** Hall position */
  position: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for hall creation.
 */
export interface HallCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'HallCreated';

  /** Event data */
  readonly data: HallCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a HallCreatedEvent.
 */
export function createHallCreatedEvent(params: {
  hallId: HallId;
  museumId: MuseumId;
  hallType: HallType;
  hallName: string;
  capacity: number;
  position: number;
}): HallCreatedEvent {
  return {
    eventType: 'HallCreated',
    version: 1,
    data: {
      hallId: params.hallId.value,
      museumId: params.museumId.value,
      hallType: params.hallType,
      hallName: params.hallName,
      capacity: params.capacity,
      position: params.position,
      occurredAt: new Date(),
    },
  };
}
