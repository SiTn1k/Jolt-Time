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
   * Deletes a game state.
   * @param id The game state ID to delete
   */
  delete(id: GameStateId): Promise<void>;

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