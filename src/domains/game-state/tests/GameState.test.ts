/**
 * GameState Unit Tests
 *
 * Tests for GameState entity and related functionality.
 */

import { describe, it, expect } from 'vitest';
import { GameState } from '../entities/GameState';
import { GameStateId } from '../value-objects/GameStateId';
import { Energy } from '../value-objects/Energy';
import { Health } from '../value-objects/Health';
import { SessionId } from '../value-objects/SessionId';
import { TutorialStep, TutorialStepValue } from '../value-objects/TutorialStep';
import { OnlineStatus } from '../types/OnlineStatus';
import { GameScene } from '../types/GameScene';

describe('GameState Entity', () => {
  const validGameStateId = GameStateId.reconstruct('123e4567-e89b-12d3-a456-426614174000');
  const validPlayerProfileId = '123e4567-e89b-12d3-a456-426614174001';

  describe('create', () => {
    it('should create a new game state with default values', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      expect(gameState.gameStateId).toEqual(validGameStateId);
      expect(gameState.playerProfileId).toBe(validPlayerProfileId);
      expect(gameState.maximumEnergy).toBe(100);
      expect(gameState.currentEnergy.value).toBe(100);
      expect(gameState.maximumHealth).toBe(100);
      expect(gameState.currentHealth.value).toBe(100);
      expect(gameState.currentSession.isEmpty).toBe(true);
      expect(gameState.activeScene).toBe(GameScene.MAIN_MENU);
      expect(gameState.tutorialStep.numericValue).toBe(TutorialStepValue.NOT_STARTED);
      expect(gameState.onlineStatus).toBe(OnlineStatus.OFFLINE);
    });

    it('should create a new game state with custom max values', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
        maximumEnergy: 150,
        maximumHealth: 200,
      });

      expect(gameState.maximumEnergy).toBe(150);
      expect(gameState.currentEnergy.value).toBe(150);
      expect(gameState.maximumHealth).toBe(200);
      expect(gameState.currentHealth.value).toBe(200);
    });

    it('should set createdAt and updatedAt timestamps', () => {
      const beforeCreate = new Date();
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });
      const afterCreate = new Date();

      expect(gameState.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(gameState.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(gameState.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(gameState.updatedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });
  });

  describe('fromDatabase', () => {
    it('should reconstruct game state from database record', () => {
      const record = {
        game_state_id: '123e4567-e89b-12d3-a456-426614174000',
        player_profile_id: '123e4567-e89b-12d3-a456-426614174001',
        current_energy: 75,
        maximum_energy: 100,
        current_health: 80,
        maximum_health: 100,
        current_session: '00000000-0000-4000-8000-000000000000',
        active_scene: 'single_player',
        tutorial_step: 5,
        online_status: 'online',
        last_activity: '2024-01-15T10:00:00.000Z',
        created_at: '2024-01-10T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z',
      };

      const gameState = GameState.fromDatabase(record);

      expect(gameState.gameStateId.value).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(gameState.playerProfileId).toBe('123e4567-e89b-12d3-a456-426614174001');
      expect(gameState.currentEnergy.value).toBe(75);
      expect(gameState.maximumEnergy).toBe(100);
      expect(gameState.currentHealth.value).toBe(80);
      expect(gameState.maximumHealth).toBe(100);
      expect(gameState.activeScene).toBe(GameScene.SINGLE_PLAYER);
      expect(gameState.tutorialStep.numericValue).toBe(5);
      expect(gameState.onlineStatus).toBe(OnlineStatus.ONLINE);
    });
  });

  describe('copyWith', () => {
    it('should create a copy with updated fields', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const updatedState = gameState.copyWith({
        activeScene: GameScene.SINGLE_PLAYER,
        onlineStatus: OnlineStatus.ONLINE,
      });

      expect(updatedState.activeScene).toBe(GameScene.SINGLE_PLAYER);
      expect(updatedState.onlineStatus).toBe(OnlineStatus.ONLINE);
      expect(updatedState.gameStateId).toEqual(gameState.gameStateId);
      expect(updatedState.playerProfileId).toBe(gameState.playerProfileId);
    });

    it('should preserve unchanged fields', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const updatedState = gameState.copyWith({
        onlineStatus: OnlineStatus.ONLINE,
      });

      expect(updatedState.currentEnergy.value).toBe(gameState.currentEnergy.value);
      expect(updatedState.maximumEnergy).toBe(gameState.maximumEnergy);
      expect(updatedState.currentHealth.value).toBe(gameState.currentHealth.value);
    });

    it('should update the updatedAt timestamp', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const originalUpdatedAt = gameState.updatedAt;

      const updatedState = gameState.copyWith({
        onlineStatus: OnlineStatus.ONLINE,
      });

      expect(updatedState.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('updateEnergy', () => {
    it('should update energy values', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const newEnergy = Energy.create(50, 100);
      const updatedState = gameState.updateEnergy(newEnergy);

      expect(updatedState.currentEnergy.value).toBe(50);
      expect(updatedState.maximumEnergy).toBe(100);
    });

    it('should preserve other state', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const newEnergy = Energy.create(50, 100);
      const updatedState = gameState.updateEnergy(newEnergy);

      expect(updatedState.currentHealth.value).toBe(gameState.currentHealth.value);
      expect(updatedState.activeScene).toBe(gameState.activeScene);
    });
  });

  describe('updateHealth', () => {
    it('should update health values', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const newHealth = Health.create(75, 100);
      const updatedState = gameState.updateHealth(newHealth);

      expect(updatedState.currentHealth.value).toBe(75);
      expect(updatedState.maximumHealth).toBe(100);
    });
  });

  describe('startSession', () => {
    it('should start a new session', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const sessionId = SessionId.generate();
      const updatedState = gameState.startSession(sessionId);

      expect(updatedState.currentSession.value).toBe(sessionId.value);
      expect(updatedState.currentSession.isEmpty).toBe(false);
    });
  });

  describe('endSession', () => {
    it('should end the current session', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const sessionId = SessionId.generate();
      const withSession = gameState.startSession(sessionId);
      const endedState = withSession.endSession();

      expect(endedState.currentSession.isEmpty).toBe(true);
    });
  });

  describe('changeScene', () => {
    it('should change the active scene', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const updatedState = gameState.changeScene(GameScene.SINGLE_PLAYER);

      expect(updatedState.activeScene).toBe(GameScene.SINGLE_PLAYER);
    });
  });

  describe('advanceTutorial', () => {
    it('should advance to the next tutorial step', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const updatedState = gameState.advanceTutorial();

      expect(updatedState.tutorialStep.numericValue).toBe(TutorialStepValue.WELCOME);
    });

    it('should not advance beyond completion', () => {
      const completedState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      }).completeTutorial();

      const advancedState = completedState.advanceTutorial();

      expect(advancedState.tutorialStep.numericValue).toBe(TutorialStepValue.COMPLETED);
    });
  });

  describe('completeTutorial', () => {
    it('should mark tutorial as completed', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const completedState = gameState.completeTutorial();

      expect(completedState.tutorialStep.isCompleted).toBe(true);
      expect(completedState.tutorialStep.numericValue).toBe(TutorialStepValue.COMPLETED);
    });
  });

  describe('setOnlineStatus', () => {
    it('should update online status', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const updatedState = gameState.setOnlineStatus(OnlineStatus.ONLINE);

      expect(updatedState.onlineStatus).toBe(OnlineStatus.ONLINE);
    });
  });

  describe('recordActivity', () => {
    it('should update last activity timestamp', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const beforeActivity = new Date();
      const updatedState = gameState.recordActivity();
      const afterActivity = new Date();

      expect(updatedState.lastActivity.getTime()).toBeGreaterThanOrEqual(beforeActivity.getTime());
      expect(updatedState.lastActivity.getTime()).toBeLessThanOrEqual(afterActivity.getTime());
    });
  });

  describe('toJSON', () => {
    it('should serialize game state to JSON', () => {
      const gameState = GameState.create({
        gameStateId: validGameStateId,
        playerProfileId: validPlayerProfileId,
      });

      const json = gameState.toJSON();

      expect(json.gameStateId).toBe(validGameStateId.value);
      expect(json.playerProfileId).toBe(validPlayerProfileId);
      expect(json.currentEnergy).toBe(100);
      expect(json.maximumEnergy).toBe(100);
      expect(json.currentHealth).toBe(100);
      expect(json.maximumHealth).toBe(100);
      expect(typeof json.createdAt).toBe('string');
      expect(typeof json.updatedAt).toBe('string');
    });
  });
});

