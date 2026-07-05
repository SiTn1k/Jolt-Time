/**
 * Middleware Pipeline Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  MiddlewarePipeline,
  createLoggingMiddleware,
  createTimingMiddleware,
  createContextInjectionMiddleware,
  type MiddlewareContext,
  type MiddlewareFunction,
} from '../services/MiddlewarePipeline';
import { ApiRequest } from '../entities/ApiRequest';
import type { ILogger } from '../../../shared/types/interfaces';

describe('MiddlewarePipeline', () => {
  let middlewarePipeline: MiddlewarePipeline;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
    };
    middlewarePipeline = new MiddlewarePipeline(mockLogger);
  });

  const createMockContext = (): MiddlewareContext => ({
    request: ApiRequest.create({
      routeId: 'test-route',
      method: 'GET',
      path: '/test',
    }),
    params: {},
    metadata: {},
    startTime: Date.now(),
  });

  describe('use', () => {
    it('should register a middleware', () => {
      const middleware = vi.fn(async (ctx: MiddlewareContext) => ({ success: true, context: ctx })) as unknown as MiddlewareFunction;

      middlewarePipeline.use('test-middleware', middleware);

      expect(middlewarePipeline.getMiddlewareCount()).toBe(1);
      expect(middlewarePipeline.getMiddlewareNames()).toContain('test-middleware');
    });

    it('should execute middleware in order', async () => {
      const executionOrder: string[] = [];

      middlewarePipeline.use(
        'first',
        async (ctx: MiddlewareContext) => {
          executionOrder.push('first');
          return { success: true, context: ctx };
        },
        1
      );

      middlewarePipeline.use(
        'second',
        async (ctx: MiddlewareContext) => {
          executionOrder.push('second');
          return { success: true, context: ctx };
        },
        2
      );

      await middlewarePipeline.execute(createMockContext());

      expect(executionOrder).toEqual(['first', 'second']);
    });

    it('should stop execution on middleware failure', async () => {
      const middleware1 = vi.fn(async (ctx: MiddlewareContext) => ({ success: true, context: ctx })) as unknown as MiddlewareFunction;
      const middleware2 = vi.fn(async (_ctx: MiddlewareContext) => ({
        success: false,
        error: { code: 'TEST_ERROR', message: 'Test error' },
        context: _ctx,
      })) as unknown as MiddlewareFunction;
      const middleware3 = vi.fn(async (ctx: MiddlewareContext) => ({ success: true, context: ctx })) as unknown as MiddlewareFunction;

      middlewarePipeline.use('first', middleware1, 1);
      middlewarePipeline.use('second', middleware2, 2);
      middlewarePipeline.use('third', middleware3, 3);

      const result = await middlewarePipeline.execute(createMockContext());

      expect(result.success).toBe(false);
      expect((result as { error: { code: string } }).error.code).toBe('TEST_ERROR');
      expect(middleware1).toHaveBeenCalled();
      expect(middleware2).toHaveBeenCalled();
      expect(middleware3).not.toHaveBeenCalled();
    });
  });

  describe('execute', () => {
    it('should successfully execute pipeline', async () => {
      const middleware = vi.fn(async (ctx: MiddlewareContext) => ({ success: true, context: ctx })) as unknown as MiddlewareFunction;

      middlewarePipeline.use('test', middleware);

      const result = await middlewarePipeline.execute(createMockContext());

      expect(result.success).toBe(true);
      expect(middleware).toHaveBeenCalled();
    });

    it('should handle middleware throwing exception', async () => {
      const error = new Error('Middleware error');
      const middleware = vi.fn(async () => {
        throw error;
      }) as unknown as MiddlewareFunction;

      middlewarePipeline.use('test', middleware);

      const result = await middlewarePipeline.execute(createMockContext());

      expect(result.success).toBe(false);
      expect((result as { error: { code: string } }).error.code).toBe('MIDDLEWARE_ERROR');
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle empty pipeline', async () => {
      const result = await middlewarePipeline.execute(createMockContext());

      expect(result.success).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all middleware', () => {
      middlewarePipeline.use('test1', async (ctx) => ({ success: true, context: ctx }));
      middlewarePipeline.use('test2', async (ctx) => ({ success: true, context: ctx }));

      middlewarePipeline.clear();

      expect(middlewarePipeline.getMiddlewareCount()).toBe(0);
    });
  });

  describe('createLoggingMiddleware', () => {
    it('should create logging middleware that logs request', async () => {
      const middleware = createLoggingMiddleware(mockLogger);
      const context = createMockContext();

      await middleware(context);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Request received',
        expect.objectContaining({
          method: 'GET',
          path: '/test',
        })
      );
    });
  });

  describe('createTimingMiddleware', () => {
    it('should add elapsed time to metadata', async () => {
      const middleware = createTimingMiddleware();
      const context = createMockContext();

      // Small delay to ensure elapsed time is measurable
      await new Promise((resolve) => setTimeout(resolve, 10));

      const result = await middleware(context);

      expect(result.success).toBe(true);
      expect(result.context.metadata.elapsedMs).toBeGreaterThan(0);
      expect(result.context.metadata.processedAt).toBeDefined();
    });
  });

  describe('createContextInjectionMiddleware', () => {
    it('should inject custom values into context metadata', async () => {
      const middleware = createContextInjectionMiddleware({
        customField: 'customValue',
        anotherField: 123,
      });
      const context = createMockContext();

      const result = await middleware(context);

      expect(result.success).toBe(true);
      expect(result.context.metadata.customField).toBe('customValue');
      expect(result.context.metadata.anotherField).toBe(123);
    });
  });
});
