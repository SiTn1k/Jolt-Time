/**
 * Snapshot Mapper
 *
 * Maps between QASnapshot entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { QASnapshot, QASnapshotRecord, QASnapshotJSON } from '../entities/QASnapshot';
import type { CreateQASnapshotDto, QASnapshotResponseDto, UpdateQASnapshotDto } from '../dto/QASnapshot.dto';

/**
 * Mapper for converting between QASnapshot entity and DTOs.
 */
export class SnapshotMapper {
  /**
   * Converts a QASnapshot entity to QASnapshotResponseDto.
   */
  public static toResponse(snapshot: QASnapshot): QASnapshotResponseDto {
    return {
      snapshotId: snapshot.snapshotId.value,
      createdAt: snapshot.createdAt.toISOString(),
      backendVersion: snapshot.backendVersion,
      moduleCount: snapshot.moduleCount,
      healthStatus: snapshot.healthStatus,
      metadata: snapshot.metadata,
    };
  }

  /**
   * Converts an array of QASnapshot entities to QASnapshotResponseDto array.
   */
  public static toResponseList(snapshots: QASnapshot[]): QASnapshotResponseDto[] {
    return snapshots.map((snapshot) => this.toResponse(snapshot));
  }

  /**
   * Converts a CreateQASnapshotDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateQASnapshotDto): Omit<CreateQASnapshotDto, never> {
    return {
      snapshotId: dto.snapshotId,
      backendVersion: dto.backendVersion,
      moduleCount: dto.moduleCount,
      healthStatus: dto.healthStatus,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateQASnapshotDto to partial entity input.
   */
  public static fromUpdateDto(dto: UpdateQASnapshotDto): Partial<CreateQASnapshotDto> {
    return {
      backendVersion: dto.backendVersion,
      moduleCount: dto.moduleCount,
      healthStatus: dto.healthStatus,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateQASnapshotDto format.
   */
  public static fromRecordToDto(record: QASnapshotRecord): CreateQASnapshotDto {
    return {
      snapshotId: record.snapshot_id,
      backendVersion: record.backend_version,
      moduleCount: record.module_count,
      healthStatus: record.health_status as CreateQASnapshotDto['healthStatus'],
      metadata: record.metadata,
    };
  }

  /**
   * Converts a QASnapshot entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(snapshot: QASnapshot): Omit<QASnapshotRecord, never> {
    return {
      snapshot_id: snapshot.snapshotId.value,
      created_at: snapshot.createdAt.toISOString(),
      backend_version: snapshot.backendVersion,
      module_count: snapshot.moduleCount,
      health_status: snapshot.healthStatus,
      metadata: snapshot.metadata,
    };
  }

  /**
   * Converts a QASnapshot entity to JSON format.
   */
  public static toJSON(snapshot: QASnapshot): QASnapshotJSON {
    return snapshot.toJSON();
  }
}
