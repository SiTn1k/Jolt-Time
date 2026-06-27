/**
 * PlayerProfile Entity
 *
 * Domain entity representing a player's game profile.
 * This entity contains ONLY gameplay data - no authentication data.
 *
 * PlayerProfile Entity Responsibilities:
 * - Represent player gameplay identity
 * - Store progression and statistics
 * - Track preferences and settings
 * - Manage prestige and reset mechanics
 *
 * PlayerProfile Entity is NOT:
 * - User (authentication identity)
 * - Game state or active sessions
 * - Inventory or artifacts
 */

import type { IPlayerProfile } from '../interfaces/IPlayerProfile';
import { PlayerProfileId } from '../value-objects/PlayerProfileId';
import { PlayerNickname } from '../value-objects/PlayerNickname';
import { PlayerLevel, PLAYER_LEVEL_CONSTRAINTS } from '../value-objects/PlayerLevel';
import { PlayerExperience, PLAYER_EXPERIENCE_CONSTRAINTS } from '../value-objects/PlayerExperience';
import { PrestigeLevel, PRESTIGE_CONSTRAINTS } from '../value-objects/PrestigeLevel';
import { PlayerProfileStatus } from '../types/PlayerProfileStatus';
import { PlayerStatistics, INITIAL_PLAYER_STATISTICS } from '../types/PlayerStatistics';
import { PlayerPreferences, DEFAULT_PLAYER_PREFERENCES } from '../types/PlayerPreferences';
import { PlayerProfileMetadata, INITIAL_PROFILE_METADATA } from '../types/PlayerProfileMetadata';

/**
 * PlayerProfile entity class.
 * Immutable domain entity representing a player's game profile.
 */
export class PlayerProfile implements IPlayerProfile {
  /** Unique internal profile identifier */
  public readonly profileId: PlayerProfileId;

  /** Associated user ID */
  public readonly userId: string;

  /** Player's in-game nickname */
  public readonly nickname: PlayerNickname;

  /** Current player level */
  public readonly level: PlayerLevel;

  /** Total accumulated experience */
  public readonly experience: PlayerExperience;

  /** Current prestige level */
  public readonly prestige: PrestigeLevel;

  /** Account age in days */
  public readonly accountAge: number;

  /** Whether tutorial has been completed */
  public readonly tutorialCompleted: boolean;

  /** Profile schema version */
  public readonly profileVersion: number;

  /** Profile status */
  public readonly status: PlayerProfileStatus;

  /** Player statistics */
  public readonly statistics: PlayerStatistics;

  /** Player preferences */
  public readonly preferences: PlayerPreferences;

  /** Profile metadata */
  public readonly metadata: PlayerProfileMetadata;

  /** Timestamp when profile was created */
  public readonly createdAt: Date;

