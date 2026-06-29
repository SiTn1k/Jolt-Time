/**
 * Configuration Mapper
 *
 * Maps between ConfigurationEntry entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { ConfigurationEntry } from '../entities/ConfigurationEntry';
import type { ConfigurationEntryRecord } from '../entities/ConfigurationEntry';
import type {
  CreateConfigurationEntryDto,
  UpdateConfigurationEntryDto,
  ConfigurationEntryResponseDto,
  ConfigurationEntrySummaryDto,
} from '../dto/ConfigurationEntry.dto';

/**
 * Mapper for converting between ConfigurationEntry entity and DTOs.
 */
export class ConfigurationMapper {
  /**
   * Converts a ConfigurationEntry entity to ConfigurationEntryResponseDto.
   */
  public static toResponse(entry: ConfigurationEntry): ConfigurationEntryResponseDto {
    return {
      configId: entry.configId.value,
      key: entry.key.value,
      value: entry.value,
      valueType: entry.valueType,
      groupId: entry.groupId?.value ?? null,
      description: entry.description,
      version: entry.version,
      isPublic: entry.isPublic,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      metadata: entry.metadata,
    };
  }

  /**
   * Converts a ConfigurationEntry entity to ConfigurationEntrySummaryDto.
   */
  public static toSummary(entry: ConfigurationEntry): ConfigurationEntrySummaryDto {
    return {
      configId: entry.configId.value,
      key: entry.key.value,
      valueType: entry.valueType,
      isPublic: entry.isPublic,
    };
  }

  /**
   * Converts an array of ConfigurationEntry entities to ConfigurationEntryResponseDto array.
   */
  public static toResponseList(entries: ConfigurationEntry[]): ConfigurationEntryResponseDto[] {
    return entries.map((entry) => this.toResponse(entry));
  }

  /**
   * Converts an array of ConfigurationEntry entities to ConfigurationEntrySummaryDto array.
   */
  public static toSummaryList(entries: ConfigurationEntry[]): ConfigurationEntrySummaryDto[] {
    return entries.map((entry) => this.toSummary(entry));
  }

  /**
   * Converts a CreateConfigurationEntryDto to a plain object.
   */
  public static fromCreateDto(dto: CreateConfigurationEntryDto): Omit<CreateConfigurationEntryDto, never> {
    return {
      key: dto.key,
      value: dto.value,
      valueType: dto.valueType,
      groupId: dto.groupId,
      description: dto.description,
      isPublic: dto.isPublic,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateConfigurationEntryDto to a plain object.
   */
  public static fromUpdateDto(dto: UpdateConfigurationEntryDto): Partial<ConfigurationEntry> {
    return {
      value: dto.value,
      description: dto.description,
      isPublic: dto.isPublic,
      metadata: dto.metadata,
    } as Partial<ConfigurationEntry>;
  }

  /**
   * Converts a database record to CreateConfigurationEntryDto format.
   */
  public static fromRecordToDto(record: ConfigurationEntryRecord): CreateConfigurationEntryDto {
    return {
      key: record.key,
      value: record.value,
      valueType: record.value_type as CreateConfigurationEntryDto['valueType'],
      groupId: record.group_id ?? undefined,
      description: record.description,
      isPublic: record.is_public,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a ConfigurationEntry entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(entry: ConfigurationEntry): Omit<ConfigurationEntryRecord, never> {
    return {
      config_id: entry.configId.value,
      key: entry.key.value,
      value: entry.value,
      value_type: entry.valueType,
      group_id: entry.groupId?.value ?? null,
      description: entry.description,
      version: entry.version,
      is_public: entry.isPublic,
      metadata: entry.metadata,
      created_at: entry.createdAt.toISOString(),
      updated_at: entry.updatedAt.toISOString(),
    };
  }
}
