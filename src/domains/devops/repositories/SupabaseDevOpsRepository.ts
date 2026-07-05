/**
 * Supabase DevOps Repository
 *
 * Full production implementation of the DevOps repository.
 * Handles all persistence operations for Deployment, Environment, and InfrastructureNode entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { IDevOpsRepository, DeploymentFilterParams, EnvironmentFilterParams, InfrastructureNodeFilterParams } from '../interfaces/IDevOpsRepository';
import { Deployment, type DeploymentRecord } from '../entities/Deployment';
import { Environment, type EnvironmentRecord } from '../entities/Environment';
import { InfrastructureNode, type InfrastructureNodeRecord } from '../entities/InfrastructureNode';
import { DeploymentId } from '../value-objects/DeploymentId';
import { EnvironmentId } from '../value-objects/EnvironmentId';
import { NodeId } from '../value-objects/NodeId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { createLogger } from '../../../core/logging/logger.service';
import { SortOrder } from '../../../shared/constants';

/**
 * Supabase implementation of the DevOps Repository.
 * Implements IDevOpsRepository for DevOps entity persistence.
 * Uses standard error handling - logs and re-throws on failure.
 */
export class SupabaseDevOpsRepository implements IDevOpsRepository {
  private readonly deploymentsTableName = 'devops_deployments';
  private readonly environmentsTableName = 'devops_environments';
  private readonly nodesTableName = 'devops_infrastructure_nodes';
  private readonly _client: SupabaseClient;
  private readonly _logger = createLogger('SupabaseDevOpsRepository');

  /**
   * Creates a new SupabaseDevOpsRepository instance.
   * @param client Optional Supabase client
   */
  constructor(client?: SupabaseClient) {
    this._client = client as SupabaseClient;
  }

