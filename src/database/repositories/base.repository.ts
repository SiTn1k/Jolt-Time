/**
 * Base Repository
 *
 * Generic base repository with CRUD operations.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase-types';
import { RepositoryError } from '../errors';

/**
 * Repository result type.
 */
export type RepositoryResult<T> =
  | { success: true; data: T }
  | { success: false; error: RepositoryError };

/**
 * Base repository class with common CRUD operations.
 */
export abstract class BaseRepository {
  constructor(
    protected readonly client: SupabaseClient<Database>,
    protected readonly tableName: string
  ) {}

  /**
   * Find entity by ID.
   */
  async findById(id: string): Promise<RepositoryResult<Record<string, unknown> | null>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query = this.client.from(this.tableName).select('*').eq('id', id).single();
      const { data, error } = await query as { data: Record<string, unknown> | null; error: Record<string, unknown> | null };

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return { success: true, data: null };
        }
        return { success: false, error: RepositoryError.queryFailed(String(error), error as unknown as Error) };
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: RepositoryError.queryFailed(String(err)) };
    }
  }

  /**
   * Find all entities.
   */
  async findAll(): Promise<RepositoryResult<Record<string, unknown>[]>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await this.client.from(this.tableName).select('*') as { data: Record<string, unknown>[] | null; error: Record<string, unknown> | null };

      if (error) {
        return { success: false, error: RepositoryError.queryFailed(String(error), error as unknown as Error) };
      }

      return { success: true, data: data || [] };
    } catch (err) {
      return { success: false, error: RepositoryError.queryFailed(String(err)) };
    }
  }

  /**
   * Find entities with filters.
   */
  async findByFilters(filters: Record<string, unknown>): Promise<RepositoryResult<Record<string, unknown>[]>> {
    try {
      let query = this.client.from(this.tableName).select('*');
      
      for (const [key, value] of Object.entries(filters)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query = (query as any).eq(key, value);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await query as { data: Record<string, unknown>[] | null; error: Record<string, unknown> | null };

      if (error) {
        return { success: false, error: RepositoryError.queryFailed(String(error), error as unknown as Error) };
      }

      return { success: true, data: data || [] };
    } catch (err) {
      return { success: false, error: RepositoryError.queryFailed(String(err)) };
    }
  }

  /**
   * Check if entity exists by ID.
   */
  async exists(id: string): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await this.client.from(this.tableName).select('id').eq('id', id).single() as { data: { id: string } | null; error: Record<string, unknown> | null };
      return !error && data !== null;
    } catch {
      return false;
    }
  }

  /**
   * Count total entities.
   */
  async count(): Promise<RepositoryResult<number>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count, error } = await this.client.from(this.tableName).select('*', { count: 'exact', head: true }) as { count: number | null; error: Record<string, unknown> | null };

      if (error) {
        return { success: false, error: RepositoryError.queryFailed(String(error), error as unknown as Error) };
      }

      return { success: true, data: count || 0 };
    } catch (err) {
      return { success: false, error: RepositoryError.queryFailed(String(err)) };
    }
  }

  /**
   * Create a new entity.
   */
  async create(dto: Record<string, unknown>): Promise<RepositoryResult<Record<string, unknown>>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableName) as any).insert(dto).select().single() as { data: Record<string, unknown>; error: Record<string, unknown> | null };

      if (error) {
        return { success: false, error: RepositoryError.createFailed(this.tableName, error as unknown as Error) };
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: RepositoryError.createFailed(this.tableName, err as Error) };
    }
  }

  /**
   * Update an entity by ID.
   */
  async update(id: string, dto: Record<string, unknown>): Promise<RepositoryResult<Record<string, unknown>>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableName) as any).update(dto).eq('id', id).select().single() as { data: Record<string, unknown>; error: Record<string, unknown> | null };

      if (error) {
        return { success: false, error: RepositoryError.updateFailed(this.tableName, id, error as unknown as Error) };
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: RepositoryError.updateFailed(this.tableName, id, err as Error) };
    }
  }

  /**
   * Delete an entity by ID.
   */
  async delete(id: string): Promise<RepositoryResult<boolean>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (this.client.from(this.tableName) as any).delete().eq('id', id) as { error: Record<string, unknown> | null };

      if (error) {
        return { success: false, error: RepositoryError.deleteFailed(this.tableName, id, error as unknown as Error) };
      }

      return { success: true, data: true };
    } catch (err) {
      return { success: false, error: RepositoryError.deleteFailed(this.tableName, id, err as Error) };
    }
  }
}