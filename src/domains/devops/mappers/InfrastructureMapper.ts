/**
 * Infrastructure Mapper
 *
 * Maps between InfrastructureNode entity and DTOs.
 * No deployment logic - pure transformation only.
 */

import type { InfrastructureNode } from '../entities/InfrastructureNode';
import type { InfrastructureNodeDto, InfrastructureNodeSummaryDto, InfrastructureNodeDetailDto, InfrastructureNodeMetadataDto } from '../dto/InfrastructureNode.dto';
import { InfrastructureNodeRecord } from '../entities/InfrastructureNode';

/**
 * Mapper for converting between InfrastructureNode entity and DTOs.
 */
export class InfrastructureMapper {
  /**
   * Converts an InfrastructureNode entity to InfrastructureNodeDto.
   */
  public static toDto(node: InfrastructureNode): InfrastructureNodeDto {
    return {
      nodeId: node.nodeId.value,
      nodeName: node.nodeName,
      nodeType: node.nodeType,
      status: node.status,
      region: node.region,
      metadata: this.metadataToDto(node.metadata),
      createdAt: node.createdAt.toISOString(),
      updatedAt: node.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an InfrastructureNode entity to InfrastructureNodeSummaryDto.
   */
  public static toSummaryDto(node: InfrastructureNode): InfrastructureNodeSummaryDto {
    return {
      nodeId: node.nodeId.value,
      nodeName: node.nodeName,
      nodeType: node.nodeType,
      status: node.status,
      region: node.region,
    };
  }

  /**
   * Converts an InfrastructureNode entity to InfrastructureNodeDetailDto.
   */
  public static toDetailDto(node: InfrastructureNode, uptimePercentage: number): InfrastructureNodeDetailDto {
    return {
      nodeId: node.nodeId.value,
      nodeName: node.nodeName,
      nodeType: node.nodeType,
      status: node.status,
      region: node.region,
      metadata: this.metadataToDto(node.metadata),
      createdAt: node.createdAt.toISOString(),
      updatedAt: node.updatedAt.toISOString(),
      uptimePercentage,
    };
  }

  /**
   * Converts infrastructure node metadata to DTO.
   */
  private static metadataToDto(metadata: InfrastructureNode['metadata']): InfrastructureNodeMetadataDto {
    return {
      endpoint: metadata.endpoint,
      provider: metadata.provider,
      instanceType: metadata.instanceType,
      capacity: metadata.capacity,
      labels: metadata.labels,
      customFields: metadata.customFields,
    };
  }

  /**
   * Converts an array of InfrastructureNode entities to InfrastructureNodeDto array.
   */
  public static toDtoList(nodes: InfrastructureNode[]): InfrastructureNodeDto[] {
    return nodes.map((node) => this.toDto(node));
  }

  /**
   * Converts an array of InfrastructureNode entities to InfrastructureNodeSummaryDto array.
   */
  public static toSummaryDtoList(nodes: InfrastructureNode[]): InfrastructureNodeSummaryDto[] {
    return nodes.map((node) => this.toSummaryDto(node));
  }

  /**
   * Converts an InfrastructureNode entity to a database record format.
   */
  public static toRecord(node: InfrastructureNode): InfrastructureNodeRecord {
    return {
      nodeId: node.nodeId.value,
      nodeName: node.nodeName,
      nodeType: node.nodeType,
      status: node.status,
      region: node.region,
      metadata: node.metadata,
      createdAt: node.createdAt.toISOString(),
      updatedAt: node.updatedAt.toISOString(),
    };
  }
}