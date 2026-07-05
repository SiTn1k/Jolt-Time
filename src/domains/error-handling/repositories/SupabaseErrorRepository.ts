/**
 * Supabase Error Repository
 *
 * Full implementation of the Error Repository for P-191.2.
 * Implements IErrorRepository for error entity persistence using Supabase.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  IErrorRepository,
  SystemErrorFilterParams,
  ErrorCategoryFilterParams,
  ErrorContextFilterParams,
} from '../interfaces/IErrorRepository';
import { SystemError, type SystemErrorRecord } from '../entities/SystemError';
import { ErrorCategory, type ErrorCategoryRecord } from '../entities/ErrorCategory';
import { ErrorContext, type ErrorContextRecord } from '../entities/ErrorContext';
import { ErrorId } from '../value-objects/ErrorId';
import { CategoryId } from '../value-objects/CategoryId';
import { ContextId } from '../value-objects/ContextId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { createLogger } from '../../../core/logging/logger.service';
import { SortOrder } from '../../../shared/constants';

/**
 * Supabase implementation of the Error Repository.
 * Implements IErrorRepository for error entity persistence.
 * Uses Repository Error System for failure handling.
 */
export class SupabaseErrorRepository implements IErrorRepository {
  private readonly errorsTableName = 'system_errors';
  private readonly categoriesTableName = 'error_categories';
  private readonly contextsTableName = 'error_contexts';
  private readonly _client: SupabaseClient;
  private readonly _logger = createLogger('SupabaseErrorRepository');

  /**
   * Creates a new SupabaseErrorRepository instance.
   * @param _client Optional Supabase client
   */
  constructor(_client?: SupabaseClient) {
    this._client = _client as SupabaseClient;
  }

