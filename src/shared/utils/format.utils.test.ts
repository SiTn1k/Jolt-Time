/**
 * Format Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatCompact,
  formatPercent,
  formatDuration,
  formatDurationClock,
  truncate,
  capitalize,
  toTitleCase,
  generateUUID,
} from './format.utils';
import {
  isEqual,
  clamp,
  deepClone,
  groupBy,
  uniqueBy,
} from './common.utils';

describe('Format Utilities', () => {
  describe('formatNumber', () => {
    it('should format numbers with thousand separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(123)).toBe('123');
    });
  });

  describe('formatCompact', () => {
    it('should format numbers compactly', () => {
      expect(formatCompact(1000)).toBe('1K');
      expect(formatCompact(1000000)).toBe('1M');
      expect(formatCompact(1500)).toBe('1.5K');
    });
  });

  describe('formatPercent', () => {
    it('should format percentages', () => {
      expect(formatPercent(50)).toBe('50.0%');
      expect(formatPercent(33.33, 2)).toBe('33.33%');
    });
  });

  describe('formatDuration', () => {
    it('should format milliseconds to human readable', () => {
      expect(formatDuration(1000)).toBe('1s');
      expect(formatDuration(60000)).toBe('1m 0s');
      expect(formatDuration(3600000)).toBe('1h 0m');
      expect(formatDuration(86400000)).toBe('1d 0h');
    });
  });

  describe('formatDurationClock', () => {
    it('should format duration as clock', () => {
      expect(formatDurationClock(59000)).toBe('00:59');
      expect(formatDurationClock(3661000)).toBe('01:01:01');
    });
  });

  describe('truncate', () => {
    it('should truncate strings', () => {
      expect(truncate('hello world', 5)).toBe('he...');
      expect(truncate('hello', 10)).toBe('hello');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('')).toBe('');
    });
  });

  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });
  });

  describe('generateUUID', () => {
    it('should generate valid UUID', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('isEqual', () => {
    it('should compare primitives', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('a', 'a')).toBe(true);
      expect(isEqual(1, '1')).toBe(false);
    });

    it('should compare objects deeply', () => {
      expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('should compare arrays', () => {
      expect(isEqual([1, 2], [1, 2])).toBe(true);
      expect(isEqual([1], [1, 2])).toBe(false);
    });
  });

  describe('clamp', () => {
    it('should clamp values to range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('deepClone', () => {
    it('should clone objects deeply', () => {
      const original = { a: { b: 1 } };
      const clone = deepClone(original);
      expect(clone).toEqual(original);
      expect(clone).not.toBe(original);
    });

    it('should handle arrays', () => {
      const original = [1, [2, 3]];
      const clone = deepClone(original);
      expect(clone).toEqual(original);
      expect(clone).not.toBe(original);
    });
  });

  describe('groupBy', () => {
    it('should group array items by key', () => {
      const items = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const grouped = groupBy(items, (item) => item.type);
      expect(grouped.a).toHaveLength(2);
      expect(grouped.b).toHaveLength(1);
    });
  });

  describe('uniqueBy', () => {
    it('should return unique items by key', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 1 }];
      const unique = uniqueBy(items, (item) => item.id);
      expect(unique).toHaveLength(2);
    });
  });
});
