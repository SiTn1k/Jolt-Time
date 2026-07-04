/**
 * Rate Limiter Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimiter, RateLimiterRegistry, RateLimiterFactory, getRateLimiterRegistry } from '../../../src/domains/integration/services/RateLimiter';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter('test-provider', {
      requestsPerMinute: 10,
      burstLimit: 3,
      cooldownMs: 1000,
      windowSizeMs: 60000,
    });
  });

  describe('check', () => {
    it('should allow first request', () => {
      const result = rateLimiter.check();

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9); // 10 - 1
      expect(result.limit).toBe(10);
    });

    it('should decrement remaining as requests are made', () => {
      rateLimiter.check();
      rateLimiter.check();

      const result = rateLimiter.check();

      expect(result.remaining).toBe(7);
    });

    it('should deny requests when limit is reached', () => {
      for (let i = 0; i < 10; i++) {
        rateLimiter.check();
      }

      const result = rateLimiter.check();

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should include cooldown information when limit reached', () => {
      for (let i = 0; i < 10; i++) {
        rateLimiter.check();
      }

      const result = rateLimiter.check();

      expect(result.cooldownRemainingMs).toBeDefined();
      expect(result.cooldownRemainingMs).toBeGreaterThan(0);
    });
  });

  describe('tryAcquire', () => {
    it('should return true when allowed', () => {
      const allowed = rateLimiter.tryAcquire();
      expect(allowed).toBe(true);
    });

    it('should return false when limit reached', () => {
      for (let i = 0; i < 10; i++) {
        rateLimiter.tryAcquire();
      }

      const allowed = rateLimiter.tryAcquire();
      expect(allowed).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return current statistics', () => {
      rateLimiter.check();
      rateLimiter.check();

      const stats = rateLimiter.getStats();

      expect(stats.providerName).toBe('test-provider');
      expect(stats.currentCount).toBe(2);
      expect(stats.limitPerWindow).toBe(10);
      expect(stats.totalAllowed).toBe(2);
    });

    it('should track rejected requests', () => {
      for (let i = 0; i < 10; i++) {
        rateLimiter.check();
      }
      rateLimiter.check(); // Should be rejected

      const stats = rateLimiter.getStats();
      expect(stats.totalRejected).toBe(1);
    });
  });

  describe('reset', () => {
    it('should reset all counters', () => {
      for (let i = 0; i < 5; i++) {
        rateLimiter.check();
      }

      rateLimiter.reset();

      const stats = rateLimiter.getStats();
      expect(stats.currentCount).toBe(0);
      expect(stats.totalAllowed).toBe(0);
      expect(stats.totalRejected).toBe(0);
    });
  });

  describe('burst limit', () => {
    it('should track burst count', () => {
      rateLimiter.check();
      rateLimiter.check();
      rateLimiter.check();

      const stats = rateLimiter.getStats();
      expect(stats.burstCount).toBe(3);
    });
  });
});

describe('RateLimiterRegistry', () => {
  let registry: RateLimiterRegistry;

  beforeEach(() => {
    registry = new RateLimiterRegistry();
  });

  describe('getOrCreate', () => {
    it('should create new rate limiter', () => {
      const limiter = registry.getOrCreate('test-provider');
      expect(limiter).toBeInstanceOf(RateLimiter);
    });

    it('should return existing rate limiter', () => {
      const limiter1 = registry.getOrCreate('test-provider');
      const limiter2 = registry.getOrCreate('test-provider');
      expect(limiter1).toBe(limiter2);
    });
  });

  describe('get', () => {
    it('should return undefined for non-existent', () => {
      const limiter = registry.get('non-existent');
      expect(limiter).toBeUndefined();
    });
  });

  describe('check', () => {
    it('should check and create if needed', () => {
      const result = registry.check('new-provider');
      expect(result.allowed).toBe(true);
    });
  });

  describe('getAllStats', () => {
    it('should return stats for all limiters', () => {
      registry.getOrCreate('provider-1');
      registry.getOrCreate('provider-2');

      const stats = registry.getAllStats();
      expect(stats).toHaveLength(2);
    });
  });

  describe('resetAll', () => {
    it('should reset all rate limiters', () => {
      const limiter = registry.getOrCreate('test-provider');
      limiter.check();
      limiter.check();

      registry.resetAll();

      const stats = limiter.getStats();
      expect(stats.currentCount).toBe(0);
    });
  });

  describe('size', () => {
    it('should return count of managed limiters', () => {
      registry.getOrCreate('provider-1');
      registry.getOrCreate('provider-2');

      expect(registry.size()).toBe(2);
    });
  });
});

describe('RateLimiterFactory', () => {
  it('should create standard rate limiter', () => {
    const limiter = RateLimiterFactory.createStandard('test');
    expect(limiter).toBeInstanceOf(RateLimiter);
  });

  it('should create premium rate limiter with higher limits', () => {
    const premium = RateLimiterFactory.createPremium('test');
    const standard = RateLimiterFactory.createStandard('test');

    const premiumStats = premium.getStats();
    const standardStats = standard.getStats();

    expect(premiumStats.limitPerWindow).toBeGreaterThan(standardStats.limitPerWindow);
  });

  it('should create strict rate limiter with lower limits', () => {
    const strict = RateLimiterFactory.createStrict('test');
    const standard = RateLimiterFactory.createStandard('test');

    const strictStats = strict.getStats();
    const standardStats = standard.getStats();

    expect(strictStats.limitPerWindow).toBeLessThan(standardStats.limitPerWindow);
  });
});
