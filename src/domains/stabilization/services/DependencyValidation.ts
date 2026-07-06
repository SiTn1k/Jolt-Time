/**
 * Dependency Validation Service
 *
 * Validates dependency injection configuration and module registration.
 * Checks for broken imports, circular dependencies, duplicate providers, etc.
 *
 * IMPORTANT: Dependency Validation is a FOUNDATION layer. It ONLY analyzes
 * and reports. It MUST NEVER modify gameplay, balances, rewards, inventory,
 * or player state.
 */

import { IssueSeverity } from '../types/IssueSeverity';
import { IssueStatus } from '../types/IssueStatus';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('DependencyValidation');

/**
 * Validation issue severity levels.
 */
export enum ValidationSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Issue type for dependency validation.
 */
export interface DependencyIssue {
  type: 'broken_import' | 'circular_dependency' | 'duplicate_provider' | 'missing_provider' | 'unused_provider' | 'invalid_injection';
  severity: ValidationSeverity;
  message: string;
  module?: string;
  provider?: string;
  dependency?: string;
  file?: string;
}

/**
 * Dependency validation result.
 */
export interface DependencyValidationResult {
  isValid: boolean;
  issues: DependencyIssue[];
  summary: {
    errorCount: number;
    warningCount: number;
    infoCount: number;
  };
  validatedAt: Date;
}

/**
 * Provider registration info.
 */
export interface ProviderInfo {
  name: string;
  module: string;
  type: 'singleton' | 'scoped' | 'transient' | 'factory';
  dependencies: string[];
  isRegistered: boolean;
}

/**
 * Module registration info.
 */
export interface ModuleInfo {
  name: string;
  providers: ProviderInfo[];
  imports: string[];
  exports: string[];
}

/**
 * Dependency Validation Service
 *
 * Validates:
 * - Broken imports
 * - Circular dependencies
 * - Duplicate providers
 * - Unused providers
 * - Missing providers
 * - Invalid dependency injection
 */
export class DependencyValidation {
  private readonly _modules: Map<string, ModuleInfo> = new Map();
  private readonly _providers: Map<string, ProviderInfo> = new Map();

  constructor() {
    logger.info('DependencyValidation service initialized');
  }

  /**
   * Registers a module for validation.
   */
  registerModule(moduleInfo: ModuleInfo): void {
    this._modules.set(moduleInfo.name, moduleInfo);
    for (const provider of moduleInfo.providers) {
      this._providers.set(provider.name, provider);
    }
    logger.debug(`Registered module: ${moduleInfo.name}`, {
      providerCount: moduleInfo.providers.length,
    });
  }

  /**
   * Performs full dependency validation.
   */
  validate(): DependencyValidationResult {
    logger.info('Starting dependency validation');
    const issues: DependencyIssue[] = [];

    // Check for broken imports
    issues.push(...this.checkBrokenImports());

    // Check for circular dependencies
    issues.push(...this.checkCircularDependencies());

    // Check for duplicate providers
    issues.push(...this.checkDuplicateProviders());

    // Check for missing providers
    issues.push(...this.checkMissingProviders());

    // Check for unused providers
    issues.push(...this.checkUnusedProviders());

    // Check for invalid dependency injection
    issues.push(...this.checkInvalidInjection());

    const errorCount = issues.filter(i => i.severity === ValidationSeverity.ERROR).length;
    const warningCount = issues.filter(i => i.severity === ValidationSeverity.WARNING).length;
    const infoCount = issues.filter(i => i.severity === ValidationSeverity.INFO).length;

    const result: DependencyValidationResult = {
      isValid: errorCount === 0,
      issues,
      summary: {
        errorCount,
        warningCount,
        infoCount,
      },
      validatedAt: new Date(),
    };

    logger.info('Dependency validation completed', {
      isValid: result.isValid,
      errorCount,
      warningCount,
      infoCount,
    });

    return result;
  }

  /**
   * Checks for broken imports.
   */
  private checkBrokenImports(): DependencyIssue[] {
    const issues: DependencyIssue[] = [];

    for (const [moduleName, moduleInfo] of this._modules) {
      for (const importName of moduleInfo.imports) {
        if (!this._modules.has(importName) && !this.isBuiltInModule(importName)) {
          issues.push({
            type: 'broken_import',
            severity: ValidationSeverity.ERROR,
            message: `Module '${moduleName}' imports '${importName}' which does not exist`,
            module: moduleName,
            dependency: importName,
          });
        }
      }
    }

    return issues;
  }

