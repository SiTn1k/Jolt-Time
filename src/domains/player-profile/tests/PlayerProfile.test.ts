/**
 * PlayerProfile Unit Tests
 *
 * Tests for PlayerProfile entity and related functionality.
 */

import { describe, it, expect } from 'vitest';
import { PlayerProfile } from '../entities/PlayerProfile';
import { PlayerProfileId } from '../value-objects/PlayerProfileId';
import { PlayerNickname } from '../value-objects/PlayerNickname';
import { PlayerLevel } from '../value-objects/PlayerLevel';
import { PlayerExperience } from '../value-objects/PlayerExperience';
import { PrestigeLevel } from '../value-objects/PrestigeLevel';
import { PlayerProfileStatus } from '../types/PlayerProfileStatus';
import { INITIAL_PLAYER_STATISTICS } from '../types/PlayerStatistics';
import { DEFAULT_PLAYER_PREFERENCES } from '../types/PlayerPreferences';
import { INITIAL_PROFILE_METADATA } from '../types/PlayerProfileMetadata';

describe('PlayerProfile Entity', () => {
  const validProfileId = PlayerProfileId.reconstruct('123e4567-e89b-12d3-a456-426614174000');
  const validUserId = 'user-123';
  const validNickname = PlayerNickname.create('TestPlayer');

  describe('create', () => {
    it('should create a new profile with default values', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      expect(profile.profileId).toEqual(validProfileId);
      expect(profile.userId).toBe(validUserId);
      expect(profile.nickname).toEqual(validNickname);
      expect(profile.level.value).toBe(1);
      expect(profile.experience.value).toBe(0);
      expect(profile.prestige.value).toBe(0);
      expect(profile.accountAge).toBe(0);
      expect(profile.tutorialCompleted).toBe(false);
      expect(profile.profileVersion).toBe(1);
      expect(profile.status).toBe(PlayerProfileStatus.ACTIVE);
      expect(profile.statistics).toEqual(INITIAL_PLAYER_STATISTICS);
      expect(profile.preferences).toEqual(DEFAULT_PLAYER_PREFERENCES);
      expect(profile.metadata.createdVia).toBe('new_player');
    });

    it('should set createdAt and updatedAt timestamps', () => {
      const beforeCreate = new Date();
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });
      const afterCreate = new Date();

      expect(profile.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(profile.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(profile.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(profile.updatedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });
  });

  describe('fromDatabase', () => {
    it('should reconstruct profile from database record', () => {
      const record = {
        profile_id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: 'user-123',
        nickname: 'DBPlayer',
        level: 15,
        experience: 14500,
        prestige: 2,
        account_age: 30,
        tutorial_completed: true,
        profile_version: 1,
        status: 'active',
        statistics: { ...INITIAL_PLAYER_STATISTICS, expeditionsCompleted: 50 },
        preferences: { ...DEFAULT_PLAYER_PREFERENCES },
        metadata: { ...INITIAL_PROFILE_METADATA },
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-02-20T15:30:00.000Z',
      };

      const profile = PlayerProfile.fromDatabase(record);

      expect(profile.profileId.value).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(profile.userId).toBe('user-123');
      expect(profile.nickname.value).toBe('DBPlayer');
      expect(profile.level.value).toBe(15);
      expect(profile.experience.value).toBe(14500);
      expect(profile.prestige.value).toBe(2);
      expect(profile.accountAge).toBe(30);
      expect(profile.tutorialCompleted).toBe(true);
      expect(profile.status).toBe(PlayerProfileStatus.ACTIVE);
      expect(profile.statistics.expeditionsCompleted).toBe(50);
    });
  });

  describe('copyWith', () => {
    it('should create a copy with updated fields', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const updatedProfile = profile.copyWith({
        tutorialCompleted: true,
        accountAge: 5,
      });

      expect(updatedProfile.tutorialCompleted).toBe(true);
      expect(updatedProfile.accountAge).toBe(5);
      expect(updatedProfile.profileId).toEqual(profile.profileId);
      expect(updatedProfile.userId).toBe(profile.userId);
    });

    it('should preserve unchanged fields', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const updatedProfile = profile.copyWith({
        tutorialCompleted: true,
      });

      expect(updatedProfile.level.value).toBe(profile.level.value);
      expect(updatedProfile.experience.value).toBe(profile.experience.value);
      expect(updatedProfile.prestige.value).toBe(profile.prestige.value);
    });

    it('should update the updatedAt timestamp', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const originalUpdatedAt = profile.updatedAt;

      const updatedProfile = profile.copyWith({
        tutorialCompleted: true,
      });

      expect(updatedProfile.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('completeTutorial', () => {
    it('should mark tutorial as completed', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const updatedProfile = profile.completeTutorial();

      expect(updatedProfile.tutorialCompleted).toBe(true);
      expect(updatedProfile.metadata.modifiedVia).toBe('tutorial');
    });

    it('should preserve other profile data', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const updatedProfile = profile.completeTutorial();

      expect(updatedProfile.profileId).toEqual(profile.profileId);
      expect(updatedProfile.userId).toBe(profile.userId);
      expect(updatedProfile.level.value).toBe(profile.level.value);
    });
  });

  describe('addExperience', () => {
    it('should add experience and update level', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const updatedProfile = profile.addExperience(1500);

      expect(updatedProfile.experience.value).toBe(1500);
      expect(updatedProfile.level.value).toBe(2);
    });

    it('should handle multiple level ups', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const updatedProfile = profile.addExperience(3500);

      expect(updatedProfile.experience.value).toBe(3500);
      expect(updatedProfile.level.value).toBe(4);
    });

    it('should cap level at maximum', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const nearMaxProfile = profile.copyWith({
        experience: PlayerExperience.reconstruct(98999),
        level: PlayerLevel.reconstruct(99),
      });

      const updatedProfile = nearMaxProfile.addExperience(5000);

      expect(updatedProfile.level.value).toBe(100);
    });
  });

  describe('prestigeReset', () => {
    it('should reset level and experience', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const progressedProfile = profile.copyWith({
        level: PlayerLevel.reconstruct(15),
        experience: PlayerExperience.reconstruct(15000),
        prestige: PrestigeLevel.reconstruct(1),
      });

      const resetProfile = progressedProfile.prestigeReset();

      expect(resetProfile.level.value).toBe(1);
      expect(resetProfile.experience.value).toBe(0);
      expect(resetProfile.prestige.value).toBe(2);
    });

    it('should reset account age', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const agedProfile = profile.copyWith({
        accountAge: 100,
      });

      const resetProfile = agedProfile.prestigeReset();

      expect(resetProfile.accountAge).toBe(0);
    });

    it('should reset tutorial completion', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const completedProfile = profile.completeTutorial();
      const resetProfile = completedProfile.prestigeReset();

      expect(resetProfile.tutorialCompleted).toBe(false);
    });

    it('should optionally reset statistics', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const progressedProfile = profile.copyWith({
        statistics: {
          ...INITIAL_PLAYER_STATISTICS,
          expeditionsCompleted: 100,
          questsCompleted: 50,
        },
      });

      const resetWithStats = progressedProfile.prestigeReset(true);
      expect(resetWithStats.statistics.expeditionsCompleted).toBe(0);
      expect(resetWithStats.statistics.questsCompleted).toBe(0);

      const resetWithoutStats = progressedProfile.prestigeReset(false);
      expect(resetWithoutStats.statistics.expeditionsCompleted).toBe(100);
      expect(resetWithoutStats.statistics.questsCompleted).toBe(50);
    });
  });

  describe('toJSON', () => {
    it('should serialize profile to JSON', () => {
      const profile = PlayerProfile.create({
        profileId: validProfileId,
        userId: validUserId,
        nickname: validNickname,
      });

      const json = profile.toJSON();

      expect(json.profileId).toBe(validProfileId.value);
      expect(json.userId).toBe(validUserId);
      expect(json.nickname).toBe(validNickname.value);
      expect(json.level).toBe(1);
      expect(json.experience).toBe(0);
      expect(typeof json.createdAt).toBe('string');
      expect(typeof json.updatedAt).toBe('string');
    });
  });
});

