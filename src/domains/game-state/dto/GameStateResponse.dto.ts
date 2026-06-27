/**
 * Game State Response DTO
 *
 * Data transfer object for game state responses.
 * Contains all game state data for API responses.
 */

import type { OnlineStatus } from '../types/OnlineStatus';
import type { GameScene } from '../types/GameScene';

/**
 * Full game state response DTO.
 */
export interface GameStateResponseDto {
  /** Unique game state identifier */
  gameStateId: string;

  /** Associated player profile ID */
  playerProfileId: string;

  /** Current energy value */
  currentEnergy: number;

  /** Maximum energy capacity */
  maximumEnergy: number;

  /** Energy percentage (0-100) */
  energyPercentage: number;

  /** Current health value */
  currentHealth: number;

  /** Maximum health capacity */
  maximumHealth: number;

  /** Health percentage (0-100) */
  healthPercentage: number;

  /** Current session ID */
  currentSession: string;

  /** Whether a session is active */
  hasActiveSession: boolean;

  /** Active scene */
  activeScene: GameScene;

  /** Tutorial step numeric value */
  tutorialStep: number;

  /** Whether tutorial is completed */
  tutorialCompleted: boolean;

  /** Online status */
  onlineStatus: OnlineStatus;

  /** Last activity timestamp */
  lastActivity: string;

  /** State creation timestamp */
  createdAt: string;

  /** State last update timestamp */
  updatedAt: string;
}

/**
 * Summary game state response DTO (minimal data).
 */
export interface GameStateSummaryDto {
  /** Unique game state identifier */
  gameStateId: string;

  /** Associated player profile ID */
  playerProfileId: string;

  /** Current energy value */
  currentEnergy: number;

  /** Maximum energy capacity */
  maximumEnergy: number;

  /** Current health value */
  currentHealth: number;

  /** Maximum health capacity */
  maximumHealth: number;

  /** Online status */
  onlineStatus: OnlineStatus;

  /** Active scene */
  activeScene: GameScene;
}