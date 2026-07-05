/**
 * TTLEngine Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TTLEngine } from '../services/TTLEngine';
import { CacheEntry } from '../entities/CacheEntry';
import { CacheKey } from '../value-objects/CacheKey';

describe('TTLEngine', () => {
  let ttlEngine: TTLEngine;

  beforeEach(() => {
    ttlEngine = new TTLEngine(60); // 60 second sliding window
  });

  describe('TTL Creation', () => {
    it('should create absolute TTL', () => {
      const config = ttlEngine.createAbsoluteTTL(3600);

      expect(config.type).toBe('absolute');
      expect(config.ttlSeconds).toBe(3600);
      expect(config.expiresAt).not.toBeNull();
      expect(config.expiresAt!.getTime()).toBeGreaterThan(Date.now());
    });

    it('should create sliding TTL', () => {
      const config = ttlEngine.createSlidingTTL(1800);

      expect(config.type).toBe('sliding');
      expect(config.ttlSeconds).toBe(1800);
      expect(config.expiresAt).not.toBeNull();
    });

    it('should create manual TTL', () => {
      const expiresAt = new Date(Date.now() + 3600 * 1000);
      const config = ttlEngine.createManualTTL(expiresAt);

      expect(config.type).toBe('manual');
      expect(config.ttlSeconds).toBeNull();
      expect(config.expiresAt).toEqual(expiresAt);
    });

    it('should create no TTL', () => {
      const config = ttlEngine.createNoTTL();

      expect(config.type).toBe('none');
      expect(config.ttlSeconds).toBeNull();
      expect(config.expiresAt).toBeNull();
    });
  });

  describe('Expiration Checking', () => {
    it('should detect expired entry', () => {
      const entry = CacheEntry.create({
        cacheKey: CacheKey.create('test'),
        cacheValue: 'value',
        cacheType: 'memory',
        expiresAt: new Date(Date.now() - 1000), // expired 1 second ago
      });

      expect(ttlEngine.isExpired(entry)).toBe(true);
    });

    it('should detect non-expired entry', () => {
      const entry = CacheEntry.create({
        cacheKey: CacheKey.create('test'),
        cacheValue: 'value',
        cacheType: 'memory',
        expiresAt: new Date(Date.now() + 3600 * 1000), // expires in 1 hour
      });

      expect(ttlEngine.isExpired(entry)).toBe(false);
    });

    it('should return false for entry without expiration', () => {
      const entry = CacheEntry.create({
        cacheKey: CacheKey.create('test'),
        cacheValue: 'value',
        cacheType: 'memory',
        expiresAt: null,
      });

      expect(ttlEngine.isExpired(entry)).toBe(false);
    });

    it('should detect expiring soon entry', () => {
      const entry = CacheEntry.create({
        cacheKey: CacheKey.create('test'),
        cacheValue: 'value',
        cacheType: 'memory',
        expiresAt: new Date(Date.now() + 30 * 1000), // expires in 30 seconds
      });

      expect(ttlEngine.isExpiringSoon(entry, 60)).toBe(true);
    });

    it('should not mark non-expiring entry as expiring soon', () => {
      const entry = CacheEntry.create({
        cacheKey: CacheKey.create('test'),
        cacheValue: 'value',
        cacheType: 'memory',
        expiresAt: new Date(Date.now() + 3600 * 1000), // expires in 1 hour
      });

      expect(ttlEngine.isExpiringSoon(entry, 60)).toBe(false);
    });
  });

  describe('TTL Calculations', () => {
    it('should calculate remaining TTL', () => {
      const entry = CacheEntry.create({
        cacheKey: CacheKey.create('test'),
        cacheValue: 'value',
        cacheType: 'memory',
        expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
      });

      const remaining = ttlEngine.getRemainingTTL(entry);

      expect(remaining).toBeGreaterThan(3590);
      expect(remaining).toBeLessThanOrEqual(3600);
    });

    it('should return null for entry without expiration', () => {
      const entry = CacheEntry.create({
        cacheKey: CacheKey.create('test'),
        cacheValue: 'value',
        cacheType: 'memory',
        expiresAt: null,
      });

      expect(ttlEngine.getRemainingTTL(entry)).toBeNull();
    });

    it('should calculate elapsed time', () => {
      const entry = CacheEntry.create({
        cacheKey: CacheKey.create('test'),
        cacheValue: 'value',
        cacheType: 'memory',
        createdAt: new Date(Date.now() - 10000), // created 10 seconds ago
      });

      const elapsed = ttlEngine.getElapsedTime(entry);

      expect(elapsed).toBeGreaterThanOrEqual(9);
      expect(elapsed).toBeLessThanOrEqual(11);
    });

    it('should extend TTL', () => {
      const entry = CacheEntry.create({
        cacheKey: CacheKey.create('test'),
        cacheValue: 'value',
        cacheType: 'memory',
        expiresAt: new Date(Date.now() + 3600 * 1000),
      });

      const newExpiresAt = ttlEngine.extend(entry, 1800);

      expect(newExpiresAt).not.toBeNull();
      expect(newExpiresAt!.getTime()).toBeGreaterThan(entry.expiresAt!.getTime());
    });

    it('should calculate expiration from TTL', () => {
      const expiresAt = ttlEngine.calculateExpiration(3600);

      expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('should calculate TTL from expiration', () => {
      const futureDate = new Date(Date.now() + 3600 * 1000);
      const ttl = ttlEngine.calculateTTLFromExpiration(futureDate);

      expect(ttl).toBeGreaterThan(3590);
      expect(ttl).toBeLessThanOrEqual(3600);
    });
  });

  describe('Batch Expiration Check', () => {
    it('should separate expired, valid, and expiring soon entries', () => {
      const entries = [
        CacheEntry.create({
          cacheKey: CacheKey.create('expired'),
          cacheValue: 'value',
          cacheType: 'memory',
          expiresAt: new Date(Date.now() - 1000),
        }),
        CacheEntry.create({
          cacheKey: CacheKey.create('expiring'),
          cacheValue: 'value',
          cacheType: 'memory',
          expiresAt: new Date(Date.now() + 30 * 1000),
        }),
        CacheEntry.create({
          cacheKey: CacheKey.create('valid'),
          cacheValue: 'value',
          cacheType: 'memory',
          expiresAt: new Date(Date.now() + 3600 * 1000),
        }),
      ];

      const result = ttlEngine.checkExpiration(entries);

      expect(result.expired).toHaveLength(1);
      expect(result.expired[0].cacheKey.value).toBe('expired');
      expect(result.expiringSoon).toHaveLength(1);
      expect(result.expiringSoon[0].cacheKey.value).toBe('expiring');
      expect(result.valid).toHaveLength(1);
      expect(result.valid[0].cacheKey.value).toBe('valid');
    });
  });

  describe('TTL Parsing', () => {
    it('should parse seconds', () => {
      expect(ttlEngine.parseTTL(60)).toBe(60);
    });

    it('should parse string seconds', () => {
      expect(ttlEngine.parseTTL('60s')).toBe(60);
    });

    it('should parse string minutes', () => {
      expect(ttlEngine.parseTTL('30m')).toBe(1800);
    });

    it('should parse string hours', () => {
      expect(ttlEngine.parseTTL('2h')).toBe(7200);
    });

    it('should parse string days', () => {
      expect(ttlEngine.parseTTL('1d')).toBe(86400);
    });

    it('should return null for invalid input', () => {
      expect(ttlEngine.parseTTL(null)).toBeNull();
      expect(ttlEngine.parseTTL(undefined)).toBeNull();
      expect(ttlEngine.parseTTL('')).toBeNull();
      expect(ttlEngine.parseTTL('invalid')).toBeNull();
    });

    it('should return null for negative values', () => {
      expect(ttlEngine.parseTTL(-1)).toBeNull();
      expect(ttlEngine.parseTTL('-1s')).toBeNull();
    });
  });

  describe('TTL Formatting', () => {
    it('should format seconds', () => {
      expect(ttlEngine.formatTTL(30)).toBe('30s');
    });

    it('should format minutes and seconds', () => {
      expect(ttlEngine.formatTTL(90)).toBe('1m 30s');
    });

    it('should format hours', () => {
      expect(ttlEngine.formatTTL(3600)).toBe('1h');
    });

    it('should format hours and minutes', () => {
      expect(ttlEngine.formatTTL(5400)).toBe('1h 30m');
    });

    it('should format days', () => {
      expect(ttlEngine.formatTTL(86400)).toBe('24h');
    });
  });

  describe('Statistics', () => {
    it('should track expiration checks', () => {
      const entry = CacheEntry.create({
        cacheKey: CacheKey.create('test'),
        cacheValue: 'value',
        cacheType: 'memory',
        expiresAt: new Date(Date.now() + 3600 * 1000),
      });

      ttlEngine.isExpired(entry);
      ttlEngine.isExpired(entry);

      const stats = ttlEngine.getStatistics([entry]);

      expect(stats.checkCount).toBe(2);
    });

    it('should reset statistics', () => {
      const entry = CacheEntry.create({
        cacheKey: CacheKey.create('test'),
        cacheValue: 'value',
        cacheType: 'memory',
        expiresAt: new Date(Date.now() - 1000),
      });

      ttlEngine.isExpired(entry);

      ttlEngine.resetStatistics();

      const stats = ttlEngine.getStatistics([entry]);
      expect(stats.checkCount).toBe(0);
    });
  });
});
