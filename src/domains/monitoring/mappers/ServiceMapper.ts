/**
 * ServiceMapper
 *
 * Mapper for ServiceStatus entity to DTO conversion.
 * Only handles mapping - no monitoring logic.
 */

import type { ServiceStatus } from '../entities/ServiceStatus';
import type { ServiceStatusDto, CreateServiceStatusDto } from '../dto/ServiceStatus.dto';

/**
 * Mapper for ServiceStatus entity to DTO.
 */
export class ServiceMapper {
  /**
   * Converts a ServiceStatus entity to a ServiceStatusDto.
   * @param entity The ServiceStatus entity
   * @returns The ServiceStatusDto
   */
  public static toDto(entity: ServiceStatus): ServiceStatusDto {
    return {
      serviceId: entity.serviceId.value,
      serviceName: entity.serviceName,
      status: entity.status,
      lastHeartbeat: entity.lastHeartbeat.toISOString(),
      version: entity.version,
      metadata: entity.metadata as Record<string, unknown>,
    };
  }

  /**
   * Converts a ServiceStatusDto to a CreateServiceStatusDto.
   * @param dto The ServiceStatusDto
   * @returns The CreateServiceStatusDto
   */
  public static toCreateDto(dto: ServiceStatusDto): CreateServiceStatusDto {
    return {
      serviceName: dto.serviceName,
      status: dto.status,
      version: dto.version,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a CreateServiceStatusDto to a partial ServiceStatusDto.
   * @param dto The CreateServiceStatusDto
   * @returns The partial ServiceStatusDto
   */
  public static fromCreateDto(dto: CreateServiceStatusDto): Omit<ServiceStatusDto, 'serviceId' | 'lastHeartbeat'> {
    return {
      serviceName: dto.serviceName,
      status: dto.status,
      version: dto.version,
      metadata: dto.metadata as Record<string, unknown> | undefined,
    };
  }

  /**
   * Converts an array of ServiceStatus entities to DTOs.
   * @param entities The ServiceStatus entities
   * @returns The ServiceStatusDto array
   */
  public static toDtoArray(entities: ServiceStatus[]): ServiceStatusDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
