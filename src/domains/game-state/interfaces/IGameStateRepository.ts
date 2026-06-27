/**
 * Game State Repository Interface
 *
 * Interface defining the contract for GameState persistence.
 * All GameState repository implementations must adhere to this interface.
 */

import type { GameStateId } from '../value-objects/GameStateId';
import type { GameState } from '../entities/GameState';
import type { OnlineStatus } from '../types/OnlineStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying game states.
 */
export interface GameStateFilterParams {
  /** Filter by player profile ID */
  playerProfileId?: string;

  /** Filter by online status */
  onlineStatus?: OnlineStatus;

  /** Filter by active scene */
  activeScene?: string;

  /** Filter by tutorial completion (true = completed) */
  tutorialCompleted?: boolean;

  /** Filter by last activity after */
  lastActivityAfter?: Date;

  /** Filter by last activity before */
  lastActivityBefore?: Date;
}

/**
 * GameState repository interface.
 * Defines all data access operations for GameState entities.
 */
export interface IGameStateRepository {
  /**
   * Creates a new game state.
   * @param gameState The game state to create
   * @returns The created game state
   */
  create(gameState: GameState): Promise<GameState>;

  /**
   * Finds a game state by its internal ID.
   * @param id The game state ID to find
   * @returns The game state if found, null otherwise
   */
  findById(id: GameStateId): Promise<GameState | null>;

  /**
   * Finds a game state by player profile ID.
   * @param playerProfileId The player profile ID to find game state for
   * @returns The game state if found, null otherwise
   */
  findByPlayerProfileId(playerProfileId: string): Promise<GameState | null>;

  /**
   * Checks if a game state exists by ID.
   * @param id The game state ID to check
   * @returns true if game state exists
   */
  exists(id: GameStateId): Promise<boolean>;

  /**
   * Updates an existing game state.
   * @param gameState The game state to update
   * @returns The updated game state
   */
  update(gameState: GameState): Promise<GameState>;

  /**
   * Updates only the energy values of a game state.
   * Optimized method for energy updates.
   * @param id The game state ID
   * @param currentEnergy New current energy value
   * @param maximumEnergy New maximum energy value
   * @returns The updated game state
   */
  updateEnergy(id: GameStateId, currentEnergy: number, maximumEnergy: number): Promise<GameState>;

  /**
   * Updates only the health values of a game state.
   * Optimized method for health updates.
   * @param id The game state ID
   * @param currentHealth New current health value
   * @param maximumHealth New maximum health value
   * @returns The updated game state
   */
  updateHealth(id: GameStateId, currentHealth: number, maximumHealth: number): Promise<GameState>;

  /**
   * Updates only the session-related fields of a game state.
   * Optimized method for session updates.
   * @param id The game state ID
   * @param currentSession New session ID
   * @param onlineStatus New online status
   * @param lastActivity New last activity timestamp
   * @returns The updated game state
   */
  updateSession(
    id: GameStateId,
    currentSession: string,
    onlineStatus: string,
    lastActivity: Date
  ): Promise<GameState>;

  /**
   * Resets a game state to initial values.
   * Sets energy/health to max, clears session, resets tutorial.
   * @param id The game state ID to reset
   * @returns The reset game state
   */
  reset(id: GameStateId): Promise<GameState>;

  /**
   * Deletes a game state (soft delete by setting status).
   * @param id The game state ID to delete
   */
  delete(id: GameStateId): Promise<void>;

  /**
   * Restores a deleted game state.
   * @param id The game state ID to restore
   * @returns The restored game state
   */
  restore(id: GameStateId): Promise<GameState>;

  /**
   * Lists game states with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of game states
   */
  list(
    params: PaginationParams,
    filters?: GameStateFilterParams
  ): Promise<PaginatedResult<GameState>>;

  /**
   * Counts total game states with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching game states
   */
  count(filters?: GameStateFilterParams): Promise<number>;
}