  /**
   * Checks for circular dependencies.
   */
  private checkCircularDependencies(): DependencyIssue[] {
    const issues: DependencyIssue[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const detectCycle = (moduleName: string, path: string[]): string[] | null => {
      if (recursionStack.has(moduleName)) {
        return [...path, moduleName];
      }
      if (visited.has(moduleName)) {
        return null;
      }

      visited.add(moduleName);
      recursionStack.add(moduleName);

      const moduleInfo = this._modules.get(moduleName);
      if (moduleInfo) {
        for (const importName of moduleInfo.imports) {
          const cycle = detectCycle(importName, [...path, moduleName]);
          if (cycle) {
            return cycle;
          }
        }
      }

      recursionStack.delete(moduleName);
      return null;
    };

    for (const moduleName of this._modules.keys()) {
      visited.clear();
      recursionStack.clear();
      const cycle = detectCycle(moduleName, []);
      if (cycle) {
        issues.push({
          type: 'circular_dependency',
          severity: ValidationSeverity.ERROR,
          message: `Circular dependency detected: ${cycle.join(' -> ')}`,
          module: cycle[0],
        });
      }
    }

    return issues;
  }

  /**
   * Checks for duplicate providers.
   */
  private checkDuplicateProviders(): DependencyIssue[] {
    const issues: DependencyIssue[] = [];
    const providerModules = new Map<string, string[]>();

    for (const [providerName, providerInfo] of this._providers) {
      const modules = providerModules.get(providerName) || [];
      modules.push(providerInfo.module);
      providerModules.set(providerName, modules);
    }

    for (const [providerName, modules] of providerModules) {
      if (modules.length > 1) {
        issues.push({
          type: 'duplicate_provider',
          severity: ValidationSeverity.ERROR,
          message: `Provider '${providerName}' is registered in multiple modules: ${modules.join(', ')}`,
          provider: providerName,
          module: modules[0],
        });
      }
    }

    return issues;
  }

  /**
   * Checks for missing providers.
   */
  private checkMissingProviders(): DependencyIssue[] {
    const issues: DependencyIssue[] = [];

    for (const [moduleName, moduleInfo] of this._modules) {
      for (const provider of moduleInfo.providers) {
        for (const depName of provider.dependencies) {
          if (!this._providers.has(depName) && !this.isBuiltInProvider(depName)) {
            issues.push({
              type: 'missing_provider',
              severity: ValidationSeverity.ERROR,
              message: `Provider '${provider.name}' in module '${moduleName}' depends on '${depName}' which is not registered`,
              provider: provider.name,
              module: moduleName,
              dependency: depName,
            });
          }
        }
      }
    }

    return issues;
  }

  /**
   * Checks for unused providers.
   */
  private checkUnusedProviders(): DependencyIssue[] {
    const issues: DependencyIssue[] = [];
    const usedProviders = new Set<string>();

    // Collect all providers that are dependencies of other providers
    for (const provider of this._providers.values()) {
      for (const depName of provider.dependencies) {
        usedProviders.add(depName);
      }
    }

    // Check all modules for imports
    for (const moduleInfo of this._modules.values()) {
      for (const exportName of moduleInfo.exports) {
        usedProviders.add(exportName);
      }
    }

    // Find unused providers (excluding built-in providers)
    for (const [providerName, providerInfo] of this._providers) {
      if (!usedProviders.has(providerName) && !this.isBuiltInProvider(providerName)) {
        issues.push({
          type: 'unused_provider',
          severity: ValidationSeverity.WARNING,
          message: `Provider '${providerName}' is registered but never used`,
          provider: providerName,
          module: providerInfo.module,
        });
      }
    }

    return issues;
  }

  /**
   * Checks for invalid dependency injection.
   */
  private checkInvalidInjection(): DependencyIssue[] {
    const issues: DependencyIssue[] = [];

    for (const [providerName, providerInfo] of this._providers) {
      if (!providerInfo.isRegistered) {
        issues.push({
          type: 'invalid_injection',
          severity: ValidationSeverity.ERROR,
          message: `Provider '${providerName}' is defined but not registered in DI container`,
          provider: providerName,
          module: providerInfo.module,
        });
      }

      if (providerInfo.dependencies.includes(providerName)) {
        issues.push({
          type: 'invalid_injection',
          severity: ValidationSeverity.ERROR,
          message: `Provider '${providerName}' depends on itself`,
          provider: providerName,
          module: providerInfo.module,
        });
      }
    }

    return issues;
  }

  /**
   * Checks if a module name is a built-in module.
   */
  private isBuiltInModule(moduleName: string): boolean {
    const builtInModules = [
      'typescript',
      'tslib',
      'node',
      'events',
      'util',
      'path',
      'fs',
      'os',
      'http',
      'https',
      'crypto',
      'stream',
      'buffer',
      'url',
      'querystring',
      'assert',
      'v8',
      'vm',
      'zlib',
    ];
    return builtInModules.includes(moduleName);
  }

  /**
   * Checks if a provider is a built-in provider.
   */
  private isBuiltInProvider(providerName: string): boolean {
    const builtInProviders = [
      'Logger',
      'Container',
      'EventBus',
      'Configuration',
      'Database',
      'Cache',
    ];
    return builtInProviders.includes(providerName);
  }

  /**
   * Resets the validation state.
   */
  reset(): void {
    this._modules.clear();
    this._providers.clear();
    logger.info('DependencyValidation state reset');
  }

  /**
   * Gets all registered modules.
   */
  getRegisteredModules(): string[] {
    return Array.from(this._modules.keys());
  }

  /**
   * Gets all registered providers.
   */
  getRegisteredProviders(): string[] {
    return Array.from(this._providers.keys());
  }
}
