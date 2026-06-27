/**
 * Game State Created Event
 *
 * Domain event emitted when a new game state is created.
 */

import type { GameStateId } from '../value-objects/GameStateId';

/**
 * Event data for game state creation.
 */
export interface GameStateCreatedEventData {
  /** Game state ID */
  gameStateId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Initial maximum energy */
  maximumEnergy: number;

  /** Initial maximum health */
  maximumHealth: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for game state creation.
 */
export interface GameStateCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'GameStateCreated';

  /** Event data */
  readonly data: GameStateCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a GameStateCreatedEvent.
 */
export function createGameStateCreatedEvent(params: {
  gameStateId: GameStateId;
  playerProfileId: string;
  maximumEnergy: number;
  maximumHealth: number;
}): GameStateCreatedEvent {
  return {
    eventType: 'GameStateCreated',
    version: 1,
    data: {
      gameStateId: params.gameStateId.value,
      playerProfileId: params.playerProfileId,
      maximumEnergy: params.maximumEnergy,
      maximumHealth: params.maximumHealth,
      occurredAt: new Date(),
    },
  };
}