describe('PlayerNickname', () => {
  const NICKNAME_MIN_LENGTH = 3;
  const NICKNAME_MAX_LENGTH = 32;

  describe('create', () => {
    it('should create nickname with valid input', () => {
      const nickname = PlayerNickname.create('ValidName');
      expect(nickname.value).toBe('ValidName');
    });

    it('should reject empty nickname', () => {
      expect(() => PlayerNickname.create('')).toThrow();
    });

    it('should reject nickname that is too short', () => {
      expect(() => PlayerNickname.create('AB')).toThrow();
    });

    it('should reject nickname that is too long', () => {
      const longName = 'A'.repeat(NICKNAME_MAX_LENGTH + 1);
      expect(() => PlayerNickname.create(longName)).toThrow();
    });

    it('should reject nickname with invalid characters', () => {
      expect(() => PlayerNickname.create('Invalid@Name')).toThrow();
      expect(() => PlayerNickname.create('Invalid Name')).toThrow();
      expect(() => PlayerNickname.create('Invalid-Name')).toThrow();
    });

    it('should accept nickname with underscores', () => {
      const nickname = PlayerNickname.create('Valid_Name_123');
      expect(nickname.value).toBe('Valid_Name_123');
    });
  });
});

describe('PlayerLevel', () => {
  const MIN_LEVEL = 1;
  const MAX_LEVEL = 100;

  describe('create', () => {
    it('should create level with valid value', () => {
      const level = PlayerLevel.create(50);
      expect(level.value).toBe(50);
    });

    it('should reject level below minimum', () => {
      expect(() => PlayerLevel.create(0)).toThrow();
      expect(() => PlayerLevel.create(-1)).toThrow();
    });

    it('should reject level above maximum', () => {
      expect(() => PlayerLevel.create(MAX_LEVEL + 1)).toThrow();
    });

    it('should reject non-integer values', () => {
      expect(() => PlayerLevel.create(1.5)).toThrow();
    });
  });

  describe('start', () => {
    it('should create starting level', () => {
      const level = PlayerLevel.start();
      expect(level.value).toBe(MIN_LEVEL);
    });
  });

  describe('isMaxLevel', () => {
    it('should return true for max level', () => {
      const level = PlayerLevel.create(MAX_LEVEL);
      expect(level.isMaxLevel).toBe(true);
    });

    it('should return false for non-max level', () => {
      const level = PlayerLevel.create(50);
      expect(level.isMaxLevel).toBe(false);
    });
  });
});

