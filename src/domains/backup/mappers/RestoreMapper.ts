/**
 * RestoreMapper
 *
 * Maps between RestorePoint entity and DTOs.
 * No restore logic - pure transformation only.
 */

import type { RestorePointRecord } from '../entities/RestorePoint';
import { RestorePoint } from '../entities/RestorePoint';
import { SnapshotId } from '../value-objects/SnapshotId';
import type { RestorePointDto, CreateRestorePointDto, RestorePointListDto } from '../dto/RestorePoint.dto';

/**
 * Mapper for converting between RestorePoint entity and DTOs.
 */
export class RestoreMapper {
  /**
   * Converts a RestorePoint entity to RestorePointDto.
   */
  public static toDto(restorePoint: RestorePoint): RestorePointDto {
    return {
      restorePointId: restorePoint.restorePointId.value,
      snapshotId: restorePoint.snapshotId.value,
      createdAt: restorePoint.createdAt.toISOString(),
      description: restorePoint.description,
      metadata: restorePoint.metadata,
    };
  }

  /**
   * Converts a RestorePoint entity to a database record format.
   */
  public static toRecord(restorePoint: RestorePoint): RestorePointRecord {
    return restorePoint.toRecord();
  }

  /**
   * Converts a database record to RestorePointDto.
   */
  public static fromRecordToDto(record: RestorePointRecord): RestorePointDto {
    return {
      restorePointId: record.restore_point_id,
      snapshotId: record.snapshot_id,
      createdAt: record.created_at,
      description: record.description,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a database record to RestorePoint entity.
   */
  public static fromRecord(record: RestorePointRecord): RestorePoint {
    return RestorePoint.fromDatabase(record);
  }

  /**
   * Converts an array of RestorePoint entities to RestorePointListDto.
   */
  public static toListDto(
    restorePoints: RestorePoint[],
    total: number,
    page: number,
    pageSize: number
  ): RestorePointListDto {
    return {
      restorePoints: restorePoints.map((r) => this.toDto(r)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts a CreateRestorePointDto to partial restore point props for entity creation.
   */
  public static fromCreateDto(dto: CreateRestorePointDto): {
    snapshotId: SnapshotId;
    description: string;
    metadata?: CreateRestorePointDto['metadata'];
  } {
    return {
      snapshotId: SnapshotId.reconstruct(dto.snapshotId),
      description: dto.description ?? '',
      metadata: dto.metadata as CreateRestorePointDto['metadata'],
    };
  }
}
