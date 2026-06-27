/**
 * GameState Entity
 *
 * Domain entity representing the current runtime state of the player.
 * This entity contains ONLY gameplay state - no authentication data.
 *
 * GameState Entity Responsibilities:
 * - Represent player's current gameplay state
 * - Track energy and health
 * - Manage active session
 * - Track tutorial progress
 * - Track online status
 *
 * GameState Entity is NOT:
 * - User (authentication identity)
 * - PlayerProfile (persistent gameplay data like level, XP)
 * - Inventory (items and artifacts)
 * - Statistics (aggregated gameplay metrics)
 */

import type { IGameState } from '../interfaces/IGameState';
import { GameStateId } from '../value-objects/GameStateId';
import { Energy } from '../value-objects/Energy';
import { Health } from '../value-objects/Health';
import { SessionId } from '../value-objects/SessionId';
import { TutorialStep } from '../value-objects/TutorialStep';
import type { OnlineStatus } from '../types/OnlineStatus';
import type { GameScene } from '../types/GameScene';
import { OnlineStatus as OnlineStatusEnum } from '../types/OnlineStatus';
import { GameScene as GameSceneEnum } from '../types/GameScene';

/**
 * GameState entity class.
 * Immutable domain entity representing a player's current game state.
 */
export class GameState implements IGameState {
  /** Unique internal game state identifier */
  public readonly gameStateId: GameStateId;

  /** Associated player profile ID */
  public readonly playerProfileId: string;

  /** Current energy level */
  public readonly currentEnergy: Energy;

  /** Maximum energy capacity */
  public readonly maximumEnergy: number;

  /** Current health level */
  public readonly currentHealth: Health;

  /** Maximum health capacity */
  public readonly maximumHealth: number;

  /** Current session identifier */
  public readonly currentSession: SessionId;

  /** Current active scene */
  public readonly activeScene: GameScene;

  /** Current tutorial step */
  public readonly tutorialStep: TutorialStep;

  /** Online status */
  public readonly onlineStatus: OnlineStatus;

  /** Last activity timestamp */
  public readonly lastActivity: Date;

  /** Timestamp when state was created */
  public readonly createdAt: Date;