describe('PlayerExperience', () => {
  const MIN_EXPERIENCE = 0;
  const MAX_EXPERIENCE = 999_999_999;
  const XP_PER_LEVEL = 1000;

  describe('create', () => {
    it('should create experience with valid value', () => {
      const exp = PlayerExperience.create(5000);
      expect(exp.value).toBe(5000);
    });

    it('should reject negative experience', () => {
      expect(() => PlayerExperience.create(-1)).toThrow();
    });

    it('should reject experience above maximum', () => {
      expect(() => PlayerExperience.create(MAX_EXPERIENCE + 1)).toThrow();
    });
  });

  describe('withinLevel', () => {
    it('should return experience within current level', () => {
      const exp = PlayerExperience.create(1500);
      expect(exp.withinLevel).toBe(500);
    });
  });

  describe('progressToNextLevel', () => {
    it('should return correct progress percentage', () => {
      const exp = PlayerExperience.create(500);
      expect(exp.progressToNextLevel).toBe(50);
    });
  });

  describe('add', () => {
    it('should add experience correctly', () => {
      const exp = PlayerExperience.create(1000);
      const newExp = exp.add(500);
      expect(newExp.value).toBe(1500);
    });

    it('should throw when exceeding maximum', () => {
      const exp = PlayerExperience.create(MAX_EXPERIENCE);
      expect(() => exp.add(1)).toThrow();
    });
  });
});
