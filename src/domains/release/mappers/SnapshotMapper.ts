/**
 * SnapshotMapper
 *
 * Maps between ReleaseSnapshot entity and DTOs.
 * No database logic - pure transformation only.
 */

import type { ReleaseSnapshot, ReleaseSnapshotRecord } from '../entities/ReleaseSnapshot';
import type {
  ReleaseSnapshotDto,
  SnapshotResponseDto,
  SnapshotListResponseDto,
} from '../dto/Snapshot.dto';

/**
 * Mapper for converting between ReleaseSnapshot entity and DTOs.
 */
export class SnapshotMapper {
  /**
   * Converts a ReleaseSnapshot entity to ReleaseSnapshotDto.
   */
  public static toDto(snapshot: ReleaseSnapshot): ReleaseSnapshotDto {
    return {
      snapshotId: snapshot.snapshotId.value,
      createdAt: snapshot.createdAt.toISOString(),
      backendVersion: snapshot.backendVersion,
      databaseVersion: snapshot.databaseVersion,
      gitCommit: snapshot.gitCommit,
      metadata: snapshot.metadata,
    };
  }

  /**
   * Converts a ReleaseSnapshot entity to SnapshotResponseDto.
   */
  public static toResponse(snapshot: ReleaseSnapshot): SnapshotResponseDto {
    return {
      snapshot: this.toDto(snapshot),
    };
  }

  /**
   * Converts a ReleaseSnapshot entity to a database record format.
   */
  public static toRecord(snapshot: ReleaseSnapshot): ReleaseSnapshotRecord {
    return snapshot.toRecord();
  }

  /**
   * Converts a database record to ReleaseSnapshotDto.
   */
  public static fromRecordToDto(record: ReleaseSnapshotRecord): ReleaseSnapshotDto {
    return {
      snapshotId: record.snapshotId,
      createdAt: record.createdAt,
      backendVersion: record.backendVersion,
      databaseVersion: record.databaseVersion,
      gitCommit: record.gitCommit,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an array of ReleaseSnapshot entities to SnapshotListResponseDto.
   */
  public static toListResponse(
    snapshots: ReleaseSnapshot[],
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
