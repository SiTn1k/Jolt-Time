/**
 * DevOps Service
 *
 * Main service for DevOps operations.
 * DevOps ONLY registers, validates, tracks, stores operational metadata.
 * DevOps NEVER deploys, runs Docker, or modifies gameplay.
 */

import type { IDevOpsRepository } from '../interfaces/IDevOpsRepository';
import { Deployment, DeploymentId } from '../entities/Deployment';
import { Environment, EnvironmentId } from '../entities/Environment';
import { InfrastructureNode, NodeId } from '../entities/InfrastructureNode';
import { DeploymentStatus } from '../types/DeploymentStatus';
import { EnvironmentType } from '../types/EnvironmentType';
import { InfrastructureType } from '../types/InfrastructureType';
import type { DeploymentMetadata } from '../types/DeploymentMetadata';
import type { EnvironmentConfiguration } from '../entities/Environment';
import type { InfrastructureNodeMetadata } from '../entities/InfrastructureNode';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { DeploymentFilterParams, EnvironmentFilterParams, InfrastructureNodeFilterParams } from '../interfaces/IDevOpsRepository';
import { createLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';
import { createDeploymentCreatedEvent } from '../events/DeploymentCreated.event';
import { createEnvironmentRegisteredEvent } from '../events/EnvironmentRegistered.event';
import { createInfrastructureNodeAddedEvent } from '../events/InfrastructureNodeAdded.event';
import type { IEventBus } from '../../../core/events/interfaces/IEventBus';

/**
 * DevOps Service Interface
 */
export interface IDevOpsService {
  // Deployment Operations
  registerDeployment(params: {
    version: string;
    environmentId: string;
    metadata?: DeploymentMetadata;
  }): Promise<Deployment>;

  getDeployment(deploymentId: string): Promise<Deployment | null>;
  getDeploymentSummary(): Promise<DeploymentSummary>;
  listDeployments(params: PaginationParams, filters?: DeploymentFilterParams): Promise<PaginatedResult<Deployment>>;

  // Environment Operations
  registerEnvironment(params: {
    name: string;
    type: EnvironmentType;
    configuration?: EnvironmentConfiguration;
    metadata?: { owner?: string; costCenter?: string; tags?: string[] };
  }): Promise<Environment>;

  getEnvironment(environmentId: string): Promise<Environment | null>;
  getEnvironmentByName(name: string): Promise<Environment | null>;
  getEnvironmentSummary(): Promise<EnvironmentSummary>;
  listEnvironments(params: PaginationParams, filters?: EnvironmentFilterParams): Promise<PaginatedResult<Environment>>;

  // Infrastructure Operations
  registerInfrastructureNode(params: {
    nodeName: string;
    nodeType: InfrastructureType;
    region: string;
    metadata?: InfrastructureNodeMetadata;
  }): Promise<InfrastructureNode>;

  getInfrastructureNode(nodeId: string): Promise<InfrastructureNode | null>;
  getInfrastructureSummary(): Promise<InfrastructureSummary>;
  listInfrastructureNodes(params: PaginationParams, filters?: InfrastructureNodeFilterParams): Promise<PaginatedResult<InfrastructureNode>>;

  // Statistics
  getFullSummary(): Promise<DevOpsSummary>;
}

/**
 * Deployment summary statistics.
 */
export interface DeploymentSummary {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  failed: number;
  byEnvironment: Record<string, number>;
}

/**
 * Environment summary statistics.
 */
export interface EnvironmentSummary {
  total: number;
  byType: Record<EnvironmentType, number>;
  byStatus: Record<string, number>;
}

/**
 * Infrastructure summary statistics.
 */
export interface InfrastructureSummary {
  total: number;
  byType: Record<InfrastructureType, number>;
  byStatus: Record<string, number>;
  byRegion: Record<string, number>;
}

/**
 * Full DevOps summary.
 */
export interface DevOpsSummary {
  deployments: DeploymentSummary;
  environments: EnvironmentSummary;
  infrastructure: InfrastructureSummary;
  lastUpdated: Date;
}

/**
 * DevOps Service implementation.
 */
export class DevOpsService implements IDevOpsService {
  private readonly repository: IDevOpsRepository;
  private readonly logger: ILogger;
  private eventBus?: IEventBus;

  /**
   * Creates a new DevOpsService instance.
   */
  constructor(repository: IDevOpsRepository, eventBus?: IEventBus, logger?: ILogger) {
    this.repository = repository;
    this.eventBus = eventBus;
    this.logger = logger ?? createLogger('DevOpsService');
  }

  /**
   * Sets the event bus for publishing domain events.
   */
  setEventBus(eventBus: IEventBus): void {
    this.eventBus = eventBus;
  }

  // ============ Deployment Operations ============

  /**
   * Registers a new deployment.
   */
  async registerDeployment(params: {
    version: string;
    environmentId: string;
    metadata?: DeploymentMetadata;
  }): Promise<Deployment> {
    try {
      const deployment = Deployment.create({
        deploymentId: DeploymentId.generate(),
        version: params.version,
        environmentId: params.environmentId,
        metadata: params.metadata,
      });

      const saved = await this.repository.createDeployment(deployment);

      // Publish event
      if (this.eventBus) {
        const event = createDeploymentCreatedEvent({
          deploymentId: saved.deploymentId,
          version: saved.version,
          environmentId: saved.environmentId,
        });
        await this.eventBus.publish(event);
      }

      this.logger.info('Deployment registered', {
        deploymentId: saved.deploymentId.value,
        version: saved.version,
        environmentId: saved.environmentId,
      });

      return saved;
    } catch (error) {
      this.logger.error('Failed to register deployment', error as Error, {
        version: params.version,
        environmentId: params.environmentId,
      });
      throw error;
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
   * Gets deployment summary statistics.
   */
  async getDeploymentSummary(): Promise<DeploymentSummary> {
    try {
      const [total, pending, inProgress, completed, failed] = await Promise.all([
        this.repository.countDeployments(),
        this.repository.countDeployments({ status: DeploymentStatus.PENDING }),
        this.repository.countDeployments({ status: DeploymentStatus.IN_PROGRESS }),
        this.repository.countDeployments({ status: DeploymentStatus.COMPLETED }),
        this.repository.countDeployments({ status: DeploymentStatus.FAILED }),
      ]);

      // Get deployments to group by environment
      const { items: deployments } = await this.repository.listDeployments(
        { page: 1, pageSize: 1000 },
        {}
      );

      const byEnvironment: Record<string, number> = {};
      for (const d of deployments) {
        byEnvironment[d.environmentId] = (byEnvironment[d.environmentId] || 0) + 1;
      }

      return {
        total,
        pending,
        inProgress,
        completed,
        failed,
        byEnvironment,
      };
    } catch (error) {
      this.logger.error('Failed to get deployment summary', error as Error);
      return {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        failed: 0,
        byEnvironment: {},
      };
    }
  }

  /**
   * Lists deployments with pagination and filtering.
   */
  async listDeployments(
    params: PaginationParams,
    filters?: DeploymentFilterParams
  ): Promise<PaginatedResult<Deployment>> {
    return this.repository.listDeployments(params, filters);
  }

  // ============ Environment Operations ============

  /**
   * Registers a new environment.
   */
  async registerEnvironment(params: {
    name: string;
    type: EnvironmentType;
    configuration?: EnvironmentConfiguration;
    metadata?: { owner?: string; costCenter?: string; tags?: string[] };
  }): Promise<Environment> {
    try {
      const environment = Environment.create({
        environmentId: EnvironmentId.generate(),
        name: params.name,
        type: params.type,
        configuration: params.configuration,
        metadata: params.metadata ?? {},
      });

      const saved = await this.repository.createEnvironment(environment);

      // Publish event
      if (this.eventBus) {
        const event = createEnvironmentRegisteredEvent({
          environmentId: saved.environmentId,
          name: saved.name,
          type: saved.type,
        });
        await this.eventBus.publish(event);
      }

      this.logger.info('Environment registered', {
        environmentId: saved.environmentId.value,
        name: saved.name,
        type: saved.type,
      });

      return saved;
    } catch (error) {
      this.logger.error('Failed to register environment', error as Error, {
        name: params.name,
        type: params.type,
      });
      throw error;
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
   * Gets environment summary statistics.
   */
  async getEnvironmentSummary(): Promise<EnvironmentSummary> {
    try {
      const total = await this.repository.countEnvironments();

      const [devCount, testCount, stagingCount, prodCount, activeCount, inactiveCount] = await Promise.all([
        this.repository.countEnvironments({ type: EnvironmentType.DEVELOPMENT }),
        this.repository.countEnvironments({ type: EnvironmentType.TESTING }),
        this.repository.countEnvironments({ type: EnvironmentType.STAGING }),
        this.repository.countEnvironments({ type: EnvironmentType.PRODUCTION }),
        this.repository.countEnvironments({ status: 'active' }),
        this.repository.countEnvironments({ status: 'inactive' }),
      ]);

      return {
        total,
        byType: {
          [EnvironmentType.DEVELOPMENT]: devCount,
          [EnvironmentType.TESTING]: testCount,
          [EnvironmentType.STAGING]: stagingCount,
          [EnvironmentType.PRODUCTION]: prodCount,
        },
        byStatus: {
          active: activeCount,
          inactive: inactiveCount,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get environment summary', error as Error);
      return {
        total: 0,
        byType: {
          [EnvironmentType.DEVELOPMENT]: 0,
          [EnvironmentType.TESTING]: 0,
          [EnvironmentType.STAGING]: 0,
          [EnvironmentType.PRODUCTION]: 0,
        },
        byStatus: { active: 0, inactive: 0 },
      };
    }
  }

  /**
   * Lists environments with pagination and filtering.
   */
  async listEnvironments(
    params: PaginationParams,
    filters?: EnvironmentFilterParams
  ): Promise<PaginatedResult<Environment>> {
    return this.repository.listEnvironments(params, filters);
  }

  // ============ Infrastructure Operations ============

  /**
   * Registers a new infrastructure node.
   */
  async registerInfrastructureNode(params: {
    nodeName: string;
    nodeType: InfrastructureType;
    region: string;
    metadata?: InfrastructureNodeMetadata;
  }): Promise<InfrastructureNode> {
    try {
      const node = InfrastructureNode.create({
        nodeId: NodeId.generate(),
        nodeName: params.nodeName,
        nodeType: params.nodeType,
        region: params.region,
        metadata: params.metadata,
      });

      const saved = await this.repository.createInfrastructureNode(node);

      // Publish event
      if (this.eventBus) {
        const event = createInfrastructureNodeAddedEvent({
          nodeId: saved.nodeId,
          nodeName: saved.nodeName,
          nodeType: saved.nodeType,
          region: saved.region,
        });
        await this.eventBus.publish(event);
      }

      this.logger.info('Infrastructure node registered', {
        nodeId: saved.nodeId.value,
        nodeName: saved.nodeName,
        nodeType: saved.nodeType,
        region: saved.region,
      });

      return saved;
    } catch (error) {
      this.logger.error('Failed to register infrastructure node', error as Error, {
        nodeName: params.nodeName,
        nodeType: params.nodeType,
        region: params.region,
      });
      throw error;
    }
  }

  /**
   * Gets an infrastructure node by ID.
   */
  async getInfrastructureNode(nodeId: string): Promise<InfrastructureNode | null> {
    try {
      const id = NodeId.reconstruct(nodeId);
      return await this.repository.findInfrastructureNodeById(id);
    } catch (error) {
      this.logger.error('Failed to get infrastructure node', error as Error, { nodeId });
      return null;
    }
  }

  /**
   * Gets infrastructure summary statistics.
   */
  async getInfrastructureSummary(): Promise<InfrastructureSummary> {
    try {
      const total = await this.repository.countInfrastructureNodes();

      // Get all nodes to calculate by-type, by-status, by-region
      const { items: nodes } = await this.repository.listInfrastructureNodes(
        { page: 1, pageSize: 1000 },
        {}
      );

      const byType: Record<InfrastructureType, number> = {} as Record<InfrastructureType, number>;
      const byStatus: Record<string, number> = {};
      const byRegion: Record<string, number> = {};

      for (const node of nodes) {
        byType[node.nodeType] = (byType[node.nodeType] || 0) + 1;
        byStatus[node.status] = (byStatus[node.status] || 0) + 1;
        byRegion[node.region] = (byRegion[node.region] || 0) + 1;
      }

      return { total, byType, byStatus, byRegion };
    } catch (error) {
      this.logger.error('Failed to get infrastructure summary', error as Error);
      return {
        total: 0,
        byType: {} as Record<InfrastructureType, number>,
        byStatus: {},
        byRegion: {},
      };
    }
  }

  /**
   * Lists infrastructure nodes with pagination and filtering.
   */
  async listInfrastructureNodes(
    params: PaginationParams,
    filters?: InfrastructureNodeFilterParams
  ): Promise<PaginatedResult<InfrastructureNode>> {
    return this.repository.listInfrastructureNodes(params, filters);
  }

  // ============ Statistics ============

  /**
   * Gets full DevOps summary.
   */
  async getFullSummary(): Promise<DevOpsSummary> {
    const [deployments, environments, infrastructure] = await Promise.all([
      this.getDeploymentSummary(),
      this.getEnvironmentSummary(),
      this.getInfrastructureSummary(),
    ]);

    return {
      deployments,
      environments,
      infrastructure,
      lastUpdated: new Date(),
    };
  }
}
