/**
 * IInfrastructureNode Interface
 *
 * Interface defining the contract for InfrastructureNode entities.
 */

import type { NodeId } from '../value-objects/NodeId';
import type { InfrastructureType } from '../types/InfrastructureType';
import type { NodeStatus } from '../entities/InfrastructureNode';

/**
 * Infrastructure node entity interface.
 * Defines the contract for InfrastructureNode domain entities.
 */
export interface IInfrastructureNode {
  /** Unique node identifier */
  readonly nodeId: NodeId;

  /** Human-readable node name */
  readonly nodeName: string;

  /** Type of infrastructure node */
  readonly nodeType: InfrastructureType;

  /** Node status */
  readonly status: NodeStatus;

  /** Geographic region */
  readonly region: string;

  /** Extended metadata */
  readonly metadata: InfrastructureNodeMetadata;

  /** Timestamp when node was created */
  readonly createdAt: Date;

  /** Timestamp when node was last updated */
  readonly updatedAt: Date;
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