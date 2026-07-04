/**
 * Circuit Breaker Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CircuitBreaker, CircuitBreakerRegistry, getCircuitBreakerRegistry } from '../../../src/domains/integration/services/CircuitBreaker';

describe('CircuitBreaker', () => {
  let circuitBreaker: CircuitBreaker;

  beforeEach(() => {
    circuitBreaker = new CircuitBreaker('test-service', {
      failureThreshold: 3,
      successThreshold: 2,
      openTimeoutMs: 1000,
      timeoutMs: 1000,
    });
  });

  describe('initial state', () => {
    it('should start in closed state', () => {
      expect(circuitBreaker.getState()).toBe('closed');
    });

    it('should allow requests when closed', () => {
      expect(circuitBreaker.isRequestAllowed()).toBe(true);
    });
  });

  describe('execute', () => {
    it('should allow successful operations', async () => {
      const operation = vi.fn().mockResolvedValue('success');

      const result = await circuitBreaker.execute(operation);

      expect(result.allowed).toBe(true);
      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
    });

    it('should record failures', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Failure'));

      await circuitBreaker.execute(operation);

      const stats = circuitBreaker.getStats();
      expect(stats.totalFailures).toBe(1);
    });

    it('should open circuit after failure threshold', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Failure'));

      for (let i = 0; i < 3; i++) {
        await circuitBreaker.execute(operation);
      }

      expect(circuitBreaker.getState()).toBe('open');
      expect(circuitBreaker.isRequestAllowed()).toBe(false);
    });

    it('should not allow operations when open', async () => {
      const operation = vi.fn().mockResolvedValue('success');

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        await circuitBreaker.execute(vi.fn().mockRejectedValue(new Error('Failure')));
      }

      const result = await circuitBreaker.execute(operation);

      expect(result.allowed).toBe(false);
      expect(result.success).toBe(false);
    });
  });

  describe('state transitions', () => {
    it('should transition to half-open after timeout', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Failure'));

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        await circuitBreaker.execute(operation);
      }

      expect(circuitBreaker.getState()).toBe('open');

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Should transition to half-open
      expect(circuitBreaker.getState()).toBe('half_open');
    });

    it('should close after success threshold in half-open', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Failure'));

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        await circuitBreaker.execute(operation);
      }

      // Wait for half-open transition
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Successful operations
      const successOperation = vi.fn().mockResolvedValue('success');
      await circuitBreaker.execute(successOperation);
      await circuitBreaker.execute(successOperation);

      expect(circuitBreaker.getState()).toBe('closed');
    });

    it('should reopen after failure in half-open', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Failure'));

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        await circuitBreaker.execute(operation);
      }

      // Wait for half-open transition
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Failed operation in half-open
      await circuitBreaker.execute(operation);

      expect(circuitBreaker.getState()).toBe('open');
    });
  });

  describe('recordSuccess and recordFailure', () => {
    it('should record success and track stats', () => {
      circuitBreaker.recordSuccess();
      circuitBreaker.recordSuccess();

      const stats = circuitBreaker.getStats();
      expect(stats.totalSuccesses).toBe(2);
    });

    it('should record failure and track stats', () => {
      circuitBreaker.recordFailure(new Error('Test error'));

      const stats = circuitBreaker.getStats();
      expect(stats.totalFailures).toBe(1);
      expect(stats.lastFailureAt).toBeDefined();
    });

    it('should record timeout', () => {
      circuitBreaker.recordTimeout();

      const stats = circuitBreaker.getStats();
      expect(stats.totalFailures).toBe(1);
    });
  });

  describe('reset', () => {
    it('should reset circuit breaker to initial state', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Failure'));

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        await circuitBreaker.execute(operation);
      }

      circuitBreaker.reset();

      expect(circuitBreaker.getState()).toBe('closed');
      expect(circuitBreaker.isRequestAllowed()).toBe(true);

      const stats = circuitBreaker.getStats();
      expect(stats.failureCount).toBe(0);
    });
  });

  describe('listeners', () => {
    it('should notify listeners on state change', async () => {
      const listener = vi.fn();
      circuitBreaker.addListener(listener);

      const operation = vi.fn().mockRejectedValue(new Error('Failure'));

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        await circuitBreaker.execute(operation);
      }

      expect(listener).toHaveBeenCalledWith('state_change', expect.any(Object));
    });

    it('should remove listeners', () => {
      const listener = vi.fn();
      circuitBreaker.addListener(listener);
      circuitBreaker.removeListener(listener);

      const operation = vi.fn().mockRejectedValue(new Error('Failure'));

      for (let i = 0; i < 3; i++) {
        await circuitBreaker.execute(operation);
      }

      expect(listener).not.toHaveBeenCalled();
    });
  });
});

describe('CircuitBreakerRegistry', () => {
  let registry: CircuitBreakerRegistry;

  beforeEach(() => {
    registry = new CircuitBreakerRegistry();
  });

  describe('getOrCreate', () => {
    it('should create new circuit breaker', () => {
      const cb = registry.getOrCreate('test-service');
      expect(cb).toBeInstanceOf(CircuitBreaker);
    });

    it('should return existing circuit breaker', () => {
      const cb1 = registry.getOrCreate('test-service');
      const cb2 = registry.getOrCreate('test-service');
      expect(cb1).toBe(cb2);
    });
  });

  describe('get', () => {
    it('should return undefined for non-existent circuit breaker', () => {
      const cb = registry.get('non-existent');
      expect(cb).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove circuit breaker', () => {
      registry.getOrCreate('test-service');
      registry.remove('test-service');

      const cb = registry.get('test-service');
      expect(cb).toBeUndefined();
    });
  });

  describe('getAllStats', () => {
    it('should return stats for all circuit breakers', async () => {
      registry.getOrCreate('service-1');
      registry.getOrCreate('service-2');

      const stats = registry.getAllStats();
      expect(stats.size).toBe(2);
    });
  });

  describe('resetAll', () => {
    it('should reset all circuit breakers', async () => {
      const cb = registry.getOrCreate('test-service');

      // Open the circuit
      for (let i = 0; i < 3; i++) {
        await cb.execute(vi.fn().mockRejectedValue(new Error('Failure')));
      }

      registry.resetAll();

      expect(cb.getState()).toBe('closed');
    });
  });
});
