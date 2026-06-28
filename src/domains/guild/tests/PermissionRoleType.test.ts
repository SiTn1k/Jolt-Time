/**
 * Permission and Role Type Tests
 *
 * Unit tests for permission checks and role type utilities.
 */

import { describe, it, expect } from 'vitest';
import {
  hasManagementPrivileges,
  canManageOfficers,
  canKickMembers,
  DEFAULT_GUILD_ROLE,
  GUILD_ROLE_PRIORITY,
} from '../types/GuildRoleType';
import { hasPermission, DEFAULT_ROLE_PERMISSIONS } from '../types/GuildPermission';

describe('GuildRoleType', () => {
  describe('hasManagementPrivileges', () => {
    it('should return true for leader', () => {
      expect(hasManagementPrivileges('leader')).toBe(true);
    });

    it('should return true for officer', () => {
      expect(hasManagementPrivileges('officer')).toBe(true);
    });

    it('should return false for member', () => {
      expect(hasManagementPrivileges('member')).toBe(false);
    });
  });

  describe('canManageOfficers', () => {
    it('should return true only for leader', () => {
      expect(canManageOfficers('leader')).toBe(true);
      expect(canManageOfficers('officer')).toBe(false);
      expect(canManageOfficers('member')).toBe(false);
    });
  });

  describe('canKickMembers', () => {
    it('should allow leader to kick anyone', () => {
      expect(canKickMembers('leader', 'member')).toBe(true);
      expect(canKickMembers('leader', 'officer')).toBe(true);
      expect(canKickMembers('leader', 'leader')).toBe(true);
    });

    it('should allow officer to kick members only', () => {
      expect(canKickMembers('officer', 'member')).toBe(true);
      expect(canKickMembers('officer', 'officer')).toBe(false);
      expect(canKickMembers('officer', 'leader')).toBe(false);
    });

    it('should not allow member to kick anyone', () => {
      expect(canKickMembers('member', 'member')).toBe(false);
      expect(canKickMembers('member', 'officer')).toBe(false);
      expect(canKickMembers('member', 'leader')).toBe(false);
    });
  });

  describe('GUILD_ROLE_PRIORITY', () => {
    it('should have correct priority values', () => {
      expect(GUILD_ROLE_PRIORITY.leader).toBe(1);
      expect(GUILD_ROLE_PRIORITY.officer).toBe(2);
      expect(GUILD_ROLE_PRIORITY.member).toBe(3);
    });

    it('should have leader as highest priority', () => {
      expect(GUILD_ROLE_PRIORITY.leader).toBeLessThan(GUILD_ROLE_PRIORITY.officer);
      expect(GUILD_ROLE_PRIORITY.officer).toBeLessThan(GUILD_ROLE_PRIORITY.member);
    });
  });

  describe('DEFAULT_GUILD_ROLE', () => {
    it('should be member', () => {
      expect(DEFAULT_GUILD_ROLE).toBe('member');
    });
  });
});

describe('GuildPermission', () => {
  describe('hasPermission', () => {
    it('should return true for leader permissions', () => {
      expect(hasPermission('leader', 'guild:edit_name')).toBe(true);
      expect(hasPermission('leader', 'guild:transfer_leadership')).toBe(true);
      expect(hasPermission('leader', 'guild:kick_member')).toBe(true);
    });

    it('should return false for leader permissions on officer', () => {
      expect(hasPermission('officer', 'guild:edit_name')).toBe(false);
      expect(hasPermission('officer', 'guild:transfer_leadership')).toBe(false);
    });

    it('should return true for officer permissions', () => {
      expect(hasPermission('officer', 'guild:kick_member')).toBe(true);
      expect(hasPermission('officer', 'guild:invite_member')).toBe(true);
    });

    it('should return false for officer permissions on member', () => {
      expect(hasPermission('member', 'guild:kick_member')).toBe(false);
      expect(hasPermission('member', 'guild:invite_member')).toBe(false);
    });

    it('should return true for member permissions', () => {
      expect(hasPermission('member', 'guild:view_statistics')).toBe(true);
      expect(hasPermission('member', 'guild:participate_mission')).toBe(true);
      expect(hasPermission('member', 'guild:donate')).toBe(true);
    });
  });

  describe('DEFAULT_ROLE_PERMISSIONS', () => {
    it('should have leader with most permissions', () => {
      expect(DEFAULT_ROLE_PERMISSIONS.leader.length).toBeGreaterThan(DEFAULT_ROLE_PERMISSIONS.officer.length);
      expect(DEFAULT_ROLE_PERMISSIONS.officer.length).toBeGreaterThan(DEFAULT_ROLE_PERMISSIONS.member.length);
    });

    it('should have all required permissions for each role', () => {
      expect(DEFAULT_ROLE_PERMISSIONS.leader).toContain('guild:edit_name');
      expect(DEFAULT_ROLE_PERMISSIONS.leader).toContain('guild:transfer_leadership');
      expect(DEFAULT_ROLE_PERMISSIONS.officer).toContain('guild:kick_member');
      expect(DEFAULT_ROLE_PERMISSIONS.member).toContain('guild:view_statistics');
    });
  });
});
