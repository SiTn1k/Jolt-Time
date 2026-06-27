/**
 * Quest Entity Tests
 *
 * Unit tests for the Quest entity.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Quest } from '../entities/Quest';
import { QuestId } from '../value-objects/QuestId';
import { QuestSlug } from '../value-objects/QuestSlug';
import { QuestCategory } from '../types/QuestCategory';
import { QuestDifficulty } from '../types/QuestDifficulty';
import { RepeatType } from '../types/RepeatType';

describe('Quest', () => {
  const createTestQuest = (overrides?: Partial<{
    questId: QuestId;
    slug: QuestSlug;
    title: string;
    description: string;
    category: QuestCategory;
    difficulty: QuestDifficulty;
    repeatType: RepeatType;
    requiredLevel: number;
  }>) => {
    return Quest.create({
      questId: overrides?.questId ?? QuestId.create(),
      slug: overrides?.slug ?? QuestSlug.create('test-quest'),
      title: overrides?.title ?? 'Test Quest',
      description: overrides?.description ?? 'This is a test quest description',
      category: overrides?.category ?? QuestCategory.MAIN,
      difficulty: overrides?.difficulty ?? QuestDifficulty.EASY,
      repeatType: overrides?.repeatType ?? RepeatType.NONE,
      requiredLevel: overrides?.requiredLevel ?? 1,
      rewardDefinition: {
        coins: 100,
        gems: 10,
        xp: 50,
      },
    });
  };

  describe('create', () => {
    it('should create a quest with all required fields', () => {
      const quest = createTestQuest();

      expect(quest.questId).toBeDefined();
      expect(quest.slug.value).toBe('test-quest');
      expect(quest.title).toBe('Test Quest');
      expect(quest.description).toBe('This is a test quest description');
      expect(quest.category).toBe(QuestCategory.MAIN);
      expect(quest.difficulty).toBe(QuestDifficulty.EASY);
      expect(quest.requiredLevel).toBe(1);
      expect(quest.isActive).toBe(true);
    });

    it('should set createdAt and updatedAt timestamps', () => {
      const before = new Date();
      const quest = createTestQuest();
      const after = new Date();

      expect(quest.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(quest.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(quest.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });

    it('should set repeatType based on category if not provided', () => {
      const dailyQuest = createTestQuest({ category: QuestCategory.DAILY });
      expect(dailyQuest.repeatType).toBe(RepeatType.DAILY);

      const weeklyQuest = createTestQuest({ category: QuestCategory.WEEKLY });
      expect(weeklyQuest.repeatType).toBe(RepeatType.WEEKLY);

      const mainQuest = createTestQuest({ category: QuestCategory.MAIN });
      expect(mainQuest.repeatType).toBe(RepeatType.NONE);
    });

    it('should set default requiredLevel to 1 if not provided', () => {
      const quest = createTestQuest();
      expect(quest.requiredLevel).toBe(1);
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct quest from storage record', () => {
      const record = {
        questId: '123e4567-e89b-42d3-a456-426614174000',
        slug: 'reconstructed-quest',
        title: 'Reconstructed Quest',
        description: 'Quest reconstructed from storage',
        category: QuestCategory.DAILY,
        difficulty: QuestDifficulty.MEDIUM,
        repeatType: RepeatType.DAILY,
        requiredLevel: 5,
        requiredResearch: ['research-1'],
        rewardDefinition: { coins: 200, gems: 20, xp: 100 },
        isActive: true,
        metadata: {
          category: QuestCategory.DAILY,
          difficulty: QuestDifficulty.MEDIUM,
          repeatType: RepeatType.DAILY,
          rewardDefinition: { coins: 200, gems: 20, xp: 100 },
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      };

      const quest = Quest.fromStorage(record);

      expect(quest.questId.value).toBe(record.questId);
      expect(quest.slug.value).toBe(record.slug);
      expect(quest.title).toBe(record.title);
      expect(quest.category).toBe(record.category);
      expect(quest.difficulty).toBe(record.difficulty);
      expect(quest.requiredLevel).toBe(record.requiredLevel);
    });
  });

  describe('isRepeating', () => {
    it('should return true for repeating quests', () => {
      const dailyQuest = createTestQuest({ repeatType: RepeatType.DAILY });
      expect(dailyQuest.isRepeating).toBe(true);

      const weeklyQuest = createTestQuest({ repeatType: RepeatType.WEEKLY });
      expect(weeklyQuest.isRepeating).toBe(true);

      const seasonalQuest = createTestQuest({ repeatType: RepeatType.SEASONAL });
      expect(seasonalQuest.isRepeating).toBe(true);
    });

    it('should return false for non-repeating quests', () => {
      const quest = createTestQuest({ repeatType: RepeatType.NONE });
      expect(quest.isRepeating).toBe(false);
    });
  });

  describe('hasPrerequisites', () => {
    it('should return true if required level is greater than 1', () => {
      const quest = createTestQuest({ requiredLevel: 5 });
      expect(quest.hasPrerequisites).toBe(true);
    });

    it('should return true if required research is not empty', () => {
      const quest = createTestQuest({
        requiredLevel: 1,
      }).copyWith({
        requiredResearch: ['research-1'],
      });
      expect(quest.hasPrerequisites).toBe(true);
    });

    it('should return false if no prerequisites', () => {
      const quest = createTestQuest({ requiredLevel: 1, requiredResearch: [] });
      expect(quest.hasPrerequisites).toBe(false);
    });
  });

  describe('isAvailableForLevel', () => {
    it('should return true if player level meets requirement', () => {
      const quest = createTestQuest({ requiredLevel: 5 });
      expect(quest.isAvailableForLevel(5)).toBe(true);
      expect(quest.isAvailableForLevel(10)).toBe(true);
    });

    it('should return false if player level is below requirement', () => {
      const quest = createTestQuest({ requiredLevel: 5 });
      expect(quest.isAvailableForLevel(4)).toBe(false);
      expect(quest.isAvailableForLevel(1)).toBe(false);
    });
  });

  describe('copyWith', () => {
    it('should create new quest with updated fields', () => {
      const original = createTestQuest();
      const updated = original.copyWith({
        title: 'Updated Title',
        difficulty: QuestDifficulty.HARD,
      });

      expect(updated.title).toBe('Updated Title');
      expect(updated.difficulty).toBe(QuestDifficulty.HARD);
      expect(updated.questId).toBe(original.questId);
      expect(updated.slug).toBe(original.slug);
    });

    it('should preserve unchanged fields', () => {
      const original = createTestQuest();
      const updated = original.copyWith({});

      expect(updated.description).toBe(original.description);
      expect(updated.category).toBe(original.category);
    });

    it('should update updatedAt timestamp', () => {
      const original = createTestQuest();
      const updated = original.copyWith({ title: 'New Title' });

      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(original.updatedAt.getTime());
    });
  });

  describe('toJSON', () => {
    it('should serialize quest to JSON correctly', () => {
      const quest = createTestQuest();
      const json = quest.toJSON();

      expect(json.questId).toBe(quest.questId.value);
      expect(json.slug).toBe(quest.slug.value);
      expect(json.title).toBe(quest.title);
      expect(json.description).toBe(quest.description);
      expect(json.category).toBe(quest.category);
      expect(json.difficulty).toBe(quest.difficulty);
      expect(json.isActive).toBe(quest.isActive);
      expect(json.createdAt).toBe(quest.createdAt.toISOString());
    });
  });

  describe('toRecord', () => {
    it('should convert to database record format', () => {
      const quest = createTestQuest();
      const record = quest.toRecord();

      expect(record.questId).toBe(quest.questId.value);
      expect(record.slug).toBe(quest.slug.value);
      expect(record.required_level).toBe(quest.requiredLevel);
      expect(record.is_active).toBe(quest.isActive);
    });
  });
});