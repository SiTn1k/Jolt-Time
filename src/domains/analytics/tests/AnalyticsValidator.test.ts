/**
 * AnalyticsValidator Tests
 *
 * Unit tests for the AnalyticsValidator.
 */

import { describe, it, expect } from 'vitest';
import { AnalyticsValidator } from '../validators/AnalyticsValidator';
import { AnalyticsEventType } from '../types/AnalyticsEventType';

describe('AnalyticsValidator', () => {
  describe('validateEventType', () => {
    it('should return valid for a valid event type', () => {
      const result = AnalyticsValidator.validateEventType(AnalyticsEventType.GAMEPLAY);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for null event type', () => {
      const result = AnalyticsValidator.validateEventType(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Event type is required');
    });

    it('should return invalid for undefined event type', () => {
      const result = AnalyticsValidator.validateEventType(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Event type is required');
    });

    it('should return invalid for unknown event type', () => {
      const result = AnalyticsValidator.validateEventType('unknown_type');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid event type');
    });
  });

  describe('validateSourceModule', () => {
    it('should return valid for a valid source module', () => {
      const result = AnalyticsValidator.validateSourceModule('museum');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null source module', () => {
      const result = AnalyticsValidator.validateSourceModule(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Source module is required');
    });

    it('should return invalid for empty source module', () => {
      const result = AnalyticsValidator.validateSourceModule('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Source module cannot be empty');
    });

    it('should return invalid for too long source module', () => {
      const longModule = 'a'.repeat(65);
      const result = AnalyticsValidator.validateSourceModule(longModule);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at most 64 characters');
    });
  });

  describe('validatePayload', () => {
    it('should return valid for null payload', () => {
      const result = AnalyticsValidator.validatePayload(null);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for undefined payload', () => {
      const result = AnalyticsValidator.validatePayload(undefined);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for empty payload', () => {
      const result = AnalyticsValidator.validatePayload({});
      expect(result.isValid).toBe(true);
    });

    it('should return valid for valid payload', () => {
      const result = AnalyticsValidator.validatePayload({ key: 'value' });
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for oversized payload', () => {
      const largePayload = { data: 'a'.repeat(11000) };
      const result = AnalyticsValidator.validatePayload(largePayload);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Payload size exceeds');
    });
  });

  describe('validatePlayerProfileId', () => {
    it('should return valid for a valid player profile ID', () => {
      const result = AnalyticsValidator.validatePlayerProfileId('123e4567-e89b-42d3-a456-426614174000');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null player profile ID', () => {
      const result = AnalyticsValidator.validatePlayerProfileId(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Player profile ID is required');
    });

    it('should return invalid for empty player profile ID', () => {
      const result = AnalyticsValidator.validatePlayerProfileId('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Player profile ID cannot be empty');
    });
  });

  describe('validateSessionId', () => {
    it('should return valid for a valid session ID', () => {
      const result = AnalyticsValidator.validateSessionId('123e4567-e89b-42d3-a456-426614174000');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null session ID', () => {
      const result = AnalyticsValidator.validateSessionId(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Session ID is required');
    });

    it('should return invalid for empty session ID', () => {
      const result = AnalyticsValidator.validateSessionId('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Session ID cannot be empty');
    });
  });

  describe('validateEvent', () => {
    it('should return valid for complete valid event', () => {
      const result = AnalyticsValidator.validateEvent({
        eventType: AnalyticsEventType.GAMEPLAY,
        playerProfileId: '123e4567-e89b-42d3-a456-426614174000',
        sessionId: '123e4567-e89b-42d3-a456-426614174001',
        sourceModule: 'test-module',
        payload: { key: 'value' },
      });
      expect(result.isValid).toBe(true);
    });

    it('should return invalid if any field is invalid', () => {
      const result = AnalyticsValidator.validateEvent({
        eventType: 'invalid_type',
        playerProfileId: '123e4567-e89b-42d3-a456-426614174000',
        sessionId: '123e4567-e89b-42d3-a456-426614174001',
        sourceModule: 'test-module',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid event type');
    });
  });

  describe('validateEventOrThrow', () => {
    it('should not throw for valid event', () => {
      expect(() => {
        AnalyticsValidator.validateEventOrThrow({
          eventType: AnalyticsEventType.GAMEPLAY,
          playerProfileId: '123e4567-e89b-42d3-a456-426614174000',
          sessionId: '123e4567-e89b-42d3-a456-426614174001',
          sourceModule: 'test-module',
        });
      }).not.toThrow();
    });

    it('should throw for invalid event', () => {
      expect(() => {
        AnalyticsValidator.validateEventOrThrow({
          eventType: 'invalid_type',
          playerProfileId: '123e4567-e89b-42d3-a456-426614174000',
          sessionId: '123e4567-e89b-42d3-a456-426614174001',
          sourceModule: 'test-module',
        });
      }).toThrow('Analytics event validation failed');
    });
  });
});
