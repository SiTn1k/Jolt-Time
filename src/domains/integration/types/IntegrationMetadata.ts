/**
 * IntegrationMetadata
 *
 * Metadata for integration entities.
 * Provides additional context and tracking information.
 */

/**
 * Metadata for integration providers.
 */
export interface IntegrationProviderMetadata {
  /** Human-readable description */
  description?: string;

  /** Provider logo URL */
  logoUrl?: string;

  /** Documentation URL */
  documentationUrl?: string;

  /** Support contact email */
  supportEmail?: string;

  /** Support contact URL */
  supportUrl?: string;

  /** Terms of service URL */
  termsUrl?: string;

  /** Privacy policy URL */
  privacyUrl?: string;

  /** Provider website URL */
  websiteUrl?: string;

  /** Owner or vendor name */
  vendor?: string;

  /** Integration category */
  category?: string;

  /** Tags for categorization */
  tags?: string[];

  /** Associated user IDs who can manage this provider */
  ownerIds?: string[];

  /** Environment (production, staging, development) */
  environment?: 'production' | 'staging' | 'development';

  /** Region or data center location */
  region?: string;

  /** Cost information */
  costInfo?: {
    currency?: string;
    monthlyLimit?: number;
    perRequestCost?: number;
    currentSpend?: number;
  };

  /** Compliance certifications */
  certifications?: string[];

  /** Custom fields */
  customFields?: Record<string, unknown>;

  /** Created by user ID */
  createdBy?: string;

  /** Last updated by user ID */
  updatedBy?: string;

  /** Version for optimistic locking */
  version?: number;
}

/**
 * Metadata for integration requests.
 */
export interface IntegrationRequestMetadata {
  /** User or system ID that initiated the request */
  initiatedBy?: string;

  /** Session ID for tracking */
  sessionId?: string;

  /** Correlation ID for distributed tracing */
  correlationId?: string;

  /** Source IP address */
  sourceIp?: string;

  /** User agent string */
  userAgent?: string;

  /** Request priority (1-10, higher = more important) */
  priority?: number;

  /** Processing tags */
  tags?: string[];

  /** Custom fields */
  customFields?: Record<string, unknown>;
}

/**
 * Metadata for integration responses.
 */
export interface IntegrationResponseMetadata {
  /** Processing duration in milliseconds */
  processingTimeMs?: number;

  /** Response size in bytes */
  responseSize?: number;

  /** Cache hit indicator */
  cached?: boolean;

  /** Rate limit remaining */
  rateLimitRemaining?: number;

  /** Rate limit reset timestamp */
  rateLimitReset?: number;

  /** Retry count (if retried) */
  retryCount?: number;

  /** Error details (if failed) */
  errorDetails?: {
    code?: string;
    message?: string;
    retryable?: boolean;
  };

  /** Custom fields */
  customFields?: Record<string, unknown>;
}
