/**
 * IntegrationStatistics
 *
 * Statistics and metrics for integration entities.
 */

/**
 * Overall integration statistics summary.
 */
export interface IntegrationStatistics {
  /** Total number of providers */
  totalProviders: number;
  
  /** Number of active providers */
  activeProviders: number;
  
  /** Total number of requests */
  totalRequests: number;
  
  /** Total number of responses */
  totalResponses: number;
  
  /** Number of failed requests */
  failedRequests: number;
  
  /** Success rate (0-1) */
  successRate: number;
  
  /** Average response time in milliseconds */
  averageResponseTimeMs: number;
  
  /** Last updated timestamp */
  lastUpdatedAt: Date;
}

/**
 * Statistics for an integration provider.
 */
export interface IntegrationProviderStatistics {
  /** Total number of requests sent through this provider */
  totalRequests: number;

  /** Number of successful requests */
  successfulRequests: number;

  /** Number of failed requests */
  failedRequests: number;

  /** Number of timed out requests */
  timeoutRequests: number;

  /** Average response time in milliseconds */
  averageResponseTimeMs: number;

  /** Minimum response time in milliseconds */
  minResponseTimeMs: number;

  /** Maximum response time in milliseconds */
  maxResponseTimeMs: number;

  /** Success rate (0-1) */
  successRate: number;

  /** Average uptime percentage */
  uptimePercentage: number;

  /** Last successful request timestamp */
  lastSuccessfulRequestAt?: Date;

  /** Last failed request timestamp */
  lastFailedRequestAt?: Date;

  /** Last request timestamp */
  lastRequestAt?: Date;

  /** Daily request counts */
  dailyRequestCounts?: Record<string, number>;

  /** Monthly request counts */
  monthlyRequestCounts?: Record<string, number>;

  /** Hourly failure rates (0-1) */
  hourlyFailureRates?: Record<string, number>;

  /** Error type breakdown */
  errorBreakdown?: Record<string, number>;
}

/**
 * Statistics for integration requests.
 */
export interface IntegrationRequestStatistics {
  /** Total request count */
  totalCount: number;

  /** Requests by status */
  byStatus: Record<string, number>;

  /** Requests by provider */
  byProvider: Record<string, number>;

  /** Average payload size */
  averagePayloadSize: number;

  /** Peak request time */
  peakRequestTime?: Date;

  /** Peak request count (requests per minute) */
  peakRequestsPerMinute: number;
}

/**
 * Statistics for integration responses.
 */
export interface IntegrationResponseStatistics {
  /** Total response count */
  totalCount: number;

  /** Responses by status code range */
  byStatusCodeRange: Record<string, number>;

  /** Average response size */
  averageResponseSize: number;

  /** Average processing time */
  averageProcessingTimeMs: number;

  /** Slowest response time */
  slowestResponseTimeMs: number;

  /** Fastest response time */
  fastestResponseTimeMs: number;

  /** Cache hit rate (0-1) */
  cacheHitRate: number;

  /** Error rate (0-1) */
  errorRate: number;
}
