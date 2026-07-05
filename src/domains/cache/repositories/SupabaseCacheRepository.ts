/**
 * Supabase Cache Repository
 *
 * Production Supabase implementation of the Cache repository.
 * Handles all persistence operations for cache entities.
 *
 * IMPORTANT: Cache is a METADATA management layer. It ONLY stores cache entries,
 * regions, and statistics. Cache MUST NEVER:
 * - Execute cache operations
 * - Manage cache lifecycle
 * - Modify gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type {
  ICacheRepository,
  CacheEntryFilterParams,
  CacheRegionFilterParams,
  CacheStatisticsFilterParams,
} from '../interfaces/ICacheRepository';
import { CacheEntry, type CacheEntryRecord } from '../entities/CacheEntry';
import { CacheRegion, type CacheRegionRecord } from '../entities/CacheRegion';
import { CacheStatistics, type CacheStatisticsRecord } from '../entities/CacheStatistics';
import type { CacheKey } from '../value-objects/CacheKey';
import type { RegionId } from '../value-objects/RegionId';
import type { StatisticsId } from '../value-objects/StatisticsId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers';
import { RepositoryError } from '../../../database/errors/repository.error';

/**
 * Supabase implementation of the Cache Repository.
 * Implements ICacheRepository for cache entity persistence.
 */
export class SupabaseCacheRepository implements ICacheRepository {
  private readonly _tableNames = {
    entries: 'cache_entries',
    regions: 'cache_regions',
    statistics: 'cache_statistics',
  } as const;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _client: SupabaseClient<any, any, any>;

  /**
   * Creates a new SupabaseCacheRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(client?: SupabaseClient<any, any, any>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._client = client ?? (getSupabaseClient() as any);
  }

  /**
   * Get the Supabase client.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get client(): SupabaseClient<any, any, any> {
    return this._client;
  }

  /**
   * Maps a database row to CacheEntryRecord format.
   */
  private mapRowToEntryRecord(row: Record<string, unknown>): CacheEntryRecord {
    return {
      cache_key: row.cache_key as string,
      cache_value: row.cache_value as unknown,
      cache_type: row.cache_type as string,
      status: row.status as string,
      created_at: row.created_at as string,
      expires_at: row.expires_at as string | null,
      version: row.version as number,
      metadata: row.metadata as CacheEntryRecord['metadata'],
    };
  }

  /**
   * Maps a database row to CacheEntry entity.
   */
  private mapRowToEntry(row: Record<string, unknown>): CacheEntry {
    const record = this.mapRowToEntryRecord(row);
    return CacheEntry.fromDatabase(record);
  }

  /**
   * Maps a database row to CacheRegionRecord format.
   */
  private mapRowToRegionRecord(row: Record<string, unknown>): CacheRegionRecord {
    return {
      region_id: row.region_id as string,
      region_name: row.region_name as string,
      region_type: row.region_type as string,
      description: row.description as string,
      enabled: row.enabled as boolean,
      metadata: row.metadata as CacheRegionRecord['metadata'],
    };
  }

  /**
   * Maps a database row to CacheRegion entity.
   */
  private mapRowToRegion(row: Record<string, unknown>): CacheRegion {
    const record = this.mapRowToRegionRecord(row);
    return CacheRegion.fromDatabase(record);
  }

  /**
   * Maps a database row to CacheStatisticsRecord format.
   */
  private mapRowToStatisticsRecord(row: Record<string, unknown>): CacheStatisticsRecord {
    return {
      statistics_id: row.statistics_id as string,
      hits: row.hits as number,
      misses: row.misses as number,
      evictions: row.evictions as number,
      entries: row.entries as number,
      memory_usage: row.memory_usage as number,
      updated_at: row.updated_at as string,
      metadata: row.metadata as CacheStatisticsRecord['metadata'],
    };
  }

  /**
   * Maps a database row to CacheStatistics entity.
   */
  private mapRowToStatistics(row: Record<string, unknown>): CacheStatistics {
    const record = this.mapRowToStatisticsRecord(row);
    return CacheStatistics.fromDatabase(record);
  }

