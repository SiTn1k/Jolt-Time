/**
 * SnapshotMapper
 *
 * Maps between BackupSnapshot entity and DTOs.
 * No backup logic - pure transformation only.
 */

import type { BackupSnapshotRecord } from '../entities/BackupSnapshot';
import { BackupSnapshot } from '../entities/BackupSnapshot';
import type { BackupSnapshotDto, CreateSnapshotDto, UpdateSnapshotDto, SnapshotListDto } from '../dto/BackupSnapshot.dto';

/**
 * Mapper for converting between BackupSnapshot entity and DTOs.
 */
export class SnapshotMapper {
  /**
   * Converts a BackupSnapshot entity to BackupSnapshotDto.
   */
  public static toDto(snapshot: BackupSnapshot): BackupSnapshotDto {
    return {
      snapshotId: snapshot.snapshotId.value,
      snapshotName: snapshot.snapshotName,
      backupType: snapshot.backupType,
      status: snapshot.status,
      size: snapshot.size,
      checksum: snapshot.checksum,
      storageLocation: snapshot.storageLocation,
      createdAt: snapshot.createdAt.toISOString(),
      metadata: snapshot.metadata,
    };
  }

  /**
   * Converts a BackupSnapshot entity to a database record format.
   */
  public static toRecord(snapshot: BackupSnapshot): BackupSnapshotRecord {
    return snapshot.toRecord();
  }

  /**
   * Converts a database record to BackupSnapshotDto.
   */
  public static fromRecordToDto(record: BackupSnapshotRecord): BackupSnapshotDto {
    return {
      snapshotId: record.snapshot_id,
      snapshotName: record.snapshot_name,
      backupType: record.backup_type as BackupSnapshotDto['backupType'],
      status: record.status as BackupSnapshotDto['status'],
      size: record.size,
      checksum: record.checksum,
      storageLocation: record.storage_location,
      createdAt: record.created_at,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a database record to BackupSnapshot entity.
   */
  public static fromRecord(record: BackupSnapshotRecord): BackupSnapshot {
    return BackupSnapshot.fromDatabase(record);
  }

  /**
   * Converts an array of BackupSnapshot entities to SnapshotListDto.
   */
  public static toListDto(
    snapshots: BackupSnapshot[],
    total: number,
    page: number,
    pageSize: number
  ): SnapshotListDto {
    return {
      snapshots: snapshots.map((s) => this.toDto(s)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts a CreateSnapshotDto to partial snapshot props for entity creation.
   */
  public static fromCreateDto(dto: CreateSnapshotDto): {
    snapshotName: string;
    backupType: CreateSnapshotDto['backupType'];
    storageLocation: string;
    metadata?: CreateSnapshotDto['metadata'];
  } {
    return {
      snapshotName: dto.snapshotName,
      backupType: dto.backupType,
      storageLocation: dto.storageLocation,
      metadata: dto.metadata as CreateSnapshotDto['metadata'],
    };
  }

  /**
   * Converts an UpdateSnapshotDto to partial snapshot props for entity updates.
   */
  public static fromUpdateDto(dto: UpdateSnapshotDto): Partial<{
    snapshotName: string;
    status: UpdateSnapshotDto['status'];
    size: number;
    checksum: string | null;
    metadata: UpdateSnapshotDto['metadata'];
  }> {
    return {
      snapshotName: dto.snapshotName,
      status: dto.status,
      size: dto.size,
      checksum: dto.checksum,
      metadata: dto.metadata as UpdateSnapshotDto['metadata'],
    };
  }
}
