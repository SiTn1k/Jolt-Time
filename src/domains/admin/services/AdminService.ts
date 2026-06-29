/**
 * Admin Service
 *
 * Core business logic for admin account and role management.
 * Handles all admin operations with proper validation and security.
 */

import type { IAdminRepository } from '../interfaces/IAdminRepository';
import { AdminAccount } from '../entities/AdminAccount';
import { AdminRole } from '../entities/AdminRole';
import { AdminPermission } from '../entities/AdminPermission';
import { AdminId } from '../value-objects/AdminId';
import { AdminRoleId } from '../value-objects/AdminRoleId';
import { PermissionId } from '../value-objects/PermissionId';
import { TelegramId } from '../../user/value-objects/TelegramId';
import { AdminStatus } from '../types/AdminStatus';
import { AdminRoleType, ADMIN_ROLE_PRIORITY } from '../types/AdminRoleType';
import { AdminPermissionType, DEFAULT_ROLE_PERMISSIONS } from '../types/AdminPermissionType';
import type {
  CreateAdminAccountDto,
  UpdateAdminAccountDto,
  AdminAccountResponseDto,
  AdminAccountSummaryDto,
  AdminAccountListResponseDto,
} from '../dto/AdminAccount.dto';
import type {
  CreateAdminRoleDto,
  UpdateAdminRoleDto,
  AdminRoleResponseDto,
  AdminRoleSummaryDto,
  AdminRoleListResponseDto,
} from '../dto/AdminRole.dto';
import type { AdminStatisticsResponseDto } from '../dto/AdminResponse.dto';
import type { AdminStatistics } from '../types/AdminStatistics';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { ILogger } from '../../../shared/types';
import { getLogger } from '../../../core/logging/logger.service';
import { AdminValidator, type AdminValidationResult } from '../validators/AdminValidator';
import { RoleValidator, type RoleValidationResult } from '../validators/RoleValidator';
import { PermissionValidator } from '../validators/PermissionValidator';
import { AdminMapper } from '../mappers/AdminMapper';
import { RoleMapper } from '../mappers/RoleMapper';
import { PermissionMapper } from '../mappers/PermissionMapper';
import { createAdminCreatedEvent, type AdminCreatedEvent } from '../events/AdminCreated.event';
import { createAdminRoleChangedEvent, type AdminRoleChangedEvent } from '../events/AdminRoleChanged.event';
import { createAdminLoggedInEvent, type AdminLoggedInEvent } from '../events/AdminLoggedIn.event';
import type { EventEmitter } from '../../../core/event-bus';

/**
 * Admin Service configuration options.
 */
export interface AdminServiceOptions {
  eventEmitter?: EventEmitter;
}

/**
 * Admin Service
 *
 * Central service for all admin-related business logic.
 * Coordinates between repository, validators, and domain events.
 */
export class AdminService {
  private readonly repository: IAdminRepository;
  private readonly logger: ILogger;
  private readonly eventEmitter?: EventEmitter;
  private readonly adminMapper: typeof AdminMapper;
  private readonly roleMapper: typeof RoleMapper;
  private readonly permissionMapper: typeof PermissionMapper;

  /**
   * Creates a new AdminService instance.
   */
  constructor(
    repository: IAdminRepository,
    options?: AdminServiceOptions
  ) {
    this.repository = repository;
    this.eventEmitter = options?.eventEmitter;
    this.logger = getLogger().child({ module: 'AdminService' });
    this.adminMapper = AdminMapper;
    this.roleMapper = RoleMapper;
    this.permissionMapper = PermissionMapper;
  }

  // #region Admin Account Operations
  // ================================================================================

