/**
 * Supabase QuestProgress Repository
 *
 * Production Supabase implementation of the QuestProgress repository.
 * Handles all persistence operations for QuestProgress entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { IQuestProgressRepository, QuestProgressFilterParams } from '../interfaces/IQuestProgressRepository';
import { QuestProgress, QuestProgressRecord } from '../entities/QuestProgress';
import { QuestProgressId } from '../entities/QuestProgressId';
import { QuestStatus } from '../types/QuestStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';

const logger = createLogger('SupabaseQuestProgressRepository');

/**
 * Supabase implementation of the QuestProgress Repository.
 * Implements IQuestProgressRepository for QuestProgress entity persistence.
 */
export class SupabaseQuestProgressRepository implements IQuestProgressRepository {
  private readonly tableName = 'quest_progress';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseQuestProgressRepository instance.
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
   * Maps a database row to QuestProgressRecord format.
   */
  private mapRowToRecord(row: Record<string, unknown>): QuestProgressRecord {
    return {
      progressId: row.progress_id as string,
      playerProfileId: row.player_profile_id as string,
      questId: row.quest_id as string,
      status: row.status as QuestStatus,
      currentValue: row.current_value as number,
      completedAt: (row.completed_at as string | null),
      claimedAt: (row.claimed_at as string | null),
      metadata: (row.metadata as Record<string, string | number | boolean>) || {},
      startedAt: row.started_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  /**
   * Maps a database row to a QuestProgress entity.
   */
  private mapRowToEntity(row: Record<string, unknown>): QuestProgress {
    const record = this.mapRowToRecord(row);
    return QuestProgress.fromStorage(record);
  }

  /**
   * Converts a QuestProgress entity to database insert format.
   */
  private toInsertRecord(progress: QuestProgress): Record<string, unknown> {
    return {
      progress_id: progress.progressId,
      player_profile_id: progress.playerProfileId,
      quest_id: progress.questId,
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
   * Converts a QuestProgress entity to database update format.
   */
  private toUpdateRecord(progress: QuestProgress): Record<string, unknown> {
    return {
      status: progress.status,
      current_value: progress.currentValue,
      completed_at: progress.completedAt?.toISOString() ?? null,
      claimed_at: progress.claimedAt?.toISOString() ?? null,
      metadata: progress.metadata,
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
   * Creates a new quest progress record.
   * @param progress The progress to create
   * @returns The created progress
   */
  async create(progress: QuestProgress): Promise<QuestProgress> {
    logger.debug('Creating quest progress', {
      progressId: progress.progressId,
      playerProfileId: progress.playerProfileId,
      questId: progress.questId
    });

    try {
      const record = this.toInsertRecord(progress);
      const { data, error } = await this.client.from(this.tableName).insert(record).select().single();

      if (error) {
        if (error.code === '23505') {
          throw RepositoryError.alreadyExists('QuestProgress', 'progress_id', progress.progressId, this.tableName);
        }
        logger.error('Failed to create quest progress', error);
        throw RepositoryError.createFailed('QuestProgress', new Error(error.message));
      }

      logger.info('Quest progress created', {
        progressId: progress.progressId,
        playerProfileId: progress.playerProfileId,
        questId: progress.questId
      });

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to create quest progress', err as Error);
      throw RepositoryError.createFailed('QuestProgress', err as Error);
    }
  }

  /**
   * Finds a progress record by its ID.
   * @param id The progress ID to find
   * @returns The progress if found, null otherwise
   */
  async findById(id: QuestProgressId): Promise<QuestProgress | null> {
    logger.debug('Finding quest progress by ID', { progressId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('progress_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('QuestProgress', id.value, this.tableName);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find quest progress by ID', err as Error, { progressId: id.value });
      throw RepositoryError.entityNotFound('QuestProgress', id.value, this.tableName);
    }
  }

  /**
   * Finds progress records for a player.
   * @param playerProfileId The player profile ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of progress records
   */
  async findByPlayer(
    playerProfileId: string,
    params: PaginationParams,
    filters?: QuestProgressFilterParams
  ): Promise<PaginatedResult<QuestProgress>> {
    logger.debug('Finding quest progress by player', { playerProfileId, params, filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('player_profile_id', playerProfileId);

      // Apply filters
      if (filters?.questId) {
        query = query.eq('quest_id', filters.questId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.startedAfter) {
        query = query.gte('started_at', filters.startedAfter.toISOString());
      }

      if (filters?.startedBefore) {
        query = query.lte('started_at', filters.startedBefore.toISOString());
      }

      // Apply sorting
      const sortBy = params.sortBy || 'started_at';
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
      logger.error('Failed to find quest progress by player', err as Error, { playerProfileId });
      throw RepositoryError.queryFailed('findByPlayer', err as Error);
    }
  }

  /**
   * Finds a specific player's progress for a quest.
   * @param playerProfileId The player profile ID
   * @param questId The quest ID
   * @returns The progress if found, null otherwise
   */
  async findByPlayerAndQuest(
    playerProfileId: string,
    questId: string
  ): Promise<QuestProgress | null> {
    logger.debug('Finding quest progress by player and quest', { playerProfileId, questId });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('player_profile_id', playerProfileId)
        .eq('quest_id', questId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('QuestProgress', `${playerProfileId}:${questId}`, this.tableName);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find quest progress by player and quest', err as Error, { playerProfileId, questId });
      throw RepositoryError.entityNotFound('QuestProgress', `${playerProfileId}:${questId}`, this.tableName);
    }
  }

  /**
   * Finds all progress records for a quest.
   * @param questId The quest ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of progress records
   */
  async findByQuest(
    questId: string,
    params: PaginationParams,
    filters?: QuestProgressFilterParams
  ): Promise<PaginatedResult<QuestProgress>> {
    logger.debug('Finding quest progress by quest', { questId, params, filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('quest_id', questId);

      // Apply filters
      if (filters?.playerProfileId) {
        query = query.eq('player_profile_id', filters.playerProfileId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.startedAfter) {
        query = query.gte('started_at', filters.startedAfter.toISOString());
      }

      if (filters?.startedBefore) {
        query = query.lte('started_at', filters.startedBefore.toISOString());
      }

      // Apply sorting
      const sortBy = params.sortBy || 'started_at';
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
      logger.error('Failed to find quest progress by quest', err as Error, { questId });
      throw RepositoryError.queryFailed('findByQuest', err as Error);
    }
  }

  /**
   * Checks if progress exists for a player and quest.
   * @param playerProfileId The player profile ID
   * @param questId The quest ID
   * @returns true if progress exists
   */
  async exists(playerProfileId: string, questId: string): Promise<boolean> {
    logger.debug('Checking if quest progress exists', { playerProfileId, questId });

    try {
      const { error } = await this.client
        .from(this.tableName)
        .select('progress_id')
        .eq('player_profile_id', playerProfileId)
        .eq('quest_id', questId)
        .limit(1);

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      return true;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to check quest progress existence', err as Error, { playerProfileId, questId });
      return false;
    }
  }

  /**
   * Updates an existing progress record.
   * @param progress The progress to update
   * @returns The updated progress
   */
  async update(progress: QuestProgress): Promise<QuestProgress> {
    logger.debug('Updating quest progress', { progressId: progress.progressId });

    try {
      const record = this.toUpdateRecord(progress);
      const { data, error } = await this.client
        .from(this.tableName)
        .update(record)
        .eq('progress_id', progress.progressId)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update quest progress', error);
        throw RepositoryError.updateFailed('QuestProgress', progress.progressId, new Error(error.message));
      }

      logger.info('Quest progress updated', { progressId: progress.progressId });

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to update quest progress', err as Error, { progressId: progress.progressId });
      throw RepositoryError.updateFailed('QuestProgress', progress.progressId, err as Error);
    }
  }

  /**
   * Updates progress status only.
   * @param progressId The progress ID to update
   * @param status The new status
   * @returns The updated progress
   */
  async updateStatus(progressId: QuestProgressId, status: QuestStatus): Promise<QuestProgress> {
    logger.debug('Updating quest progress status', { progressId: progressId.value, status });

    try {
      const now = new Date().toISOString();
      const updateData: Record<string, unknown> = {
        status,
        updated_at: now,
      };

      // Set completed_at if status is completed
      if (status === QuestStatus.COMPLETED) {
        updateData.completed_at = now;
      }

      // Set claimed_at if status is claimed
      if (status === QuestStatus.CLAIMED) {
        updateData.claimed_at = now;
      }

      const { data, error } = await this.client
        .from(this.tableName)
        .update(updateData)
        .eq('progress_id', progressId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update quest progress status', error);
        throw RepositoryError.updateFailed('QuestProgress', progressId.value, new Error(error.message));
      }

      logger.info('Quest progress status updated', { progressId: progressId.value, status });

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to update quest progress status', err as Error, { progressId: progressId.value });
      throw RepositoryError.updateFailed('QuestProgress', progressId.value, err as Error);
    }
  }

  /**
   * Increments progress value.
   * @param progressId The progress ID to update
   * @param increment The amount to increment
   * @param target The target value (for completion detection)
   * @returns The updated progress
   */
  async incrementProgress(
    progressId: QuestProgressId,
    increment: number,
    target: number
  ): Promise<QuestProgress> {
    logger.debug('Incrementing quest progress', { progressId: progressId.value, increment, target });

    try {
      // First get current progress
      const current = await this.findById(progressId);
      if (!current) {
        throw RepositoryError.entityNotFound('QuestProgress', progressId.value, this.tableName);
      }

      // Calculate new value with clamping
      const newValue = Math.min(current.currentValue + increment, target);

      // Determine if completed
      const isComplete = newValue >= target;
      const now = new Date().toISOString();

      const updateData: Record<string, unknown> = {
        current_value: newValue,
        updated_at: now,
      };

      if (isComplete && current.status === QuestStatus.IN_PROGRESS) {
        updateData.status = QuestStatus.COMPLETED;
        updateData.completed_at = now;
      }

      const { data, error } = await this.client
        .from(this.tableName)
        .update(updateData)
        .eq('progress_id', progressId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to increment quest progress', error);
        throw RepositoryError.updateFailed('QuestProgress', progressId.value, new Error(error.message));
      }

      logger.info('Quest progress incremented', {
        progressId: progressId.value,
        oldValue: current.currentValue,
        newValue,
        isComplete
      });

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to increment quest progress', err as Error, { progressId: progressId.value });
      throw RepositoryError.updateFailed('QuestProgress', progressId.value, err as Error);
    }
  }

  /**
   * Resets progress for a quest (used for daily/weekly reset).
   * @param playerProfileId The player profile ID
   * @param questId The quest ID to reset
   * @returns The reset progress
   */
  async resetProgress(
    playerProfileId: string,
    questId: string
  ): Promise<QuestProgress> {
    logger.debug('Resetting quest progress', { playerProfileId, questId });

    try {
      const now = new Date().toISOString();

      // Find existing progress
      const existing = await this.findByPlayerAndQuest(playerProfileId, questId);
      if (!existing) {
        throw RepositoryError.entityNotFound('QuestProgress', `${playerProfileId}:${questId}`, this.tableName);
      }

      // Reset progress values
      const { data, error } = await this.client
        .from(this.tableName)
        .update({
          status: QuestStatus.IN_PROGRESS,
          current_value: 0,
          completed_at: null,
          claimed_at: null,
          started_at: now,
          updated_at: now,
        })
        .eq('progress_id', existing.progressId)
        .select()
        .single();

      if (error) {
        logger.error('Failed to reset quest progress', error);
        throw RepositoryError.updateFailed('QuestProgress', existing.progressId, new Error(error.message));
      }

      logger.info('Quest progress reset', { playerProfileId, questId, progressId: existing.progressId });

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to reset quest progress', err as Error, { playerProfileId, questId });
      throw RepositoryError.updateFailed('QuestProgress', `${playerProfileId}:${questId}`, err as Error);
    }
  }

  /**
   * Deletes a progress record.
   * @param id The progress ID to delete
   */
  async delete(id: QuestProgressId): Promise<void> {
    logger.debug('Deleting quest progress', { progressId: id.value });

    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('progress_id', id.value);

      if (error) {
        logger.error('Failed to delete quest progress', error);
        throw RepositoryError.deleteFailed('QuestProgress', id.value, new Error(error.message));
      }

      logger.info('Quest progress deleted', { progressId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to delete quest progress', err as Error, { progressId: id.value });
      throw RepositoryError.deleteFailed('QuestProgress', id.value, err as Error);
    }
  }

  /**
   * Lists all claimable progress for a player.
   * @param playerProfileId The player profile ID
   * @returns Array of claimable progress records
   */
  async findClaimableByPlayer(playerProfileId: string): Promise<QuestProgress[]> {
    logger.debug('Finding claimable quest progress by player', { playerProfileId });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('player_profile_id', playerProfileId)
        .eq('status', QuestStatus.COMPLETED)
        .order('completed_at', { ascending: true });

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      return (data as Record<string, unknown>[]).map((row) => this.mapRowToEntity(row));
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find claimable quest progress', err as Error, { playerProfileId });
      throw RepositoryError.queryFailed('findClaimableByPlayer', err as Error);
    }
  }

  /**
   * Counts total progress records with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching progress records
   */
  async count(filters?: QuestProgressFilterParams): Promise<number> {
    logger.debug('Counting quest progress', { filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters?.playerProfileId) {
        query = query.eq('player_profile_id', filters.playerProfileId);
      }

      if (filters?.questId) {
        query = query.eq('quest_id', filters.questId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.startedAfter) {
        query = query.gte('started_at', filters.startedAfter.toISOString());
      }

      if (filters?.startedBefore) {
        query = query.lte('started_at', filters.startedBefore.toISOString());
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
      logger.error('Failed to count quest progress', err as Error);
      throw RepositoryError.queryFailed('count', err as Error);
    }
  }
}