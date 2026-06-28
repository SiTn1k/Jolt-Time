/**
 * GuildMember Entity Tests
 *
 * Unit tests for GuildMember domain entity.
 */

import { describe, it, expect } from 'vitest';
import { GuildMember } from '../entities/GuildMember';
import { GuildMemberId } from '../entities/GuildMemberId';
import { GuildId } from '../value-objects/GuildId';

describe('GuildMember', () => {
  const guildId = GuildId.create();
  const playerProfileId = '123e4567-e89b-42d3-a456-426614174000';

  describe('create', () => {
    it('should create a member with default role', () => {
      const member = GuildMember.create({
        guildId,
        playerProfileId,
      });

      expect(member).toBeDefined();
      expect(member.memberId).toBeInstanceOf(GuildMemberId);
      expect(member.guildId.value).toBe(guildId.value);
      expect(member.playerProfileId).toBe(playerProfileId);
      expect(member.role).toBe('member');
      expect(member.joinedAt).toBeInstanceOf(Date);
      expect(member.lastActiveAt).toBeInstanceOf(Date);
    });

    it('should create a member with leader role', () => {
      const member = GuildMember.create({
        guildId,
        playerProfileId,
        role: 'leader',
      });

      expect(member.role).toBe('leader');
    });

    it('should create a member with officer role', () => {
      const member = GuildMember.create({
        guildId,
        playerProfileId,
        role: 'officer',
      });

      expect(member.role).toBe('officer');
    });

    it('should initialize statistics correctly', () => {
      const member = GuildMember.create({
        guildId,
        playerProfileId,
      });

      expect(member.statistics.missionsCompleted).toBe(0);
      expect(member.statistics.battlesWon).toBe(0);
      expect(member.statistics.warContributions).toBe(0);
      expect(member.statistics.resourcesDonated).toBe(0);
      expect(member.statistics.dailyLogins).toBe(1);
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct member from storage record', () => {
      const record = {
        memberId: '223e4567-e89b-42d3-a456-426614174002',
        guildId: guildId.value,
        playerProfileId,
        role: 'officer' as const,
        joinedAt: '2024-01-01T00:00:00.000Z',
        lastActiveAt: '2024-06-15T00:00:00.000Z',
        statistics: {
          missionsCompleted: 10,
          battlesWon: 5,
          warContributions: 100,
          resourcesDonated: 50,
          dailyLogins: 100,
        },
        metadata: {},
      };

      const member = GuildMember.fromStorage(record);

      expect(member.memberId.value).toBe(record.memberId);
      expect(member.guildId.value).toBe(record.guildId);
      expect(member.role).toBe('officer');
      expect(member.statistics.missionsCompleted).toBe(10);
    });
  });

  describe('role checks', () => {
    it('should correctly identify leader', () => {
      const member = GuildMember.create({
        guildId,
        playerProfileId,
        role: 'leader',
      });

      expect(member.isLeader).toBe(true);
      expect(member.isOfficer).toBe(false);
      expect(member.isMember).toBe(false);
      expect(member.hasManagementPrivileges).toBe(true);
    });

    it('should correctly identify officer', () => {
      const member = GuildMember.create({
        guildId,
        playerProfileId,
        role: 'officer',
      });

      expect(member.isLeader).toBe(false);
      expect(member.isOfficer).toBe(true);
      expect(member.isMember).toBe(false);
      expect(member.hasManagementPrivileges).toBe(true);
    });

    it('should correctly identify member', () => {
      const member = GuildMember.create({
        guildId,
        playerProfileId,
        role: 'member',
      });

      expect(member.isLeader).toBe(false);
      expect(member.isOfficer).toBe(false);
      expect(member.isMember).toBe(true);
      expect(member.hasManagementPrivileges).toBe(false);
    });
  });

  describe('copyWith', () => {
    it('should create a copy with updated fields', () => {
      const original = GuildMember.create({
        guildId,
        playerProfileId,
        role: 'member',
      });

      const copy = original.copyWith({
        role: 'officer',
      });

      expect(copy.role).toBe('officer');
      expect(copy.memberId.value).toBe(original.memberId.value);
      expect(copy.guildId.value).toBe(original.guildId.value);
      expect(copy.playerProfileId).toBe(original.playerProfileId);
    });

    it('should update lastActiveAt when provided', () => {
      const original = GuildMember.create({
        guildId,
        playerProfileId,
      });

      const newDate = new Date('2024-06-01T00:00:00.000Z');
      const copy = original.copyWith({
        lastActiveAt: newDate,
      });

      expect(copy.lastActiveAt).toEqual(newDate);
    });
  });

  describe('toJSON / toRecord', () => {
    it('should serialize to JSON correctly', () => {
      const member = GuildMember.create({
        guildId,
        playerProfileId,
      });

      const json = member.toJSON();

      expect(json.guildId).toBe(guildId.value);
      expect(json.playerProfileId).toBe(playerProfileId);
      expect(json.role).toBe('member');
      expect(json.joinedAt).toBeDefined();
    });

    it('should convert to record correctly', () => {
      const member = GuildMember.create({
        guildId,
        playerProfileId,
      });

      const record = member.toRecord();

      expect(record.guildId).toBe(guildId.value);
      expect(record.playerProfileId).toBe(playerProfileId);
      expect(record.role).toBe('member');
    });
  });
});