  /**
   * Creates a new admin account.
   * @param dto Create admin data
   * @param performedBy ID of admin performing the action
   * @returns Created admin account response
   */
  async createAdmin(
    dto: CreateAdminAccountDto,
    performedBy: string
  ): Promise<AdminAccountResponseDto> {
    // Validate input
    const validation = AdminValidator.validateCreate(dto);
    if (!validation.isValid) {
      throw this.validationError('create admin', validation);
    }

    // Check if admin with Telegram ID already exists
    const existingAdmin = await this.repository.findAdminByTelegramId(TelegramId.create(dto.telegramId));
    if (existingAdmin) {
      throw new Error(`Admin with Telegram ID ${dto.telegramId} already exists`);
    }

    // Get the role to validate and get permissions
    const role = await this.repository.findRoleById(AdminRoleId.create(dto.roleId));
    if (!role) {
      throw new Error(`Role not found: ${dto.roleId}`);
    }

    // Check if performer has permission to create admin
    const performer = await this.repository.findAdminById(AdminId.create(performedBy));
    if (!performer) {
      throw new Error('Performing admin not found');
    }

    if (!this.canManageAdmin(performer, role.roleType)) {
      throw new Error('Insufficient permissions to create admin with this role');
    }

    // Create admin account
    const admin = AdminAccount.create({
      telegramId: dto.telegramId,
      username: dto.username,
      displayName: dto.displayName,
      roleId: dto.roleId,
      roleType: dto.roleType,
      status: dto.status ?? AdminStatus.PENDING,
      metadata: {
        ...dto.metadata,
        createdBy: performedBy,
      },
    });

    const created = await this.repository.createAdmin(admin);

    // Emit event
    this.emitAdminCreated(created);

    this.logger.info('Admin created', {
      adminId: created.id.value,
      telegramId: created.telegramId.value,
      performedBy,
    });

    return this.adminMapper.toResponse(created);
  }

  /**
   * Enables an admin account.
   * @param adminId ID of admin to enable
   * @param performedBy ID of admin performing the action
   */
  async enableAdmin(adminId: AdminId, performedBy: string): Promise<void> {
    const admin = await this.getAdminOrFail(adminId);
    const performer = await this.getAdminOrFail(AdminId.create(performedBy));

    if (admin.status === AdminStatus.ACTIVE) {
      throw new Error('Admin is already active');
    }

    const updated = admin.copyWith({ status: AdminStatus.ACTIVE });
    await this.repository.updateAdmin(updated);

    this.logger.info('Admin enabled', { adminId: adminId.value, performedBy });
  }

  /**
   * Disables an admin account.
   * @param adminId ID of admin to disable
   * @param performedBy ID of admin performing the action
   */
  async disableAdmin(adminId: AdminId, performedBy: string): Promise<void> {
    const admin = await this.getAdminOrFail(adminId);
    const performer = await this.getAdminOrFail(AdminId.create(performedBy));

    // Prevent self-disable
    if (adminId.value === performedBy) {
      throw new Error('Cannot disable yourself');
    }

    // Owner cannot be disabled by non-owner
    if (admin.roleType === AdminRoleType.OWNER && performer.roleType !== AdminRoleType.OWNER) {
      throw new Error('Only Owner can disable another Owner');
    }

    const updated = admin.copyWith({ status: AdminStatus.INACTIVE });
    await this.repository.updateAdmin(updated);

    this.logger.info('Admin disabled', { adminId: adminId.value, performedBy });
  }

  /**
   * Suspends an admin account.
   * @param adminId ID of admin to suspend
   * @param performedBy ID of admin performing the action
   */
  async suspendAdmin(adminId: AdminId, performedBy: string): Promise<void> {
    const admin = await this.getAdminOrFail(adminId);
    const performer = await this.getAdminOrFail(AdminId.create(performedBy));

    // Prevent self-suspend
    if (adminId.value === performedBy) {
      throw new Error('Cannot suspend yourself');
    }

    // Owner cannot be suspended by non-owner
    if (admin.roleType === AdminRoleType.OWNER && performer.roleType !== AdminRoleType.OWNER) {
      throw new Error('Only Owner can suspend another Owner');
    }

    const updated = admin.copyWith({ status: AdminStatus.SUSPENDED });
    await this.repository.updateAdmin(updated);

    this.logger.info('Admin suspended', { adminId: adminId.value, performedBy });
  }

