/**
 * Environment Validator Tests
 *
 * Tests for EnvironmentValidator.
 */

import { describe, it, expect } from 'vitest';
import { EnvironmentValidator } from '../validators/EnvironmentValidator';
import { EnvironmentType } from '../types/EnvironmentType';

describe('EnvironmentValidator', () => {
  describe('isValidName', () => {
    it('should reject null name', () => {
      expect(EnvironmentValidator.isValidName(null)).toBe(false);
    });

    it('should reject undefined name', () => {
      expect(EnvironmentValidator.isValidName(undefined)).toBe(false);
    });

    it('should reject empty name', () => {
      expect(EnvironmentValidator.isValidName('')).toBe(false);
    });

    it('should accept valid environment names', () => {
      expect(EnvironmentValidator.isValidName('production')).toBe(true);
      expect(EnvironmentValidator.isValidName('staging-1')).toBe(true);
      expect(EnvironmentValidator.isValidName('dev_test')).toBe(true);
    });

    it('should reject name starting with hyphen or underscore', () => {
      expect(EnvironmentValidator.isValidName('-production')).toBe(false);
      expect(EnvironmentValidator.isValidName('_production')).toBe(false);
    });

    it('should reject name ending with hyphen or underscore', () => {
      expect(EnvironmentValidator.isValidName('production-')).toBe(false);
      expect(EnvironmentValidator.isValidName('production_')).toBe(false);
    });

    it('should reject name shorter than 2 characters', () => {
      expect(EnvironmentValidator.isValidName('a')).toBe(false);
    });

    it('should reject name longer than 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(EnvironmentValidator.isValidName(longName)).toBe(false);
    });
  });

  describe('isValidType', () => {
    it('should accept all valid environment types', () => {
      expect(EnvironmentValidator.isValidType(EnvironmentType.DEVELOPMENT)).toBe(true);
      expect(EnvironmentValidator.isValidType(EnvironmentType.TESTING)).toBe(true);
      expect(EnvironmentValidator.isValidType(EnvironmentType.STAGING)).toBe(true);
      expect(EnvironmentValidator.isValidType(EnvironmentType.PRODUCTION)).toBe(true);
    });

    it('should reject invalid type', () => {
      expect(EnvironmentValidator.isValidType('invalid')).toBe(false);
      expect(EnvironmentValidator.isValidType('')).toBe(false);
      expect(EnvironmentValidator.isValidType(null)).toBe(false);
    });
  });

  describe('isValidStatus', () => {
    it('should accept active status', () => {
      expect(EnvironmentValidator.isValidStatus('active')).toBe(true);
    });

    it('should accept inactive status', () => {
      expect(EnvironmentValidator.isValidStatus('inactive')).toBe(true);
    });

    it('should reject invalid status', () => {
      expect(EnvironmentValidator.isValidStatus('invalid')).toBe(false);
      expect(EnvironmentValidator.isValidStatus('')).toBe(false);
      expect(EnvironmentValidator.isValidStatus(null)).toBe(false);
    });
  });

  describe('validateEnvironment', () => {
    it('should return valid result for valid environment data', () => {
      const result = EnvironmentValidator.validateEnvironment({
        name: 'production',
        type: EnvironmentType.PRODUCTION,
        status: 'active',
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid name', () => {
      const result = EnvironmentValidator.validateEnvironment({
        name: '',
        type: EnvironmentType.PRODUCTION,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Name'))).toBe(true);
    });

    it('should return errors for invalid type', () => {
      const result = EnvironmentValidator.validateEnvironment({
        name: 'production',
        type: 'invalid',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Type'))).toBe(true);
    });

    it('should return errors for invalid status', () => {
      const result = EnvironmentValidator.validateEnvironment({
        name: 'production',
        type: EnvironmentType.PRODUCTION,
        status: 'invalid',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Status'))).toBe(true);
    });
  });

  describe('validateEnvironmentOrThrow', () => {
    it('should not throw for valid environment data', () => {
      expect(() =>
        EnvironmentValidator.validateEnvironmentOrThrow({
          name: 'production',
          type: EnvironmentType.PRODUCTION,
        })
      ).not.toThrow();
    });

    it('should throw for invalid environment data', () => {
      expect(() =>
        EnvironmentValidator.validateEnvironmentOrThrow({
          name: '',
        })
      ).toThrow();
    });
  });
});
