/**
 * System Validation Service
 *
 * Validates system-wide configuration, module registration, and service availability.
 * Ensures the entire system is properly configured and all components are registered.
 *
 * IMPORTANT: System Validation is a FOUNDATION layer. It ONLY analyzes and reports.
 * It MUST NEVER modify gameplay, balances, rewards, inventory, or player state.
 */

import { IssueSeverity } from '../types/IssueSeverity';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('SystemValidation');

/**
 * System validation issue.
 */
export interface SystemIssue {
  type: 'missing_module' | 'missing_service' | 'missing_provider' | 'missing_interface' | 'broken_import' | 'invalid_config';
  severity: IssueSeverity;
  module?: string;
  service?: string;
  provider?: string;
  interface?: string;
  message: string;
}

/**
 * System validation result.
 */
export interface SystemValidationResult {
  isValid: boolean;
  modules: ModuleStatus[];
  services: ServiceStatus[];
  providers: ProviderStatus[];
  issues: SystemIssue[];
  summary: {
    totalModules: number;
    registeredModules: number;
    totalServices: number;
    registeredServices: number;
    totalProviders: number;
    registeredProviders: number;
    criticalIssues: number;
    warnings: number;
  };
  validatedAt: Date;
}

/**
 * Module status.
 */
export interface ModuleStatus {
  name: string;
  isRegistered: boolean;
  isLoaded: boolean;
  dependencies: string[];
  exportedProviders: string[];
}

/**
 * Service status.
 */
export interface ServiceStatus {
  name: string;
  module: string;
  isRegistered: boolean;
  isInstantiated: boolean;
  dependencies: string[];
}

/**
 * Provider status.
 */
export interface ProviderStatus {
  name: string;
  module: string;
  type: 'singleton' | 'scoped' | 'transient' | 'factory';
  isRegistered: boolean;
  isResolved: boolean;
}

/**
 * System Validation Service
 *
 * Validates:
 * - All modules are registered
 * - All services are registered
 * - No missing providers
 * - No missing interfaces
 * - No broken imports
 */
export class SystemValidation {
  private readonly _modules: Map<string, ModuleStatus> = new Map();
  private readonly _services: Map<string, ServiceStatus> = new Map();
  private readonly _providers: Map<string, ProviderStatus> = new Map();

  constructor() {
    logger.info('SystemValidation service initialized');
  }

  /**
   * Registers a module for validation.
   */
  registerModule(status: ModuleStatus): void {
    this._modules.set(status.name, status);
    logger.debug(`Registered module for validation: ${status.name}`);
  }

  /**
   * Registers a service for validation.
   */
  registerService(status: ServiceStatus): void {
    this._services.set(status.name, status);
    logger.debug(`Registered service for validation: ${status.name}`);
  }

  /**
   * Registers a provider for validation.
   */
  registerProvider(status: ProviderStatus): void {
    this._providers.set(status.name, status);
    logger.debug(`Registered provider for validation: ${status.name}`);
  }

  /**
   * Performs full system validation.
   */
  validate(): SystemValidationResult {
    logger.info('Starting system validation');

    const issues: SystemIssue[] = [];

    // Check module registration
    issues.push(...this.checkModuleRegistration());

    // Check service registration
    issues.push(...this.checkServiceRegistration());

    // Check provider registration
    issues.push(...this.checkProviderRegistration());

    // Check module dependencies
    issues.push(...this.checkModuleDependencies());

    // Check service dependencies
    issues.push(...this.checkServiceDependencies());

    // Check provider dependencies
    issues.push(...this.checkProviderDependencies());

    const criticalIssues = issues.filter(i => i.severity === IssueSeverity.CRITICAL).length;
    const warnings = issues.filter(i => i.severity === IssueSeverity.HIGH || i.severity === IssueSeverity.MEDIUM).length;

    const registeredModules = Array.from(this._modules.values()).filter(m => m.isRegistered).length;
    const registeredServices = Array.from(this._services.values()).filter(s => s.isRegistered).length;
    const registeredProviders = Array.from(this._providers.values()).filter(p => p.isRegistered).length;

    const result: SystemValidationResult = {
      isValid: criticalIssues === 0,
      modules: Array.from(this._modules.values()),
      services: Array.from(this._services.values()),
      providers: Array.from(this._providers.values()),
      issues,
      summary: {
        totalModules: this._modules.size,
        registeredModules,
        totalServices: this._services.size,
        registeredServices,
        totalProviders: this._providers.size,
        registeredProviders,
        criticalIssues,
        warnings,
      },
      validatedAt: new Date(),
    };

    logger.info('System validation completed', {
      isValid: result.isValid,
      totalModules: this._modules.size,
      registeredModules,
      totalServices: this._services.size,
      registeredServices,
      criticalIssues,
      warnings,
    });

    return result;
  }

