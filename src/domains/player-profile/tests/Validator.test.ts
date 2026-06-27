/**
 * PlayerProfile Validator Unit Tests
 *
 * Tests for NicknameValidator, PlayerLevelValidator, and ExperienceValidator.
 */

import { describe, it, expect } from 'vitest';
import { NicknameValidator } from '../validators/NicknameValidator';
import { PlayerLevelValidator } from '../validators/PlayerLevelValidator';
import { ExperienceValidator } from '../validators/ExperienceValidator';

describe('NicknameValidator', () => {
  describe('validate', () => {
    it('should return valid for a proper nickname', () => {
      const result = NicknameValidator.validate('ValidPlayer123');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for nickname with underscores', () => {
      const result = NicknameValidator.validate('Valid_Player_123');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null', () => {
      const result = NicknameValidator.validate(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Nickname is required');
    });

    it('should return invalid for undefined', () => {
      const result = NicknameValidator.validate(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Nickname is required');
    });

    it('should return invalid for empty string', () => {
      const result = NicknameValidator.validate('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Nickname cannot be empty');
    });

    it('should return invalid for whitespace only', () => {
      const result = NicknameValidator.validate('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Nickname cannot be empty');
    });

    it('should return invalid for too short nickname', () => {
      const result = NicknameValidator.validate('AB');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least');
    });

    it('should return invalid for too long nickname', () => {
      const result = NicknameValidator.validate('A'.repeat(33));
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at most');
    });

    it('should return invalid for nickname with special characters', () => {
      expect(NicknameValidator.validate('Invalid@Name').isValid).toBe(false);
      expect(NicknameValidator.validate('Invalid Name').isValid).toBe(false);
      expect(NicknameValidator.validate('Invalid-Name').isValid).toBe(false);
      expect(NicknameValidator.validate('Invalid.Name').isValid).toBe(false);
    });

    it('should return invalid for reserved words', () => {
      expect(NicknameValidator.validate('admin').isValid).toBe(false);
      expect(NicknameValidator.validate('moderator').isValid).toBe(false);
      expect(NicknameValidator.validate('system').isValid).toBe(false);
      expect(NicknameValidator.validate('bot').isValid).toBe(false);
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid nickname', () => {
      expect(() => NicknameValidator.validateOrThrow('ValidPlayer')).not.toThrow();
    });

    it('should throw for invalid nickname', () => {
      expect(() => NicknameValidator.validateOrThrow(null)).toThrow('Nickname validation failed');
    });
  });

  describe('sanitize', () => {
    it('should trim whitespace', () => {
      expect(NicknameValidator.sanitize('  Player  ')).toBe('Player');
    });

    it('should return null for null input', () => {
      expect(NicknameValidator.sanitize(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(NicknameValidator.sanitize(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(NicknameValidator.sanitize('')).toBeNull();
    });
  });
});

describe('PlayerLevelValidator', () => {
  describe('validate', () => {
    it('should return valid for level 1', () => {
      const result = PlayerLevelValidator.validate(1);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for level 50', () => {
      const result = PlayerLevelValidator.validate(50);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for max level (100)', () => {
      const result = PlayerLevelValidator.validate(100);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null', () => {
      const result = PlayerLevelValidator.validate(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Level is required');
    });

    it('should return invalid for undefined', () => {
      const result = PlayerLevelValidator.validate(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Level is required');
    });

    it('should return invalid for non-integer', () => {
      const result = PlayerLevelValidator.validate(1.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Level must be an integer');
    });

    it('should return invalid for level below minimum', () => {
      const result = PlayerLevelValidator.validate(0);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least');
    });

    it('should return invalid for negative level', () => {
      const result = PlayerLevelValidator.validate(-5);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least');
    });

    it('should return invalid for level above maximum', () => {
      const result = PlayerLevelValidator.validate(101);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot exceed');
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid level', () => {
      expect(() => PlayerLevelValidator.validateOrThrow(50)).not.toThrow();
    });

    it('should throw for invalid level', () => {
      expect(() => PlayerLevelValidator.validateOrThrow(0)).toThrow('Level validation failed');
    });
  });

  describe('isMaxLevel', () => {
    it('should return true for max level', () => {
      expect(PlayerLevelValidator.isMaxLevel(100)).toBe(true);
    });

    it('should return false for below max level', () => {
      expect(PlayerLevelValidator.isMaxLevel(99)).toBe(false);
    });
  });

  describe('isStartingLevel', () => {
    it('should return true for level 1', () => {
      expect(PlayerLevelValidator.isStartingLevel(1)).toBe(true);
    });

    it('should return false for other levels', () => {
      expect(PlayerLevelValidator.isStartingLevel(2)).toBe(false);
    });
  });

  describe('clamp', () => {
    it('should return same value for valid level', () => {
      expect(PlayerLevelValidator.clamp(50)).toBe(50);
    });

    it('should clamp below minimum to minimum', () => {
      expect(PlayerLevelValidator.clamp(0)).toBe(1);
      expect(PlayerLevelValidator.clamp(-5)).toBe(1);
    });

    it('should clamp above maximum to maximum', () => {
      expect(PlayerLevelValidator.clamp(101)).toBe(100);
      expect(PlayerLevelValidator.clamp(200)).toBe(100);
    });
  });
});

describe('ExperienceValidator', () => {
  describe('validate', () => {
    it('should return valid for 0', () => {
      const result = ExperienceValidator.validate(0);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for positive experience', () => {
      const result = ExperienceValidator.validate(5000);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for max experience', () => {
      const result = ExperienceValidator.validate(999999999);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null', () => {
      const result = ExperienceValidator.validate(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Experience is required');
    });

    it('should return invalid for undefined', () => {
      const result = ExperienceValidator.validate(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Experience is required');
    });

    it('should return invalid for non-integer', () => {
      const result = ExperienceValidator.validate(100.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Experience must be an integer');
    });

    it('should return invalid for negative experience', () => {
      const result = ExperienceValidator.validate(-1);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Experience cannot be negative');
    });

    it('should return invalid for above maximum', () => {
      const result = ExperienceValidator.validate(1000000000);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot exceed');
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid experience', () => {
      expect(() => ExperienceValidator.validateOrThrow(5000)).not.toThrow();
    });

    it('should throw for invalid experience', () => {
      expect(() => ExperienceValidator.validateOrThrow(-1)).toThrow('Experience validation failed');
    });
  });

  describe('isMaxExperience', () => {
    it('should return true for max experience', () => {
      expect(ExperienceValidator.isMaxExperience(999999999)).toBe(true);
    });

    it('should return false for below max', () => {
      expect(ExperienceValidator.isMaxExperience(5000)).toBe(false);
    });
  });

  describe('isZero', () => {
    it('should return true for zero', () => {
      expect(ExperienceValidator.isZero(0)).toBe(true);
    });

    it('should return false for non-zero', () => {
      expect(ExperienceValidator.isZero(100)).toBe(false);
    });
  });

  describe('clamp', () => {
    it('should return same value for valid experience', () => {
      expect(ExperienceValidator.clamp(5000)).toBe(5000);
    });

    it('should clamp negative to zero', () => {
      expect(ExperienceValidator.clamp(-100)).toBe(0);
    });

    it('should clamp above maximum to maximum', () => {
      expect(ExperienceValidator.clamp(1000000000)).toBe(999999999);
    });
  });

  describe('calculateLevel', () => {
    it('should calculate correct level from experience', () => {
      expect(ExperienceValidator.calculateLevel(0)).toBe(1);
      expect(ExperienceValidator.calculateLevel(999)).toBe(1);
      expect(ExperienceValidator.calculateLevel(1000)).toBe(2);
      expect(ExperienceValidator.calculateLevel(2500)).toBe(3);
    });
  });

  describe('experienceForLevel', () => {
    it('should calculate correct experience for level', () => {
      expect(ExperienceValidator.experienceForLevel(1)).toBe(0);
      expect(ExperienceValidator.experienceForLevel(2)).toBe(1000);
      expect(ExperienceValidator.experienceForLevel(5)).toBe(4000);
    });
  });

  describe('experienceToNextLevel', () => {
    it('should calculate experience needed for next level', () => {
      expect(ExperienceValidator.experienceToNextLevel(0)).toBe(1000);
      expect(ExperienceValidator.experienceToNextLevel(500)).toBe(500);
      expect(ExperienceValidator.experienceToNextLevel(1500)).toBe(500);
    });
  });
});
