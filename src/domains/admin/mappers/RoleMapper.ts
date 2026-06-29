/**
 * Role Mapper
 *
 * Maps between AdminRole entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { AdminRole, type AdminRoleRecord } from '../entities/AdminRole';
import type {
  CreateAdminRoleDto,
  UpdateAdminRoleDto,
  AdminRoleResponseDto,
  AdminRoleSummaryDto,
  AdminRoleListResponseDto,
} from '../dto/AdminRole.dto';

/**
 * Mapper for converting between AdminRole entity and DTOs.
 */
export class RoleMapper {
  /**
   * Converts an AdminRole entity to AdminRoleResponseDto.
   */
  public static toResponse(role: AdminRole): AdminRoleResponseDto {
    return {
      id: role.id.value,
      name: role.name,
      type: role.type,
      priority: role.priority,
      permissions: Array.from(role.permissions),
      metadata: role.metadata,
    };
  }

  /**
   * Converts an AdminRole entity to AdminRoleSummaryDto.
   */
  public static toSummary(role: AdminRole): AdminRoleSummaryDto {
    return {
      id: role.id.value,
      name: role.name,
      type: role.type,
      priority: role.priority,
    };
  }

  /**
   * Converts an array of AdminRole entities to AdminRoleResponseDto array.
   */
  public static toResponseList(roles: AdminRole[]): AdminRoleResponseDto[] {
    return roles.map((role) => this.toResponse(role));
  }

  /**
   * Converts a CreateAdminRoleDto to partial role props.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateAdminRoleDto): CreateAdminRoleDto {
    return {
      name: dto.name,
      type: dto.type,
      priority: dto.priority,
      permissions: [...dto.permissions],
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateAdminRoleDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateAdminRoleDto): Partial<AdminRole> {
    return {
      name: dto.name as unknown as AdminRole['name'],
      priority: dto.priority as unknown as AdminRole['priority'],
      permissions: dto.permissions as unknown as AdminRole['permissions'],
      metadata: dto.metadata as unknown as AdminRole['metadata'],
    } as Partial<AdminRole>;
  }

  /**
   * Converts a database record to AdminRole entity.
   */
  public static fromRecord(record: AdminRoleRecord): AdminRole {
    return AdminRole.fromDatabase(record);
  }

  /**
   * Converts an AdminRole entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(role: AdminRole): AdminRoleRecord {
    return {
      id: role.id.value,
      name: role.name,
      type: role.type,
      priority: role.priority,
      permissions: Array.from(role.permissions),
      metadata: role.metadata,
    };
  }

  /**
   * Converts paginated result to list response DTO.
   */
  public static toListResponse(
    roles: AdminRole[],
    total: number,
    page: number,
    pageSize: number
  ): AdminRoleListResponseDto {
    return {
      roles: this.toResponseList(roles),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}