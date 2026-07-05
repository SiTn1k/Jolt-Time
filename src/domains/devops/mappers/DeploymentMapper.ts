/**
 * Deployment Mapper
 *
 * Maps between Deployment entity and DTOs.
 * No deployment logic - pure transformation only.
 */

import type { Deployment } from '../entities/Deployment';
import type { DeploymentDto, DeploymentSummaryDto, DeploymentDetailDto } from '../dto/Deployment.dto';
import { DeploymentRecord } from '../entities/Deployment';

/**
 * Mapper for converting between Deployment entity and DTOs.
 */
export class DeploymentMapper {
  /**
   * Converts a Deployment entity to DeploymentDto.
   */
  public static toDto(deployment: Deployment): DeploymentDto {
    return {
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
  }

  /**
   * Converts a Deployment entity to DeploymentSummaryDto.
   */
  public static toSummaryDto(deployment: Deployment): DeploymentSummaryDto {
    return {
      deploymentId: deployment.deploymentId.value,
      version: deployment.version,
      environmentId: deployment.environmentId,
      status: deployment.status,
      startedAt: deployment.startedAt.toISOString(),
    };
  }

  /**
   * Converts a Deployment entity to DeploymentDetailDto.
   */
  public static toDetailDto(deployment: Deployment): DeploymentDetailDto {
    const durationSeconds = deployment.completedAt
      ? Math.floor((deployment.completedAt.getTime() - deployment.startedAt.getTime()) / 1000)
      : null;

    return {
      deploymentId: deployment.deploymentId.value,
      version: deployment.version,
      environmentId: deployment.environmentId,
      status: deployment.status,
      startedAt: deployment.startedAt.toISOString(),
      completedAt: deployment.completedAt?.toISOString() ?? null,
      metadata: deployment.metadata,
      createdAt: deployment.createdAt.toISOString(),
      updatedAt: deployment.updatedAt.toISOString(),
      durationSeconds,
    };
  }

  /**
   * Converts an array of Deployment entities to DeploymentDto array.
   */
  public static toDtoList(deployments: Deployment[]): DeploymentDto[] {
    return deployments.map((deployment) => this.toDto(deployment));
  }

  /**
   * Converts an array of Deployment entities to DeploymentSummaryDto array.
   */
  public static toSummaryDtoList(deployments: Deployment[]): DeploymentSummaryDto[] {
    return deployments.map((deployment) => this.toSummaryDto(deployment));
  }

  /**
   * Converts a Deployment entity to a database record format.
   */
  public static toRecord(deployment: Deployment): DeploymentRecord {
    return {
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
  }
}