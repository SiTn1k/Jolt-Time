/**
 * Snapshot Mapper
 *
 * Maps between PerformanceSnapshot entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { PerformanceSnapshot, PerformanceSnapshotRecord } from '../entities/PerformanceSnapshot';
import type { CreatePerformanceSnapshotDto, PerformanceSnapshotResponseDto } from '../dto/PerformanceSnapshot.dto';

/**
 * Mapper for converting between PerformanceSnapshot entity and DTOs.
 */
export class SnapshotMapper {
  /**
   * Converts a PerformanceSnapshot entity to PerformanceSnapshotResponseDto.
   */
  public static toResponse(snapshot: PerformanceSnapshot): PerformanceSnapshotResponseDto {
    return {
      snapshotId: snapshot.snapshotId.value,
      createdAt: snapshot.createdAt.toISOString(),
      executionTime: snapshot.executionTime,
      memoryUsage: snapshot.memoryUsage,
      cacheHitRate: snapshot.cacheHitRate,
      databaseQueries: snapshot.databaseQueries,
      metadata: snapshot.metadata,
    };
  }

  /**
   * Converts an array of PerformanceSnapshot entities to PerformanceSnapshotResponseDto array.
   */
  public static toResponseList(snapshots: PerformanceSnapshot[]): PerformanceSnapshotResponseDto[] {
    return snapshots.map((snapshot) => this.toResponse(snapshot));
  }

  /**
   * Converts a CreatePerformanceSnapshotDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreatePerformanceSnapshotDto): Omit<CreatePerformanceSnapshotDto, never> {
    return {
      executionTime: dto.executionTime,
      memoryUsage: dto.memoryUsage,
      cacheHitRate: dto.cacheHitRate,
      databaseQueries: dto.databaseQueries,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreatePerformanceSnapshotDto format.
   */
  public static fromRecordToDto(record: PerformanceSnapshotRecord): CreatePerformanceSnapshotDto {
    return {
      executionTime: record.execution_time,
      memoryUsage: record.memory_usage,
      cacheHitRate: record.cache_hit_rate,
      databaseQueries: record.database_queries,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a PerformanceSnapshot entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(snapshot: PerformanceSnapshot): Omit<PerformanceSnapshotRecord, never> {
    return {
      snapshot_id: snapshot.snapshotId.value,
      created_at: snapshot.createdAt.toISOString(),
      execution_time: snapshot.executionTime,
      memory_usage: snapshot.memoryUsage,
      cache_hit_rate: snapshot.cacheHitRate,
      database_queries: snapshot.databaseQueries,
      metadata: snapshot.metadata,
    };
  }
}
