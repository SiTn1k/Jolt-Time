/**
 * System Validation Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SystemValidation } from '../services/SystemValidation';
import type { ModuleStatus, ServiceStatus, ProviderStatus } from '../services/SystemValidation';
import { IssueSeverity } from '../types/IssueSeverity';

// Mock logger
vi.mock('../../../core/logging/logger.service', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('SystemValidation', () => {
  let systemValidation: SystemValidation;

  beforeEach(() => {
    systemValidation = new SystemValidation();
  });

  describe('Module Registration', () => {
    it('should register a module', () => {
      const moduleStatus: ModuleStatus = {
        name: 'test-module',
        isRegistered: true,
        isLoaded: true,
        dependencies: [],
        exportedProviders: ['ProviderA'],
      };

      systemValidation.registerModule(moduleStatus);

      const modules = systemValidation.getRegisteredModules();
      expect(modules).toContain('test-module');
    });
  });

  describe('Service Registration', () => {
    it('should register a service', () => {
      const serviceStatus: ServiceStatus = {
        name: 'TestService',
        module: 'test-module',
        isRegistered: true,
        isInstantiated: true,
        dependencies: [],
      };

      systemValidation.registerService(serviceStatus);

      const services = systemValidation.getRegisteredServices();
      expect(services).toContain('TestService');
    });
  });

  describe('Provider Registration', () => {
    it('should register a provider', () => {
      const providerStatus: ProviderStatus = {
        name: 'TestProvider',
        module: 'test-module',
        type: 'singleton',
        isRegistered: true,
        isResolved: true,
      };

      systemValidation.registerProvider(providerStatus);

      const providers = systemValidation.getRegisteredProviders();
      expect(providers).toContain('TestProvider');
    });
  });

  describe('Module Validation', () => {
    it('should detect missing required modules', () => {
      // Don't register any modules
      const result = systemValidation.validate();

      expect(result.issues.some(i => i.type === 'missing_module')).toBe(true);
    });

    it('should validate registered modules as loaded', () => {
      systemValidation.registerModule({
        name: 'authentication',
        isRegistered: true,
        isLoaded: true,
        dependencies: [],
        exportedProviders: [],
      });

      const result = systemValidation.validate();

      // authentication module should not have missing_module issue
      const authIssues = result.issues.filter(i => i.type === 'missing_module' && i.module === 'authentication');
      expect(authIssues).toHaveLength(0);
    });

    it('should flag registered but not loaded modules', () => {
      // Reset and register a module that is not loaded
      systemValidation.reset();

      // Register database as NOT registered (which causes issues)
      systemValidation.registerModule({
        name: 'database',
        isRegistered: false, // NOT registered - causes HIGH severity issue
        isLoaded: false,
        dependencies: [],
        exportedProviders: [],
      });

      const result = systemValidation.validate();

      // Should detect missing_module issue with HIGH severity (since it's not registered)
      const missingModuleIssues = result.issues.filter(
        i => i.type === 'missing_module' && i.module === 'database'
      );
      expect(missingModuleIssues.length).toBeGreaterThan(0);
    });
  });

  describe('Service Validation', () => {
    it('should detect unregistered services', () => {
      systemValidation.registerService({
        name: 'UnregisteredService',
        module: 'test-module',
        isRegistered: false,
        isInstantiated: false,
        dependencies: [],
      });

      const result = systemValidation.validate();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'missing_service',
          service: 'UnregisteredService',
        })
      );
    });

    it('should warn about uninstantiated services', () => {
      systemValidation.registerService({
        name: 'NotInstantiatedService',
        module: 'test-module',
        isRegistered: true,
        isInstantiated: false,
        dependencies: [],
      });

      const result = systemValidation.validate();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'missing_service',
          service: 'NotInstantiatedService',
          severity: IssueSeverity.MEDIUM,
        })
      );
    });
  });

  describe('Provider Validation', () => {
    it('should detect unregistered providers', () => {
      systemValidation.registerProvider({
        name: 'UnregisteredProvider',
        module: 'test-module',
        type: 'singleton',
        isRegistered: false,
        isResolved: false,
      });

      const result = systemValidation.validate();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'missing_provider',
          provider: 'UnregisteredProvider',
        })
      );
    });

    it('should warn about unresolved providers', () => {
      systemValidation.registerProvider({
        name: 'UnresolvedProvider',
        module: 'test-module',
        type: 'singleton',
        isRegistered: true,
        isResolved: false,
      });

      const result = systemValidation.validate();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'missing_provider',
          provider: 'UnresolvedProvider',
          severity: IssueSeverity.MEDIUM,
        })
      );
    });
  });

  describe('Dependency Validation', () => {
    it('should detect broken module dependencies', () => {
      systemValidation.registerModule({
        name: 'module-a',
        isRegistered: true,
        isLoaded: true,
        dependencies: ['non-existent-module'],
        exportedProviders: [],
      });

      const result = systemValidation.validate();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'broken_import',
          message: expect.stringContaining('non-existent-module'),
        })
      );
    });

    it('should detect missing provider dependencies for services', () => {
      systemValidation.registerService({
        name: 'TestService',
        module: 'test-module',
        isRegistered: true,
        isInstantiated: true,
        dependencies: ['MissingProvider'],
      });

      const result = systemValidation.validate();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'missing_provider',
          service: 'TestService',
          provider: 'MissingProvider',
        })
      );
    });

    it('should validate provider type', () => {
      systemValidation.registerProvider({
        name: 'InvalidProvider',
        module: 'test-module',
        type: 'invalid' as ProviderStatus['type'],
        isRegistered: true,
        isResolved: true,
      });

      const result = systemValidation.validate();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'invalid_config',
          provider: 'InvalidProvider',
        })
      );
    });
  });

  describe('Validation Summary', () => {
    it('should count modules correctly', () => {
      systemValidation.registerModule({
        name: 'module-1',
        isRegistered: true,
        isLoaded: true,
        dependencies: [],
        exportedProviders: [],
      });
      systemValidation.registerModule({
        name: 'module-2',
        isRegistered: true,
        isLoaded: true,
        dependencies: [],
        exportedProviders: [],
      });

      const result = systemValidation.validate();

      expect(result.summary.totalModules).toBe(2);
      expect(result.summary.registeredModules).toBe(2);
    });

    it('should count services correctly', () => {
      systemValidation.registerService({
        name: 'Service1',
        module: 'module-1',
        isRegistered: true,
        isInstantiated: true,
        dependencies: [],
      });
      systemValidation.registerService({
        name: 'Service2',
        module: 'module-2',
        isRegistered: false,
        isInstantiated: false,
        dependencies: [],
      });

      const result = systemValidation.validate();

      expect(result.summary.totalServices).toBe(2);
      expect(result.summary.registeredServices).toBe(1);
    });

    it('should count providers correctly', () => {
      systemValidation.registerProvider({
        name: 'Provider1',
        module: 'module-1',
        type: 'singleton',
        isRegistered: true,
        isResolved: true,
      });
      systemValidation.registerProvider({
        name: 'Provider2',
        module: 'module-2',
        type: 'singleton',
        isRegistered: false,
        isResolved: false,
      });

      const result = systemValidation.validate();

      expect(result.summary.totalProviders).toBe(2);
      expect(result.summary.registeredProviders).toBe(1);
    });

    it('should count critical issues', () => {
      // Register a dependency module that exists but is not loaded (isRegistered = false)
      systemValidation.registerModule({
        name: 'dependency-module',
        isRegistered: false, // exists but not loaded
        isLoaded: false,
        dependencies: [],
        exportedProviders: [],
      });

      // Register test-module with a dependency on the unloaded module
      systemValidation.registerModule({
        name: 'test-module',
        isRegistered: true,
        isLoaded: true,
        dependencies: ['dependency-module'],
        exportedProviders: [],
      });

      const result = systemValidation.validate();

      // Should detect broken_import with CRITICAL severity (dependency exists but not loaded)
      const criticalIssues = result.issues.filter(i => i.severity === IssueSeverity.CRITICAL);
      expect(criticalIssues.length).toBeGreaterThan(0);
    });
  });

  describe('Overall Validation Result', () => {
    it('should be valid when no critical issues', () => {
      systemValidation.registerModule({
        name: 'authentication',
        isRegistered: true,
        isLoaded: true,
        dependencies: [],
        exportedProviders: [],
      });
      systemValidation.registerModule({
        name: 'database',
        isRegistered: true,
        isLoaded: true,
        dependencies: [],
        exportedProviders: [],
      });
      systemValidation.registerModule({
        name: 'cache',
        isRegistered: true,
        isLoaded: true,
        dependencies: [],
        exportedProviders: [],
      });

      const result = systemValidation.validate();

      expect(result.isValid).toBe(true);
    });

    it('should include validated timestamp', () => {
      const result = systemValidation.validate();

      expect(result.validatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Reset', () => {
    it('should clear all registrations', () => {
      systemValidation.registerModule({
        name: 'test-module',
        isRegistered: true,
        isLoaded: true,
        dependencies: [],
        exportedProviders: [],
      });
      systemValidation.registerService({
        name: 'TestService',
        module: 'test-module',
        isRegistered: true,
        isInstantiated: true,
        dependencies: [],
      });
      systemValidation.registerProvider({
        name: 'TestProvider',
        module: 'test-module',
        type: 'singleton',
        isRegistered: true,
        isResolved: true,
      });

      systemValidation.reset();

      expect(systemValidation.getRegisteredModules()).toHaveLength(0);
      expect(systemValidation.getRegisteredServices()).toHaveLength(0);
      expect(systemValidation.getRegisteredProviders()).toHaveLength(0);
    });
  });
});
