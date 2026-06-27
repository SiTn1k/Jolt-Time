/**
 * Assertion Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import {
  assertIsDefined,
  assertIsTrue,
  assertIsNonEmptyString,
  assertIsPositive,
  assertIsInRange,
  assertIsNonEmptyArray,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isDate,
} from './assertion.utils';

describe('Assertion Utilities', () => {
  describe('assertIsDefined', () => {
    it('should not throw for defined value', () => {
      expect(() => assertIsDefined('value')).not.toThrow();
      expect(() => assertIsDefined(0)).not.toThrow();
      expect(() => assertIsDefined(false)).not.toThrow();
    });

    it('should throw for null', () => {
      expect(() => assertIsDefined(null)).toThrow();
    });

    it('should throw for undefined', () => {
      expect(() => assertIsDefined(undefined)).toThrow();
    });

    it('should include custom message', () => {
      expect(() => assertIsDefined(null, 'Custom error')).toThrow('Custom error');
    });
  });

  describe('assertIsTrue', () => {
    it('should not throw for true', () => {
      expect(() => assertIsTrue(true)).not.toThrow();
    });

    it('should throw for false', () => {
      expect(() => assertIsTrue(false)).toThrow();
    });
  });

  describe('assertIsNonEmptyString', () => {
    it('should not throw for non-empty string', () => {
      expect(() => assertIsNonEmptyString('hello')).not.toThrow();
    });

    it('should throw for empty string', () => {
      expect(() => assertIsNonEmptyString('')).toThrow();
    });

    it('should throw for whitespace only', () => {
      expect(() => assertIsNonEmptyString('   ')).toThrow();
    });

    it('should throw for non-string', () => {
      expect(() => assertIsNonEmptyString(123)).toThrow();
    });
  });

  describe('assertIsPositive', () => {
    it('should not throw for positive numbers', () => {
      expect(() => assertIsPositive(1)).not.toThrow();
      expect(() => assertIsPositive(0.5)).not.toThrow();
    });

    it('should throw for zero', () => {
      expect(() => assertIsPositive(0)).toThrow();
    });

    it('should throw for negative numbers', () => {
      expect(() => assertIsPositive(-1)).toThrow();
    });
  });

  describe('assertIsInRange', () => {
    it('should not throw for values in range', () => {
      expect(() => assertIsInRange(5, 0, 10)).not.toThrow();
      expect(() => assertIsInRange(0, 0, 10)).not.toThrow();
      expect(() => assertIsInRange(10, 0, 10)).not.toThrow();
    });

    it('should throw for values out of range', () => {
      expect(() => assertIsInRange(-1, 0, 10)).toThrow();
      expect(() => assertIsInRange(11, 0, 10)).toThrow();
    });
  });

  describe('assertIsNonEmptyArray', () => {
    it('should not throw for non-empty array', () => {
      expect(() => assertIsNonEmptyArray([1, 2, 3])).not.toThrow();
    });

    it('should throw for empty array', () => {
      expect(() => assertIsNonEmptyArray([])).toThrow();
    });
  });

  describe('Type guards', () => {
    it('isString', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
    });

    it('isNumber', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber('123')).toBe(false);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(false);
    });

    it('isBoolean', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean('true')).toBe(false);
    });

    it('isObject', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
    });

    it('isDate', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2024-01-01'))).toBe(true);
      expect(isDate('2024-01-01')).toBe(false);
      expect(isDate(123)).toBe(false);
    });
  });
});
