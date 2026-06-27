/**
 * Supabase Game State Repository
 *
 * Production Supabase implementation of the GameState repository.
 * Handles all persistence operations for GameState entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { IGameStateRepository, GameStateFilterParams } from '../interfaces/IGameStateRepository';
import { GameState } from '../entities/GameState';
import type { GameStateId } from '../value-objects/GameStateId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { RepositoryError } from '../../../database/errors';
import { createLogger } from '../../../core/logging/logger.service';
import { OnlineStatus } from '../types/OnlineStatus';
import { GameScene } from '../types/GameScene';

const logger = createLogger('SupabaseGameStateRepository');

/**
 * Supabase implementation of the GameState Repository.
 * Implements IGameStateRepository for GameState entity persistence.
 */
export class SupabaseGameStateRepository implements IGameStateRepository {
  private readonly tableName = 'game_states';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseGameStateRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client;
  }

  /**
   * Get the Supabase client.
   */
  private get client(): SupabaseClient<Database> {
    return this._client ?? getSupabaseClient();
  }

  /**
   * Maps a database row to a GameState entity.
   */
  private mapRowToEntity(row: Record<string, unknown>): GameState {
    return GameState.fromDatabase({
      game_state_id: row.game_state_id as string,
      player_profile_id: row.player_profile_id as string,
      current_energy: row.current_energy as number,
      maximum_energy: row.maximum_energy as number,
      current_health: row.current_health as number,
      maximum_health: row.maximum_health as number,
      current_session: row.current_session as string,
      active_scene: row.active_scene as string,
      tutorial_step: row.tutorial_step as number,
      online_status: row.online_status as string,
      last_activity: row.last_activity as string,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    });
  }

  /**
   * Converts a GameState entity to database insert format.
   */
  private toInsertRecord(gameState: GameState): Record<string, unknown> {
    return {
      game_state_id: gameState.gameStateId.value,
      player_profile_id: gameState.playerProfileId,
      current_energy: gameState.currentEnergy.value,
      maximum_energy: gameState.maximumEnergy,
      current_health: gameState.currentHealth.value,
      maximum_health: gameState.maximumHealth,
      current_session: gameState.currentSession.value,
      active_scene: gameState.activeScene,
      tutorial_step: gameState.tutorialStep.numericValue,
      online_status: gameState.onlineStatus,
      last_activity: gameState.lastActivity.toISOString(),
      created_at: gameState.createdAt.toISOString(),
      updated_at: gameState.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a GameState entity to database update format.
   */
  private toUpdateRecord(gameState: GameState): Record<string, unknown> {
    return {
      current_energy: gameState.currentEnergy.value,
      maximum_energy: gameState.maximumEnergy,
      current_health: gameState.currentHealth.value,
      maximum_health: gameState.maximumHealth,
      current_session: gameState.currentSession.value,
      active_scene: gameState.activeScene,
      tutorial_step: gameState.tutorialStep.numericValue,
      online_status: gameState.onlineStatus,
      last_activity: gameState.lastActivity.toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Creates a new game state.
   * @param gameState The game state to create
   * @returns The created game state
   */
  async create(gameState: GameState): Promise<GameState> {
    logger.debug('Creating game state', { gameStateId: gameState.gameStateId.value });

    try {
      const record = this.toInsertRecord(gameState);

      const { data, error } = await this.client
        .from(this.tableName)
        .insert([record])
        .select()
        .single();

      if (error) {
        logger.error('Failed to create game state', error);
        throw RepositoryError.createFailed('GameState', error as Error);
      }

      logger.info('Game state created', { gameStateId: gameState.gameStateId.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating game state', err as Error);
      throw RepositoryError.createFailed('GameState', err as Error);
    }
  }

  /**
   * Finds a game state by its internal ID.
   * @param id The game state ID to find
   * @returns The game state if found, null otherwise
   */
  async findById(id: GameStateId): Promise<GameState | null> {
    logger.debug('Finding game state by ID', { gameStateId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('game_state_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find game state by ID', error);
        throw RepositoryError.queryFailed('findById', error as Error);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding game state by ID', err as Error);
      throw RepositoryError.queryFailed('findById', err as Error);
    }
  }

  /**
   * Finds a game state by player profile ID.
   * @param playerProfileId The player profile ID to find game state for
   * @returns The game state if found, null otherwise
   */
  async findByPlayerProfileId(playerProfileId: string): Promise<GameState | null> {
    logger.debug('Finding game state by player profile ID', { playerProfileId });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('player_profile_id', playerProfileId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find game state by player profile ID', error);
        throw RepositoryError.queryFailed('findByPlayerProfileId', error as Error);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding game state by player profile ID', err as Error);
      throw RepositoryError.queryFailed('findByPlayerProfileId', err as Error);
    }
  }

  /**
   * Checks if a game state exists by ID.
   * @param id The game state ID to check
   * @returns true if game state exists
   */
  async exists(id: GameStateId): Promise<boolean> {
    logger.debug('Checking if game state exists', { gameStateId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('game_state_id')
        .eq('game_state_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false;
        }
        logger.error('Failed to check game state existence', error);
        throw RepositoryError.queryFailed('exists', error as Error);
      }

      return data !== null;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error checking game state existence', err as Error);
      throw RepositoryError.queryFailed('exists', err as Error);
    }
  }

  /**
   * Updates an existing game state.
   * @param gameState The game state to update
   * @returns The updated game state
   */
  async update(gameState: GameState): Promise<GameState> {
    logger.debug('Updating game state', { gameStateId: gameState.gameStateId.value });

    try {
      const record = this.toUpdateRecord(gameState);

      const { data, error } = await this.client
        .from(this.tableName)
        .update(record)
        .eq('game_state_id', gameState.gameStateId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update game state', error);
        throw RepositoryError.updateFailed('GameState', gameState.gameStateId.value, error as Error);
      }

      logger.info('Game state updated', { gameStateId: gameState.gameStateId.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating game state', err as Error);
      throw RepositoryError.updateFailed('GameState', gameState.gameStateId.value, err as Error);
    }
  }

  /**
   * Updates only the energy values of a game state.
   * @param id The game state ID
   * @param currentEnergy New current energy value
   * @param maximumEnergy New maximum energy value
   * @returns The updated game state
   */
  async updateEnergy(id: GameStateId, currentEnergy: number, maximumEnergy: number): Promise<GameState> {
    logger.debug('Updating game state energy', { gameStateId: id.value, currentEnergy, maximumEnergy });

    try {
      const updateData = {
        current_energy: currentEnergy,
        maximum_energy: maximumEnergy,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.client
        .from(this.tableName)
        .update(updateData)
        .eq('game_state_id', id.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update game state energy', error);
        throw RepositoryError.updateFailed('GameState', id.value, error as Error);
      }

      logger.info('Game state energy updated', { gameStateId: id.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating game state energy', err as Error);
      throw RepositoryError.updateFailed('GameState', id.value, err as Error);
    }
  }

  /**
   * Updates only the health values of a game state.
   * @param id The game state ID
   * @param currentHealth New current health value
   * @param maximumHealth New maximum health value
   * @returns The updated game state
   */
  async updateHealth(id: GameStateId, currentHealth: number, maximumHealth: number): Promise<GameState> {
    logger.debug('Updating game state health', { gameStateId: id.value, currentHealth, maximumHealth });

    try {
      const updateData = {
        current_health: currentHealth,
        maximum_health: maximumHealth,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.client
        .from(this.tableName)
        .update(updateData)
        .eq('game_state_id', id.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update game state health', error);
        throw RepositoryError.updateFailed('GameState', id.value, error as Error);
      }

      logger.info('Game state health updated', { gameStateId: id.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating game state health', err as Error);
      throw RepositoryError.updateFailed('GameState', id.value, err as Error);
    }
  }

  /**
   * Updates only the session-related fields of a game state.
   * @param id The game state ID
   * @param currentSession New session ID
   * @param onlineStatus New online status
   * @param lastActivity New last activity timestamp
   * @returns The updated game state
   */
  async updateSession(
    id: GameStateId,
    currentSession: string,
    onlineStatus: string,
    lastActivity: Date
  ): Promise<GameState> {
    logger.debug('Updating game state session', { gameStateId: id.value, currentSession, onlineStatus });

    try {
      const updateData = {
        current_session: currentSession,
        online_status: onlineStatus,
        last_activity: lastActivity.toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.client
        .from(this.tableName)
        .update(updateData)
        .eq('game_state_id', id.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update game state session', error);
        throw RepositoryError.updateFailed('GameState', id.value, error as Error);
      }

      logger.info('Game state session updated', { gameStateId: id.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating game state session', err as Error);
      throw RepositoryError.updateFailed('GameState', id.value, err as Error);
    }
  }

  /**
   * Resets a game state to initial values.
   * @param id The game state ID to reset
   * @returns The reset game state
   */
  async reset(id: GameStateId): Promise<GameState> {
    logger.debug('Resetting game state', { gameStateId: id.value });

    try {
      // First get the current state to preserve max energy/health
      const currentState = await this.findById(id);
      if (!currentState) {
        throw RepositoryError.entityNotFound('GameState', id.value, this.tableName);
      }

      const updateData = {
        current_energy: currentState.maximumEnergy,
        maximum_energy: currentState.maximumEnergy,
        current_health: currentState.maximumHealth,
        maximum_health: currentState.maximumHealth,
        current_session: '00000000-0000-4000-8000-000000000000',
        active_scene: GameScene.MAIN_MENU,
        tutorial_step: 0,
        online_status: OnlineStatus.OFFLINE,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.client
        .from(this.tableName)
        .update(updateData)
        .eq('game_state_id', id.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to reset game state', error);
        throw RepositoryError.updateFailed('GameState', id.value, error as Error);
      }

      logger.info('Game state reset', { gameStateId: id.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error resetting game state', err as Error);
      throw RepositoryError.updateFailed('GameState', id.value, err as Error);
    }
  }

  /**
   * Deletes a game state (soft delete by setting status).
   * @param id The game state ID to delete
   */
  async delete(id: GameStateId): Promise<void> {
    logger.debug('Soft deleting game state', { gameStateId: id.value });

    try {
      const updateData = {
        online_status: OnlineStatus.OFFLINE,
        updated_at: new Date().toISOString(),
      };

      const { error } = await this.client
        .from(this.tableName)
        .update(updateData)
        .eq('game_state_id', id.value);

      if (error) {
        logger.error('Failed to delete game state', error);
        throw RepositoryError.deleteFailed('GameState', id.value, error as Error);
      }

      logger.info('Game state deleted', { gameStateId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting game state', err as Error);
      throw RepositoryError.deleteFailed('GameState', id.value, err as Error);
    }
  }

  /**
   * Restores a deleted game state.
   * @param id The game state ID to restore
   * @returns The restored game state
   */
  async restore(id: GameStateId): Promise<GameState> {
    logger.debug('Restoring game state', { gameStateId: id.value });

    try {
      // First get the current state
      const currentState = await this.findById(id);
      if (!currentState) {
        throw RepositoryError.entityNotFound('GameState', id.value, this.tableName);
      }

      // Restore to full energy/health, clear session
      const updateData = {
        current_energy: currentState.maximumEnergy,
        maximum_energy: currentState.maximumEnergy,
        current_health: currentState.maximumHealth,
        maximum_health: currentState.maximumHealth,
        current_session: '00000000-0000-4000-8000-000000000000',
        online_status: OnlineStatus.OFFLINE,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.client
        .from(this.tableName)
        .update(updateData)
        .eq('game_state_id', id.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to restore game state', error);
        throw RepositoryError.updateFailed('GameState', id.value, error as Error);
      }

      logger.info('Game state restored', { gameStateId: id.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error restoring game state', err as Error);
      throw RepositoryError.updateFailed('GameState', id.value, err as Error);
    }
  }

  /**
   * Lists game states with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of game states
   */
  async list(
    params: PaginationParams,
    filters?: GameStateFilterParams
  ): Promise<PaginatedResult<GameState>> {
    logger.debug('Listing game states', { params, filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.playerProfileId) {
          query = query.eq('player_profile_id', filters.playerProfileId);
        }
        if (filters.onlineStatus) {
          query = query.eq('online_status', filters.onlineStatus);
        }
        if (filters.activeScene) {
          query = query.eq('active_scene', filters.activeScene);
        }
        if (filters.tutorialCompleted !== undefined) {
          query = query.eq('tutorial_step', filters.tutorialCompleted ? 99 : 0);
        }
        if (filters.lastActivityAfter) {
          query = query.gte('last_activity', filters.lastActivityAfter.toISOString());
        }
        if (filters.lastActivityBefore) {
          query = query.lte('last_activity', filters.lastActivityBefore.toISOString());
        }
      }

      // Apply sorting
      const sortField = params.sortBy || 'created_at';
      const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const page = Math.max(1, params.page);
      const pageSize = Math.min(Math.max(1, params.pageSize), 100);
      const offset = (page - 1) * pageSize;
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list game states', error);
        throw RepositoryError.queryFailed('list', error as Error);
      }

      const items = (data || []).map((row) =>
        this.mapRowToEntity(row as Record<string, unknown>)
      );
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing game states', err as Error);
      throw RepositoryError.queryFailed('list', err as Error);
    }
  }

  /**
   * Counts total game states with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching game states
   */
  async count(filters?: GameStateFilterParams): Promise<number> {
    logger.debug('Counting game states', { filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters) {
        if (filters.playerProfileId) {
          query = query.eq('player_profile_id', filters.playerProfileId);
        }
        if (filters.onlineStatus) {
          query = query.eq('online_status', filters.onlineStatus);
        }
        if (filters.activeScene) {
          query = query.eq('active_scene', filters.activeScene);
        }
        if (filters.tutorialCompleted !== undefined) {
          query = query.eq('tutorial_step', filters.tutorialCompleted ? 99 : 0);
        }
        if (filters.lastActivityAfter) {
          query = query.gte('last_activity', filters.lastActivityAfter.toISOString());
        }
        if (filters.lastActivityBefore) {
          query = query.lte('last_activity', filters.lastActivityBefore.toISOString());
        }
      }

      const { error, count } = await query;

      if (error) {
        logger.error('Failed to count game states', error);
        throw RepositoryError.queryFailed('count', error as Error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting game states', err as Error);
      throw RepositoryError.queryFailed('count', err as Error);
    }
  }
}