describe('Energy Value Object', () => {
  describe('create', () => {
    it('should create energy with valid values', () => {
      const energy = Energy.create(50, 100);
      expect(energy.value).toBe(50);
      expect(energy.maximum).toBe(100);
    });

    it('should reject negative energy', () => {
      expect(() => Energy.create(-1, 100)).toThrow();
    });

    it('should reject energy above maximum', () => {
      expect(() => Energy.create(101, 100)).toThrow();
    });

    it('should reject maximum above limit', () => {
      expect(() => Energy.create(50, 1000)).toThrow();
    });
  });

  describe('start', () => {
    it('should create full energy', () => {
      const energy = Energy.start(100);
      expect(energy.value).toBe(100);
      expect(energy.maximum).toBe(100);
      expect(energy.isFull).toBe(true);
    });
  });

  describe('withValue', () => {
    it('should create new energy with updated value', () => {
      const energy = Energy.create(50, 100);
      const newEnergy = energy.withValue(75);
      expect(newEnergy.value).toBe(75);
      expect(energy.value).toBe(50); // Original unchanged
    });
  });

  describe('canAfford', () => {
    it('should return true if enough energy', () => {
      const energy = Energy.create(50, 100);
      expect(energy.canAfford(30)).toBe(true);
    });

    it('should return false if not enough energy', () => {
      const energy = Energy.create(50, 100);
      expect(energy.canAfford(60)).toBe(false);
    });
  });

  describe('percentage', () => {
    it('should calculate correct percentage', () => {
      const energy = Energy.create(75, 100);
      expect(energy.percentage).toBe(75);
    });

    it('should return 0 for zero maximum', () => {
      const energy = Energy.reconstruct(0, 0);
      expect(energy.percentage).toBe(0);
    });
  });
});