  /**
   * Calculates pagination offset from page and pageSize.
   */
  private calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.pageSize;
  }

  // ============ Cache Entry Operations ============

  /**
   * Creates a new cache entry record.
   */
  async createEntry(entry: CacheEntry): Promise<CacheEntry> {
    try {
      const record = entry.toRecord();
      const { data, error } = await this.client
        .from(this._tableNames.entries)
        .insert(record)
        .select()
        .single();

      if (error) {
        throw RepositoryError.createFailed('CacheEntry', error);
      }

      if (!data) {
        throw RepositoryError.createFailed('CacheEntry');
      }

      return this.mapRowToEntry(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('CacheEntry', err as Error);
    }
  }

  /**
   * Finds a cache entry by its key.
   */
  async findEntryByKey(key: CacheKey): Promise<CacheEntry | null> {
    try {
      const { data, error } = await this.client
        .from(this._tableNames.entries)
        .select('*')
        .eq('cache_key', key.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('CacheEntry', key.value, this._tableNames.entries);
      }

      if (!data) {
        return null;
      }

      return this.mapRowToEntry(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.entityNotFound('CacheEntry', key.value, this._tableNames.entries);
    }
  }

  /**
   * Lists cache entries with pagination and filtering.
   */
  async listEntries(
    params: PaginationParams,
    filters?: CacheEntryFilterParams
  ): Promise<PaginatedResult<CacheEntry>> {
    try {
      let query = this.client.from(this._tableNames.entries).select('*', { count: 'exact' });

      if (filters) {
        if (filters.cacheType) {
          query = query.eq('cache_type', filters.cacheType);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.regionId) {
          query = query.eq('region_id', filters.regionId);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
        if (filters.expiresAfter) {
          query = query.gte('expires_at', filters.expiresAfter.toISOString());
        }
        if (filters.expiresBefore) {
          query = query.lte('expires_at', filters.expiresBefore.toISOString());
        }
      }

      const offset = this.calculateOffset(params);
      query = query.range(offset, offset + params.pageSize - 1);

      if (params.sortBy) {
        const sortOrder = params.sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';
        query = query.order(params.sortBy, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.createFailed('CacheEntry list', error);
      }

      const entries = (data ?? []).map((row) => this.mapRowToEntry(row as Record<string, unknown>));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items: entries,
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
      throw RepositoryError.createFailed('CacheEntry list', err as Error);
    }
  }

  /**
   * Counts cache entries with optional filtering.
   */
  async countEntries(filters?: CacheEntryFilterParams): Promise<number> {
    try {
      let query = this.client
        .from(this._tableNames.entries)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.cacheType) {
          query = query.eq('cache_type', filters.cacheType);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.regionId) {
          query = query.eq('region_id', filters.regionId);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const { count, error } = await query;

      if (error) {
        throw RepositoryError.createFailed('CacheEntry count', error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('CacheEntry count', err as Error);
    }
  }

  /**
   * Updates an existing cache entry.
   */
  async updateEntry(entry: CacheEntry): Promise<CacheEntry> {
    try {
      const record = entry.toRecord();
      const { data, error } = await this.client
        .from(this._tableNames.entries)
        .update(record)
        .eq('cache_key', entry.cacheKey.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('CacheEntry', entry.cacheKey.value, error);
      }

      if (!data) {
        throw RepositoryError.updateFailed('CacheEntry', entry.cacheKey.value);
      }

      return this.mapRowToEntry(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.updateFailed('CacheEntry', entry.cacheKey.value, err as Error);
    }
  }

  /**
   * Deletes a cache entry by key.
   */
  async deleteEntry(key: CacheKey): Promise<boolean> {
    try {
      const { error } = await this.client
        .from(this._tableNames.entries)
        .delete()
        .eq('cache_key', key.value);

      if (error) {
        throw RepositoryError.deleteFailed('CacheEntry', key.value, error);
      }

      return true;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.deleteFailed('CacheEntry', key.value, err as Error);
    }
  }

  /**
   * Deletes multiple cache entries by keys.
   */
  async deleteEntries(keys: CacheKey[]): Promise<number> {
    try {
      const keyValues = keys.map((k) => k.value);
      const { error, count } = await this.client
        .from(this._tableNames.entries)
        .delete()
        .in('cache_key', keyValues);

      if (error) {
        throw RepositoryError.deleteFailed('CacheEntries', keyValues.join(','), error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.deleteFailed('CacheEntries', 'multiple', err as Error);
    }
  }

  // ============ Cache Region Operations ============

  /**
   * Creates a new cache region record.
   */
  async createRegion(region: CacheRegion): Promise<CacheRegion> {
    try {
      const record = region.toRecord();
      const { data, error } = await this.client
        .from(this._tableNames.regions)
        .insert(record)
        .select()
        .single();

      if (error) {
        throw RepositoryError.createFailed('CacheRegion', error);
      }

      if (!data) {
        throw RepositoryError.createFailed('CacheRegion');
      }

      return this.mapRowToRegion(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('CacheRegion', err as Error);
    }
  }

  /**
   * Finds a cache region by its ID.
   */
  async findRegionById(id: RegionId): Promise<CacheRegion | null> {
    try {
      const { data, error } = await this.client
        .from(this._tableNames.regions)
        .select('*')
        .eq('region_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('CacheRegion', id.value, this._tableNames.regions);
      }

      if (!data) {
        return null;
      }

      return this.mapRowToRegion(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.entityNotFound('CacheRegion', id.value, this._tableNames.regions);
    }
  }

  /**
   * Finds a cache region by its name.
   */
  async findRegionByName(name: string): Promise<CacheRegion | null> {
    try {
      const { data, error } = await this.client
        .from(this._tableNames.regions)
        .select('*')
        .eq('region_name', name)
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

      return this.mapRowToRegion(data as Record<string, unknown>);
    } catch {
      return null;
    }
  }

  /**
   * Lists cache regions with pagination and filtering.
   */
  async listRegions(
    params: PaginationParams,
    filters?: CacheRegionFilterParams
  ): Promise<PaginatedResult<CacheRegion>> {
    try {
      let query = this.client.from(this._tableNames.regions).select('*', { count: 'exact' });

      if (filters) {
        if (filters.regionType) {
          query = query.eq('region_type', filters.regionType);
        }
        if (filters.enabled !== undefined) {
          query = query.eq('enabled', filters.enabled);
        }
        if (filters.regionName) {
          query = query.eq('region_name', filters.regionName);
        }
      }

      const offset = this.calculateOffset(params);
      query = query.range(offset, offset + params.pageSize - 1);

      if (params.sortBy) {
        const sortOrder = params.sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';
        query = query.order(params.sortBy, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('region_name', { ascending: true });
      }

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.createFailed('CacheRegion list', error);
      }

      const regions = (data ?? []).map((row) => this.mapRowToRegion(row as Record<string, unknown>));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items: regions,
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
      throw RepositoryError.createFailed('CacheRegion list', err as Error);
    }
  }

  /**
   * Counts cache regions with optional filtering.
   */
  async countRegions(filters?: CacheRegionFilterParams): Promise<number> {
    try {
      let query = this.client
        .from(this._tableNames.regions)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.regionType) {
          query = query.eq('region_type', filters.regionType);
        }
        if (filters.enabled !== undefined) {
          query = query.eq('enabled', filters.enabled);
        }
        if (filters.regionName) {
          query = query.eq('region_name', filters.regionName);
        }
      }

      const { count, error } = await query;

      if (error) {
        throw RepositoryError.createFailed('CacheRegion count', error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('CacheRegion count', err as Error);
    }
  }

  /**
   * Updates an existing cache region.
   */
  async updateRegion(region: CacheRegion): Promise<CacheRegion> {
    try {
      const record = region.toRecord();
      const { data, error } = await this.client
        .from(this._tableNames.regions)
        .update(record)
        .eq('region_id', region.regionId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('CacheRegion', region.regionId.value, error);
      }

      if (!data) {
        throw RepositoryError.updateFailed('CacheRegion', region.regionId.value);
      }

      return this.mapRowToRegion(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.updateFailed('CacheRegion', region.regionId.value, err as Error);
    }
  }

  /**
   * Deletes a cache region by ID.
   */
  async deleteRegion(id: RegionId): Promise<boolean> {
    try {
      const { error } = await this.client
        .from(this._tableNames.regions)
        .delete()
        .eq('region_id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('CacheRegion', id.value, error);
      }

      return true;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.deleteFailed('CacheRegion', id.value, err as Error);
    }
  }

  // ============ Cache Statistics Operations ============

  /**
   * Creates a new cache statistics record.
   */
  async createStatistics(statistics: CacheStatistics): Promise<CacheStatistics> {
    try {
      const record = statistics.toRecord();
      const { data, error } = await this.client
        .from(this._tableNames.statistics)
        .insert(record)
        .select()
        .single();

      if (error) {
        throw RepositoryError.createFailed('CacheStatistics', error);
      }

      if (!data) {
        throw RepositoryError.createFailed('CacheStatistics');
      }

      return this.mapRowToStatistics(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('CacheStatistics', err as Error);
    }
  }

  /**
   * Finds cache statistics by ID.
   */
  async findStatisticsById(id: StatisticsId): Promise<CacheStatistics | null> {
    try {
      const { data, error } = await this.client
        .from(this._tableNames.statistics)
        .select('*')
        .eq('statistics_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('CacheStatistics', id.value, this._tableNames.statistics);
      }

      if (!data) {
        return null;
      }

      return this.mapRowToStatistics(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.entityNotFound('CacheStatistics', id.value, this._tableNames.statistics);
    }
  }

  /**
   * Lists cache statistics with pagination and filtering.
   */
  async listStatistics(
    params: PaginationParams,
    filters?: CacheStatisticsFilterParams
  ): Promise<PaginatedResult<CacheStatistics>> {
    try {
      let query = this.client.from(this._tableNames.statistics).select('*', { count: 'exact' });

      if (filters) {
        if (filters.periodStart) {
          query = query.gte('updated_at', filters.periodStart.toISOString());
        }
        if (filters.periodEnd) {
          query = query.lte('updated_at', filters.periodEnd.toISOString());
        }
      }

      const offset = this.calculateOffset(params);
      query = query.range(offset, offset + params.pageSize - 1);

      if (params.sortBy) {
        const sortOrder = params.sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';
        query = query.order(params.sortBy, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('updated_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.createFailed('CacheStatistics list', error);
      }

      const statistics = (data ?? []).map((row) => this.mapRowToStatistics(row as Record<string, unknown>));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items: statistics,
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
      throw RepositoryError.createFailed('CacheStatistics list', err as Error);
    }
  }

  /**
   * Counts cache statistics records with optional filtering.
   */
  async countStatistics(filters?: CacheStatisticsFilterParams): Promise<number> {
    try {
      let query = this.client
        .from(this._tableNames.statistics)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.periodStart) {
          query = query.gte('updated_at', filters.periodStart.toISOString());
        }
        if (filters.periodEnd) {
          query = query.lte('updated_at', filters.periodEnd.toISOString());
        }
      }

      const { count, error } = await query;

      if (error) {
        throw RepositoryError.createFailed('CacheStatistics count', error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('CacheStatistics count', err as Error);
    }
  }

  /**
   * Updates existing cache statistics.
   */
  async updateStatistics(statistics: CacheStatistics): Promise<CacheStatistics> {
    try {
      const record = statistics.toRecord();
      const { data, error } = await this.client
        .from(this._tableNames.statistics)
        .update(record)
        .eq('statistics_id', statistics.statisticsId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('CacheStatistics', statistics.statisticsId.value, error);
      }

      if (!data) {
        throw RepositoryError.updateFailed('CacheStatistics', statistics.statisticsId.value);
      }

      return this.mapRowToStatistics(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.updateFailed('CacheStatistics', statistics.statisticsId.value, err as Error);
    }
  }

  /**
   * Deletes cache statistics by ID.
   */
  async deleteStatistics(id: StatisticsId): Promise<boolean> {
    try {
      const { error } = await this.client
        .from(this._tableNames.statistics)
        .delete()
        .eq('statistics_id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('CacheStatistics', id.value, error);
      }

      return true;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.deleteFailed('CacheStatistics', id.value, err as Error);
    }
  }
}
