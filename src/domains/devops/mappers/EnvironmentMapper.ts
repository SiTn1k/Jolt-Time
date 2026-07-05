/**
 * Environment Mapper
 *
 * Maps between Environment entity and DTOs.
 * No deployment logic - pure transformation only.
 */

import type { Environment } from '../entities/Environment';
import type { EnvironmentDto, EnvironmentSummaryDto, EnvironmentDetailDto, EnvironmentMetadataDto } from '../dto/Environment.dto';
import { EnvironmentRecord } from '../entities/Environment';

/**
 * Mapper for converting between Environment entity and DTOs.
 */
export class EnvironmentMapper {
  /**
   * Converts an Environment entity to EnvironmentDto.
   */
  public static toDto(environment: Environment): EnvironmentDto {
    return {
      environmentId: environment.environmentId.value,
      name: environment.name,
      type: environment.type,
      status: environment.status,
      configuration: environment.configuration,
      metadata: this.metadataToDto(environment.metadata),
      createdAt: environment.createdAt.toISOString(),
      updatedAt: environment.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an Environment entity to EnvironmentSummaryDto.
   */
  public static toSummaryDto(environment: Environment): EnvironmentSummaryDto {
    return {
      environmentId: environment.environmentId.value,
      name: environment.name,
      type: environment.type,
      status: environment.status,
    };
  }

  /**
   * Converts an Environment entity to EnvironmentDetailDto.
   */
  public static toDetailDto(environment: Environment, deploymentCount: number): EnvironmentDetailDto {
    return {
      environmentId: environment.environmentId.value,
      name: environment.name,
      type: environment.type,
      status: environment.status,
      configuration: environment.configuration,
      metadata: this.metadataToDto(environment.metadata),
      createdAt: environment.createdAt.toISOString(),
      updatedAt: environment.updatedAt.toISOString(),
      deploymentCount,
    };
  }

  /**
   * Converts environment metadata to DTO.
   */
  private static metadataToDto(metadata: Environment['metadata']): EnvironmentMetadataDto {
    return {
      owner: metadata.owner,
      costCenter: metadata.costCenter,
      tags: metadata.tags,
      customFields: metadata.customFields,
    };
  }

  /**
   * Converts an array of Environment entities to EnvironmentDto array.
   */
  public static toDtoList(environments: Environment[]): EnvironmentDto[] {
    return environments.map((environment) => this.toDto(environment));
  }

  /**
   * Converts an array of Environment entities to EnvironmentSummaryDto array.
   */
  public static toSummaryDtoList(environments: Environment[]): EnvironmentSummaryDto[] {
    return environments.map((environment) => this.toSummaryDto(environment));
  }

  /**
   * Converts an Environment entity to a database record format.
   */
  public static toRecord(environment: Environment): EnvironmentRecord {
    return {
      environmentId: environment.environmentId.value,
      name: environment.name,
      type: environment.type,
      status: environment.status,
      configuration: environment.configuration,
      metadata: environment.metadata,
      createdAt: environment.createdAt.toISOString(),
      updatedAt: environment.updatedAt.toISOString(),
    };
  }
}