  /**
   * Safely executes a repository operation.
   * On failure, logs the error and re-throws a RepositoryError.
   * Never creates recursive exceptions.
   */
  private async executeOperation<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      this._logger.error(`Repository operation failed: ${operation}`, error as Error);
      throw error;
    }
  }

  /**
   * Calculates pagination metadata.
   */
  private calculatePagination(
    page: number,
    pageSize: number,
    total: number
  ): { totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean } {
    const totalPages = Math.ceil(total / pageSize);
    return {
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  // ============ System Error Operations ============

  /**
   * Creates a new system error.
   */
  async createError(error: SystemError): Promise<SystemError> {
    return this.executeOperation('createError', async () => {
      const record: SystemErrorRecord = {
        error_id: error.errorId.value,
        error_code: error.errorCode,
        category: error.category,
        severity: error.severity,
        message: error.message,
        stack_trace: error.stackTrace,
        created_at: error.createdAt.toISOString(),
        metadata: error.metadata,
        status: error.status,
        resolved_at: error.resolvedAt?.toISOString(),
        context_id: error.contextId,
      };

      const { data, error: supabaseError } = await this._client
        .from(this.errorsTableName)
        .insert(record)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Failed to create error: ${supabaseError.message}`);
      }

      return SystemError.fromDatabase(data as SystemErrorRecord);
    });
  }

  /**
   * Finds an error by its ID.
   */
  async findErrorById(id: ErrorId): Promise<SystemError | null> {
    return this.executeOperation('findErrorById', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.errorsTableName)
        .select('*')
        .eq('error_id', id.value)
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`Failed to find error: ${supabaseError.message}`);
      }

      return data ? SystemError.fromDatabase(data as SystemErrorRecord) : null;
    });
  }

  /**
   * Finds an error by its error code.
   */
  async findErrorByCode(errorCode: string): Promise<SystemError | null> {
    return this.executeOperation('findErrorByCode', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.errorsTableName)
        .select('*')
        .eq('error_code', errorCode)
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find error by code: ${supabaseError.message}`);
      }

      return data ? SystemError.fromDatabase(data as SystemErrorRecord) : null;
    });
  }

  /**
   * Updates an existing error.
   */
  async updateError(error: SystemError): Promise<SystemError> {
    return this.executeOperation('updateError', async () => {
      const record: Partial<SystemErrorRecord> = {
        error_code: error.errorCode,
        category: error.category,
        severity: error.severity,
        message: error.message,
        stack_trace: error.stackTrace,
        metadata: error.metadata,
        status: error.status,
        resolved_at: error.resolvedAt?.toISOString(),
        context_id: error.contextId,
      };

      const { data, error: supabaseError } = await this._client
        .from(this.errorsTableName)
        .update(record)
        .eq('error_id', error.errorId.value)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Failed to update error: ${supabaseError.message}`);
      }

      return SystemError.fromDatabase(data as SystemErrorRecord);
    });
  }

  /**
   * Deletes an error by its ID.
   */
  async deleteError(id: ErrorId): Promise<boolean> {
    return this.executeOperation('deleteError', async () => {
      const { error: supabaseError } = await this._client
        .from(this.errorsTableName)
        .delete()
        .eq('error_id', id.value);

      if (supabaseError) {
        throw new Error(`Failed to delete error: ${supabaseError.message}`);
      }

      return true;
    });
  }

  /**
   * Lists errors with pagination and filtering.
   */
  async listErrors(
    params: PaginationParams,
    filters?: SystemErrorFilterParams
  ): Promise<PaginatedResult<SystemError>> {
    return this.executeOperation('listErrors', async () => {
      let query = this._client
        .from(this.errorsTableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.errorCode) {
          query = query.eq('error_code', filters.errorCode);
        }
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.severity) {
          query = query.eq('severity', filters.severity);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.contextId) {
          query = query.eq('context_id', filters.contextId);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      // Apply pagination
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);

      // Apply sorting
      const sortColumn = params.sortBy || 'created_at';
      const sortOrder = params.sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      const { data, error: supabaseError, count } = await query;

      if (supabaseError) {
        throw new Error(`Failed to list errors: ${supabaseError.message}`);
      }

      const total = count || 0;
      const pagination = this.calculatePagination(params.page, params.pageSize, total);

      return {
        items: (data || []).map((row) => SystemError.fromDatabase(row as SystemErrorRecord)),
        total,
        page: params.page,
        pageSize: params.pageSize,
        ...pagination,
      };
    });
  }

  /**
   * Counts errors with optional filtering.
   */
  async countErrors(filters?: SystemErrorFilterParams): Promise<number> {
    return this.executeOperation('countErrors', async () => {
      let query = this._client
        .from(this.errorsTableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters) {
        if (filters.errorCode) {
          query = query.eq('error_code', filters.errorCode);
        }
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.severity) {
          query = query.eq('severity', filters.severity);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.contextId) {
          query = query.eq('context_id', filters.contextId);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const { error: supabaseError } = await query;

      if (supabaseError) {
        throw new Error(`Failed to count errors: ${supabaseError.message}`);
      }

      return 0;
    });
  }

  // ============ Error Category Operations ============

  /**
   * Creates a new error category.
   */
  async createCategory(category: ErrorCategory): Promise<ErrorCategory> {
    return this.executeOperation('createCategory', async () => {
      const record: ErrorCategoryRecord = {
        category_id: category.categoryId.value,
        name: category.name,
        description: category.description,
        category_type: category.categoryType,
        metadata: category.metadata,
        is_active: category.isActive,
        created_at: category.createdAt.toISOString(),
        updated_at: category.updatedAt.toISOString(),
      };

      const { data, error: supabaseError } = await this._client
        .from(this.categoriesTableName)
        .insert(record)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Failed to create category: ${supabaseError.message}`);
      }

      return ErrorCategory.fromDatabase(data as ErrorCategoryRecord);
    });
  }

  /**
   * Finds a category by its ID.
   */
  async findCategoryById(id: CategoryId): Promise<ErrorCategory | null> {
    return this.executeOperation('findCategoryById', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.categoriesTableName)
        .select('*')
        .eq('category_id', id.value)
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find category: ${supabaseError.message}`);
      }

      return data ? ErrorCategory.fromDatabase(data as ErrorCategoryRecord) : null;
    });
  }

  /**
   * Finds a category by its name.
   */
  async findCategoryByName(name: string): Promise<ErrorCategory | null> {
    return this.executeOperation('findCategoryByName', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.categoriesTableName)
        .select('*')
        .eq('name', name)
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find category by name: ${supabaseError.message}`);
      }

      return data ? ErrorCategory.fromDatabase(data as ErrorCategoryRecord) : null;
    });
  }

  /**
   * Updates an existing category.
   */
  async updateCategory(category: ErrorCategory): Promise<ErrorCategory> {
    return this.executeOperation('updateCategory', async () => {
      const record: Partial<ErrorCategoryRecord> = {
        name: category.name,
        description: category.description,
        category_type: category.categoryType,
        metadata: category.metadata,
        is_active: category.isActive,
        updated_at: new Date().toISOString(),
      };

      const { data, error: supabaseError } = await this._client
        .from(this.categoriesTableName)
        .update(record)
        .eq('category_id', category.categoryId.value)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Failed to update category: ${supabaseError.message}`);
      }

      return ErrorCategory.fromDatabase(data as ErrorCategoryRecord);
    });
  }

  /**
   * Deletes a category by its ID.
   */
  async deleteCategory(id: CategoryId): Promise<boolean> {
    return this.executeOperation('deleteCategory', async () => {
      const { error: supabaseError } = await this._client
        .from(this.categoriesTableName)
        .delete()
        .eq('category_id', id.value);

      if (supabaseError) {
        throw new Error(`Failed to delete category: ${supabaseError.message}`);
      }

      return true;
    });
  }

  /**
   * Lists categories with pagination and filtering.
   */
  async listCategories(
    params: PaginationParams,
    filters?: ErrorCategoryFilterParams
  ): Promise<PaginatedResult<ErrorCategory>> {
    return this.executeOperation('listCategories', async () => {
      let query = this._client
        .from(this.categoriesTableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.categoryType) {
          query = query.eq('category_type', filters.categoryType);
        }
        if (filters.isActive !== undefined) {
          query = query.eq('is_active', filters.isActive);
        }
        if (filters.name) {
          query = query.eq('name', filters.name);
        }
      }

      // Apply pagination
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);

      // Apply sorting
      const sortColumn = params.sortBy || 'created_at';
      const sortOrder = params.sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      const { data, error: supabaseError, count } = await query;

      if (supabaseError) {
        throw new Error(`Failed to list categories: ${supabaseError.message}`);
      }

      const total = count || 0;
      const pagination = this.calculatePagination(params.page, params.pageSize, total);

      return {
        items: (data || []).map((row) => ErrorCategory.fromDatabase(row as ErrorCategoryRecord)),
        total,
        page: params.page,
        pageSize: params.pageSize,
        ...pagination,
      };
    });
  }

  /**
   * Counts categories with optional filtering.
   */
  async countCategories(filters?: ErrorCategoryFilterParams): Promise<number> {
    return this.executeOperation('countCategories', async () => {
      let query = this._client
        .from(this.categoriesTableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters) {
        if (filters.categoryType) {
          query = query.eq('category_type', filters.categoryType);
        }
        if (filters.isActive !== undefined) {
          query = query.eq('is_active', filters.isActive);
        }
        if (filters.name) {
          query = query.eq('name', filters.name);
        }
      }

      const { error: supabaseError, count } = await query;

      if (supabaseError) {
        throw new Error(`Failed to count categories: ${supabaseError.message}`);
      }

      return count || 0;
    });
  }

  // ============ Error Context Operations ============

  /**
   * Creates a new error context.
   */
  async createContext(context: ErrorContext): Promise<ErrorContext> {
    return this.executeOperation('createContext', async () => {
      const record: ErrorContextRecord = {
        context_id: context.contextId.value,
        service: context.service,
        operation: context.operation,
        request_id: context.requestId,
        actor_id: context.actorId,
        metadata: context.metadata,
        created_at: context.createdAt.toISOString(),
      };

      const { data, error: supabaseError } = await this._client
        .from(this.contextsTableName)
        .insert(record)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Failed to create context: ${supabaseError.message}`);
      }

      return ErrorContext.fromDatabase(data as ErrorContextRecord);
    });
  }

  /**
   * Finds a context by its ID.
   */
  async findContextById(id: ContextId): Promise<ErrorContext | null> {
    return this.executeOperation('findContextById', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.contextsTableName)
        .select('*')
        .eq('context_id', id.value)
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find context: ${supabaseError.message}`);
      }

      return data ? ErrorContext.fromDatabase(data as ErrorContextRecord) : null;
    });
  }

  /**
   * Finds a context by request ID.
   */
  async findContextByRequestId(requestId: string): Promise<ErrorContext | null> {
    return this.executeOperation('findContextByRequestId', async () => {
      const { data, error: supabaseError } = await this._client
        .from(this.contextsTableName)
        .select('*')
        .eq('request_id', requestId)
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find context by request ID: ${supabaseError.message}`);
      }

      return data ? ErrorContext.fromDatabase(data as ErrorContextRecord) : null;
    });
  }

  /**
   * Updates an existing context.
   */
  async updateContext(context: ErrorContext): Promise<ErrorContext> {
    return this.executeOperation('updateContext', async () => {
      const record: Partial<ErrorContextRecord> = {
        service: context.service,
        operation: context.operation,
        request_id: context.requestId,
        actor_id: context.actorId,
        metadata: context.metadata,
      };

      const { data, error: supabaseError } = await this._client
        .from(this.contextsTableName)
        .update(record)
        .eq('context_id', context.contextId.value)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(`Failed to update context: ${supabaseError.message}`);
      }

      return ErrorContext.fromDatabase(data as ErrorContextRecord);
    });
  }

  /**
   * Deletes a context by its ID.
   */
  async deleteContext(id: ContextId): Promise<boolean> {
    return this.executeOperation('deleteContext', async () => {
      const { error: supabaseError } = await this._client
        .from(this.contextsTableName)
        .delete()
        .eq('context_id', id.value);

      if (supabaseError) {
        throw new Error(`Failed to delete context: ${supabaseError.message}`);
      }

      return true;
    });
  }

  /**
   * Lists contexts with pagination and filtering.
   */
  async listContexts(
    params: PaginationParams,
    filters?: ErrorContextFilterParams
  ): Promise<PaginatedResult<ErrorContext>> {
    return this.executeOperation('listContexts', async () => {
      let query = this._client
        .from(this.contextsTableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.service) {
          query = query.eq('service', filters.service);
        }
        if (filters.operation) {
          query = query.eq('operation', filters.operation);
        }
        if (filters.requestId) {
          query = query.eq('request_id', filters.requestId);
        }
        if (filters.actorId) {
          query = query.eq('actor_id', filters.actorId);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      // Apply pagination
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);

      // Apply sorting
      const sortColumn = params.sortBy || 'created_at';
      const sortOrder = params.sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      const { data, error: supabaseError, count } = await query;

      if (supabaseError) {
        throw new Error(`Failed to list contexts: ${supabaseError.message}`);
      }

      const total = count || 0;
      const pagination = this.calculatePagination(params.page, params.pageSize, total);

      return {
        items: (data || []).map((row) => ErrorContext.fromDatabase(row as ErrorContextRecord)),
        total,
        page: params.page,
        pageSize: params.pageSize,
        ...pagination,
      };
    });
  }

  /**
   * Counts contexts with optional filtering.
   */
  async countContexts(filters?: ErrorContextFilterParams): Promise<number> {
    return this.executeOperation('countContexts', async () => {
      let query = this._client
        .from(this.contextsTableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters) {
        if (filters.service) {
          query = query.eq('service', filters.service);
        }
        if (filters.operation) {
          query = query.eq('operation', filters.operation);
        }
        if (filters.requestId) {
          query = query.eq('request_id', filters.requestId);
        }
        if (filters.actorId) {
          query = query.eq('actor_id', filters.actorId);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const { error: supabaseError, count } = await query;

      if (supabaseError) {
        throw new Error(`Failed to count contexts: ${supabaseError.message}`);
      }

      return count || 0;
    });
  }
}
