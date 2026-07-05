/**
 * Optimization Failure Handler Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  OptimizationFailureHandler,
  RecoveryStrategy,
} from '../services/OptimizationFailureHandler';

// Mock logger
vi.mock('../../../core/logging/logger.service', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('OptimizationFailureHandler', () => {
  let handler: OptimizationFailureHandler;

  beforeEach(() => {
    handler = new OptimizationFailureHandler({
      maxRetries: 3,
      retryDelayMs: 10,
      enableFallback: true,
      logFailures: true,
    });
  });

  describe('executeWithRecovery', () => {
    it('should return successful result when operation succeeds', async () => {
      const result = await handler.executeWithRecovery(
        async () => 'success',
        'test-component',
        'default'
      );

      expect(result.success).toBe(true);
      expect(result.value).toBe('success');
      expect(result.recovered).toBe(false);
    });

    it('should retry on failure and eventually succeed', async () => {
      let attempts = 0;
      const result = await handler.executeWithRecovery(
        async () => {
          attempts++;
          if (attempts < 3) {
            throw new Error('Temporary failure');
          }
          return 'success';
        },
        'test-component',
        'default'
      );

      expect(result.success).toBe(true);
      expect(result.value).toBe('success');
      expect(result.recovered).toBe(true);
      expect(result.strategy).toBe(RecoveryStrategy.RETRY);
    });

    it('should return default value when all retries fail', async () => {
      const result = await handler.executeWithRecovery(
        async () => {
          throw new Error('Permanent failure');
        },
        'test-component',
        'default-value',
        { operationName: 'test-op' }
      );

      expect(result.success).toBe(false);
      expect(result.value).toBe('default-value');
      expect(result.recovered).toBe(true);
      expect(result.strategy).toBe(RecoveryStrategy.RETURN_DEFAULT);
      expect(result.error).toBe('Permanent failure');
    });

    it('should skip when fallback is disabled', async () => {
      const disabledHandler = new OptimizationFailureHandler({
        maxRetries: 0,
        enableFallback: false,
        logFailures: false,
      });

      const result = await disabledHandler.executeWithRecovery(
        async () => {
          throw new Error('Failure');
        },
        'test-component',
        'default-value'
      );

      expect(result.success).toBe(false);
      expect(result.value).toBeUndefined();
      expect(result.recovered).toBe(false);
      expect(result.strategy).toBe(RecoveryStrategy.SKIP);
    });
  });

  describe('executeWithRecoverySync', () => {
    it('should return successful result when operation succeeds', () => {
      const result = handler.executeWithRecoverySync(
        () => 'success',
        'test-component',
        'default'
      );

      expect(result.success).toBe(true);
      expect(result.value).toBe('success');
      expect(result.recovered).toBe(false);
    });

    it('should return default value when operation fails', () => {
      const result = handler.executeWithRecoverySync(
        () => {
          throw new Error('Sync failure');
        },
        'test-component',
        'default-value'
      );

      expect(result.success).toBe(false);
      expect(result.value).toBe('default-value');
      expect(result.recovered).toBe(true);
      expect(result.strategy).toBe(RecoveryStrategy.RETURN_DEFAULT);
    });
  });

  describe('Failure Logging', () => {
    it('should log failures', async () => {
      await handler.executeWithRecovery(
        async () => {
          throw new Error('Test error');
        },
        'test-component',
        'default'
      );

      expect(handler.getTotalFailureCount()).toBe(1);
    });

    it('should get failures by component', async () => {
      await handler.executeWithRecovery(
        async () => {
          throw new Error('Error 1');
        },
        'component-a',
        'default'
      );

      await handler.executeWithRecovery(
        async () => {
          throw new Error('Error 2');
        },
        'component-b',
        'default'
      );

      await handler.executeWithRecovery(
        async () => {
          throw new Error('Error 3');
        },
        'component-a',
        'default'
      );

      const componentAFailures = handler.getFailuresByComponent('component-a');
      expect(componentAFailures).toHaveLength(2);

      const componentBFailures = handler.getFailuresByComponent('component-b');
      expect(componentBFailures).toHaveLength(1);
    });

    it('should get failures by operation', async () => {
      await handler.executeWithRecovery(
        async () => {
          throw new Error('Error');
        },
        'test-component',
        'default',
        { operationName: 'op-a' }
      );

      await handler.executeWithRecovery(
        async () => {
          throw new Error('Error');
        },
        'test-component',
        'default',
        { operationName: 'op-b' }
      );

      const opAFailures = handler.getFailuresByOperation('op-a');
      expect(opAFailures).toHaveLength(1);

      const opBFailures = handler.getFailuresByOperation('op-b');
      expect(opBFailures).toHaveLength(1);
    });

    it('should get recent failures', async () => {
      for (let i = 0; i < 5; i++) {
        await handler.executeWithRecovery(
          async () => {
            throw new Error(`Error ${i}`);
          },
          'test-component',
          'default'
        );
      }

      const recent = handler.getRecentFailures(3);
      expect(recent).toHaveLength(3);
    });

    it('should get failure counts by component', async () => {
      await handler.executeWithRecovery(
        async () => {
          throw new Error('Error');
        },
        'component-a',
        'default'
      );

      await handler.executeWithRecovery(
        async () => {
          throw new Error('Error');
        },
        'component-a',
        'default'
      );

      await handler.executeWithRecovery(
        async () => {
          throw new Error('Error');
        },
        'component-b',
        'default'
      );

      const counts = handler.getFailureCountByComponent();

      expect(counts['component-a']).toBe(2);
      expect(counts['component-b']).toBe(1);
    });

    it('should clear failure log', async () => {
      await handler.executeWithRecovery(
        async () => {
          throw new Error('Error');
        },
        'test-component',
        'default'
      );

      handler.clearLog();

      expect(handler.getTotalFailureCount()).toBe(0);
    });
  });

  describe('createSafeExecutor', () => {
    it('should create safe executor and execute async operations', async () => {
      const executor = handler.createSafeExecutor('test-component', 'async-op');

      const result = await executor.execute(
        async () => {
          return 'async-success';
        },
        'default'
      );

      expect(result.success).toBe(true);
      expect(result.value).toBe('async-success');
    });

    it('should create safe executor and execute sync operations', () => {
      const executor = handler.createSafeExecutor('test-component', 'sync-op');

      const result = executor.executeSync(
        () => {
          return 'sync-success';
        },
        'default'
      );

      expect(result.success).toBe(true);
      expect(result.value).toBe('sync-success');
    });

    it('should handle failures with safe executor', async () => {
      const executor = handler.createSafeExecutor('test-component', 'failing-op');

      const result = await executor.execute(
        async () => {
          throw new Error('Failing');
        },
        'default'
      );

      expect(result.success).toBe(false);
      expect(result.value).toBe('default');
      expect(result.recovered).toBe(true);
    });
  });

  describe('wrap and wrapAsync', () => {
    it('should wrap sync functions', () => {
      const wrapped = handler.wrap(
        (x: number) => x * 2,
        'math-component',
        0
      );

      const result = wrapped(5);

      expect(result.success).toBe(true);
      expect(result.value).toBe(10);
    });

    it('should handle wrapped sync function errors', () => {
      const wrapped = handler.wrap(
        () => {
          throw new Error('Wrapped error');
        },
        'math-component',
        -1 as never
      );

      const result = wrapped();

      expect(result.success).toBe(false);
      expect(result.value).toBe(-1);
      expect(result.error).toBe('Wrapped error');
    });

    it('should wrap async functions', async () => {
      const wrapped = handler.wrapAsync(
        async (x: number) => x + 10,
        'math-component',
        0
      );

      const result = await wrapped(5);

      expect(result.success).toBe(true);
      expect(result.value).toBe(15);
    });

    it('should handle wrapped async function errors', async () => {
      const wrapped = handler.wrapAsync(
        async () => {
          throw new Error('Async wrapped error');
        },
        'math-component',
        -1 as never
      );

      const result = await wrapped();

      expect(result.success).toBe(false);
      expect(result.value).toBe(-1);
      expect(result.error).toBe('Async wrapped error');
    });
  });

  describe('Configuration', () => {
    it('should use default configuration', () => {
      const defaultHandler = new OptimizationFailureHandler();

      const result = defaultHandler.executeWithRecoverySync(
        () => {
          throw new Error('Error');
        },
        'test',
        'default'
      );

      expect(result.value).toBe('default');
    });
  });
});
