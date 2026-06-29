/**
 * Admin Validator Tests
 *
 * Unit tests for admin validators.
 */

import { describe, it, expect } from 'vitest';
import { AdminValidator } from '../validators/AdminValidator';
import { RoleValidator } from '../validators/RoleValidator';
import { AdminRoleType } from '../types/AdminRoleType';
import { AdminStatus } from '../types/AdminStatus';
import { AdminPermissionType } from '../types/AdminPermissionType';

describe('AdminValidator', () => {
  describe('validateCreate', () => {
    it('should pass with valid data', () => {
      const result = AdminValidator.validateCreate({
        telegramId: 123456789,
        displayName: 'Test Admin',
        roleId: 'role-123',
        roleType: AdminRoleType.SUPPORT,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail with missing telegramId', () => {
      const result = AdminValidator.validateCreate({
        telegramId: undefined as any,
        displayName: 'Test Admin',
        roleId: 'role-123',
        roleType: AdminRoleType.SUPPORT,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'telegramId')).toBe(true);
    });

    it('should fail with invalid telegramId', () => {
      const result = AdminValidator.validateCreate({
        telegramId: -1,
        displayName: 'Test Admin',
        roleId: 'role-123',
        roleType: AdminRoleType.SUPPORT,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'telegramId')).toBe(true);
    });

    it('should fail with empty displayName', () => {
      const result = AdminValidator.validateCreate({
        telegramId: 123456789,
        displayName: '',
        roleId: 'role-123',
        roleType: AdminRoleType.SUPPORT,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'displayName')).toBe(true);
    });

    it('should fail with invalid roleType', () => {
      const result = AdminValidator.validateCreate({
        telegramId: 123456789,
        displayName: 'Test Admin',
        roleId: 'role-123',
        roleType: 'invalid' as AdminRoleType,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'roleType')).toBe(true);
    });

    it('should fail with invalid status', () => {
      const result = AdminValidator.validateCreate({
        telegramId: 123456789,
        displayName: 'Test Admin',
        roleId: 'role-123',
        roleType: AdminRoleType.SUPPORT,
        status: 'invalid' as AdminStatus,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'status')).toBe(true);
    });

    it('should validate optional username', () => {
      const result = AdminValidator.validateCreate({
        telegramId: 123456789,
        username: 'testuser',
        displayName: 'Test Admin',
        roleId: 'role-123',
        roleType: AdminRoleType.SUPPORT,
      });

      expect(result.isValid).toBe(true);
    });

    it('should fail with too long displayName', () => {
      const result = AdminValidator.validateCreate({
        telegramId: 123456789,
        displayName: 'a'.repeat(256),
        roleId: 'role-123',
        roleType: AdminRoleType.SUPPORT,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'displayName')).toBe(true);
    });
  });

  describe('validateUpdate', () => {
    it('should pass with valid partial data', () => {
      const result = AdminValidator.validateUpdate({
        displayName: 'Updated Name',
      });

      expect(result.isValid).toBe(true);
    });

    it('should pass with empty update (no changes)', () => {
      const result = AdminValidator.validateUpdate({});
      expect(result.isValid).toBe(true);
    });

    it('should fail with empty displayName update', () => {
      const result = AdminValidator.validateUpdate({
        displayName: '',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'displayName')).toBe(true);
    });

    it('should validate roleType update', () => {
      const result = AdminValidator.validateUpdate({
        roleType: AdminRoleType.MODERATOR,
      });

      expect(result.isValid).toBe(true);
    });

    it('should validate status update', () => {
      const result = AdminValidator.validateUpdate({
        status: AdminStatus.ACTIVE,
      });

      expect(result.isValid).toBe(true);
    });
  });

  describe('validateStatusTransition', () => {
    it('should allow PENDING to ACTIVE', () => {
      const result = AdminValidator.validateStatusTransition(AdminStatus.PENDING, AdminStatus.ACTIVE);
      expect(result.isValid).toBe(true);
    });

    it('should allow ACTIVE to SUSPENDED', () => {
      const result = AdminValidator.validateStatusTransition(AdminStatus.ACTIVE, AdminStatus.SUSPENDED);
      expect(result.isValid).toBe(true);
    });

    it('should allow SUSPENDED to ACTIVE', () => {
      const result = AdminValidator.validateStatusTransition(AdminStatus.SUSPENDED, AdminStatus.ACTIVE);
      expect(result.isValid).toBe(true);
    });

    it('should deny invalid transition', () => {
      const result = AdminValidator.validateStatusTransition(AdminStatus.ACTIVE, AdminStatus.PENDING);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateRoleAssignment', () => {
    it('should allow owner to assign support role', () => {
      const result = AdminValidator.validateRoleAssignment(AdminRoleType.OWNER, AdminRoleType.SUPPORT);
      expect(result.isValid).toBe(true);
    });

    it('should deny support from assigning admin role', () => {
      const result = AdminValidator.validateRoleAssignment(AdminRoleType.SUPPORT, AdminRoleType.ADMINISTRATOR);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('insufficient priority'))).toBe(true);
    });

    it('should deny non-owner from assigning owner role', () => {
      const result = AdminValidator.validateRoleAssignment(AdminRoleType.ADMINISTRATOR, AdminRoleType.OWNER);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('Owner'))).toBe(true);
    });

    it('should allow admin to assign moderator role', () => {
      const result = AdminValidator.validateRoleAssignment(AdminRoleType.ADMINISTRATOR, AdminRoleType.MODERATOR);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateCreateOrThrow', () => {
    it('should throw with invalid data', () => {
      expect(() => {
        AdminValidator.validateCreateOrThrow({
          telegramId: -1,
          displayName: '',
          roleId: '',
          roleType: AdminRoleType.SUPPORT,
        });
      }).toThrow();
    });

    it('should not throw with valid data', () => {
      expect(() => {
        AdminValidator.validateCreateOrThrow({
          telegramId: 123456789,
          displayName: 'Test Admin',
          roleId: 'role-123',
          roleType: AdminRoleType.SUPPORT,
        });
      }).not.toThrow();
    });
  });
});

describe('RoleValidator', () => {
  describe('validateCreate', () => {
    it('should pass with valid role data', () => {
      const result = RoleValidator.validateCreate({
        name: 'Custom Role',
        priority: 5,
        permissions: [AdminPermissionType.PLAYER_READ, AdminPermissionType.AUDIT_READ],
      });

      expect(result.isValid).toBe(true);
    });

    it('should fail with empty name', () => {
      const result = RoleValidator.validateCreate({
        name: '',
        priority: 5,
        permissions: [AdminPermissionType.PLAYER_READ],
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'name')).toBe(true);
    });

    it('should fail with negative priority', () => {
      const result = RoleValidator.validateCreate({
        name: 'Custom Role',
        priority: -1,
        permissions: [AdminPermissionType.PLAYER_READ],
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'priority')).toBe(true);
    });

    it('should fail with empty permissions', () => {
      const result = RoleValidator.validateCreate({
        name: 'Custom Role',
        priority: 5,
        permissions: [],
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'permissions')).toBe(true);
    });

    it('should fail with duplicate permissions', () => {
      const result = RoleValidator.validateCreate({
        name: 'Custom Role',
        priority: 5,
        permissions: [AdminPermissionType.PLAYER_READ, AdminPermissionType.PLAYER_READ],
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('Duplicate'))).toBe(true);
    });

    it('should fail with invalid permission', () => {
      const result = RoleValidator.validateCreate({
        name: 'Custom Role',
        priority: 5,
        permissions: ['invalid:permission' as AdminPermissionType],
      });

      expect(result.isValid).toBe(false);
    });
  });

  describe('validateUpdate', () => {
    it('should pass with partial update', () => {
      const result = RoleValidator.validateUpdate({
        name: 'Updated Name',
      });

      expect(result.isValid).toBe(true);
    });

    it('should validate permissions if provided', () => {
      const result = RoleValidator.validateUpdate({
        permissions: [AdminPermissionType.PLAYER_READ],
      });

      expect(result.isValid).toBe(true);
    });

    it('should fail with empty permissions array', () => {
      const result = RoleValidator.validateUpdate({
        permissions: [],
      });

      expect(result.isValid).toBe(false);
    });
  });

  describe('validateRoleDeletion', () => {
    it('should deny deletion of system role', () => {
      const result = RoleValidator.validateRoleDeletion(AdminRoleType.SUPPORT, true);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('System roles'))).toBe(true);
    });

    it('should deny deletion of owner role', () => {
      const result = RoleValidator.validateRoleDeletion(AdminRoleType.OWNER, false);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('Owner role'))).toBe(true);
    });

    it('should allow deletion of custom role', () => {
      const result = RoleValidator.validateRoleDeletion(AdminRoleType.ADMINISTRATOR, false);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validatePriorityChange', () => {
    it('should deny no change', () => {
      const result = RoleValidator.validatePriorityChange(5, 5);
      expect(result.isValid).toBe(false);
    });

    it('should deny priority out of range', () => {
      const result = RoleValidator.validatePriorityChange(5, 101);
      expect(result.isValid).toBe(false);
    });

    it('should allow valid priority change', () => {
      const result = RoleValidator.validatePriorityChange(5, 7);
      expect(result.isValid).toBe(true);
    });
  });
});