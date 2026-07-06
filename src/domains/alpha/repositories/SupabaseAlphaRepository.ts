/**
 * Supabase Alpha Repository
 *
 * Full implementation of the Alpha repository for persistence.
 * Uses Supabase for storage, returns domain entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type {
  IAlphaRepository,
  AlphaChecklistFilterParams,
  AlphaMilestoneFilterParams,
} from '../interfaces/IAlphaRepository';
import { AlphaChecklist, type AlphaChecklistRecord } from '../entities/AlphaChecklist';
import { AlphaMilestone, type AlphaMilestoneRecord } from '../entities/AlphaMilestone';
import { AlphaSnapshot, type AlphaSnapshotRecord } from '../entities/AlphaSnapshot';
import type { ChecklistId } from '../value-objects/ChecklistId';
import type { MilestoneId } from '../value-objects/MilestoneId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';

const logger = createLogger('SupabaseAlphaRepository');

/**
 * Supabase implementation of the Alpha Repository.
 * Implements IAlphaRepository for Alpha entity persistence.
 */
export class SupabaseAlphaRepository implements IAlphaRepository {
  private readonly checklistsTableName = 'alpha_checklists';
  private readonly milestonesTableName = 'alpha_milestones';
  private readonly snapshotsTableName = 'alpha_snapshots';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseAlphaRepository instance.
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
   * Helper to get client with proper typing for database operations.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get db(): any {
    return this.client;
  }

  // ============ Checklist Operations ============

