/**
 * SessionValidator Tests
 *
 * Unit tests for the SessionValidator.
 */

import { describe, it, expect } from 'vitest';
import { SessionValidator } from '../validators/SessionValidator';
import { SessionStatus } from '../types/SessionStatus';

describe('SessionValidator', () => {
  describe('validatePlayerProfileId', () => {
    it('should return valid for a valid player profile ID', () => {
      const result = SessionValidator.validatePlayerProfileId('123e4567-e89b-42d3-a456-426614174000');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null player profile ID', () => {
      const result = SessionValidator.validatePlayerProfileId(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Player profile ID is required');
    });

    it('should return invalid for empty player profile ID', () => {
      const result = SessionValidator.validatePlayerProfileId('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Player profile ID cannot be empty');
    });
  });

  describe('validateDevice', () => {
    it('should return valid for a valid device', () => {
      const result = SessionValidator.validateDevice('iPhone 15 Pro');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for null device (optional)', () => {
      const result = SessionValidator.validateDevice(null);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for undefined device (optional)', () => {
      const result = SessionValidator.validateDevice(undefined);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for too long device string', () => {
      const longDevice = 'a'.repeat(65);
      const result = SessionValidator.validateDevice(longDevice);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at most 64 characters');
    });// This is correct - device also uses 64
  });

  describe('validatePlatform', () => {
    it('should return valid for a valid platform', () => {
      const result = SessionValidator.validatePlatform('iOS');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for null platform (optional)', () => {
      const result = SessionValidator.validatePlatform(null);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for too long platform string', () => {
      const longPlatform = 'a'.repeat(33); // MAX_PLATFORM_LENGTH is 32
      const result = SessionValidator.validatePlatform(longPlatform);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at most 32 characters');
    });
  });

  describe('validateDuration', () => {
    it('should return valid for null duration (optional)', () => {
      const result = SessionValidator.validateDuration(null);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for zero duration', () => {
      const result = SessionValidator.validateDuration(0);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for positive duration', () => {
      const result = SessionValidator.validateDuration(3600000); // 1 hour
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for negative duration', () => {
      const result = SessionValidator.validateDuration(-1000);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Duration cannot be negative');
    });

    it('should return invalid for non-finite duration', () => {
      const result = SessionValidator.validateDuration(Infinity);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Duration must be a finite number');
    });

    it('should return invalid for duration exceeding maximum', () => {
      const result = SessionValidator.validateDuration(25 * 60 * 60 * 1000); // 25 hours
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });
  });

  describe('validateTimestamps', () => {
    it('should return valid for valid timestamps', () => {
      const startedAt = new Date();
      const endedAt = new Date(startedAt.getTime() + 3600000);
      const result = SessionValidator.validateTimestamps(startedAt, endedAt);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for null endedAt', () => {
      const startedAt = new Date();
      const result = SessionValidator.validateTimestamps(startedAt, null);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for null startedAt (optional)', () => {
      const result = SessionValidator.validateTimestamps(null);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for undefined startedAt (optional)', () => {
      const result = SessionValidator.validateTimestamps(undefined);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for endedAt before startedAt', () => {
      const startedAt = new Date();
      const endedAt = new Date(startedAt.getTime() - 3600000);
      const result = SessionValidator.validateTimestamps(startedAt, endedAt);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('End timestamp cannot be before start timestamp');
    });
  });

  describe('validateStatus', () => {
    it('should return valid for ACTIVE status', () => {
      const result = SessionValidator.validateStatus(SessionStatus.ACTIVE);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for ENDED status', () => {
      const result = SessionValidator.validateStatus(SessionStatus.ENDED);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null status', () => {
      const result = SessionValidator.validateStatus(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Session status is required');
    });

    it('should return invalid for unknown status', () => {
      const result = SessionValidator.validateStatus('unknown_status');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid session status');
    });
  });

  describe('validateSession', () => {
    it('should return valid for complete valid session', () => {
      const result = SessionValidator.validateSession({
        playerProfileId: '123e4567-e89b-42d3-a456-426614174000',
        device: 'iPhone 15',
        platform: 'iOS',
        duration: 3600000,
        startedAt: new Date(),
      });
      expect(result.isValid).toBe(true);
    });

    it('should return invalid if player profile ID is missing', () => {
      const result = SessionValidator.validateSession({
        playerProfileId: '',
        device: 'iPhone 15',
        platform: 'iOS',
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateSessionOrThrow', () => {
    it('should not throw for valid session', () => {
      expect(() => {
        SessionValidator.validateSessionOrThrow({
          playerProfileId: '123e4567-e89b-42d3-a456-426614174000',
          device: 'iPhone 15',
          platform: 'iOS',
          startedAt: new Date(),
        });
      }).not.toThrow();
    });

    it('should throw for invalid session', () => {
      expect(() => {
        SessionValidator.validateSessionOrThrow({
          playerProfileId: '',
          device: 'iPhone 15',
          platform: 'iOS',
        });
      }).toThrow('Session validation failed');
    });
  });
});
