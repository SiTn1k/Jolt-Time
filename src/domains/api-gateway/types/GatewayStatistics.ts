/**
 * Gateway Statistics Types
 *
 * Statistics and metrics structures for API Gateway.
 */

/**
 * Gateway statistics structure.
 */
export interface GatewayStatistics {
  /**
   * Total number of requests.
   */
  totalRequests: number;

  /**
   * Number of successful requests (2xx).
   */
  successfulRequests: number;

  /**
   * Number of failed requests.
   */
  failedRequests: number;

  /**
   * Average response time in milliseconds.
   */
  averageResponseTime: number;

  /**
   * Requests by HTTP method.
   */
  requestsByMethod: Record<string, number>;

  /**
   * Requests by API version.
   */
  requestsByVersion: Record<string, number>;

  /**
   * Gateway uptime in milliseconds.
   */
  uptime: number;
}

/**
 * Statistics for a specific route.
 */
export interface RouteStatistics {
  /**
   * Route identifier.
   */
  routeId: string;

  /**
   * Route path.
   */
  path: string;

  /**
   * HTTP method.
   */
  method: string;

  /**
   * Total requests to this route.
   */
  totalRequests: number;

  /**
   * Successful requests.
   */
  successfulRequests: number;

  /**
   * Client errors.
   */
  clientErrors: number;

  /**
   * Server errors.
   */
  serverErrors: number;

  /**
   * Average response time.
   */
  averageResponseTime: number;

  /**
   * Last request timestamp.
   */
  lastRequestAt: Date | null;
}

/**
 * Empty gateway statistics.
 */
export function createEmptyGatewayStatistics(): GatewayStatistics {
  return {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    requestsByMethod: {},
    requestsByVersion: {},
    uptime: 0,
  };
}

/**
 * Empty route statistics.
 */
export function createEmptyRouteStatistics(routeId: string, path: string, method: string): RouteStatistics {
  return {
    routeId,
    path,
    method,
    totalRequests: 0,
    successfulRequests: 0,
    clientErrors: 0,
    serverErrors: 0,
    averageResponseTime: 0,
    lastRequestAt: null,
  };
}
