/**
 * Gateway Metadata Types
 *
 * Metadata structures for API Gateway entities.
 */

/**
 * API Gateway metadata structure.
 */
export interface GatewayMetadata {
  /**
   * Route description.
   */
  description: string;

  /**
   * Route tags for grouping.
   */
  tags: string[];

  /**
   * Rate limit per minute (0 = unlimited).
   */
  rateLimit?: number;

  /**
   * Timeout in milliseconds.
   */
  timeout?: number;

  /**
   * Whether the route requires authentication.
   */
  requiresAuth?: boolean;

  /**
   * Whether the route requires admin privileges.
   */
  requiresAdmin?: boolean;

  /**
   * Custom metadata fields.
   */
  customFields: Record<string, unknown>;
}

/**
 * Request metadata structure.
 */
export interface RequestMetadata {
  /**
   * Client IP address.
   */
  clientIp?: string;

  /**
   * User agent string.
   */
  userAgent?: string;

  /**
   * Request source (web, mobile, bot).
   */
  source?: 'web' | 'mobile' | 'bot' | 'api';

  /**
   * Session ID if available.
   */
  sessionId?: string;

  /**
   * Request ID from load balancer.
   */
  forwardedFor?: string;

  /**
   * Custom metadata fields.
   */
  customFields: Record<string, unknown>;
}

/**
 * Response metadata structure.
 */
export interface ResponseMetadata {
  /**
   * Response size in bytes.
   */
  contentLength?: number;

  /**
   * Content type of the response.
   */
  contentType?: string;

  /**
   * Cache-Control header value.
   */
  cacheControl?: string;

  /**
   * Custom metadata fields.
   */
  customFields: Record<string, unknown>;
}

/**
 * Initial empty GatewayMetadata.
 */
export const INITIAL_GATEWAY_METADATA: GatewayMetadata = {
  description: '',
  tags: [],
  rateLimit: undefined,
  timeout: undefined,
  requiresAuth: undefined,
  requiresAdmin: undefined,
  customFields: {},
};

/**
 * Initial empty RequestMetadata.
 */
export const INITIAL_REQUEST_METADATA: RequestMetadata = {
  clientIp: undefined,
  userAgent: undefined,
  source: undefined,
  sessionId: undefined,
  forwardedFor: undefined,
  customFields: {},
};

/**
 * Initial empty ResponseMetadata.
 */
export const INITIAL_RESPONSE_METADATA: ResponseMetadata = {
  contentLength: undefined,
  contentType: undefined,
  cacheControl: undefined,
  customFields: {},
};
