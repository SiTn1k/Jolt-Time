/**
 * Configuration Validator Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { ConfigurationValidator } from '../validators/ConfigurationValidator';
import { ConfigurationType } from '../types/ConfigurationType';

describe('ConfigurationValidator', () => {
  describe('validateKey', () => {
    it('should accept valid keys', () => {
      const validKeys = [
        'simple',
        'with_underscore',
        'with123numbers',
        'nested.key',
        'multi.nested.key',
        'a.b.c.d.e.f',
      ];

      for (const key of validKeys) {
        const result = ConfigurationValidator.validateKey(key);
        expect(result.isValid, `Key "${key}" should be valid`).toBe(true);
      }
    });

    it('should reject null/undefined keys', () => {
      expect(ConfigurationValidator.validateKey(null).isValid).toBe(false);
      expect(ConfigurationValidator.validateKey(undefined).isValid).toBe(false);
    });

    it('should reject empty keys', () => {
      const result = ConfigurationValidator.validateKey('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot be empty');
    });

    it('should reject keys starting with number', () => {
      const result = ConfigurationValidator.validateKey('123key');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('start with a letter');
    });

    it('should reject keys with invalid characters', () => {
      const invalidKeys = ['key-with-dash', 'key.with spaces', 'key.with/slash'];
      for (const key of invalidKeys) {
        const result = ConfigurationValidator.validateKey(key);
        expect(result.isValid, `Key "${key}" should be invalid`).toBe(false);
      }
    });

    it('should reject keys exceeding max length', () => {
      const longKey = 'a'.repeat(256);
      const result = ConfigurationValidator.validateKey(longKey);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds maximum length');
    });

    it('should reject keys with segment exceeding max length', () => {
      const longSegment = 'a'.repeat(65);
      const result = ConfigurationValidator.validateKey(`prefix.${longSegment}`);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds maximum length');
    });
  });

  describe('validateValue', () => {
    it('should accept valid string values', () => {
      const result = ConfigurationValidator.validateValue('hello', ConfigurationType.STRING);
      expect(result.isValid).toBe(true);
    });

    it('should reject non-string for STRING type', () => {
      const result = ConfigurationValidator.validateValue(123, ConfigurationType.STRING);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a string');
    });

    it('should accept valid number values', () => {
      const result = ConfigurationValidator.validateValue(42, ConfigurationType.NUMBER);
      expect(result.isValid).toBe(true);
      const floatResult = ConfigurationValidator.validateValue(3.14, ConfigurationType.NUMBER);
      expect(floatResult.isValid).toBe(true);
    });

    it('should reject non-number for NUMBER type', () => {
      const result = ConfigurationValidator.validateValue('not a number', ConfigurationType.NUMBER);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a number');
    });

    it('should reject Infinity for NUMBER type', () => {
      const result = ConfigurationValidator.validateValue(Infinity, ConfigurationType.NUMBER);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('finite number');
    });

    it('should accept valid boolean values', () => {
      const trueResult = ConfigurationValidator.validateValue(true, ConfigurationType.BOOLEAN);
      expect(trueResult.isValid).toBe(true);
      const falseResult = ConfigurationValidator.validateValue(false, ConfigurationType.BOOLEAN);
      expect(falseResult.isValid).toBe(true);
    });

    it('should reject non-boolean for BOOLEAN type', () => {
      const result = ConfigurationValidator.validateValue('true', ConfigurationType.BOOLEAN);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a boolean');
    });

    it('should accept valid JSON object values', () => {
      const result = ConfigurationValidator.validateValue({ key: 'value' }, ConfigurationType.JSON);
      expect(result.isValid).toBe(true);
    });

    it('should reject null for JSON type', () => {
      const result = ConfigurationValidator.validateValue(null, ConfigurationType.JSON);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a JSON object');
    });

    it('should reject array for JSON type', () => {
      const result = ConfigurationValidator.validateValue([1, 2, 3], ConfigurationType.JSON);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a JSON object');
    });

    it('should accept valid array values', () => {
      const result = ConfigurationValidator.validateValue([1, 2, 3], ConfigurationType.ARRAY);
      expect(result.isValid).toBe(true);
    });

    it('should reject non-array for ARRAY type', () => {
      const result = ConfigurationValidator.validateValue({ not: 'array' }, ConfigurationType.ARRAY);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be an array');
    });

    it('should accept valid duration values', () => {
      const result = ConfigurationValidator.validateValue(60000, ConfigurationType.DURATION);
      expect(result.isValid).toBe(true);
      const zeroResult = ConfigurationValidator.validateValue(0, ConfigurationType.DURATION);
      expect(zeroResult.isValid).toBe(true);
    });

    it('should reject negative duration', () => {
      const result = ConfigurationValidator.validateValue(-1000, ConfigurationType.DURATION);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot be negative');
    });

    it('should accept valid percentage values', () => {
      const zeroResult = ConfigurationValidator.validateValue(0, ConfigurationType.PERCENTAGE);
      expect(zeroResult.isValid).toBe(true);
      const fiftyResult = ConfigurationValidator.validateValue(50, ConfigurationType.PERCENTAGE);
      expect(fiftyResult.isValid).toBe(true);
      const hundredResult = ConfigurationValidator.validateValue(100, ConfigurationType.PERCENTAGE);
      expect(hundredResult.isValid).toBe(true);
    });

    it('should reject percentage below 0', () => {
      const result = ConfigurationValidator.validateValue(-1, ConfigurationType.PERCENTAGE);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('between 0 and 100');
    });

    it('should reject percentage above 100', () => {
      const result = ConfigurationValidator.validateValue(101, ConfigurationType.PERCENTAGE);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('between 0 and 100');
    });
  });

  describe('validate', () => {
    it('should validate both key and value', () => {
      const result = ConfigurationValidator.validate('valid.key', 'value', ConfigurationType.STRING);
      expect(result.isValid).toBe(true);
    });

    it('should fail on invalid key', () => {
      const result = ConfigurationValidator.validate('123invalid', 'value', ConfigurationType.STRING);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('start with a letter');
    });

    it('should fail on invalid value', () => {
      const result = ConfigurationValidator.validate('valid.key', 123, ConfigurationType.STRING);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a string');
    });
  });

  describe('validateKeyOrThrow', () => {
    it('should not throw for valid key', () => {
      expect(() => ConfigurationValidator.validateKeyOrThrow('valid.key')).not.toThrow();
    });

    it('should throw for invalid key', () => {
      expect(() => ConfigurationValidator.validateKeyOrThrow('123invalid')).toThrow();
    });
  });

  describe('validateValueOrThrow', () => {
    it('should not throw for valid value', () => {
      expect(() => ConfigurationValidator.validateValueOrThrow('valid', ConfigurationType.STRING)).not.toThrow();
    });

    it('should throw for invalid value', () => {
      expect(() => ConfigurationValidator.validateValueOrThrow(123, ConfigurationType.STRING)).toThrow();
    });
  });

  describe('sanitizeKey', () => {
    it('should trim whitespace', () => {
      const result = ConfigurationValidator.sanitizeKey('  trimmed  ');
      expect(result).toBe('trimmed');
    });

    it('should return null for null input', () => {
      const result = ConfigurationValidator.sanitizeKey(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined input', () => {
      const result = ConfigurationValidator.sanitizeKey(undefined);
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = ConfigurationValidator.sanitizeKey('   ');
      expect(result).toBeNull();
    });
  });
});
