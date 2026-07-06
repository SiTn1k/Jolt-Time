/**
 * Supabase Release Repository
 *
 * Full implementation of the Release repository for persistence.
 * Uses Supabase for storage, returns domain entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type {
  IReleaseRepository,
  ReleaseFilterParams,
  ChecklistFilterParams,
} from '../interfaces/IReleaseRepository';
import {
  ReleaseCandidate,
  type ReleaseCandidateRecord,
} from '../entities/ReleaseCandidate';
import {
  ReleaseChecklist,
  type ReleaseChecklistRecord,
} from '../entities/ReleaseChecklist';
import {
  ReleaseSnapshot,
  type ReleaseSnapshotRecord,
} from '../entities/ReleaseSnapshot';
import type { ReleaseId } from '../value-objects/ReleaseId';
import type { ChecklistId } from '../value-objects/ChecklistId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';

const logger = createLogger('SupabaseReleaseRepository');

/**
 * Supabase implementation of the Release Repository.
 * Implements IReleaseRepository for Release entity persistence.
 */
export class SupabaseReleaseRepository implements IReleaseRepository {
  private readonly releasesTableName = 'release_candidates';
  private readonly checklistsTableName = 'release_checklists';
  private readonly snapshotsTableName = 'release_snapshots';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseReleaseRepository instance.
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

  // ============ Release Candidate Operations ============

  /**
   * Creates a new release candidate.
   * @param release The release to create
   * @returns The created release
   */
  async createRelease(release: ReleaseCandidate): Promise<ReleaseCandidate> {
    logger.debug('Creating release', { releaseId: release.releaseId.value });
    try {
      const record = release.toRecord();
      const { data, error } = await this.db
        .from(this.releasesTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create release', error);
        throw RepositoryError.createFailed('ReleaseCandidate', error as Error);
      }

      if (!data) {
        throw RepositoryError.createFailed('ReleaseCandidate', new Error('No data returned'));
      }

      const savedRecord = data as unknown as ReleaseCandidateRecord;
      return ReleaseCandidate.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating release', err as Error);
      throw RepositoryError.createFailed('ReleaseCandidate', err as Error);
    }
  }

  /**
   * Finds a release by its ID.
   * @param id The release ID to find
   * @returns The release if found, null otherwise
   */
  async findReleaseById(id: ReleaseId): Promise<ReleaseCandidate | null> {
    logger.debug('Finding release by ID', { releaseId: id.value });
    try {
      const { data, error } = await this.db
        .from(this.releasesTableName)
        .select('*')
        .eq('releaseId', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find release', error);
        throw RepositoryError.queryFailed('findReleaseById', error as Error);
      }

      if (!data) {
        return null;
      }

      const record = data as unknown as ReleaseCandidateRecord;
      return ReleaseCandidate.fromStorage(record);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding release', err as Error);
      throw RepositoryError.queryFailed('findReleaseById', err as Error);
    }
  }

  /**
   * Updates an existing release.
   * @param release The release to update
   * @returns The updated release
   */
  async updateRelease(release: ReleaseCandidate): Promise<ReleaseCandidate> {
    logger.debug('Updating release', { releaseId: release.releaseId.value });
    try {
      const record = release.toRecord();
      const { data, error } = await this.db
        .from(this.releasesTableName)
        .update(record)
        .eq('releaseId', release.releaseId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update release', error);
        throw RepositoryError.updateFailed('ReleaseCandidate', release.releaseId.value, error as Error);
      }

      if (!data) {
        throw RepositoryError.updateFailed('ReleaseCandidate', release.releaseId.value, new Error('No data returned'));
      }

      const savedRecord = data as unknown as ReleaseCandidateRecord;
      return ReleaseCandidate.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating release', err as Error);
      throw RepositoryError.updateFailed('ReleaseCandidate', release.releaseId.value, err as Error);
    }
  }

