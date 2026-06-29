/**
 * Feature Flag Mapper
 *
 * Maps between FeatureFlag entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { FeatureFlag } from '../entities/FeatureFlag';
import type { FeatureFlagRecord } from '../entities/FeatureFlag';
import type {
  CreateFeatureFlagDto,
  UpdateFeatureFlagDto,
  FeatureFlagResponseDto,
  FeatureFlagSummaryDto,
} from '../dto/FeatureFlag.dto';

/**
 * Mapper for converting between FeatureFlag entity and DTOs.
 */
export class FeatureFlagMapper {
  /**
   * Converts a FeatureFlag entity to FeatureFlagResponseDto.
   */
  public static toResponse(flag: FeatureFlag): FeatureFlagResponseDto {
    return {
      flagId: flag.flagId.value,
      key: flag.key,
      enabled: flag.enabled,
      rollout: flag.rollout,
      description: flag.description,
      metadata: flag.metadata,
    };
  }

  /**
   * Converts a FeatureFlag entity to FeatureFlagSummaryDto.
   */
  public static toSummary(flag: FeatureFlag): FeatureFlagSummaryDto {
    return {
      flagId: flag.flagId.value,
      key: flag.key,
      enabled: flag.enabled,
      rollout: flag.rollout,
    };
  }

  /**
   * Converts an array of FeatureFlag entities to FeatureFlagResponseDto array.
   */
  public static toResponseList(flags: FeatureFlag[]): FeatureFlagResponseDto[] {
    return flags.map((flag) => this.toResponse(flag));
  }

  /**
   * Converts an array of FeatureFlag entities to FeatureFlagSummaryDto array.
   */
  public static toSummaryList(flags: FeatureFlag[]): FeatureFlagSummaryDto[] {
    return flags.map((flag) => this.toSummary(flag));
  }

  /**
   * Converts a CreateFeatureFlagDto to a plain object.
   */
  public static fromCreateDto(dto: CreateFeatureFlagDto): Omit<CreateFeatureFlagDto, never> {
    return {
      key: dto.key,
      enabled: dto.enabled,
      rollout: dto.rollout,
      description: dto.description,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateFeatureFlagDto to a plain object.
   */
  public static fromUpdateDto(dto: UpdateFeatureFlagDto): Partial<FeatureFlag> {
    return {
      enabled: dto.enabled,
      rollout: dto.rollout,
      description: dto.description,
      metadata: dto.metadata,
    } as Partial<FeatureFlag>;
  }

  /**
   * Converts a database record to CreateFeatureFlagDto format.
   */
  public static fromRecordToDto(record: FeatureFlagRecord): CreateFeatureFlagDto {
    return {
      key: record.key,
      enabled: record.enabled,
      rollout: record.rollout,
      description: record.description,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a FeatureFlag entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(flag: FeatureFlag): Omit<FeatureFlagRecord, never> {
    return {
      flag_id: flag.flagId.value,
      key: flag.key,
      enabled: flag.enabled,
      rollout: flag.rollout,
      description: flag.description,
      metadata: flag.metadata,
    };
  }
}
