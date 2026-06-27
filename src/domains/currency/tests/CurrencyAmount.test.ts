/**
 * CurrencyAmount Tests
 *
 * Unit tests for the CurrencyAmount value object.
 */

import { describe, it, expect } from 'vitest';
import { CurrencyAmount } from '../value-objects/CurrencyAmount';

describe('CurrencyAmount', () => {
  describe('create', () => {
    it('should create a valid CurrencyAmount', () => {
      const amount = CurrencyAmount.create(100);
      expect(amount.amount).toBe(100);
    });

    it('should create CurrencyAmount with zero', () => {
      const amount = CurrencyAmount.create(0);
      expect(amount.amount).toBe(0);
      expect(amount.isZero).toBe(true);
    });

    it('should throw for negative amount', () => {
      expect(() => CurrencyAmount.create(-1)).toThrow('Currency amount cannot be negative');
    });

    it('should throw for non-integer amount', () => {
      expect(() => CurrencyAmount.create(1.5)).toThrow('Currency amount must be an integer');
    });

    it('should throw for NaN', () => {
      expect(() => CurrencyAmount.create(NaN)).toThrow('Currency amount must be a valid number');
    });

    it('should throw for amount exceeding MAX_AMOUNT', () => {
      expect(() => CurrencyAmount.create(CurrencyAmount.MAX_AMOUNT + 1)).toThrow('Currency amount exceeds maximum allowed value');
    });
  });

  describe('reconstruct', () => {
    it('should reconstruct without validation', () => {
      const amount = CurrencyAmount.reconstruct(500);
      expect(amount.amount).toBe(500);
    });
  });

  describe('zero', () => {
    it('should create a zero amount', () => {
      const amount = CurrencyAmount.zero();
      expect(amount.amount).toBe(0);
      expect(amount.isZero).toBe(true);
    });
  });

  describe('isValid', () => {
    it('should return true for valid amounts', () => {
      expect(CurrencyAmount.isValid(0)).toBe(true);
      expect(CurrencyAmount.isValid(100)).toBe(true);
      expect(CurrencyAmount.isValid(CurrencyAmount.MAX_AMOUNT)).toBe(true);
    });

    it('should return false for invalid amounts', () => {
      expect(CurrencyAmount.isValid(-1)).toBe(false);
      expect(CurrencyAmount.isValid(1.5)).toBe(false);
      expect(CurrencyAmount.isValid(NaN)).toBe(false);
    });
  });

  describe('comparison methods', () => {
    it('isGreaterThan should work correctly', () => {
      const a = CurrencyAmount.create(100);
      const b = CurrencyAmount.create(50);
      const c = CurrencyAmount.create(100);

      expect(a.isGreaterThan(b)).toBe(true);
      expect(a.isGreaterThan(c)).toBe(false);
      expect(b.isGreaterThan(a)).toBe(false);
    });

    it('isLessThan should work correctly', () => {
      const a = CurrencyAmount.create(50);
      const b = CurrencyAmount.create(100);
      const c = CurrencyAmount.create(50);

      expect(a.isLessThan(b)).toBe(true);
      expect(a.isLessThan(c)).toBe(false);
      expect(b.isLessThan(a)).toBe(false);
    });

    it('equals should work correctly', () => {
      const a = CurrencyAmount.create(100);
      const b = CurrencyAmount.create(100);
      const c = CurrencyAmount.create(50);

      expect(a.equals(b)).toBe(true);
      expect(a.equals(c)).toBe(false);
    });
  });

  describe('formatted', () => {
    it('should format amount with locale', () => {
      const amount = CurrencyAmount.create(1000000);
      expect(amount.formatted).toBe('1,000,000');
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const amount = CurrencyAmount.create(100);
      expect(amount.toString()).toBe('100');
    });
  });
});