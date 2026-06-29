/**
 * Admin Service Tests
 *
 * Unit tests for the admin service.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdminService } from '../services/AdminService';
import { AdminAccount } from '../entities/AdminAccount';
import { AdminRole } from '../entities/AdminRole';
import { AdminRoleType } from '../types/AdminRoleType';
import { AdminPermissionType } from '../types/AdminPermissionType';
import { AdminStatus } from '../types/AdminStatus';
import type { IAdminRepository } from '../interfaces/IAdminRepository';
import type { AdminId } from '../value-objects/AdminId';
import type { AdminRoleId } from '../value-objects/AdminRoleId';
import type { PaginationParams } from '../../../shared/types/base.types';

// Mock repository
class MockAdminRepository implements Partial<IAdminRepository> {
  private admins: Map<string, AdminAccount> = new Map();
  private roles: Map<string, AdminRole> = new Map();

  async createAdmin(admin: AdminAccount): Promise<AdminAccount> {
    this.admins.set(admin.id.value, admin);
    return admin;
  }

  async findAdminById(id: AdminId): Promise<AdminAccount | null> {
    return this.admins.get(id.value) ?? null;
  }

  async findAdminByTelegramId(telegramId: { value: number }): Promise<AdminAccount | null> {
    for (const admin of this.admins.values()) {
      if (admin.telegramId.value === telegramId.value) {
        return admin;
      }
    }
    return null;
  }

  async updateAdmin(admin: AdminAccount): Promise<AdminAccount> {
    this.admins.set(admin.id.value, admin);
    return admin;
  }

  async updateLastLogin(id: AdminId): Promise<AdminAccount> {
    const admin = this.admins.get(id.value);
    if (!admin) throw new Error('Not found');
    return admin;
  }

  async softDeleteAdmin(id: AdminId): Promise<void> {
    this.admins.delete(id.value);
  }

  async listAdmins(params: PaginationParams, filters?: any): Promise<any> {
    const items = Array.from(this.admins.values());
    return {
      items,
      total: items.length,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  async countAdmins(filters?: any): Promise<number> {
    return this.admins.size;
  }

  async createRole(role: AdminRole): Promise<AdminRole> {
    this.roles.set(role.id.value, role);
    return role;
  }

  async findRoleById(id: AdminRoleId): Promise<AdminRole | null> {
    return this.roles.get(id.value) ?? null;
  }

  async findRoleByType(type: AdminRoleType): Promise<AdminRole | null> {
    for (const role of this.roles.values()) {
      if (role.type === type) {
        return role;
      }
    }
    return null;
  }

  async updateRole(role: AdminRole): Promise<AdminRole> {
    this.roles.set(role.id.value, role);
    return role;
  }

  async deleteRole(id: AdminRoleId): Promise<void> {
    this.roles.delete(id.value);
  }

  async listRoles(params: PaginationParams, filters?: any): Promise<any> {
    const items = Array.from(this.roles.values());
    return {
      items,
      total: items.length,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  async getSystemRoles(): Promise<AdminRole[]> {
    return Array.from(this.roles.values()).filter((r) => r.metadata.isSystemRole);
  }

  async adminExists(id: AdminId): Promise<boolean> {
    return this.admins.has(id.value);
  }
}

describe('AdminService', () => {
  let adminService: AdminService;
  let mockRepository: MockAdminRepository;
  let ownerRole: AdminRole;
  let adminRole: AdminRole;
  let ownerAdmin: AdminAccount;
  let adminAdmin: AdminAccount;

  beforeEach(() => {
    mockRepository = new MockAdminRepository();

    // Create roles
    ownerRole = AdminRole.fromType({ type: AdminRoleType.OWNER });
    adminRole = AdminRole.fromType({ type: AdminRoleType.ADMINISTRATOR });

    // Add roles to repository
    mockRepository.roles.set(ownerRole.id.value, ownerRole);
    mockRepository.roles.set(adminRole.id.value, adminRole);

    // Create admins
    ownerAdmin = AdminAccount.create({
      telegramId: 1,
      displayName: 'Owner',
      roleId: ownerRole.id.value,
      roleType: AdminRoleType.OWNER,
      status: AdminStatus.ACTIVE,
    });

    adminAdmin = AdminAccount.create({
      telegramId: 2,
      displayName: 'Admin',
      roleId: adminRole.id.value,
      roleType: AdminRoleType.ADMINISTRATOR,
      status: AdminStatus.ACTIVE,
    });

    // Add admins to repository
    mockRepository.admins.set(ownerAdmin.id.value, ownerAdmin);
    mockRepository.admins.set(adminAdmin.id.value, adminAdmin);

    adminService = new AdminService(mockRepository as any);
  });

  describe('createAdmin', () => {
    it('should throw if admin already exists', async () => {
      await expect(
        adminService.createAdmin(
          {
            telegramId: 1, // Same as ownerAdmin
            displayName: 'Duplicate',
            roleId: adminRole.id.value,
            roleType: AdminRoleType.ADMINISTRATOR,
          },
          ownerAdmin.id.value
        )
      ).rejects.toThrow();
    });

    it('should throw if role not found', async () => {
      // Use a valid UUID format that doesn't exist in the mock
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const nonExistentId = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
      
      await expect(
        adminService.createAdmin(
          {
            telegramId: 999999999,
            displayName: 'New Admin',
            roleId: nonExistentId,
            roleType: AdminRoleType.SUPPORT,
          },
          ownerAdmin.id.value
        )
      ).rejects.toThrow('Role not found');
    });
  });

  describe('enableAdmin', () => {
    it('should enable inactive admin', async () => {
      const inactiveAdmin = AdminAccount.create({
        telegramId: 100,
        displayName: 'Inactive',
        roleId: adminRole.id.value,
        roleType: AdminRoleType.ADMINISTRATOR,
        status: AdminStatus.INACTIVE,
      });
      mockRepository.admins.set(inactiveAdmin.id.value, inactiveAdmin);

      await adminService.enableAdmin(inactiveAdmin.id, ownerAdmin.id.value);

      const updated = mockRepository.admins.get(inactiveAdmin.id.value);
      expect(updated?.status).toBe(AdminStatus.ACTIVE);
    });

    it('should throw if admin not found', async () => {
      await expect(
        adminService.enableAdmin({ value: 'non-existent' } as AdminId, ownerAdmin.id.value)
      ).rejects.toThrow();
    });
  });

  describe('disableAdmin', () => {
    it('should disable admin', async () => {
      await adminService.disableAdmin(adminAdmin.id, ownerAdmin.id.value);

      const updated = mockRepository.admins.get(adminAdmin.id.value);
      expect(updated?.status).toBe(AdminStatus.INACTIVE);
    });

    it('should deny self-disable', async () => {
      await expect(
        adminService.disableAdmin(ownerAdmin.id, ownerAdmin.id.value)
      ).rejects.toThrow('Cannot disable yourself');
    });

    it('should deny non-owner from disabling owner', async () => {
      await expect(
        adminService.disableAdmin(ownerAdmin.id, adminAdmin.id.value)
      ).rejects.toThrow('Only Owner can disable another Owner');
    });
  });

  describe('assignRole', () => {
    it('should assign new role to admin', async () => {
      const supportRole = AdminRole.fromType({ type: AdminRoleType.SUPPORT });
      mockRepository.roles.set(supportRole.id.value, supportRole);

      await adminService.assignRole(adminAdmin.id, supportRole.id, ownerAdmin.id.value);

      const updated = mockRepository.admins.get(adminAdmin.id.value);
      expect(updated?.roleType).toBe(AdminRoleType.SUPPORT);
    });

    it('should deny self role change', async () => {
      const supportRole = AdminRole.fromType({ type: AdminRoleType.SUPPORT });
      mockRepository.roles.set(supportRole.id.value, supportRole);

      await expect(
        adminService.assignRole(ownerAdmin.id, supportRole.id, ownerAdmin.id.value)
      ).rejects.toThrow('Cannot change your own role');
    });
  });

  describe('hasPermission', () => {
    it('should return true for owner with any permission', async () => {
      const result = await adminService.hasPermission(ownerAdmin.id, AdminPermissionType.ADMIN_DELETE);
      expect(result).toBe(true);
    });

    it('should return false for missing permission', async () => {
      const supportRole = AdminRole.fromType({ type: AdminRoleType.SUPPORT });
      const supportAdmin = AdminAccount.create({
        telegramId: 200,
        displayName: 'Support',
        roleId: supportRole.id.value,
        roleType: AdminRoleType.SUPPORT,
        status: AdminStatus.ACTIVE,
      });
      mockRepository.admins.set(supportAdmin.id.value, supportAdmin);
      mockRepository.roles.set(supportRole.id.value, supportRole);

      const result = await adminService.hasPermission(supportAdmin.id, AdminPermissionType.ADMIN_DELETE);
      expect(result).toBe(false);
    });
  });

  describe('listAdmins', () => {
    it('should return paginated admins', async () => {
      const result = await adminService.listAdmins({ page: 1, pageSize: 10 });

      expect(result.admins).toBeDefined();
      expect(result.total).toBeGreaterThan(0);
    });
  });

  describe('getAdminSummary', () => {
    it('should return admin statistics', async () => {
      const result = await adminService.getAdminSummary();

      expect(result.statistics.totalAdmins).toBeGreaterThan(0);
      expect(result.generatedAt).toBeDefined();
    });
  });
});