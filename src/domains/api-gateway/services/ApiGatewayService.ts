/**
 * API Gateway Service
 *
 * Main service for handling API Gateway operations.
 * Coordinates routing, middleware, validation, and response building.
 *
 * IMPORTANT: API Gateway Service is a GATEWAY COORDINATION layer. It MUST NEVER:
 * - Execute gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 * - Execute any business logic
 */

import type { ApiRoute } from '../entities/ApiRoute';
import type { ApiRequest } from '../entities/ApiRequest';
import type { ApiResponse } from '../entities/ApiResponse';
import type { IApiGatewayRepository } from '../interfaces/IApiGatewayRepository';
import type { ILogger } from '../../../shared/types/interfaces';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { GatewayStatistics } from '../types/GatewayStatistics';
import type { RequestMetadata } from '../types/GatewayMetadata';
import type { HttpMethod } from '../types/HttpMethod';
import type { ApiVersion } from '../types/ApiVersion';

import { RoutingEngine, type RouteMatch, type RouteRequest } from './RoutingEngine';
import { MiddlewarePipeline, createLoggingMiddleware, createTimingMiddleware } from './MiddlewarePipeline';
import { RequestValidatorService } from './RequestValidatorService';
import { ResponseBuilder, HttpStatusCodes } from './ResponseBuilder';
import { FailureHandler } from './FailureHandler';
import { ApiRequest as ApiRequestEntity } from '../entities/ApiRequest';
import { ApiResponse as ApiResponseEntity } from '../entities/ApiResponse';
import { RouteId } from '../value-objects/RouteId';
import { RequestId } from '../value-objects/RequestId';
import { ResponseId } from '../value-objects/ResponseId';
import { RepositoryError } from '../../../database/errors/repository.error';

/**
 * Incoming HTTP request format.
 */
export interface IncomingHttpRequest {
  method: HttpMethod;
  path: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body?: unknown;
  metadata?: Partial<RequestMetadata>;
}

/**
 * API Gateway service configuration.
 */
export interface ApiGatewayServiceConfig {
  enableRequestLogging?: boolean;
  enableTiming?: boolean;
  enableValidation?: boolean;
  enableMiddleware?: boolean;
}

/**
 * ApiGatewayService class.
 * Main service coordinating all API Gateway operations.
 */
export class ApiGatewayService {
  private readonly _repository: IApiGatewayRepository;
  private readonly _routingEngine: RoutingEngine;
  private readonly _middlewarePipeline: MiddlewarePipeline;
  private readonly _requestValidator: RequestValidatorService;
  private readonly _responseBuilder: ResponseBuilder;
  private readonly _failureHandler: FailureHandler;
  private readonly _logger: ILogger;
  private readonly _config: Required<ApiGatewayServiceConfig>;

  private _startTime: number;
  private _requestCount = 0;
  private _successCount = 0;
  private _failureCount = 0;
  private _totalResponseTime = 0;
  private readonly _responseTimes: number[] = [];

  /**
   * Creates a new ApiGatewayService.
   */
  constructor(
    repository: IApiGatewayRepository,
    logger?: ILogger,
    config?: ApiGatewayServiceConfig
  ) {
    this._repository = repository;
    this._routingEngine = new RoutingEngine();
    this._middlewarePipeline = new MiddlewarePipeline(logger);
    this._requestValidator = new RequestValidatorService(logger);
    this._responseBuilder = new ResponseBuilder();
    this._failureHandler = new FailureHandler(logger);
    this._logger = logger || this.createDefaultLogger();
    this._config = {
      enableRequestLogging: config?.enableRequestLogging ?? true,
      enableTiming: config?.enableTiming ?? true,
      enableValidation: config?.enableValidation ?? true,
      enableMiddleware: config?.enableMiddleware ?? true,
    };
    this._startTime = Date.now();

    this.setupDefaultMiddleware();
  }

  /**
   * Creates a default logger.
   */
  private createDefaultLogger(): ILogger {
    const { createLogger } = require('../../../core/logging/logger.service');
    return createLogger('ApiGatewayService');
  }

  /**
   * Sets up default middleware.
   */
  private setupDefaultMiddleware(): void {
    if (this._config.enableRequestLogging) {
      this._middlewarePipeline.use('logging', createLoggingMiddleware(this._logger), 1);
    }

    if (this._config.enableTiming) {
      this._middlewarePipeline.use('timing', createTimingMiddleware(), 100);
    }
  }

  // ============ Route Management ============

  /**
   * Registers a route with the gateway.
   */
  public async registerRoute(route: ApiRoute): Promise<ApiRoute> {
    this._logger.debug('Registering route', { path: route.path, method: route.method });

    const createdRoute = await this._repository.createRoute(route);
    this._routingEngine.registerRoute(createdRoute);

    this._logger.info('Route registered successfully', {
      routeId: createdRoute.routeId.value,
      path: createdRoute.path,
    });

    return createdRoute;
  }

