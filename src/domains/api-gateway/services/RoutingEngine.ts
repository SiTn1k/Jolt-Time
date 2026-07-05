/**
 * Routing Engine
 *
 * Handles route matching and resolution for the API Gateway.
 * Supports HTTP methods, version matching, and path parameters.
 *
 * IMPORTANT: Routing Engine is a ROUTING ONLY layer. It MUST NEVER:
 * - Execute gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 * - Execute any business logic
 */

import type { ApiRoute } from '../entities/ApiRoute';
import type { HttpMethod } from '../types/HttpMethod';
import type { ApiVersion } from '../types/ApiVersion';

/**
 * Route match result.
 */
export interface RouteMatch {
  route: ApiRoute;
  params: Record<string, string>;
}

/**
 * Incoming request for routing.
 */
export interface RouteRequest {
  method: HttpMethod;
  path: string;
  version?: ApiVersion;
}

/**
 * RoutingEngine class.
 * Handles route matching and path parameter extraction.
 */
export class RoutingEngine {
  private readonly _routeCache = new Map<string, ApiRoute>();

  /**
   * Registers a route for matching.
   */
  public registerRoute(route: ApiRoute): void {
    const key = this.buildRouteKey(route.path, route.method, route.version);
    this._routeCache.set(key, route);
  }

  /**
   * Registers multiple routes at once.
   */
  public registerRoutes(routes: ApiRoute[]): void {
    for (const route of routes) {
      this.registerRoute(route);
    }
  }

  /**
   * Removes a route from the registry.
   */
  public unregisterRoute(route: ApiRoute): void {
    const key = this.buildRouteKey(route.path, route.method, route.version);
    this._routeCache.delete(key);
  }

  /**
   * Clears all registered routes.
   */
  public clearRoutes(): void {
    this._routeCache.clear();
  }

  /**
   * Finds a route matching the given request.
   */
  public findRoute(request: RouteRequest): RouteMatch | null {
    // First try exact match with version
    const exactKey = this.buildRouteKey(request.path, request.method, request.version);
    const exactRoute = this._routeCache.get(exactKey);
    if (exactRoute && exactRoute.enabled) {
      return { route: exactRoute, params: {} };
    }

    // Try without version (default to v1)
    const versionedKey = this.buildRouteKey(request.path, request.method, 'v1');
    const versionedRoute = this._routeCache.get(versionedKey);
    if (versionedRoute && versionedRoute.enabled) {
      return { route: versionedRoute, params: {} };
    }

    // Try pattern matching for path parameters
    for (const [, route] of this._routeCache) {
      if (!route.enabled) continue;
      if (route.method !== request.method) continue;
      if (request.version && route.version !== request.version) continue;

      const match = this.matchPath(route.path, request.path);
      if (match) {
        return { route, params: match };
      }
    }

    return null;
  }

  /**
   * Matches a route path pattern against an actual path.
   * Returns path parameters if matched, null otherwise.
   */
  public matchPath(pattern: string, path: string): Record<string, string> | null {
    // Normalize paths
    const normalizedPattern = this.normalizePath(pattern);
    const normalizedPath = this.normalizePath(path);

    // Split into segments
    const patternSegments = normalizedPattern.split('/').filter(Boolean);
    const pathSegments = normalizedPath.split('/').filter(Boolean);

    // Must have same number of segments
    if (patternSegments.length !== pathSegments.length) {
      return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      const pathSegment = pathSegments[i];

      // Check if pattern segment is a parameter
      if (patternSegment.startsWith(':')) {
        params[patternSegment.slice(1)] = pathSegment;
      } else if (patternSegment !== pathSegment) {
        // Segments must match exactly
        return null;
      }
    }

    return params;
  }

  /**
   * Builds a cache key for a route.
   */
  private buildRouteKey(path: string, method: HttpMethod, version?: ApiVersion): string {
    const versionPart = version || 'v1';
    return `${method}:${versionPart}:${path}`;
  }

  /**
   * Normalizes a path for comparison.
   */
  private normalizePath(path: string): string {
    return path.replace(/\/+/g, '/').replace(/\/$/, '');
  }

  /**
   * Gets all registered routes.
   */
  public getRegisteredRoutes(): ApiRoute[] {
    return Array.from(this._routeCache.values());
  }

  /**
   * Gets the count of registered routes.
   */
  public getRouteCount(): number {
    return this._routeCache.size;
  }

  /**
   * Checks if a route is registered.
   */
  public hasRoute(path: string, method: HttpMethod, version?: ApiVersion): boolean {
    const key = this.buildRouteKey(path, method, version);
    return this._routeCache.has(key);
  }
}
