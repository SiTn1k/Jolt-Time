/**
 * IDevOpsRepository Interface
 *
 * Interface defining the contract for DevOps persistence.
 * All DevOpsRepository implementations must adhere to this interface.
 */

import type { Deployment } from '../entities/Deployment';
import type { Environment } from '../entities/Environment';
import type { InfrastructureNode } from '../entities/InfrastructureNode';
import type { DeploymentId } from '../value-objects/DeploymentId';
import type { EnvironmentId } from '../value-objects/EnvironmentId';
import type { NodeId } from '../value-objects/NodeId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying deployments.
 */
export interface DeploymentFilterParams {
  /** Filter by environment ID */
  environmentId?: string;

  /** Filter by status */
  status?: string;

  /** Filter by version */
  version?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying environments.
 */
export interface EnvironmentFilterParams {
  /** Filter by type */
  type?: string;

  /** Filter by status */
  status?: string;

  /** Filter by region */
  region?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying infrastructure nodes.
 */
export interface InfrastructureNodeFilterParams {
  /** Filter by node type */
  nodeType?: string;

  /** Filter by status */
  status?: string;

  /** Filter by region */
  region?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * DevOps repository interface.
 * Defines all data access operations for DevOps entities.
 */
export interface IDevOpsRepository {
  // Deployment operations

  /**
   * Creates a new deployment.
   */
  createDeployment(deployment: Deployment): Promise<Deployment>;

  /**
   * Finds a deployment by its ID.
   */
  findDeploymentById(id: DeploymentId): Promise<Deployment | null>;

  /**
   * Finds deployments by environment ID.
   */
  findDeploymentsByEnvironmentId(environmentId: string): Promise<Deployment[]>;

  /**
   * Updates an existing deployment.
   */
  updateDeployment(deployment: Deployment): Promise<Deployment>;

  /**
   * Deletes a deployment.
   */
  deleteDeployment(id: DeploymentId): Promise<void>;

  /**
   * Lists deployments with pagination and filtering.
   */
  listDeployments(
    params: PaginationParams,
    filters?: DeploymentFilterParams
  ): Promise<PaginatedResult<Deployment>>;

  /**
   * Counts total deployments with optional filtering.
   */
  countDeployments(filters?: DeploymentFilterParams): Promise<number>;

  // Environment operations

  /**
   * Creates a new environment.
   */
  createEnvironment(environment: Environment): Promise<Environment>;

  /**
   * Finds an environment by its ID.
   */
  findEnvironmentById(id: EnvironmentId): Promise<Environment | null>;

  /**
   * Finds an environment by name.
   */
  findEnvironmentByName(name: string): Promise<Environment | null>;

  /**
   * Updates an existing environment.
   */
  updateEnvironment(environment: Environment): Promise<Environment>;

  /**
   * Deletes an environment.
   */
  deleteEnvironment(id: EnvironmentId): Promise<void>;

  /**
   * Lists environments with pagination and filtering.
   */
  listEnvironments(
    params: PaginationParams,
    filters?: EnvironmentFilterParams
  ): Promise<PaginatedResult<Environment>>;

  /**
   * Counts total environments with optional filtering.
   */
  countEnvironments(filters?: EnvironmentFilterParams): Promise<number>;

  // InfrastructureNode operations

  /**
   * Creates a new infrastructure node.
   */
  createInfrastructureNode(node: InfrastructureNode): Promise<InfrastructureNode>;

  /**
   * Finds an infrastructure node by its ID.
   */
  findInfrastructureNodeById(id: NodeId): Promise<InfrastructureNode | null>;

  /**
   * Finds infrastructure nodes by region.
   */
  findInfrastructureNodesByRegion(region: string): Promise<InfrastructureNode[]>;

  /**
   * Finds infrastructure nodes by type.
   */
  findInfrastructureNodesByType(nodeType: string): Promise<InfrastructureNode[]>;

  /**
   * Updates an existing infrastructure node.
   */
  updateInfrastructureNode(node: InfrastructureNode): Promise<InfrastructureNode>;

  /**
   * Deletes an infrastructure node.
   */
  deleteInfrastructureNode(id: NodeId): Promise<void>;

  /**
   * Lists infrastructure nodes with pagination and filtering.
   */
  listInfrastructureNodes(
    params: PaginationParams,
    filters?: InfrastructureNodeFilterParams
  ): Promise<PaginatedResult<InfrastructureNode>>;

  /**
   * Counts total infrastructure nodes with optional filtering.
   */
  countInfrastructureNodes(filters?: InfrastructureNodeFilterParams): Promise<number>;
}