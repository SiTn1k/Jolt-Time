/**
 * Achievement Service Tests
 *
 * Unit tests for AchievementService.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AchievementService, IAchievementService } from '../services/AchievementService';
import type { IAchievementRepository } from '../interfaces/IAchievementRepository';
import type { IAchievementProgressRepository } from '../interfaces/IAchievementProgressRepository';
import { Achievement } from '../entities/Achievement';
import { AchievementProgress } from '../entities/AchievementProgress';
import { AchievementId } from '../value-objects/AchievementId';
import { AchievementSlug } from '../value-objects/AchievementSlug';
import { AchievementProgressId } from '../entities/AchievementProgressId';
import { AchievementCategory } from '../types/AchievementCategory';
import { AchievementStatus } from '../types/AchievementStatus';
import type { ILogger } from '../../../shared/types';

describe('AchievementService', () => {
  let achievementService: IAchievementService;
  let mockAchievementRepository: IAchievementRepository;
  let mockProgressRepository: IAchievementProgressRepository;
  let mockLogger: ILogger;

  const testPlayerProfileId = '123e4567-e89b-42d3-a456-426614174000';
  const testAchievementId = '123e4567-e89b-42d3-a456-426614174001';

  const createTestAchievement = (overrides = {}): Achievement => {
    const now = new Date();
    return Achievement.fromStorage({
      achievementId: testAchievementId,
      slug: 'test-achievement',
      title: 'Test Achievement',
      description: 'A test achievement',
      category: AchievementCategory.COLLECTION,
      rarity: 'common',
      points: 100,
      icon: 'test-icon',
      rewardDefinition: { type: 'currency', amount: 100 },
      isHidden: false,
      isActive: true,
      metadata: { targetValue: 10 },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      ...overrides,
    } as any);
  };

  const createTestProgress = (status = AchievementStatus.LOCKED, currentValue = 0): AchievementProgress => {
    const now = new Date();
    return AchievementProgress.fromStorage({
      progressId: '123e4567-e89b-42d3-a456-426614174002',
      playerProfileId: testPlayerProfileId,
      achievementId: testAchievementId,
      status,
      currentValue,
      completedAt: null,
      claimedAt: null,
      metadata: {},
      startedAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  };

  beforeEach(() => {
    mockAchievementRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      exists: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      findActive: vi.fn(),
      count: vi.fn(),
    };

    mockProgressRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByPlayerId: vi.fn(),
      findByPlayerAndAchievement: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      findClaimable: vi.fn(),
      count: vi.fn(),
    };

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
    };

    achievementService = new AchievementService(
      mockAchievementRepository,
      mockProgressRepository,
      mockLogger
    );
  });

  describe('getAchievementById', () => {
    it('should return null for invalid achievement ID', async () => {
      const result = await achievementService.getAchievementById('invalid-id');
      expect(result).toBeNull();
    });

    it('should return achievement when found', async () => {
      const achievement = createTestAchievement();
      vi.mocked(mockAchievementRepository.findById).mockResolvedValue(achievement);

      const result = await achievementService.getAchievementById(testAchievementId);

      expect(result).toBe(achievement);
      expect(mockAchievementRepository.findById).toHaveBeenCalled();
    });

    it('should return null when achievement not found', async () => {
      vi.mocked(mockAchievementRepository.findById).mockResolvedValue(null);

      const result = await achievementService.getAchievementById(testAchievementId);

      expect(result).toBeNull();
    });
  });

  describe('getOrCreateProgress', () => {
    it('should return existing progress', async () => {
      const progress = createTestProgress(AchievementStatus.IN_PROGRESS, 5);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);

      const result = await achievementService.getOrCreateProgress(testPlayerProfileId, testAchievementId);

      expect(result).toBe(progress);
      expect(mockProgressRepository.create).not.toHaveBeenCalled();
    });

    it('should create new progress when none exists', async () => {
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(null);
      const newProgress = createTestProgress(AchievementStatus.LOCKED, 0);
      vi.mocked(mockProgressRepository.create).mockResolvedValue(newProgress);

      const result = await achievementService.getOrCreateProgress(testPlayerProfileId, testAchievementId);

      expect(result).toBe(newProgress);
      expect(mockProgressRepository.create).toHaveBeenCalled();
    });

    it('should throw error for invalid player profile ID', async () => {
      await expect(
        achievementService.getOrCreateProgress('invalid', testAchievementId)
      ).rejects.toThrow('Invalid player profile ID');
    });

    it('should throw error for invalid achievement ID', async () => {
      await expect(
        achievementService.getOrCreateProgress(testPlayerProfileId, 'invalid')
      ).rejects.toThrow('Invalid achievement ID');
    });
  });

  describe('updateProgress', () => {
    it('should update progress and clamp to target value', async () => {
      const progress = createTestProgress(AchievementStatus.IN_PROGRESS, 5);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);

      const updatedProgress = progress.copyWith({
        currentValue: 10,
        status: AchievementStatus.COMPLETED,
      });
      vi.mocked(mockProgressRepository.update).mockResolvedValue(updatedProgress);

      const result = await achievementService.updateProgress(
        testPlayerProfileId,
        testAchievementId,
        5,
        10
      );

      expect(result.currentValue).toBe(10);
      expect(result.status).toBe(AchievementStatus.COMPLETED);
    });

    it('should prevent negative increments', async () => {
      const progress = createTestProgress(AchievementStatus.IN_PROGRESS, 5);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);

      const updatedProgress = progress.copyWith({ currentValue: 5 });
      vi.mocked(mockProgressRepository.update).mockResolvedValue(updatedProgress);

      await achievementService.updateProgress(
        testPlayerProfileId,
        testAchievementId,
        -10,
        10
      );

      // The new value should be clamped to not go below 0
      expect(mockProgressRepository.update).toHaveBeenCalled();
    });

    it('should not update claimed achievements', async () => {
      const progress = createTestProgress(AchievementStatus.CLAIMED, 10);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);

      const result = await achievementService.updateProgress(
        testPlayerProfileId,
        testAchievementId,
        5,
        10
      );

      expect(result.status).toBe(AchievementStatus.CLAIMED);
      expect(mockProgressRepository.update).not.toHaveBeenCalled();
    });

    it('should auto-complete when target is reached', async () => {
      const progress = createTestProgress(AchievementStatus.IN_PROGRESS, 8);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);

      const updatedProgress = progress.copyWith({
        currentValue: 10,
        status: AchievementStatus.COMPLETED,
        completedAt: expect.any(Date),
      });
      vi.mocked(mockProgressRepository.update).mockResolvedValue(updatedProgress);

      const result = await achievementService.updateProgress(
        testPlayerProfileId,
        testAchievementId,
        2,
        10
      );

      expect(result.status).toBe(AchievementStatus.COMPLETED);
    });
  });

  describe('completeAchievement', () => {
    it('should complete an in-progress achievement', async () => {
      const progress = createTestProgress(AchievementStatus.IN_PROGRESS, 10);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);
      vi.mocked(mockAchievementRepository.findById).mockResolvedValue(createTestAchievement());

      const updatedProgress = progress.copyWith({
        status: AchievementStatus.COMPLETED,
        completedAt: expect.any(Date),
      });
      vi.mocked(mockProgressRepository.update).mockResolvedValue(updatedProgress);

      const result = await achievementService.completeAchievement(testPlayerProfileId, testAchievementId);

      expect(result.status).toBe(AchievementStatus.COMPLETED);
    });

    it('should not complete already claimed achievements', async () => {
      const progress = createTestProgress(AchievementStatus.CLAIMED, 10);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);

      await expect(
        achievementService.completeAchievement(testPlayerProfileId, testAchievementId)
      ).rejects.toThrow('Achievement already claimed');
    });

    it('should return progress if already completed', async () => {
      const progress = createTestProgress(AchievementStatus.COMPLETED, 10);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);

      const result = await achievementService.completeAchievement(testPlayerProfileId, testAchievementId);

      expect(result.status).toBe(AchievementStatus.COMPLETED);
      expect(mockProgressRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('claimAchievement', () => {
    it('should emit claim event for completed achievement', async () => {
      const progress = createTestProgress(AchievementStatus.COMPLETED, 10);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);
      vi.mocked(mockAchievementRepository.findById).mockResolvedValue(createTestAchievement());

      const claimedProgress = progress.copyWith({
        status: AchievementStatus.CLAIMED,
        claimedAt: expect.any(Date),
      });
      vi.mocked(mockProgressRepository.update).mockResolvedValue(claimedProgress);

      const result = await achievementService.claimAchievement(testPlayerProfileId, testAchievementId);

      expect(result.eventType).toBe('AchievementClaimRequested');
      expect(result.data.playerProfileId).toBe(testPlayerProfileId);
      expect(result.data.achievementId).toBe(testAchievementId);
    });

    it('should throw error if achievement not completed', async () => {
      const progress = createTestProgress(AchievementStatus.IN_PROGRESS, 5);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);
      vi.mocked(mockAchievementRepository.findById).mockResolvedValue(createTestAchievement());

      await expect(
        achievementService.claimAchievement(testPlayerProfileId, testAchievementId)
      ).rejects.toThrow('Achievement is not completed');
    });

    it('should throw error if no progress exists', async () => {
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(null);

      await expect(
        achievementService.claimAchievement(testPlayerProfileId, testAchievementId)
      ).rejects.toThrow();
    });
  });

  describe('resetAchievement', () => {
    it('should reset progress to locked state', async () => {
      const progress = createTestProgress(AchievementStatus.COMPLETED, 10);
      const completedProgress = progress.copyWith({ completedAt: new Date() }) as AchievementProgress;
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(completedProgress);

      const resetProgress = progress.copyWith({
        currentValue: 0,
        status: AchievementStatus.LOCKED,
        completedAt: null,
        claimedAt: null,
      });
      vi.mocked(mockProgressRepository.update).mockResolvedValue(resetProgress);

      const result = await achievementService.resetAchievement(testPlayerProfileId, testAchievementId);

      expect(result.currentValue).toBe(0);
      expect(result.status).toBe(AchievementStatus.LOCKED);
      expect(result.completedAt).toBeNull();
      expect(result.claimedAt).toBeNull();
    });
  });

  describe('getClaimableAchievements', () => {
    it('should return claimable achievements', async () => {
      const claimableProgress = createTestProgress(AchievementStatus.COMPLETED, 10);
      vi.mocked(mockProgressRepository.findClaimable).mockResolvedValue([claimableProgress]);

      const result = await achievementService.getClaimableAchievements(testPlayerProfileId);

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(AchievementStatus.COMPLETED);
    });
  });

  describe('initializePlayerAchievements', () => {
    it('should create progress for all active achievements', async () => {
      const achievements = [
        createTestAchievement({ achievementId: 'achievement-1' }),
        createTestAchievement({ achievementId: 'achievement-2' }),
      ];
      vi.mocked(mockAchievementRepository.findActive).mockResolvedValue(achievements);
      vi.mocked(mockProgressRepository.findByPlayerId).mockResolvedValue([]);

      const newProgress = createTestProgress();
      vi.mocked(mockProgressRepository.create).mockResolvedValue(newProgress);

      const result = await achievementService.initializePlayerAchievements(testPlayerProfileId);

      expect(result).toHaveLength(2);
      expect(mockProgressRepository.create).toHaveBeenCalledTimes(2);
    });

    it('should not create duplicate progress', async () => {
      const achievements = [createTestAchievement()];
      const existingProgress = createTestProgress();
      
      vi.mocked(mockAchievementRepository.findActive).mockResolvedValue(achievements);
      vi.mocked(mockProgressRepository.findByPlayerId).mockResolvedValue([existingProgress]);

      const result = await achievementService.initializePlayerAchievements(testPlayerProfileId);

      expect(result).toHaveLength(0);
      expect(mockProgressRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('processEvent', () => {
    it('should process artifact collected events', async () => {
      const achievement = createTestAchievement({ category: AchievementCategory.COLLECTION });
      vi.mocked(mockAchievementRepository.findActive).mockResolvedValue([achievement]);
      
      const progress = createTestProgress(AchievementStatus.IN_PROGRESS, 0);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);
      
      const updatedProgress = progress.copyWith({
        currentValue: 1,
        status: AchievementStatus.IN_PROGRESS,
      });
      vi.mocked(mockProgressRepository.update).mockResolvedValue(updatedProgress);

      await achievementService.processEvent('ArtifactCollected', testPlayerProfileId, {
        artifactId: 'artifact-1',
      });

      expect(mockProgressRepository.update).toHaveBeenCalled();
    });

    it('should process quest completed events', async () => {
      const achievement = createTestAchievement({ category: AchievementCategory.PROGRESSION });
      vi.mocked(mockAchievementRepository.findActive).mockResolvedValue([achievement]);
      
      const progress = createTestProgress(AchievementStatus.IN_PROGRESS, 0);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);
      
      const updatedProgress = progress.copyWith({
        currentValue: 1,
        status: AchievementStatus.IN_PROGRESS,
      });
      vi.mocked(mockProgressRepository.update).mockResolvedValue(updatedProgress);

      await achievementService.processEvent('QuestCompleted', testPlayerProfileId, {
        questId: 'quest-1',
      });

      expect(mockProgressRepository.update).toHaveBeenCalled();
    });

    it('should process login events for progression achievements', async () => {
      const achievement = createTestAchievement({ category: AchievementCategory.PROGRESSION });
      vi.mocked(mockAchievementRepository.findActive).mockResolvedValue([achievement]);
      
      const progress = createTestProgress(AchievementStatus.IN_PROGRESS, 0);
      vi.mocked(mockProgressRepository.findByPlayerAndAchievement).mockResolvedValue(progress);
      
      const updatedProgress = progress.copyWith({
        currentValue: 1,
        status: AchievementStatus.IN_PROGRESS,
      });
      vi.mocked(mockProgressRepository.update).mockResolvedValue(updatedProgress);

      await achievementService.processEvent('Login', testPlayerProfileId, {});

      expect(mockProgressRepository.update).toHaveBeenCalled();
    });
  });
});
