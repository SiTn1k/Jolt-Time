/**
 * Deployment Validation Service
 *
 * Comprehensive validation for deployments including:
 * - Version validation
 * - Environment validation
 * - Dependency validation
 * - Configuration validation
 */

import type { IDevOpsRepository } from '../interfaces/IDevOpsRepository';
import { Deployment } from '../entities/Deployment';
import { DeploymentStatus } from '../types/DeploymentStatus';
import type { DeploymentMetadata } from '../types/DeploymentMetadata';
import { EnvironmentType } from '../types/EnvironmentType';

/**
 * Version validation result.
 */
export interface VersionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Environment validation result.
 */
export interface EnvironmentValidationResult {
  isValid: boolean;
  environmentExists: boolean;
  environmentType?: EnvironmentType;
  errors: string[];
  warnings: string[];
}

/**
 * Dependency validation result.
 */
export interface DependencyValidationResult {
  isValid: boolean;
  missingDependencies: string[];
  errors: string[];
  warnings: string[];
}

/**
 * Configuration validation result.
 */
export interface ConfigurationValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Full deployment validation result.
 */
export interface FullDeploymentValidationResult {
  isValid: boolean;
  version: VersionValidationResult;
  environment: EnvironmentValidationResult;
  dependency: DependencyValidationResult;
  configuration: ConfigurationValidationResult;
  errors: string[];
  warnings: string[];
}

/**
 * Deployment Validation Service Interface
 */
export interface IDeploymentValidationService {
  // Individual validations
  validateVersion(version: string | null | undefined): VersionValidationResult;
  validateEnvironment(environmentId: string | null | undefined): Promise<EnvironmentValidationResult>;
  validateDependencies(metadata: DeploymentMetadata | null | undefined): DependencyValidationResult;
  validateConfiguration(metadata: DeploymentMetadata | null | undefined): ConfigurationValidationResult;

  // Full validation
  validateDeployment(params: {
    version?: string;
    environmentId?: string;
    metadata?: DeploymentMetadata;
  }): Promise<FullDeploymentValidationResult>;

  // Pre-deployment checks
  canDeployToEnvironment(environmentId: string): Promise<boolean>;
}

/**
 * Deployment Validation Service implementation.
 */
export class DeploymentValidationService implements IDeploymentValidationService {
  private readonly repository: IDevOpsRepository;

  /**
   * Creates a new DeploymentValidationService instance.
   */
  constructor(repository: IDevOpsRepository) {
    this.repository = repository;
  }

