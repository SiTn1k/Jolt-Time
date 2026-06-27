/**
 * Supabase Quest Repository
 *
 * Production Supabase implementation of the Quest repository.
 * Handles all persistence operations for Quest entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { IQuestRepository, QuestFilterParams } from '../interfaces/IQuestRepository';
import { Quest, QuestRecord } from '../entities/Quest';
import { QuestId } from '../value-objects/QuestId';
import { QuestSlug } from '../value-objects/QuestSlug';
import type { QuestCategory } from '../types/QuestCategory';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';

const logger = createLogger('SupabaseQuestRepository');

/**
 * Supabase implementation of the Quest Repository.
 * Implements IQuestRepository for Quest entity persistence.
 */
export class SupabaseQuestRepository implements IQuestRepository {
  private readonly tableName = 'quests';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseQuestRepository instance.
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
   * Maps a database row to QuestRecord format.
   */
  private mapRowToRecord(row: Record<string, unknown>): QuestRecord {
    return {
      questId: row.quest_id as string,
      slug: row.slug as string,
      title: row.title as string,
      description: row.description as string,
      category: row.category as QuestCategory,
      difficulty: row.difficulty as QuestRecord['difficulty'],
      repeatType: row.repeat_type as QuestRecord['repeatType'],
      requiredLevel: row.required_level as number,
      requiredResearch: (row.required_research as string[]) || [],
      rewardDefinition: row.reward_definition as QuestRecord['rewardDefinition'],
      isActive: row.is_active as boolean,
      metadata: row.metadata as QuestRecord['metadata'],
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  /**
   * Maps a database row to a Quest entity.
   */
  private mapRowToEntity(row: Record<string, unknown>): Quest {
    const record = this.mapRowToRecord(row);
    return Quest.fromStorage(record);
  }

  /**
   * Converts a Quest entity to database insert format.
   */
  private toInsertRecord(quest: Quest): Record<string, unknown> {
    return {
      quest_id: quest.questId.value,
      slug: quest.slug.value,
      title: quest.title,
      description: quest.description,
      category: quest.category,
      difficulty: quest.difficulty,
      repeat_type: quest.repeatType,
      required_level: quest.requiredLevel,
      required_research: quest.requiredResearch,
      reward_definition: quest.rewardDefinition,
      is_active: quest.isActive,
      metadata: quest.metadata,
      created_at: quest.createdAt.toISOString(),
      updated_at: quest.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a Quest entity to database update format.
   */
  private toUpdateRecord(quest: Quest): Record<string, unknown> {
    return {
      slug: quest.slug.value,
      title: quest.title,
      description: quest.description,
      category: quest.category,
      difficulty: quest.difficulty,
      repeat_type: quest.repeatType,
      required_level: quest.requiredLevel,
      required_research: quest.requiredResearch,
      reward_definition: quest.rewardDefinition,
      is_active: quest.isActive,
      metadata: quest.metadata,
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Calculates pagination offset from page and pageSize.
   */
  private calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.pageSize;
  }

  /**
   * Creates a new quest.
   * @param quest The quest to create
   * @returns The created quest
   */
  async create(quest: Quest): Promise<Quest> {
    logger.debug('Creating quest', { questId: quest.questId.value, slug: quest.slug.value });

    try {
      const record = this.toInsertRecord(quest);
      const { data, error } = await this.client.from(this.tableName).insert(record).select().single();

      if (error) {
        if (error.code === '23505') {
          throw RepositoryError.alreadyExists('Quest', 'quest_id', quest.questId.value, this.tableName);
        }
        logger.error('Failed to create quest', error);
        throw RepositoryError.createFailed('Quest', new Error(error.message));
      }

      logger.info('Quest created', {
        questId: quest.questId.value,
        slug: quest.slug.value,
      });

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to create quest', err as Error);
      throw RepositoryError.createFailed('Quest', err as Error);
    }
  }

  /**
   * Finds a quest by its ID.
   * @param id The quest ID to find
   * @returns The quest if found, null otherwise
   */
  async findById(id: QuestId): Promise<Quest | null> {
    logger.debug('Finding quest by ID', { questId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('quest_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('Quest', id.value, this.tableName);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find quest by ID', err as Error, { questId: id.value });
      throw RepositoryError.entityNotFound('Quest', id.value, this.tableName);
    }
  }

  /**
   * Finds a quest by its slug.
   * @param slug The quest slug to find
   * @returns The quest if found, null otherwise
   */
  async findBySlug(slug: QuestSlug): Promise<Quest | null> {
    logger.debug('Finding quest by slug', { slug: slug.value });

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
        throw RepositoryError.entityNotFound('Quest', slug.value, this.tableName);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find quest by slug', err as Error, { slug: slug.value });
      throw RepositoryError.entityNotFound('Quest', slug.value, this.tableName);
    }
  }

  /**
   * Checks if a quest exists by ID.
   * @param id The quest ID to check
   * @returns true if quest exists
   */
  async exists(id: QuestId): Promise<boolean> {
    logger.debug('Checking if quest exists', { questId: id.value });

    try {
      const { error } = await this.client
        .from(this.tableName)
        .select('quest_id')
        .eq('quest_id', id.value)
        .limit(1);

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      return true;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to check quest existence', err as Error, { questId: id.value });
      return false;
    }
  }

  /**
   * Updates an existing quest.
   * @param quest The quest to update
   * @returns The updated quest
   */
  async update(quest: Quest): Promise<Quest> {
    logger.debug('Updating quest', { questId: quest.questId.value });

    try {
      const record = this.toUpdateRecord(quest);
      const { data, error } = await this.client
        .from(this.tableName)
        .update(record)
        .eq('quest_id', quest.questId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update quest', error);
        throw RepositoryError.updateFailed('Quest', quest.questId.value, new Error(error.message));
      }

      logger.info('Quest updated', { questId: quest.questId.value });

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to update quest', err as Error, { questId: quest.questId.value });
      throw RepositoryError.updateFailed('Quest', quest.questId.value, err as Error);
    }
  }

  /**
   * Deletes a quest.
   * @param id The quest ID to delete
   */
  async delete(id: QuestId): Promise<void> {
    logger.debug('Deleting quest', { questId: id.value });

    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('quest_id', id.value);

      if (error) {
        logger.error('Failed to delete quest', error);
        throw RepositoryError.deleteFailed('Quest', id.value, new Error(error.message));
      }

      logger.info('Quest deleted', { questId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to delete quest', err as Error, { questId: id.value });
      throw RepositoryError.deleteFailed('Quest', id.value, err as Error);
    }
  }

  /**
   * Lists quests with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of quests
   */
  async list(
    params: PaginationParams,
    filters?: QuestFilterParams
  ): Promise<PaginatedResult<Quest>> {
    logger.debug('Listing quests', { params, filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.requiredLevel !== undefined) {
        query = query.lte('required_level', filters.requiredLevel);
      }

      if (filters?.slugPattern) {
        query = query.like('slug', `%${filters.slugPattern}%`);
      }

      // Apply sorting
      const sortBy = params.sortBy || 'created_at';
      const sortOrder = params.sortOrder === 'asc' ? true : false;
      query = query.order(sortBy, { ascending: sortOrder });

      // Apply pagination
      const offset = this.calculateOffset(params);
      query = query.range(offset, offset + params.pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      const items = (data as Record<string, unknown>[]).map((row) => this.mapRowToEntity(row));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items,
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
      logger.error('Failed to list quests', err as Error);
      throw RepositoryError.queryFailed('list', err as Error);
    }
  }

  /**
   * Finds all active quests.
   * @param category Optional category filter
   * @returns Array of active quests
   */
  async findActive(category?: QuestCategory): Promise<Quest[]> {
    logger.debug('Finding active quests', { category });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*')
        .eq('is_active', true);

      if (category) {
        query = query.eq('category', category);
      }

      query = query.order('required_level', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      return (data as Record<string, unknown>[]).map((row) => this.mapRowToEntity(row));
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find active quests', err as Error);
      throw RepositoryError.queryFailed('findActive', err as Error);
    }
  }

  /**
   * Counts total quests with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching quests
   */
  async count(filters?: QuestFilterParams): Promise<number> {
    logger.debug('Counting quests', { filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.requiredLevel !== undefined) {
        query = query.lte('required_level', filters.requiredLevel);
      }

      if (filters?.slugPattern) {
        query = query.like('slug', `%${filters.slugPattern}%`);
      }

      const { error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to count quests', err as Error);
      throw RepositoryError.queryFailed('count', err as Error);
    }
  }
}
