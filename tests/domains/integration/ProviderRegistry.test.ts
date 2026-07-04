/**
 * Provider Registry Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ProviderRegistry, getProviderRegistry, PROVIDER_DEFAULTS } from '../../../src/domains/integration/services/ProviderRegistry';
import type { IntegrationType } from '../../../src/domains/integration/types/IntegrationType';

describe('ProviderRegistry', () => {
  let registry: ProviderRegistry;

  beforeEach(() => {
    registry = new ProviderRegistry();
  });

  describe('register', () => {
    it('should register a new provider', () => {
      const provider = registry.register({
        id: 'provider-1',
        name: 'Test Provider',
        type: 'telegram' as IntegrationType,
      });

      expect(provider.id).toBe('provider-1');
      expect(provider.name).toBe('Test Provider');
      expect(provider.type).toBe('telegram');
    });

    it('should throw error for duplicate provider ID', () => {
      registry.register({
        id: 'provider-1',
        name: 'Provider 1',
        type: 'telegram' as IntegrationType,
      });

      expect(() => {
        registry.register({
          id: 'provider-1',
          name: 'Provider 2',
          type: 'webhook' as IntegrationType,
        });
      }).toThrow("Provider with ID 'provider-1' is already registered");
    });
  });

  describe('unregister', () => {
    it('should unregister existing provider', () => {
      registry.register({
        id: 'provider-1',
        name: 'Test Provider',
        type: 'telegram' as IntegrationType,
      });

      const result = registry.unregister('provider-1');

      expect(result).toBe(true);
      expect(registry.has('provider-1')).toBe(false);
    });

    it('should return false for non-existent provider', () => {
      const result = registry.unregister('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('get', () => {
    it('should return registered provider', () => {
      registry.register({
        id: 'provider-1',
        name: 'Test Provider',
        type: 'telegram' as IntegrationType,
      });

      const provider = registry.get('provider-1');
      expect(provider).toBeDefined();
      expect(provider?.id).toBe('provider-1');
    });

    it('should return undefined for non-existent provider', () => {
      const provider = registry.get('non-existent');
      expect(provider).toBeUndefined();
    });
  });

  describe('getByName', () => {
    it('should find provider by name', () => {
      registry.register({
        id: 'provider-1',
        name: 'Test Provider',
        type: 'telegram' as IntegrationType,
      });

      const provider = registry.getByName('Test Provider');
      expect(provider).toBeDefined();
      expect(provider?.id).toBe('provider-1');
    });

    it('should return undefined for non-existent name', () => {
      const provider = registry.getByName('Non Existent');
      expect(provider).toBeUndefined();
    });
  });

  describe('getByType', () => {
    it('should return all providers of a specific type', () => {
      registry.register({
        id: 'provider-1',
        name: 'Telegram Provider',
        type: 'telegram' as IntegrationType,
      });
      registry.register({
        id: 'provider-2',
        name: 'Webhook Provider',
        type: 'webhook' as IntegrationType,
      });
      registry.register({
        id: 'provider-3',
        name: 'Another Telegram Provider',
        type: 'telegram' as IntegrationType,
      });

      const telegramProviders = registry.getByType('telegram');
      expect(telegramProviders).toHaveLength(2);
    });
  });

  describe('getAll', () => {
    it('should return all registered providers', () => {
      registry.register({
        id: 'provider-1',
        name: 'Provider 1',
        type: 'telegram' as IntegrationType,
      });
      registry.register({
        id: 'provider-2',
        name: 'Provider 2',
        type: 'webhook' as IntegrationType,
      });

      const all = registry.getAll();
      expect(all).toHaveLength(2);
    });
  });

  describe('getHealthy', () => {
    it('should return only healthy providers', () => {
      registry.register({
        id: 'provider-1',
        name: 'Healthy Provider',
        type: 'telegram' as IntegrationType,
      });

      const provider2 = registry.register({
        id: 'provider-2',
        name: 'Unhealthy Provider',
        type: 'webhook' as IntegrationType,
      });

      // Mark provider 2 as unhealthy
      registry.updateStatus('provider-2', { isHealthy: false });

      const healthy = registry.getHealthy();
      expect(healthy).toHaveLength(1);
      expect(healthy[0].id).toBe('provider-1');
    });
  });

  describe('has', () => {
    it('should return true for existing provider', () => {
      registry.register({
        id: 'provider-1',
        name: 'Provider 1',
        type: 'telegram' as IntegrationType,
      });

      expect(registry.has('provider-1')).toBe(true);
    });

    it('should return false for non-existing provider', () => {
      expect(registry.has('non-existent')).toBe(false);
    });
  });

  describe('recordSuccess', () => {
    it('should record success and reset failure count', () => {
      const provider = registry.register({
        id: 'provider-1',
        name: 'Provider 1',
        type: 'telegram' as IntegrationType,
      });

      registry.recordFailure('provider-1');
      registry.recordSuccess('provider-1', 100);

      expect(provider.status.consecutiveFailures).toBe(0);
    });
  });

  describe('recordFailure', () => {
    it('should record failure and increment failure count', () => {
      registry.register({
        id: 'provider-1',
        name: 'Provider 1',
        type: 'telegram' as IntegrationType,
      });

      registry.recordFailure('provider-1');
      registry.recordFailure('provider-1');

      const stats = registry.get('provider-1')?.status;
      expect(stats?.consecutiveFailures).toBe(2);
    });

    it('should mark as unhealthy after multiple failures', () => {
      registry.register({
        id: 'provider-1',
        name: 'Provider 1',
        type: 'telegram' as IntegrationType,
      });

      for (let i = 0; i < 5; i++) {
        registry.recordFailure('provider-1');
      }

      const stats = registry.get('provider-1')?.status;
      expect(stats?.isHealthy).toBe(false);
    });
  });

  describe('size', () => {
    it('should return correct count', () => {
      registry.register({
        id: 'provider-1',
        name: 'Provider 1',
        type: 'telegram' as IntegrationType,
      });
      registry.register({
        id: 'provider-2',
        name: 'Provider 2',
        type: 'webhook' as IntegrationType,
      });

      expect(registry.size()).toBe(2);
    });
  });

  describe('clear', () => {
    it('should remove all providers', () => {
      registry.register({
        id: 'provider-1',
        name: 'Provider 1',
        type: 'telegram' as IntegrationType,
      });
      registry.register({
        id: 'provider-2',
        name: 'Provider 2',
        type: 'webhook' as IntegrationType,
      });

      registry.clear();

      expect(registry.size()).toBe(0);
    });
  });

  describe('getGroupedByType', () => {
    it('should group providers by type', () => {
      registry.register({
        id: 'provider-1',
        name: 'Provider 1',
        type: 'telegram' as IntegrationType,
      });
      registry.register({
        id: 'provider-2',
        name: 'Provider 2',
        type: 'telegram' as IntegrationType,
      });
      registry.register({
        id: 'provider-3',
        name: 'Provider 3',
        type: 'webhook' as IntegrationType,
      });

      const grouped = registry.getGroupedByType();

      expect(grouped.get('telegram')).toHaveLength(2);
      expect(grouped.get('webhook')).toHaveLength(1);
    });
  });

  describe('getDefaultTimeout', () => {
    it('should return configured default timeout', () => {
      expect(registry.getDefaultTimeout()).toBe(30000);
    });
  });
});

describe('PROVIDER_DEFAULTS', () => {
  it('should have defaults for all integration types', () => {
    const types: IntegrationType[] = ['telegram', 'webhook', 'rest_api', 'payment', 'email', 'storage', 'ai', 'other'];

    for (const type of types) {
      const defaults = PROVIDER_DEFAULTS[type];
      expect(defaults).toBeDefined();
      expect(defaults.timeoutMs).toBeGreaterThan(0);
      expect(defaults.retryMaxRetries).toBeGreaterThan(0);
      expect(defaults.circuitBreakerFailureThreshold).toBeGreaterThan(0);
      expect(defaults.rateLimitRequestsPerMinute).toBeGreaterThan(0);
    }
  });

  it('should have stricter defaults for payment type', () => {
    const paymentDefaults = PROVIDER_DEFAULTS.payment;
    const webhookDefaults = PROVIDER_DEFAULTS.webhook;

    expect(paymentDefaults.retryMaxRetries).toBeLessThan(webhookDefaults.retryMaxRetries);
    expect(paymentDefaults.rateLimitRequestsPerMinute).toBeLessThan(webhookDefaults.rateLimitRequestsPerMinute);
  });
});
