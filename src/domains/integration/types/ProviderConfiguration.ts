/**
 * ProviderConfiguration
 *
 * Configuration settings for an integration provider.
 * Defines the structure for provider-specific configuration.
 */

/**
 * Base provider configuration.
 */
export interface ProviderConfiguration {
  /** API endpoint URL */
  endpoint?: string;

  /** Authentication type */
  authType?: 'none' | 'api_key' | 'bearer' | 'oauth2' | 'basic' | 'custom';

  /** API key or secret (should be stored securely) */
  apiKey?: string;

  /** OAuth client ID */
  clientId?: string;

  /** OAuth client secret (should be stored securely) */
  clientSecret?: string;

  /** OAuth redirect URI */
  redirectUri?: string;

  /** Scopes for OAuth/token requests */
  scopes?: string[];

  /** Request timeout in milliseconds */
  timeout?: number;

  /** Retry configuration */
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier?: number;
  };

  /** Rate limiting configuration */
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerHour?: number;
    requestsPerDay?: number;
  };

  /** Webhook configuration (for webhook integrations) */
  webhookConfig?: {
    url: string;
    secret?: string;
    events?: string[];
    enabled?: boolean;
  };

  /** Custom headers to include with requests */
  headers?: Record<string, string>;

  /** Provider-specific settings */
  settings?: Record<string, unknown>;
}
