/**
 * Quest Service Tests
 *
 * Unit tests for the QuestService.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuestService } from '../services/QuestService';
import { IQuestRepository } from '../interfaces/IQuestRepository';
import { IQuestProgressRepository } from '../interfaces/IQuestProgressRepository';
import { Quest } from '../entities/Quest';
import { QuestId } from '../value-objects/QuestId';
import { QuestSlug } from '../value-objects/QuestSlug';
import { QuestProgress } from '../entities/QuestProgress';
import { QuestProgressId } from '../entities/QuestProgressId';
import { QuestStatus } from '../types/QuestStatus';
import { QuestCategory } from '../types/QuestCategory';
import { QuestDifficulty } from '../types/QuestDifficulty';
import { RepeatType } from '../types/RepeatType';

// Mock logger
vi.mock('../../../core/logging/logger.service', () => ({
  getLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    child: () => ({
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }),
  }),
}));

describe('QuestService', () => {
  let questService: QuestService;
  let mockQuestRepository: Partial<IQuestRepository>;
  let mockProgressRepository: Partial<IQuestProgressRepository>;

  const createMockQuest = (): Quest => {
    return Quest.create({
      questId: QuestId.create('123e4567-e89b-42d3-a456-426614174000'),
      slug: QuestSlug.create('test-quest'),
      title: 'Test Quest',
      description: 'Test quest description',
      category: QuestCategory.MAIN,
      difficulty: QuestDifficulty.EASY,
      rewardDefinition: { coins: 100, gems: 10, xp: 50, artifacts: [] },
    });
  };

  const createMockProgress = (overrides?: Partial<{
    status: QuestStatus;
    currentValue: number;
  }>): QuestProgress => {
    return QuestProgress.create({
      progressId: QuestProgressId.create('123e4567-e89b-42d3-a456-426614174001'),
      playerProfileId: 'player-123',
      questId: '123e4567-e89b-42d3-a456-426614174000',
      initialValue: overrides?.currentValue ?? 0,
    }).copyWith({ status: overrides?.status ?? QuestStatus.IN_PROGRESS });
  };

  beforeEach(() => {
    mockQuestRepository = {
      findById: vi.fn(),
      findBySlug: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      list: vi.fn(),
      count: vi.fn(),
      findActive: vi.fn(),
    };

    mockProgressRepository = {
      findByPlayerAndQuest: vi.fn(),
      findByPlayer: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateStatus: vi.fn(),
      incrementProgress: vi.fn(),
      resetProgress: vi.fn(),
      delete: vi.fn(),
      findClaimableByPlayer: vi.fn(),
    };

    questService = new QuestService(
      mockQuestRepository as IQuestRepository,
      mockProgressRepository as IQuestProgressRepository
    );
  });

  describe('getQuestById', () => {
    it('should return quest when found', async () => {
      const mockQuest = createMockQuest();
      vi.mocked(mockQuestRepository.findById).mockResolvedValue(mockQuest);

      const result = await questService.getQuestById('123e4567-e89b-42d3-a456-426614174000');

      expect(result).toEqual(mockQuest);
      expect(mockQuestRepository.findById).toHaveBeenCalledWith(
        expect.any(QuestId)
      );
    });

    it('should return null when quest not found', async () => {
      vi.mocked(mockQuestRepository.findById).mockResolvedValue(null);

      const result = await questService.getQuestById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getQuestBySlug', () => {
    it('should return quest when found', async () => {
      const mockQuest = createMockQuest();
      vi.mocked(mockQuestRepository.findBySlug).mockResolvedValue(mockQuest);

      const result = await questService.getQuestBySlug('test-quest');

      expect(result).toEqual(mockQuest);
    });

    it('should return null when quest not found', async () => {
      vi.mocked(mockQuestRepository.findBySlug).mockResolvedValue(null);

      const result = await questService.getQuestBySlug('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('startQuest', () => {
    it('should create new progress when none exists', async () => {
      const mockQuest = createMockQuest();
      const mockProgress = createMockProgress();

      vi.mocked(mockQuestRepository.findById).mockResolvedValue(mockQuest);
      vi.mocked(mockProgressRepository.findByPlayerAndQuest).mockResolvedValue(null);
      vi.mocked(mockProgressRepository.create).mockResolvedValue(mockProgress);

      const result = await questService.startQuest('player-123', mockQuest.questId.value);

      expect(result).toEqual(mockProgress);
      expect(mockProgressRepository.create).toHaveBeenCalled();
    });

    it('should throw when quest not found', async () => {
      vi.mocked(mockQuestRepository.findById).mockResolvedValue(null);

      await expect(
        questService.startQuest('player-123', 'nonexistent')
      ).rejects.toThrow('Quest not found');
    });

    it('should throw when quest already started', async () => {
      const mockQuest = createMockQuest();
      const existingProgress = createMockProgress({ status: QuestStatus.IN_PROGRESS });

      vi.mocked(mockQuestRepository.findById).mockResolvedValue(mockQuest);
      vi.mocked(mockProgressRepository.findByPlayerAndQuest).mockResolvedValue(existingProgress);

      await expect(
        questService.startQuest('player-123', mockQuest.questId.value)
      ).rejects.toThrow('Quest already started');
    });
  });

  describe('updateProgress', () => {
    it('should update progress when valid', async () => {
      const mockProgress = createMockProgress();
      const updatedProgress = mockProgress.copyWith({ currentValue: 50 });

      vi.mocked(mockProgressRepository.findByPlayerAndQuest).mockResolvedValue(mockProgress);
      vi.mocked(mockProgressRepository.incrementProgress).mockResolvedValue(updatedProgress);

      const result = await questService.updateProgress(
        'player-123',
        mockProgress.questId,
        50,
        100
      );

      expect(result.currentValue).toBe(50);
      expect(mockProgressRepository.incrementProgress).toHaveBeenCalled();
    });

    it('should throw when progress not found', async () => {
      vi.mocked(mockProgressRepository.findByPlayerAndQuest).mockResolvedValue(null);

      await expect(
        questService.updateProgress('player-123', 'nonexistent', 50, 100)
      ).rejects.toThrow('No quest progress found');
    });

    it('should throw when quest not in progress', async () => {
      const completedProgress = createMockProgress({ status: QuestStatus.COMPLETED });

      vi.mocked(mockProgressRepository.findByPlayerAndQuest).mockResolvedValue(completedProgress);

      await expect(
        questService.updateProgress('player-123', completedProgress.questId, 50, 100)
      ).rejects.toThrow('Quest is not in progress');
    });

    it('should throw for negative increment', async () => {
      await expect(
        questService.updateProgress('player-123', 'quest-123', -10, 100)
      ).rejects.toThrow('Progress increment must be non-negative');
    });
  });

  describe('completeQuest', () => {
    it('should complete quest when in progress', async () => {
      const mockQuest = createMockQuest();
      const mockProgress = createMockProgress();
      const completedProgress = mockProgress.copyWith({
        status: QuestStatus.COMPLETED,
        currentValue: 100,
        completedAt: new Date(),
      });

      vi.mocked(mockProgressRepository.findByPlayerAndQuest).mockResolvedValue(mockProgress);
      vi.mocked(mockQuestRepository.findById).mockResolvedValue(mockQuest);
      vi.mocked(mockProgressRepository.updateStatus).mockResolvedValue(completedProgress);

      const result = await questService.completeQuest('player-123', mockProgress.questId);

      expect(result.status).toBe(QuestStatus.COMPLETED);
      expect(mockProgressRepository.updateStatus).toHaveBeenCalledWith(
        expect.any(QuestProgressId),
        QuestStatus.COMPLETED
      );
    });

    it('should throw when progress not found', async () => {
      vi.mocked(mockProgressRepository.findByPlayerAndQuest).mockResolvedValue(null);

      await expect(
        questService.completeQuest('player-123', 'nonexistent')
      ).rejects.toThrow('No quest progress found');
    });
  });

  describe('claimReward', () => {
    it('should emit reward claimed event when quest is completed', async () => {
      const mockQuest = createMockQuest();
      const completedProgress = createMockProgress({ status: QuestStatus.COMPLETED });

      vi.mocked(mockProgressRepository.findByPlayerAndQuest).mockResolvedValue(completedProgress);
      vi.mocked(mockQuestRepository.findById).mockResolvedValue(mockQuest);
      vi.mocked(mockProgressRepository.updateStatus).mockResolvedValue(
        completedProgress.copyWith({ status: QuestStatus.CLAIMED })
      );

      const result = await questService.claimReward('player-123', completedProgress.questId);

      expect(result.eventType).toBe('RewardClaimed');
      expect(result.data.playerProfileId).toBe('player-123');
      expect(result.data.questId).toBe(mockQuest.questId.value);
      expect(mockProgressRepository.updateStatus).toHaveBeenCalledWith(
        expect.any(QuestProgressId),
        QuestStatus.CLAIMED
      );
    });

    it('should throw when quest is not completed', async () => {
      const inProgressProgress = createMockProgress({ status: QuestStatus.IN_PROGRESS });

      vi.mocked(mockProgressRepository.findByPlayerAndQuest).mockResolvedValue(inProgressProgress);

      await expect(
        questService.claimReward('player-123', inProgressProgress.questId)
      ).rejects.toThrow('Quest is not completed');
    });
  });

  describe('cancelQuest', () => {
    it('should delete progress when quest is in progress', async () => {
      const mockProgress = createMockProgress({ status: QuestStatus.IN_PROGRESS });

      vi.mocked(mockProgressRepository.findByPlayerAndQuest).mockResolvedValue(mockProgress);

      await questService.cancelQuest('player-123', mockProgress.questId);

      expect(mockProgressRepository.delete).toHaveBeenCalledWith(
        expect.any(QuestProgressId)
      );
    });

    it('should throw when quest is completed', async () => {
      const completedProgress = createMockProgress({ status: QuestStatus.COMPLETED });

      vi.mocked(mockProgressRepository.findByPlayerAndQuest).mockResolvedValue(completedProgress);

      await expect(
        questService.cancelQuest('player-123', completedProgress.questId)
      ).rejects.toThrow('Quest cannot be cancelled');
    });
  });

  describe('resetQuest', () => {
    it('should reset progress and emit event', async () => {
      const mockQuest = createMockQuest();
      const mockProgress = createMockProgress();
      const resetProgress = mockProgress.copyWith({ currentValue: 0 });

      vi.mocked(mockProgressRepository.findByPlayerAndQuest).mockResolvedValue(mockProgress);
      vi.mocked(mockQuestRepository.findById).mockResolvedValue(mockQuest);
      vi.mocked(mockProgressRepository.resetProgress).mockResolvedValue(resetProgress);

      const result = await questService.resetQuest('player-123', mockProgress.questId);

      expect(result.eventType).toBe('QuestReset');
      expect(result.data.playerProfileId).toBe('player-123');
      expect(mockProgressRepository.resetProgress).toHaveBeenCalled();
    });
  });

  describe('getQuestSummary', () => {
    it('should return correct summary', async () => {
      const progressList = [
        createMockProgress({ status: QuestStatus.IN_PROGRESS }),
        createMockProgress({ status: QuestStatus.COMPLETED }),
        createMockProgress({ status: QuestStatus.CLAIMED }),
      ];

      vi.mocked(mockProgressRepository.findByPlayer).mockResolvedValue({
        items: progressList,
        total: 3,
        page: 1,
        pageSize: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      vi.mocked(mockProgressRepository.findClaimableByPlayer).mockResolvedValue([
        progressList[1],
      ]);

      const result = await questService.getQuestSummary('player-123');

      expect(result.totalQuests).toBe(3);
      expect(result.completedQuests).toBe(2);
      expect(result.claimableRewards).toBe(1);
      expect(result.inProgressQuests).toBe(1);
    });
  });

  describe('listQuests', () => {
    it('should return paginated quests', async () => {
      const mockQuests = [createMockQuest()];
      const paginatedResult = {
        items: mockQuests,
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      vi.mocked(mockQuestRepository.list).mockResolvedValue(paginatedResult);

      const result = await questService.listQuests({ page: 1, pageSize: 10 });

      expect(result.items).toEqual(mockQuests);
      expect(result.total).toBe(1);
    });
  });
});