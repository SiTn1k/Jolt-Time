/**
 * MetricMapper
 *
 * Mapper for SystemMetric entity to DTO conversion.
 * Only handles mapping - no monitoring logic.
 */

import type { SystemMetric } from '../entities/SystemMetric';
import type { SystemMetricDto, CreateSystemMetricDto } from '../dto/SystemMetric.dto';
import { MetricUnit } from '../types/MetricUnit';

/**
 * Mapper for SystemMetric entity to DTO.
 */
export class MetricMapper {
  /**
   * Converts a SystemMetric entity to a SystemMetricDto.
   * @param entity The SystemMetric entity
   * @returns The SystemMetricDto
   */
  public static toDto(entity: SystemMetric): SystemMetricDto {
    return {
      metricId: entity.metricId.value,
      metricName: entity.metricName,
      metricValue: entity.metricValue,
      unit: entity.unit,
      recordedAt: entity.recordedAt.toISOString(),
      metadata: entity.metadata as Record<string, unknown>,
    };
  }

  /**
   * Converts a SystemMetricDto to a CreateSystemMetricDto.
   * @param dto The SystemMetricDto
   * @returns The CreateSystemMetricDto
   */
  public static toCreateDto(dto: SystemMetricDto): CreateSystemMetricDto {
    return {
      metricName: dto.metricName,
      metricValue: dto.metricValue,
      unit: dto.unit,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a CreateSystemMetricDto to a partial SystemMetricDto.
   * @param dto The CreateSystemMetricDto
   * @returns The partial SystemMetricDto
   */
  public static fromCreateDto(dto: CreateSystemMetricDto): Omit<SystemMetricDto, 'metricId' | 'recordedAt'> {
    return {
      metricName: dto.metricName,
      metricValue: dto.metricValue,
      unit: dto.unit,
      metadata: dto.metadata as Record<string, unknown> | undefined,
    };
  }

  /**
   * Converts an array of SystemMetric entities to DTOs.
   * @param entities The SystemMetric entities
   * @returns The SystemMetricDto array
   */
  public static toDtoArray(entities: SystemMetric[]): SystemMetricDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
