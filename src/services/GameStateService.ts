/**
 * Game State Service
 *
 * Production service for managing game states.
 * Handles all business logic for game state operations.
 *
 * Features:
 * - Game state creation and initialization
 * - Game state loading and retrieval
 * - Energy management with clamping
 * - Health management with clamping
 * - Session management
 * - State reset and restore
 */

import { randomUUID } from 'crypto';
import { SupabaseGameStateRepository } from '../domains/game-state/repositories/SupabaseGameStateRepository';
import { GameState } from '../domains/game-state/entities/GameState';
import { GameStateId } from '../domains/game-state/value-objects/GameStateId';
import { Energy } from '../domains/game-state/value-objects/Energy';
import { Health } from '../domains/game-state/value-objects/Health';
import { SessionId } from '../domains/game-state/value-objects/SessionId';
import { TutorialStep } from '../domains/game-state/value-objects/TutorialStep';
import { GameStateMapper } from '../domains/game-state/mappers/GameStateMapper';
import { EnergyValidator } from '../domains/game-state/validators/EnergyValidator';
import { HealthValidator } from '../domains/game-state/validators/HealthValidator';
import { SessionValidator } from '../domains/game-state/validators/SessionValidator';
import type { CreateGameStateDto } from '../domains/game-state/dto/CreateGameState.dto';
import type { UpdateGameStateDto } from '../domains/game-state/dto/UpdateGameState.dto';
import type { GameStateResponseDto, GameStateSummaryDto } from '../domains/game-state/dto/GameStateResponse.dto';
import type { PaginationParams, PaginatedResult } from '../shared/types/base.types';
import { OnlineStatus } from '../domains/game-state/types/OnlineStatus';
import { GameScene } from '../domains/game-state/types/GameScene';
import { createLogger } from '../core/logging/logger.service';

const logger = createLogger('GameStateService');

/**
 * Result type for service operations.
 */
export type GameStateServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Game State Service
 * Handles all business logic for game state operations.
 */
export class GameStateService {
  private readonly repository: SupabaseGameStateRepository;
  private readonly mapper: GameStateMapper;
  private readonly energyValidator: EnergyValidator;
  private readonly healthValidator: HealthValidator;
  private readonly sessionValidator: SessionValidator;

  /**
   * Creates a new GameStateService instance.
   */
  constructor(
    repository?: SupabaseGameStateRepository,
    mapper?: GameStateMapper,
    energyValidator?: EnergyValidator,
    healthValidator?: HealthValidator,
    sessionValidator?: SessionValidator
  ) {
    this.repository = repository ?? new SupabaseGameStateRepository();
    this.mapper = mapper ?? new GameStateMapper();
    this.energyValidator = energyValidator ?? new EnergyValidator();
    this.healthValidator = healthValidator ?? new HealthValidator();
    this.sessionValidator = sessionValidator ?? new SessionValidator();
  }

  /**
   * Creates a new game state for a player profile.
   * Automatically initializes with full energy and health.
   *
   * @param dto - Game state creation data
   * @returns ServiceResult with the created game state
   */
  async createGameState(dto: CreateGameStateDto): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Creating game state', { playerProfileId: dto.playerProfileId });

