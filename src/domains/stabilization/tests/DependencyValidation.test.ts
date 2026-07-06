/**
 * Dependency Validation Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DependencyValidation, ValidationSeverity } from '../services/DependencyValidation';
import type { ModuleInfo } from '../services/DependencyValidation';

// Mock logger
vi.mock('../../../core/logging/logger.service', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('DependencyValidation', () => {
  let dependencyValidation: DependencyValidation;

  beforeEach(() => {
    dependencyValidation = new DependencyValidation();
  });

  describe('Module Registration', () => {
    it('should register a module', () => {
      const moduleInfo: ModuleInfo = {
        name: 'test-module',
        providers: [],
        imports: [],
        exports: ['ProviderA'],
      };

      dependencyValidation.registerModule(moduleInfo);

      const modules = dependencyValidation.getRegisteredModules();
      expect(modules).toContain('test-module');
    });

    it('should track registered providers', () => {
      dependencyValidation.registerModule({
        name: 'test-module',
        providers: [
          {
            name: 'ProviderA',
            module: 'test-module',
            type: 'singleton',
            dependencies: [],
            isRegistered: true,
          },
          {
            name: 'ProviderB',
            module: 'test-module',
            type: 'scoped',
            dependencies: ['ProviderA'],
            isRegistered: true,
          },
        ],
        imports: [],
        exports: ['ProviderA', 'ProviderB'],
      });

      const providers = dependencyValidation.getRegisteredProviders();
      expect(providers).toContain('ProviderA');
      expect(providers).toContain('ProviderB');
    });
  });

  describe('Broken Import Detection', () => {
    it('should detect broken imports', () => {
      dependencyValidation.registerModule({
        name: 'module-a',
        providers: [],
        imports: ['non-existent-module'],
        exports: [],
      });

      const result = dependencyValidation.validate();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'broken_import',
          severity: ValidationSeverity.ERROR,
          message: expect.stringContaining('non-existent-module'),
        })
      );
    });

    it('should not flag built-in modules as broken', () => {
      dependencyValidation.registerModule({
        name: 'module-a',
        providers: [],
        imports: ['typescript', 'node'],
        exports: [],
      });

      const result = dependencyValidation.validate();

      const brokenImports = result.issues.filter(i => i.type === 'broken_import');
      expect(brokenImports).toHaveLength(0);
    });
  });

  describe('Circular Dependency Detection', () => {
    it('should detect circular dependencies', () => {
      dependencyValidation.registerModule({
        name: 'module-a',
        providers: [],
        imports: ['module-b'],
        exports: [],
      });
      dependencyValidation.registerModule({
        name: 'module-b',
        providers: [],
        imports: ['module-a'],
        exports: [],
      });

      const result = dependencyValidation.validate();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'circular_dependency',
          severity: ValidationSeverity.ERROR,
        })
      );
    });

    it('should not flag valid dependencies as circular', () => {
      dependencyValidation.registerModule({
        name: 'module-a',
        providers: [],
        imports: [],
        exports: [],
      });
      dependencyValidation.registerModule({
        name: 'module-b',
        providers: [],
        imports: ['module-a'],
        exports: [],
      });

      const result = dependencyValidation.validate();

      const circularDeps = result.issues.filter(i => i.type === 'circular_dependency');
      expect(circularDeps).toHaveLength(0);
    });
  });

  describe('Duplicate Provider Detection', () => {
    it('should track provider registrations', () => {
      // Register a provider
      dependencyValidation.registerModule({
        name: 'module-a',
        providers: [
          {
            name: 'ProviderA',
            module: 'module-a',
            type: 'singleton',
            dependencies: [],
            isRegistered: true,
          },
        ],
        imports: [],
        exports: ['ProviderA'],
      });

      // Verify provider is registered
      const providers = dependencyValidation.getRegisteredProviders();
      expect(providers).toContain('ProviderA');
    });
  });

  describe('Missing Provider Detection', () => {
    it('should detect missing providers', () => {
      dependencyValidation.registerModule({
        name: 'module-a',
        providers: [
          {
            name: 'ProviderA',
            module: 'module-a',
            type: 'singleton',
            dependencies: ['NonExistentProvider'],
            isRegistered: true,
          },
        ],
        imports: [],
        exports: ['ProviderA'],
      });

      const result = dependencyValidation.validate();

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'missing_provider',
          severity: ValidationSeverity.ERROR,
          dependency: 'NonExistentProvider',
        })
      );
    });

    it('should not flag built-in providers as missing', () => {
      dependencyValidation.registerModule({
        name: 'module-a',
        providers: [
          {
            name: 'ProviderA',
            module: 'module-a',
            type: 'singleton',
            dependencies: ['Logger', 'Container'],
            isRegistered: true,
          },
        ],
        imports: [],
        exports: ['ProviderA'],
      });

      const result = dependencyValidation.validate();

      const missingProviders = result.issues.filter(i => i.type === 'missing_provider');
      expect(missingProviders).toHaveLength(0);
    });
  });

  describe('Unused Provider Detection', () => {
    it('should detect unused providers', () => {
      // Register a module with an unused provider
      dependencyValidation.registerModule({
        name: 'module-a',
        providers: [
          {
            name: 'UnusedProvider',
            module: 'module-a',
            type: 'singleton',
            dependencies: [],
            isRegistered: true,
          },
        ],
        imports: [],
        exports: [], // Don't export the unused provider
      });

      const result = dependencyValidation.validate();

      // Should detect unused_provider warning
      const unusedIssues = result.issues.filter(i => i.type === 'unused_provider');
      expect(unusedIssues.length).toBeGreaterThan(0);
    });
  });

  describe('Validation Result', () => {
    it('should return valid result when no issues', () => {
      dependencyValidation.registerModule({
        name: 'module-a',
        providers: [
          {
            name: 'ProviderA',
            module: 'module-a',
            type: 'singleton',
            dependencies: [],
            isRegistered: true,
          },
        ],
        imports: [],
        exports: ['ProviderA'],
      });

      const result = dependencyValidation.validate();

      expect(result.isValid).toBe(true);
      expect(result.summary.errorCount).toBe(0);
    });

    it('should count issues correctly', () => {
      dependencyValidation.registerModule({
        name: 'module-a',
        providers: [],
        imports: ['non-existent'],
        exports: [],
      });

      const result = dependencyValidation.validate();

      expect(result.summary.errorCount).toBeGreaterThan(0);
      expect(result.summary.warningCount).toBeGreaterThanOrEqual(0);
      expect(result.summary.infoCount).toBeGreaterThanOrEqual(0);
      expect(result.issues.length).toBe(
        result.summary.errorCount + result.summary.warningCount + result.summary.infoCount
      );
    });

    it('should include validated timestamp', () => {
      const result = dependencyValidation.validate();

      expect(result.validatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Reset', () => {
    it('should clear all registered modules and providers', () => {
      dependencyValidation.registerModule({
        name: 'module-a',
        providers: [
          {
            name: 'ProviderA',
            module: 'module-a',
            type: 'singleton',
            dependencies: [],
            isRegistered: true,
          },
        ],
        imports: [],
        exports: ['ProviderA'],
      });

      dependencyValidation.reset();

      expect(dependencyValidation.getRegisteredModules()).toHaveLength(0);
      expect(dependencyValidation.getRegisteredProviders()).toHaveLength(0);
    });
  });
});
