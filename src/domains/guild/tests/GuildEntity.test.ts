/**
 * Guild Entity Tests
 *
 * Unit tests for Guild domain entity.
 */

import { describe, it, expect } from 'vitest';
import { Guild } from '../entities/Guild';
import { GuildId } from '../value-objects/GuildId';
import { GuildSlug } from '../value-objects/GuildSlug';
import { GuildName } from '../value-objects/GuildName';
import { GuildLevel } from '../value-objects/GuildLevel';

describe('Guild', () => {
  describe('create', () => {
    it('should create a guild with valid data', () => {
      const guild = Guild.create({
        slug: GuildSlug.create('test-guild'),
        name: GuildName.create('Test Guild'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
      });

      expect(guild).toBeDefined();
      expect(guild.guildId).toBeInstanceOf(GuildId);
      expect(guild.slug.value).toBe('test-guild');
      expect(guild.name.value).toBe('Test Guild');
      expect(guild.ownerPlayerId).toBe('123e4567-e89b-42d3-a456-426614174000');
      expect(guild.guildLevel.value).toBe(1);
      expect(guild.guildExperience).toBe(0);
      expect(guild.memberLimit).toBe(10);
      expect(guild.privacy).toBe('public');
      expect(guild.createdAt).toBeInstanceOf(Date);
      expect(guild.updatedAt).toBeInstanceOf(Date);
    });

    it('should create guild with custom privacy', () => {
      const guild = Guild.create({
        slug: GuildSlug.create('private-guild'),
        name: GuildName.create('Private Guild'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
        privacy: 'private',
      });

      expect(guild.privacy).toBe('private');
    });

    it('should create guild with description', () => {
      const guild = Guild.create({
        slug: GuildSlug.create('described-guild'),
        name: GuildName.create('Described Guild'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
        description: 'A test guild description',
      });

      expect(guild.description).toBe('A test guild description');
    });

    it('should initialize statistics correctly', () => {
      const guild = Guild.create({
        slug: GuildSlug.create('stats-guild'),
        name: GuildName.create('Stats Guild'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
      });

      expect(guild.statistics.totalExperience).toBe(0);
      expect(guild.statistics.weeklyExperience).toBe(0);
      expect(guild.statistics.activeMembersCount).toBe(1);
      expect(guild.statistics.averageMemberLevel).toBe(0);
      expect(guild.statistics.missionsCompleted).toBe(0);
      expect(guild.statistics.totalMembersJoined).toBe(1);
      expect(guild.statistics.totalMembersLeft).toBe(0);
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct guild from storage record', () => {
      const record = {
        guildId: '123e4567-e89b-42d3-a456-426614174001',
        slug: 'stored-guild',
        name: 'Stored Guild',
        description: 'A stored guild',
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
        guildLevel: 3,
        guildExperience: 5000,
        memberLimit: 25,
        privacy: 'public' as const,
        statistics: {
          totalExperience: 5000,
          weeklyExperience: 1000,
          activeMembersCount: 15,
          averageMemberLevel: 10,
          missionsCompleted: 50,
          missionCompletionRate: 0.8,
          warsParticipated: 5,
          warsWon: 2,
          seasonStanding: 10,
          allTimeSeasonPoints: 100,
          totalMembersJoined: 20,
          totalMembersLeft: 5,
        },
        metadata: {},
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-06-01T00:00:00.000Z',
      };

      const guild = Guild.fromStorage(record);

      expect(guild.guildId.value).toBe(record.guildId);
      expect(guild.slug.value).toBe(record.slug);
      expect(guild.name.value).toBe(record.name);
      expect(guild.guildLevel.value).toBe(3);
      expect(guild.guildExperience).toBe(5000);
      expect(guild.memberLimit).toBe(25);
    });
  });

  describe('isPublic / isPrivate', () => {
    it('should correctly identify public guild', () => {
      const guild = Guild.create({
        slug: GuildSlug.create('public-test'),
        name: GuildName.create('Public Test'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
        privacy: 'public',
      });

      expect(guild.isPublic).toBe(true);
      expect(guild.isPrivate).toBe(false);
    });

    it('should correctly identify private guild', () => {
      const guild = Guild.create({
        slug: GuildSlug.create('private-test'),
        name: GuildName.create('Private Test'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
        privacy: 'private',
      });

      expect(guild.isPublic).toBe(false);
      expect(guild.isPrivate).toBe(true);
    });
  });

  describe('getLevelFromExperience', () => {
    it('should return level 1 for 0 experience', () => {
      const guild = Guild.create({
        slug: GuildSlug.create('level-test-1'),
        name: GuildName.create('Level Test 1'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
      });

      expect(guild.getLevelFromExperience().value).toBe(1);
    });

    it('should return level 2 for 1000+ experience', () => {
      const guild = Guild.create({
        slug: GuildSlug.create('level-test-2'),
        name: GuildName.create('Level Test 2'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
      }).copyWith({ guildExperience: 1500 });

      expect(guild.getLevelFromExperience().value).toBe(2);
    });

    it('should return max level for high experience', () => {
      const guild = Guild.create({
        slug: GuildSlug.create('level-test-max'),
        name: GuildName.create('Level Test Max'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
      }).copyWith({ guildExperience: 100000 });

      expect(guild.getLevelFromExperience().value).toBe(7);
    });
  });

  describe('copyWith', () => {
    it('should create a copy with updated fields', () => {
      const original = Guild.create({
        slug: GuildSlug.create('copy-test'),
        name: GuildName.create('Copy Test'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
      });

      const copy = original.copyWith({
        name: GuildName.create('Updated Name'),
        description: 'New description',
      });

      expect(copy.name.value).toBe('Updated Name');
      expect(copy.description).toBe('New description');
      expect(copy.guildId.value).toBe(original.guildId.value);
      expect(copy.slug.value).toBe(original.slug.value);
    });

    it('should preserve immutable fields', () => {
      const original = Guild.create({
        slug: GuildSlug.create('preserve-test'),
        name: GuildName.create('Preserve Test'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
      });

      const createdAt = original.createdAt;

      const copy = original.copyWith({ description: 'Updated' });

      expect(copy.createdAt).toEqual(createdAt);
    });
  });

  describe('toJSON / toRecord', () => {
    it('should serialize to JSON correctly', () => {
      const guild = Guild.create({
        slug: GuildSlug.create('serialize-test'),
        name: GuildName.create('Serialize Test'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
      });

      const json = guild.toJSON();

      expect(json.slug).toBe('serialize-test');
      expect(json.name).toBe('Serialize Test');
      expect(json.guildLevel).toBe(1);
      expect(json.privacy).toBe('public');
      expect(json.createdAt).toBeDefined();
    });

    it('should convert to record correctly', () => {
      const guild = Guild.create({
        slug: GuildSlug.create('record-test'),
        name: GuildName.create('Record Test'),
        ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
      });

      const record = guild.toRecord();

      expect(record.slug).toBe('record-test');
      expect(record.name).toBe('Record Test');
      expect(record.ownerPlayerId).toBe('123e4567-e89b-42d3-a456-426614174000');
    });
  });
});
