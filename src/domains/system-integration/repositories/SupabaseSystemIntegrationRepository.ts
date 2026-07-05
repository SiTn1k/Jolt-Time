/**
 * Supabase System Integration Repository
 *
 * Production Supabase implementation of the System Integration repository.
 * Handles all persistence operations for system integration entities.
 *
 * IMPORTANT: System Integration is a METADATA management layer. It ONLY stores
 * registered modules, integration state, and integration snapshots.
 * System Integration Foundation MUST NEVER:
 * - Perform health checks
 * - Resolve dependencies
 * - Execute auto-recovery
 * - Perform startup validation
 * - Load modules
 * - Synchronize runtime state
 * - Modify gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 *
 * All runtime logic (health checking, dependency resolution, etc.) belongs to P-194.2.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type {
  ISystemIntegrationRepository,
  ModuleFilterParams,
  StateFilterParams,
} from '../interfaces/ISystemIntegrationRepository';
import { SystemModule, type SystemModuleRecord } from '../entities/SystemModule';
import { IntegrationState, type IntegrationStateRecord } from '../entities/IntegrationState';
import { IntegrationSnapshot, type IntegrationSnapshotRecord } from '../entities/IntegrationSnapshot';
import { ModuleId } from '../value-objects/ModuleId';
import { StateId } from '../value-objects/StateId';
import { SnapshotId } from '../value-objects/SnapshotId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { SortOrder } from '../../../shared/constants';
import { getSupabaseClient } from '../../../database/providers';
import { RepositoryError } from '../../../shared/errors/repository.error';

/**
 * Supabase implementation of the System Integration Repository.
 * Implements ISystemIntegrationRepository for system integration entity persistence.
 */
export class SupabaseSystemIntegrationRepository implements ISystemIntegrationRepository {
  private readonly _client: SupabaseClient<Database>;
  private readonly _tableNames = {
    modules: 'system_modules',
    states: 'integration_states',
    snapshots: 'integration_snapshots',
  } as const;

