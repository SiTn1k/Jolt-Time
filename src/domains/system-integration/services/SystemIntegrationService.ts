/**
 * System Integration Service
 *
 * Main service for system integration management.
 * Coordinates module registration, validation, and snapshot creation.
 */

import type { SystemModule } from '../entities/SystemModule';
import type { IntegrationState } from '../entities/IntegrationState';
import type { IntegrationSnapshot } from '../entities/IntegrationSnapshot';
import type { ISystemIntegrationRepository } from '../interfaces/ISystemIntegrationRepository';
import { SystemModule as SystemModuleEntity } from '../entities/SystemModule';
import { IntegrationState as IntegrationStateEntity } from '../entities/IntegrationState';
import { IntegrationSnapshot as IntegrationSnapshotEntity } from '../entities/IntegrationSnapshot';
import { ModuleId } from '../value-objects/ModuleId';
import { StateId } from '../value-objects/StateId';
import { SnapshotId } from '../value-objects/SnapshotId';
import { ModuleValidator } from '../validators/ModuleValidator';
import { IntegrationValidator } from '../validators/IntegrationValidator';
import { SnapshotValidator } from '../validators/SnapshotValidator';
import { DependencyGraph, validateModuleDependencies } from './DependencyGraph';
import {
  DOMAIN_MODULES,
  getAllModuleEntities,
  getModuleDefinition,
  createModuleFromDefinition,
} from './ModuleRegistry';
import type { ModuleStatus } from '../types/ModuleStatus';
import type { IntegrationStatus } from '../types/IntegrationStatus';
import type { PaginationParams } from '../../../shared/types/base.types';
import type { PaginatedResult } from '../../../shared/types/base.types';
import type { ModuleFilterParams, StateFilterParams } from '../interfaces/ISystemIntegrationRepository';

/**
 * Module registration result.
 */
export interface ModuleRegistrationResult {
  success: boolean;
  module?: SystemModule;
  errors: string[];
}

/**
 * Validation report for all modules.
 */
export interface ModuleValidationReport {
  totalModules: number;
  registeredModules: number;
  healthyModules: number;
  failedModules: number;
  degradedModules: number;
  stoppedModules: number;
  unregisteredModules: number;
  errors: string[];
  warnings: string[];
}

/**
 * Integration summary report.
 */
export interface IntegrationSummary {
  totalModules: number;
  healthyModules: number;
  failedModules: number;
  healthPercentage: number;
  lastSnapshot?: IntegrationSnapshot;
  registeredModules: SystemModule[];
  failedModuleDetails: Array<{ name: string; error: string }>;
}

/**
 * System integration service.
 */
export class SystemIntegrationService {
  private readonly repository: ISystemIntegrationRepository;
  private readonly moduleValidator: ModuleValidator;
  private readonly integrationValidator: IntegrationValidator;
  private readonly snapshotValidator: SnapshotValidator;

  constructor(repository: ISystemIntegrationRepository) {
    this.repository = repository;
    this.moduleValidator = new ModuleValidator();
    this.integrationValidator = new IntegrationValidator();
    this.snapshotValidator = new SnapshotValidator();
  }

  // ============ Module Registration ============

  /**
   * Register a new module.
   */
  async registerModule(params: {
    moduleName: string;
    moduleVersion?: string;
    status?: ModuleStatus;
    dependencies?: Array<{ moduleId: string; moduleName: string; status: 'satisfied' | 'unsatisfied' | 'optional'; isOptional: boolean }>;
    metadata?: Record<string, unknown>;
  }): Promise<ModuleRegistrationResult> {
    const errors: string[] = [];

    // Validate module data
    const validation = ModuleValidator.validateCreate({
      moduleName: params.moduleName,
      moduleVersion: params.moduleVersion,
      dependencies: params.dependencies as any,
    });

    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // Check if module already exists
    const existing = await this.repository.findModuleByName(params.moduleName);
    if (existing) {
      return { success: false, errors: [`Module '${params.moduleName}' is already registered`] };
    }

    // Create module entity
    const module = SystemModuleEntity.create({
      moduleName: params.moduleName,
      moduleVersion: params.moduleVersion,
      status: params.status ?? 'registered',
      dependencies: (params.dependencies ?? []) as any,
      metadata: params.metadata ?? {},
    });

    try {
      const registered = await this.repository.createModule(module);
      return { success: true, module: registered, errors: [] };
    } catch (err) {
      return {
        success: false,
        errors: [err instanceof Error ? err.message : 'Failed to register module'],
      };
    }
  }