describe('Health Value Object', () => {
  describe('create', () => {
    it('should create health with valid values', () => {
      const health = Health.create(50, 100);
      expect(health.value).toBe(50);
      expect(health.maximum).toBe(100);
    });

    it('should reject negative health', () => {
      expect(() => Health.create(-1, 100)).toThrow();
    });

    it('should reject health above maximum', () => {
      expect(() => Health.create(101, 100)).toThrow();
    });
  });

  describe('start', () => {
    it('should create full health', () => {
      const health = Health.start(100);
      expect(health.value).toBe(100);
      expect(health.maximum).toBe(100);
      expect(health.isFull).toBe(true);
    });
  });

  describe('isDepleted', () => {
    it('should return true when health is 0', () => {
      const health = Health.create(0, 100);
      expect(health.isDepleted).toBe(true);
    });

    it('should return false when health is positive', () => {
      const health = Health.create(50, 100);
      expect(health.isDepleted).toBe(false);
    });
  });

  describe('isCritical', () => {
    it('should return true when health is at or below 25%', () => {
      const health = Health.create(20, 100);
      expect(health.isCritical).toBe(true);
    });

    it('should return false when health is above 25%', () => {
      const health = Health.create(30, 100);
      expect(health.isCritical).toBe(false);
    });

    it('should return false when health is 0', () => {
      const health = Health.create(0, 100);
      expect(health.isCritical).toBe(false);
    });
  });

  describe('canSurvive', () => {
    it('should return true if damage would not kill', () => {
      const health = Health.create(50, 100);
      expect(health.canSurvive(30)).toBe(true);
    });

    it('should return false if damage would kill', () => {
      const health = Health.create(50, 100);
      expect(health.canSurvive(51)).toBe(false);
    });
  });
});

describe('SessionId Value Object', () => {
  describe('create', () => {
    it('should create session ID with valid UUID', () => {
      // Valid UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const sessionId = SessionId.create('123e4567-e89b-42d3-a456-426614174000');
      expect(sessionId.value).toBe('123e4567-e89b-42d3-a456-426614174000');
    });

    it('should reject empty string', () => {
      expect(() => SessionId.create('')).toThrow();
    });

    it('should reject invalid UUID format', () => {
      expect(() => SessionId.create('invalid-uuid')).toThrow();
    });
  });

  describe('generate', () => {
    it('should generate valid UUID', () => {
      const sessionId = SessionId.generate();
      expect(sessionId.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('empty', () => {
    it('should create empty session ID', () => {
      const sessionId = SessionId.empty();
      expect(sessionId.isEmpty).toBe(true);
      expect(sessionId.value).toBe('00000000-0000-4000-8000-000000000000');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty session', () => {
      const sessionId = SessionId.empty();
      expect(sessionId.isEmpty).toBe(true);
    });

    it('should return false for non-empty session', () => {
      const sessionId = SessionId.generate();
      expect(sessionId.isEmpty).toBe(false);
    });
  });
});

describe('TutorialStep Value Object', () => {
  describe('create', () => {
    it('should create tutorial step with valid value', () => {
      const step = TutorialStep.create(5);
      expect(step.numericValue).toBe(5);
    });

    it('should reject negative value', () => {
      expect(() => TutorialStep.create(-1)).toThrow();
    });

    it('should reject value above maximum', () => {
      expect(() => TutorialStep.create(100)).toThrow();
    });
  });

  describe('start', () => {
    it('should create NOT_STARTED step', () => {
      const step = TutorialStep.start();
      expect(step.numericValue).toBe(TutorialStepValue.NOT_STARTED);
      expect(step.isNotStarted).toBe(true);
    });
  });

  describe('complete', () => {
    it('should create COMPLETED step', () => {
      const step = TutorialStep.complete();
      expect(step.numericValue).toBe(TutorialStepValue.COMPLETED);
      expect(step.isCompleted).toBe(true);
    });
  });

  describe('next', () => {
    it('should advance to next step', () => {
      const step = TutorialStep.start();
      const nextStep = step.next();
      expect(nextStep.numericValue).toBe(TutorialStepValue.WELCOME);
    });

    it('should not advance beyond COMPLETED', () => {
      const step = TutorialStep.complete();
      const nextStep = step.next();
      expect(nextStep.numericValue).toBe(TutorialStepValue.COMPLETED);
    });
  });

  describe('isInProgress', () => {
    it('should return true for step between NOT_STARTED and COMPLETED', () => {
      const step = TutorialStep.create(5);
      expect(step.isInProgress).toBe(true);
    });

    it('should return false for NOT_STARTED', () => {
      const step = TutorialStep.start();
      expect(step.isInProgress).toBe(false);
    });

    it('should return false for COMPLETED', () => {
      const step = TutorialStep.complete();
      expect(step.isInProgress).toBe(false);
    });
  });
});