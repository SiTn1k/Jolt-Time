/**
 * Game State Mapper
 *
 * Maps between GameState entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { GameState } from '../entities/GameState';
import type { GameStateRecord } from '../entities/GameState';
import type { CreateGameStateDto } from '../dto/CreateGameState.dto';
import type { UpdateGameStateDto } from '../dto/UpdateGameState.dto';
import type { GameStateResponseDto, GameStateSummaryDto } from '../dto/GameStateResponse.dto';
import { TutorialStepValue } from '../value-objects/TutorialStep';

/**
 * Mapper for converting between GameState entity and DTOs.
 */
export class GameStateMapper {
  /**
   * Converts a GameState entity to GameStateResponseDto.
   */
  public static toResponse(gameState: GameState): GameStateResponseDto {
    return {
      gameStateId: gameState.gameStateId.value,
      playerProfileId: gameState.playerProfileId,
      currentEnergy: gameState.currentEnergy.value,
      maximumEnergy: gameState.maximumEnergy,
      energyPercentage: gameState.currentEnergy.percentage,
      currentHealth: gameState.currentHealth.value,
      maximumHealth: gameState.maximumHealth,
      healthPercentage: gameState.currentHealth.percentage,
      currentSession: gameState.currentSession.value,
      hasActiveSession: !gameState.currentSession.isEmpty,
      activeScene: gameState.activeScene,
      tutorialStep: gameState.tutorialStep.numericValue,
      tutorialCompleted: gameState.tutorialStep.isCompleted,
      onlineStatus: gameState.onlineStatus,
      lastActivity: gameState.lastActivity.toISOString(),
      createdAt: gameState.createdAt.toISOString(),
      updatedAt: gameState.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a GameState entity to GameStateSummaryDto.
   */
  public static toSummary(gameState: GameState): GameStateSummaryDto {
    return {
      gameStateId: gameState.gameStateId.value,
      playerProfileId: gameState.playerProfileId,
      currentEnergy: gameState.currentEnergy.value,
      maximumEnergy: gameState.maximumEnergy,
      currentHealth: gameState.currentHealth.value,
      maximumHealth: gameState.maximumHealth,
      onlineStatus: gameState.onlineStatus,
      activeScene: gameState.activeScene,
    };
  }

  /**
   * Converts an array of GameState entities to GameStateResponseDto array.
   */
  public static toResponseList(gameStates: GameState[]): GameStateResponseDto[] {
    return gameStates.map((gameState) => this.toResponse(gameState));
  }

  /**
   * Converts an array of GameState entities to GameStateSummaryDto array.
   */
  public static toSummaryList(gameStates: GameState[]): GameStateSummaryDto[] {
    return gameStates.map((gameState) => this.toSummary(gameState));
  }

  /**
   * Converts a CreateGameStateDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateGameStateDto): Omit<CreateGameStateDto, never> {
    return {
      playerProfileId: dto.playerProfileId,
      maximumEnergy: dto.maximumEnergy,
      maximumHealth: dto.maximumHealth,
    };
  }

  /**
   * Converts an UpdateGameStateDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateGameStateDto): Partial<GameState> {
    return {
      activeScene: dto.activeScene as GameState['activeScene'],
      onlineStatus: dto.onlineStatus as GameState['onlineStatus'],
      tutorialStep: dto.tutorialStep as unknown as GameState['tutorialStep'],
    } as Partial<GameState>;
  }

  /**
   * Converts a database record to CreateGameStateDto format.
   */
  public static fromRecordToDto(record: GameStateRecord): CreateGameStateDto {
    return {
      playerProfileId: record.player_profile_id,
      maximumEnergy: record.maximum_energy,
      maximumHealth: record.maximum_health,
    };
  }

  /**
   * Converts a GameState entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(gameState: GameState): Omit<GameStateRecord, never> {
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
}