/**
 * Admin Mapper
 *
 * Maps between AdminAccount entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { AdminAccount, type AdminAccountRecord } from '../entities/AdminAccount';
import type {
  CreateAdminAccountDto,
  UpdateAdminAccountDto,
  AdminAccountResponseDto,
  AdminAccountSummaryDto,
  AdminAccountListResponseDto,
} from '../dto/AdminAccount.dto';

/**
 * Mapper for converting between AdminAccount entity and DTOs.
 */
export class AdminMapper {
  /**
   * Converts an AdminAccount entity to AdminAccountResponseDto.
   */
  public static toResponse(admin: AdminAccount): AdminAccountResponseDto {
    return {
      id: admin.id.value,
      telegramId: admin.telegramId.value,
      username: admin.username,
      displayName: admin.displayName,
      roleId: admin.roleId.value,
      roleType: admin.roleType,
      status: admin.status,
      lastLoginAt: admin.lastLoginAt?.toISOString() ?? null,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
      metadata: admin.metadata,
    };
  }

  /**
   * Converts an AdminAccount entity to AdminAccountSummaryDto.
   */
  public static toSummary(admin: AdminAccount): AdminAccountSummaryDto {
    return {
      id: admin.id.value,
      username: admin.username,
      displayName: admin.displayName,
      roleType: admin.roleType,
      status: admin.status,
    };
  }

  /**
   * Converts an array of AdminAccount entities to AdminAccountResponseDto array.
   */
  public static toResponseList(admins: AdminAccount[]): AdminAccountResponseDto[] {
    return admins.map((admin) => this.toResponse(admin));
  }

  /**
   * Converts a CreateAdminAccountDto to partial admin props.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateAdminAccountDto): CreateAdminAccountDto {
    return {
      telegramId: dto.telegramId,
      username: dto.username,
      displayName: dto.displayName,
      roleId: dto.roleId,
      roleType: dto.roleType,
      status: dto.status,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateAdminAccountDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateAdminAccountDto): Partial<AdminAccount> {
    return {
      displayName: dto.displayName as unknown as AdminAccount['displayName'],
      roleId: dto.roleId as unknown as AdminAccount['roleId'],
      roleType: dto.roleType as unknown as AdminAccount['roleType'],
      status: dto.status as unknown as AdminAccount['status'],
      metadata: dto.metadata as unknown as AdminAccount['metadata'],
    } as Partial<AdminAccount>;
  }

  /**
   * Converts a database record to AdminAccount entity.
   */
  public static fromRecord(record: AdminAccountRecord): AdminAccount {
    return AdminAccount.fromDatabase(record);
  }

  /**
   * Converts an AdminAccount entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(admin: AdminAccount): AdminAccountRecord {
    return {
      id: admin.id.value,
      telegram_id: admin.telegramId.value,
      username: admin.username,
      display_name: admin.displayName,
      role_id: admin.roleId.value,
      role_type: admin.roleType,
      status: admin.status,
      last_login_at: admin.lastLoginAt?.toISOString() ?? null,
      created_at: admin.createdAt.toISOString(),
      updated_at: admin.updatedAt.toISOString(),
      metadata: admin.metadata,
    };
  }

  /**
   * Converts paginated result to list response DTO.
   */
  public static toListResponse(
    admins: AdminAccount[],
    total: number,
    page: number,
    pageSize: number
  ): AdminAccountListResponseDto {
    return {
      admins: this.toResponseList(admins),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}