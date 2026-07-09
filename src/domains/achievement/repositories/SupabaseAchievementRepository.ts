/**
 * Supabase Achievement Repository
 *
 * Production Supabase implementation of the Achievement repository.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { IAchievementRepository, AchievementFilterParams } from '../interfaces/IAchievementRepository';
import { Achievement, AchievementRecord } from '../entities/Achievement';
import { AchievementId } from '../value-objects/AchievementId';
import { AchievementSlug } from '../value-objects/AchievementSlug';
import type { AchievementCategory } from '../types/AchievementCategory';
import type { AchievementRarity } from '../types/AchievementRarity';
import type { AchievementMetadata } from '../types/AchievementMetadata';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { RepositoryError } from '../../../database/errors';

/**
 * Supabase implementation of the Achievement Repository.
 * Implements IAchievementRepository for Achievement entity persistence.
 */
export class SupabaseAchievementRepository implements IAchievementRepository {
  private readonly tableName = 'achievements';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseAchievementRepository instance.
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
   * Maps a database row to AchievementRecord format.
   */
  private mapRowToRecord(row: Record<string, unknown>): AchievementRecord {
    return {
      achievementId: row.id as string,
      slug: row.slug as string,
      title: row.title as string,
      description: row.description as string,
      category: row.category as AchievementCategory,
      rarity: row.rarity as AchievementRarity,
      points: row.points as number,
      icon: row.icon as string,
      rewardDefinition: row.reward_definition as AchievementMetadata['rewardDefinition'],
      isHidden: row.is_hidden as boolean,
      isActive: row.is_active as boolean,
      metadata: row.metadata as AchievementMetadata,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  /**
   * Maps a database row to an Achievement entity.
   */
  private mapRowToEntity(row: Record<string, unknown>): Achievement {
    const record = this.mapRowToRecord(row);
    return Achievement.fromStorage(record);
  }

  /**
   * Converts an Achievement entity to database insert format.
   */
  private toInsertRecord(achievement: Achievement): Record<string, unknown> {
    return {
      id: achievement.achievementId.value,
      slug: achievement.slug.value,
      title: achievement.title,
      description: achievement.description,
      category: achievement.category,
      rarity: achievement.rarity,
      points: achievement.points,
      icon: achievement.icon,
      reward_definition: achievement.rewardDefinition,
      is_hidden: achievement.isHidden,
      is_active: achievement.isActive,
      metadata: achievement.metadata,
      created_at: achievement.createdAt.toISOString(),
      updated_at: achievement.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an Achievement entity to database update format.
   */
  private toUpdateRecord(achievement: Achievement): Record<string, unknown> {
    return {
      slug: achievement.slug.value,
      title: achievement.title,
      description: achievement.description,
      category: achievement.category,
      rarity: achievement.rarity,
      points: achievement.points,
      icon: achievement.icon,
      reward_definition: achievement.rewardDefinition,
      is_hidden: achievement.isHidden,
      is_active: achievement.isActive,
      metadata: achievement.metadata,
      updated_at: achievement.updatedAt.toISOString(),
    };
  }

  /**
   * Calculates pagination offset from page and pageSize.
   */
  private calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.pageSize;
  }

  /**
   * Creates a new achievement.
   * @param achievement The achievement to create
   * @returns The created achievement
   */
  async create(achievement: Achievement): Promise<Achievement> {
    try {
      const record = this.toInsertRecord(achievement);
      const { data, error } = await this.client
        .from(this.tableName)
        .insert(record as any)
        .select()
        .single();

      if (error) {
        throw RepositoryError.createFailed('Achievement', error);
      }

      if (!data) {
        throw RepositoryError.createFailed('Achievement');
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('Achievement', err as Error);
    }
  }

  /**
   * Finds an achievement by its ID.
   * @param id The achievement ID to find
   * @returns The achievement if found, null otherwise
   */
  async findById(id: AchievementId): Promise<Achievement | null> {
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
        throw RepositoryError.entityNotFound('Achievement', id.value, this.tableName);
      }

      if (!data) {
        return null;
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.entityNotFound('Achievement', id.value, this.tableName);
    }
  }

  /**
   * Finds an achievement by its slug.
   * @param slug The achievement slug to find
   * @returns The achievement if found, null otherwise
   */
  async findBySlug(slug: AchievementSlug): Promise<Achievement | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('slug', slug.value)
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
   * Checks if an achievement exists by ID.
   * @param id The achievement ID to check
   * @returns true if achievement exists
   */
  async exists(id: AchievementId): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('id')
        .eq('id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false;
        }
        return false;
      }

      return !!data;
    } catch {
      return false;
    }
  }

  /**
   * Updates an existing achievement.
   * @param achievement The achievement to update
   * @returns The updated achievement
   */
  async update(achievement: Achievement): Promise<Achievement> {
    try {
      const record = this.toUpdateRecord(achievement);
      const { data, error } = await this.client
        .from(this.tableName)
        .update(record as any)
        .eq('id', achievement.achievementId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('Achievement', achievement.achievementId.value, error);
      }

      if (!data) {
        throw RepositoryError.updateFailed('Achievement', achievement.achievementId.value);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.updateFailed('Achievement', achievement.achievementId.value, err as Error);
    }
  }

  /**
   * Deletes an achievement.
   * @param id The achievement ID to delete
   */
  async delete(id: AchievementId): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('Achievement', id.value, error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.deleteFailed('Achievement', id.value, err as Error);
    }
  }

  /**
   * Lists achievements with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of achievements
   */
  async list(
    params: PaginationParams,
    filters?: AchievementFilterParams
  ): Promise<PaginatedResult<Achievement>> {
    try {
      let query = this.client.from(this.tableName).select('*', { count: 'exact' });

      if (filters) {
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.rarity) {
          query = query.eq('rarity', filters.rarity);
        }
        if (filters.isActive !== undefined) {
          query = query.eq('is_active', filters.isActive);
        }
        if (filters.isHidden !== undefined) {
          query = query.eq('is_hidden', filters.isHidden);
        }
        if (filters.slugPattern) {
          query = query.like('slug', `%${filters.slugPattern}%`);
        }
      }

      const offset = this.calculateOffset(params);
      query = query.range(offset, offset + params.pageSize - 1);

      if (params.sortBy) {
        const sortOrder = params.sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';
        query = query.order(params.sortBy as string, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.createFailed('Achievement list', error);
      }

      const achievements = (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items: achievements,
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
      throw RepositoryError.createFailed('Achievement list', err as Error);
    }
  }

  /**
   * Finds all active achievements.
   * @param category Optional category filter
   * @returns Array of active achievements
   */
  async findActive(category?: AchievementCategory): Promise<Achievement[]> {
    try {
      let query = this.client
        .from(this.tableName)
        .select('*')
        .eq('is_active', true);

      if (category) {
        query = query.eq('category', category);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw RepositoryError.createFailed('Active achievements', error);
      }

      return (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('Active achievements', err as Error);
    }
  }

  /**
   * Counts total achievements with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching achievements
   */
  async count(filters?: AchievementFilterParams): Promise<number> {
    try {
      let query = this.client.from(this.tableName).select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.rarity) {
          query = query.eq('rarity', filters.rarity);
        }
        if (filters.isActive !== undefined) {
          query = query.eq('is_active', filters.isActive);
        }
        if (filters.isHidden !== undefined) {
          query = query.eq('is_hidden', filters.isHidden);
        }
      }

      const { count, error } = await query;

      if (error) {
        throw RepositoryError.createFailed('Achievement count', error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('Achievement count', err as Error);
    }
  }
}