  /**
   * Checks module registration.
   */
  private checkModuleRegistration(): SystemIssue[] {
    const issues: SystemIssue[] = [];
    const requiredModules = [
      'authentication',
      'database',
      'cache',
      'api-gateway',
      'optimization',
      'stabilization',
      'audit',
      'notification',
      'monitoring',
      'scheduler',
    ];

    for (const moduleName of requiredModules) {
      const module = this._modules.get(moduleName);
      if (!module) {
        issues.push({
          type: 'missing_module',
          severity: IssueSeverity.HIGH,
          module: moduleName,
          message: `Required module '${moduleName}' is not registered`,
        });
      } else if (!module.isRegistered) {
        issues.push({
          type: 'missing_module',
          severity: IssueSeverity.CRITICAL,
          module: moduleName,
          message: `Module '${moduleName}' is registered but not loaded`,
        });
      }
    }

    return issues;
  }

  /**
   * Checks service registration.
   */
  private checkServiceRegistration(): SystemIssue[] {
    const issues: SystemIssue[] = [];

    for (const [serviceName, service] of this._services) {
      if (!service.isRegistered) {
        issues.push({
          type: 'missing_service',
          severity: IssueSeverity.HIGH,
          service: serviceName,
          module: service.module,
          message: `Service '${serviceName}' in module '${service.module}' is not registered`,
        });
      } else if (!service.isInstantiated) {
        issues.push({
          type: 'missing_service',
          severity: IssueSeverity.MEDIUM,
          service: serviceName,
          module: service.module,
          message: `Service '${serviceName}' is registered but not instantiated`,
        });
      }
    }

    return issues;
  }

  /**
   * Checks provider registration.
   */
  private checkProviderRegistration(): SystemIssue[] {
    const issues: SystemIssue[] = [];

    for (const [providerName, provider] of this._providers) {
      if (!provider.isRegistered) {
        issues.push({
          type: 'missing_provider',
          severity: IssueSeverity.HIGH,
          provider: providerName,
          module: provider.module,
          message: `Provider '${providerName}' in module '${provider.module}' is not registered`,
        });
      } else if (!provider.isResolved) {
        issues.push({
          type: 'missing_provider',
          severity: IssueSeverity.MEDIUM,
          provider: providerName,
          module: provider.module,
          message: `Provider '${providerName}' is registered but not resolved`,
        });
      }
    }

    return issues;
  }

  /**
   * Checks module dependencies.
   */
  private checkModuleDependencies(): SystemIssue[] {
    const issues: SystemIssue[] = [];

    for (const [moduleName, module] of this._modules) {
      for (const depName of module.dependencies) {
        const dep = this._modules.get(depName);
        if (!dep) {
          issues.push({
            type: 'broken_import',
            severity: IssueSeverity.HIGH,
            module: moduleName,
            message: `Module '${moduleName}' depends on '${depName}' which is not registered`,
          });
        } else if (!dep.isRegistered) {
          issues.push({
            type: 'broken_import',
            severity: IssueSeverity.CRITICAL,
            module: moduleName,
            message: `Module '${moduleName}' depends on '${depName}' which is not loaded`,
          });
        }
      }
    }

    return issues;
  }

  /**
   * Checks service dependencies.
   */
  private checkServiceDependencies(): SystemIssue[] {
    const issues: SystemIssue[] = [];

    for (const [serviceName, service] of this._services) {
      for (const depName of service.dependencies) {
        const dep = this._providers.get(depName);
        if (!dep) {
          issues.push({
            type: 'missing_provider',
            severity: IssueSeverity.HIGH,
            service: serviceName,
            provider: depName,
            module: service.module,
            message: `Service '${serviceName}' depends on provider '${depName}' which is not registered`,
          });
        } else if (!dep.isRegistered) {
          issues.push({
            type: 'missing_provider',
            severity: IssueSeverity.CRITICAL,
            service: serviceName,
            provider: depName,
            module: service.module,
            message: `Service '${serviceName}' depends on provider '${depName}' which is not resolved`,
          });
        }
      }
    }

    return issues;
  }

  /**
   * Checks provider dependencies.
   */
  private checkProviderDependencies(): SystemIssue[] {
    const issues: SystemIssue[] = [];

    for (const [providerName, provider] of this._providers) {
      // Check that provider doesn't depend on itself (handled by DependencyValidation)
      // Here we just verify the type is valid
      const validTypes = ['singleton', 'scoped', 'transient', 'factory'];
      if (!validTypes.includes(provider.type)) {
        issues.push({
          type: 'invalid_config',
          severity: IssueSeverity.HIGH,
          provider: providerName,
          module: provider.module,
          message: `Provider '${providerName}' has invalid type '${provider.type}'`,
        });
      }
    }

    return issues;
  }

  /**
   * Gets all registered modules.
   */
  getRegisteredModules(): string[] {
    return Array.from(this._modules.values())
      .filter(m => m.isRegistered)
      .map(m => m.name);
  }

  /**
   * Gets all registered services.
   */
  getRegisteredServices(): string[] {
    return Array.from(this._services.values())
      .filter(s => s.isRegistered)
      .map(s => s.name);
  }

  /**
   * Gets all registered providers.
   */
  getRegisteredProviders(): string[] {
    return Array.from(this._providers.values())
      .filter(p => p.isRegistered)
      .map(p => p.name);
  }

  /**
   * Resets validation state.
   */
  reset(): void {
    this._modules.clear();
    this._services.clear();
    this._providers.clear();
    logger.info('SystemValidation state reset');
  }
}
