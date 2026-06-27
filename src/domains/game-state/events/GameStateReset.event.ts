/**
 * Game State Reset Event
 *
 * Domain event emitted when a game state is reset.
 */

import type { GameStateId } from '../value-objects/GameStateId';

/**
 * Event data for game state reset.
 */
export interface GameStateResetEventData {
  /** Game state ID */
  gameStateId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Type of reset performed */
  resetType: 'full' | 'energy' | 'health' | 'session' | 'tutorial';

  /** Energy before reset (if applicable) */
  previousEnergy?: number;

  /** Energy after reset (if applicable) */
  newEnergy?: number;

  /** Health before reset (if applicable) */
  previousHealth?: number;

  /** Health after reset (if applicable) */
  newHealth?: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for game state reset.
 */
export interface GameStateResetEvent {
  /** Event type identifier */
  readonly eventType: 'GameStateReset';

  /** Event data */
  readonly data: GameStateResetEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a GameStateResetEvent.
 */
export function createGameStateResetEvent(params: {
  gameStateId: GameStateId;
  playerProfileId: string;
  resetType: 'full' | 'energy' | 'health' | 'session' | 'tutorial';
  previousEnergy?: number;
  newEnergy?: number;
  previousHealth?: number;
  newHealth?: number;
}): GameStateResetEvent {
  return {
    eventType: 'GameStateReset',
    version: 1,
    data: {
      gameStateId: params.gameStateId.value,
      playerProfileId: params.playerProfileId,
      resetType: params.resetType,
      previousEnergy: params.previousEnergy,
      newEnergy: params.newEnergy,
      previousHealth: params.previousHealth,
      newHealth: params.newHealth,
      occurredAt: new Date(),
    },
  };
}