/**
 * Routing Engine Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { RoutingEngine, RouteMatch, RouteRequest } from '../services/RoutingEngine';
import { ApiRoute } from '../entities/ApiRoute';
import type { HttpMethod } from '../types/HttpMethod';

describe('RoutingEngine', () => {
  let routingEngine: RoutingEngine;

  beforeEach(() => {
    routingEngine = new RoutingEngine();
  });

  describe('registerRoute', () => {
    it('should register a route', () => {
      const route = ApiRoute.create({
        path: '/users',
        method: 'GET',
        version: 'v1',
      });

      routingEngine.registerRoute(route);

      expect(routingEngine.getRouteCount()).toBe(1);
      expect(routingEngine.hasRoute('/users', 'GET', 'v1')).toBe(true);
    });

    it('should register multiple routes', () => {
      const route1 = ApiRoute.create({
        path: '/users',
        method: 'GET',
      });
      const route2 = ApiRoute.create({
        path: '/users',
        method: 'POST',
      });

      routingEngine.registerRoutes([route1, route2]);

      expect(routingEngine.getRouteCount()).toBe(2);
    });

    it('should unregister a route', () => {
      const route = ApiRoute.create({
        path: '/users',
        method: 'GET',
      });

      routingEngine.registerRoute(route);
      routingEngine.unregisterRoute(route);

      expect(routingEngine.getRouteCount()).toBe(0);
    });

    it('should clear all routes', () => {
      routingEngine.registerRoutes([
        ApiRoute.create({ path: '/users', method: 'GET' }),
        ApiRoute.create({ path: '/posts', method: 'GET' }),
      ]);

      routingEngine.clearRoutes();

      expect(routingEngine.getRouteCount()).toBe(0);
    });
  });

  describe('findRoute', () => {
    it('should find an exact route match', () => {
      const route = ApiRoute.create({
        path: '/users',
        method: 'GET',
        version: 'v1',
      });

      routingEngine.registerRoute(route);

      const request: RouteRequest = {
        method: 'GET',
        path: '/users',
        version: 'v1',
      };

      const result = routingEngine.findRoute(request);

      expect(result).not.toBeNull();
      expect(result?.route.path).toBe('/users');
      expect(result?.route.method).toBe('GET');
      expect(result?.params).toEqual({});
    });

    it('should find route without version (defaults to v1)', () => {
      const route = ApiRoute.create({
        path: '/users',
        method: 'GET',
        version: 'v1',
      });

      routingEngine.registerRoute(route);

      const request: RouteRequest = {
        method: 'GET',
        path: '/users',
      };

      const result = routingEngine.findRoute(request);

      expect(result).not.toBeNull();
      expect(result?.route.path).toBe('/users');
    });

    it('should return null for unknown route', () => {
      const route = ApiRoute.create({
        path: '/users',
        method: 'GET',
      });

      routingEngine.registerRoute(route);

      const request: RouteRequest = {
        method: 'GET',
        path: '/unknown',
      };

      const result = routingEngine.findRoute(request);

      expect(result).toBeNull();
    });

    it('should return null for disabled route', () => {
      const route = ApiRoute.create({
        path: '/users',
        method: 'GET',
        enabled: false,
      });

      routingEngine.registerRoute(route);

      const request: RouteRequest = {
        method: 'GET',
        path: '/users',
      };

      const result = routingEngine.findRoute(request);

      expect(result).toBeNull();
    });

    it('should return null for wrong method', () => {
      const route = ApiRoute.create({
        path: '/users',
        method: 'GET',
      });

      routingEngine.registerRoute(route);

      const request: RouteRequest = {
        method: 'POST',
        path: '/users',
      };

      const result = routingEngine.findRoute(request);

      expect(result).toBeNull();
    });
  });

  describe('matchPath', () => {
    it('should match exact paths', () => {
      const result = routingEngine.matchPath('/users', '/users');

      expect(result).toEqual({});
    });

    it('should match paths with parameters', () => {
      const result = routingEngine.matchPath('/users/:id', '/users/123');

      expect(result).toEqual({ id: '123' });
    });

    it('should match multiple path parameters', () => {
      const result = routingEngine.matchPath('/users/:userId/posts/:postId', '/users/123/posts/456');

      expect(result).toEqual({ userId: '123', postId: '456' });
    });

    it('should return null for non-matching paths', () => {
      const result = routingEngine.matchPath('/users', '/posts');

      expect(result).toBeNull();
    });

    it('should return null for paths with different segment counts', () => {
      const result = routingEngine.matchPath('/users/:id', '/users/123/comments');

      expect(result).toBeNull();
    });

    it('should handle paths with trailing slashes', () => {
      const result = routingEngine.matchPath('/users/', '/users');

      expect(result).not.toBeNull();
    });

    it('should handle extra slashes in paths', () => {
      const result = routingEngine.matchPath('//users', '/users');

      expect(result).not.toBeNull();
    });
  });

  describe('getRegisteredRoutes', () => {
    it('should return all registered routes', () => {
      const route1 = ApiRoute.create({ path: '/users', method: 'GET' });
      const route2 = ApiRoute.create({ path: '/posts', method: 'GET' });

      routingEngine.registerRoutes([route1, route2]);

      const routes = routingEngine.getRegisteredRoutes();

      expect(routes).toHaveLength(2);
      expect(routes).toContain(route1);
      expect(routes).toContain(route2);
    });
  });
});
