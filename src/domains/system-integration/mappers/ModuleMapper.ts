/**
 * Module Mapper
 *
 * Maps between SystemModule entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { SystemModule, type SystemModuleRecord, type ModuleDependency } from '../entities/SystemModule';
import type {
  CreateSystemModuleDto,
  UpdateSystemModuleDto,
  SystemModuleResponseDto,
  SystemModuleSummaryDto,
  SystemModuleListResponseDto,
  ModuleDependencyDto,
} from '../dto/SystemModule.dto';

/**
 * Mapper for converting between SystemModule entity and DTOs.
 */
export class ModuleMapper {
  /**
   * Converts a ModuleDependency to DTO.
   */
  public static dependencyToDto(dependency: ModuleDependency): ModuleDependencyDto {
    return {
      moduleId: dependency.moduleId,
      moduleName: dependency.moduleName,
      status: dependency.status,
      isOptional: dependency.isOptional,
    };
  }

  /**
   * Converts a ModuleDependencyDto to entity format.
   */
  public static dependencyFromDto(dto: ModuleDependencyDto): ModuleDependency {
    return {
      moduleId: dto.moduleId,
      moduleName: dto.moduleName,
      status: dto.status,
      isOptional: dto.isOptional,
    };
  }

  /**
   * Converts a SystemModule entity to SystemModuleResponseDto.
   */
  public static toResponse(module: SystemModule): SystemModuleResponseDto {
    return {
      moduleId: module.moduleId.value,
      moduleName: module.moduleName,
      moduleVersion: module.moduleVersion,
      status: module.status,
      dependencies: module.dependencies.map((dep) => this.dependencyToDto(dep)),
      metadata: module.metadata,
      createdAt: module.createdAt.toISOString(),
      updatedAt: module.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a SystemModule entity to SystemModuleSummaryDto.
   */
  public static toSummary(module: SystemModule): SystemModuleSummaryDto {
    return {
      moduleId: module.moduleId.value,
      moduleName: module.moduleName,
      status: module.status,
    };
  }

  /**
   * Converts an array of SystemModule entities to SystemModuleResponseDto array.
   */
  public static toResponseList(modules: SystemModule[]): SystemModuleResponseDto[] {
    return modules.map((module) => this.toResponse(module));
  }

  /**
   * Converts a CreateSystemModuleDto to a plain object for entity creation.
   */
  public static fromCreateDto(dto: CreateSystemModuleDto): {
    moduleName: string;
    moduleVersion?: string;
    status?: string;
    dependencies: ModuleDependency[];
    metadata: Record<string, unknown>;
  } {
    return {
      moduleName: dto.moduleName,
      moduleVersion: dto.moduleVersion,
      status: dto.status,
      dependencies: dto.dependencies?.map((dep) => this.dependencyFromDto(dep)) ?? [],
      metadata: dto.metadata ?? {},
    };
  }

  /**
   * Converts an UpdateSystemModuleDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateSystemModuleDto): Partial<{
    moduleName: string;
    moduleVersion: string;
    status: string;
    dependencies: ModuleDependency[];
    metadata: Record<string, unknown>;
  }> {
    return {
      moduleName: dto.moduleName,
      moduleVersion: dto.moduleVersion,
      status: dto.status,
      dependencies: dto.dependencies?.map((dep) => this.dependencyFromDto(dep)),
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to SystemModule entity.
   */
  public static fromRecord(record: SystemModuleRecord & { created_at?: string; updated_at?: string }): SystemModule {
    return SystemModule.fromDatabase(record);
  }

  /**
   * Converts a SystemModule entity to a database record format.
   */
  public static toRecord(module: SystemModule): SystemModuleRecord {
    return {
      module_id: module.moduleId.value,
      module_name: module.moduleName,
      module_version: module.moduleVersion,
      status: module.status,
      dependencies: module.dependencies,
      metadata: module.metadata,
      created_at: module.createdAt.toISOString(),
      updated_at: module.updatedAt.toISOString(),
    };
  }

  /**
   * Converts paginated result to list response DTO.
   */
  public static toListResponse(
    modules: SystemModule[],
    total: number,
    page: number,
    pageSize: number
  ): SystemModuleListResponseDto {
    return {
      modules: this.toResponseList(modules),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
