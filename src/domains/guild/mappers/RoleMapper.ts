/**
 * Role Mapper
 *
 * Maps between GuildRole entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { GuildRole } from '../entities/GuildRole';
import type { GuildRoleRecord } from '../entities/GuildRole';
import type { GuildRoleDto, CreateGuildRoleDto } from '../dto/GuildRole.dto';

/**
 * Mapper for converting between GuildRole entity and DTOs.
 */
export class RoleMapper {
  /**
   * Converts a GuildRole entity to GuildRoleDto.
   */
  public static toDto(role: GuildRole): GuildRoleDto {
    return {
      roleId: String(role.roleId),
      name: role.name,
      roleType: role.metadata.roleType as 'leader' | 'officer' | 'member',
      permissions: role.permissions,
      priority: role.priority,
    };
  }

  /**
   * Converts a GuildRole entity to a database record format.
   */
  public static toRecord(role: GuildRole): GuildRoleRecord {
    return role.toRecord();
  }

  /**
   * Converts a database record to GuildRoleDto.
   */
  public static fromRecordToDto(record: GuildRoleRecord): GuildRoleDto {
    return {
      roleId: record.roleId,
      name: record.name,
      roleType: record.metadata.roleType as 'leader' | 'officer' | 'member',
      permissions: record.permissions,
      priority: record.priority,
    };
  }

  /**
   * Validates and extracts role type from CreateGuildRoleDto.
   */
  public static fromCreateDto(dto: CreateGuildRoleDto): {
    name: string;
    roleType: 'leader' | 'officer' | 'member';
  } {
    return {
      name: dto.name,
      roleType: dto.roleType,
    };
  }
}