  /** Timestamp when state was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new GameState instance.
   * @param props GameState properties
   */
  constructor(props: GameStateProps) {
    this.gameStateId = props.gameStateId;
    this.playerProfileId = props.playerProfileId;
    this.currentEnergy = props.currentEnergy;
    this.maximumEnergy = props.maximumEnergy;
    this.currentHealth = props.currentHealth;
    this.maximumHealth = props.maximumHealth;
    this.currentSession = props.currentSession;
    this.activeScene = props.activeScene ?? GameSceneEnum.MAIN_MENU;
    this.tutorialStep = props.tutorialStep;
    this.onlineStatus = props.onlineStatus ?? OnlineStatusEnum.OFFLINE;
    this.lastActivity = props.lastActivity;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new GameState for a player profile.
   * Factory method for new state creation.
   */
  public static create(params: {
    gameStateId: GameStateId;
    playerProfileId: string;
    maximumEnergy?: number;
    maximumHealth?: number;
  }): GameState {
    const now = new Date();
    const maxEnergy = params.maximumEnergy ?? 100;
    const maxHealth = params.maximumHealth ?? 100;

    return new GameState({
      gameStateId: params.gameStateId,
      playerProfileId: params.playerProfileId,
      currentEnergy: Energy.start(maxEnergy),
      maximumEnergy: maxEnergy,
      currentHealth: Health.start(maxHealth),
      maximumHealth: maxHealth,
      currentSession: SessionId.empty(),
      activeScene: GameSceneEnum.MAIN_MENU,
      tutorialStep: TutorialStep.start(),
      onlineStatus: OnlineStatusEnum.OFFLINE,
      lastActivity: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Creates a GameState from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: GameStateRecord): GameState {
    return new GameState({
      gameStateId: GameStateId.reconstruct(record.game_state_id),
      playerProfileId: record.player_profile_id,
      currentEnergy: Energy.reconstruct(record.current_energy, record.maximum_energy),
      maximumEnergy: record.maximum_energy,
      currentHealth: Health.reconstruct(record.current_health, record.maximum_health),
      maximumHealth: record.maximum_health,
      currentSession: SessionId.reconstruct(record.current_session),
      activeScene: record.active_scene as GameScene,
      tutorialStep: TutorialStep.reconstruct(record.tutorial_step),
      onlineStatus: record.online_status as OnlineStatus,
      lastActivity: new Date(record.last_activity),
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }

  /**
   * Serializes the GameState to a plain object.
   */
  public toJSON(): GameStateJSON {
    return {
      gameStateId: this.gameStateId.value,
      playerProfileId: this.playerProfileId,
      currentEnergy: this.currentEnergy.value,
      maximumEnergy: this.maximumEnergy,
      currentHealth: this.currentHealth.value,
      maximumHealth: this.maximumHealth,
      currentSession: this.currentSession.value,
      activeScene: this.activeScene,
      tutorialStep: this.tutorialStep.numericValue,
      onlineStatus: this.onlineStatus,
      lastActivity: this.lastActivity.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new GameState instance.
   */
  public copyWith(params: Partial<GameStateProps>): GameState {
    return new GameState({
      gameStateId: this.gameStateId,
      playerProfileId: this.playerProfileId,
      currentEnergy: params.currentEnergy ?? this.currentEnergy,
      maximumEnergy: params.maximumEnergy ?? this.maximumEnergy,
      currentHealth: params.currentHealth ?? this.currentHealth,
      maximumHealth: params.maximumHealth ?? this.maximumHealth,
      currentSession: params.currentSession ?? this.currentSession,
      activeScene: params.activeScene ?? this.activeScene,
      tutorialStep: params.tutorialStep ?? this.tutorialStep,
      onlineStatus: params.onlineStatus ?? this.onlineStatus,
      lastActivity: new Date(),
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Updates the energy level.
   * Returns a new GameState with updated energy.
   */
  public updateEnergy(newEnergy: Energy): GameState {
    return this.copyWith({
      currentEnergy: newEnergy,
      maximumEnergy: newEnergy.maximum,
    });
  }

  /**
   * Updates the health level.
   * Returns a new GameState with updated health.
   */
  public updateHealth(newHealth: Health): GameState {
    return this.copyWith({
      currentHealth: newHealth,
      maximumHealth: newHealth.maximum,
    });
  }

  /**
   * Starts a new session.
   * Returns a new GameState with active session.
   */
  public startSession(sessionId: SessionId): GameState {
    return this.copyWith({
      currentSession: sessionId,
    });
  }

  /**
   * Ends the current session.
   * Returns a new GameState with no active session.
   */
  public endSession(): GameState {
    return this.copyWith({
      currentSession: SessionId.empty(),
    });
  }

  /**
   * Changes the active scene.
   * Returns a new GameState in the new scene.
   */
  public changeScene(scene: GameScene): GameState {
    return this.copyWith({
      activeScene: scene,
    });
  }

  /**
   * Advances to the next tutorial step.
   * Returns a new GameState with advanced tutorial.
   */
  public advanceTutorial(): GameState {
    return this.copyWith({
      tutorialStep: this.tutorialStep.next(),
    });
  }

  /**
   * Completes the tutorial.
   * Returns a new GameState with tutorial completed.
   */
  public completeTutorial(): GameState {
    return this.copyWith({
      tutorialStep: TutorialStep.complete(),
    });
  }

  /**
   * Updates online status.
   * Returns a new GameState with updated status.
   */
  public setOnlineStatus(status: OnlineStatus): GameState {
    return this.copyWith({
      onlineStatus: status,
    });
  }

  /**
   * Updates last activity timestamp.
   * Returns a new GameState with updated timestamp.
   */
  public recordActivity(): GameState {
    return this.copyWith({
      lastActivity: new Date(),
    });
  }
}

/**
 * GameState properties interface for constructor.
 */
export interface GameStateProps {
  gameStateId: GameStateId;
  playerProfileId: string;
  currentEnergy: Energy;
  maximumEnergy: number;
  currentHealth: Health;
  maximumHealth: number;
  currentSession: SessionId;
  activeScene?: GameScene;
  tutorialStep: TutorialStep;
  onlineStatus?: OnlineStatus;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of GameState.
 */
export interface GameStateRecord {
  game_state_id: string;
  player_profile_id: string;
  current_energy: number;
  maximum_energy: number;
  current_health: number;
  maximum_health: number;
  current_session: string;
  active_scene: string;
  tutorial_step: number;
  online_status: string;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of GameState.
 */
export interface GameStateJSON {
  gameStateId: string;
  playerProfileId: string;
  currentEnergy: number;
  maximumEnergy: number;
  currentHealth: number;
  maximumHealth: number;
  currentSession: string;
  activeScene: GameScene;
  tutorialStep: number;
  onlineStatus: OnlineStatus;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}