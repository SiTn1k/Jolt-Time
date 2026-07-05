/**
 * Deployment Engine
 *
 * Handles deployment lifecycle management.
 * Supports manual deployment, validation, state management, and history tracking.
 * DevOps NEVER deploys containers or runs Docker - only registers and tracks.
 */

import type { IDevOpsRepository } from '../interfaces/IDevOpsRepository';
import { Deployment, DeploymentId } from '../entities/Deployment';
import { DeploymentStatus } from '../types/DeploymentStatus';
import type { DeploymentMetadata } from '../types/DeploymentMetadata';
import { createLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';

/**
 * Deployment validation result.
 */
export interface DeploymentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Deployment transition result.
 */
export interface DeploymentTransitionResult {
  success: boolean;
  deployment?: Deployment;
  error?: string;
}

/**
 * Deployment history entry.
 */
export interface DeploymentHistoryEntry {
  deploymentId: string;
  version: string;
  environmentId: string;
  status: DeploymentStatus;
  startedAt: Date;
  completedAt: Date | null;
  durationSeconds: number | null;
}

/**
 * Deployment Engine Interface
 */
export interface IDeploymentEngine {
  // Validation
  validateDeployment(params: {
    version?: string;
    environmentId?: string;
    metadata?: DeploymentMetadata;
  }): DeploymentValidationResult;

  // Lifecycle
  startDeployment(params: {
    version: string;
    environmentId: string;
    metadata?: DeploymentMetadata;
  }): Promise<Deployment>;

  completeDeployment(deploymentId: string): Promise<DeploymentTransitionResult>;
  failDeployment(deploymentId: string, reason?: string): Promise<DeploymentTransitionResult>;
  cancelDeployment(deploymentId: string, reason?: string): Promise<DeploymentTransitionResult>;
  rollbackDeployment(deploymentId: string): Promise<DeploymentTransitionResult>;

  // Queries
  getDeployment(deploymentId: string): Promise<Deployment | null>;
  getDeploymentHistory(environmentId?: string, limit?: number): Promise<DeploymentHistoryEntry[]>;
  getActiveDeployments(): Promise<Deployment[]>;
}

/**
 * Deployment Engine implementation.
 */
export class DeploymentEngine implements IDeploymentEngine {
  private readonly repository: IDevOpsRepository;
  private readonly logger: ILogger;

  constructor(repository: IDevOpsRepository, logger?: ILogger) {
    this.repository = repository;
    this.logger = logger ?? createLogger('DeploymentEngine');
  }

  /**
   * Validates deployment data.
   */
  validateDeployment(params: {
    version?: string;
    environmentId?: string;
    metadata?: DeploymentMetadata;
  }): DeploymentValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Version validation
    if (!params.version) {
      errors.push('Version is required');
    } else if (!/^[a-zA-Z0-9._-]+$/.test(params.version)) {
      errors.push('Version must contain only alphanumeric characters, dots, underscores, or hyphens');
    } else if (params.version.length > 100) {
      errors.push('Version must be 100 characters or less');
    }

    // Environment ID validation
    if (!params.environmentId) {
      errors.push('Environment ID is required');
    } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(params.environmentId)) {
      errors.push('Environment ID must be a valid UUID');
    }

    // Metadata validation
    if (params.metadata) {
      if (params.metadata.commitSha && !/^[a-f0-9]{40}$/i.test(params.metadata.commitSha)) {
        warnings.push('Commit SHA should be a 40-character hexadecimal string');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Starts a new deployment.
   */
  async startDeployment(params: {
    version: string;
    environmentId: string;
    metadata?: DeploymentMetadata;
  }): Promise<Deployment> {
    const validation = this.validateDeployment(params);
    if (!validation.isValid) {
      throw new Error(`Deployment validation failed: ${validation.errors.join('; ')}`);
    }

    if (validation.warnings.length > 0) {
      this.logger.warn('Deployment validation warnings', { warnings: validation.warnings });
    }

    const deployment = Deployment.create({
      deploymentId: DeploymentId.generate(),
      version: params.version,
      environmentId: params.environmentId,
      metadata: params.metadata,
    });

    const saved = await this.repository.createDeployment(deployment);

    this.logger.info('Deployment started', {
      deploymentId: saved.deploymentId.value,
      version: saved.version,
      environmentId: saved.environmentId,
    });

    return saved;
  }

  /**
   * Completes a deployment.
   */
  async completeDeployment(deploymentId: string): Promise<DeploymentTransitionResult> {
    try {
      const id = DeploymentId.reconstruct(deploymentId);
      const deployment = await this.repository.findDeploymentById(id);

      if (!deployment) {
        return { success: false, error: 'Deployment not found' };
      }

      if (deployment.status !== DeploymentStatus.PENDING && deployment.status !== DeploymentStatus.IN_PROGRESS) {
        return { success: false, error: `Cannot complete deployment in ${deployment.status} status` };
      }

      const updated = deployment.copyWith({
        status: DeploymentStatus.COMPLETED,
        completedAt: new Date(),
      });

      const saved = await this.repository.updateDeployment(updated);

      this.logger.info('Deployment completed', {
        deploymentId: saved.deploymentId.value,
        version: saved.version,
      });

      return { success: true, deployment: saved };
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error('Failed to complete deployment', error as Error, { deploymentId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Marks a deployment as failed.
   */
  async failDeployment(deploymentId: string, reason?: string): Promise<DeploymentTransitionResult> {
    try {
      const id = DeploymentId.reconstruct(deploymentId);
      const deployment = await this.repository.findDeploymentById(id);

      if (!deployment) {
        return { success: false, error: 'Deployment not found' };
      }

      if (deployment.status === DeploymentStatus.COMPLETED || deployment.status === DeploymentStatus.ROLLED_BACK) {
        return { success: false, error: `Cannot fail deployment in ${deployment.status} status` };
      }

      const metadata = { ...deployment.metadata };
      if (reason) {
        metadata.failureReason = reason;
      }

      const updated = deployment.copyWith({
        status: DeploymentStatus.FAILED,
        completedAt: new Date(),
        metadata,
      });

      const saved = await this.repository.updateDeployment(updated);

      this.logger.info('Deployment marked as failed', {
        deploymentId: saved.deploymentId.value,
        reason,
      });

      return { success: true, deployment: saved };
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error('Failed to mark deployment as failed', error as Error, { deploymentId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Cancels a deployment.
   */
  async cancelDeployment(deploymentId: string, reason?: string): Promise<DeploymentTransitionResult> {
    try {
      const id = DeploymentId.reconstruct(deploymentId);
      const deployment = await this.repository.findDeploymentById(id);

      if (!deployment) {
        return { success: false, error: 'Deployment not found' };
      }

      if (deployment.status === DeploymentStatus.COMPLETED || deployment.status === DeploymentStatus.ROLLED_BACK) {
        return { success: false, error: `Cannot cancel deployment in ${deployment.status} status` };
      }

      const metadata = { ...deployment.metadata };
      if (reason) {
        metadata.cancelReason = reason;
      }

      const updated = deployment.copyWith({
        status: DeploymentStatus.CANCELLED,
        completedAt: new Date(),
        metadata,
      });

      const saved = await this.repository.updateDeployment(updated);

      this.logger.info('Deployment cancelled', {
        deploymentId: saved.deploymentId.value,
        reason,
      });

      return { success: true, deployment: saved };
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error('Failed to cancel deployment', error as Error, { deploymentId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Rolls back a deployment.
   */
  async rollbackDeployment(deploymentId: string): Promise<DeploymentTransitionResult> {
    try {
      const id = DeploymentId.reconstruct(deploymentId);
      const deployment = await this.repository.findDeploymentById(id);

      if (!deployment) {
        return { success: false, error: 'Deployment not found' };
      }

      if (deployment.status !== DeploymentStatus.COMPLETED) {
        return { success: false, error: 'Can only rollback completed deployments' };
      }

      const updated = deployment.copyWith({
        status: DeploymentStatus.ROLLED_BACK,
        metadata: { ...deployment.metadata, rolledBackAt: new Date().toISOString() },
      });

      const saved = await this.repository.updateDeployment(updated);

      this.logger.info('Deployment rolled back', {
        deploymentId: saved.deploymentId.value,
        version: saved.version,
      });

      return { success: true, deployment: saved };
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error('Failed to rollback deployment', error as Error, { deploymentId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets a deployment by ID.
   */
  async getDeployment(deploymentId: string): Promise<Deployment | null> {
    try {
      const id = DeploymentId.reconstruct(deploymentId);
      return await this.repository.findDeploymentById(id);
    } catch (error) {
      this.logger.error('Failed to get deployment', error as Error, { deploymentId });
      return null;
    }
  }

  /**
   * Gets deployment history.
   */
  async getDeploymentHistory(environmentId?: string, limit: number = 50): Promise<DeploymentHistoryEntry[]> {
    try {
      const { items } = await this.repository.listDeployments(
        { page: 1, pageSize: limit },
        environmentId ? { environmentId } : undefined
      );

      return items.map((d) => ({
        deploymentId: d.deploymentId.value,
        version: d.version,
        environmentId: d.environmentId,
        status: d.status,
        startedAt: d.startedAt,
        completedAt: d.completedAt,
        durationSeconds: d.completedAt
          ? Math.floor((d.completedAt.getTime() - d.startedAt.getTime()) / 1000)
          : null,
      }));
    } catch (error) {
      this.logger.error('Failed to get deployment history', error as Error);
      return [];
    }
  }

  /**
   * Gets active (non-terminal) deployments.
   */
  async getActiveDeployments(): Promise<Deployment[]> {
    try {
      const [pending, inProgress] = await Promise.all([
        this.repository.findDeploymentsByEnvironmentId(''), // Get all and filter
        Promise.resolve([] as Deployment[]),
      ]);

      // Actually, we need to get all active deployments
      const { items: allDeployments } = await this.repository.listDeployments(
        { page: 1, pageSize: 1000 },
        {}
      );

      return allDeployments.filter(
        (d) => d.status === DeploymentStatus.PENDING || d.status === DeploymentStatus.IN_PROGRESS
      );
    } catch (error) {
      this.logger.error('Failed to get active deployments', error as Error);
      return [];
    }
  }
}
