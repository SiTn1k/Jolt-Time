/**
 * Supabase Achievement Progress Repository
 *
 * Production Supabase implementation of the AchievementProgress repository.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { IAchievementProgressRepository, AchievementProgressFilterParams } from '../interfaces/IAchievementProgressRepository';
import { AchievementProgress, AchievementProgressRecord } from '../entities/AchievementProgress';
import { AchievementProgressId } from '../entities/AchievementProgressId';
import { AchievementStatus } from '../types/AchievementStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { RepositoryError } from '../../../database/errors';

/**
 * Supabase implementation of the AchievementProgress Repository.
 * Implements IAchievementProgressRepository for AchievementProgress entity persistence.
 */
export class SupabaseAchievementProgressRepository implements IAchievementProgressRepository {
  private readonly tableName = 'achievement_progress';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseAchievementProgressRepository instance.
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
   * Maps a database row to AchievementProgressRecord format.
   */
  private mapRowToRecord(row: Record<string, unknown>): AchievementProgressRecord {
    return {
      progressId: row.id as string,
      playerProfileId: row.player_profile_id as string,
      achievementId: row.achievement_id as string,
      status: row.status as AchievementStatus,
      currentValue: row.current_value as number,
      completedAt: row.completed_at as string | null,
      claimedAt: row.claimed_at as string | null,
      metadata: row.metadata as Record<string, string | number | boolean>,
      startedAt: row.started_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  /**
   * Maps a database row to an AchievementProgress entity.
   */
  private mapRowToEntity(row: Record<string, unknown>): AchievementProgress {
    const record = this.mapRowToRecord(row);
    return AchievementProgress.fromStorage(record);
  }

  /**
   * Converts an AchievementProgress entity to database insert format.
   */
  private toInsertRecord(progress: AchievementProgress): Record<string, unknown> {
    return {
      id: progress.progressId,
      player_profile_id: progress.playerProfileId,
      achievement_id: progress.achievementId,
      status: progress.status,
      current_value: progress.currentValue,
      completed_at: progress.completedAt?.toISOString() ?? null,
      claimed_at: progress.claimedAt?.toISOString() ?? null,
      metadata: progress.metadata,
      started_at: progress.startedAt.toISOString(),
      updated_at: progress.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an AchievementProgress entity to database update format.
   */
  private toUpdateRecord(progress: AchievementProgress): Record<string, unknown> {
    return {
      status: progress.status,
      current_value: progress.currentValue,
      completed_at: progress.completedAt?.toISOString() ?? null,
      claimed_at: progress.claimedAt?.toISOString() ?? null,
      metadata: progress.metadata,
      updated_at: progress.updatedAt.toISOString(),
    };
  }

  /**
   * Calculates pagination offset from page and pageSize.
   */
  private calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.pageSize;
  }

  /**
   * Creates new achievement progress.
   * @param progress The progress to create
   * @returns The created progress
   */
  async create(progress: AchievementProgress): Promise<AchievementProgress> {
    try {
      const record = this.toInsertRecord(progress);
      const { data, error } = await this.client
        .from(this.tableName)
        .insert(record as any)
        .select()
        .single();

      if (error) {
        throw RepositoryError.createFailed('AchievementProgress', error);
      }

      if (!data) {
        throw RepositoryError.createFailed('AchievementProgress');
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('AchievementProgress', err as Error);
    }
  }

  /**
   * Finds progress by its ID.
   * @param id The progress ID to find
   * @returns The progress if found, null otherwise
   */
  async findById(id: AchievementProgressId): Promise<AchievementProgress | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('AchievementProgress', id.value, this.tableName);
      }

      if (!data) {
        return null;
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.entityNotFound('AchievementProgress', id.value, this.tableName);
    }
  }

  /**
   * Finds all progress for a player.
   * @param playerProfileId The player profile ID
   * @returns Array of progress entries
   */
  async findByPlayerId(playerProfileId: string): Promise<AchievementProgress[]> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('player_profile_id', playerProfileId);

      if (error) {
        throw RepositoryError.createFailed('AchievementProgress list', error);
      }

      return (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('AchievementProgress list', err as Error);
    }
  }

  /**
   * Finds progress for a specific achievement and player.
   * @param playerProfileId The player profile ID
   * @param achievementId The achievement ID
   * @returns The progress if found, null otherwise
   */
  async findByPlayerAndAchievement(
    playerProfileId: string,
    achievementId: string
  ): Promise<AchievementProgress | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('player_profile_id', playerProfileId)
        .eq('achievement_id', achievementId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        return null;
      }

      if (!data) {
        return null;
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch {
      return null;
    }
  }

  /**
   * Updates existing progress.
   * @param progress The progress to update
   * @returns The updated progress
   */
  async update(progress: AchievementProgress): Promise<AchievementProgress> {
    try {
      const record = this.toUpdateRecord(progress);
      const { data, error } = await this.client
        .from(this.tableName)
        .update(record as any)
        .eq('id', progress.progressId)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('AchievementProgress', progress.progressId, error);
      }

      if (!data) {
        throw RepositoryError.updateFailed('AchievementProgress', progress.progressId);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.updateFailed('AchievementProgress', progress.progressId, err as Error);
    }
  }

  /**
   * Deletes progress.
   * @param id The progress ID to delete
   */
  async delete(id: AchievementProgressId): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('AchievementProgress', id.value, error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.deleteFailed('AchievementProgress', id.value, err as Error);
    }
  }

  /**
   * Lists progress with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of progress entries
   */
  async list(
    params: PaginationParams,
    filters?: AchievementProgressFilterParams
  ): Promise<PaginatedResult<AchievementProgress>> {
    try {
      let query = this.client.from(this.tableName).select('*', { count: 'exact' });

      if (filters) {
        if (filters.playerProfileId) {
          query = query.eq('player_profile_id', filters.playerProfileId);
        }
        if (filters.achievementId) {
          query = query.eq('achievement_id', filters.achievementId);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.isClaimable !== undefined) {
          if (filters.isClaimable) {
            query = query.eq('status', AchievementStatus.COMPLETED);
          }
        }
      }

      const offset = this.calculateOffset(params);
      query = query.range(offset, offset + params.pageSize - 1);

      if (params.sortBy) {
        const sortOrder = params.sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';
        query = query.order(params.sortBy as string, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('updated_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.createFailed('AchievementProgress list', error);
      }

      const progress = (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items: progress,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('AchievementProgress list', err as Error);
    }
  }

  /**
   * Finds all claimable progress for a player.
   * @param playerProfileId The player profile ID
   * @returns Array of claimable progress entries
   */
  async findClaimable(playerProfileId: string): Promise<AchievementProgress[]> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('player_profile_id', playerProfileId)
        .eq('status', AchievementStatus.COMPLETED);

      if (error) {
        throw RepositoryError.createFailed('Claimable achievements', error);
      }

      return (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('Claimable achievements', err as Error);
    }
  }

  /**
   * Counts total progress entries with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching progress entries
   */
  async count(filters?: AchievementProgressFilterParams): Promise<number> {
    try {
      let query = this.client.from(this.tableName).select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.playerProfileId) {
          query = query.eq('player_profile_id', filters.playerProfileId);
        }
        if (filters.achievementId) {
          query = query.eq('achievement_id', filters.achievementId);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.isClaimable !== undefined) {
          if (filters.isClaimable) {
            query = query.eq('status', AchievementStatus.COMPLETED);
          }
        }
      }

      const { count, error } = await query;

      if (error) {
        throw RepositoryError.createFailed('AchievementProgress count', error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('AchievementProgress count', err as Error);
    }
  }
}
