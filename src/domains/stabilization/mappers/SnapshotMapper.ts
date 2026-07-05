/**
 * Snapshot Mapper
 *
 * Maps between HealthSnapshot entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { HealthSnapshot, HealthSnapshotRecord } from '../entities/HealthSnapshot';
import type { HealthSnapshotResponseDto, CreateHealthSnapshotDto } from '../dto/HealthSnapshotDto';
import type { HealthResponseDto } from '../dto/HealthResponseDto';

/**
 * Mapper for converting between HealthSnapshot entity and DTOs.
 */
export class SnapshotMapper {
  /**
   * Converts a HealthSnapshot entity to HealthSnapshotResponseDto.
   */
  public static toResponse(snapshot: HealthSnapshot): HealthSnapshotResponseDto {
    return {
      snapshotId: snapshot.snapshotId.value,
      createdAt: snapshot.createdAt.toISOString(),
      memory: snapshot.memory,
      cpu: snapshot.cpu,
      database: snapshot.database,
      cache: snapshot.cache,
      api: snapshot.api,
      overallStatus: snapshot.overallStatus,
      metadata: snapshot.metadata,
    };
  }

  /**
   * Converts an array of HealthSnapshot entities to HealthSnapshotResponseDto array.
   */
  public static toResponseList(snapshots: HealthSnapshot[]): HealthSnapshotResponseDto[] {
    return snapshots.map((snapshot) => this.toResponse(snapshot));
  }

  /**
   * Converts a CreateHealthSnapshotDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateHealthSnapshotDto): Omit<CreateHealthSnapshotDto, never> {
    return {
      memory: dto.memory,
      cpu: dto.cpu,
      database: dto.database,
      cache: dto.cache,
      api: dto.api,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateHealthSnapshotDto format.
   */
  public static fromRecordToDto(record: HealthSnapshotRecord): CreateHealthSnapshotDto {
    return {
      memory: record.memory as CreateHealthSnapshotDto['memory'],
      cpu: record.cpu as CreateHealthSnapshotDto['cpu'],
      database: record.database as CreateHealthSnapshotDto['database'],
      cache: record.cache as CreateHealthSnapshotDto['cache'],
      api: record.api as CreateHealthSnapshotDto['api'],
      metadata: record.metadata,
    };
  }

  /**
   * Converts a HealthSnapshot entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(snapshot: HealthSnapshot): Omit<HealthSnapshotRecord, never> {
    return {
      snapshot_id: snapshot.snapshotId.value,
      created_at: snapshot.createdAt.toISOString(),
      memory: snapshot.memory,
      cpu: snapshot.cpu,
      database: snapshot.database,
      cache: snapshot.cache,
      api: snapshot.api,
      metadata: snapshot.metadata,
    };
  }

  /**
   * Converts a HealthSnapshot to HealthResponseDto.
   */
  public static toHealthResponse(snapshot: HealthSnapshot): HealthResponseDto {
    return {
      overallStatus: snapshot.overallStatus,
      memory: snapshot.memory,
      cpu: snapshot.cpu,
      database: snapshot.database,
      cache: snapshot.cache,
      api: snapshot.api,
      checkedAt: snapshot.createdAt.toISOString(),
      latestSnapshotId: snapshot.snapshotId.value,
    };
  }
}
