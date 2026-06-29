/**
 * Group Mapper
 *
 * Maps between ConfigurationGroup entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { ConfigurationGroup } from '../entities/ConfigurationGroup';
import type { ConfigurationGroupRecord } from '../entities/ConfigurationGroup';
import type {
  CreateConfigurationGroupDto,
  UpdateConfigurationGroupDto,
  ConfigurationGroupResponseDto,
  ConfigurationGroupSummaryDto,
} from '../dto/ConfigurationGroup.dto';

/**
 * Mapper for converting between ConfigurationGroup entity and DTOs.
 */
export class GroupMapper {
  /**
   * Converts a ConfigurationGroup entity to ConfigurationGroupResponseDto.
   */
  public static toResponse(group: ConfigurationGroup): ConfigurationGroupResponseDto {
    return {
      groupId: group.groupId.value,
      name: group.name,
      description: group.description,
      metadata: group.metadata,
    };
  }

  /**
   * Converts a ConfigurationGroup entity to ConfigurationGroupSummaryDto.
   */
  public static toSummary(group: ConfigurationGroup): ConfigurationGroupSummaryDto {
    return {
      groupId: group.groupId.value,
      name: group.name,
    };
  }

  /**
   * Converts an array of ConfigurationGroup entities to ConfigurationGroupResponseDto array.
   */
  public static toResponseList(groups: ConfigurationGroup[]): ConfigurationGroupResponseDto[] {
    return groups.map((group) => this.toResponse(group));
  }

  /**
   * Converts an array of ConfigurationGroup entities to ConfigurationGroupSummaryDto array.
   */
  public static toSummaryList(groups: ConfigurationGroup[]): ConfigurationGroupSummaryDto[] {
    return groups.map((group) => this.toSummary(group));
  }

  /**
   * Converts a CreateConfigurationGroupDto to a plain object.
   */
  public static fromCreateDto(dto: CreateConfigurationGroupDto): Omit<CreateConfigurationGroupDto, never> {
    return {
      name: dto.name,
      description: dto.description,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateConfigurationGroupDto to a plain object.
   */
  public static fromUpdateDto(dto: UpdateConfigurationGroupDto): Partial<ConfigurationGroup> {
    return {
      name: dto.name,
      description: dto.description,
      metadata: dto.metadata,
    } as Partial<ConfigurationGroup>;
  }

  /**
   * Converts a database record to CreateConfigurationGroupDto format.
   */
  public static fromRecordToDto(record: ConfigurationGroupRecord): CreateConfigurationGroupDto {
    return {
      name: record.name,
      description: record.description,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a ConfigurationGroup entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(group: ConfigurationGroup): Omit<ConfigurationGroupRecord, never> {
    return {
      group_id: group.groupId.value,
      name: group.name,
      description: group.description,
      metadata: group.metadata,
    };
  }
}
