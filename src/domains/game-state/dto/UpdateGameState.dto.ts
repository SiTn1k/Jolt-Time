/**
 * Update Game State DTO
 *
 * Data transfer object for updating an existing game state.
 * Contains all optional data that can be updated.
 */

import type { OnlineStatus } from '../types/OnlineStatus';
import type { GameScene } from '../types/GameScene';

/**
 * Input for updating an existing game state.
 */
export interface UpdateGameStateDto {
  /** Current energy value */
  currentEnergy?: number;

  /** Maximum energy capacity */
  maximumEnergy?: number;

  /** Current health value */
  currentHealth?: number;

  /** Maximum health capacity */
  maximumHealth?: number;

  /** Current session ID */
  currentSession?: string;

  /** Active scene */
  activeScene?: GameScene;

  /** Tutorial step */
  tutorialStep?: number;

  /** Online status */
  onlineStatus?: OnlineStatus;

  /** Last activity timestamp */
  lastActivity?: string;
}

/**
 * Validation rules for UpdateGameStateDto.
 */
export const UPDATE_GAME_STATE_VALIDATION = {
  currentEnergy: {
    required: false,
    min: 0,
    max: 999,
  },
  maximumEnergy: {
    required: false,
    min: 1,
    max: 999,
  },
  currentHealth: {
    required: false,
    min: 0,
    max: 9999,
  },
  maximumHealth: {
    required: false,
    min: 1,
    max: 9999,
  },
  currentSession: {
    required: false,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  tutorialStep: {
    required: false,
    min: 0,
    max: 99,
  },
} as const;