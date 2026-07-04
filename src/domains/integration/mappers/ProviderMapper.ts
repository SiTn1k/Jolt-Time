/**
 * Provider Mapper
 *
 * Maps between IntegrationProvider entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { IntegrationProvider, type IntegrationProviderRecord } from '../entities/IntegrationProvider';
import type {
  CreateIntegrationProviderDto,
  UpdateIntegrationProviderDto,
  IntegrationProviderResponseDto,
  IntegrationProviderSummaryDto,
  IntegrationProviderListResponseDto,
} from '../dto/IntegrationProvider.dto';

/**
 * Mapper for converting between IntegrationProvider entity and DTOs.
 */
export class ProviderMapper {
  /**
   * Converts an IntegrationProvider entity to IntegrationProviderResponseDto.
   */
  public static toResponse(provider: IntegrationProvider): IntegrationProviderResponseDto {
    return {
      providerId: provider.providerId.value,
      providerName: provider.providerName,
      providerType: provider.providerType,
      status: provider.status,
      version: provider.version,
      configuration: provider.configuration,
      metadata: provider.metadata,
      createdAt: provider.createdAt.toISOString(),
      updatedAt: provider.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an IntegrationProvider entity to IntegrationProviderSummaryDto.
   */
  public static toSummary(provider: IntegrationProvider): IntegrationProviderSummaryDto {
    return {
      providerId: provider.providerId.value,
      providerName: provider.providerName,
      providerType: provider.providerType,
      status: provider.status,
    };
  }

  /**
   * Converts an array of IntegrationProvider entities to IntegrationProviderResponseDto array.
   */
  public static toResponseList(providers: IntegrationProvider[]): IntegrationProviderResponseDto[] {
    return providers.map((provider) => this.toResponse(provider));
  }

  /**
   * Converts a CreateIntegrationProviderDto to a plain object for entity creation.
   */
  public static fromCreateDto(dto: CreateIntegrationProviderDto): CreateIntegrationProviderDto {
    return {
      providerName: dto.providerName,
      providerType: dto.providerType,
      status: dto.status,
      version: dto.version,
      configuration: dto.configuration,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateIntegrationProviderDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateIntegrationProviderDto): Partial<IntegrationProvider> {
    return {
      providerName: dto.providerName as unknown as IntegrationProvider['providerName'],
      status: dto.status as unknown as IntegrationProvider['status'],
      version: dto.version as unknown as IntegrationProvider['version'],
      configuration: dto.configuration as unknown as IntegrationProvider['configuration'],
      metadata: dto.metadata as unknown as IntegrationProvider['metadata'],
    } as Partial<IntegrationProvider>;
  }

  /**
   * Converts a database record to IntegrationProvider entity.
   */
  public static fromRecord(record: IntegrationProviderRecord): IntegrationProvider {
    return IntegrationProvider.fromDatabase(record);
  }

  /**
   * Converts an IntegrationProvider entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(provider: IntegrationProvider): IntegrationProviderRecord {
    return {
      provider_id: provider.providerId.value,
      provider_name: provider.providerName,
      provider_type: provider.providerType,
      status: provider.status,
      version: provider.version,
      configuration: provider.configuration,
      metadata: provider.metadata,
      created_at: provider.createdAt.toISOString(),
      updated_at: provider.updatedAt.toISOString(),
    };
  }

  /**
   * Converts paginated result to list response DTO.
   */
  public static toListResponse(
    providers: IntegrationProvider[],
    total: number,
    page: number,
    pageSize: number
  ): IntegrationProviderListResponseDto {
    return {
      providers: this.toResponseList(providers),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