  /**
   * Deletes a release.
   * @param id The release ID to delete
   */
  async deleteRelease(id: ReleaseId): Promise<void> {
    logger.debug('Deleting release', { releaseId: id.value });
    try {
      const { error } = await this.db
        .from(this.releasesTableName)
        .delete()
        .eq('releaseId', id.value);

      if (error) {
        logger.error('Failed to delete release', error);
        throw RepositoryError.deleteFailed('ReleaseCandidate', id.value, error as Error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting release', err as Error);
      throw RepositoryError.deleteFailed('ReleaseCandidate', id.value, err as Error);
    }
  }

  /**
   * Lists releases with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of releases
   */
  async listReleases(
    params: PaginationParams,
    filters?: ReleaseFilterParams
  ): Promise<PaginatedResult<ReleaseCandidate>> {
    logger.debug('Listing releases', { params, filters });
    try {
      const { page = 1, pageSize = 20 } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = this.db
        .from(this.releasesTableName)
        .select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error, count } = await query
        .range(from, to)
        .order('createdAt', { ascending: false });

      if (error) {
        logger.error('Failed to list releases', error);
        throw RepositoryError.queryFailed('listReleases', error as Error);
      }

      const records = (data || []) as unknown as ReleaseCandidateRecord[];
      const releases = records.map((record) => ReleaseCandidate.fromStorage(record));
      const total = count || 0;

      return {
        items: releases,
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
      logger.error('Unexpected error listing releases', err as Error);
      throw RepositoryError.queryFailed('listReleases', err as Error);
    }
  }

  /**
   * Counts total releases with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching releases
   */
  async countReleases(filters?: ReleaseFilterParams): Promise<number> {
    logger.debug('Counting releases', { filters });
    try {
      let query = this.db
        .from(this.releasesTableName)
        .select('*', { count: 'exact', head: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count releases', error);
        throw RepositoryError.queryFailed('countReleases', error as Error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting releases', err as Error);
      throw RepositoryError.queryFailed('countReleases', err as Error);
    }
  }

  // ============ Checklist Operations ============

  /**
   * Creates a new checklist item.
   * @param checklist The checklist to create
   * @returns The created checklist
   */
  async createChecklist(checklist: ReleaseChecklist): Promise<ReleaseChecklist> {
    logger.debug('Creating checklist', { checklistId: checklist.checklistId.value });
    try {
      const record = checklist.toRecord();
      const { data, error } = await this.db
        .from(this.checklistsTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create checklist', error);
        throw RepositoryError.createFailed('ReleaseChecklist', error as Error);
      }

      if (!data) {
        throw RepositoryError.createFailed('ReleaseChecklist', new Error('No data returned'));
      }

      const savedRecord = data as unknown as ReleaseChecklistRecord;
      return ReleaseChecklist.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating checklist', err as Error);
      throw RepositoryError.createFailed('ReleaseChecklist', err as Error);
    }
  }

  /**
   * Finds a checklist by its ID.
   * @param id The checklist ID to find
   * @returns The checklist if found, null otherwise
   */
  async findChecklistById(id: ChecklistId): Promise<ReleaseChecklist | null> {
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

      const record = data as unknown as ReleaseChecklistRecord;
      return ReleaseChecklist.fromStorage(record);
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
  async updateChecklist(checklist: ReleaseChecklist): Promise<ReleaseChecklist> {
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
        throw RepositoryError.updateFailed('ReleaseChecklist', checklist.checklistId.value, error as Error);
      }

      if (!data) {
        throw RepositoryError.updateFailed('ReleaseChecklist', checklist.checklistId.value, new Error('No data returned'));
      }

      const savedRecord = data as unknown as ReleaseChecklistRecord;
      return ReleaseChecklist.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating checklist', err as Error);
      throw RepositoryError.updateFailed('ReleaseChecklist', checklist.checklistId.value, err as Error);
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
        throw RepositoryError.deleteFailed('ReleaseChecklist', id.value, error as Error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting checklist', err as Error);
      throw RepositoryError.deleteFailed('ReleaseChecklist', id.value, err as Error);
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
    filters?: ChecklistFilterParams
  ): Promise<PaginatedResult<ReleaseChecklist>> {
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

      const records = (data || []) as unknown as ReleaseChecklistRecord[];
      const checklists = records.map((record) => ReleaseChecklist.fromStorage(record));
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
  async countChecklists(filters?: ChecklistFilterParams): Promise<number> {
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

  // ============ Snapshot Operations ============

  /**
   * Creates a new snapshot.
   * @param snapshot The snapshot to create
   * @returns The created snapshot
   */
  async createSnapshot(snapshot: ReleaseSnapshot): Promise<ReleaseSnapshot> {
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
        throw RepositoryError.createFailed('ReleaseSnapshot', error as Error);
      }

      if (!data) {
        throw RepositoryError.createFailed('ReleaseSnapshot', new Error('No data returned'));
      }

      const savedRecord = data as unknown as ReleaseSnapshotRecord;
      return ReleaseSnapshot.fromStorage(savedRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating snapshot', err as Error);
      throw RepositoryError.createFailed('ReleaseSnapshot', err as Error);
    }
  }

  /**
   * Finds a snapshot by its ID.
   * @param id The snapshot ID to find
   * @returns The snapshot if found, null otherwise
   */
  async findSnapshotById(id: SnapshotId): Promise<ReleaseSnapshot | null> {
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

      const record = data as unknown as ReleaseSnapshotRecord;
      return ReleaseSnapshot.fromStorage(record);
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
  async listSnapshots(params: PaginationParams): Promise<PaginatedResult<ReleaseSnapshot>> {
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

      const records = (data || []) as unknown as ReleaseSnapshotRecord[];
      const snapshots = records.map((record) => ReleaseSnapshot.fromStorage(record));
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
        throw RepositoryError.deleteFailed('ReleaseSnapshot', id.value, error as Error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting snapshot', err as Error);
      throw RepositoryError.deleteFailed('ReleaseSnapshot', id.value, err as Error);
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