  /**
   * Creates a new checklist item.
   * @param checklist The checklist to create
   * @returns The created checklist
   */
  async createChecklist(checklist: AlphaChecklist): Promise<AlphaChecklist> {
    logger.debug('Creating checklist', { checklistId: checklist.checklistId.value });
    try {
      const record = checklist.toRecord();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client as any)
        .from(this.checklistsTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create checklist', error);
        throw RepositoryError.createFailed('AlphaChecklist', error as Error);
      }

      if (!data) {
        throw RepositoryError.createFailed('AlphaChecklist', new Error('No data returned'));
      }

      const savedRecord = data as unknown as AlphaChecklistRecord;
      return AlphaChecklist.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating checklist', err as Error);
      throw RepositoryError.createFailed('AlphaChecklist', err as Error);
    }
  }

  /**
   * Finds a checklist by its ID.
   * @param id The checklist ID to find
   * @returns The checklist if found, null otherwise
   */
  async findChecklistById(id: ChecklistId): Promise<AlphaChecklist | null> {
    logger.debug('Finding checklist by ID', { checklistId: id.value });
    try {
      const { data, error } = await this.db
        .from(this.checklistsTableName)
        .select('*')
        .eq('checklistId', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find checklist', error);
        throw RepositoryError.queryFailed('findChecklistById', error as Error);
      }

      if (!data) {
        return null;
      }

      const record = data as unknown as AlphaChecklistRecord;
      return AlphaChecklist.fromStorage(record);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding checklist', err as Error);
      throw RepositoryError.queryFailed('findChecklistById', err as Error);
    }
  }

  /**
   * Updates an existing checklist.
   * @param checklist The checklist to update
   * @returns The updated checklist
   */
  async updateChecklist(checklist: AlphaChecklist): Promise<AlphaChecklist> {
    logger.debug('Updating checklist', { checklistId: checklist.checklistId.value });
    try {
      const record = checklist.toRecord();
      const { data, error } = await this.db
        .from(this.checklistsTableName)
        .update(record)
        .eq('checklistId', checklist.checklistId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update checklist', error);
        throw RepositoryError.updateFailed('AlphaChecklist', checklist.checklistId.value, error as Error);
      }

      if (!data) {
        throw RepositoryError.updateFailed('AlphaChecklist', checklist.checklistId.value, new Error('No data returned'));
      }

      const savedRecord = data as unknown as AlphaChecklistRecord;
      return AlphaChecklist.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating checklist', err as Error);
      throw RepositoryError.updateFailed('AlphaChecklist', checklist.checklistId.value, err as Error);
    }
  }

  /**
   * Deletes a checklist.
   * @param id The checklist ID to delete
   */
  async deleteChecklist(id: ChecklistId): Promise<void> {
    logger.debug('Deleting checklist', { checklistId: id.value });
    try {
      const { error } = await this.db
        .from(this.checklistsTableName)
        .delete()
        .eq('checklistId', id.value);

      if (error) {
        logger.error('Failed to delete checklist', error);
        throw RepositoryError.deleteFailed('AlphaChecklist', id.value, error as Error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting checklist', err as Error);
      throw RepositoryError.deleteFailed('AlphaChecklist', id.value, err as Error);
    }
  }

  /**
   * Lists checklists with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of checklists
   */
  async listChecklists(
    params: PaginationParams,
    filters?: AlphaChecklistFilterParams
  ): Promise<PaginatedResult<AlphaChecklist>> {
    logger.debug('Listing checklists', { params, filters });
    try {
      const { page = 1, pageSize = 20 } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = this.db
        .from(this.checklistsTableName)
        .select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.owner) {
        query = query.eq('owner', filters.owner);
      }
      if (filters?.category) {
        query = query.eq('metadata->>category', filters.category);
      }

      const { data, error, count } = await query
        .range(from, to)
        .order('createdAt', { ascending: false });

      if (error) {
        logger.error('Failed to list checklists', error);
        throw RepositoryError.queryFailed('listChecklists', error as Error);
      }

      const records = (data || []) as unknown as AlphaChecklistRecord[];
      const checklists = records.map((record) => AlphaChecklist.fromStorage(record));
      const total = count || 0;

      return {
        items: checklists,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page < Math.ceil(total / pageSize),
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing checklists', err as Error);
      throw RepositoryError.queryFailed('listChecklists', err as Error);
    }
  }

  /**
   * Counts total checklists with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching checklists
   */
  async countChecklists(filters?: AlphaChecklistFilterParams): Promise<number> {
    logger.debug('Counting checklists', { filters });
    try {
      let query = this.db
        .from(this.checklistsTableName)
        .select('*', { count: 'exact', head: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.owner) {
        query = query.eq('owner', filters.owner);
      }
      if (filters?.category) {
        query = query.eq('metadata->>category', filters.category);
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count checklists', error);
        throw RepositoryError.queryFailed('countChecklists', error as Error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting checklists', err as Error);
      throw RepositoryError.queryFailed('countChecklists', err as Error);
    }
  }

  // ============ Milestone Operations ============

  /**
   * Creates a new milestone.
   * @param milestone The milestone to create
   * @returns The created milestone
   */
  async createMilestone(milestone: AlphaMilestone): Promise<AlphaMilestone> {
    logger.debug('Creating milestone', { milestoneId: milestone.milestoneId.value });
    try {
      const record = milestone.toRecord();
      const { data, error } = await this.db
        .from(this.milestonesTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create milestone', error);
        throw RepositoryError.createFailed('AlphaMilestone', error as Error);
      }

      if (!data) {
        throw RepositoryError.createFailed('AlphaMilestone', new Error('No data returned'));
      }

      const savedRecord = data as unknown as AlphaMilestoneRecord;
      return AlphaMilestone.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating milestone', err as Error);
      throw RepositoryError.createFailed('AlphaMilestone', err as Error);
    }
  }

  /**
   * Finds a milestone by its ID.
   * @param id The milestone ID to find
   * @returns The milestone if found, null otherwise
   */
  async findMilestoneById(id: MilestoneId): Promise<AlphaMilestone | null> {
    logger.debug('Finding milestone by ID', { milestoneId: id.value });
    try {
      const { data, error } = await this.db
        .from(this.milestonesTableName)
        .select('*')
        .eq('milestoneId', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find milestone', error);
        throw RepositoryError.queryFailed('findMilestoneById', error as Error);
      }

      if (!data) {
        return null;
      }

      const record = data as unknown as AlphaMilestoneRecord;
      return AlphaMilestone.fromStorage(record);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding milestone', err as Error);
      throw RepositoryError.queryFailed('findMilestoneById', err as Error);
    }
  }

  /**
   * Updates an existing milestone.
   * @param milestone The milestone to update
   * @returns The updated milestone
   */
  async updateMilestone(milestone: AlphaMilestone): Promise<AlphaMilestone> {
    logger.debug('Updating milestone', { milestoneId: milestone.milestoneId.value });
    try {
      const record = milestone.toRecord();
      const { data, error } = await this.db
        .from(this.milestonesTableName)
        .update(record)
        .eq('milestoneId', milestone.milestoneId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update milestone', error);
        throw RepositoryError.updateFailed('AlphaMilestone', milestone.milestoneId.value, error as Error);
      }

      if (!data) {
        throw RepositoryError.updateFailed('AlphaMilestone', milestone.milestoneId.value, new Error('No data returned'));
      }

      const savedRecord = data as unknown as AlphaMilestoneRecord;
      return AlphaMilestone.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating milestone', err as Error);
      throw RepositoryError.updateFailed('AlphaMilestone', milestone.milestoneId.value, err as Error);
    }
  }

  /**
   * Deletes a milestone.
   * @param id The milestone ID to delete
   */
  async deleteMilestone(id: MilestoneId): Promise<void> {
    logger.debug('Deleting milestone', { milestoneId: id.value });
    try {
      const { error } = await this.db
        .from(this.milestonesTableName)
        .delete()
        .eq('milestoneId', id.value);

      if (error) {
        logger.error('Failed to delete milestone', error);
        throw RepositoryError.deleteFailed('AlphaMilestone', id.value, error as Error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting milestone', err as Error);
      throw RepositoryError.deleteFailed('AlphaMilestone', id.value, err as Error);
    }
  }

  /**
   * Lists milestones with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of milestones
   */
  async listMilestones(
    params: PaginationParams,
    filters?: AlphaMilestoneFilterParams
  ): Promise<PaginatedResult<AlphaMilestone>> {
    logger.debug('Listing milestones', { params, filters });
    try {
      const { page = 1, pageSize = 20 } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = this.db
        .from(this.milestonesTableName)
        .select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category) {
        query = query.eq('metadata->>category', filters.category);
      }

      const { data, error, count } = await query
        .range(from, to)
        .order('createdAt', { ascending: false });

      if (error) {
        logger.error('Failed to list milestones', error);
        throw RepositoryError.queryFailed('listMilestones', error as Error);
      }

      const records = (data || []) as unknown as AlphaMilestoneRecord[];
      const milestones = records.map((record) => AlphaMilestone.fromStorage(record));
      const total = count || 0;

      return {
        items: milestones,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page < Math.ceil(total / pageSize),
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing milestones', err as Error);
      throw RepositoryError.queryFailed('listMilestones', err as Error);
    }
  }

  /**
   * Counts total milestones with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching milestones
   */
  async countMilestones(filters?: AlphaMilestoneFilterParams): Promise<number> {
    logger.debug('Counting milestones', { filters });
    try {
      let query = this.db
        .from(this.milestonesTableName)
        .select('*', { count: 'exact', head: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category) {
        query = query.eq('metadata->>category', filters.category);
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count milestones', error);
        throw RepositoryError.queryFailed('countMilestones', error as Error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting milestones', err as Error);
      throw RepositoryError.queryFailed('countMilestones', err as Error);
    }
  }

  // ============ Snapshot Operations ============

  /**
   * Creates a new snapshot.
   * @param snapshot The snapshot to create
   * @returns The created snapshot
   */
  async createSnapshot(snapshot: AlphaSnapshot): Promise<AlphaSnapshot> {
    logger.debug('Creating snapshot', { snapshotId: snapshot.snapshotId.value });
    try {
      const record = snapshot.toRecord();
      const { data, error } = await this.db
        .from(this.snapshotsTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create snapshot', error);
        throw RepositoryError.createFailed('AlphaSnapshot', error as Error);
      }

      if (!data) {
        throw RepositoryError.createFailed('AlphaSnapshot', new Error('No data returned'));
      }

      const savedRecord = data as unknown as AlphaSnapshotRecord;
      return AlphaSnapshot.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating snapshot', err as Error);
      throw RepositoryError.createFailed('AlphaSnapshot', err as Error);
    }
  }

  /**
   * Finds a snapshot by its ID.
   * @param id The snapshot ID to find
   * @returns The snapshot if found, null otherwise
   */
  async findSnapshotById(id: SnapshotId): Promise<AlphaSnapshot | null> {
    logger.debug('Finding snapshot by ID', { snapshotId: id.value });
    try {
      const { data, error } = await this.db
        .from(this.snapshotsTableName)
        .select('*')
        .eq('snapshotId', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find snapshot', error);
        throw RepositoryError.queryFailed('findSnapshotById', error as Error);
      }

      if (!data) {
        return null;
      }

      const record = data as unknown as AlphaSnapshotRecord;
      return AlphaSnapshot.fromStorage(record);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding snapshot', err as Error);
      throw RepositoryError.queryFailed('findSnapshotById', err as Error);
    }
  }

  /**
   * Lists all snapshots with pagination.
   * @param params Pagination parameters
   * @returns Paginated result of snapshots
   */
  async listSnapshots(params: PaginationParams): Promise<PaginatedResult<AlphaSnapshot>> {
    logger.debug('Listing snapshots', { params });
    try {
      const { page = 1, pageSize = 20 } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await this.db
        .from(this.snapshotsTableName)
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('createdAt', { ascending: false });

      if (error) {
        logger.error('Failed to list snapshots', error);
        throw RepositoryError.queryFailed('listSnapshots', error as Error);
      }

      const records = (data || []) as unknown as AlphaSnapshotRecord[];
      const snapshots = records.map((record) => AlphaSnapshot.fromStorage(record));
      const total = count || 0;

      return {
        items: snapshots,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page < Math.ceil(total / pageSize),
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing snapshots', err as Error);
      throw RepositoryError.queryFailed('listSnapshots', err as Error);
    }
  }

  /**
   * Deletes a snapshot.
   * @param id The snapshot ID to delete
   */
  async deleteSnapshot(id: SnapshotId): Promise<void> {
    logger.debug('Deleting snapshot', { snapshotId: id.value });
    try {
      const { error } = await this.db
        .from(this.snapshotsTableName)
        .delete()
        .eq('snapshotId', id.value);

      if (error) {
        logger.error('Failed to delete snapshot', error);
        throw RepositoryError.deleteFailed('AlphaSnapshot', id.value, error as Error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting snapshot', err as Error);
      throw RepositoryError.deleteFailed('AlphaSnapshot', id.value, err as Error);
    }
  }

  /**
   * Counts total snapshots.
   * @returns Total count of snapshots
   */
  async countSnapshots(): Promise<number> {
    logger.debug('Counting snapshots');
    try {
      const { count, error } = await this.db
        .from(this.snapshotsTableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        logger.error('Failed to count snapshots', error);
        throw RepositoryError.queryFailed('countSnapshots', error as Error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting snapshots', err as Error);
      throw RepositoryError.queryFailed('countSnapshots', err as Error);
    }
  }
}