  /**
   * Validates a version string.
   */
  validateVersion(version: string | null | undefined): VersionValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!version) {
      errors.push('Version is required');
      return { isValid: false, errors, warnings };
    }

    if (typeof version !== 'string') {
      errors.push('Version must be a string');
      return { isValid: false, errors, warnings };
    }

    // Check format
    if (!/^[a-zA-Z0-9._-]+$/.test(version)) {
      errors.push('Version must contain only alphanumeric characters, dots, underscores, or hyphens');
    }

    // Check length
    if (version.length < 1) {
      errors.push('Version must be at least 1 character');
    }

    if (version.length > 100) {
      errors.push('Version must be 100 characters or less');
    }

    // Warnings for potentially problematic versions
    if (version.startsWith('.') || version.startsWith('-')) {
      warnings.push('Version should not start with a dot or hyphen');
    }

    if (version.endsWith('.') || version.endsWith('-')) {
      warnings.push('Version should not end with a dot or hyphen');
    }

    // Check for multiple consecutive dots or hyphens
    if (/\.\./.test(version) || /--/.test(version)) {
      warnings.push('Version should not contain consecutive dots or hyphens');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates an environment ID exists.
   */
  async validateEnvironment(environmentId: string | null | undefined): Promise<EnvironmentValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!environmentId) {
      errors.push('Environment ID is required');
      return { isValid: false, environmentExists: false, errors, warnings };
    }

    // UUID format check
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(environmentId)) {
      errors.push('Environment ID must be a valid UUID');
      return { isValid: false, environmentExists: false, errors, warnings };
    }

    try {
      const env = await this.repository.findEnvironmentById(
        // Reconstruct is not exposed, need to check repository method
        environmentId as any
      );

      if (!env) {
        errors.push(`Environment with ID '${environmentId}' does not exist`);
        return { isValid: false, environmentExists: false, errors, warnings };
      }

      // Warn about inactive environments
      if (env.status !== 'active') {
        warnings.push(`Environment '${env.name}' is currently inactive`);
      }

      return {
        isValid: errors.length === 0,
        environmentExists: true,
        environmentType: env.type,
        errors,
        warnings,
      };
    } catch (error) {
      errors.push('Failed to validate environment');
      return { isValid: false, environmentExists: false, errors, warnings };
    }
  }

  /**
   * Validates deployment dependencies.
   */
  validateDependencies(metadata: DeploymentMetadata | null | undefined): DependencyValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingDependencies: string[] = [];

    if (!metadata) {
      warnings.push('No metadata provided - dependency validation skipped');
      return { isValid: true, missingDependencies, errors, warnings };
    }

    // Check for required dependencies
    if (metadata.requiredServices) {
      for (const service of metadata.requiredServices) {
        if (!service || typeof service !== 'string') {
          missingDependencies.push(service || 'undefined');
        }
      }
    }

    // Warn about self-referencing dependencies
    if (metadata.commitSha) {
      warnings.push('Commit SHA provided - ensure it matches the deployment version');
    }

    // Warn about missing branch info for production
    if (metadata.branch && metadata.branch !== 'main' && metadata.branch !== 'master') {
      warnings.push('Deployment is not from main/master branch');
    }

    return {
      isValid: errors.length === 0,
      missingDependencies,
      errors,
      warnings,
    };
  }

  /**
   * Validates deployment configuration.
   */
  validateConfiguration(metadata: DeploymentMetadata | null | undefined): ConfigurationValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!metadata) {
      warnings.push('No metadata provided - configuration validation skipped');
      return { isValid: true, errors, warnings };
    }

    // Validate labels format
    if (metadata.labels) {
      for (const [key, value] of Object.entries(metadata.labels)) {
        if (!/^[a-zA-Z0-9][a-zA-Z0-9-_.]*$/.test(key)) {
          errors.push(`Invalid label key format: '${key}'`);
        }
        if (typeof value !== 'string') {
          errors.push(`Label '${key}' must have a string value`);
        }
      }
    }

    // Warn about production deployments without notes
    if (metadata.notes === undefined || metadata.notes === '') {
      warnings.push('No deployment notes provided');
    }

    // Validate commit SHA format if provided
    if (metadata.commitSha && !/^[a-f0-9]{40}$/i.test(metadata.commitSha)) {
      errors.push('Commit SHA must be a 40-character hexadecimal string');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Performs full deployment validation.
   */
  async validateDeployment(params: {
    version?: string;
    environmentId?: string;
    metadata?: DeploymentMetadata;
  }): Promise<FullDeploymentValidationResult> {
    const versionResult = this.validateVersion(params.version);
    const environmentResult = await this.validateEnvironment(params.environmentId);
    const dependencyResult = this.validateDependencies(params.metadata);
    const configurationResult = this.validateConfiguration(params.metadata);

    const allErrors = [
      ...versionResult.errors,
      ...environmentResult.errors,
      ...dependencyResult.errors,
      ...configurationResult.errors,
    ];

    const allWarnings = [
      ...versionResult.warnings,
      ...environmentResult.warnings,
      ...dependencyResult.warnings,
      ...configurationResult.warnings,
    ];

    return {
      isValid: allErrors.length === 0,
      version: versionResult,
      environment: environmentResult,
      dependency: dependencyResult,
      configuration: configurationResult,
      errors: allErrors,
      warnings: allWarnings,
    };
  }

  /**
   * Checks if a deployment can proceed to an environment.
   */
  async canDeployToEnvironment(environmentId: string): Promise<boolean> {
    const envResult = await this.validateEnvironment(environmentId);
    return envResult.isValid && envResult.environmentExists && envResult.environmentType !== undefined;
  }
}
