/**
 * Provider Registry
 *
 * Registry for managing integration providers.
 * Provides a central registry for all external service integrations.
 *
 * IMPORTANT: Provider Registry is a REGISTRATION layer. It ONLY:
 * - Registers providers
 * - Stores provider metadata
 * - Provides provider lookup
 *
 * Provider Registry MUST NEVER:
 * - Execute HTTP requests
 * - Handle retries directly
 * - Implement circuit breakers
 * - Modify business logic
 */

import type { IntegrationType } from '../types/IntegrationType';
import type { IntegrationStatus } from '../types/IntegrationStatus';
import type { ProviderConfiguration } from '../types/ProviderConfiguration';
import type { IntegrationProviderMetadata } from '../types/IntegrationMetadata';
import type { IHttpGateway } from './HttpGateway';
import type { CircuitBreaker } from './CircuitBreaker';
import type { RateLimiter } from './RateLimiter';
import type { RetryEngine } from './RetryEngine';

/**
 * Provider status.
 */
export interface ProviderStatus {
  /** Whether the provider is healthy */
  isHealthy: boolean;
  /** Last health check timestamp */
  lastCheckedAt: Date | null;
  /** Number of consecutive failures */
  consecutiveFailures: number;
  /** Average response time in ms */
  avgResponseTimeMs: number;
  /** Circuit breaker state */
  circuitBreakerState: string;
}

/**
 * Registered provider entry.
 */
export interface RegisteredProvider {
  /** Provider ID */
  id: string;
  /** Provider name */
  name: string;
  /** Provider type */
  type: IntegrationType;
  /** Provider configuration */
  configuration: ProviderConfiguration;
  /** HTTP Gateway for this provider */
  gateway?: IHttpGateway;
  /** Circuit breaker for this provider */
  circuitBreaker?: CircuitBreaker;
  /** Rate limiter for this provider */
  rateLimiter?: RateLimiter;
  /** Retry engine for this provider */
  retryEngine?: RetryEngine;
  /** Provider status */
  status: ProviderStatus;
  /** Provider metadata */
  metadata: IntegrationProviderMetadata;
}

/**
 * Provider registry configuration.
 */
export interface ProviderRegistryConfig {
  /** Default timeout for providers without explicit timeout */
  defaultTimeoutMs?: number;
  /** Default retry configuration */
  defaultRetryConfig?: {
    maxRetries?: number;
    initialDelayMs?: number;
  };
  /** Default circuit breaker configuration */
  defaultCircuitBreakerConfig?: {
    failureThreshold?: number;
    openTimeoutMs?: number;
  };
  /** Default rate limiter configuration */
  defaultRateLimiterConfig?: {
    requestsPerMinute?: number;
    burstLimit?: number;
  };
}

/**
 * Provider Registry.
 * Manages all registered integration providers.
 */
export class ProviderRegistry {
  private readonly providers: Map<string, RegisteredProvider> = new Map();
  private readonly config: ProviderRegistryConfig;

  /**
   * Creates a new Provider Registry.
   */
  constructor(config?: ProviderRegistryConfig) {
    this.config = {
      defaultTimeoutMs: config?.defaultTimeoutMs ?? 30000,
      defaultRetryConfig: config?.defaultRetryConfig ?? { maxRetries: 3, initialDelayMs: 1000 },
      defaultCircuitBreakerConfig: config?.defaultCircuitBreakerConfig ?? { failureThreshold: 5, openTimeoutMs: 30000 },
      defaultRateLimiterConfig: config?.defaultRateLimiterConfig ?? { requestsPerMinute: 60, burstLimit: 10 },
    };
  }

  /**
   * Registers a new provider.
   */
  register(params: {
    id: string;
    name: string;
    type: IntegrationType;
    configuration?: ProviderConfiguration;
    gateway?: IHttpGateway;
    circuitBreaker?: CircuitBreaker;
    rateLimiter?: RateLimiter;
    retryEngine?: RetryEngine;
    metadata?: IntegrationProviderMetadata;
  }): RegisteredProvider {
    if (this.providers.has(params.id)) {
      throw new Error(`Provider with ID '${params.id}' is already registered`);
    }

    const provider: RegisteredProvider = {
      id: params.id,
      name: params.name,
      type: params.type,
      configuration: params.configuration ?? {},
      gateway: params.gateway,
      circuitBreaker: params.circuitBreaker,
      rateLimiter: params.rateLimiter,
      retryEngine: params.retryEngine,
      status: {
        isHealthy: true,
        lastCheckedAt: null,
        consecutiveFailures: 0,
        avgResponseTimeMs: 0,
        circuitBreakerState: 'closed',
      },
      metadata: params.metadata ?? {},
    };

    this.providers.set(params.id, provider);
    return provider;
  }

  /**
   * Unregisters a provider.
   */
  unregister(id: string): boolean {
    return this.providers.delete(id);
  }

  /**
   * Gets a provider by ID.
   */
  get(id: string): RegisteredProvider | undefined {
    return this.providers.get(id);
  }

  /**
   * Gets a provider by name.
   */
  getByName(name: string): RegisteredProvider | undefined {
    for (const provider of this.providers.values()) {
      if (provider.name === name) {
        return provider;
      }
    }
    return undefined;
  }

  /**
   * Gets all providers of a specific type.
   */
  getByType(type: IntegrationType): RegisteredProvider[] {
    const result: RegisteredProvider[] = [];
    for (const provider of this.providers.values()) {
      if (provider.type === type) {
        result.push(provider);
      }
    }
    return result;
  }