  /**
   * Resolves a route for the given request.
   */
  public async resolveRoute(request: IncomingHttpRequest): Promise<RouteMatch | null> {
    const routeRequest: RouteRequest = {
      method: request.method,
      path: request.path,
    };

    return this._routingEngine.findRoute(routeRequest);
  }

  /**
   * Lists all registered routes.
   */
  public async listRoutes(
    params: PaginationParams,
    filters?: Parameters<typeof this._repository.listRoutes>[1]
  ): Promise<PaginatedResult<ApiRoute>> {
    return this._repository.listRoutes(params, filters);
  }

  /**
   * Counts registered routes.
   */
  public async countRoutes(
    filters?: Parameters<typeof this._repository.countRoutes>[0]
  ): Promise<number> {
    return this._repository.countRoutes(filters);
  }

  /**
   * Updates a route.
   */
  public async updateRoute(route: ApiRoute): Promise<ApiRoute> {
    const updatedRoute = await this._repository.updateRoute(route);

    // Refresh routing engine cache
    this._routingEngine.unregisterRoute(route);
    this._routingEngine.registerRoute(updatedRoute);

    return updatedRoute;
  }

  /**
   * Disables a route.
   */
  public async disableRoute(routeId: RouteId): Promise<ApiRoute | null> {
    const route = await this._repository.findRouteById(routeId);
    if (!route) {
      return null;
    }

    const disabledRoute = route.disable();
    return this.updateRoute(disabledRoute);
  }

  /**
   * Loads all active routes into the routing engine.
   */
  public async loadRoutesIntoEngine(): Promise<number> {
    this._routingEngine.clearRoutes();

    const result = await this._repository.listRoutes(
      { page: 1, pageSize: 1000 },
      { enabled: true }
    );

    this._routingEngine.registerRoutes(result.items);

    this._logger.info('Routes loaded into engine', { count: result.items.length });

    return result.items.length;
  }

  // ============ Request Handling ============

  /**
   * Receives an incoming HTTP request.
   */
  public async receiveRequest(request: IncomingHttpRequest): Promise<ApiResponse> {
    const startTime = Date.now();
    const requestId = RequestId.generate();
    const responseTimeStart = startTime;

    this._requestCount++;

    try {
      // Resolve route
      const routeMatch = await this.resolveRoute(request);

      if (!routeMatch) {
        const apiRequest = this.createApiRequest(request, requestId, null);
        const failureContext = {
          request: apiRequest,
          requestId: requestId.value,
          responseTime: Date.now() - responseTimeStart,
        };
        return this._failureHandler.handleUnknownRoute(failureContext);
      }

      // Create API request entity
      const apiRequest = this.createApiRequest(request, requestId, routeMatch.route.routeId);

      // Run middleware pipeline
      if (this._config.enableMiddleware) {
        const middlewareContext = {
          request: apiRequest,
          params: routeMatch.params,
          metadata: {},
          startTime,
        };

        const middlewareResult = await this._middlewarePipeline.execute(middlewareContext);

        if (!middlewareResult.success) {
          const failureContext = {
            request: apiRequest,
            requestId: requestId.value,
            responseTime: Date.now() - responseTimeStart,
          };
          return this._failureHandler.handleValidationError(
            failureContext,
            middlewareResult.context.metadata.validationErrors as Array<{
              field: string;
              code: string;
              message: string;
            }>
          );
        }
      }

      // Validate request
      if (this._config.enableValidation) {
        const validationResult = this._requestValidator.validate(apiRequest);

        if (!validationResult.isValid) {
          const failureContext = {
            request: apiRequest,
            requestId: requestId.value,
            responseTime: Date.now() - responseTimeStart,
          };

          return this._failureHandler.handleValidationError(
            failureContext,
            validationResult.errors.map((e) => ({
              field: e.field,
              code: e.code,
              message: e.message,
            }))
          );
        }
      }

      // Record request in repository
      try {
        await this._repository.createRequest(apiRequest);
      } catch (error) {
        this._logger.warn('Failed to record request', { error });
        // Continue processing - recording failure is not fatal
      }

      // Build success response
      const responseTime = Date.now() - responseTimeStart;
      const response = ApiResponseEntity.create({
        requestId: requestId.value,
        statusCode: HttpStatusCodes.OK,
        responseTime,
        payload: this._responseBuilder.success({
          message: 'Request received',
          routeId: routeMatch.route.routeId.value,
          path: routeMatch.route.path,
          method: routeMatch.route.method,
          version: routeMatch.route.version,
        }),
        metadata: {
          contentType: 'application/json', customFields: {},
        },
      });

      // Record response in repository
      try {
        await this._repository.createResponse(response);
      } catch (error) {
        this._logger.warn('Failed to record response', { error });
        // Continue processing - recording failure is not fatal
      }

      this._successCount++;
      this._totalResponseTime += responseTime;
      this._responseTimes.push(responseTime);

      return response;
    } catch (error) {
      const responseTime = Date.now() - responseTimeStart;

      this._failureCount++;

      const apiRequest = this.createApiRequest(request, requestId, null);
      const failureContext = {
        request: apiRequest,
        requestId: requestId.value,
        responseTime,
      };

      if (error instanceof RepositoryError) {
        return this._failureHandler.handleRepositoryError(failureContext, error);
      }

      return this._failureHandler.handleInternalError(failureContext, error as Error);
    }
  }

