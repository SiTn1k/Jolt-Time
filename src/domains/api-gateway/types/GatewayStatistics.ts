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
   * Number of client errors (4xx).
   */
  clientErrors: number;

  /**
   * Number of server errors (5xx).
   */
  serverErrors: number;

  /**
   * Average response time in milliseconds.
   */
  averageResponseTime: number;

  /**
   * Minimum response time in milliseconds.
   */
  minResponseTime: number;

  /**
   * Maximum response time in milliseconds.
   */
  maxResponseTime: number;

  /**
   * Requests per minute.
   */
  requestsPerMinute: number;

  /**
   * Bytes transferred.
   */
  bytesTransferred: number;

  /**
   * Timestamp of last update.
   */
  updatedAt: Date;
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
    clientErrors: 0,
    serverErrors: 0,
    averageResponseTime: 0,
    minResponseTime: 0,
    maxResponseTime: 0,
    requestsPerMinute: 0,
    bytesTransferred: 0,
    updatedAt: new Date(),
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
