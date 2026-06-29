/**
 * Permission Mapper
 *
 * Maps between AdminPermission entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { AdminPermission, type AdminPermissionRecord } from '../entities/AdminPermission';
import type {
  CreateAdminPermissionDto,
  UpdateAdminPermissionDto,
  AdminPermissionResponseDto,
  AdminPermissionSummaryDto,
  AdminPermissionListResponseDto,
} from '../dto/AdminPermission.dto';

/**
 * Mapper for converting between AdminPermission entity and DTOs.
 */
export class PermissionMapper {
  /**
   * Converts an AdminPermission entity to AdminPermissionResponseDto.
   */
  public static toResponse(permission: AdminPermission): AdminPermissionResponseDto {
    return {
      id: permission.id.value,
      permissionKey: permission.permissionKey,
      description: permission.description,
      module: permission.module,
      metadata: permission.metadata,
    };
  }

  /**
   * Converts an AdminPermission entity to AdminPermissionSummaryDto.
   */
  public static toSummary(permission: AdminPermission): AdminPermissionSummaryDto {
    return {
      id: permission.id.value,
      permissionKey: permission.permissionKey,
      description: permission.description,
      module: permission.module,
    };
  }

  /**
   * Converts an array of AdminPermission entities to AdminPermissionResponseDto array.
   */
  public static toResponseList(permissions: AdminPermission[]): AdminPermissionResponseDto[] {
    return permissions.map((permission) => this.toResponse(permission));
  }

  /**
   * Converts a CreateAdminPermissionDto to partial permission props.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateAdminPermissionDto): CreateAdminPermissionDto {
    return {
      permissionKey: dto.permissionKey,
      description: dto.description,
      module: dto.module,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateAdminPermissionDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateAdminPermissionDto): Partial<AdminPermission> {
    return {
      description: dto.description as unknown as AdminPermission['description'],
      module: dto.module as unknown as AdminPermission['module'],
      metadata: dto.metadata as unknown as AdminPermission['metadata'],
    } as Partial<AdminPermission>;
  }

  /**
   * Converts a database record to AdminPermission entity.
   */
  public static fromRecord(record: AdminPermissionRecord): AdminPermission {
    return AdminPermission.fromDatabase(record);
  }

  /**
   * Converts an AdminPermission entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(permission: AdminPermission): AdminPermissionRecord {
    return {
      id: permission.id.value,
      permission_key: permission.permissionKey,
      description: permission.description,
      module: permission.module,
      metadata: permission.metadata,
    };
  }

  /**
   * Converts paginated result to list response DTO.
   */
  public static toListResponse(
    permissions: AdminPermission[],
    total: number,
    page: number,
    pageSize: number
  ): AdminPermissionListResponseDto {
    return {
      permissions: this.toResponseList(permissions),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}