  /**
   * Updates an admin account.
   * @param adminId ID of admin to update
   * @param dto Update data
   * @param performedBy ID of admin performing the action
   */
  async updateAdmin(
    adminId: AdminId,
    dto: UpdateAdminAccountDto,
    performedBy: string
  ): Promise<AdminAccountResponseDto> {
    const validation = AdminValidator.validateUpdate(dto);
    if (!validation.isValid) {
      throw this.validationError('update admin', validation);
    }

    const admin = await this.getAdminOrFail(adminId);
    const updated = admin.copyWith({
      displayName: dto.displayName,
      roleId: dto.roleId ? AdminRoleId.create(dto.roleId) : undefined,
      roleType: dto.roleType,
      status: dto.status,
      metadata: dto.metadata,
    });

    const result = await this.repository.updateAdmin(updated);
    return this.adminMapper.toResponse(result);
  }

  /**
   * Assigns a role to an admin.
   * @param adminId ID of admin to update
   * @param roleId New role ID
   * @param performedBy ID of admin performing the action
   */
  async assignRole(
    adminId: AdminId,
    roleId: AdminRoleId,
    performedBy: string
  ): Promise<void> {
    const admin = await this.getAdminOrFail(adminId);
    const newRole = await this.repository.findRoleById(roleId);
    if (!newRole) {
      throw new Error(`Role not found: ${roleId.value}`);
    }

    const performer = await this.getAdminOrFail(AdminId.create(performedBy));

    // Validate role assignment hierarchy
    const validation = AdminValidator.validateRoleAssignment(performer.roleType, newRole.type);
    if (!validation.isValid) {
      throw new Error(validation.errors.map((e) => e.message).join('; '));
    }

    // Prevent self role change
    if (adminId.value === performedBy) {
      throw new Error('Cannot change your own role');
    }

    // Owner role can only be assigned by owner
    if (newRole.type === AdminRoleType.OWNER && performer.roleType !== AdminRoleType.OWNER) {
      throw new Error('Only Owner can assign Owner role');
    }

    const previousRoleId = admin.roleId;
    const previousRoleType = admin.roleType;

    const updated = admin.copyWith({
      roleId,
      roleType: newRole.type,
    });

    await this.repository.updateAdmin(updated);

    // Emit role changed event
    this.emitRoleChanged(admin, previousRoleId, newRole, performedBy);

    this.logger.info('Admin role assigned', {
      adminId: adminId.value,
      newRoleId: roleId.value,
      performedBy,
    });
  }

  /**
   * Removes an admin account (soft delete).
   * @param adminId ID of admin to remove
   * @param performedBy ID of admin performing the action
   */
  async removeAdmin(adminId: AdminId, performedBy: string): Promise<void> {
    const admin = await this.getAdminOrFail(adminId);
    const performer = await this.getAdminOrFail(AdminId.create(performedBy));

    // Prevent self removal
    if (adminId.value === performedBy) {
      throw new Error('Cannot remove yourself');
    }

    // Owner cannot be removed by non-owner
    if (admin.roleType === AdminRoleType.OWNER && performer.roleType !== AdminRoleType.OWNER) {
      throw new Error('Only Owner can remove another Owner');
    }

    await this.repository.softDeleteAdmin(adminId);

    this.logger.info('Admin removed', { adminId: adminId.value, performedBy });
  }

  /**
   * Gets an admin by ID.
   */
  async getAdmin(adminId: AdminId): Promise<AdminAccountResponseDto | null> {
    const admin = await this.repository.findAdminById(adminId);
    return admin ? this.adminMapper.toResponse(admin) : null;
  }

  /**
   * Gets an admin by Telegram ID.
   */
  async getAdminByTelegramId(telegramId: TelegramId): Promise<AdminAccountResponseDto | null> {
    const admin = await this.repository.findAdminByTelegramId(telegramId);
    return admin ? this.adminMapper.toResponse(admin) : null;
  }

  /**
   * Lists admins with pagination.
   */
  async listAdmins(
    params: PaginationParams,
    filters?: { status?: AdminStatus; roleType?: AdminRoleType }
  ): Promise<AdminAccountListResponseDto> {
    const result = await this.repository.listAdmins(params, filters);
    return this.adminMapper.toListResponse(
      result.items,
      result.total,
      result.page,
      result.pageSize
    );
  }

