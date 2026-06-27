/**
 * QuestProgress Entity Tests
 *
 * Unit tests for the QuestProgress entity.
 */

import { describe, it, expect } from 'vitest';
import { QuestProgress } from '../entities/QuestProgress';
import { QuestProgressId } from '../entities/QuestProgressId';
import { QuestStatus } from '../types/QuestStatus';
import { ProgressValue } from '../value-objects/ProgressValue';

describe('QuestProgress', () => {
  const createTestProgress = (overrides?: Partial<{
    progressId: QuestProgressId;
    playerProfileId: string;
    questId: string;
    status: QuestStatus;
    currentValue: number;
  }>) => {
    const baseProgress = QuestProgress.create({
      progressId: overrides?.progressId ?? QuestProgressId.create(),
      playerProfileId: overrides?.playerProfileId ?? 'player-123',
      questId: overrides?.questId ?? 'quest-456',
      initialValue: overrides?.currentValue ?? 0,
    });
    
    if (overrides?.status && overrides.status !== QuestStatus.IN_PROGRESS) {
      return baseProgress.copyWith({ status: overrides.status });
    }
    return baseProgress;
  };

  describe('create', () => {
    it('should create progress with all required fields', () => {
      const progress = createTestProgress();

      expect(progress.progressId).toBeDefined();
      expect(progress.playerProfileId).toBe('player-123');
      expect(progress.questId).toBe('quest-456');
      expect(progress.status).toBe(QuestStatus.IN_PROGRESS);
      expect(progress.currentValue).toBe(0);
    });

    it('should initialize with null completedAt and claimedAt', () => {
      const progress = createTestProgress();

      expect(progress.completedAt).toBeNull();
      expect(progress.claimedAt).toBeNull();
    });

    it('should set startedAt and updatedAt timestamps', () => {
      const before = new Date();
      const progress = createTestProgress();
      const after = new Date();

      expect(progress.startedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(progress.startedAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(progress.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });

    it('should accept custom initial value', () => {
      const progress = createTestProgress({ currentValue: 50 });
      expect(progress.currentValue).toBe(50);
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct progress from storage record', () => {
      const now = new Date().toISOString();
      const record = {
        progressId: '123e4567-e89b-42d3-a456-426614174000',
        playerProfileId: 'player-123',
        questId: 'quest-456',
        status: QuestStatus.COMPLETED,
        currentValue: 100,
        completedAt: now,
        claimedAt: null,
        metadata: {},
        startedAt: now,
        updatedAt: now,
      };

      const progress = QuestProgress.fromStorage(record);

      expect(progress.progressId).toBe(record.progressId);
      expect(progress.playerProfileId).toBe(record.playerProfileId);
      expect(progress.questId).toBe(record.questId);
      expect(progress.status).toBe(QuestStatus.COMPLETED);
      expect(progress.currentValue).toBe(100);
      expect(progress.completedAt).not.toBeNull();
    });
  });

  describe('isCompleteForTarget', () => {
    it('should return true when currentValue >= target', () => {
      const progress = createTestProgress({ currentValue: 100 });
      expect(progress.isCompleteForTarget(100)).toBe(true);
      expect(progress.isCompleteForTarget(50)).toBe(true);
    });

    it('should return false when currentValue < target', () => {
      const progress = createTestProgress({ currentValue: 50 });
      expect(progress.isCompleteForTarget(100)).toBe(false);
    });
  });

  describe('getCompletionPercentage', () => {
    it('should return correct percentage', () => {
      const progress = createTestProgress({ currentValue: 50 });
      expect(progress.getCompletionPercentage(100)).toBe(0.5);
      expect(progress.getCompletionPercentage(200)).toBe(0.25);
    });

    it('should return 1 when progress exceeds target', () => {
      const progress = createTestProgress({ currentValue: 150 });
      expect(progress.getCompletionPercentage(100)).toBe(1);
    });

    it('should return 1 when target is 0 or negative', () => {
      const progress = createTestProgress({ currentValue: 50 });
      expect(progress.getCompletionPercentage(0)).toBe(1);
      expect(progress.getCompletionPercentage(-10)).toBe(1);
    });

    it('should return 0 when currentValue is 0', () => {
      const progress = createTestProgress({ currentValue: 0 });
      expect(progress.getCompletionPercentage(100)).toBe(0);
    });
  });

  describe('isClaimable', () => {
    it('should return true when status is COMPLETED', () => {
      const progress = createTestProgress({ status: QuestStatus.COMPLETED });
      expect(progress.isClaimable).toBe(true);
    });

    it('should return false for other statuses', () => {
      expect(createTestProgress({ status: QuestStatus.IN_PROGRESS }).isClaimable).toBe(false);
      expect(createTestProgress({ status: QuestStatus.CLAIMED }).isClaimable).toBe(false);
      expect(createTestProgress({ status: QuestStatus.AVAILABLE }).isClaimable).toBe(false);
      expect(createTestProgress({ status: QuestStatus.EXPIRED }).isClaimable).toBe(false);
    });
  });

  describe('isClaimed', () => {
    it('should return true when status is CLAIMED', () => {
      const progress = createTestProgress({ status: QuestStatus.CLAIMED });
      expect(progress.isClaimed).toBe(true);
    });

    it('should return false for other statuses', () => {
      expect(createTestProgress({ status: QuestStatus.COMPLETED }).isClaimed).toBe(false);
      expect(createTestProgress({ status: QuestStatus.IN_PROGRESS }).isClaimed).toBe(false);
    });
  });

  describe('copyWith', () => {
    it('should create new progress with updated fields', () => {
      const original = createTestProgress();
      const updated = original.copyWith({
        status: QuestStatus.COMPLETED,
        currentValue: 100,
      });

      expect(updated.status).toBe(QuestStatus.COMPLETED);
      expect(updated.currentValue).toBe(100);
      expect(updated.progressId).toBe(original.progressId);
      expect(updated.playerProfileId).toBe(original.playerProfileId);
    });

    it('should preserve unchanged fields', () => {
      const original = createTestProgress({ currentValue: 50 });
      const updated = original.copyWith({});

      expect(updated.questId).toBe(original.questId);
      expect(updated.currentValue).toBe(50);
    });

    it('should update updatedAt timestamp', () => {
      const original = createTestProgress();
      const updated = original.copyWith({ currentValue: 100 });

      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(original.updatedAt.getTime());
    });

    it('should set completedAt when status is COMPLETED', () => {
      const original = createTestProgress();
      const updated = original.copyWith({ status: QuestStatus.COMPLETED });

      expect(updated.completedAt).not.toBeNull();
    });

    it('should set claimedAt when status is CLAIMED', () => {
      const original = createTestProgress();
      const updated = original.copyWith({ status: QuestStatus.CLAIMED });

      expect(updated.claimedAt).not.toBeNull();
    });
  });

  describe('toJSON', () => {
    it('should serialize progress to JSON correctly', () => {
      const progress = createTestProgress();
      const json = progress.toJSON();

      expect(json.progressId).toBe(progress.progressId);
      expect(json.playerProfileId).toBe(progress.playerProfileId);
      expect(json.questId).toBe(progress.questId);
      expect(json.status).toBe(progress.status);
      expect(json.currentValue).toBe(progress.currentValue);
    });
  });

  describe('toRecord', () => {
    it('should convert to database record format', () => {
      const progress = createTestProgress();
      const record = progress.toRecord();

      expect(record.progressId).toBe(progress.progressId);
      expect(record.playerProfileId).toBe(progress.playerProfileId);
      expect(record.questId).toBe(progress.questId);
      expect(record.currentValue).toBe(progress.currentValue);
    });
  });

  describe('progress getter', () => {
    it('should return ProgressValue instance', () => {
      const progress = createTestProgress({ currentValue: 75 });
      const progressValue = progress.progress;

      expect(progressValue.value).toBe(75);
      expect(progressValue.compareTo(ProgressValue.reconstruct(50))).toBeGreaterThan(0);
      expect(progressValue.compareTo(ProgressValue.reconstruct(100))).toBeLessThan(0);
    });
  });
});