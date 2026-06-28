/**
 * PackageMapper
 *
 * Maps between RewardPackage entities and DTOs/records.
 * Only mapping - no reward logic.
 */

import { RewardPackage } from '../entities/RewardPackage';
import type { RewardPackageRecord } from '../entities/RewardPackage';
import type { RewardPackageResponseDto } from '../dto/RewardPackage.dto';
import { RewardMapper } from './RewardMapper';

/**
 * PackageMapper class for entity-DTO-record mapping.
 */
export class PackageMapper {
  private readonly rewardMapper: RewardMapper;

  constructor(rewardMapper?: RewardMapper) {
    this.rewardMapper = rewardMapper ?? new RewardMapper();
  }

  /**
   * Converts a RewardPackage entity to a response DTO.
   */
  public toResponseDto(pkg: RewardPackage): RewardPackageResponseDto {
    return {
      packageId: pkg.packageId.value,
      title: pkg.title,
      description: pkg.description,
      rewardIds: pkg.rewards.map(r => r.rewardId.value),
      rewards: pkg.rewards.map(r => this.rewardMapper.toResponseDto(r)),
      isRepeatable: pkg.isRepeatable,
      rewardCount: pkg.rewardCount,
      totalValue: pkg.totalValue,
      metadata: pkg.metadata,
      createdAt: pkg.createdAt.toISOString(),
      updatedAt: pkg.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a database record to a RewardPackage entity.
   */
  public toEntity(record: RewardPackageRecord): RewardPackage {
    return RewardPackage.fromStorage(record);
  }

  /**
   * Converts a RewardPackage entity to a database record.
   */
  public toRecord(pkg: RewardPackage): RewardPackageRecord {
    return pkg.toRecord();
  }
}