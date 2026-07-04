/**
 * Supabase Audit Repository
 *
 * Production Supabase implementation of the Audit repository.
 * Handles all persistence operations for audit entities.
 *
 * IMPORTANT: Audit is an IMMUTABLE history layer. It ONLY stores records.
 * Audit MUST NEVER modify gameplay, balances, rewards, inventory, or player state.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { IAuditRepository, AuditRecordFilterParams, AuditCategoryFilterParams, AuditActorFilterParams } from '../interfaces/IAuditRepository';
import type { AuditRecordRecord } from '../entities/AuditRecord';
import type { AuditCategoryRecord } from '../entities/AuditCategory';
import type { AuditActorRecord } from '../entities/AuditActor';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { AuditRecord } from '../entities/AuditRecord';
import { AuditCategory } from '../entities/AuditCategory';
import { AuditActor } from '../entities/AuditActor';
import { AuditId } from '../value-objects/AuditId';
import { AuditActorId } from '../value-objects/AuditActorId';
import { AuditCategoryId } from '../value-objects/AuditCategoryId';
import { getSupabaseClient } from '../../../database/providers';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../shared/errors/repository.error';
import { SortOrder } from '../../../shared/constants';

/**
 * Supabase implementation of the Audit Repository.
 * Implements IAuditRepository for audit entity persistence.
 *
 * IMPORTANT: Audit is an IMMUTABLE history layer. It ONLY stores records.
 * Audit MUST NEVER modify gameplay, balances, rewards, inventory, or player state.
 */
export class SupabaseAuditRepository implements IAuditRepository {
  private readonly _client: SupabaseClient<Database>;
  private readonly _logger = createLogger('SupabaseAuditRepository');
  private readonly _tableNames = {
    records: 'audit_records',
    categories: 'audit_categories',
    actors: 'audit_actors',
  } as const;

  /**
   * Creates a new SupabaseAuditRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client ?? getSupabaseClient();
  }

  // ============ Audit Record Operations ============

  /**
   * Stores a new audit record.
   */
  async storeRecord(record: AuditRecord): Promise<AuditRecord> {
    try {
      const recordData: AuditRecordRecord = {
        audit_id: record.auditId.value,
        actor_id: record.actorId.value,
        actor_type: record.actorType,
        action: record.action,
        target_type: record.targetType,
        target_id: record.targetId,
        category_id: record.categoryId?.value ?? null,
        result: record.result,
        created_at: record.createdAt.toISOString(),
        metadata: record.metadata ?? null,
      };

      const { data, error } = await this._client
        .from(this._tableNames.records)
        .insert(recordData)
        .select()
        .single();

      if (error) {
        this._logger.error('Failed to store audit record', error as Error, { auditId: record.auditId.value });
        throw RepositoryError.queryFailed(`Failed to store audit record: ${error.message}`, error as Error);
      }

      return AuditRecord.fromDatabase(data as AuditRecordRecord);
    } catch (err) {
      this._logger.error('Failed to store audit record', err as Error, { auditId: record.auditId.value });
      throw err instanceof RepositoryError ? err : RepositoryError.queryFailed(String(err));
    }
  }

