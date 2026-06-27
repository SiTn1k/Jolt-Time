/**
 * Player Profile Service
 *
 * Production service for managing player profiles.
 * Handles all business logic for player profile operations.
 *
 * Features:
 * - Profile creation and initialization
 * - Profile loading and retrieval
 * - Profile updates with validation
 * - Soft delete and restore
 * - Profile existence checks
 * - Profile summary generation
 */

import { randomUUID } from 'crypto';
import { SupabasePlayerProfileRepository } from '../domains/player-profile/repositories/SupabasePlayerProfileRepository';
import { PlayerProfile } from '../domains/player-profile/entities/PlayerProfile';
import { PlayerProfileId } from '../domains/player-profile/value-objects/PlayerProfileId';
import { PlayerNickname } from '../domains/player-profile/value-objects/PlayerNickname';
import { PlayerLevel } from '../domains/player-profile/value-objects/PlayerLevel';
import { PlayerExperience } from '../domains/player-profile/value-objects/PlayerExperience';
import { PrestigeLevel } from '../domains/player-profile/value-objects/PrestigeLevel';
import { PlayerProfileMapper } from '../domains/player-profile/mappers/PlayerProfileMapper';
import { NicknameValidator } from '../domains/player-profile/validators/NicknameValidator';
import { PlayerLevelValidator } from '../domains/player-profile/validators/PlayerLevelValidator';
import { ExperienceValidator } from '../domains/player-profile/validators/ExperienceValidator';
import type { CreatePlayerProfileDto } from '../domains/player-profile/dto/CreatePlayerProfile.dto';
import type { UpdatePlayerProfileDto } from '../domains/player-profile/dto/UpdatePlayerProfile.dto';
import type { PlayerProfileResponseDto, PlayerProfileSummaryDto } from '../domains/player-profile/dto/PlayerProfileResponse.dto';
import type { PaginationParams, PaginatedResult } from '../shared/types/base.types';
import { createLogger } from '../core/logging/logger.service';

const logger = createLogger('PlayerProfileService');

/**
 * Result type for service operations.
 */
export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Player Profile Service
 * Handles all business logic for player profile operations.
 */
export class PlayerProfileService {
  private readonly repository: SupabasePlayerProfileRepository;
  private readonly mapper: PlayerProfileMapper;

  /**
   * Creates a new PlayerProfileService instance.
   */
  constructor(
    repository?: SupabasePlayerProfileRepository,
    mapper?: PlayerProfileMapper
  ) {
    this.repository = repository ?? new SupabasePlayerProfileRepository();
    this.mapper = mapper ?? new PlayerProfileMapper();
  }

  /**
   * Initialize profile for a new user.
   * If profile exists, loads it. If not, creates a new one.
   *
   * @param userId - The user ID to initialize profile for
   * @param nickname - The nickname for the new profile (required for new profiles)
   * @returns ServiceResult with the profile
   */
  async initializeProfile(userId: string, nickname: string): Promise<ServiceResult<PlayerProfile>> {
    logger.info('Initializing player profile', { userId });

    // Check if profile already exists
    const existingProfile = await this.repository.findByUserId(userId);
    if (existingProfile) {
      logger.info('Player profile already exists', { userId, profileId: existingProfile.profileId.value });
      return { success: true, data: existingProfile };
    }

    // Validate nickname
    const nicknameValidation = NicknameValidator.validate(nickname);
    if (!nicknameValidation.isValid) {
      logger.warn('Invalid nickname provided', { userId, error: nicknameValidation.error });
      return { success: false, error: nicknameValidation.error };
    }

    // Check if nickname is taken
    const nicknameTaken = await this.repository.nicknameExists(nickname);
    if (nicknameTaken) {
      logger.warn('Nickname already taken', { userId, nickname });
      return { success: false, error: 'Nickname is already taken' };
    }

    // Create new profile
    const profile = await this.createProfile({
      userId,
      nickname,
    });

    if (profile.success) {
      logger.info('Player profile initialized', { userId, profileId: profile.data.profileId.value });
    }

    return profile;
  }

