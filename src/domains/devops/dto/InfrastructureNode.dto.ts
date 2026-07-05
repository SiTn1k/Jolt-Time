/**
 * Infrastructure Node DTO
 *
 * Data transfer object for infrastructure node data.
 */

import type { InfrastructureType } from '../types/InfrastructureType';
import type { NodeStatus } from '../entities/InfrastructureNode';

/**
 * Infrastructure node data transfer object.
 */
export interface InfrastructureNodeDto {
  nodeId: string;
  nodeName: string;
  nodeType: InfrastructureType;
  status: NodeStatus;
  region: string;
  metadata: InfrastructureNodeMetadataDto;
  createdAt: string;
  updatedAt: string;
}

/**
 * Infrastructure node metadata data transfer object.
 */
export interface InfrastructureNodeMetadataDto {
  endpoint?: string;
  provider?: string;
  instanceType?: string;
  capacity?: {
    cpuCores?: number;
    memoryMb?: number;
    storageMb?: number;
  };
  labels?: Record<string, string>;
  customFields?: Record<string, unknown>;
}

/**
 * Summary infrastructure node data transfer object.
 */
export interface InfrastructureNodeSummaryDto {
  nodeId: string;
  nodeName: string;
  nodeType: InfrastructureType;
  status: NodeStatus;
  region: string;
}

/**
 * Infrastructure node detail data transfer object.
 */
export interface InfrastructureNodeDetailDto extends InfrastructureNodeDto {
  uptimePercentage: number;
}