  /**
   * Finds an audit record by its ID.
   */
  async findRecordById(id: AuditId): Promise<AuditRecord | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.records)
        .select('*')
        .eq('audit_id', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        this._logger.error('Failed to find audit record', error as Error, { auditId: id.value });
        throw RepositoryError.queryFailed(`Failed to find audit record: ${error.message}`, error as Error);
      }

      return AuditRecord.fromDatabase(data as AuditRecordRecord);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this._logger.error('Failed to find audit record', err as Error, { auditId: id.value });
      throw RepositoryError.queryFailed(String(err));
    }
  }

  /**
   * Lists audit records with pagination and filtering.
   */
  async listRecords(
    params: PaginationParams,
    filters?: AuditRecordFilterParams
  ): Promise<PaginatedResult<AuditRecord>> {
    try {
      const { page, pageSize, sortBy = 'created_at', sortOrder = SortOrder.DESC } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this._tableNames.records)
        .select('*', { count: 'exact' });

      // Apply filters
      query = this._applyRecordFilters(query, filters);

      // Apply sorting
      const orderDirection = sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortBy as string, { ascending: sortOrder === SortOrder.ASC });

      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        this._logger.error('Failed to list audit records', error as Error, { filters });
        throw RepositoryError.queryFailed(`Failed to list audit records: ${error.message}`, error as Error);
      }

      const records = (data ?? []).map((row) => AuditRecord.fromDatabase(row as AuditRecordRecord));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: records,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      this._logger.error('Failed to list audit records', err as Error, { params, filters });
      throw err instanceof RepositoryError ? err : RepositoryError.queryFailed(String(err));
    }
  }

  /**
   * Counts audit records with optional filtering.
   */
  async countRecords(filters?: AuditRecordFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this._tableNames.records)
        .select('*', { count: 'exact', head: true });

      query = this._applyRecordFilters(query, filters);

      const { count, error } = await query;

      if (error) {
        this._logger.error('Failed to count audit records', error as Error, { filters });
        throw RepositoryError.queryFailed(`Failed to count audit records: ${error.message}`, error as Error);
      }

      return count ?? 0;
    } catch (err) {
      this._logger.error('Failed to count audit records', err as Error, { filters });
      throw err instanceof RepositoryError ? err : RepositoryError.queryFailed(String(err));
    }
  }

  /**
   * Applies filters to audit record query.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _applyRecordFilters(query: any, filters?: AuditRecordFilterParams): any {
    if (!filters) return query;

    if (filters.actorId) {
      query = query.eq('actor_id', filters.actorId);
    }
    if (filters.actorType) {
      query = query.eq('actor_type', filters.actorType);
    }
    if (filters.action) {
      query = query.eq('action', filters.action);
    }
    if (filters.targetType) {
      query = query.eq('target_type', filters.targetType);
    }
    if (filters.targetId) {
      query = query.eq('target_id', filters.targetId);
    }
    if (filters.result) {
      query = query.eq('result', filters.result);
    }
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters.createdAfter) {
      query = query.gte('created_at', filters.createdAfter.toISOString());
    }
    if (filters.createdBefore) {
      query = query.lte('created_at', filters.createdBefore.toISOString());
    }

    return query;
  }

  // ============ Audit Category Operations ============

  /**
   * Creates a new audit category.
   */
  async createCategory(category: AuditCategory): Promise<AuditCategory> {
    try {
      const categoryData: AuditCategoryRecord = {
        category_id: category.categoryId.value,
        name: category.name,
        description: category.description,
        metadata: category.metadata ?? null,
      };

      const { data, error } = await this._client
        .from(this._tableNames.categories)
        .insert(categoryData)
        .select()
        .single();

      if (error) {
        this._logger.error('Failed to create audit category', error as Error, { categoryId: category.categoryId.value });
        throw RepositoryError.queryFailed(`Failed to create audit category: ${error.message}`, error as Error);
      }

      return AuditCategory.fromDatabase(data as AuditCategoryRecord);
    } catch (err) {
      this._logger.error('Failed to create audit category', err as Error, { categoryId: category.categoryId.value });
      throw err instanceof RepositoryError ? err : RepositoryError.queryFailed(String(err));
    }
  }

  /**
   * Finds a category by its ID.
   */
  async findCategoryById(id: AuditCategoryId): Promise<AuditCategory | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.categories)
        .select('*')
        .eq('category_id', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        this._logger.error('Failed to find audit category', error as Error, { categoryId: id.value });
        throw RepositoryError.queryFailed(`Failed to find audit category: ${error.message}`, error as Error);
      }

      return AuditCategory.fromDatabase(data as AuditCategoryRecord);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this._logger.error('Failed to find audit category', err as Error, { categoryId: id.value });
      throw RepositoryError.queryFailed(String(err));
    }
  }

  /**
   * Lists all categories.
   */
  async listCategories(
    params: PaginationParams,
    filters?: AuditCategoryFilterParams
  ): Promise<PaginatedResult<AuditCategory>> {
    try {
      const { page, pageSize, sortBy = 'name', sortOrder = SortOrder.ASC } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this._tableNames.categories)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }

      // Apply sorting
      query = query.order(sortBy as string, { ascending: sortOrder === SortOrder.ASC });

      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        this._logger.error('Failed to list audit categories', error as Error, { filters });
        throw RepositoryError.queryFailed(`Failed to list audit categories: ${error.message}`, error as Error);
      }

      const categories = (data ?? []).map((row) => AuditCategory.fromDatabase(row as AuditCategoryRecord));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: categories,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      this._logger.error('Failed to list audit categories', err as Error, { params, filters });
      throw err instanceof RepositoryError ? err : RepositoryError.queryFailed(String(err));
    }
  }

  /**
   * Counts categories with optional filtering.
   */
  async countCategories(filters?: AuditCategoryFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this._tableNames.categories)
        .select('*', { count: 'exact', head: true });

      if (filters?.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }

      const { count, error } = await query;

      if (error) {
        this._logger.error('Failed to count audit categories', error as Error, { filters });
        throw RepositoryError.queryFailed(`Failed to count audit categories: ${error.message}`, error as Error);
      }

      return count ?? 0;
    } catch (err) {
      this._logger.error('Failed to count audit categories', err as Error, { filters });
      throw err instanceof RepositoryError ? err : RepositoryError.queryFailed(String(err));
    }
  }

  // ============ Audit Actor Operations ============

  /**
   * Creates or updates an audit actor.
   */
  async upsertActor(actor: AuditActor): Promise<AuditActor> {
    try {
      const actorData: AuditActorRecord = {
        actor_id: actor.actorId.value,
        actor_type: actor.actorType,
        display_name: actor.displayName,
        metadata: actor.metadata ?? null,
      };

      const { data, error } = await this._client
        .from(this._tableNames.actors)
        .upsert(actorData)
        .select()
        .single();

      if (error) {
        this._logger.error('Failed to upsert audit actor', error as Error, { actorId: actor.actorId.value });
        throw RepositoryError.queryFailed(`Failed to upsert audit actor: ${error.message}`, error as Error);
      }

      return AuditActor.fromDatabase(data as AuditActorRecord);
    } catch (err) {
      this._logger.error('Failed to upsert audit actor', err as Error, { actorId: actor.actorId.value });
      throw err instanceof RepositoryError ? err : RepositoryError.queryFailed(String(err));
    }
  }

  /**
   * Finds an actor by its ID.
   */
  async findActorById(id: AuditActorId): Promise<AuditActor | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.actors)
        .select('*')
        .eq('actor_id', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        this._logger.error('Failed to find audit actor', error as Error, { actorId: id.value });
        throw RepositoryError.queryFailed(`Failed to find audit actor: ${error.message}`, error as Error);
      }

      return AuditActor.fromDatabase(data as AuditActorRecord);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this._logger.error('Failed to find audit actor', err as Error, { actorId: id.value });
      throw RepositoryError.queryFailed(String(err));
    }
  }

  /**
   * Lists actors with pagination and filtering.
   */
  async listActors(
    params: PaginationParams,
    filters?: AuditActorFilterParams
  ): Promise<PaginatedResult<AuditActor>> {
    try {
      const { page, pageSize, sortBy = 'display_name', sortOrder = SortOrder.ASC } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this._tableNames.actors)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.actorType) {
        query = query.eq('actor_type', filters.actorType);
      }
      if (filters?.displayName) {
        query = query.ilike('display_name', `%${filters.displayName}%`);
      }

      // Apply sorting
      query = query.order(sortBy as string, { ascending: sortOrder === SortOrder.ASC });

      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        this._logger.error('Failed to list audit actors', error as Error, { filters });
        throw RepositoryError.queryFailed(`Failed to list audit actors: ${error.message}`, error as Error);
      }

      const actors = (data ?? []).map((row) => AuditActor.fromDatabase(row as AuditActorRecord));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: actors,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      this._logger.error('Failed to list audit actors', err as Error, { params, filters });
      throw err instanceof RepositoryError ? err : RepositoryError.queryFailed(String(err));
    }
  }

  /**
   * Counts actors with optional filtering.
   */
  async countActors(filters?: AuditActorFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this._tableNames.actors)
        .select('*', { count: 'exact', head: true });

      if (filters?.actorType) {
        query = query.eq('actor_type', filters.actorType);
      }
      if (filters?.displayName) {
        query = query.ilike('display_name', `%${filters.displayName}%`);
      }

      const { count, error } = await query;

      if (error) {
        this._logger.error('Failed to count audit actors', error as Error, { filters });
        throw RepositoryError.queryFailed(`Failed to count audit actors: ${error.message}`, error as Error);
      }

      return count ?? 0;
    } catch (err) {
      this._logger.error('Failed to count audit actors', err as Error, { filters });
      throw err instanceof RepositoryError ? err : RepositoryError.queryFailed(String(err));
    }
  }

  // ============ Additional Search Methods ============

  /**
   * Finds audit records by actor ID.
   */
  async findByActor(actorId: string, params?: PaginationParams): Promise<PaginatedResult<AuditRecord>> {
    const paginationParams = params ?? { page: 1, pageSize: 20 };
    return this.listRecords(paginationParams, { actorId });
  }

  /**
   * Finds audit records by target ID.
   */
  async findByTarget(targetId: string, params?: PaginationParams): Promise<PaginatedResult<AuditRecord>> {
    const paginationParams = params ?? { page: 1, pageSize: 20 };
    return this.listRecords(paginationParams, { targetId });
  }

  /**
   * Finds audit records by category.
   */
  async findByCategory(categoryId: string, params?: PaginationParams): Promise<PaginatedResult<AuditRecord>> {
    const paginationParams = params ?? { page: 1, pageSize: 20 };
    return this.listRecords(paginationParams, { categoryId });
  }

  /**
   * Archives old audit records (soft delete simulation via metadata).
   * Note: Audit records are immutable - this marks them as archived in metadata.
   */
  async archive(olderThan: Date): Promise<number> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.records)
        .update({ metadata: { ...{}, archived: true, archivedAt: olderThan.toISOString() } })
        .lt('created_at', olderThan.toISOString())
        .select('audit_id');

      if (error) {
        this._logger.error('Failed to archive audit records', error as Error, { olderThan: olderThan.toISOString() });
        throw RepositoryError.queryFailed(`Failed to archive audit records: ${error.message}`, error as Error);
      }

      return data?.length ?? 0;
    } catch (err) {
      this._logger.error('Failed to archive audit records', err as Error, { olderThan: olderThan.toISOString() });
      throw err instanceof RepositoryError ? err : RepositoryError.queryFailed(String(err));
    }
  }
}
