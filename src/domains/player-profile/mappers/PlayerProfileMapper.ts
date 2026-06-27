/**
 * Player Profile Mapper
 *
 * Maps between PlayerProfile entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { PlayerProfile } from '../entities/PlayerProfile';
import type { PlayerProfileRecord } from '../entities/PlayerProfile';
import type { CreatePlayerProfileDto } from '../dto/CreatePlayerProfile.dto';
import type { UpdatePlayerProfileDto } from '../dto/UpdatePlayerProfile.dto';
import type { PlayerProfileResponseDto, PlayerProfileSummaryDto } from '../dto/PlayerProfileResponse.dto';
import { PLAYER_EXPERIENCE_CONSTRAINTS } from '../value-objects/PlayerExperience';

/**
 * Mapper for converting between PlayerProfile entity and DTOs.
 */
export class PlayerProfileMapper {
  /**
   * Converts a PlayerProfile entity to PlayerProfileResponseDto.
   */
  public static toResponse(profile: PlayerProfile): PlayerProfileResponseDto {
    return {
      profileId: profile.profileId.value,
      userId: profile.userId,
      nickname: profile.nickname.value,
      level: profile.level.value,
      experience: profile.experience.value,
      experienceWithinLevel: profile.experience.withinLevel,
      experienceForNextLevel: profile.experience.xpForNextLevel,
      progressToNextLevel: profile.experience.progressToNextLevel,
      prestige: profile.prestige.value,
      accountAge: profile.accountAge,
      tutorialCompleted: profile.tutorialCompleted,
      profileVersion: profile.profileVersion,
      status: profile.status,
      statistics: profile.statistics,
      preferences: profile.preferences,
      metadata: profile.metadata,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a PlayerProfile entity to PlayerProfileSummaryDto.
   */
  public static toSummary(profile: PlayerProfile): PlayerProfileSummaryDto {
    return {
      profileId: profile.profileId.value,
      nickname: profile.nickname.value,
      level: profile.level.value,
      prestige: profile.prestige.value,
      tutorialCompleted: profile.tutorialCompleted,
      status: profile.status,
    };
  }

  /**
   * Converts an array of PlayerProfile entities to PlayerProfileResponseDto array.
   */
  public static toResponseList(profiles: PlayerProfile[]): PlayerProfileResponseDto[] {
    return profiles.map((profile) => this.toResponse(profile));
  }

  /**
   * Converts an array of PlayerProfile entities to PlayerProfileSummaryDto array.
   */
  public static toSummaryList(profiles: PlayerProfile[]): PlayerProfileSummaryDto[] {
    return profiles.map((profile) => this.toSummary(profile));
  }

  /**
   * Converts a CreatePlayerProfileDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreatePlayerProfileDto): Omit<CreatePlayerProfileDto, never> {
    return {
      userId: dto.userId,
      nickname: dto.nickname,
      statistics: dto.statistics,
      preferences: dto.preferences,
      profileVersion: dto.profileVersion,
    };
  }

  /**
   * Converts an UpdatePlayerProfileDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdatePlayerProfileDto): Partial<PlayerProfile> {
    return {
      nickname: dto.nickname as unknown as PlayerProfile['nickname'],
      level: dto.level as unknown as PlayerProfile['level'],
      experience: dto.experience as unknown as PlayerProfile['experience'],
      prestige: dto.prestige as unknown as PlayerProfile['prestige'],
      accountAge: dto.accountAge,
      tutorialCompleted: dto.tutorialCompleted,
      status: dto.status,
      statistics: dto.statistics,
      preferences: dto.preferences,
      metadata: dto.metadata,
    } as Partial<PlayerProfile>;
  }

  /**
   * Converts a database record to CreatePlayerProfileDto format.
   */
  public static fromRecordToDto(record: PlayerProfileRecord): CreatePlayerProfileDto {
    return {
      userId: record.user_id,
      nickname: record.nickname,
      statistics: record.statistics,
      preferences: record.preferences,
      profileVersion: record.profile_version,
    };
  }

  /**
   * Converts a PlayerProfile entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(profile: PlayerProfile): Omit<PlayerProfileRecord, never> {
    return {
      profile_id: profile.profileId.value,
      user_id: profile.userId,
      nickname: profile.nickname.value,
      level: profile.level.value,
      experience: profile.experience.value,
      prestige: profile.prestige.value,
      account_age: profile.accountAge,
      tutorial_completed: profile.tutorialCompleted,
      profile_version: profile.profileVersion,
      status: profile.status,
      statistics: profile.statistics,
      preferences: profile.preferences,
      metadata: profile.metadata,
      created_at: profile.createdAt.toISOString(),
      updated_at: profile.updatedAt.toISOString(),
    };
  }
}