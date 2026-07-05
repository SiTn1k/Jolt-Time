/**
 * API Gateway Service Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiGatewayService, type IncomingHttpRequest } from '../services/ApiGatewayService';
import type { IApiGatewayRepository } from '../interfaces/IApiGatewayRepository';
import type { ILogger } from '../../../shared/types/interfaces';
import type { ApiRoute } from '../entities/ApiRoute';
import type { ApiResponse } from '../entities/ApiResponse';

describe('ApiGatewayService', () => {
  let apiGatewayService: ApiGatewayService;
  let mockRepository: IApiGatewayRepository;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
    };

    mockRepository = {
      createRoute: vi.fn(),
      findRouteById: vi.fn(),
      findRouteByPathAndMethod: vi.fn(),
      listRoutes: vi.fn(),
      countRoutes: vi.fn(),
      updateRoute: vi.fn(),
      deleteRoute: vi.fn(),
      createRequest: vi.fn(),
      findRequestById: vi.fn(),
      listRequests: vi.fn(),
      countRequests: vi.fn(),
      createResponse: vi.fn(),
      findResponseById: vi.fn(),
      findResponsesByRequestId: vi.fn(),
      listResponses: vi.fn(),
      countResponses: vi.fn(),
    } as unknown as IApiGatewayRepository;

    apiGatewayService = new ApiGatewayService(mockRepository, mockLogger);
  });

  describe('receiveRequest', () => {
    it('should receive a valid request and return success response', async () => {
      const mockRoute = {
        routeId: { value: 'route-123' },
        path: '/users',
        method: 'GET' as const,
        version: 'v1' as const,
        enabled: true,
        description: '',
        metadata: { description: '', tags: [], customFields: {} },
        fullPath: '/api/v1/users',
        status: 'active' as const,
      };

      mockRepository.listRoutes = vi.fn().mockResolvedValue({
        items: [mockRoute],
        total: 1,
        page: 1,
        pageSize: 1000,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
      mockRepository.createRequest = vi.fn().mockResolvedValue({});
      mockRepository.createResponse = vi.fn().mockResolvedValue({});

      // Load routes into the routing engine
      await apiGatewayService.loadRoutesIntoEngine();

      const request: IncomingHttpRequest = {
        method: 'GET',
        path: '/users',
        headers: {},
        query: {},
      };

      const response = await apiGatewayService.receiveRequest(request);

      expect(response.statusCode).toBe(200);
      expect(response.payload).toHaveProperty('success', true);
      expect(mockRepository.createRequest).toHaveBeenCalled();
      expect(mockRepository.createResponse).toHaveBeenCalled();
    });

    it('should return 404 for unknown route', async () => {
      mockRepository.findRouteByPathAndMethod = vi.fn().mockResolvedValue(null);

      const request: IncomingHttpRequest = {
        method: 'GET',
        path: '/unknown',
        headers: {},
        query: {},
      };

      const response = await apiGatewayService.receiveRequest(request);

      expect(response.statusCode).toBe(404);
      expect(response.payload).toHaveProperty('success', false);
      expect((response.payload as any).error.code).toBe('ROUTE_NOT_FOUND');
    });

    it('should handle repository errors gracefully', async () => {
      mockRepository.findRouteByPathAndMethod = vi.fn().mockRejectedValue(new Error('DB Error'));

      const request: IncomingHttpRequest = {
        method: 'GET',
        path: '/users',
        headers: {},
        query: {},
      };

      const response = await apiGatewayService.receiveRequest(request);

      expect(response.statusCode).toBeGreaterThanOrEqual(400);
      expect(response.payload).toHaveProperty('success', false);
    });
  });

  describe('registerRoute', () => {
    it('should register a new route', async () => {
      const mockRoute = {
        routeId: { value: 'route-123' },
        path: '/users',
        method: 'GET' as const,
        version: 'v1' as const,
        enabled: true,
        description: '',
        metadata: { description: '', tags: [], customFields: {} },
        toRecord: () => ({
          route_id: 'route-123',
          path: '/users',
          method: 'GET',
          version: 'v1',
          enabled: true,
          description: '',
          metadata: { description: '', tags: [], customFields: {} },
        }),
      };

      mockRepository.createRoute = vi.fn().mockResolvedValue(mockRoute);

      const { ApiRoute } = await import('../entities/ApiRoute');
      const route = ApiRoute.create({
        path: '/users',
        method: 'GET',
      });

      const result = await apiGatewayService.registerRoute(route);

      expect(mockRepository.createRoute).toHaveBeenCalledWith(route);
      expect(result).toBe(mockRoute);
    });
  });

  describe('listRoutes', () => {
    it('should list routes with pagination', async () => {
      const mockResult = {
        items: [],
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      mockRepository.listRoutes = vi.fn().mockResolvedValue(mockResult);

      const result = await apiGatewayService.listRoutes({ page: 1, pageSize: 20 });

      expect(result).toEqual(mockResult);
      expect(mockRepository.listRoutes).toHaveBeenCalled();
    });
  });

  describe('getStatistics', () => {
    it('should return gateway statistics', () => {
      const stats = apiGatewayService.getStatistics();

      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('successfulRequests');
      expect(stats).toHaveProperty('failedRequests');
      expect(stats).toHaveProperty('averageResponseTime');
      expect(stats).toHaveProperty('uptime');
    });
  });

  describe('resetStatistics', () => {
    it('should reset gateway statistics', () => {
      apiGatewayService.resetStatistics();

      const stats = apiGatewayService.getStatistics();

      expect(stats.totalRequests).toBe(0);
      expect(stats.successfulRequests).toBe(0);
      expect(stats.failedRequests).toBe(0);
    });
  });

  describe('addMiddleware', () => {
    it('should add middleware to the pipeline', () => {
      const middleware = vi.fn();

      apiGatewayService.addMiddleware('custom-middleware', middleware);

      const pipeline = apiGatewayService.getMiddlewarePipeline();
      expect(pipeline.getMiddlewareNames()).toContain('custom-middleware');
    });
  });

  describe('getRoutingEngine', () => {
    it('should return the routing engine', () => {
      const engine = apiGatewayService.getRoutingEngine();

      expect(engine).toBeDefined();
      expect(engine.getRouteCount()).toBe(0);
    });
  });

  describe('loadRoutesIntoEngine', () => {
    it('should load routes from repository into engine', async () => {
      const mockRoutes = [
        {
          routeId: { value: 'route-1' },
          path: '/users',
          method: 'GET' as const,
          version: 'v1' as const,
          enabled: true,
        },
        {
          routeId: { value: 'route-2' },
          path: '/posts',
          method: 'GET' as const,
          version: 'v1' as const,
          enabled: true,
        },
      ];

      mockRepository.listRoutes = vi.fn().mockResolvedValue({
        items: mockRoutes,
        total: 2,
        page: 1,
        pageSize: 1000,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const count = await apiGatewayService.loadRoutesIntoEngine();

      expect(count).toBe(2);
      expect(apiGatewayService.getRoutingEngine().getRouteCount()).toBe(2);
    });
  });
});
