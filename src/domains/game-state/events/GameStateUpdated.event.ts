/**
 * Game State Updated Event
 *
 * Domain event emitted when a game state is updated.
 */

import type { GameStateId } from '../value-objects/GameStateId';
import type { OnlineStatus } from '../types/OnlineStatus';
import type { GameScene } from '../types/GameScene';

/**
 * Event data for game state update.
 */
export interface GameStateUpdatedEventData {
  /** Game state ID */
  gameStateId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Updated energy value */
  currentEnergy?: number;

  /** Updated maximum energy */
  maximumEnergy?: number;

  /** Updated health value */
  currentHealth?: number;

  /** Updated maximum health */
  maximumHealth?: number;

  /** Updated active scene */
  activeScene?: GameScene;

  /** Updated tutorial step */
  tutorialStep?: number;

  /** Updated online status */
  onlineStatus?: OnlineStatus;

  /** Fields that were updated */
  updatedFields: string[];

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for game state update.
 */
export interface GameStateUpdatedEvent {
  /** Event type identifier */
  readonly eventType: 'GameStateUpdated';

  /** Event data */
  readonly data: GameStateUpdatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a GameStateUpdatedEvent.
 */
export function createGameStateUpdatedEvent(params: {
  gameStateId: GameStateId;
  playerProfileId: string;
  currentEnergy?: number;
  maximumEnergy?: number;
  currentHealth?: number;
  maximumHealth?: number;
  activeScene?: GameScene;
  tutorialStep?: number;
  onlineStatus?: OnlineStatus;
  updatedFields: string[];
}): GameStateUpdatedEvent {
  return {
    eventType: 'GameStateUpdated',
    version: 1,
    data: {
      gameStateId: params.gameStateId.value,
      playerProfileId: params.playerProfileId,
      currentEnergy: params.currentEnergy,
      maximumEnergy: params.maximumEnergy,
      currentHealth: params.currentHealth,
      maximumHealth: params.maximumHealth,
      activeScene: params.activeScene,
      tutorialStep: params.tutorialStep,
      onlineStatus: params.onlineStatus,
      updatedFields: params.updatedFields,
      occurredAt: new Date(),
    },
  };
}