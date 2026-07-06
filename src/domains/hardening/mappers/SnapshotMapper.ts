/**
 * SnapshotMapper
 *
 * Maps between HardeningSnapshot entity and DTOs.
 * No database logic - pure transformation only.
 */

import type { HardeningSnapshot, HardeningSnapshotRecord } from '../entities/HardeningSnapshot';
import type {
  HardeningSnapshotDto,
  HardeningSnapshotResponseDto,
  HardeningSnapshotListResponseDto,
} from '../dto/HardeningSnapshot.dto';

/**
 * Mapper for converting between HardeningSnapshot entity and DTOs.
 */
export class SnapshotMapper {
  /**
   * Converts a HardeningSnapshot entity to HardeningSnapshotDto.
   */
  public static toDto(snapshot: HardeningSnapshot): HardeningSnapshotDto {
    return {
      snapshotId: snapshot.snapshotId.value,
      createdAt: snapshot.createdAt.toISOString(),
      systemVersion: snapshot.systemVersion,
      moduleCount: snapshot.moduleCount,
      healthStatus: snapshot.healthStatus,
      metadata: snapshot.metadata,
    };
  }

  /**
   * Converts a HardeningSnapshot entity to HardeningSnapshotResponseDto.
   */
  public static toResponse(snapshot: HardeningSnapshot): HardeningSnapshotResponseDto {
    return {
      snapshot: this.toDto(snapshot),
    };
  }

  /**
   * Converts a HardeningSnapshot entity to a database record format.
   */
  public static toRecord(snapshot: HardeningSnapshot): HardeningSnapshotRecord {
    return snapshot.toRecord();
  }

  /**
   * Converts a database record to HardeningSnapshotDto.
   */
  public static fromRecordToDto(record: HardeningSnapshotRecord): HardeningSnapshotDto {
    return {
      snapshotId: record.snapshotId,
      createdAt: record.createdAt,
      systemVersion: record.systemVersion,
      moduleCount: record.moduleCount,
      healthStatus: record.healthStatus,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an array of HardeningSnapshot entities to HardeningSnapshotListResponseDto.
   */
  public static toListResponse(
    snapshots: HardeningSnapshot[],
    total: number,
    page: number,
    pageSize: number
  ): HardeningSnapshotListResponseDto {
    return {
      snapshots: snapshots.map((snapshot) => this.toDto(snapshot)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
