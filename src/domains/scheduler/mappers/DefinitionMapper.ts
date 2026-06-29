/**
 * Definition Mapper
 *
 * Maps between JobDefinition entity and DTOs.
 * No definition logic - pure transformation only.
 */

import type { JobDefinition } from '../entities/JobDefinition';
import type { JobDefinitionRecord } from '../entities/JobDefinition';
import type {
  JobDefinitionDto,
  JobDefinitionListDto,
  CreateJobDefinitionDto,
  UpdateJobDefinitionDto,
} from '../dto/JobDefinitionDto';

/**
 * Mapper for converting between JobDefinition entity and DTOs.
 */
export class DefinitionMapper {
  /**
   * Converts a JobDefinition entity to JobDefinitionDto.
   */
  public static toDto(definition: JobDefinition): JobDefinitionDto {
    return {
      definitionId: definition.definitionId.value,
      name: definition.name,
      description: definition.description,
      handler: definition.handler,
      retryLimit: definition.retryLimit,
      timeout: definition.timeout,
      metadata: definition.metadata,
    };
  }

  /**
   * Converts a JobDefinition entity to a database record format.
   */
  public static toRecord(definition: JobDefinition): JobDefinitionRecord {
    return definition.toRecord();
  }

  /**
   * Converts a database record to JobDefinitionDto.
   */
  public static fromRecordToDto(record: JobDefinitionRecord): JobDefinitionDto {
    return {
      definitionId: record.definition_id,
      name: record.name,
      description: record.description,
      handler: record.handler,
      retryLimit: record.retry_limit,
      timeout: record.timeout,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an array of JobDefinition entities to JobDefinitionListDto.
   */
  public static toListDto(
    definitions: JobDefinition[],
    total: number,
    page: number,
    pageSize: number
  ): JobDefinitionListDto {
    return {
      definitions: definitions.map((def) => this.toDto(def)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