  /** Timestamp when profile was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new PlayerProfile instance.
   * @param props PlayerProfile properties
   */
  constructor(props: PlayerProfileProps) {
    this.profileId = props.profileId;
    this.userId = props.userId;
    this.nickname = props.nickname;
    this.level = props.level;
    this.experience = props.experience;
    this.prestige = props.prestige;
    this.accountAge = props.accountAge;
    this.tutorialCompleted = props.tutorialCompleted;
    this.profileVersion = props.profileVersion;
    this.status = props.status ?? PlayerProfileStatus.ACTIVE;
    this.statistics = props.statistics ?? { ...INITIAL_PLAYER_STATISTICS };
    this.preferences = props.preferences ?? { ...DEFAULT_PLAYER_PREFERENCES };
    this.metadata = props.metadata ?? { ...INITIAL_PROFILE_METADATA };
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new PlayerProfile for a user.
   * Factory method for new profile creation.
   */
  public static create(params: {
    profileId: PlayerProfileId;
    userId: string;
    nickname: PlayerNickname;
  }): PlayerProfile {
    const now = new Date();

    return new PlayerProfile({
      profileId: params.profileId,
      userId: params.userId,
      nickname: params.nickname,
      level: PlayerLevel.start(),
      experience: PlayerExperience.start(),
      prestige: PrestigeLevel.start(),
      accountAge: 0,
      tutorialCompleted: false,
      profileVersion: INITIAL_PROFILE_METADATA.profileVersion,
      status: PlayerProfileStatus.ACTIVE,
      statistics: { ...INITIAL_PLAYER_STATISTICS },
      preferences: { ...DEFAULT_PLAYER_PREFERENCES },
      metadata: { ...INITIAL_PROFILE_METADATA },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Creates a PlayerProfile from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: PlayerProfileRecord): PlayerProfile {
    return new PlayerProfile({
      profileId: PlayerProfileId.reconstruct(record.profile_id),
      userId: record.user_id,
      nickname: PlayerNickname.reconstruct(record.nickname),
      level: PlayerLevel.reconstruct(record.level),
      experience: PlayerExperience.reconstruct(record.experience),
      prestige: PrestigeLevel.reconstruct(record.prestige),
      accountAge: record.account_age,
      tutorialCompleted: record.tutorial_completed,
      profileVersion: record.profile_version,
      status: record.status as PlayerProfileStatus,
      statistics: record.statistics,
      preferences: record.preferences,
      metadata: record.metadata,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }

  /**
   * Serializes the PlayerProfile to a plain object.
   */
  public toJSON(): PlayerProfileJSON {
    return {
      profileId: this.profileId.value,
      userId: this.userId,
      nickname: this.nickname.value,
      level: this.level.value,
      experience: this.experience.value,
      prestige: this.prestige.value,
      accountAge: this.accountAge,
      tutorialCompleted: this.tutorialCompleted,
      profileVersion: this.profileVersion,
      status: this.status,
      statistics: this.statistics,
      preferences: this.preferences,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new PlayerProfile instance.
   */
  public copyWith(params: Partial<PlayerProfileProps>): PlayerProfile {
    return new PlayerProfile({
      profileId: this.profileId,
      userId: this.userId,
      nickname: params.nickname ?? this.nickname,
      level: params.level ?? this.level,
      experience: params.experience ?? this.experience,
      prestige: params.prestige ?? this.prestige,
      accountAge: params.accountAge ?? this.accountAge,
      tutorialCompleted: params.tutorialCompleted ?? this.tutorialCompleted,
      profileVersion: this.profileVersion,
      status: params.status ?? this.status,
      statistics: params.statistics ?? this.statistics,
      preferences: params.preferences ?? this.preferences,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Completes the tutorial for this profile.
   * Returns a new PlayerProfile with tutorial completed.
   */
  public completeTutorial(): PlayerProfile {
    return this.copyWith({
      tutorialCompleted: true,
      metadata: {
        ...this.metadata,
        modifiedVia: 'tutorial',
      },
    });
  }

  /**
   * Adds experience to the profile.
   * Handles level ups automatically.
   * Returns a new PlayerProfile with updated experience and level.
   */
  public addExperience(amount: number): PlayerProfile {
    const newExperience = this.experience.add(amount);
    const newLevelValue = Math.min(
      Math.floor(newExperience.value / PLAYER_EXPERIENCE_CONSTRAINTS.XP_PER_LEVEL) + 1,
      PLAYER_LEVEL_CONSTRAINTS.MAX_LEVEL
    );
    const newLevel = PlayerLevel.reconstruct(newLevelValue);

    return this.copyWith({
      experience: newExperience,
      level: newLevel,
    });
  }

  /**
   * Resets the profile for prestige.
   * Resets level, experience, and optionally statistics.
   * Returns a new PlayerProfile with prestige incremented.
   */
  public prestigeReset(resetStatistics: boolean = true): PlayerProfile {
    const newPrestige = this.prestige.increment();

    return this.copyWith({
      level: PlayerLevel.start(),
      experience: PlayerExperience.start(),
      prestige: newPrestige,
      accountAge: 0,
      tutorialCompleted: false,
      statistics: resetStatistics ? { ...INITIAL_PLAYER_STATISTICS } : this.statistics,
      metadata: {
        ...this.metadata,
        modifiedVia: 'gameplay',
      },
    });
  }
}

/**
 * PlayerProfile properties interface for constructor.
 */
export interface PlayerProfileProps {
  profileId: PlayerProfileId;
  userId: string;
  nickname: PlayerNickname;
  level: PlayerLevel;
  experience: PlayerExperience;
  prestige: PrestigeLevel;
  accountAge: number;
  tutorialCompleted: boolean;
  profileVersion: number;
  status?: PlayerProfileStatus;
  statistics?: PlayerStatistics;
  preferences?: PlayerPreferences;
  metadata?: PlayerProfileMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of PlayerProfile.
 */
export interface PlayerProfileRecord {
  profile_id: string;
  user_id: string;
  nickname: string;
  level: number;
  experience: number;
  prestige: number;
  account_age: number;
  tutorial_completed: boolean;
  profile_version: number;
  status: string;
  statistics: PlayerStatistics;
  preferences: PlayerPreferences;
  metadata: PlayerProfileMetadata;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of PlayerProfile.
 */
export interface PlayerProfileJSON {
  profileId: string;
  userId: string;
  nickname: string;
  level: number;
  experience: number;
  prestige: number;
  accountAge: number;
  tutorialCompleted: boolean;
  profileVersion: number;
  status: PlayerProfileStatus;
  statistics: PlayerStatistics;
  preferences: PlayerPreferences;
  metadata: PlayerProfileMetadata;
  createdAt: string;
  updatedAt: string;
}