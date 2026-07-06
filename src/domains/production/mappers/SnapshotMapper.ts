/**
 * Snapshot Mapper
 *
 * Maps between ProductionSnapshot entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type {
  ProductionSnapshot,
  ProductionSnapshotRecord,
} from '../entities/ProductionSnapshot';
import type {
  SnapshotDto,
  SnapshotResponseDto,
  SnapshotListResponseDto,
} from '../dto/Snapshot.dto';

/**
 * Mapper for converting between ProductionSnapshot entity and DTOs.
 */
export class SnapshotMapper {
  /**
   * Converts a ProductionSnapshot entity to SnapshotDto.
   */
  public static toDto(snapshot: ProductionSnapshot): SnapshotDto {
    return {
      snapshotId: snapshot.snapshotId.value,
      createdAt: snapshot.createdAt.toISOString(),
      backendVersion: snapshot.backendVersion,
      databaseVersion: snapshot.databaseVersion,
      systemHealth: snapshot.systemHealth,
      metadata: snapshot.metadata,
    };
  }

  /**
   * Converts a ProductionSnapshot entity to SnapshotResponseDto.
   */
  public static toResponse(snapshot: ProductionSnapshot): SnapshotResponseDto {
    return {
      snapshot: this.toDto(snapshot),
    };
  }

  /**
   * Converts a ProductionSnapshot entity to a database record format.
   */
  public static toRecord(snapshot: ProductionSnapshot): ProductionSnapshotRecord {
    return snapshot.toRecord();
  }

  /**
   * Converts a database record to SnapshotDto.
   */
  public static fromRecordToDto(record: ProductionSnapshotRecord): SnapshotDto {
    return {
      snapshotId: record.snapshotId,
      createdAt: record.createdAt,
      backendVersion: record.backendVersion,
      databaseVersion: record.databaseVersion,
      systemHealth: record.systemHealth,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an array of ProductionSnapshot entities to SnapshotListResponseDto.
   */
  public static toListResponse(
    snapshots: ProductionSnapshot[],
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
