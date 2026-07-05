/**
 * Environment Manager
 *
 * Handles environment lifecycle management.
 * Supports Development, Testing, Staging, Production environments.
 * DevOps NEVER modifies gameplay - only registers and tracks environments.
 */

import type { IDevOpsRepository } from '../interfaces/IDevOpsRepository';
import { Environment, EnvironmentId, type EnvironmentConfiguration } from '../entities/Environment';
import { EnvironmentType } from '../types/EnvironmentType';
import { createLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';

/**
 * Environment status information.
 */
export interface EnvironmentStatus {
  environmentId: string;
  name: string;
  type: EnvironmentType;
  isActive: boolean;
  deploymentCount: number;
  lastDeploymentAt: Date | null;
}

/**
 * Environment validation result.
 */
export interface EnvironmentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Environment transition result.
 */
export interface EnvironmentTransitionResult {
  success: boolean;
  environment?: Environment;
  error?: string;
}

/**
 * Environment Manager Interface
 */
export interface IEnvironmentManager {
  // Validation
  validateEnvironment(params: {
    name?: string;
    type?: EnvironmentType;
    configuration?: EnvironmentConfiguration;
  }): EnvironmentValidationResult;

  // Lifecycle
  createEnvironment(params: {
    name: string;
    type: EnvironmentType;
    configuration?: EnvironmentConfiguration;
    metadata?: { owner?: string; costCenter?: string; tags?: string[] };
  }): Promise<Environment>;

  activateEnvironment(environmentId: string): Promise<EnvironmentTransitionResult>;
  deactivateEnvironment(environmentId: string): Promise<EnvironmentTransitionResult>;

  // Queries
  getEnvironment(environmentId: string): Promise<Environment | null>;
  getEnvironmentByName(name: string): Promise<Environment | null>;
  getEnvironmentsByType(type: EnvironmentType): Promise<Environment[]>;
  getEnvironmentStatus(environmentId: string): Promise<EnvironmentStatus | null>;
  getAllEnvironmentStatuses(): Promise<EnvironmentStatus[]>;
}

/**
 * Environment Manager implementation.
 */
export class EnvironmentManager implements IEnvironmentManager {
  private readonly repository: IDevOpsRepository;
  private readonly logger: ILogger;

  constructor(repository: IDevOpsRepository, logger?: ILogger) {
    this.repository = repository;
    this.logger = logger ?? createLogger('EnvironmentManager');
  }

  /**
   * Validates environment data.
   */
  validateEnvironment(params: {
    name?: string;
    type?: EnvironmentType;
    configuration?: EnvironmentConfiguration;
  }): EnvironmentValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Name validation
    if (!params.name) {
      errors.push('Name is required');
    } else {
      if (!/^[a-zA-Z0-9][a-zA-Z0-9-_]*[a-zA-Z0-9]$/.test(params.name)) {
        errors.push('Name must be 2-50 alphanumeric characters, starting and ending with alphanumeric');
      }
      if (params.name.length < 2 || params.name.length > 50) {
        errors.push('Name must be between 2 and 50 characters');
      }
    }

    // Type validation
    if (!params.type) {
      errors.push('Type is required');
    } else if (!Object.values(EnvironmentType).includes(params.type)) {
      errors.push(`Type must be one of: ${Object.values(EnvironmentType).join(', ')}`);
    }

    // Production warnings
    if (params.type === EnvironmentType.PRODUCTION) {
      if (!params.configuration?.monitoringEnabled) {
        warnings.push('Production environment should have monitoring enabled');
      }
      if (!params.configuration?.backupEnabled) {
        warnings.push('Production environment should have backup enabled');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Creates a new environment.
   */
  async createEnvironment(params: {
    name: string;
    type: EnvironmentType;
    configuration?: EnvironmentConfiguration;
    metadata?: { owner?: string; costCenter?: string; tags?: string[] };
  }): Promise<Environment> {
    const validation = this.validateEnvironment(params);
    if (!validation.isValid) {
      throw new Error(`Environment validation failed: ${validation.errors.join('; ')}`);
    }

    if (validation.warnings.length > 0) {
      this.logger.warn('Environment validation warnings', { warnings: validation.warnings });
    }

    // Check for duplicate name
    const existing = await this.repository.findEnvironmentByName(params.name);
    if (existing) {
      throw new Error(`Environment with name '${params.name}' already exists`);
    }

    const environment = Environment.create({
      environmentId: EnvironmentId.generate(),
      name: params.name,
      type: params.type,
      configuration: params.configuration,
      metadata: params.metadata ?? {},
    });

    const saved = await this.repository.createEnvironment(environment);

    this.logger.info('Environment created', {
      environmentId: saved.environmentId.value,
      name: saved.name,
      type: saved.type,
    });

    return saved;
  }

  /**
   * Activates an environment.
   */
  async activateEnvironment(environmentId: string): Promise<EnvironmentTransitionResult> {
    try {
      const id = EnvironmentId.reconstruct(environmentId);
      const environment = await this.repository.findEnvironmentById(id);

      if (!environment) {
        return { success: false, error: 'Environment not found' };
      }

      if (environment.status === 'active') {
        return { success: false, error: 'Environment is already active' };
      }

      const updated = environment.copyWith({ status: 'active' });
      const saved = await this.repository.updateEnvironment(updated);

      this.logger.info('Environment activated', {
        environmentId: saved.environmentId.value,
        name: saved.name,
      });

      return { success: true, environment: saved };
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error('Failed to activate environment', error as Error, { environmentId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Deactivates an environment.
   */
  async deactivateEnvironment(environmentId: string): Promise<EnvironmentTransitionResult> {
    try {
      const id = EnvironmentId.reconstruct(environmentId);
      const environment = await this.repository.findEnvironmentById(id);

      if (!environment) {
        return { success: false, error: 'Environment not found' };
      }

      if (environment.status === 'inactive') {
        return { success: false, error: 'Environment is already inactive' };
      }

      const updated = environment.copyWith({ status: 'inactive' });
      const saved = await this.repository.updateEnvironment(updated);

      this.logger.info('Environment deactivated', {
        environmentId: saved.environmentId.value,
        name: saved.name,
      });

      return { success: true, environment: saved };
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error('Failed to deactivate environment', error as Error, { environmentId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets an environment by ID.
   */
  async getEnvironment(environmentId: string): Promise<Environment | null> {
    try {
      const id = EnvironmentId.reconstruct(environmentId);
      return await this.repository.findEnvironmentById(id);
    } catch (error) {
      this.logger.error('Failed to get environment', error as Error, { environmentId });
      return null;
    }
  }

  /**
   * Gets an environment by name.
   */
  async getEnvironmentByName(name: string): Promise<Environment | null> {
    try {
      return await this.repository.findEnvironmentByName(name);
    } catch (error) {
      this.logger.error('Failed to get environment by name', error as Error, { name });
      return null;
    }
  }

  /**
   * Gets environments by type.
   */
  async getEnvironmentsByType(type: EnvironmentType): Promise<Environment[]> {
    try {
      const { items } = await this.repository.listEnvironments(
        { page: 1, pageSize: 100 },
        { type }
      );
      return items;
    } catch (error) {
      this.logger.error('Failed to get environments by type', error as Error, { type });
      return [];
    }
  }

  /**
   * Gets environment status including deployment count.
   */
  async getEnvironmentStatus(environmentId: string): Promise<EnvironmentStatus | null> {
    try {
      const id = EnvironmentId.reconstruct(environmentId);
      const environment = await this.repository.findEnvironmentById(id);

      if (!environment) {
        return null;
      }

      const deployments = await this.repository.findDeploymentsByEnvironmentId(environmentId);
      const lastDeployment = deployments[0] ?? null;

      return {
        environmentId,
        name: environment.name,
        type: environment.type,
        isActive: environment.status === 'active',
        deploymentCount: deployments.length,
        lastDeploymentAt: lastDeployment?.startedAt ?? null,
      };
    } catch (error) {
      this.logger.error('Failed to get environment status', error as Error, { environmentId });
      return null;
    }
  }

  /**
   * Gets status of all environments.
   */
  async getAllEnvironmentStatuses(): Promise<EnvironmentStatus[]> {
    try {
      const { items: environments } = await this.repository.listEnvironments(
        { page: 1, pageSize: 100 },
        {}
      );

      const statuses: EnvironmentStatus[] = [];

      for (const env of environments) {
        const deployments = await this.repository.findDeploymentsByEnvironmentId(env.environmentId.value);
        const lastDeployment = deployments[0] ?? null;

        statuses.push({
          environmentId: env.environmentId.value,
          name: env.name,
          type: env.type,
          isActive: env.status === 'active',
          deploymentCount: deployments.length,
          lastDeploymentAt: lastDeployment?.startedAt ?? null,
        });
      }

      return statuses;
    } catch (error) {
      this.logger.error('Failed to get all environment statuses', error as Error);
      return [];
    }
  }
}