  /**
   * Creates an ApiRequest entity from an incoming request.
   */
  private createApiRequest(
    request: IncomingHttpRequest,
    requestId: RequestId,
    routeId: RouteId | null
  ): ApiRequest {
    return ApiRequestEntity.create({
      requestId,
      routeId: routeId?.value ?? 'unknown',
      method: request.method,
      path: request.path,
      headers: request.headers,
      query: request.query,
      body: request.body,
      receivedAt: new Date(),
      metadata: {
        clientIp: request.metadata?.clientIp,
        userAgent: request.metadata?.userAgent,
        source: request.metadata?.source,
        sessionId: request.metadata?.sessionId,
        forwardedFor: request.metadata?.forwardedFor,
        customFields: request.metadata?.customFields ?? {},
      },
    });
  }

  // ============ Response Handling ============

  /**
   * Sends a response to the client.
   */
  public async sendResponse(response: ApiResponse): Promise<void> {
    this._logger.debug('Sending response', {
      statusCode: response.statusCode,
      responseTime: response.responseTime,
    });

    try {
      await this._repository.createResponse(response);
    } catch (error) {
      this._logger.warn('Failed to record response', { error });
    }
  }

  /**
   * Builds a gateway summary response.
   */
  public getGatewaySummary(): GatewayStatisticsDto {
    return {
      status: this._failureCount > this._requestCount * 0.5 ? 'degraded' : 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: Date.now() - this._startTime,
      checks: {
        database: true,
        cache: true,
        external: true,
      },
      statistics: this.getStatistics(),
    };
  }

  /**
   * Builds a request summary.
   */
  public getRequestSummary(): RequestSummary {
    return {
      totalRequests: this._requestCount,
      successfulRequests: this._successCount,
      failedRequests: this._failureCount,
      averageResponseTime: this._responseTimes.length > 0
        ? this._responseTimes.reduce((a, b) => a + b, 0) / this._responseTimes.length
        : 0,
    };
  }

  /**
   * Gets gateway statistics.
   */
  public getStatistics(): GatewayStatistics {
    return {
      totalRequests: this._requestCount,
      successfulRequests: this._successCount,
      failedRequests: this._failureCount,
      averageResponseTime: this._responseTimes.length > 0
        ? this._responseTimes.reduce((a, b) => a + b, 0) / this._responseTimes.length
        : 0,
      requestsByMethod: {},
      requestsByVersion: {},
      uptime: Date.now() - this._startTime,
    };
  }

  // ============ Configuration ============

  /**
   * Adds middleware to the pipeline.
   */
  public addMiddleware(
    name: string,
    middleware: Parameters<MiddlewarePipeline['use']>[1],
    order?: number
  ): void {
    this._middlewarePipeline.use(name, middleware, order);
  }

  /**
   * Gets the routing engine.
   */
  public getRoutingEngine(): RoutingEngine {
    return this._routingEngine;
  }

  /**
   * Gets the middleware pipeline.
   */
  public getMiddlewarePipeline(): MiddlewarePipeline {
    return this._middlewarePipeline;
  }

  /**
   * Gets the request validator.
   */
  public getRequestValidator(): RequestValidatorService {
    return this._requestValidator;
  }

  /**
   * Gets the response builder.
   */
  public getResponseBuilder(): ResponseBuilder {
    return this._responseBuilder;
  }

  /**
   * Gets the failure handler.
   */
  public getFailureHandler(): FailureHandler {
    return this._failureHandler;
  }

  /**
   * Resets gateway statistics.
   */
  public resetStatistics(): void {
    this._requestCount = 0;
    this._successCount = 0;
    this._failureCount = 0;
    this._totalResponseTime = 0;
    this._responseTimes.length = 0;
    this._startTime = Date.now();
  }
}

/**
 * Gateway health and summary DTO.
 */
export interface GatewaySummaryDto {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: boolean;
    cache: boolean;
    external: boolean;
  };
  statistics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
  };
}

/**
 * Request summary DTO.
 */
export interface RequestSummary {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
}

/**
 * Gateway statistics DTO.
 */
export interface GatewayStatisticsDto {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: boolean;
    cache: boolean;
    external: boolean;
  };
  statistics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
  };
}
