/**
 * Snapshot Mapper
 *
 * Maps between AlphaSnapshot entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { AlphaSnapshot, AlphaSnapshotRecord } from '../entities/AlphaSnapshot';
import type {
  SnapshotDto,
  SnapshotResponseDto,
  SnapshotListResponseDto,
} from '../dto/Snapshot.dto';

/**
 * Mapper for converting between AlphaSnapshot entity and DTOs.
 */
export class SnapshotMapper {
  /**
   * Converts an AlphaSnapshot entity to SnapshotDto.
   */
  public static toDto(snapshot: AlphaSnapshot): SnapshotDto {
    return {
      snapshotId: snapshot.snapshotId.value,
      createdAt: snapshot.createdAt.toISOString(),
      backendVersion: snapshot.backendVersion,
      databaseVersion: snapshot.databaseVersion,
      moduleCount: snapshot.moduleCount,
      metadata: snapshot.metadata,
    };
  }

  /**
   * Converts an AlphaSnapshot entity to SnapshotResponseDto.
   */
  public static toResponse(snapshot: AlphaSnapshot): SnapshotResponseDto {
    return {
      snapshot: this.toDto(snapshot),
    };
  }

  /**
   * Converts an AlphaSnapshot entity to a database record format.
   */
  public static toRecord(snapshot: AlphaSnapshot): AlphaSnapshotRecord {
    return snapshot.toRecord();
  }

  /**
   * Converts a database record to SnapshotDto.
   */
  public static fromRecordToDto(record: AlphaSnapshotRecord): SnapshotDto {
    return {
      snapshotId: record.snapshotId,
      createdAt: record.createdAt,
      backendVersion: record.backendVersion,
      databaseVersion: record.databaseVersion,
      moduleCount: record.moduleCount,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an array of AlphaSnapshot entities to SnapshotListResponseDto.
   */
  public static toListResponse(
    snapshots: AlphaSnapshot[],
    total: number,
    page: number,
    pageSize: number
  ): SnapshotListResponseDto {
    return {
      snapshots: snapshots.map((snapshot) => this.toDto(snapshot)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