    try {
      // Check if game state already exists for this player profile
      const existingState = await this.repository.findByPlayerProfileId(dto.playerProfileId);
      if (existingState) {
        logger.warn('Game state already exists for player profile', { playerProfileId: dto.playerProfileId });
        return { success: false, error: 'Game state already exists for this player profile' };
      }

      // Validate max energy
      const maxEnergy = dto.maximumEnergy ?? 100;
      const energyValidation = EnergyValidator.validateMaximum(maxEnergy);
      if (!energyValidation.isValid) {
        return { success: false, error: energyValidation.error ?? 'Invalid maximum energy' };
      }

      // Validate max health
      const maxHealth = dto.maximumHealth ?? 100;
      const healthValidation = HealthValidator.validateMaximum(maxHealth);
      if (!healthValidation.isValid) {
        return { success: false, error: healthValidation.error ?? 'Invalid maximum health' };
      }

      // Generate new game state ID
      const gameStateId = GameStateId.reconstruct(randomUUID());

      // Create the game state entity
      const gameState = GameState.create({
        gameStateId,
        playerProfileId: dto.playerProfileId,
        maximumEnergy: maxEnergy,
        maximumHealth: maxHealth,
      });

      // Persist to database
      const createdState = await this.repository.create(gameState);

      logger.info('Game state created', {
        gameStateId: createdState.gameStateId.value,
        playerProfileId: createdState.playerProfileId,
      });

      return { success: true, data: createdState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create game state';
      logger.error('Failed to create game state', err as Error, { playerProfileId: dto.playerProfileId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads a game state by game state ID.
   *
   * @param gameStateId - The game state ID
   * @returns ServiceResult with the game state
   */
  async loadGameState(gameStateId: string): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Loading game state', { gameStateId });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);
      const gameState = await this.repository.findById(gameStateIdVO);

      if (!gameState) {
        return { success: false, error: 'Game state not found' };
      }

      return { success: true, data: gameState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load game state';
      logger.error('Failed to load game state', err as Error, { gameStateId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads a game state by player profile ID.
   *
   * @param playerProfileId - The player profile ID
   * @returns ServiceResult with the game state
   */
  async loadGameStateByPlayerProfile(playerProfileId: string): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Loading game state by player profile', { playerProfileId });

    try {
      const gameState = await this.repository.findByPlayerProfileId(playerProfileId);

      if (!gameState) {
        return { success: false, error: 'Game state not found' };
      }

      return { success: true, data: gameState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load game state';
      logger.error('Failed to load game state by player profile', err as Error, { playerProfileId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Updates a game state with new values.
   *
   * @param gameStateId - The game state ID
   * @param dto - Update data
   * @returns ServiceResult with the updated game state
   */
  async updateGameState(
    gameStateId: string,
    dto: UpdateGameStateDto
  ): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Updating game state', { gameStateId });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);
      const currentState = await this.repository.findById(gameStateIdVO);

      if (!currentState) {
        return { success: false, error: 'Game state not found' };
      }

      // Build updated state
      let updatedState = currentState;

      // Update energy if provided
      if (dto.currentEnergy !== undefined || dto.maximumEnergy !== undefined) {
        const newEnergy = dto.currentEnergy ?? currentState.currentEnergy.value;
        const newMaxEnergy = dto.maximumEnergy ?? currentState.maximumEnergy;

        // Validate
        const validation = EnergyValidator.validate(newEnergy, newMaxEnergy);
        if (!validation.isValid) {
          return { success: false, error: validation.error ?? 'Invalid energy values' };
        }

        const energy = Energy.create(newEnergy, newMaxEnergy);
        updatedState = updatedState.updateEnergy(energy);
      }

      // Update health if provided
      if (dto.currentHealth !== undefined || dto.maximumHealth !== undefined) {
        const newHealth = dto.currentHealth ?? currentState.currentHealth.value;
        const newMaxHealth = dto.maximumHealth ?? currentState.maximumHealth;

        // Validate
        const validation = HealthValidator.validate(newHealth, newMaxHealth);
        if (!validation.isValid) {
          return { success: false, error: validation.error ?? 'Invalid health values' };
        }

        const health = Health.create(newHealth, newMaxHealth);
        updatedState = updatedState.updateHealth(health);
      }

      // Update session if provided
      if (dto.currentSession !== undefined) {
        const sessionValidation = SessionValidator.validateSessionId(dto.currentSession);
        if (!sessionValidation.isValid) {
          return { success: false, error: sessionValidation.error ?? 'Invalid session ID' };
        }
        const sessionId = SessionId.reconstruct(dto.currentSession);
        updatedState = updatedState.startSession(sessionId);
      }

      // Update active scene if provided
      if (dto.activeScene !== undefined) {
        updatedState = updatedState.changeScene(dto.activeScene);
      }

      // Update tutorial step if provided
      if (dto.tutorialStep !== undefined) {
        const tutorialStep = TutorialStep.create(dto.tutorialStep);
        updatedState = updatedState.copyWith({ tutorialStep });
      }

      // Update online status if provided
      if (dto.onlineStatus !== undefined) {
        updatedState = updatedState.setOnlineStatus(dto.onlineStatus);
      }

      // Record activity
      updatedState = updatedState.recordActivity();

      // Persist changes
      const savedState = await this.repository.update(updatedState);

      logger.info('Game state updated', { gameStateId });

      return { success: true, data: savedState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update game state';
      logger.error('Failed to update game state', err as Error, { gameStateId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Updates energy for a game state with clamping.
   *
   * @param gameStateId - The game state ID
   * @param newEnergy - New energy value
   * @returns ServiceResult with the updated game state
   */
  async updateEnergy(
    gameStateId: string,
    newEnergy: number
  ): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Updating energy', { gameStateId, newEnergy });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);
      const currentState = await this.repository.findById(gameStateIdVO);

      if (!currentState) {
        return { success: false, error: 'Game state not found' };
      }

      // Clamp energy to valid range [0, maximumEnergy]
      const clampedEnergy = Math.max(0, Math.min(newEnergy, currentState.maximumEnergy));

      // Create new energy value object
      const energy = Energy.create(clampedEnergy, currentState.maximumEnergy);

      // Update via repository
      const updatedState = await this.repository.updateEnergy(
        gameStateIdVO,
        energy.value,
        energy.maximum
      );

      logger.info('Energy updated', { gameStateId, newEnergy: clampedEnergy });

      return { success: true, data: updatedState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update energy';
      logger.error('Failed to update energy', err as Error, { gameStateId, newEnergy });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Adds energy to a game state.
   *
   * @param gameStateId - The game state ID
   * @param amount - Amount of energy to add
   * @returns ServiceResult with the updated game state
   */
  async addEnergy(
    gameStateId: string,
    amount: number
  ): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Adding energy', { gameStateId, amount });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);
      const currentState = await this.repository.findById(gameStateIdVO);

      if (!currentState) {
        return { success: false, error: 'Game state not found' };
      }

      if (amount < 0) {
        return { success: false, error: 'Amount cannot be negative' };
      }

      // Calculate new energy with clamping
      const newEnergy = Math.min(
        currentState.currentEnergy.value + amount,
        currentState.maximumEnergy
      );

      const energy = Energy.create(newEnergy, currentState.maximumEnergy);

      const updatedState = await this.repository.updateEnergy(
        gameStateIdVO,
        energy.value,
        energy.maximum
      );

      logger.info('Energy added', { gameStateId, amount, newEnergy });

      return { success: true, data: updatedState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add energy';
      logger.error('Failed to add energy', err as Error, { gameStateId, amount });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Consumes energy from a game state.
   *
   * @param gameStateId - The game state ID
   * @param amount - Amount of energy to consume
   * @returns ServiceResult with the updated game state
   */
  async consumeEnergy(
    gameStateId: string,
    amount: number
  ): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Consuming energy', { gameStateId, amount });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);
      const currentState = await this.repository.findById(gameStateIdVO);

      if (!currentState) {
        return { success: false, error: 'Game state not found' };
      }

      // Validate consumption
      const validation = EnergyValidator.validateConsumption(
        currentState.currentEnergy.value,
        amount
      );
      if (!validation.isValid) {
        return { success: false, error: validation.error ?? 'Insufficient energy' };
      }

      // Calculate new energy
      const newEnergy = Math.max(0, currentState.currentEnergy.value - amount);

      const energy = Energy.create(newEnergy, currentState.maximumEnergy);

      const updatedState = await this.repository.updateEnergy(
        gameStateIdVO,
        energy.value,
        energy.maximum
      );

      logger.info('Energy consumed', { gameStateId, amount, newEnergy });

      return { success: true, data: updatedState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to consume energy';
      logger.error('Failed to consume energy', err as Error, { gameStateId, amount });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Updates health for a game state with clamping.
   *
   * @param gameStateId - The game state ID
   * @param newHealth - New health value
   * @returns ServiceResult with the updated game state
   */
  async updateHealth(
    gameStateId: string,
    newHealth: number
  ): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Updating health', { gameStateId, newHealth });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);
      const currentState = await this.repository.findById(gameStateIdVO);

      if (!currentState) {
        return { success: false, error: 'Game state not found' };
      }

      // Clamp health to valid range [0, maximumHealth]
      const clampedHealth = Math.max(0, Math.min(newHealth, currentState.maximumHealth));

      // Create new health value object
      const health = Health.create(clampedHealth, currentState.maximumHealth);

      // Update via repository
      const updatedState = await this.repository.updateHealth(
        gameStateIdVO,
        health.value,
        health.maximum
      );

      logger.info('Health updated', { gameStateId, newHealth: clampedHealth });

      return { success: true, data: updatedState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update health';
      logger.error('Failed to update health', err as Error, { gameStateId, newHealth });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Heals a game state by adding health.
   *
   * @param gameStateId - The game state ID
   * @param amount - Amount of health to restore
   * @returns ServiceResult with the updated game state
   */
  async heal(
    gameStateId: string,
    amount: number
  ): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Healing', { gameStateId, amount });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);
      const currentState = await this.repository.findById(gameStateIdVO);

      if (!currentState) {
        return { success: false, error: 'Game state not found' };
      }

      if (amount < 0) {
        return { success: false, error: 'Healing amount cannot be negative' };
      }

      // Calculate new health with clamping
      const newHealth = Math.min(
        currentState.currentHealth.value + amount,
        currentState.maximumHealth
      );

      const health = Health.create(newHealth, currentState.maximumHealth);

      const updatedState = await this.repository.updateHealth(
        gameStateIdVO,
        health.value,
        health.maximum
      );

      logger.info('Health restored', { gameStateId, amount, newHealth });

      return { success: true, data: updatedState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to heal';
      logger.error('Failed to heal', err as Error, { gameStateId, amount });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Damages a game state by reducing health.
   *
   * @param gameStateId - The game state ID
   * @param amount - Amount of damage
   * @returns ServiceResult with the updated game state
   */
  async damage(
    gameStateId: string,
    amount: number
  ): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Taking damage', { gameStateId, amount });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);
      const currentState = await this.repository.findById(gameStateIdVO);

      if (!currentState) {
        return { success: false, error: 'Game state not found' };
      }

      // Validate damage
      const validation = HealthValidator.validateDamage(
        currentState.currentHealth.value,
        amount
      );
      if (!validation.isValid) {
        return { success: false, error: validation.error ?? 'Invalid damage amount' };
      }

      // Calculate new health
      const newHealth = Math.max(0, currentState.currentHealth.value - amount);

      const health = Health.create(newHealth, currentState.maximumHealth);

      const updatedState = await this.repository.updateHealth(
        gameStateIdVO,
        health.value,
        health.maximum
      );

      logger.info('Damage applied', { gameStateId, amount, newHealth });

      return { success: true, data: updatedState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply damage';
      logger.error('Failed to apply damage', err as Error, { gameStateId, amount });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Starts a new session for a game state.
   *
   * @param gameStateId - The game state ID
   * @returns ServiceResult with the updated game state
   */
  async startSession(gameStateId: string): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Starting session', { gameStateId });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);
      const currentState = await this.repository.findById(gameStateIdVO);

      if (!currentState) {
        return { success: false, error: 'Game state not found' };
      }

      // Generate new session ID
      const sessionId = SessionId.generate();

      // Update via repository
      const updatedState = await this.repository.updateSession(
        gameStateIdVO,
        sessionId.value,
        OnlineStatus.IN_SESSION,
        new Date()
      );

      logger.info('Session started', { gameStateId, sessionId: sessionId.value });

      return { success: true, data: updatedState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start session';
      logger.error('Failed to start session', err as Error, { gameStateId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Ends the current session for a game state.
   *
   * @param gameStateId - The game state ID
   * @returns ServiceResult with the updated game state
   */
  async endSession(gameStateId: string): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Ending session', { gameStateId });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);
      const currentState = await this.repository.findById(gameStateIdVO);

      if (!currentState) {
        return { success: false, error: 'Game state not found' };
      }

      // Update via repository with empty session
      const updatedState = await this.repository.updateSession(
        gameStateIdVO,
        SessionId.empty().value,
        OnlineStatus.OFFLINE,
        new Date()
      );

      logger.info('Session ended', { gameStateId });

      return { success: true, data: updatedState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end session';
      logger.error('Failed to end session', err as Error, { gameStateId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Updates last activity for a game state.
   *
   * @param gameStateId - The game state ID
   * @returns ServiceResult with the updated game state
   */
  async updateActivity(gameStateId: string): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Updating activity', { gameStateId });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);
      const currentState = await this.repository.findById(gameStateIdVO);

      if (!currentState) {
        return { success: false, error: 'Game state not found' };
      }

      const updatedState = await this.repository.updateSession(
        gameStateIdVO,
        currentState.currentSession.value,
        currentState.onlineStatus,
        new Date()
      );

      return { success: true, data: updatedState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update activity';
      logger.error('Failed to update activity', err as Error, { gameStateId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Resets a game state to initial values.
   *
   * @param gameStateId - The game state ID
   * @returns ServiceResult with the reset game state
   */
  async resetGameState(gameStateId: string): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Resetting game state', { gameStateId });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);

      // Check if exists
      const exists = await this.repository.exists(gameStateIdVO);
      if (!exists) {
        return { success: false, error: 'Game state not found' };
      }

      // Reset via repository
      const resetState = await this.repository.reset(gameStateIdVO);

      logger.info('Game state reset', { gameStateId });

      return { success: true, data: resetState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset game state';
      logger.error('Failed to reset game state', err as Error, { gameStateId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Deletes a game state (soft delete).
   *
   * @param gameStateId - The game state ID
   * @returns ServiceResult
   */
  async deleteGameState(gameStateId: string): Promise<GameStateServiceResult<void>> {
    logger.debug('Deleting game state', { gameStateId });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);

      // Check if exists
      const exists = await this.repository.exists(gameStateIdVO);
      if (!exists) {
        return { success: false, error: 'Game state not found' };
      }

      await this.repository.delete(gameStateIdVO);

      logger.info('Game state deleted', { gameStateId });

      return { success: true, data: undefined };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete game state';
      logger.error('Failed to delete game state', err as Error, { gameStateId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Restores a deleted game state.
   *
   * @param gameStateId - The game state ID
   * @returns ServiceResult with the restored game state
   */
  async restoreGameState(gameStateId: string): Promise<GameStateServiceResult<GameState>> {
    logger.debug('Restoring game state', { gameStateId });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);

      const restoredState = await this.repository.restore(gameStateIdVO);

      logger.info('Game state restored', { gameStateId });

      return { success: true, data: restoredState };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore game state';
      logger.error('Failed to restore game state', err as Error, { gameStateId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Checks if a game state exists.
   *
   * @param gameStateId - The game state ID
   * @returns ServiceResult with boolean
   */
  async gameStateExists(gameStateId: string): Promise<GameStateServiceResult<boolean>> {
    logger.debug('Checking if game state exists', { gameStateId });

    try {
      const gameStateIdVO = GameStateId.reconstruct(gameStateId);
      const exists = await this.repository.exists(gameStateIdVO);
      return { success: true, data: exists };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check game state existence';
      logger.error('Failed to check game state existence', err as Error, { gameStateId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads game state and returns response DTO.
   *
   * @param gameStateId - The game state ID
   * @returns ServiceResult with response DTO
   */
  async loadGameStateResponse(gameStateId: string): Promise<GameStateServiceResult<GameStateResponseDto>> {
    const result = await this.loadGameState(gameStateId);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const responseDto = GameStateMapper.toResponse(result.data);
    return { success: true, data: responseDto };
  }

  /**
   * Loads game state and returns summary DTO.
   *
   * @param gameStateId - The game state ID
   * @returns ServiceResult with summary DTO
   */
  async loadGameStateSummary(gameStateId: string): Promise<GameStateServiceResult<GameStateSummaryDto>> {
    const result = await this.loadGameState(gameStateId);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const summaryDto = GameStateMapper.toSummary(result.data);
    return { success: true, data: summaryDto };
  }

  /**
   * Lists game states with pagination.
   *
   * @param params - Pagination parameters
   * @returns ServiceResult with paginated game states
   */
  async listGameStates(
    params: PaginationParams
  ): Promise<GameStateServiceResult<PaginatedResult<GameStateResponseDto>>> {
    logger.debug('Listing game states', { params });

    try {
      const result = await this.repository.list(params);

      const responseItems = result.items.map((state) => GameStateMapper.toResponse(state));

      return {
        success: true,
        data: {
          ...result,
          items: responseItems,
        },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list game states';
      logger.error('Failed to list game states', err as Error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets total game state count.
   *
   * @returns ServiceResult with count
   */
  async getGameStateCount(): Promise<GameStateServiceResult<number>> {
    try {
      const count = await this.repository.count();
      return { success: true, data: count };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to count game states';
      logger.error('Failed to count game states', err as Error);
      return { success: false, error: errorMessage };
    }
  }
}

/**
 * Create a new GameStateService instance.
 */
export function createGameStateService(): GameStateService {
  return new GameStateService();
}