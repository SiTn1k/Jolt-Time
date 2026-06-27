/**
 * Quest Validator Tests
 *
 * Unit tests for the QuestValidator.
 */

import { describe, it, expect } from 'vitest';
import { QuestValidator } from '../validators/QuestValidator';
import { QuestCategory } from '../types/QuestCategory';
import { QuestDifficulty } from '../types/QuestDifficulty';

describe('QuestValidator', () => {
  describe('isValidQuestId', () => {
    it('should return true for valid UUID', () => {
      expect(QuestValidator.isValidQuestId('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      expect(QuestValidator.isValidQuestId('invalid-uuid')).toBe(false);
      expect(QuestValidator.isValidQuestId('')).toBe(false);
      expect(QuestValidator.isValidQuestId(null as unknown as string)).toBe(false);
      expect(QuestValidator.isValidQuestId(undefined as unknown as string)).toBe(false);
    });
  });

  describe('isValidSlug', () => {
    it('should return true for valid slug', () => {
      expect(QuestValidator.isValidSlug('my-quest')).toBe(true);
      expect(QuestValidator.isValidSlug('quest-123')).toBe(true);
      expect(QuestValidator.isValidSlug('a')).toBe(true);
    });

    it('should return false for invalid slug', () => {
      expect(QuestValidator.isValidSlug('')).toBe(false);
      expect(QuestValidator.isValidSlug('My Quest')).toBe(false);
      expect(QuestValidator.isValidSlug('my_quest')).toBe(false);
      expect(QuestValidator.isValidSlug(null as unknown as string)).toBe(false);
    });
  });

  describe('isValidTitle', () => {
    it('should return true for valid title', () => {
      expect(QuestValidator.isValidTitle('My Quest')).toBe(true);
      expect(QuestValidator.isValidTitle('A')).toBe(true);
    });

    it('should return false for invalid title', () => {
      expect(QuestValidator.isValidTitle('')).toBe(false);
      expect(QuestValidator.isValidTitle(null as unknown as string)).toBe(false);
      expect(QuestValidator.isValidTitle(undefined as unknown as string)).toBe(false);
    });
  });

  describe('isValidDescription', () => {
    it('should return true for valid description', () => {
      expect(QuestValidator.isValidDescription('This is a description')).toBe(true);
    });

    it('should return false for invalid description', () => {
      expect(QuestValidator.isValidDescription('')).toBe(false);
      expect(QuestValidator.isValidDescription(null as unknown as string)).toBe(false);
    });
  });

  describe('isValidRequiredLevel', () => {
    it('should return true for valid level', () => {
      expect(QuestValidator.isValidRequiredLevel(1)).toBe(true);
      expect(QuestValidator.isValidRequiredLevel(50)).toBe(true);
      expect(QuestValidator.isValidRequiredLevel(100)).toBe(true);
      expect(QuestValidator.isValidRequiredLevel(null as unknown as number)).toBe(true); // Optional
    });

    it('should return false for invalid level', () => {
      expect(QuestValidator.isValidRequiredLevel(0)).toBe(false);
      expect(QuestValidator.isValidRequiredLevel(101)).toBe(false);
      expect(QuestValidator.isValidRequiredLevel(-1)).toBe(false);
    });
  });

  describe('validate', () => {
    it('should return valid result for correct data', () => {
      const result = QuestValidator.validate({
        questId: '123e4567-e89b-42d3-a456-426614174000',
        slug: 'valid-quest',
        title: 'Valid Quest',
        description: 'A valid quest description',
        category: QuestCategory.MAIN,
        difficulty: QuestDifficulty.EASY,
        requiredLevel: 1,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid data', () => {
      const result = QuestValidator.validate({
        questId: 'invalid',
        slug: '',
        title: '',
        description: '',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should only validate provided fields', () => {
      const result = QuestValidator.validate({
        title: 'Valid Title',
      });

      expect(result.isValid).toBe(true);
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid data', () => {
      expect(() => {
        QuestValidator.validateOrThrow({
          questId: '123e4567-e89b-42d3-a456-426614174000',
          slug: 'valid-quest',
          title: 'Valid Quest',
          description: 'A valid quest description',
        });
      }).not.toThrow();
    });

    it('should throw for invalid data', () => {
      expect(() => {
        QuestValidator.validateOrThrow({
          questId: 'invalid',
          slug: '',
          title: '',
        });
      }).toThrow();
    });
  });
});