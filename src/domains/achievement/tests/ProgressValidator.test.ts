/**
 * Progress Validator Tests
 *
 * Unit tests for ProgressValidator.
 */

import { describe, it, expect } from 'vitest';
import { ProgressValidator } from '../validators/ProgressValidator';
import { AchievementStatus } from '../types/AchievementStatus';

describe('ProgressValidator', () => {
  describe('isValidProgressId', () => {
    it('should return true for valid UUID', () => {
      expect(ProgressValidator.isValidProgressId('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      expect(ProgressValidator.isValidProgressId('invalid-id')).toBe(false);
      expect(ProgressValidator.isValidProgressId('')).toBe(false);
      expect(ProgressValidator.isValidProgressId(null)).toBe(false);
      expect(ProgressValidator.isValidProgressId(undefined)).toBe(false);
    });
  });

  describe('isValidPlayerProfileId', () => {
    it('should return true for valid UUID', () => {
      expect(ProgressValidator.isValidPlayerProfileId('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      expect(ProgressValidator.isValidPlayerProfileId('invalid-id')).toBe(false);
      expect(ProgressValidator.isValidPlayerProfileId('')).toBe(false);
    });
  });

  describe('isValidAchievementId', () => {
    it('should return true for valid UUID', () => {
      expect(ProgressValidator.isValidAchievementId('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      expect(ProgressValidator.isValidAchievementId('invalid-id')).toBe(false);
      expect(ProgressValidator.isValidAchievementId('')).toBe(false);
    });
  });

  describe('isValidCurrentValue', () => {
    it('should return true for valid values', () => {
      expect(ProgressValidator.isValidCurrentValue(0)).toBe(true);
      expect(ProgressValidator.isValidCurrentValue(100)).toBe(true);
      expect(ProgressValidator.isValidCurrentValue(999999)).toBe(true);
    });

    it('should return false for invalid values', () => {
      expect(ProgressValidator.isValidCurrentValue(-1)).toBe(false);
      expect(ProgressValidator.isValidCurrentValue(1.5)).toBe(false);
      expect(ProgressValidator.isValidCurrentValue(null)).toBe(false);
      expect(ProgressValidator.isValidCurrentValue(undefined)).toBe(false);
    });
  });

  describe('isValidStatus', () => {
    it('should return true for valid statuses', () => {
      expect(ProgressValidator.isValidStatus(AchievementStatus.LOCKED)).toBe(true);
      expect(ProgressValidator.isValidStatus(AchievementStatus.IN_PROGRESS)).toBe(true);
      expect(ProgressValidator.isValidStatus(AchievementStatus.COMPLETED)).toBe(true);
      expect(ProgressValidator.isValidStatus(AchievementStatus.CLAIMED)).toBe(true);
    });

    it('should return false for invalid statuses', () => {
      expect(ProgressValidator.isValidStatus('invalid')).toBe(false);
      expect(ProgressValidator.isValidStatus('')).toBe(false);
      expect(ProgressValidator.isValidStatus(null)).toBe(false);
    });
  });

  describe('validate', () => {
    it('should return valid for complete valid data', () => {
      const result = ProgressValidator.validate({
        progressId: '123e4567-e89b-42d3-a456-426614174000',
        playerProfileId: '123e4567-e89b-42d3-a456-426614174001',
        achievementId: '123e4567-e89b-42d3-a456-426614174002',
        status: AchievementStatus.IN_PROGRESS,
        currentValue: 50,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid data', () => {
      const result = ProgressValidator.validate({
        progressId: 'invalid',
        playerProfileId: 'invalid',
        achievementId: 'invalid',
        status: 'invalid' as any,
        currentValue: -1,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid data', () => {
      expect(() => {
        ProgressValidator.validateOrThrow({
          progressId: '123e4567-e89b-42d3-a456-426614174000',
          playerProfileId: '123e4567-e89b-42d3-a456-426614174001',
          achievementId: '123e4567-e89b-42d3-a456-426614174002',
          status: AchievementStatus.IN_PROGRESS,
          currentValue: 50,
        });
      }).not.toThrow();
    });

    it('should throw for invalid data', () => {
      expect(() => {
        ProgressValidator.validateOrThrow({
          progressId: 'invalid',
        });
      }).toThrow();
    });
  });
});
