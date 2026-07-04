/**
 * HealthMapper
 *
 * Mapper for HealthCheck entity to DTO conversion.
 * Only handles mapping - no monitoring logic.
 */

import type { HealthCheck } from '../entities/HealthCheck';
import type { HealthCheckDto, CreateHealthCheckDto } from '../dto/HealthCheck.dto';
import { HealthStatus } from '../types/HealthStatus';

/**
 * Mapper for HealthCheck entity to DTO.
 */
export class HealthMapper {
  /**
   * Converts a HealthCheck entity to a HealthCheckDto.
   * @param entity The HealthCheck entity
   * @returns The HealthCheckDto
   */
  public static toDto(entity: HealthCheck): HealthCheckDto {
    return {
      healthCheckId: entity.healthCheckId.value,
      serviceName: entity.serviceName,
      status: entity.status,
      checkedAt: entity.checkedAt.toISOString(),
      responseTime: entity.responseTime,
      details: entity.details,
      metadata: entity.metadata as Record<string, unknown>,
    };
  }

  /**
   * Converts a HealthCheckDto to a CreateHealthCheckDto.
   * @param dto The HealthCheckDto
   * @returns The CreateHealthCheckDto
   */
  public static toCreateDto(dto: HealthCheckDto): CreateHealthCheckDto {
    return {
      serviceName: dto.serviceName,
      status: dto.status,
      responseTime: dto.responseTime,
      details: dto.details,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a CreateHealthCheckDto to a partial HealthCheckDto.
   * @param dto The CreateHealthCheckDto
   * @returns The partial HealthCheckDto
   */
  public static fromCreateDto(dto: CreateHealthCheckDto): Omit<HealthCheckDto, 'healthCheckId' | 'checkedAt'> {
    return {
      serviceName: dto.serviceName,
      status: dto.status,
      responseTime: dto.responseTime,
      details: dto.details,
      metadata: dto.metadata as Record<string, unknown> | undefined,
    };
  }

  /**
   * Converts an array of HealthCheck entities to DTOs.
   * @param entities The HealthCheck entities
   * @returns The HealthCheckDto array
   */
  public static toDtoArray(entities: HealthCheck[]): HealthCheckDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
