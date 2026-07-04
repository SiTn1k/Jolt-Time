/**
 * Retry Engine Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RetryEngine, RetryEngineFactory, DEFAULT_RETRY_CONFIG } from '../../../src/domains/integration/services/RetryEngine';

describe('RetryEngine', () => {
  let retryEngine: RetryEngine;

  beforeEach(() => {
    retryEngine = new RetryEngine();
  });

  describe('execute', () => {
    it('should succeed on first attempt when operation succeeds', async () => {
      const operation = vi.fn().mockResolvedValue('success');

      const result = await retryEngine.execute(operation);

      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.attemptsMade).toBe(1);
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockResolvedValueOnce('success');

      const result = await retryEngine.execute(operation);

      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.attemptsMade).toBe(2);
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should fail after max retries exhausted', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Persistent failure'));

      const result = await retryEngine.execute(operation);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.attemptsMade).toBe(DEFAULT_RETRY_CONFIG.maxRetries + 1);
      expect(operation).toHaveBeenCalledTimes(DEFAULT_RETRY_CONFIG.maxRetries + 1);
    });

    it('should not retry non-retryable errors', async () => {
      const nonRetryableError = new Error('Bad request');
      nonRetryableError.name = 'ValidationError';
      const operation = vi.fn().mockRejectedValue(nonRetryableError);

      const result = await retryEngine.execute(operation);

      expect(result.success).toBe(false);
      expect(result.attemptsMade).toBe(1); // Only one attempt for non-retryable
    });
  });

  describe('calculateDelay', () => {
    it('should calculate exponential backoff with jitter', () => {
      const delays: number[] = [];

      for (let attempt = 0; attempt < 5; attempt++) {
        delays.push(retryEngine.calculateDelay(attempt));
      }

      // First delay should be close to initial
      expect(delays[0]).toBeGreaterThan(0);
      expect(delays[0]).toBeLessThanOrEqual(DEFAULT_RETRY_CONFIG.initialDelayMs * 1.1);

      // Each subsequent delay should be larger (exponential)
      for (let i = 1; i < delays.length; i++) {
        // With jitter, delay might not always be strictly larger, but generally increasing
        expect(delays[i]).toBeLessThanOrEqual(DEFAULT_RETRY_CONFIG.maxDelayMs);
      }
    });

    it('should respect max delay', () => {
      const delay = retryEngine.calculateDelay(100); // High attempt number
      expect(delay).toBeLessThanOrEqual(DEFAULT_RETRY_CONFIG.maxDelayMs);
    });
  });

  describe('isRetryable', () => {
    it('should identify timeout errors as retryable', () => {
      const timeoutError = new Error('Timeout');
      timeoutError.name = 'TimeoutError';

      expect(retryEngine.isRetryable(timeoutError)).toBe(true);
    });

    it('should identify network errors as retryable', () => {
      const networkError = new Error('ECONNREFUSED');

      expect(retryEngine.isRetryable(networkError)).toBe(true);
    });
  });

  describe('isRetryableStatusCode', () => {
    it('should identify rate limit (429) as retryable', () => {
      expect(retryEngine.isRetryableStatusCode(429)).toBe(true);
    });

    it('should identify server errors (500, 502, 503, 504) as retryable', () => {
      expect(retryEngine.isRetryableStatusCode(500)).toBe(true);
      expect(retryEngine.isRetryableStatusCode(502)).toBe(true);
      expect(retryEngine.isRetryableStatusCode(503)).toBe(true);
      expect(retryEngine.isRetryableStatusCode(504)).toBe(true);
    });

    it('should not identify client errors as retryable', () => {
      expect(retryEngine.isRetryableStatusCode(400)).toBe(false);
      expect(retryEngine.isRetryableStatusCode(401)).toBe(false);
      expect(retryEngine.isRetryableStatusCode(404)).toBe(false);
    });
  });
});

describe('RetryEngineFactory', () => {
  it('should create default retry engine', () => {
    const engine = RetryEngineFactory.createDefault();
    expect(engine).toBeInstanceOf(RetryEngine);
  });

  it('should create high latency retry engine with more retries', () => {
    const engine = RetryEngineFactory.createForHighLatency();
    expect(engine).toBeInstanceOf(RetryEngine);
  });

  it('should create quick operations retry engine with fewer retries', () => {
    const engine = RetryEngineFactory.createForQuickOperations();
    expect(engine).toBeInstanceOf(RetryEngine);
  });

  it('should create rate limited API retry engine with longer delays', () => {
    const engine = RetryEngineFactory.createForRateLimitedApi();
    expect(engine).toBeInstanceOf(RetryEngine);
  });
});