  /**
   * Register all domain modules from the module registry.
   */
  async registerAllDomainModules(): Promise<{
    registered: string[];
    failed: Array<{ name: string; error: string }>;
  }> {
    const registered: string[] = [];
    const failed: Array<{ name: string; error: string }> = [];

    for (const [name, definition] of Object.entries(DOMAIN_MODULES)) {
      const result = await this.registerModule({
        moduleName: definition.moduleName,
        moduleVersion: definition.moduleVersion,
        status: definition.status,
        dependencies: definition.dependencies,
        metadata: definition.metadata,
      });

      if (result.success) {
        registered.push(name);
      } else {
        failed.push({ name, error: result.errors.join('; ') });
      }
    }

    return { registered, failed };
  }

  /**
   * Find a module by ID.
   */
  async findModuleById(id: string): Promise<SystemModule | null> {
    return this.repository.findModuleById(ModuleId.reconstruct(id));
  }

  /**
   * Find a module by name.
   */
  async findModuleByName(name: string): Promise<SystemModule | null> {
    return this.repository.findModuleByName(name);
  }

  /**
   * Update a module's status.
   */
  async updateModuleStatus(moduleId: string, status: ModuleStatus): Promise<SystemModule | null> {
    const module = await this.repository.findModuleById(ModuleId.reconstruct(moduleId));
    if (!module) {
      return null;
    }

    const updated = module.copyWith({ status });
    return this.repository.updateModule(updated);
  }

  /**
   * List all registered modules.
   */
  async listModules(params?: PaginationParams, filters?: ModuleFilterParams): Promise<PaginatedResult<SystemModule>> {
    return this.repository.listModules(params ?? { page: 1, pageSize: 100 }, filters);
  }

  /**
   * Count total registered modules.
   */
  async countModules(filters?: ModuleFilterParams): Promise<number> {
    return this.repository.countModules(filters);
  }

  // ============ Validation ============

  /**
   * Validate a module.
   */
  validateModule(params: {
    moduleName: string;
    moduleVersion?: string;
    dependencies?: Array<{ moduleId: string; moduleName: string; status: string; isOptional: boolean }>;
  }): { isValid: boolean; errors: string[] } {
    return ModuleValidator.validateCreate(params as any);
  }

  /**
   * Validate all registered modules in the system.
   * Continues validation even if some modules fail.
   */
  async validateAllModules(): Promise<ModuleValidationReport> {
    const report: ModuleValidationReport = {
      totalModules: Object.keys(DOMAIN_MODULES).length,
      registeredModules: 0,
      healthyModules: 0,
      failedModules: 0,
      degradedModules: 0,
      stoppedModules: 0,
      unregisteredModules: 0,
      errors: [],
      warnings: [],
    };

    // Count by status
    for (const definition of Object.values(DOMAIN_MODULES)) {
      switch (definition.status) {
        case 'registered':
          report.registeredModules++;
          break;
        case 'active':
          report.healthyModules++;
          break;
        case 'error':
          report.failedModules++;
          break;
        case 'degraded':
          report.degradedModules++;
          break;
        case 'stopped':
          report.stoppedModules++;
          break;
        case 'unregistered':
          report.unregisteredModules++;
          break;
      }
    }

    // Validate dependency graph
    const modules = getAllModuleEntities();
    const dependencyResult = validateModuleDependencies(modules);

    if (!dependencyResult.isValid) {
      report.errors.push(...dependencyResult.errors);
    }
    if (dependencyResult.warnings.length > 0) {
      report.warnings.push(...dependencyResult.warnings);
    }

    return report;
  }