  /**
   * Gets admin summary statistics.
   */
  async getAdminSummary(): Promise<AdminStatisticsResponseDto> {
    const totalAdmins = await this.repository.countAdmins();
    const activeAdmins = await this.repository.countAdmins({ status: AdminStatus.ACTIVE });
    const pendingAdmins = await this.repository.countAdmins({ status: AdminStatus.PENDING });
    const suspendedAdmins = await this.repository.countAdmins({ status: AdminStatus.SUSPENDED });

    const statistics: AdminStatistics = {
      totalAdmins,
      activeAdmins,
      pendingAdmins,
      suspendedAdmins,
      adminsByRole: {} as Record<AdminRoleType, number>,
    };

    // Count by role
    for (const roleType of Object.values(AdminRoleType)) {
      const count = await this.repository.countAdmins({ roleType });
      statistics.adminsByRole[roleType] = count;
    }

    return {
      statistics,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Updates last login timestamp.
   */
  async updateLastLogin(adminId: AdminId): Promise<void> {
    await this.repository.updateLastLogin(adminId);
    this.emitLogin(adminId);
  }

  // ================================================================================
  // #endregion

  // #region Role Operations
  // ================================================================================

  /**
   * Creates a new admin role.
   */
  async createRole(
    dto: CreateAdminRoleDto,
    performedBy: string
  ): Promise<AdminRoleResponseDto> {
    const validation = RoleValidator.validateCreate(dto);
    if (!validation.isValid) {
      throw this.validationError('create role', validation);
    }

    // Only owner or administrator can create roles
    const performer = await this.repository.findAdminById(AdminId.create(performedBy));
    if (!performer || performer.roleType === AdminRoleType.SUPPORT || performer.roleType === AdminRoleType.MODERATOR) {
      throw new Error('Insufficient permissions to create roles');
    }

    // Use default permissions for system roles if not provided
    const permissions = dto.permissions.length > 0
      ? dto.permissions
      : (dto.type ? DEFAULT_ROLE_PERMISSIONS[dto.type] ?? [] : []);

    const role = AdminRole.create({
      name: dto.name,
      type: dto.type,
      priority: dto.priority,
      permissions,
      metadata: dto.metadata,
      createdBy: performedBy,
    });

    const created = await this.repository.createRole(role);

    this.logger.info('Role created', { roleId: created.id.value, roleName: created.name, performedBy });

    return this.roleMapper.toResponse(created);
  }

  /**
   * Updates an existing role.
   */
  async updateRole(
    roleId: AdminRoleId,
    dto: UpdateAdminRoleDto,
    performedBy: string
  ): Promise<AdminRoleResponseDto> {
    const validation = RoleValidator.validateUpdate(dto);
    if (!validation.isValid) {
      throw this.validationError('update role', validation);
    }

    const role = await this.repository.findRoleById(roleId);
    if (!role) {
      throw new Error(`Role not found: ${roleId.value}`);
    }

    const performer = await this.repository.findAdminById(AdminId.create(performedBy));
    if (!performer || performer.roleType === AdminRoleType.SUPPORT || performer.roleType === AdminRoleType.MODERATOR) {
      throw new Error('Insufficient permissions to update roles');
    }

    const updated = role.copyWith({
      name: dto.name,
      priority: dto.priority,
      permissions: dto.permissions,
      metadata: dto.metadata,
    });

    const result = await this.repository.updateRole(updated);

    this.logger.info('Role updated', { roleId: roleId.value, performedBy });

    return this.roleMapper.toResponse(result);
  }

  /**
   * Deletes a role.
   */
  async deleteRole(roleId: AdminRoleId, performedBy: string): Promise<void> {
    const role = await this.repository.findRoleById(roleId);
    if (!role) {
      throw new Error(`Role not found: ${roleId.value}`);
    }

    const validation = RoleValidator.validateRoleDeletion(role.type, role.metadata.isSystemRole);
    if (!validation.isValid) {
      throw new Error(validation.errors.map((e) => e.message).join('; '));
    }

    const performer = await this.repository.findAdminById(AdminId.create(performedBy));
    if (!performer || performer.roleType !== AdminRoleType.OWNER) {
      throw new Error('Only Owner can delete roles');
    }

    await this.repository.deleteRole(roleId);

    this.logger.info('Role deleted', { roleId: roleId.value, performedBy });
  }

  /**
   * Gets a role by ID.
   */
  async getRole(roleId: AdminRoleId): Promise<AdminRoleResponseDto | null> {
    const role = await this.repository.findRoleById(roleId);
    return role ? this.roleMapper.toResponse(role) : null;
  }

  /**
   * Lists all roles.
   */
  async listRoles(params: PaginationParams): Promise<AdminRoleListResponseDto> {
    const result = await this.repository.listRoles(params);
    return {
      roles: result.items.map((r) => this.roleMapper.toResponse(r)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }

  /**
   * Gets all system roles.
   */
  async getSystemRoles(): Promise<AdminRoleResponseDto[]> {
    const roles = await this.repository.getSystemRoles();
    return roles.map((r) => this.roleMapper.toResponse(r));
  }

  // ================================================================================
  // #endregion

  // #region Permission Check
  // ================================================================================

  /**
   * Checks if an admin has a specific permission.
   */
  async hasPermission(adminId: AdminId, permission: AdminPermissionType): Promise<boolean> {
    const admin = await this.repository.findAdminById(adminId);
    if (!admin || !admin.isActive()) {
      return false;
    }

    const role = await this.repository.findRoleById(admin.roleId);
    if (!role) {
      return false;
    }

    return role.hasPermission(permission);
  }

  /**
   * Checks if an admin has all specified permissions.
   */
  async hasAllPermissions(adminId: AdminId, permissions: AdminPermissionType[]): Promise<boolean> {
    for (const permission of permissions) {
      if (!(await this.hasPermission(adminId, permission))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if an admin has any of the specified permissions.
   */
  async hasAnyPermission(adminId: AdminId, permissions: AdminPermissionType[]): Promise<boolean> {
    for (const permission of permissions) {
      if (await this.hasPermission(adminId, permission)) {
        return true;
      }
    }
    return false;
  }

  // ================================================================================
  // #endregion

  // #region Private Helper Methods
  // ================================================================================

  /**
   * Gets an admin or throws if not found.
   */
  private async getAdminOrFail(adminId: AdminId): Promise<AdminAccount> {
    const admin = await this.repository.findAdminById(adminId);
    if (!admin) {
      throw new Error(`Admin not found: ${adminId.value}`);
    }
    return admin;
  }

  /**
   * Checks if performer can manage admins with target role.
   */
  private canManageAdmin(performer: AdminAccount, targetRoleType: AdminRoleType): boolean {
    const performerPriority = ADMIN_ROLE_PRIORITY[performer.roleType];
    const targetPriority = ADMIN_ROLE_PRIORITY[targetRoleType];

    // Can only manage roles with lower or equal priority
    return performerPriority > targetPriority;
  }

  /**
   * Creates a validation error from result.
   */
  private validationError(operation: string, result: AdminValidationResult): Error {
    const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
    return new Error(`${operation} validation failed: ${messages}`);
  }

  /**
   * Emits admin created event.
   */
  private emitAdminCreated(admin: AdminAccount): void {
    if (!this.eventEmitter) return;

    const event = createAdminCreatedEvent({
      adminId: admin.id,
      telegramId: admin.telegramId,
      username: admin.username,
      displayName: admin.displayName,
      roleId: admin.roleId.value,
      roleType: admin.roleType,
      status: admin.status,
    });

    this.eventEmitter.emit('admin:created', event);
  }

  /**
   * Emits role changed event.
   */
  private emitRoleChanged(
    admin: AdminAccount,
    previousRoleId: AdminRoleId,
    newRole: AdminRole,
    performedBy: string
  ): void {
    if (!this.eventEmitter) return;

    const event = createAdminRoleChangedEvent({
      adminId: admin.id,
      previousRoleId,
      newRoleId: newRole.id,
      previousRoleType: admin.roleType,
      newRoleType: newRole.type,
      changedBy: performedBy,
    });

    this.eventEmitter.emit('admin:role-changed', event);
  }

  /**
   * Emits login event.
   */
  private emitLogin(adminId: AdminId): void {
    if (!this.eventEmitter) return;

    const event = createAdminLoggedInEvent({
      adminId,
      sessionId: `session-${Date.now()}`,
      loginMethod: 'telegram',
    });

    this.eventEmitter.emit('admin:logged-in', event);
  }

  // ================================================================================
  // #endregion
}