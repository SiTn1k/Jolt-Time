/**
 * Game State Interface
 *
 * Interface defining the contract for GameState entity.
 * All GameState implementations must adhere to this interface.
 */

import type { GameStateId } from '../value-objects/GameStateId';
import type { Energy } from '../value-objects/Energy';
import type { Health } from '../value-objects/Health';
import type { SessionId } from '../value-objects/SessionId';
import type { TutorialStep } from '../value-objects/TutorialStep';
import type { OnlineStatus } from '../types/OnlineStatus';
import type { GameScene } from '../types/GameScene';

/**
 * GameState entity interface.
 * Represents a player's current gameplay state in the Jolt Time system.
 */
export interface IGameState {
  /** Unique internal game state identifier */
  readonly gameStateId: GameStateId;

  /** Associated player profile ID */
  readonly playerProfileId: string;

  /** Current energy level */
  readonly currentEnergy: Energy;

  /** Maximum energy capacity */
  readonly maximumEnergy: number;

  /** Current health level */
  readonly currentHealth: Health;

  /** Maximum health capacity */
  readonly maximumHealth: number;

  /** Current session identifier */
  readonly currentSession: SessionId;

  /** Current active scene */
  readonly activeScene: GameScene;

  /** Current tutorial step */
  readonly tutorialStep: TutorialStep;

  /** Online status */
  readonly onlineStatus: OnlineStatus;

  /** Last activity timestamp */
  readonly lastActivity: Date;

  /** Timestamp when state was created */
  readonly createdAt: Date;

  /** Timestamp when state was last updated */
  readonly updatedAt: Date;
}