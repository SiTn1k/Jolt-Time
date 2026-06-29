/**
 * Analytics Metadata
 *
 * Defines metadata structure for analytics events and sessions.
 */

/**
 * Metadata key-value pairs for analytics.
 */
export interface AnalyticsMetadata {
  /** Optional IP address (hashed for privacy) */
  ipHash?: string;

  /** User agent string */
  userAgent?: string;

  /** Language code */
  language?: string;

  /** Client version */
  clientVersion?: string;

  /** Client platform (iOS, Android, Web) */
  clientPlatform?: string;

  /** Session ID if applicable */
  sessionId?: string;

  /** Request ID for tracing */
  requestId?: string;

  /** Additional custom metadata */
  [key: string]: unknown;
}

/**
 * Initial/default analytics metadata.
 */
export const INITIAL_ANALYTICS_METADATA: AnalyticsMetadata = {};
