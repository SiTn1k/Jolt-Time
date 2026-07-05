/**
 * Middleware Pipeline
 *
 * Handles request/response middleware chain execution.
 * Supports logging, validation, authentication, authorization, and timing middleware.
 *
 * IMPORTANT: Middleware Pipeline is a CROSS-CUTTING layer. It MUST NEVER:
 * - Execute gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 * - Execute any business logic
 */

import type { ApiRequest } from '../entities/ApiRequest';
import type { ApiResponse } from '../entities/ApiResponse';
import type { ILogger } from '../../../shared/types/interfaces';

/**
 * Middleware context passed through the pipeline.
 */
export interface MiddlewareContext {
  request: ApiRequest;
  response?: ApiResponse;
  params: Record<string, string>;
  metadata: Record<string, unknown>;
  startTime: number;
}

/**
 * Middleware result type.
 */
export type MiddlewareResult = {
  success: true;
  context: MiddlewareContext;
} | {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  context: MiddlewareContext;
};

/**
 * Middleware function signature.
 */
export type MiddlewareFunction = (context: MiddlewareContext) => MiddlewareResult | Promise<MiddlewareResult>;

/**
 * Middleware registration.
 */
export interface MiddlewareRegistration {
  name: string;
  middleware: MiddlewareFunction;
  order: number;
}

/**
 * MiddlewarePipeline class.
 * Manages and executes middleware in order.
 */
export class MiddlewarePipeline {
  private readonly _middleware: MiddlewareRegistration[] = [];
  private readonly _logger: ILogger;

  /**
   * Creates a new MiddlewarePipeline.
   */
  constructor(logger?: ILogger) {
    this._logger = logger || this.createDefaultLogger();
  }

  /**
   * Creates a default logger.
   */
  private createDefaultLogger(): ILogger {
    const { createLogger } = require('../../../core/logging/logger.service');
    return createLogger('MiddlewarePipeline');
  }

  /**
   * Registers a middleware.
   */
  public use(name: string, middleware: MiddlewareFunction, order?: number): void {
    const registration: MiddlewareRegistration = {
      name,
      middleware,
      order: order ?? this._middleware.length,
    };

    this._middleware.push(registration);
    this._middleware.sort((a, b) => a.order - b.order);

    this._logger.debug(`Middleware registered: ${name}`, { order: registration.order });
  }

  /**
   * Executes the middleware pipeline.
   */
  public async execute(context: MiddlewareContext): Promise<MiddlewareResult> {
    this._logger.debug('Starting middleware pipeline', {
      middlewareCount: this._middleware.length,
      requestPath: context.request.path,
    });

    let currentContext = context;

    for (const registration of this._middleware) {
      this._logger.debug(`Executing middleware: ${registration.name}`);

      try {
        const result = await registration.middleware(currentContext);

        if (!result.success) {
          this._logger.warn(`Middleware failed: ${registration.name}`, {
            error: result.error,
          });
          return result;
        }

        currentContext = result.context;
      } catch (error) {
        this._logger.error(`Middleware threw exception: ${registration.name}`, error as Error);
        return {
          success: false,
          error: {
            code: 'MIDDLEWARE_ERROR',
            message: `Middleware ${registration.name} failed: ${(error as Error).message}`,
            details: { middleware: registration.name },
          },
          context: currentContext,
        };
      }
    }

    this._logger.debug('Middleware pipeline completed successfully');
    return { success: true, context: currentContext };
  }

  /**
   * Clears all registered middleware.
   */
  public clear(): void {
    this._middleware.length = 0;
    this._logger.debug('Middleware pipeline cleared');
  }

  /**
   * Gets the count of registered middleware.
   */
  public getMiddlewareCount(): number {
    return this._middleware.length;
  }

  /**
   * Gets all registered middleware names.
   */
  public getMiddlewareNames(): string[] {
    return this._middleware.map((m) => m.name);
  }
}

/**
 * Creates a logging middleware.
 */
export function createLoggingMiddleware(logger: ILogger): MiddlewareFunction {
  return async (context: MiddlewareContext): Promise<MiddlewareResult> => {
    const elapsed = Date.now() - context.startTime;

    logger.info('Request received', {
      method: context.request.method,
      path: context.request.path,
      routeId: context.request.routeIdValue,
      elapsedMs: elapsed,
    });

    return { success: true, context };
  };
}

/**
 * Creates a timing middleware.
 */
export function createTimingMiddleware(): MiddlewareFunction {
  return async (context: MiddlewareContext): Promise<MiddlewareResult> => {
    const elapsed = Date.now() - context.startTime;
    context.metadata.elapsedMs = elapsed;
    context.metadata.processedAt = new Date().toISOString();

    return { success: true, context };
  };
}

/**
 * Creates a context injection middleware.
 */
export function createContextInjectionMiddleware(
  injections: Record<string, unknown>
): MiddlewareFunction {
  return async (context: MiddlewareContext): Promise<MiddlewareResult> => {
    for (const [key, value] of Object.entries(injections)) {
      context.metadata[key] = value;
    }

    return { success: true, context };
  };
}
