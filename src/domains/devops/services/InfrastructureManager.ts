/**
 * Infrastructure Manager
 *
 * Handles infrastructure node lifecycle management.
 * Supports node registration, status tracking, and region management.
 * DevOps NEVER deploys containers or runs Docker - only registers and tracks.
 */

import type { IDevOpsRepository } from '../interfaces/IDevOpsRepository';
import { InfrastructureNode, NodeId, type InfrastructureNodeMetadata } from '../entities/InfrastructureNode';
import { InfrastructureType } from '../types/InfrastructureType';
import { createLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';

/**
 * Node status information.
 */
export interface NodeStatus {
  nodeId: string;
  nodeName: string;
  nodeType: InfrastructureType;
  isHealthy: boolean;
  region: string;
  lastStatusUpdate: Date;
}

/**
 * Infrastructure validation result.
 */
export interface InfrastructureValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Infrastructure transition result.
 */
export interface InfrastructureTransitionResult {
  success: boolean;
  node?: InfrastructureNode;
  error?: string;
}

/**
 * Region metadata.
 */
export interface RegionMetadata {
  region: string;
  nodeCount: number;
  healthyNodeCount: number;
  nodeTypes: InfrastructureType[];
}

/**
 * Infrastructure Manager Interface
 */
export interface IInfrastructureManager {
  // Validation
  validateInfrastructureNode(params: {
    nodeName?: string;
    nodeType?: InfrastructureType;
    region?: string;
    metadata?: InfrastructureNodeMetadata;
  }): InfrastructureValidationResult;

  // Lifecycle
  registerNode(params: {
    nodeName: string;
    nodeType: InfrastructureType;
    region: string;
    metadata?: InfrastructureNodeMetadata;
  }): Promise<InfrastructureNode>;

  updateNodeStatus(nodeId: string, status: 'healthy' | 'unhealthy' | 'maintenance'): Promise<InfrastructureTransitionResult>;
  deregisterNode(nodeId: string): Promise<InfrastructureTransitionResult>;

  // Queries
  getNode(nodeId: string): Promise<InfrastructureNode | null>;
  getNodesByRegion(region: string): Promise<InfrastructureNode[]>;
  getNodesByType(type: InfrastructureType): Promise<InfrastructureNode[]>;
  getNodeStatus(nodeId: string): Promise<NodeStatus | null>;
  getAllNodeStatuses(): Promise<NodeStatus[]>;
  getRegionMetadata(region: string): Promise<RegionMetadata | null>;
  getAllRegionMetadata(): Promise<RegionMetadata[]>;
}

/**
 * Infrastructure Manager implementation.
 */
export class InfrastructureManager implements IInfrastructureManager {
  private readonly repository: IDevOpsRepository;
  private readonly logger: ILogger;

  constructor(repository: IDevOpsRepository, logger?: ILogger) {
    this.repository = repository;
    this.logger = logger ?? createLogger('InfrastructureManager');
  }

  /**
   * Validates infrastructure node data.
   */
  validateInfrastructureNode(params: {
    nodeName?: string;
    nodeType?: InfrastructureType;
    region?: string;
    metadata?: InfrastructureNodeMetadata;
  }): InfrastructureValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Node name validation
    if (!params.nodeName) {
      errors.push('Node name is required');
    } else {
      if (!/^[a-zA-Z0-9][a-zA-Z0-9-._]*[a-zA-Z0-9]$/.test(params.nodeName)) {
        errors.push('Node name must be 2-100 alphanumeric characters, starting and ending with alphanumeric');
      }
      if (params.nodeName.length < 2 || params.nodeName.length > 100) {
        errors.push('Node name must be between 2 and 100 characters');
      }
    }

    // Node type validation
    if (!params.nodeType) {
      errors.push('Node type is required');
    } else if (!Object.values(InfrastructureType).includes(params.nodeType)) {
      errors.push(`Node type must be one of: ${Object.values(InfrastructureType).join(', ')}`);
    }

    // Region validation
    if (!params.region) {
      errors.push('Region is required');
    } else {
      if (!/^[a-zA-Z0-9][a-zA-Z0-9-_]*[a-zA-Z0-9]$/.test(params.region)) {
        errors.push('Region must be 2-50 alphanumeric characters');
      }
      if (params.region.length < 2 || params.region.length > 50) {
        errors.push('Region must be between 2 and 50 characters');
      }
    }

    // Metadata warnings
    if (params.metadata) {
      if (params.nodeType === InfrastructureType.DATABASE && !params.metadata.capacity) {
        warnings.push('Database node should specify capacity');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Registers a new infrastructure node.
   */
  async registerNode(params: {
    nodeName: string;
    nodeType: InfrastructureType;
    region: string;
    metadata?: InfrastructureNodeMetadata;
  }): Promise<InfrastructureNode> {
    const validation = this.validateInfrastructureNode(params);
    if (!validation.isValid) {
      throw new Error(`Infrastructure validation failed: ${validation.errors.join('; ')}`);
    }

    if (validation.warnings.length > 0) {
      this.logger.warn('Infrastructure validation warnings', { warnings: validation.warnings });
    }

    const node = InfrastructureNode.create({
      nodeId: NodeId.generate(),
      nodeName: params.nodeName,
      nodeType: params.nodeType,
      region: params.region,
      metadata: params.metadata,
    });

    const saved = await this.repository.createInfrastructureNode(node);

    this.logger.info('Infrastructure node registered', {
      nodeId: saved.nodeId.value,
      nodeName: saved.nodeName,
      nodeType: saved.nodeType,
      region: saved.region,
    });

    return saved;
  }

  /**
   * Updates node status.
   */
  async updateNodeStatus(
    nodeId: string,
    status: 'healthy' | 'unhealthy' | 'maintenance'
  ): Promise<InfrastructureTransitionResult> {
    try {
      const id = NodeId.reconstruct(nodeId);
      const node = await this.repository.findInfrastructureNodeById(id);

      if (!node) {
        return { success: false, error: 'Node not found' };
      }

      const updated = node.copyWith({ status });
      const saved = await this.repository.updateInfrastructureNode(updated);

      this.logger.info('Node status updated', {
        nodeId: saved.nodeId.value,
        nodeName: saved.nodeName,
        status,
      });

      return { success: true, node: saved };
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error('Failed to update node status', error as Error, { nodeId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Deregisters an infrastructure node.
   */
  async deregisterNode(nodeId: string): Promise<InfrastructureTransitionResult> {
    try {
      const id = NodeId.reconstruct(nodeId);
      const node = await this.repository.findInfrastructureNodeById(id);

      if (!node) {
        return { success: false, error: 'Node not found' };
      }

      await this.repository.deleteInfrastructureNode(id);

      this.logger.info('Infrastructure node deregistered', {
        nodeId,
        nodeName: node.nodeName,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error('Failed to deregister node', error as Error, { nodeId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets a node by ID.
   */
  async getNode(nodeId: string): Promise<InfrastructureNode | null> {
    try {
      const id = NodeId.reconstruct(nodeId);
      return await this.repository.findInfrastructureNodeById(id);
    } catch (error) {
      this.logger.error('Failed to get node', error as Error, { nodeId });
      return null;
    }
  }

  /**
   * Gets nodes by region.
   */
  async getNodesByRegion(region: string): Promise<InfrastructureNode[]> {
    try {
      return await this.repository.findInfrastructureNodesByRegion(region);
    } catch (error) {
      this.logger.error('Failed to get nodes by region', error as Error, { region });
      return [];
    }
  }

  /**
   * Gets nodes by type.
   */
  async getNodesByType(type: InfrastructureType): Promise<InfrastructureNode[]> {
    try {
      return await this.repository.findInfrastructureNodesByType(type);
    } catch (error) {
      this.logger.error('Failed to get nodes by type', error as Error, { type });
      return [];
    }
  }

  /**
   * Gets node status.
   */
  async getNodeStatus(nodeId: string): Promise<NodeStatus | null> {
    try {
      const id = NodeId.reconstruct(nodeId);
      const node = await this.repository.findInfrastructureNodeById(id);

      if (!node) {
        return null;
      }

      return {
        nodeId,
        nodeName: node.nodeName,
        nodeType: node.nodeType,
        isHealthy: node.status === 'healthy',
        region: node.region,
        lastStatusUpdate: node.updatedAt,
      };
    } catch (error) {
      this.logger.error('Failed to get node status', error as Error, { nodeId });
      return null;
    }
  }

  /**
   * Gets status of all nodes.
   */
  async getAllNodeStatuses(): Promise<NodeStatus[]> {
    try {
      const { items: nodes } = await this.repository.listInfrastructureNodes(
        { page: 1, pageSize: 1000 },
        {}
      );

      return nodes.map((node) => ({
        nodeId: node.nodeId.value,
        nodeName: node.nodeName,
        nodeType: node.nodeType,
        isHealthy: node.status === 'healthy',
        region: node.region,
        lastStatusUpdate: node.updatedAt,
      }));
    } catch (error) {
      this.logger.error('Failed to get all node statuses', error as Error);
      return [];
    }
  }

  /**
   * Gets metadata for a region.
   */
  async getRegionMetadata(region: string): Promise<RegionMetadata | null> {
    try {
      const nodes = await this.repository.findInfrastructureNodesByRegion(region);

      if (nodes.length === 0) {
        return null;
      }

      const nodeTypes = [...new Set(nodes.map((n) => n.nodeType))];
      const healthyCount = nodes.filter((n) => n.status === 'healthy').length;

      return {
        region,
        nodeCount: nodes.length,
        healthyNodeCount: healthyCount,
        nodeTypes,
      };
    } catch (error) {
      this.logger.error('Failed to get region metadata', error as Error, { region });
      return null;
    }
  }

  /**
   * Gets metadata for all regions.
   */
  async getAllRegionMetadata(): Promise<RegionMetadata[]> {
    try {
      const { items: nodes } = await this.repository.listInfrastructureNodes(
        { page: 1, pageSize: 1000 },
        {}
      );

      // Group by region
      const regionMap = new Map<string, InfrastructureNode[]>();

      for (const node of nodes) {
        const existing = regionMap.get(node.region) || [];
        existing.push(node);
        regionMap.set(node.region, existing);
      }

      const metadata: RegionMetadata[] = [];

      for (const [region, regionNodes] of regionMap) {
        const nodeTypes = [...new Set(regionNodes.map((n) => n.nodeType))];
        const healthyCount = regionNodes.filter((n) => n.status === 'healthy').length;

        metadata.push({
          region,
          nodeCount: regionNodes.length,
          healthyNodeCount: healthyCount,
          nodeTypes,
        });
      }

      return metadata;
    } catch (error) {
      this.logger.error('Failed to get all region metadata', error as Error);
      return [];
    }
  }
}
