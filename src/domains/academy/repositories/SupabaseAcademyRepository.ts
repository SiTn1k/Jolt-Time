/**
 * Supabase Academy Repository
 *
 * Production Supabase implementation of the Academy repository.
 * Handles all persistence operations for Academy and ResearchProgress entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { IAcademyRepository, AcademyFilterParams, ResearchProgressFilterParams } from '../interfaces/IAcademyRepository';
import { Academy, AcademyRecord } from '../entities/Academy';
import { ResearchProgress, ResearchProgressRecord } from '../entities/ResearchProgress';
import { AcademyId } from '../value-objects/AcademyId';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { RepositoryError } from '../../../database/errors/repository.error';
import { createLogger } from '../../../core/logging/logger.service';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

const logger = createLogger('AcademyRepository');

/**
 * Supabase implementation of the Academy Repository.
 * Implements IAcademyRepository for Academy entity persistence.
 */
export class SupabaseAcademyRepository implements IAcademyRepository {
  private readonly tableName = 'academies';
  private readonly progressTableName = 'research_progress';
  private readonly _client: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseAcademyRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client ?? getSupabaseClient();
  }

  /**
   * Maps a database row to an Academy entity.
   */
  private mapRowToAcademy(row: Record<string, unknown>): Academy {
    const record: AcademyRecord = {
      academyId: row.id as string,
      playerProfileId: row.player_profile_id as string,
      academyLevel: row.academy_level as number,
      researchPoints: row.research_points as number,
      metadata: row.metadata as Record<string, unknown>,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
    return Academy.fromStorage(record);
  }

  /**
   * Maps a database row to a ResearchProgress entity.
   */
  private mapRowToProgress(row: Record<string, unknown>): ResearchProgress {
    const record: ResearchProgressRecord = {
      progressId: row.id as string,
      academyId: row.academy_id as string,
      nodeId: row.node_id as string,
      status: row.status as string,
      progress: row.progress as number,
      completedAt: row.completed_at as string | null,
      metadata: row.metadata as Record<string, unknown>,
    };
    return ResearchProgress.fromStorage(record);
  }

  // Academy operations

  /**
   * Creates a new academy.
   */
  async create(academy: Academy): Promise<Academy> {
    try {
      logger.debug('Creating academy', { academyId: academy.academyId.value });

      const record = {
        id: academy.academyId.value,
        player_profile_id: academy.playerProfileId.value,
        academy_level: academy.academyLevel,
        research_points: academy.researchPoints.amount,
        metadata: academy.metadata,
        created_at: academy.createdAt.toISOString(),
        updated_at: academy.updatedAt.toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this._client.from(this.tableName) as any)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create academy', error);
        throw RepositoryError.createFailed('Academy', error);
      }

      logger.info('Academy created successfully', { academyId: academy.academyId.value });
      return this.mapRowToAcademy(data as Record<string, unknown>);
    } catch (err) {
      logger.error('Error creating academy', err as Error);
      throw err;
    }
  }

  /**
   * Finds an academy by its ID.
   */
  async findById(id: AcademyId): Promise<Academy | null> {
    try {
      logger.debug('Finding academy by ID', { academyId: id.value });

      const { data, error } = await this._client
        .from(this.tableName)
        .select('*')
        .eq('id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.debug('Academy not found', { academyId: id.value });
          return null;
        }
        logger.error('Error finding academy', error);
        throw RepositoryError.entityNotFound('Academy', id.value, this.tableName);
      }

      return this.mapRowToAcademy(data as Record<string, unknown>);
    } catch (err) {
      logger.error('Error finding academy by ID', err as Error);
      throw err;
    }
  }

  /**
   * Finds an academy by player profile ID.
   */
  async findByPlayerProfileId(playerProfileId: string): Promise<Academy | null> {
    try {
      logger.debug('Finding academy by player profile ID', { playerProfileId });

      const { data, error } = await this._client
        .from(this.tableName)
        .select('*')
        .eq('player_profile_id', playerProfileId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.debug('Academy not found for player profile', { playerProfileId });
          return null;
        }
        logger.error('Error finding academy by player profile', error);
        throw RepositoryError.entityNotFound('Academy', playerProfileId, this.tableName);
      }

      return this.mapRowToAcademy(data as Record<string, unknown>);
    } catch (err) {
      logger.error('Error finding academy by player profile ID', err as Error);
      throw err;
    }
  }

  /**
   * Checks if an academy exists by ID.
   */
  async exists(id: AcademyId): Promise<boolean> {
    try {
      const { data, error } = await this._client
        .from(this.tableName)
        .select('id')
        .eq('id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false;
        }
        throw RepositoryError.queryFailed('exists', error);
      }

      return data !== null;
    } catch (err) {
      logger.error('Error checking academy existence', err as Error);
      throw err;
    }
  }

  /**
   * Updates an existing academy.
   */
  async update(academy: Academy): Promise<Academy> {
    try {
      logger.debug('Updating academy', { academyId: academy.academyId.value });

      const record = {
        academy_level: academy.academyLevel,
        research_points: academy.researchPoints.amount,
        metadata: academy.metadata,
        updated_at: new Date().toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this._client.from(this.tableName) as any)
        .update(record)
        .eq('id', academy.academyId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update academy', error);
        throw RepositoryError.updateFailed('Academy', academy.academyId.value, error);
      }

      logger.info('Academy updated successfully', { academyId: academy.academyId.value });
      return this.mapRowToAcademy(data as Record<string, unknown>);
    } catch (err) {
      logger.error('Error updating academy', err as Error);
      throw err;
    }
  }

  /**
   * Deletes an academy.
   */
  async delete(id: AcademyId): Promise<void> {
    try {
      logger.debug('Deleting academy', { academyId: id.value });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (this._client.from(this.tableName) as any)
        .delete()
        .eq('id', id.value);

      if (error) {
        logger.error('Failed to delete academy', error);
        throw RepositoryError.deleteFailed('Academy', id.value, error);
      }

      logger.info('Academy deleted successfully', { academyId: id.value });
    } catch (err) {
      logger.error('Error deleting academy', err as Error);
      throw err;
    }
  }

  /**
   * Lists academies with pagination and filtering.
   */
  async list(
    params: PaginationParams,
    filters?: AcademyFilterParams
  ): Promise<PaginatedResult<Academy>> {
    try {
      logger.debug('Listing academies', { params, filters });

      const { page, pageSize, sortBy = 'created_at', sortOrder = 'desc' } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.playerProfileId) {
        query = query.eq('player_profile_id', filters.playerProfileId);
      }
      if (filters?.minLevel !== undefined) {
        query = query.gte('academy_level', filters.minLevel);
      }
      if (filters?.maxLevel !== undefined) {
        query = query.lte('academy_level', filters.maxLevel);
      }
      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      // Apply sorting
      const ascending = sortOrder === 'asc';
      query = query.order(sortBy as string, { ascending });

      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list academies', error);
        throw RepositoryError.queryFailed('list', error);
      }

      const items = (data as Record<string, unknown>[]).map((row) =>
        this.mapRowToAcademy(row)
      );

      const total = count ?? 0;
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
      logger.error('Error listing academies', err as Error);
      throw err;
    }
  }

  /**
   * Counts total academies with optional filtering.
   */
  async count(filters?: AcademyFilterParams): Promise<number> {
    try {
      logger.debug('Counting academies', { filters });

      let query = this._client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters?.playerProfileId) {
        query = query.eq('player_profile_id', filters.playerProfileId);
      }
      if (filters?.minLevel !== undefined) {
        query = query.gte('academy_level', filters.minLevel);
      }
      if (filters?.maxLevel !== undefined) {
        query = query.lte('academy_level', filters.maxLevel);
      }
      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const { error, count } = await query;

      if (error) {
        logger.error('Failed to count academies', error);
        throw RepositoryError.queryFailed('count', error);
      }

      return count ?? 0;
    } catch (err) {
      logger.error('Error counting academies', err as Error);
      throw err;
    }
  }

  // ResearchProgress operations

  /**
   * Creates a new research progress entry.
   */
  async createProgress(progress: ResearchProgress): Promise<ResearchProgress> {
    try {
      logger.debug('Creating research progress', {
        progressId: progress.progressId,
        academyId: progress.academyId.value,
        nodeId: progress.nodeId.value,
      });

      const record = {
        id: progress.progressId,
        academy_id: progress.academyId.value,
        node_id: progress.nodeId.value,
        status: progress.status,
        progress: progress.progress.value,
        completed_at: progress.completedAt?.toISOString() ?? null,
        metadata: progress.metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this._client.from(this.progressTableName) as any)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create research progress', error);
        throw RepositoryError.createFailed('ResearchProgress', error);
      }

      logger.info('Research progress created successfully', {
        progressId: progress.progressId,
      });
      return this.mapRowToProgress(data as Record<string, unknown>);
    } catch (err) {
      logger.error('Error creating research progress', err as Error);
      throw err;
    }
  }

  /**
   * Finds research progress by ID.
   */
  async findProgressById(progressId: string): Promise<ResearchProgress | null> {
    try {
      logger.debug('Finding research progress by ID', { progressId });

      const { data, error } = await this._client
        .from(this.progressTableName)
        .select('*')
        .eq('id', progressId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.debug('Research progress not found', { progressId });
          return null;
        }
        logger.error('Error finding research progress', error);
        throw RepositoryError.entityNotFound('ResearchProgress', progressId, this.progressTableName);
      }

      return this.mapRowToProgress(data as Record<string, unknown>);
    } catch (err) {
      logger.error('Error finding research progress by ID', err as Error);
      throw err;
    }
  }

  /**
   * Finds all research progress for an academy.
   */
  async findProgressByAcademyId(academyId: AcademyId): Promise<ResearchProgress[]> {
    try {
      logger.debug('Finding research progress by academy ID', { academyId: academyId.value });

      const { data, error } = await this._client
        .from(this.progressTableName)
        .select('*')
        .eq('academy_id', academyId.value);

      if (error) {
        logger.error('Failed to find research progress by academy ID', error);
        throw RepositoryError.queryFailed('findProgressByAcademyId', error);
      }

      return (data as Record<string, unknown>[]).map((row) =>
        this.mapRowToProgress(row)
      );
    } catch (err) {
      logger.error('Error finding research progress by academy ID', err as Error);
      throw err;
    }
  }

  /**
   * Finds research progress for a specific node in an academy.
   */
  async findProgressByNodeAndAcademy(
    academyId: AcademyId,
    nodeId: string
  ): Promise<ResearchProgress | null> {
    try {
      logger.debug('Finding research progress by node and academy', {
        academyId: academyId.value,
        nodeId,
      });

      const { data, error } = await this._client
        .from(this.progressTableName)
        .select('*')
        .eq('academy_id', academyId.value)
        .eq('node_id', nodeId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.debug('Research progress not found for node and academy', {
            academyId: academyId.value,
            nodeId,
          });
          return null;
        }
        logger.error('Error finding research progress by node and academy', error);
        throw RepositoryError.queryFailed('findProgressByNodeAndAcademy', error);
      }

      return this.mapRowToProgress(data as Record<string, unknown>);
    } catch (err) {
      logger.error('Error finding research progress by node and academy', err as Error);
      throw err;
    }
  }

  /**
   * Updates research progress.
   */
  async updateProgress(progress: ResearchProgress): Promise<ResearchProgress> {
    try {
      logger.debug('Updating research progress', { progressId: progress.progressId });

      const record = {
        status: progress.status,
        progress: progress.progress.value,
        completed_at: progress.completedAt?.toISOString() ?? null,
        metadata: progress.metadata,
        updated_at: new Date().toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this._client.from(this.progressTableName) as any)
        .update(record)
        .eq('id', progress.progressId)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update research progress', error);
        throw RepositoryError.updateFailed('ResearchProgress', progress.progressId, error);
      }

      logger.info('Research progress updated successfully', {
        progressId: progress.progressId,
      });
      return this.mapRowToProgress(data as Record<string, unknown>);
    } catch (err) {
      logger.error('Error updating research progress', err as Error);
      throw err;
    }
  }

  /**
   * Deletes research progress.
   */
  async deleteProgress(progressId: string): Promise<void> {
    try {
      logger.debug('Deleting research progress', { progressId });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (this._client.from(this.progressTableName) as any)
        .delete()
        .eq('id', progressId);

      if (error) {
        logger.error('Failed to delete research progress', error);
        throw RepositoryError.deleteFailed('ResearchProgress', progressId, error);
      }

      logger.info('Research progress deleted successfully', { progressId });
    } catch (err) {
      logger.error('Error deleting research progress', err as Error);
      throw err;
    }
  }

  /**
   * Deletes all research progress for an academy.
   */
  async deleteAllProgressForAcademy(academyId: AcademyId): Promise<void> {
    try {
      logger.debug('Deleting all research progress for academy', {
        academyId: academyId.value,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (this._client.from(this.progressTableName) as any)
        .delete()
        .eq('academy_id', academyId.value);

      if (error) {
        logger.error('Failed to delete research progress for academy', error);
        throw RepositoryError.deleteFailed('ResearchProgress', academyId.value, error);
      }

      logger.info('All research progress deleted for academy', {
        academyId: academyId.value,
      });
    } catch (err) {
      logger.error('Error deleting all research progress for academy', err as Error);
      throw err;
    }
  }

  /**
   * Lists research progress with pagination and filtering.
   */
  async listProgress(
    params: PaginationParams,
    filters?: ResearchProgressFilterParams
  ): Promise<PaginatedResult<ResearchProgress>> {
    try {
      logger.debug('Listing research progress', { params, filters });

      const { page, pageSize, sortBy = 'created_at', sortOrder = 'desc' } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this.progressTableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.academyId) {
        query = query.eq('academy_id', filters.academyId);
      }
      if (filters?.nodeId) {
        query = query.eq('node_id', filters.nodeId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.completedAfter) {
        query = query.gte('completed_at', filters.completedAfter.toISOString());
      }
      if (filters?.completedBefore) {
        query = query.lte('completed_at', filters.completedBefore.toISOString());
      }

      // Apply sorting
      const ascending = sortOrder === 'asc';
      query = query.order(sortBy as string, { ascending });

      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list research progress', error);
        throw RepositoryError.queryFailed('listProgress', error);
      }

      const items = (data as Record<string, unknown>[]).map((row) =>
        this.mapRowToProgress(row)
      );

      const total = count ?? 0;
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
      logger.error('Error listing research progress', err as Error);
      throw err;
    }
  }
}