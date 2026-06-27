/**
 * GameState Validator Unit Tests
 *
 * Tests for EnergyValidator, HealthValidator, and SessionValidator.
 */

import { describe, it, expect } from 'vitest';
import { EnergyValidator } from '../validators/EnergyValidator';
import { HealthValidator } from '../validators/HealthValidator';
import { SessionValidator } from '../validators/SessionValidator';
import { SessionId } from '../value-objects/SessionId';
import { SessionState } from '../types/SessionState';

describe('EnergyValidator', () => {
  describe('validate', () => {
    it('should return valid for proper energy values', () => {
      const result = EnergyValidator.validate(50, 100);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for full energy', () => {
      const result = EnergyValidator.validate(100, 100);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for zero energy', () => {
      const result = EnergyValidator.validate(0, 100);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null value', () => {
      const result = EnergyValidator.validate(undefined as unknown as number, 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Energy value must be a valid number');
    });

    it('should return invalid for null maximum', () => {
      const result = EnergyValidator.validate(50, undefined as unknown as number);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Maximum energy must be a valid number');
    });

    it('should return invalid for negative energy', () => {
      const result = EnergyValidator.validate(-1, 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot be less than');
    });

    it('should return invalid for negative maximum', () => {
      const result = EnergyValidator.validate(50, -1);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot be less than');
    });

    it('should return invalid for energy above maximum', () => {
      const result = EnergyValidator.validate(101, 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot exceed maximum');
    });

    it('should return invalid for maximum above limit', () => {
      const result = EnergyValidator.validate(50, 1000);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot exceed');
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid energy', () => {
      expect(() => EnergyValidator.validateOrThrow(50, 100)).not.toThrow();
    });

    it('should throw for invalid energy', () => {
      expect(() => EnergyValidator.validateOrThrow(-1, 100)).toThrow('Energy validation failed');
    });
  });

  describe('validateConsumption', () => {
    it('should return valid for affordable cost', () => {
      const result = EnergyValidator.validateConsumption(50, 30);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for exact energy match', () => {
      const result = EnergyValidator.validateConsumption(50, 50);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for cost above current energy', () => {
      const result = EnergyValidator.validateConsumption(50, 60);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Insufficient energy');
    });

    it('should return invalid for negative cost', () => {
      const result = EnergyValidator.validateConsumption(50, -10);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Cost cannot be negative');
    });

    it('should return invalid for null cost', () => {
      const result = EnergyValidator.validateConsumption(50, undefined as unknown as number);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Cost must be a valid number');
    });
  });

  describe('validateMaximum', () => {
    it('should return valid for valid maximum', () => {
      const result = EnergyValidator.validateMaximum(100);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for zero maximum', () => {
      const result = EnergyValidator.validateMaximum(0);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for negative maximum', () => {
      const result = EnergyValidator.validateMaximum(-1);
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for maximum above limit', () => {
      const result = EnergyValidator.validateMaximum(1000);
      expect(result.isValid).toBe(false);
    });
  });
});

describe('HealthValidator', () => {
  describe('validate', () => {
    it('should return valid for proper health values', () => {
      const result = HealthValidator.validate(50, 100);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for full health', () => {
      const result = HealthValidator.validate(100, 100);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for zero health', () => {
      const result = HealthValidator.validate(0, 100);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null value', () => {
      const result = HealthValidator.validate(undefined as unknown as number, 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Health value must be a valid number');
    });

    it('should return invalid for null maximum', () => {
      const result = HealthValidator.validate(50, undefined as unknown as number);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Maximum health must be a valid number');
    });

    it('should return invalid for negative health', () => {
      const result = HealthValidator.validate(-1, 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot be less than');
    });

    it('should return invalid for health above maximum', () => {
      const result = HealthValidator.validate(101, 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot exceed maximum');
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid health', () => {
      expect(() => HealthValidator.validateOrThrow(50, 100)).not.toThrow();
    });

    it('should throw for invalid health', () => {
      expect(() => HealthValidator.validateOrThrow(-1, 100)).toThrow('Health validation failed');
    });
  });

  describe('validateDamage', () => {
    it('should return valid for survivable damage', () => {
      const result = HealthValidator.validateDamage(50, 30);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for lethal damage', () => {
      const result = HealthValidator.validateDamage(50, 51);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Damage cannot exceed current health');
    });

    it('should return invalid for negative damage', () => {
      const result = HealthValidator.validateDamage(50, -10);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Damage cannot be negative');
    });

    it('should return invalid for null damage', () => {
      const result = HealthValidator.validateDamage(50, undefined as unknown as number);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Damage must be a valid number');
    });
  });

  describe('validateMaximum', () => {
    it('should return valid for valid maximum', () => {
      const result = HealthValidator.validateMaximum(100);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for maximum above limit', () => {
      const result = HealthValidator.validateMaximum(10000);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateHealing', () => {
    it('should return valid for healing within max', () => {
      const result = HealthValidator.validateHealing(50, 100, 30);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for healing to exact max', () => {
      const result = HealthValidator.validateHealing(90, 100, 10);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for healing above max', () => {
      const result = HealthValidator.validateHealing(90, 100, 20);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Healing would exceed maximum health');
    });

    it('should return invalid for negative healing', () => {
      const result = HealthValidator.validateHealing(50, 100, -10);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Healing cannot be negative');
    });
  });
});

describe('SessionValidator', () => {
  describe('validateSessionId', () => {
    it('should return valid for proper UUID', () => {
      // Valid UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const result = SessionValidator.validateSessionId('123e4567-e89b-42d3-a456-426614174000');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty string', () => {
      const result = SessionValidator.validateSessionId('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Session ID cannot be empty');
    });

    it('should return invalid for whitespace only', () => {
      const result = SessionValidator.validateSessionId('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Session ID cannot be empty');
    });

    it('should return invalid for invalid UUID format', () => {
      const result = SessionValidator.validateSessionId('invalid-uuid');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid session ID format');
    });
  });

  describe('validateSessionIdOrThrow', () => {
    it('should not throw for valid session ID', () => {
      expect(() => SessionValidator.validateSessionIdOrThrow('123e4567-e89b-42d3-a456-426614174000')).not.toThrow();
    });

    it('should throw for invalid session ID', () => {
      expect(() => SessionValidator.validateSessionIdOrThrow('')).toThrow('Session ID validation failed');
    });
  });

  describe('validateSessionActive', () => {
    it('should return invalid for empty session', () => {
      const sessionId = SessionId.empty();
      const result = SessionValidator.validateSessionActive(sessionId);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('No active session');
    });

    it('should return valid for non-empty session', () => {
      const sessionId = SessionId.generate();
      const result = SessionValidator.validateSessionActive(sessionId);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateStateTransition', () => {
    it('should allow NONE to STARTING', () => {
      const result = SessionValidator.validateStateTransition(SessionState.NONE, SessionState.STARTING);
      expect(result.isValid).toBe(true);
    });

    it('should allow STARTING to ACTIVE', () => {
      const result = SessionValidator.validateStateTransition(SessionState.STARTING, SessionState.ACTIVE);
      expect(result.isValid).toBe(true);
    });

    it('should allow ACTIVE to PAUSED', () => {
      const result = SessionValidator.validateStateTransition(SessionState.ACTIVE, SessionState.PAUSED);
      expect(result.isValid).toBe(true);
    });

    it('should allow ACTIVE to ENDED', () => {
      const result = SessionValidator.validateStateTransition(SessionState.ACTIVE, SessionState.ENDED);
      expect(result.isValid).toBe(true);
    });

    it('should allow PAUSED to ACTIVE', () => {
      const result = SessionValidator.validateStateTransition(SessionState.PAUSED, SessionState.ACTIVE);
      expect(result.isValid).toBe(true);
    });

    it('should allow ENDED to NONE', () => {
      const result = SessionValidator.validateStateTransition(SessionState.ENDED, SessionState.NONE);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid transition', () => {
      const result = SessionValidator.validateStateTransition(SessionState.NONE, SessionState.ACTIVE);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid session state transition');
    });

    it('should reject ACTIVE to STARTING', () => {
      const result = SessionValidator.validateStateTransition(SessionState.ACTIVE, SessionState.STARTING);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateStateTransitionOrThrow', () => {
    it('should not throw for valid transition', () => {
      expect(() => SessionValidator.validateStateTransitionOrThrow(SessionState.NONE, SessionState.STARTING)).not.toThrow();
    });

    it('should throw for invalid transition', () => {
      expect(() => SessionValidator.validateStateTransitionOrThrow(SessionState.NONE, SessionState.ACTIVE)).toThrow('Session state transition validation failed');
    });
  });
});