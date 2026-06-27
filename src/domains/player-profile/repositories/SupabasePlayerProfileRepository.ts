/**
 * Supabase Player Profile Repository
 *
 * Production Supabase implementation of the PlayerProfile repository.
 * Handles all persistence operations for PlayerProfile entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { IPlayerProfileRepository, PlayerProfileFilterParams } from '../interfaces/IPlayerProfileRepository';
import { PlayerProfile, PlayerProfileRecord } from '../entities/PlayerProfile';
import type { PlayerProfileId } from '../value-objects/PlayerProfileId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { RepositoryError } from '../../../database/errors';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('SupabasePlayerProfileRepository');

/**
 * Supabase implementation of the PlayerProfile Repository.
 * Implements IPlayerProfileRepository for PlayerProfile entity persistence.
 */
export class SupabasePlayerProfileRepository implements IPlayerProfileRepository {
  private readonly tableName = 'player_profiles';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabasePlayerProfileRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client;
  }

  /**
   * Get the Supabase client.
   */
  private get client(): SupabaseClient<Database> {
    return this._client ?? getSupabaseClient();
  }

  /**
   * Maps a database row to PlayerProfileRecord format.
   */
  private mapRowToRecord(row: Record<string, unknown>): PlayerProfileRecord {
    return {
      profile_id: row.profile_id as string,
      user_id: row.user_id as string,
      nickname: row.nickname as string,
      level: row.level as number,
      experience: row.experience as number,
      prestige: row.prestige as number,
      account_age: row.account_age as number,
      tutorial_completed: row.tutorial_completed as boolean,
      profile_version: row.profile_version as number,
      status: row.status as string,
      statistics: row.statistics as PlayerProfile['statistics'],
      preferences: row.preferences as PlayerProfile['preferences'],
      metadata: row.metadata as PlayerProfile['metadata'],
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  }

  /**
   * Maps a database row to a PlayerProfile entity.
   */
  private mapRowToEntity(row: Record<string, unknown>): PlayerProfile {
    const record = this.mapRowToRecord(row);
    return PlayerProfile.fromDatabase(record);
  }

  /**
   * Converts a PlayerProfile entity to database insert format.
   */
  private toInsertRecord(profile: PlayerProfile): Record<string, unknown> {
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

  /**
   * Converts a PlayerProfile entity to database update format.
   */
  private toUpdateRecord(profile: PlayerProfile): Record<string, unknown> {
    return {
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
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Creates a new player profile.
   * @param profile The profile to create
   * @returns The created profile
   */
  async create(profile: PlayerProfile): Promise<PlayerProfile> {
    logger.debug('Creating player profile', { profileId: profile.profileId.value });

    try {
      const record = this.toInsertRecord(profile);

      const { data, error } = await this.client
        .from(this.tableName)
        .insert([record])
        .select()
        .single();

      if (error) {
        logger.error('Failed to create player profile', error);
        throw RepositoryError.createFailed('PlayerProfile', error as Error);
      }

      logger.info('Player profile created', { profileId: profile.profileId.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating player profile', err as Error);
      throw RepositoryError.createFailed('PlayerProfile', err as Error);
    }
  }

  /**
   * Finds a profile by its internal ID.
   * @param id The profile ID to find
   * @returns The profile if found, null otherwise
   */
  async findById(id: PlayerProfileId): Promise<PlayerProfile | null> {
    logger.debug('Finding player profile by ID', { profileId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('profile_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find player profile by ID', error);
        throw RepositoryError.queryFailed('findById', error as Error);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding player profile by ID', err as Error);
      throw RepositoryError.queryFailed('findById', err as Error);
    }
  }

  /**
   * Finds a profile by user ID.
   * @param userId The user ID to find profile for
   * @returns The profile if found, null otherwise
   */
  async findByUserId(userId: string): Promise<PlayerProfile | null> {
    logger.debug('Finding player profile by user ID', { userId });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find player profile by user ID', error);
        throw RepositoryError.queryFailed('findByUserId', error as Error);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding player profile by user ID', err as Error);
      throw RepositoryError.queryFailed('findByUserId', err as Error);
    }
  }

  /**
   * Finds a profile by nickname.
   * @param nickname The nickname to search for
   * @returns The profile if found, null otherwise
   */
  async findByNickname(nickname: string): Promise<PlayerProfile | null> {
    logger.debug('Finding player profile by nickname', { nickname });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('nickname', nickname)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find player profile by nickname', error);
        throw RepositoryError.queryFailed('findByNickname', error as Error);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding player profile by nickname', err as Error);
      throw RepositoryError.queryFailed('findByNickname', err as Error);
    }
  }

  /**
   * Checks if a profile exists by ID.
   * @param id The profile ID to check
   * @returns true if profile exists
   */
  async exists(id: PlayerProfileId): Promise<boolean> {
    logger.debug('Checking if player profile exists', { profileId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('profile_id')
        .eq('profile_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false;
        }
        logger.error('Failed to check player profile existence', error);
        throw RepositoryError.queryFailed('exists', error as Error);
      }

      return data !== null;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error checking player profile existence', err as Error);
      throw RepositoryError.queryFailed('exists', err as Error);
    }
  }

  /**
   * Checks if a nickname is already taken.
   * @param nickname The nickname to check
   * @returns true if nickname is taken
   */
  async nicknameExists(nickname: string): Promise<boolean> {
    logger.debug('Checking if nickname exists', { nickname });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('profile_id')
        .eq('nickname', nickname)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false;
        }
        logger.error('Failed to check nickname existence', error);
        throw RepositoryError.queryFailed('nicknameExists', error as Error);
      }

      return data !== null;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error checking nickname existence', err as Error);
      throw RepositoryError.queryFailed('nicknameExists', err as Error);
    }
  }

  /**
   * Updates an existing profile.
   * @param profile The profile to update
   * @returns The updated profile
   */
  async update(profile: PlayerProfile): Promise<PlayerProfile> {
    logger.debug('Updating player profile', { profileId: profile.profileId.value });

    try {
      const record = this.toUpdateRecord(profile);

      const { data, error } = await this.client
        .from(this.tableName)
        .update(record)
        .eq('profile_id', profile.profileId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update player profile', error);
        throw RepositoryError.updateFailed('PlayerProfile', profile.profileId.value, error as Error);
      }

      logger.info('Player profile updated', { profileId: profile.profileId.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating player profile', err as Error);
      throw RepositoryError.updateFailed('PlayerProfile', profile.profileId.value, err as Error);
    }
  }

  /**
   * Soft deletes a profile by setting status to 'deleted'.
   * @param id The profile ID to delete
   */
  async delete(id: PlayerProfileId): Promise<void> {
    logger.debug('Soft deleting player profile', { profileId: id.value });

    try {
      const updateData = {
        status: 'deleted',
        updated_at: new Date().toISOString(),
      };

      const { error } = await this.client
        .from(this.tableName)
        .update(updateData)
        .eq('profile_id', id.value);

      if (error) {
        logger.error('Failed to delete player profile', error);
        throw RepositoryError.deleteFailed('PlayerProfile', id.value, error as Error);
      }

      logger.info('Player profile deleted', { profileId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting player profile', err as Error);
      throw RepositoryError.deleteFailed('PlayerProfile', id.value, err as Error);
    }
  }

  /**
   * Lists profiles with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of profiles
   */
  async list(
    params: PaginationParams,
    filters?: PlayerProfileFilterParams
  ): Promise<PaginatedResult<PlayerProfile>> {
    logger.debug('Listing player profiles', { params, filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.minLevel !== undefined) {
          query = query.gte('level', filters.minLevel);
        }
        if (filters.maxLevel !== undefined) {
          query = query.lte('level', filters.maxLevel);
        }
        if (filters.minPrestige !== undefined) {
          query = query.gte('prestige', filters.minPrestige);
        }
        if (filters.maxPrestige !== undefined) {
          query = query.lte('prestige', filters.maxPrestige);
        }
        if (filters.tutorialCompleted !== undefined) {
          query = query.eq('tutorial_completed', filters.tutorialCompleted);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      // Apply sorting
      const sortField = params.sortBy || 'created_at';
      const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const page = Math.max(1, params.page);
      const pageSize = Math.min(Math.max(1, params.pageSize), 100);
      const offset = (page - 1) * pageSize;
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list player profiles', error);
        throw RepositoryError.queryFailed('list', error as Error);
      }

      const items = (data || []).map((row) =>
        this.mapRowToEntity(row as Record<string, unknown>)
      );
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing player profiles', err as Error);
      throw RepositoryError.queryFailed('list', err as Error);
    }
  }

  /**
   * Counts total profiles with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching profiles
   */
  async count(filters?: PlayerProfileFilterParams): Promise<number> {
    logger.debug('Counting player profiles', { filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters) {
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.minLevel !== undefined) {
          query = query.gte('level', filters.minLevel);
        }
        if (filters.maxLevel !== undefined) {
          query = query.lte('level', filters.maxLevel);
        }
        if (filters.minPrestige !== undefined) {
          query = query.gte('prestige', filters.minPrestige);
        }
        if (filters.maxPrestige !== undefined) {
          query = query.lte('prestige', filters.maxPrestige);
        }
        if (filters.tutorialCompleted !== undefined) {
          query = query.eq('tutorial_completed', filters.tutorialCompleted);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const { error, count } = await query;

      if (error) {
        logger.error('Failed to count player profiles', error);
        throw RepositoryError.queryFailed('count', error as Error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting player profiles', err as Error);
      throw RepositoryError.queryFailed('count', err as Error);
    }
  }
}