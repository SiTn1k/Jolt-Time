/**
 * GuildRole Entity Tests
 *
 * Unit tests for GuildRole domain entity.
 */

import { describe, it, expect } from 'vitest';
import { GuildRole } from '../entities/GuildRole';

describe('GuildRole', () => {
  describe('fromRoleType', () => {
    it('should create leader role with all permissions', () => {
      const role = GuildRole.fromRoleType('leader');

      expect(role.name).toBe('Guild Leader');
      expect(role.roleType).toBe('leader');
      expect(role.priority).toBe(1);
      expect(role.permissions).toContain('guild:edit_name');
      expect(role.permissions).toContain('guild:edit_description');
      expect(role.permissions).toContain('guild:edit_icon');
      expect(role.permissions).toContain('guild:kick_member');
      expect(role.permissions).toContain('guild:promote_officer');
      expect(role.permissions).toContain('guild:demote_officer');
      expect(role.permissions).toContain('guild:transfer_leadership');
      expect(role.permissions).toContain('guild:invite_member');
      expect(role.permissions).toContain('guild:start_war');
    });

    it('should create officer role with limited permissions', () => {
      const role = GuildRole.fromRoleType('officer');

      expect(role.name).toBe('Guild Officer');
      expect(role.roleType).toBe('officer');
      expect(role.priority).toBe(2);
      expect(role.permissions).toContain('guild:kick_member');
      expect(role.permissions).toContain('guild:invite_member');
      expect(role.permissions).not.toContain('guild:edit_name');
      expect(role.permissions).not.toContain('guild:transfer_leadership');
    });

    it('should create member role with minimal permissions', () => {
      const role = GuildRole.fromRoleType('member');

      expect(role.name).toBe('Guild Member');
      expect(role.roleType).toBe('member');
      expect(role.priority).toBe(3);
      expect(role.permissions).toContain('guild:view_statistics');
      expect(role.permissions).toContain('guild:participate_mission');
      expect(role.permissions).toContain('guild:donate');
      expect(role.permissions).not.toContain('guild:kick_member');
      expect(role.permissions).not.toContain('guild:invite_member');
    });
  });

  describe('hasPermission', () => {
    it('should return true for valid permission', () => {
      const role = GuildRole.fromRoleType('leader');
      expect(role.hasPermission('guild:edit_name')).toBe(true);
    });

    it('should return false for invalid permission', () => {
      const role = GuildRole.fromRoleType('member');
      expect(role.hasPermission('guild:kick_member')).toBe(false);
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct role from storage record', () => {
      const record = {
        roleId: '323e4567-e89b-42d3-a456-426614174003',
        name: 'Custom Role',
        permissions: ['guild:view_statistics', 'guild:donate'] as const,
        priority: 5,
        metadata: { roleType: 'member' as const },
      };

      const role = GuildRole.fromStorage(record);

      expect(role.name).toBe('Custom Role');
      expect(role.permissions).toHaveLength(2);
      expect(role.priority).toBe(5);
    });
  });

  describe('copyWith', () => {
    it('should create a copy with updated fields', () => {
      const original = GuildRole.fromRoleType('member');
      const copy = original.copyWith({
        name: 'Custom Member',
        permissions: ['guild:view_statistics'],
      });

      expect(copy.name).toBe('Custom Member');
      expect(copy.permissions).toHaveLength(1);
      expect(copy.roleId.value).toBe(original.roleId.value);
    });
  });

  describe('toJSON / toRecord', () => {
    it('should serialize to JSON correctly', () => {
      const role = GuildRole.fromRoleType('officer');
      const json = role.toJSON();

      expect(json.name).toBe('Guild Officer');
      expect(json.roleType).toBe('officer');
      expect(json.permissions).toBeDefined();
      expect(Array.isArray(json.permissions)).toBe(true);
    });

    it('should return roleType from metadata', () => {
      const role = GuildRole.fromRoleType('officer');
      // The roleType getter returns from metadata
      expect(role.roleType).toBe('officer');
    });

    it('should convert to record correctly', () => {
      const role = GuildRole.fromRoleType('leader');
      const record = role.toRecord();

      expect(record.name).toBe('Guild Leader');
      expect(record.priority).toBe(1);
      expect(Array.isArray(record.permissions)).toBe(true);
    });
  });
});
