/**
 * Snapshot Mapper
 *
 * Maps between IntegrationSnapshot entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { IntegrationSnapshot, type IntegrationSnapshotRecord } from '../entities/IntegrationSnapshot';
import type {
  CreateIntegrationSnapshotDto,
  IntegrationSnapshotResponseDto,
  IntegrationSnapshotListResponseDto,
} from '../dto/IntegrationSnapshot.dto';

/**
 * Mapper for converting between IntegrationSnapshot entity and DTOs.
 */
export class SnapshotMapper {
  /**
   * Converts an IntegrationSnapshot entity to IntegrationSnapshotResponseDto.
   */
  public static toResponse(snapshot: IntegrationSnapshot): IntegrationSnapshotResponseDto {
    return {
      snapshotId: snapshot.snapshotId.value,
      createdAt: snapshot.createdAt.toISOString(),
      registeredModules: snapshot.registeredModules,
      healthyModules: snapshot.healthyModules,
      failedModules: snapshot.failedModules,
      registeredCount: snapshot.registeredCount,
      healthyCount: snapshot.healthyCount,
      failedCount: snapshot.failedCount,
      healthPercentage: snapshot.healthPercentage,
      metadata: snapshot.metadata,
    };
  }

  /**
   * Converts an array of IntegrationSnapshot entities to IntegrationSnapshotResponseDto array.
   */
  public static toResponseList(snapshots: IntegrationSnapshot[]): IntegrationSnapshotResponseDto[] {
    return snapshots.map((snapshot) => this.toResponse(snapshot));
  }

  /**
   * Converts a CreateIntegrationSnapshotDto to a plain object for entity creation.
   */
  public static fromCreateDto(dto: CreateIntegrationSnapshotDto): {
    registeredModules: string[];
    healthyModules: string[];
    failedModules: string[];
    metadata: Record<string, unknown>;
  } {
    return {
      registeredModules: dto.registeredModules ?? [],
      healthyModules: dto.healthyModules ?? [],
      failedModules: dto.failedModules ?? [],
      metadata: dto.metadata ?? {},
    };
  }

  /**
   * Converts a database record to IntegrationSnapshot entity.
   */
  public static fromRecord(record: IntegrationSnapshotRecord & { created_at?: string; updated_at?: string }): IntegrationSnapshot {
    return IntegrationSnapshot.fromDatabase(record);
  }

  /**
   * Converts an IntegrationSnapshot entity to a database record format.
   */
  public static toRecord(snapshot: IntegrationSnapshot): IntegrationSnapshotRecord {
    return {
      snapshot_id: snapshot.snapshotId.value,
      created_at: snapshot.createdAt.toISOString(),
      registered_modules: snapshot.registeredModules,
      healthy_modules: snapshot.healthyModules,
      failed_modules: snapshot.failedModules,
      metadata: snapshot.metadata,
    };
  }

  /**
   * Converts paginated result to list response DTO.
   */
  public static toListResponse(
    snapshots: IntegrationSnapshot[],
    total: number,
    page: number,
    pageSize: number
  ): IntegrationSnapshotListResponseDto {
    return {
      snapshots: this.toResponseList(snapshots),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