  /**
   * Creates a new SupabaseSystemIntegrationRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client ?? getSupabaseClient();
  }

  // ============ System Module Operations ============

  /**
   * Creates a new system module.
   */
  public async createModule(module: SystemModule): Promise<SystemModule> {
    try {
      const record = module.toRecord();

      const { data, error } = await this._client
        .from(this._tableNames.modules)
        .insert(record as unknown as any)
        .select()
        .single();

      if (error) {
        throw RepositoryError.queryFailed(`Failed to create module: ${error.message}`, error);
      }

      if (!data) {
        throw RepositoryError.queryFailed('Failed to create module: No data returned');
      }

      return SystemModule.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error creating module',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Finds a system module by its ID.
   */
  public async findModuleById(id: ModuleId): Promise<SystemModule | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.modules)
        .select('*')
        .eq('module_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.queryFailed(`Failed to find module: ${error.message}`, error);
      }

      if (!data) {
        return null;
      }

      return SystemModule.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error finding module by ID',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Finds a system module by name.
   */
  public async findModuleByName(name: string): Promise<SystemModule | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.modules)
        .select('*')
        .eq('module_name', name)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.queryFailed(`Failed to find module by name: ${error.message}`, error);
      }

      if (!data) {
        return null;
      }

      return SystemModule.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error finding module by name',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Checks if a module exists by ID.
   */
  public async moduleExists(id: ModuleId): Promise<boolean> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.modules)
        .select('module_id')
        .eq('module_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false;
        }
        throw RepositoryError.queryFailed(`Failed to check module existence: ${error.message}`, error);
      }

      return data !== null;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error checking module existence',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Updates an existing system module.
   */
  public async updateModule(module: SystemModule): Promise<SystemModule> {
    try {
      const record = module.toRecord() as any;
      const { data, error } = await (this._client
        .from(this._tableNames.modules) as any)
        .update(record)
        .eq('module_id', module.moduleId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.queryFailed(`Failed to update module: ${error.message}`, error);
      }

      if (!data) {
        throw RepositoryError.notFound(module.moduleId.value, this._tableNames.modules);
      }

      return SystemModule.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error updating module',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Deletes a system module.
   */
  public async deleteModule(id: ModuleId): Promise<void> {
    try {
      const { error } = await this._client
        .from(this._tableNames.modules)
        .delete()
        .eq('module_id', id.value);

      if (error) {
        throw RepositoryError.queryFailed(`Failed to delete module: ${error.message}`, error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error deleting module',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Lists system modules with pagination and filtering.
   */
  public async listModules(
    params: PaginationParams,
    filters?: ModuleFilterParams
  ): Promise<PaginatedResult<SystemModule>> {
    try {
      const { page, pageSize, sortBy = 'created_at', sortOrder = SortOrder.DESC } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this._tableNames.modules)
        .select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.namePattern) {
        query = query.ilike('module_name', `%${filters.namePattern}%`);
      }

      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }

      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      query = query
        .order(sortBy, { ascending: sortOrder === SortOrder.ASC })
        .range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(`Failed to list modules: ${error.message}`, error);
      }

      const total = count ?? 0;
      const modules = (data ?? []).map((row) => SystemModule.fromDatabase(row));

      return {
        items: modules,
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
      throw RepositoryError.queryFailed(
        'Unexpected error listing modules',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Counts total system modules with optional filtering.
   */
  public async countModules(filters?: ModuleFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this._tableNames.modules)
        .select('*', { count: 'exact', head: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.namePattern) {
        query = query.ilike('module_name', `%${filters.namePattern}%`);
      }

      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }

      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const { error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(`Failed to count modules: ${error.message}`, error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error counting modules',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  // ============ Integration State Operations ============

  /**
   * Creates a new integration state.
   */
  public async createState(state: IntegrationState): Promise<IntegrationState> {
    try {
      const record: IntegrationStateRecord = {
        state_id: state.stateId.value,
        module_id: state.moduleId.value,
        status: state.status,
        last_updated: state.lastUpdated.toISOString(),
        metadata: state.metadata,
        created_at: state.createdAt.toISOString(),
        updated_at: state.updatedAt.toISOString(),
      };

      const { data, error } = await this._client
        .from(this._tableNames.states)
        .insert(record as any)
        .select()
        .single();

      if (error) {
        throw RepositoryError.queryFailed(`Failed to create state: ${error.message}`, error);
      }

      if (!data) {
        throw RepositoryError.queryFailed('Failed to create state: No data returned');
      }

      return IntegrationState.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error creating state',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Finds an integration state by its ID.
   */
  public async findStateById(id: StateId): Promise<IntegrationState | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.states)
        .select('*')
        .eq('state_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.queryFailed(`Failed to find state: ${error.message}`, error);
      }

      if (!data) {
        return null;
      }

      return IntegrationState.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error finding state by ID',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Finds an integration state by module ID.
   */
  public async findStateByModuleId(moduleId: ModuleId): Promise<IntegrationState | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.states)
        .select('*')
        .eq('module_id', moduleId.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.queryFailed(`Failed to find state by module ID: ${error.message}`, error);
      }

      if (!data) {
        return null;
      }

      return IntegrationState.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error finding state by module ID',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Updates an existing integration state.
   */
  public async updateState(state: IntegrationState): Promise<IntegrationState> {
    try {
      const record: IntegrationStateRecord = {
        state_id: state.stateId.value,
        module_id: state.moduleId.value,
        status: state.status,
        last_updated: state.lastUpdated.toISOString(),
        metadata: state.metadata,
        created_at: state.createdAt.toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await (this._client
        .from(this._tableNames.states) as any)
        .update(record as any)
        .eq('state_id', state.stateId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.queryFailed(`Failed to update state: ${error.message}`, error);
      }

      if (!data) {
        throw RepositoryError.notFound(state.stateId.value, this._tableNames.states);
      }

      return IntegrationState.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error updating state',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Deletes an integration state.
   */
  public async deleteState(id: StateId): Promise<void> {
    try {
      const { error } = await this._client
        .from(this._tableNames.states)
        .delete()
        .eq('state_id', id.value);

      if (error) {
        throw RepositoryError.queryFailed(`Failed to delete state: ${error.message}`, error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error deleting state',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Lists integration states with pagination and filtering.
   */
  public async listStates(
    params: PaginationParams,
    filters?: StateFilterParams
  ): Promise<PaginatedResult<IntegrationState>> {
    try {
      const { page, pageSize, sortBy = 'updated_at', sortOrder = SortOrder.DESC } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this._tableNames.states)
        .select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.moduleId) {
        query = query.eq('module_id', filters.moduleId.value);
      }

      if (filters?.updatedAfter) {
        query = query.gte('updated_at', filters.updatedAfter.toISOString());
      }

      if (filters?.updatedBefore) {
        query = query.lte('updated_at', filters.updatedBefore.toISOString());
      }

      query = query
        .order(sortBy, { ascending: sortOrder === SortOrder.ASC })
        .range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(`Failed to list states: ${error.message}`, error);
      }

      const total = count ?? 0;
      const states = (data ?? []).map((row) => IntegrationState.fromDatabase(row));

      return {
        items: states,
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
      throw RepositoryError.queryFailed(
        'Unexpected error listing states',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Counts total integration states with optional filtering.
   */
  public async countStates(filters?: StateFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this._tableNames.states)
        .select('*', { count: 'exact', head: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.moduleId) {
        query = query.eq('module_id', filters.moduleId.value);
      }

      if (filters?.updatedAfter) {
        query = query.gte('updated_at', filters.updatedAfter.toISOString());
      }

      if (filters?.updatedBefore) {
        query = query.lte('updated_at', filters.updatedBefore.toISOString());
      }

      const { error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(`Failed to count states: ${error.message}`, error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error counting states',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  // ============ Integration Snapshot Operations ============

  /**
   * Creates a new integration snapshot.
   */
  public async createSnapshot(snapshot: IntegrationSnapshot): Promise<IntegrationSnapshot> {
    try {
      const record: IntegrationSnapshotRecord = {
        snapshot_id: snapshot.snapshotId.value,
        created_at: snapshot.createdAt.toISOString(),
        registered_modules: snapshot.registeredModules,
        healthy_modules: snapshot.healthyModules,
        failed_modules: snapshot.failedModules,
        metadata: snapshot.metadata,
      };

      const { data, error } = await this._client
        .from(this._tableNames.snapshots)
        .insert(record as any)
        .select()
        .single();

      if (error) {
        throw RepositoryError.queryFailed(`Failed to create snapshot: ${error.message}`, error);
      }

      if (!data) {
        throw RepositoryError.queryFailed('Failed to create snapshot: No data returned');
      }

      return IntegrationSnapshot.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error creating snapshot',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Finds an integration snapshot by its ID.
   */
  public async findSnapshotById(id: SnapshotId): Promise<IntegrationSnapshot | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.snapshots)
        .select('*')
        .eq('snapshot_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.queryFailed(`Failed to find snapshot: ${error.message}`, error);
      }

      if (!data) {
        return null;
      }

      return IntegrationSnapshot.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error finding snapshot by ID',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Finds the latest integration snapshot.
   */
  public async findLatestSnapshot(): Promise<IntegrationSnapshot | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.snapshots)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.queryFailed(`Failed to find latest snapshot: ${error.message}`, error);
      }

      if (!data) {
        return null;
      }

      return IntegrationSnapshot.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error finding latest snapshot',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Deletes an integration snapshot.
   */
  public async deleteSnapshot(id: SnapshotId): Promise<void> {
    try {
      const { error } = await this._client
        .from(this._tableNames.snapshots)
        .delete()
        .eq('snapshot_id', id.value);

      if (error) {
        throw RepositoryError.queryFailed(`Failed to delete snapshot: ${error.message}`, error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error deleting snapshot',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Lists integration snapshots with pagination.
   */
  public async listSnapshots(params: PaginationParams): Promise<PaginatedResult<IntegrationSnapshot>> {
    try {
      const { page, pageSize, sortBy = 'created_at', sortOrder = SortOrder.DESC } = params;
      const offset = (page - 1) * pageSize;

      const query = this._client
        .from(this._tableNames.snapshots)
        .select('*', { count: 'exact' })
        .order(sortBy, { ascending: sortOrder === SortOrder.ASC })
        .range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(`Failed to list snapshots: ${error.message}`, error);
      }

      const total = count ?? 0;
      const snapshots = (data ?? []).map((row) => IntegrationSnapshot.fromDatabase(row));

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
      throw RepositoryError.queryFailed(
        'Unexpected error listing snapshots',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Counts total integration snapshots.
   */
  public async countSnapshots(): Promise<number> {
    try {
      const { error, count } = await this._client
        .from(this._tableNames.snapshots)
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw RepositoryError.queryFailed(`Failed to count snapshots: ${error.message}`, error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error counting snapshots',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  /**
   * Deletes old snapshots, keeping only the specified number of most recent.
   */
  public async cleanupOldSnapshots(keepCount: number): Promise<void> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.snapshots)
        .select('snapshot_id', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) {
        throw RepositoryError.queryFailed(`Failed to fetch snapshots for cleanup: ${error.message}`, error);
      }

      if (!data || data.length <= keepCount) {
        return;
      }

      const typedData = data as Array<{ snapshot_id: string }>;
      const idsToDelete = typedData
        .slice(keepCount)
        .map((row) => row.snapshot_id);

      if (idsToDelete.length === 0) {
        return;
      }

      const { error: deleteError } = await this._client
        .from(this._tableNames.snapshots)
        .delete()
        .in('snapshot_id', idsToDelete);

      if (deleteError) {
        throw RepositoryError.queryFailed(`Failed to delete old snapshots: ${deleteError.message}`, deleteError);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed(
        'Unexpected error cleaning up old snapshots',
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }
}