  /**
   * Creates a new player profile.
   *
   * @param dto - Profile creation data
   * @returns ServiceResult with the created profile
   */
  async createProfile(dto: CreatePlayerProfileDto): Promise<ServiceResult<PlayerProfile>> {
    logger.debug('Creating player profile', { userId: dto.userId });

    // Validate nickname
    const nicknameValidation = NicknameValidator.validate(dto.nickname);
    if (!nicknameValidation.isValid) {
      return { success: false, error: nicknameValidation.error ?? 'Invalid nickname' };
    }

    // Check if nickname is taken
    const nicknameTaken = await this.repository.nicknameExists(dto.nickname);
    if (nicknameTaken) {
      return { success: false, error: 'Nickname is already taken' };
    }

    // Check if user already has a profile
    const existingProfile = await this.repository.findByUserId(dto.userId);
    if (existingProfile) {
      return { success: false, error: 'User already has a profile' };
    }

    try {
      // Generate new profile ID
      const profileId = PlayerProfileId.reconstruct(randomUUID());
      const playerNickname = PlayerNickname.create(dto.nickname);

      // Create the profile entity
      const profile = PlayerProfile.create({
        profileId,
        userId: dto.userId,
        nickname: playerNickname,
      });

      // Persist to database
      const createdProfile = await this.repository.create(profile);

      logger.info('Player profile created', {
        profileId: createdProfile.profileId.value,
        userId: createdProfile.userId,
      });

      return { success: true, data: createdProfile };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      logger.error('Failed to create player profile', err as Error, { userId: dto.userId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads a profile by profile ID.
   *
   * @param profileId - The profile ID
   * @returns ServiceResult with the profile
   */
  async loadProfile(profileId: string): Promise<ServiceResult<PlayerProfile>> {
    logger.debug('Loading player profile', { profileId });

    try {
      const profileIdVO = PlayerProfileId.reconstruct(profileId);
      const profile = await this.repository.findById(profileIdVO);

      if (!profile) {
        return { success: false, error: 'Profile not found' };
      }

      return { success: true, data: profile };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      logger.error('Failed to load player profile', err as Error, { profileId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads a profile by user ID.
   *
   * @param userId - The user ID
   * @returns ServiceResult with the profile
   */
  async loadProfileByUserId(userId: string): Promise<ServiceResult<PlayerProfile>> {
    logger.debug('Loading player profile by user ID', { userId });

    try {
      const profile = await this.repository.findByUserId(userId);

      if (!profile) {
        return { success: false, error: 'Profile not found' };
      }

      return { success: true, data: profile };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      logger.error('Failed to load player profile by user ID', err as Error, { userId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Updates a player profile.
   *
   * @param profileId - The profile ID
   * @param dto - Update data
   * @returns ServiceResult with the updated profile
   */
  async updateProfile(profileId: string, dto: UpdatePlayerProfileDto): Promise<ServiceResult<PlayerProfile>> {
    logger.debug('Updating player profile', { profileId });

    try {
      // Load existing profile
      const profileIdVO = PlayerProfileId.reconstruct(profileId);
      const existingProfile = await this.repository.findById(profileIdVO);

      if (!existingProfile) {
        return { success: false, error: 'Profile not found' };
      }

      // Build update object
      let updatedProfile = existingProfile;

      // Update nickname if provided
      if (dto.nickname !== undefined) {
        const nicknameValidation = this.nicknameValidator.validate(dto.nickname);
        if (!nicknameValidation.isValid) {
          return { success: false, error: nicknameValidation.error ?? 'Invalid nickname' };
        }

        // Check if new nickname is taken by another profile
        if (dto.nickname !== existingProfile.nickname.value) {
          const nicknameTaken = await this.repository.nicknameExists(dto.nickname);
          if (nicknameTaken) {
            return { success: false, error: 'Nickname is already taken' };
          }
        }

        updatedProfile = updatedProfile.copyWith({
          nickname: PlayerNickname.create(dto.nickname),
        });
      }

      // Update level if provided
      if (dto.level !== undefined) {
        const levelValidation = this.levelValidator.validate(dto.level);
        if (!levelValidation.isValid) {
          return { success: false, error: levelValidation.error ?? 'Invalid level' };
        }
        updatedProfile = updatedProfile.copyWith({
          level: PlayerLevel.reconstruct(dto.level),
        });
      }

      // Update experience if provided
      if (dto.experience !== undefined) {
        const expValidation = this.experienceValidator.validate(dto.experience);
        if (!expValidation.isValid) {
          return { success: false, error: expValidation.error ?? 'Invalid experience' };
        }
        updatedProfile = updatedProfile.copyWith({
          experience: PlayerExperience.reconstruct(dto.experience),
        });
      }

      // Update prestige if provided
      if (dto.prestige !== undefined) {
        updatedProfile = updatedProfile.copyWith({
          prestige: PrestigeLevel.reconstruct(dto.prestige),
        });
      }

      // Update account age if provided
      if (dto.accountAge !== undefined) {
        updatedProfile = updatedProfile.copyWith({
          accountAge: dto.accountAge,
        });
      }

      // Update tutorial completed if provided
      if (dto.tutorialCompleted !== undefined) {
        updatedProfile = updatedProfile.copyWith({
          tutorialCompleted: dto.tutorialCompleted,
        });
      }

      // Update status if provided
      if (dto.status !== undefined) {
        updatedProfile = updatedProfile.copyWith({
          status: dto.status,
        });
      }

      // Update statistics if provided
      if (dto.statistics !== undefined) {
        updatedProfile = updatedProfile.copyWith({
          statistics: dto.statistics,
        });
      }

      // Update preferences if provided
      if (dto.preferences !== undefined) {
        updatedProfile = updatedProfile.copyWith({
          preferences: dto.preferences,
        });
      }

      // Update metadata if provided
      if (dto.metadata !== undefined) {
        updatedProfile = updatedProfile.copyWith({
          metadata: dto.metadata,
        });
      }

      // Save to database
      const savedProfile = await this.repository.update(updatedProfile);

      logger.info('Player profile updated', { profileId });

      return { success: true, data: savedProfile };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      logger.error('Failed to update player profile', err as Error, { profileId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Soft deletes a player profile.
   *
   * @param profileId - The profile ID
   * @returns ServiceResult
   */
  async deleteProfile(profileId: string): Promise<ServiceResult<void>> {
    logger.debug('Deleting player profile', { profileId });

    try {
      const profileIdVO = PlayerProfileId.reconstruct(profileId);

      // Check if profile exists
      const exists = await this.repository.exists(profileIdVO);
      if (!exists) {
        return { success: false, error: 'Profile not found' };
      }

      await this.repository.delete(profileIdVO);

      logger.info('Player profile deleted', { profileId });

      return { success: true, data: undefined };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete profile';
      logger.error('Failed to delete player profile', err as Error, { profileId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Restores a soft-deleted player profile.
   *
   * @param profileId - The profile ID
   * @returns ServiceResult with the restored profile
   */
  async restoreProfile(profileId: string): Promise<ServiceResult<PlayerProfile>> {
    logger.debug('Restoring player profile', { profileId });

    try {
      const profileIdVO = PlayerProfileId.reconstruct(profileId);
      const profile = await this.repository.findById(profileIdVO);

      if (!profile) {
        return { success: false, error: 'Profile not found' };
      }

      // Restore by setting status to active
      const restoredProfile = profile.copyWith({
        status: 'active' as const,
      });

      const savedProfile = await this.repository.update(restoredProfile);

      logger.info('Player profile restored', { profileId });

      return { success: true, data: savedProfile };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore profile';
      logger.error('Failed to restore player profile', err as Error, { profileId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Checks if a profile exists.
   *
   * @param profileId - The profile ID
   * @returns ServiceResult with boolean
   */
  async profileExists(profileId: string): Promise<ServiceResult<boolean>> {
    logger.debug('Checking if profile exists', { profileId });

    try {
      const profileIdVO = PlayerProfileId.reconstruct(profileId);
      const exists = await this.repository.exists(profileIdVO);
      return { success: true, data: exists };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check profile existence';
      logger.error('Failed to check profile existence', err as Error, { profileId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Checks if a nickname is available.
   *
   * @param nickname - The nickname to check
   * @returns ServiceResult with boolean
   */
  async isNicknameAvailable(nickname: string): Promise<ServiceResult<boolean>> {
    logger.debug('Checking nickname availability', { nickname });

    try {
      const nicknameValidation = this.nicknameValidator.validate(nickname);
      if (!nicknameValidation.isValid) {
        return { success: false, error: nicknameValidation.error ?? 'Invalid nickname' };
      }

      const exists = await this.repository.nicknameExists(nickname);
      return { success: true, data: !exists };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check nickname availability';
      logger.error('Failed to check nickname availability', err as Error, { nickname });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads profile and returns response DTO.
   *
   * @param profileId - The profile ID
   * @returns ServiceResult with response DTO
   */
  async loadProfileResponse(profileId: string): Promise<ServiceResult<PlayerProfileResponseDto>> {
    const result = await this.loadProfile(profileId);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const responseDto = this.mapper.toResponse(result.data);
    return { success: true, data: responseDto };
  }

  /**
   * Loads profile by user ID and returns response DTO.
   *
   * @param userId - The user ID
   * @returns ServiceResult with response DTO
   */
  async loadProfileResponseByUserId(userId: string): Promise<ServiceResult<PlayerProfileResponseDto>> {
    const result = await this.loadProfileByUserId(userId);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const responseDto = this.mapper.toResponse(result.data);
    return { success: true, data: responseDto };
  }

  /**
   * Loads profile summary.
   *
   * @param profileId - The profile ID
   * @returns ServiceResult with summary DTO
   */
  async loadProfileSummary(profileId: string): Promise<ServiceResult<PlayerProfileSummaryDto>> {
    const result = await this.loadProfile(profileId);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const summaryDto = this.mapper.toSummary(result.data);
    return { success: true, data: summaryDto };
  }

  /**
   * Lists profiles with pagination.
   *
   * @param params - Pagination parameters
   * @returns ServiceResult with paginated profiles
   */
  async listProfiles(params: PaginationParams): Promise<ServiceResult<PaginatedResult<PlayerProfileResponseDto>>> {
    logger.debug('Listing profiles', { params });

    try {
      const result = await this.repository.list(params);

      const responseItems = result.items.map((profile) => this.mapper.toResponse(profile));

      return {
        success: true,
        data: {
          ...result,
          items: responseItems,
        },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list profiles';
      logger.error('Failed to list profiles', err as Error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Adds experience to a profile.
   *
   * @param profileId - The profile ID
   * @param amount - Experience amount to add
   * @returns ServiceResult with updated profile
   */
  async addExperience(profileId: string, amount: number): Promise<ServiceResult<PlayerProfile>> {
    logger.debug('Adding experience', { profileId, amount });

    const result = await this.loadProfile(profileId);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    const updatedProfile = result.data.addExperience(amount);
    const savedProfile = await this.repository.update(updatedProfile);

    logger.info('Experience added', { profileId, amount, newLevel: savedProfile.level.value });

    return { success: true, data: savedProfile };
  }

  /**
   * Completes tutorial for a profile.
   *
   * @param profileId - The profile ID
   * @returns ServiceResult with updated profile
   */
  async completeTutorial(profileId: string): Promise<ServiceResult<PlayerProfile>> {
    logger.debug('Completing tutorial', { profileId });

    const result = await this.loadProfile(profileId);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    const updatedProfile = result.data.completeTutorial();
    const savedProfile = await this.repository.update(updatedProfile);

    logger.info('Tutorial completed', { profileId });

    return { success: true, data: savedProfile };
  }

  /**
   * Performs prestige reset on a profile.
   *
   * @param profileId - The profile ID
   * @param resetStatistics - Whether to reset statistics
   * @returns ServiceResult with updated profile
   */
  async prestigeReset(profileId: string, resetStatistics: boolean = true): Promise<ServiceResult<PlayerProfile>> {
    logger.debug('Performing prestige reset', { profileId, resetStatistics });

    const result = await this.loadProfile(profileId);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    const updatedProfile = result.data.prestigeReset(resetStatistics);
    const savedProfile = await this.repository.update(updatedProfile);

    logger.info('Prestige reset performed', {
      profileId,
      newPrestige: savedProfile.prestige.value,
      newLevel: savedProfile.level.value,
    });

    return { success: true, data: savedProfile };
  }

  /**
   * Gets total profile count.
   *
   * @returns ServiceResult with count
   */
  async getProfileCount(): Promise<ServiceResult<number>> {
    try {
      const count = await this.repository.count();
      return { success: true, data: count };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to count profiles';
      logger.error('Failed to count profiles', err as Error);
      return { success: false, error: errorMessage };
    }
  }
}

/**
 * Create a new PlayerProfileService instance.
 */
export function createPlayerProfileService(): PlayerProfileService {
  return new PlayerProfileService();
}