  /**
   * Safely executes a repository operation.
   * On failure, logs the error and re-throws.
   */
  private async executeOperation<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      this._logger.error(`Repository operation failed: ${operation}`, error as Error);
      throw error;
    }
  }

  /**
   * Calculates pagination metadata.
   */
  private calculatePagination(
    page: number,
    pageSize: number,
    total: number
  ): { totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean } {
    const totalPages = Math.ceil(total / pageSize);
    return {
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  // ============ Deployment Operations ============

  /**
   * Creates a new deployment.
   */
  async createDeployment(deployment: Deployment): Promise<Deployment> {
    return this.executeOperation('createDeployment', async () => {
      const record: DeploymentRecord = {
        deploymentId: deployment.deploymentId.value,
        version: deployment.version,
        environmentId: deployment.environmentId,
        status: deployment.status,
        startedAt: deployment.startedAt.toISOString(),
        completedAt: deployment.completedAt?.toISOString() ?? null,
        metadata: deployment.metadata,
        createdAt: deployment.createdAt.toISOString(),
        updatedAt: deployment.updatedAt.toISOString(),
      };

      const { data, error: supabaseError } = await this._client
        .from(this.deploymentsTableName)
        .insert(record)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Failed to create deployment: ${supabaseError.message}`);
      }

      return Deployment.fromStorage(data as DeploymentRecord);
    });
  }

  /**
   * Finds a deployment by its ID.
   */
  async findDeploymentById(id: DeploymentId): Promise<Deployment | null> {
    return this.executeOperation('findDeploymentById', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.deploymentsTableName)
        .select('*')
        .eq('deploymentId', id.value)
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find deployment: ${supabaseError.message}`);
      }

      return data ? Deployment.fromStorage(data as DeploymentRecord) : null;
    });
  }

  /**
   * Finds deployments by environment ID.
   */
  async findDeploymentsByEnvironmentId(environmentId: string): Promise<Deployment[]> {
    return this.executeOperation('findDeploymentsByEnvironmentId', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.deploymentsTableName)
        .select('*')
        .eq('environmentId', environmentId)
        .order('startedAt', { ascending: false });

      if (supabaseError) {
        throw new Error(`Failed to find deployments: ${supabaseError.message}`);
      }

      return (data || []).map((row) => Deployment.fromStorage(row as DeploymentRecord));
    });
  }

  /**
   * Updates an existing deployment.
   */
  async updateDeployment(deployment: Deployment): Promise<Deployment> {
    return this.executeOperation('updateDeployment', async () => {
      const record: Partial<DeploymentRecord> = {
        version: deployment.version,
        environmentId: deployment.environmentId,
        status: deployment.status,
        completedAt: deployment.completedAt?.toISOString() ?? null,
        metadata: deployment.metadata,
        updatedAt: deployment.updatedAt.toISOString(),
      };

      const { data, error: supabaseError } = await this._client
        .from(this.deploymentsTableName)
        .update(record)
        .eq('deploymentId', deployment.deploymentId.value)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Failed to update deployment: ${supabaseError.message}`);
      }

      return Deployment.fromStorage(data as DeploymentRecord);
    });
  }

  /**
   * Deletes a deployment.
   */
  async deleteDeployment(id: DeploymentId): Promise<void> {
    return this.executeOperation('deleteDeployment', async () => {
      const { error: supabaseError } = await this._client
        .from(this.deploymentsTableName)
        .delete()
        .eq('deploymentId', id.value);

      if (supabaseError) {
        throw new Error(`Failed to delete deployment: ${supabaseError.message}`);
      }
    });
  }

  /**
   * Lists deployments with pagination and filtering.
   */
  async listDeployments(
    params: PaginationParams,
    filters?: DeploymentFilterParams
  ): Promise<PaginatedResult<Deployment>> {
    return this.executeOperation('listDeployments', async () => {
      let query = this._client
        .from(this.deploymentsTableName)
        .select('*', { count: 'exact' });

      if (filters) {
        if (filters.environmentId) {
          query = query.eq('environmentId', filters.environmentId);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.version) {
          query = query.eq('version', filters.version);
        }
        if (filters.createdAfter) {
          query = query.gte('createdAt', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('createdAt', filters.createdBefore.toISOString());
        }
      }

      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);

      const sortColumn = params.sortBy || 'createdAt';
      const sortOrder = params.sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortColumn as keyof DeploymentRecord, { ascending: sortOrder === 'asc' });

      const { data, error: supabaseError, count } = await query;

      if (supabaseError) {
        throw new Error(`Failed to list deployments: ${supabaseError.message}`);
      }

      const total = count || 0;
      const pagination = this.calculatePagination(params.page, params.pageSize, total);

      return {
        items: (data || []).map((row) => Deployment.fromStorage(row as DeploymentRecord)),
        total,
        page: params.page,
        pageSize: params.pageSize,
        ...pagination,
      };
    });
  }

  /**
   * Counts total deployments with optional filtering.
   */
  async countDeployments(filters?: DeploymentFilterParams): Promise<number> {
    return this.executeOperation('countDeployments', async () => {
      let query = this._client
        .from(this.deploymentsTableName)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.environmentId) {
          query = query.eq('environmentId', filters.environmentId);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.version) {
          query = query.eq('version', filters.version);
        }
        if (filters.createdAfter) {
          query = query.gte('createdAt', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('createdAt', filters.createdBefore.toISOString());
        }
      }

      const { error: supabaseError, count } = await query;

      if (supabaseError) {
        throw new Error(`Failed to count deployments: ${supabaseError.message}`);
      }

      return count || 0;
    });
  }

  // ============ Environment Operations ============

  /**
   * Creates a new environment.
   */
  async createEnvironment(environment: Environment): Promise<Environment> {
    return this.executeOperation('createEnvironment', async () => {
      const record: EnvironmentRecord = {
        environmentId: environment.environmentId.value,
        name: environment.name,
        type: environment.type,
        status: environment.status,
        configuration: environment.configuration,
        metadata: environment.metadata,
        createdAt: environment.createdAt.toISOString(),
        updatedAt: environment.updatedAt.toISOString(),
      };

      const { data, error: supabaseError } = await this._client
        .from(this.environmentsTableName)
        .insert(record)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Failed to create environment: ${supabaseError.message}`);
      }

      return Environment.fromStorage(data as EnvironmentRecord);
    });
  }

  /**
   * Finds an environment by its ID.
   */
  async findEnvironmentById(id: EnvironmentId): Promise<Environment | null> {
    return this.executeOperation('findEnvironmentById', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.environmentsTableName)
        .select('*')
        .eq('environmentId', id.value)
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find environment: ${supabaseError.message}`);
      }

      return data ? Environment.fromStorage(data as EnvironmentRecord) : null;
    });
  }

  /**
   * Finds an environment by name.
   */
  async findEnvironmentByName(name: string): Promise<Environment | null> {
    return this.executeOperation('findEnvironmentByName', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.environmentsTableName)
        .select('*')
        .eq('name', name)
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find environment by name: ${supabaseError.message}`);
      }

      return data ? Environment.fromStorage(data as EnvironmentRecord) : null;
    });
  }

  /**
   * Updates an existing environment.
   */
  async updateEnvironment(environment: Environment): Promise<Environment> {
    return this.executeOperation('updateEnvironment', async () => {
      const record: Partial<EnvironmentRecord> = {
        name: environment.name,
        type: environment.type,
        status: environment.status,
        configuration: environment.configuration,
        metadata: environment.metadata,
        updatedAt: environment.updatedAt.toISOString(),
      };

      const { data, error: supabaseError } = await this._client
        .from(this.environmentsTableName)
        .update(record)
        .eq('environmentId', environment.environmentId.value)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Failed to update environment: ${supabaseError.message}`);
      }

      return Environment.fromStorage(data as EnvironmentRecord);
    });
  }

  /**
   * Deletes an environment.
   */
  async deleteEnvironment(id: EnvironmentId): Promise<void> {
    return this.executeOperation('deleteEnvironment', async () => {
      const { error: supabaseError } = await this._client
        .from(this.environmentsTableName)
        .delete()
        .eq('environmentId', id.value);

      if (supabaseError) {
        throw new Error(`Failed to delete environment: ${supabaseError.message}`);
      }
    });
  }

  /**
   * Lists environments with pagination and filtering.
   */
  async listEnvironments(
    params: PaginationParams,
    filters?: EnvironmentFilterParams
  ): Promise<PaginatedResult<Environment>> {
    return this.executeOperation('listEnvironments', async () => {
      let query = this._client
        .from(this.environmentsTableName)
        .select('*', { count: 'exact' });

      if (filters) {
        if (filters.type) {
          query = query.eq('type', filters.type);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.region) {
          query = query.eq('region', filters.region);
        }
        if (filters.createdAfter) {
          query = query.gte('createdAt', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('createdAt', filters.createdBefore.toISOString());
        }
      }

      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);

      const sortColumn = params.sortBy || 'createdAt';
      const sortOrder = params.sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortColumn as keyof EnvironmentRecord, { ascending: sortOrder === 'asc' });

      const { data, error: supabaseError, count } = await query;

      if (supabaseError) {
        throw new Error(`Failed to list environments: ${supabaseError.message}`);
      }

      const total = count || 0;
      const pagination = this.calculatePagination(params.page, params.pageSize, total);

      return {
        items: (data || []).map((row) => Environment.fromStorage(row as EnvironmentRecord)),
        total,
        page: params.page,
        pageSize: params.pageSize,
        ...pagination,
      };
    });
  }

  /**
   * Counts total environments with optional filtering.
   */
  async countEnvironments(filters?: EnvironmentFilterParams): Promise<number> {
    return this.executeOperation('countEnvironments', async () => {
      let query = this._client
        .from(this.environmentsTableName)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.type) {
          query = query.eq('type', filters.type);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.region) {
          query = query.eq('region', filters.region);
        }
        if (filters.createdAfter) {
          query = query.gte('createdAt', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('createdAt', filters.createdBefore.toISOString());
        }
      }

      const { error: supabaseError, count } = await query;

      if (supabaseError) {
        throw new Error(`Failed to count environments: ${supabaseError.message}`);
      }

      return count || 0;
    });
  }

  // ============ Infrastructure Node Operations ============

  /**
   * Creates a new infrastructure node.
   */
  async createInfrastructureNode(node: InfrastructureNode): Promise<InfrastructureNode> {
    return this.executeOperation('createInfrastructureNode', async () => {
      const record: InfrastructureNodeRecord = {
        nodeId: node.nodeId.value,
        nodeName: node.nodeName,
        nodeType: node.nodeType,
        status: node.status,
        region: node.region,
        metadata: node.metadata,
        createdAt: node.createdAt.toISOString(),
        updatedAt: node.updatedAt.toISOString(),
      };

      const { data, error: supabaseError } = await this._client
        .from(this.nodesTableName)
        .insert(record)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Failed to create infrastructure node: ${supabaseError.message}`);
      }

      return InfrastructureNode.fromStorage(data as InfrastructureNodeRecord);
    });
  }

  /**
   * Finds an infrastructure node by its ID.
   */
  async findInfrastructureNodeById(id: NodeId): Promise<InfrastructureNode | null> {
    return this.executeOperation('findInfrastructureNodeById', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.nodesTableName)
        .select('*')
        .eq('nodeId', id.value)
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find infrastructure node: ${supabaseError.message}`);
      }

      return data ? InfrastructureNode.fromStorage(data as InfrastructureNodeRecord) : null;
    });
  }

  /**
   * Finds infrastructure nodes by region.
   */
  async findInfrastructureNodesByRegion(region: string): Promise<InfrastructureNode[]> {
    return this.executeOperation('findInfrastructureNodesByRegion', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.nodesTableName)
        .select('*')
        .eq('region', region)
        .order('nodeName', { ascending: true });

      if (supabaseError) {
        throw new Error(`Failed to find infrastructure nodes by region: ${supabaseError.message}`);
      }

      return (data || []).map((row) => InfrastructureNode.fromStorage(row as InfrastructureNodeRecord));
    });
  }

  /**
   * Finds infrastructure nodes by type.
   */
  async findInfrastructureNodesByType(nodeType: string): Promise<InfrastructureNode[]> {
    return this.executeOperation('findInfrastructureNodesByType', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.nodesTableName)
        .select('*')
        .eq('nodeType', nodeType)
        .order('nodeName', { ascending: true });

      if (supabaseError) {
        throw new Error(`Failed to find infrastructure nodes by type: ${supabaseError.message}`);
      }

      return (data || []).map((row) => InfrastructureNode.fromStorage(row as InfrastructureNodeRecord));
    });
  }

  /**
   * Updates an existing infrastructure node.
   */
  async updateInfrastructureNode(node: InfrastructureNode): Promise<InfrastructureNode> {
    return this.executeOperation('updateInfrastructureNode', async () => {
      const record: Partial<InfrastructureNodeRecord> = {
        nodeName: node.nodeName,
        nodeType: node.nodeType,
        status: node.status,
        region: node.region,
        metadata: node.metadata,
        updatedAt: node.updatedAt.toISOString(),
      };

      const { data, error: supabaseError } = await this._client
        .from(this.nodesTableName)
        .update(record)
        .eq('nodeId', node.nodeId.value)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Failed to update infrastructure node: ${supabaseError.message}`);
      }

      return InfrastructureNode.fromStorage(data as InfrastructureNodeRecord);
    });
  }

  /**
   * Deletes an infrastructure node.
   */
  async deleteInfrastructureNode(id: NodeId): Promise<void> {
    return this.executeOperation('deleteInfrastructureNode', async () => {
      const { error: supabaseError } = await this._client
        .from(this.nodesTableName)
        .delete()
        .eq('nodeId', id.value);

      if (supabaseError) {
        throw new Error(`Failed to delete infrastructure node: ${supabaseError.message}`);
      }
    });
  }

  /**
   * Lists infrastructure nodes with pagination and filtering.
   */
  async listInfrastructureNodes(
    params: PaginationParams,
    filters?: InfrastructureNodeFilterParams
  ): Promise<PaginatedResult<InfrastructureNode>> {
    return this.executeOperation('listInfrastructureNodes', async () => {
      let query = this._client
        .from(this.nodesTableName)
        .select('*', { count: 'exact' });

      if (filters) {
        if (filters.nodeType) {
          query = query.eq('nodeType', filters.nodeType);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.region) {
          query = query.eq('region', filters.region);
        }
        if (filters.createdAfter) {
          query = query.gte('createdAt', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('createdAt', filters.createdBefore.toISOString());
        }
      }

      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);

      const sortColumn = params.sortBy || 'createdAt';
      const sortOrder = params.sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortColumn as keyof InfrastructureNodeRecord, { ascending: sortOrder === 'asc' });

      const { data, error: supabaseError, count } = await query;

      if (supabaseError) {
        throw new Error(`Failed to list infrastructure nodes: ${supabaseError.message}`);
      }

      const total = count || 0;
      const pagination = this.calculatePagination(params.page, params.pageSize, total);

      return {
        items: (data || []).map((row) => InfrastructureNode.fromStorage(row as InfrastructureNodeRecord)),
        total,
        page: params.page,
        pageSize: params.pageSize,
        ...pagination,
      };
    });
  }

  /**
   * Counts total infrastructure nodes with optional filtering.
   */
  async countInfrastructureNodes(filters?: InfrastructureNodeFilterParams): Promise<number> {
    return this.executeOperation('countInfrastructureNodes', async () => {
      let query = this._client
        .from(this.nodesTableName)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.nodeType) {
          query = query.eq('nodeType', filters.nodeType);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.region) {
          query = query.eq('region', filters.region);
        }
        if (filters.createdAfter) {
          query = query.gte('createdAt', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('createdAt', filters.createdBefore.toISOString());
        }
      }

      const { error: supabaseError, count } = await query;

      if (supabaseError) {
        throw new Error(`Failed to count infrastructure nodes: ${supabaseError.message}`);
      }

      return count || 0;
    });
  }
}