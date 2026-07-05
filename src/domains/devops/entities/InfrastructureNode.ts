/**
 * InfrastructureNode Entity
 *
 * Domain entity representing an infrastructure node.
 */

import type { IInfrastructureNode } from '../interfaces/IInfrastructureNode';
import { NodeId } from '../value-objects/NodeId';
import type { InfrastructureType } from '../types/InfrastructureType';

/**
 * Infrastructure node status.
 */
export type NodeStatus = 'healthy' | 'unhealthy' | 'unknown' | 'maintenance';

/**
 * Infrastructure node entity class.
 * Immutable domain entity representing an infrastructure node.
 */
export class InfrastructureNode implements IInfrastructureNode {
  /** Unique node identifier */
  public readonly nodeId: NodeId;

  /** Human-readable node name */
  public readonly nodeName: string;

  /** Type of infrastructure node */
  public readonly nodeType: InfrastructureType;

  /** Node status */
  public readonly status: NodeStatus;

  /** Geographic region */
  public readonly region: string;

  /** Extended metadata */
  public readonly metadata: InfrastructureNodeMetadata;

  /** Timestamp when node was created */
  public readonly createdAt: Date;

  /** Timestamp when node was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new InfrastructureNode instance.
   */
  constructor(props: InfrastructureNodeProps) {
    this.nodeId = props.nodeId;
    this.nodeName = props.nodeName;
    this.nodeType = props.nodeType;
    this.status = props.status;
    this.region = props.region;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new InfrastructureNode.
   * Factory method for new node creation.
   */
  public static create(params: {
    nodeId: NodeId;
    nodeName: string;
    nodeType: InfrastructureType;
    region: string;
    metadata?: InfrastructureNodeMetadata;
  }): InfrastructureNode {
    const now = new Date();

    return new InfrastructureNode({
      nodeId: params.nodeId,
      nodeName: params.nodeName,
      nodeType: params.nodeType,
      status: 'unknown',
      region: params.region,
      metadata: params.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs an InfrastructureNode from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromStorage(record: InfrastructureNodeRecord): InfrastructureNode {
    return new InfrastructureNode({
      nodeId: NodeId.reconstruct(record.nodeId),
      nodeName: record.nodeName,
      nodeType: record.nodeType,
      status: record.status,
      region: record.region,
      metadata: record.metadata ?? {},
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<InfrastructureNodeProps>): InfrastructureNode {
    return new InfrastructureNode({
      nodeId: params.nodeId ?? this.nodeId,
      nodeName: params.nodeName ?? this.nodeName,
      nodeType: params.nodeType ?? this.nodeType,
      status: params.status ?? this.status,
      region: params.region ?? this.region,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the InfrastructureNode to a plain object.
   */
  public toJSON(): InfrastructureNodeJSON {
    return {
      nodeId: this.nodeId.value,
      nodeName: this.nodeName,
      nodeType: this.nodeType,
      status: this.status,
      region: this.region,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

/**
 * Infrastructure node properties interface for constructor.
 */
export interface InfrastructureNodeProps {
  nodeId: NodeId;
  nodeName: string;
  nodeType: InfrastructureType;
  status: NodeStatus;
  region: string;
  metadata: InfrastructureNodeMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Infrastructure node metadata interface.
 */
export interface InfrastructureNodeMetadata {
  /** IP address or hostname */
  endpoint?: string;

  /** Cloud provider */
  provider?: string;

  /** Instance type */
  instanceType?: string;

  /** Capacity information */
  capacity?: {
    cpuCores?: number;
    memoryMb?: number;
    storageMb?: number;
  };

  /** Custom labels */
  labels?: Record<string, string>;

  /** Custom metadata */
  customFields?: Record<string, unknown>;
}

/**
 * Database record representation of InfrastructureNode.
 */
export interface InfrastructureNodeRecord {
  nodeId: string;
  nodeName: string;
  nodeType: InfrastructureType;
  status: NodeStatus;
  region: string;
  metadata: InfrastructureNodeMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of InfrastructureNode.
 */
export interface InfrastructureNodeJSON {
  nodeId: string;
  nodeName: string;
  nodeType: InfrastructureType;
  status: NodeStatus;
  region: string;
  metadata: InfrastructureNodeMetadata;
  createdAt: string;
  updatedAt: string;
}