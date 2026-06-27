/**
 * Achievement Validator Tests
 *
 * Unit tests for AchievementValidator.
 */

import { describe, it, expect } from 'vitest';
import { AchievementValidator } from '../validators/AchievementValidator';
import { AchievementCategory } from '../types/AchievementCategory';
import { AchievementRarity } from '../types/AchievementRarity';

describe('AchievementValidator', () => {
  describe('isValidAchievementId', () => {
    it('should return true for valid UUID', () => {
      expect(AchievementValidator.isValidAchievementId('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      expect(AchievementValidator.isValidAchievementId('invalid-id')).toBe(false);
      expect(AchievementValidator.isValidAchievementId('')).toBe(false);
      expect(AchievementValidator.isValidAchievementId(null)).toBe(false);
      expect(AchievementValidator.isValidAchievementId(undefined)).toBe(false);
    });
  });

  describe('isValidSlug', () => {
    it('should return true for valid slugs', () => {
      expect(AchievementValidator.isValidSlug('test-achievement')).toBe(true);
      expect(AchievementValidator.isValidSlug('test-achievement-123')).toBe(true);
      expect(AchievementValidator.isValidSlug('achievement123')).toBe(true);
    });

    it('should return false for invalid slugs', () => {
      expect(AchievementValidator.isValidSlug('')).toBe(false);
      expect(AchievementValidator.isValidSlug(null)).toBe(false);
      expect(AchievementValidator.isValidSlug(undefined)).toBe(false);
    });
  });

  describe('isValidTitle', () => {
    it('should return true for valid titles', () => {
      expect(AchievementValidator.isValidTitle('Test Achievement')).toBe(true);
      expect(AchievementValidator.isValidTitle('A')).toBe(true);
    });

    it('should return false for invalid titles', () => {
      expect(AchievementValidator.isValidTitle('')).toBe(false);
      expect(AchievementValidator.isValidTitle(null)).toBe(false);
      expect(AchievementValidator.isValidTitle(undefined)).toBe(false);
    });
  });

  describe('isValidDescription', () => {
    it('should return true for valid descriptions', () => {
      expect(AchievementValidator.isValidDescription('This is a test achievement description')).toBe(true);
    });

    it('should return false for invalid descriptions', () => {
      expect(AchievementValidator.isValidDescription('')).toBe(false);
      expect(AchievementValidator.isValidDescription(null)).toBe(false);
      expect(AchievementValidator.isValidDescription(undefined)).toBe(false);
    });
  });

  describe('isValidPoints', () => {
    it('should return true for valid points', () => {
      expect(AchievementValidator.isValidPoints(0)).toBe(true);
      expect(AchievementValidator.isValidPoints(100)).toBe(true);
      expect(AchievementValidator.isValidPoints(10000)).toBe(true);
    });

    it('should return false for invalid points', () => {
      expect(AchievementValidator.isValidPoints(-1)).toBe(false);
      expect(AchievementValidator.isValidPoints(10001)).toBe(false);
      expect(AchievementValidator.isValidPoints(1.5)).toBe(false);
      expect(AchievementValidator.isValidPoints(null)).toBe(false);
      expect(AchievementValidator.isValidPoints(undefined)).toBe(false);
    });
  });

  describe('validate', () => {
    it('should return valid for complete valid data', () => {
      const result = AchievementValidator.validate({
        slug: 'test-achievement',
        title: 'Test Achievement',
        description: 'A test achievement description',
        points: 100,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid data', () => {
      const result = AchievementValidator.validate({
        achievementId: 'invalid',
        slug: '',
        title: '',
        points: -100,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid data', () => {
      expect(() => {
        AchievementValidator.validateOrThrow({
          slug: 'test-achievement',
          title: 'Test Achievement',
          description: 'A test achievement description',
          points: 100,
        });
      }).not.toThrow();
    });

    it('should throw for invalid data', () => {
      expect(() => {
        AchievementValidator.validateOrThrow({
          achievementId: 'invalid',
        });
      }).toThrow();
    });
  });
});