  /**
   * Gets all registered providers.
   */
  getAll(): RegisteredProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Gets all healthy providers.
   */
  getHealthy(): RegisteredProvider[] {
    const result: RegisteredProvider[] = [];
    for (const provider of this.providers.values()) {
      if (provider.status.isHealthy) {
        result.push(provider);
      }
    }
    return result;
  }

  /**
   * Checks if a provider exists.
   */
  has(id: string): boolean {
    return this.providers.has(id);
  }

  /**
   * Updates provider status.
   */
  updateStatus(id: string, status: Partial<ProviderStatus>): boolean {
    const provider = this.providers.get(id);
    if (!provider) {
      return false;
    }

    provider.status = { ...provider.status, ...status };
    return true;
  }

  /**
   * Records a success for a provider.
   */
  recordSuccess(id: string, responseTimeMs?: number): boolean {
    const provider = this.providers.get(id);
    if (!provider) {
      return false;
    }

    provider.status.consecutiveFailures = 0;
    provider.status.isHealthy = true;
    provider.status.lastCheckedAt = new Date();

    if (responseTimeMs !== undefined) {
      // Update average response time
      const currentAvg = provider.status.avgResponseTimeMs;
      const totalResponses = (provider.status.consecutiveFailures || 0) + 1;
      provider.status.avgResponseTimeMs = currentAvg === 0 
        ? responseTimeMs 
        : (currentAvg * (totalResponses - 1) + responseTimeMs) / totalResponses;
    }

    // Update circuit breaker state if available
    if (provider.circuitBreaker) {
      provider.status.circuitBreakerState = provider.circuitBreaker.getState();
    }

    return true;
  }

  /**
   * Records a failure for a provider.
   */
  recordFailure(id: string): boolean {
    const provider = this.providers.get(id);
    if (!provider) {
      return false;
    }

    provider.status.consecutiveFailures++;
    provider.status.lastCheckedAt = new Date();

    // Mark as unhealthy if too many consecutive failures
    if (provider.status.consecutiveFailures >= 5) {
      provider.status.isHealthy = false;
    }

    // Update circuit breaker state if available
    if (provider.circuitBreaker) {
      provider.status.circuitBreakerState = provider.circuitBreaker.getState();
    }

    return true;
  }

  /**
   * Gets provider count.
   */
  size(): number {
    return this.providers.size;
  }

  /**
   * Clears all providers.
   */
  clear(): void {
    this.providers.clear();
  }

  /**
   * Gets all provider IDs.
   */
  getIds(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Gets providers grouped by type.
   */
  getGroupedByType(): Map<IntegrationType, RegisteredProvider[]> {
    const grouped = new Map<IntegrationType, RegisteredProvider[]>();
    
    for (const provider of this.providers.values()) {
      const existing = grouped.get(provider.type);
      if (existing) {
        existing.push(provider);
      } else {
        grouped.set(provider.type, [provider]);
      }
    }

    return grouped;
  }

  /**
   * Gets default configuration values.
   */
  getDefaultTimeout(): number {
    return this.config.defaultTimeoutMs;
  }

  /**
   * Gets the registry configuration.
   */
  getConfig(): ProviderRegistryConfig {
    return { ...this.config };
  }
}

/**
 * Global provider registry instance.
 */
let globalRegistry: ProviderRegistry | null = null;

/**
 * Gets the global provider registry.
 */
export function getProviderRegistry(): ProviderRegistry {
  if (!globalRegistry) {
    globalRegistry = new ProviderRegistry();
  }
  return globalRegistry;
}

/**
 * Sets the global provider registry.
 */
export function setProviderRegistry(registry: ProviderRegistry): void {
  globalRegistry = registry;
}

/**
 * Predefined provider type configurations.
 */
export const PROVIDER_DEFAULTS: Record<IntegrationType, {
  timeoutMs: number;
  retryMaxRetries: number;
  circuitBreakerFailureThreshold: number;
  rateLimitRequestsPerMinute: number;
}> = {
  telegram: {
    timeoutMs: 10000,
    retryMaxRetries: 3,
    circuitBreakerFailureThreshold: 5,
    rateLimitRequestsPerMinute: 30,
  },
  webhook: {
    timeoutMs: 30000,
    retryMaxRetries: 3,
    circuitBreakerFailureThreshold: 5,
    rateLimitRequestsPerMinute: 100,
  },
  rest_api: {
    timeoutMs: 30000,
    retryMaxRetries: 3,
    circuitBreakerFailureThreshold: 5,
    rateLimitRequestsPerMinute: 60,
  },
  payment: {
    timeoutMs: 60000,
    retryMaxRetries: 2,
    circuitBreakerFailureThreshold: 3,
    rateLimitRequestsPerMinute: 10,
  },
  email: {
    timeoutMs: 30000,
    retryMaxRetries: 3,
    circuitBreakerFailureThreshold: 5,
    rateLimitRequestsPerMinute: 50,
  },
  storage: {
    timeoutMs: 60000,
    retryMaxRetries: 3,
    circuitBreakerFailureThreshold: 5,
    rateLimitRequestsPerMinute: 100,
  },
  ai: {
    timeoutMs: 120000,
    retryMaxRetries: 2,
    circuitBreakerFailureThreshold: 3,
    rateLimitRequestsPerMinute: 20,
  },
  other: {
    timeoutMs: 30000,
    retryMaxRetries: 3,
    circuitBreakerFailureThreshold: 5,
    rateLimitRequestsPerMinute: 60,
  },
};
