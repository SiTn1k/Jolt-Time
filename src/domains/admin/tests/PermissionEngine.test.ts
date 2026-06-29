/**
 * Permission Engine Tests
 *
 * Unit tests for the RBAC permission engine.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PermissionEngine } from '../services/PermissionEngine';
import { AdminAccount } from '../entities/AdminAccount';
import { AdminRole } from '../entities/AdminRole';
import { AdminRoleType, ADMIN_ROLE_PRIORITY } from '../types/AdminRoleType';
import { AdminPermissionType } from '../types/AdminPermissionType';
import { AdminStatus } from '../types/AdminStatus';

describe('PermissionEngine', () => {
  let engine: PermissionEngine;
  let ownerRole: AdminRole;
  let adminRole: AdminRole;
  let developerRole: AdminRole;
  let supportRole: AdminRole;
  let ownerAdmin: AdminAccount;
  let adminAdmin: AdminAccount;
  let supportAdmin: AdminAccount;

  beforeEach(() => {
    engine = new PermissionEngine();

    // Create roles
    ownerRole = AdminRole.fromType({ type: AdminRoleType.OWNER });
    adminRole = AdminRole.fromType({ type: AdminRoleType.ADMINISTRATOR });
    developerRole = AdminRole.fromType({ type: AdminRoleType.DEVELOPER });
    supportRole = AdminRole.fromType({ type: AdminRoleType.SUPPORT });

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

    supportAdmin = AdminAccount.create({
      telegramId: 3,
      displayName: 'Support',
      roleId: supportRole.id.value,
      roleType: AdminRoleType.SUPPORT,
      status: AdminStatus.ACTIVE,
    });
  });

  describe('checkPermission', () => {
    it('should allow owner to have all permissions', () => {
      const result = engine.checkPermission(ownerAdmin, ownerRole, AdminPermissionType.ADMIN_DELETE);
      expect(result.allowed).toBe(true);
    });

    it('should deny permission for inactive admin', () => {
      const inactiveAdmin = supportAdmin.copyWith({ status: AdminStatus.INACTIVE });
      const result = engine.checkPermission(inactiveAdmin, supportRole, AdminPermissionType.PLAYER_READ);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('not active');
    });

    it('should deny permission when role lacks it', () => {
      const result = engine.checkPermission(supportAdmin, supportRole, AdminPermissionType.ADMIN_DELETE);
      expect(result.allowed).toBe(false);
    });

    it('should allow permission when role has it', () => {
      const result = engine.checkPermission(supportAdmin, supportRole, AdminPermissionType.PLAYER_READ);
      expect(result.allowed).toBe(true);
    });
  });

  describe('checkAllPermissions', () => {
    it('should return true when admin has all permissions', () => {
      const result = engine.checkAllPermissions(ownerAdmin, ownerRole, [
        AdminPermissionType.ADMIN_DELETE,
        AdminPermissionType.CONFIG_UPDATE,
      ]);
      expect(result).toBe(true);
    });

    it('should return false when admin lacks any permission', () => {
      const result = engine.checkAllPermissions(supportAdmin, supportRole, [
        AdminPermissionType.PLAYER_READ,
        AdminPermissionType.ADMIN_DELETE,
      ]);
      expect(result).toBe(false);
    });
  });

  describe('checkAnyPermission', () => {
    it('should return true when admin has any permission', () => {
      // Support role has PLAYER_READ permission
      const result = engine.checkAnyPermission(supportAdmin, supportRole, [
        AdminPermissionType.ADMIN_DELETE,
        AdminPermissionType.PLAYER_READ,
      ]);
      expect(result).toBe(true);
    });

    it('should return false when admin has no permissions', () => {
      const result = engine.checkAnyPermission(supportAdmin, supportRole, [
        AdminPermissionType.ADMIN_DELETE,
        AdminPermissionType.CONFIG_UPDATE,
      ]);
      expect(result).toBe(false);
    });
  });

  describe('canManageRole', () => {
    it('should allow owner to manage any role', () => {
      expect(engine.canManageRole(ownerRole, adminRole)).toBe(true);
      expect(engine.canManageRole(ownerRole, supportRole)).toBe(true);
    });

    it('should allow admin to manage lower roles', () => {
      expect(engine.canManageRole(adminRole, developerRole)).toBe(true);
      expect(engine.canManageRole(adminRole, supportRole)).toBe(true);
    });

    it('should deny admin from managing owner', () => {
      expect(engine.canManageRole(adminRole, ownerRole)).toBe(false);
    });

    it('should deny support from managing any role', () => {
      expect(engine.canManageRole(supportRole, developerRole)).toBe(false);
      expect(engine.canManageRole(supportRole, adminRole)).toBe(false);
    });
  });

  describe('canManageRoleType', () => {
    it('should return correct priority comparisons', () => {
      expect(engine.canManageRoleType(AdminRoleType.OWNER, AdminRoleType.ADMINISTRATOR)).toBe(true);
      expect(engine.canManageRoleType(AdminRoleType.ADMINISTRATOR, AdminRoleType.OWNER)).toBe(false);
      expect(engine.canManageRoleType(AdminRoleType.ADMINISTRATOR, AdminRoleType.DEVELOPER)).toBe(true);
      expect(engine.canManageRoleType(AdminRoleType.DEVELOPER, AdminRoleType.ADMINISTRATOR)).toBe(false);
    });
  });

  describe('validateRoleAssignment', () => {
    it('should deny self-assignment', () => {
      const result = engine.validateRoleAssignment(ownerAdmin, ownerAdmin, adminRole);
      expect(result.allowed).toBe(false);
      expect(result.errors).toContain('Cannot change your own role');
    });

    it('should deny non-owner from assigning owner role', () => {
      const result = engine.validateRoleAssignment(adminAdmin, supportAdmin, ownerRole);
      expect(result.allowed).toBe(false);
      expect(result.errors.some((e) => e.includes('Owner role'))).toBe(true);
    });

    it('should deny lower priority admin from assigning higher role', () => {
      const result = engine.validateRoleAssignment(supportAdmin, adminAdmin, adminRole);
      expect(result.allowed).toBe(false);
      expect(result.errors.some((e) => e.includes('insufficient priority'))).toBe(true);
    });

    it('should allow valid role assignment', () => {
      const result = engine.validateRoleAssignment(ownerAdmin, adminAdmin, supportRole);
      expect(result.allowed).toBe(true);
    });
  });

  describe('validatePermissionKey', () => {
    it('should validate correct permission key format', () => {
      const result = engine.validatePermissionKey('admin:account:read');
      expect(result.valid).toBe(true);
    });

    it('should reject empty permission key', () => {
      const result = engine.validatePermissionKey('');
      expect(result.valid).toBe(false);
    });

    it('should reject permission key with invalid characters', () => {
      const result = engine.validatePermissionKey('admin:Account:READ');
      expect(result.valid).toBe(false);
    });

    it('should reject permission key with too many parts', () => {
      const result = engine.validatePermissionKey('a:b:c:d');
      expect(result.valid).toBe(false);
    });
  });

  describe('validatePermissionSet', () => {
    it('should validate valid permission set', () => {
      const result = engine.validatePermissionSet([
        AdminPermissionType.ADMIN_READ,
        AdminPermissionType.PLAYER_READ,
      ]);
      expect(result.valid).toBe(true);
    });

    it('should reject duplicate permissions', () => {
      const result = engine.validatePermissionSet([
        AdminPermissionType.ADMIN_READ,
        AdminPermissionType.ADMIN_READ,
      ]);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Duplicate'))).toBe(true);
    });

    it('should reject empty permission set', () => {
      const result = engine.validatePermissionSet([]);
      expect(result.valid).toBe(false);
    });
  });

  describe('isProtectedAdmin', () => {
    it('should return true for owner admin', () => {
      expect(engine.isProtectedAdmin(ownerAdmin)).toBe(true);
    });

    it('should return false for non-owner admin', () => {
      expect(engine.isProtectedAdmin(adminAdmin)).toBe(false);
    });
  });

  describe('isProtectedRole', () => {
    it('should return true for owner role', () => {
      expect(engine.isProtectedRole(ownerRole)).toBe(true);
    });

    it('should return true for system role', () => {
      expect(engine.isProtectedRole(adminRole)).toBe(true);
    });
  });

  describe('validateDisableAdmin', () => {
    it('should deny self-disable', () => {
      const result = engine.validateDisableAdmin(ownerAdmin, ownerAdmin);
      expect(result.allowed).toBe(false);
      expect(result.errors).toContain('Cannot disable yourself');
    });

    it('should deny non-owner from disabling owner', () => {
      const result = engine.validateDisableAdmin(adminAdmin, ownerAdmin);
      expect(result.allowed).toBe(false);
    });

    it('should allow owner to disable other admin', () => {
      const result = engine.validateDisableAdmin(ownerAdmin, adminAdmin);
      expect(result.allowed).toBe(true);
    });
  });

  describe('getMissingPermissions', () => {
    it('should return empty when permission exists', () => {
      // Support role has PLAYER_READ permission
      const missing = engine.getMissingPermissions(supportAdmin, supportRole, [
        AdminPermissionType.PLAYER_READ,
      ]);
      expect(missing).toHaveLength(0);
    });

    it('should return missing permissions correctly', () => {
      // Support role does NOT have ADMIN_READ but DOES have PLAYER_READ
      const missing = engine.getMissingPermissions(supportAdmin, supportRole, [
        AdminPermissionType.ADMIN_READ,
        AdminPermissionType.PLAYER_READ,
      ]);
      expect(missing).toContain(AdminPermissionType.ADMIN_READ);
      expect(missing).not.toContain(AdminPermissionType.PLAYER_READ);
    });
  });

  describe('getPermissionSummary', () => {
    it('should return correct summary for owner', () => {
      const summary = engine.getPermissionSummary(ownerAdmin, ownerRole);
      expect(summary.isOwner).toBe(true);
      expect(summary.isAdministrator).toBe(false);
    });

    it('should return correct summary for support', () => {
      const summary = engine.getPermissionSummary(supportAdmin, supportRole);
      expect(summary.isOwner).toBe(false);
      expect(summary.isAdministrator).toBe(false);
    });
  });
});