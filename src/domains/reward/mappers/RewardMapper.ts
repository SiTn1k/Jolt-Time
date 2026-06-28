/**
 * RewardMapper
 *
 * Maps between RewardDefinition entities and DTOs/records.
 * Only mapping - no reward logic.
 */

import { RewardDefinition } from '../entities/RewardDefinition';
import type { RewardDefinitionRecord } from '../entities/RewardDefinition';
import type { RewardDefinitionResponseDto } from '../dto/RewardDefinition.dto';

/**
 * RewardMapper class for entity-DTO-record mapping.
 */
export class RewardMapper {
  /**
   * Converts a RewardDefinition entity to a response DTO.
   */
  public toResponseDto(definition: RewardDefinition): RewardDefinitionResponseDto {
    return {
      rewardId: definition.rewardId.value,
      slug: definition.slug.value,
      title: definition.title,
      description: definition.description,
      rewardType: definition.rewardType,
      amount: definition.rewardValue.amount,
      rewardTarget: definition.rewardTarget,
      metadata: definition.metadata,
      createdAt: definition.createdAt.toISOString(),
      updatedAt: definition.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a database record to a RewardDefinition entity.
   */
  public toEntity(record: RewardDefinitionRecord): RewardDefinition {
    return RewardDefinition.fromStorage(record);
  }

  /**
   * Converts a RewardDefinition entity to a database record.
   */
  public toRecord(definition: RewardDefinition): RewardDefinitionRecord {
    return definition.toRecord();
  }
}

/**
 * Database record type for RewardDefinition storage.
 */
export type { RewardDefinitionRecord } from '../entities/RewardDefinition';