  /**
   * Validate dependency graph.
   */
  async validateDependencyGraph(): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    missingDependencies: string[];
    circularDependencies: string[][];
  }> {
    const modules = getAllModuleEntities();
    const result = validateModuleDependencies(modules);

    return {
      isValid: result.isValid,
      errors: result.errors,
      warnings: result.warnings,
      missingDependencies: result.missingDependencies,
      circularDependencies: result.circularDependencies,
    };
  }

  // ============ Integration State ============

  /**
   * Create or update integration state for a module.
   */
  async updateIntegrationState(
    moduleId: string,
    status: IntegrationStatus,
    metadata?: Record<string, unknown>
  ): Promise<IntegrationState | null> {
    const module = await this.repository.findModuleById(ModuleId.reconstruct(moduleId));
    if (!module) {
      return null;
    }

    // Check if state already exists
    const existingState = await this.repository.findStateByModuleId(ModuleId.reconstruct(moduleId));

    if (existingState) {
      const updated = existingState.copyWith({ status, lastUpdated: new Date(), metadata });
      return this.repository.updateState(updated);
    } else {
      const newState = IntegrationStateEntity.create({
        moduleId: ModuleId.reconstruct(moduleId),
        status,
        metadata: metadata ?? {},
      });
      return this.repository.createState(newState);
    }
  }

  /**
   * Find integration state by module ID.
   */
  async findStateByModuleId(moduleId: string): Promise<IntegrationState | null> {
    return this.repository.findStateByModuleId(ModuleId.reconstruct(moduleId));
  }

  /**
   * List integration states.
   */
  async listStates(params?: PaginationParams, filters?: StateFilterParams): Promise<PaginatedResult<IntegrationState>> {
    return this.repository.listStates(params ?? { page: 1, pageSize: 100 }, filters);
  }

  // ============ Snapshot Operations ============

  /**
   * Create an integration snapshot.
   */
  async createSnapshot(metadata?: Record<string, unknown>): Promise<IntegrationSnapshot> {
    const modules = getAllModuleEntities();

    const registeredModules = modules.map((m) => m.moduleId.value);
    const healthyModules = modules
      .filter((m) => m.status === 'active')
      .map((m) => m.moduleId.value);
    const failedModules = modules
      .filter((m) => m.status === 'error')
      .map((m) => m.moduleId.value);

    const snapshot = IntegrationSnapshotEntity.create({
      registeredModules,
      healthyModules,
      failedModules,
      metadata: metadata ?? {},
    });

    return this.repository.createSnapshot(snapshot);
  }

  /**
   * Find the latest snapshot.
   */
  async findLatestSnapshot(): Promise<IntegrationSnapshot | null> {
    return this.repository.findLatestSnapshot();
  }

  /**
   * Find a snapshot by ID.
   */
  async findSnapshotById(id: string): Promise<IntegrationSnapshot | null> {
    return this.repository.findSnapshotById(SnapshotId.reconstruct(id));
  }

  /**
   * List snapshots with pagination.
   */
  async listSnapshots(params?: PaginationParams): Promise<PaginatedResult<IntegrationSnapshot>> {
    return this.repository.listSnapshots(params ?? { page: 1, pageSize: 10 });
  }

  /**
   * Cleanup old snapshots.
   */
  async cleanupOldSnapshots(keepCount: number): Promise<void> {
    const validation = SnapshotValidator.validateKeepCount(keepCount);
    if (!validation.isValid) {
      throw new Error(validation.errors.join('; '));
    }
    return this.repository.cleanupOldSnapshots(keepCount);
  }

  // ============ System Summary ============

  /**
   * Get integration summary.
   */
  async getIntegrationSummary(): Promise<IntegrationSummary> {
    const latestSnapshot = await this.repository.findLatestSnapshot();
    const allModules = await this.repository.listModules({ page: 1, pageSize: 1000 });

    const healthyCount = allModules.items.filter((m) => m.status === 'active').length;
    const failedCount = allModules.items.filter((m) => m.status === 'error').length;
    const totalCount = allModules.items.length;

    const failedModuleDetails: Array<{ name: string; error: string }> = [];
    for (const module of allModules.items.filter((m) => m.status === 'error')) {
      const state = await this.repository.findStateByModuleId(module.moduleId);
      failedModuleDetails.push({
        name: module.moduleName,
        error: state?.metadata?.errorMessage as string ?? 'Unknown error',
      });
    }

    return {
      totalModules: totalCount,
      healthyModules: healthyCount,
      failedModules: failedCount,
      healthPercentage: totalCount > 0 ? (healthyCount / totalCount) * 100 : 100,
      lastSnapshot: latestSnapshot ?? undefined,
      registeredModules: allModules.items,
      failedModuleDetails,
    };
  }
}
