/**
 * Supabase User Repository
 *
 * Production Supabase implementation of the User repository.
 * Handles all User data persistence operations via Supabase.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { getLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';
import { SortOrder } from '../../../shared/constants';
import { RepositoryError } from '../../../database/errors/repository.error';
import { IUserRepository, type UserFilterParams } from './IUserRepository';
import { User, type UserRecord } from '../entities/User';
import { UserId } from '../value-objects/UserId';
import { TelegramId } from '../value-objects/TelegramId';
import { Username } from '../value-objects/Username';
import { UserStatus } from '../types/UserStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Supabase implementation of the User Repository.
 * Implements IUserRepository for User entity persistence.
 */
export class SupabaseUserRepository implements IUserRepository {
  private readonly client: SupabaseClient<Database>;
  private readonly logger: ILogger;
  private readonly tableName = 'users';

  /**
   * Creates a new SupabaseUserRepository instance.
   * @param client Optional Supabase client (uses default if not provided)
   * @param logger Optional logger instance (creates child logger if not provided)
   */
  constructor(
    client?: SupabaseClient<Database>,
    logger?: ILogger
  ) {
    this.client = client ?? getSupabaseClient();
    this.logger = logger ?? getLogger().child({ module: 'SupabaseUserRepository' });
  }

  /**
   * Creates a new user.
   */
  async create(user: User): Promise<User> {
    try {
      this.logger.debug('Creating user', { userId: user.id.value, telegramId: user.telegramId.value });

      const record = this.toRecord(user);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableName) as any)
        .insert(record)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create user', error);
        throw RepositoryError.createFailed('User', this.toError(error));
      }

      if (!data) {
        throw RepositoryError.createFailed('User', new Error('No data returned after insert'));
      }

      const createdUser = this.fromRecord(data);
      this.logger.info('User created successfully', { userId: createdUser.id.value });
      return createdUser;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error creating user', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.createFailed('User', err instanceof Error ? err : undefined);
    }
  }

  /**
   * Finds a user by their internal ID.
   */
  async findById(id: UserId): Promise<User | null> {
    try {
      this.logger.debug('Finding user by ID', { userId: id.value });

      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', id.value)
        .single();

      if (error) {
        if (this.isNotFoundError(error)) {
          this.logger.debug('User not found by ID', { userId: id.value });
          return null;
        }
        this.logger.error('Failed to find user by ID', error);
        throw new RepositoryError({
          message: `Failed to find user: ${id.value}`,
          operation: 'SELECT',
          cause: error,
          context: { userId: id.value },
        });
      }

      if (!data) {
        return null;
      }

      return this.fromRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding user by ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding user: ${id.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Finds a user by their Telegram ID.
   */
  async findByTelegramId(telegramId: TelegramId): Promise<User | null> {
    try {
      this.logger.debug('Finding user by Telegram ID', { telegramId: telegramId.value });

      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('telegram_id', telegramId.value)
        .single();

      if (error) {
        if (this.isNotFoundError(error)) {
          this.logger.debug('User not found by Telegram ID', { telegramId: telegramId.value });
          return null;
        }
        this.logger.error('Failed to find user by Telegram ID', error);
        throw new RepositoryError({
          message: `Failed to find user by Telegram ID: ${telegramId.value}`,
          operation: 'SELECT',
          cause: error,
          context: { telegramId: telegramId.value },
        });
      }

      if (!data) {
        return null;
      }

      return this.fromRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding user by ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding user by Telegram ID: ${telegramId.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Finds a user by their Telegram username.
   */
  async findByUsername(username: Username): Promise<User | null> {
    try {
      this.logger.debug('Finding user by username', { username: username.value });

      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('username', username.value.toLowerCase())
        .single();

      if (error) {
        if (this.isNotFoundError(error)) {
          this.logger.debug('User not found by username', { username: username.value });
          return null;
        }
        this.logger.error('Failed to find user by username', error);
        throw new RepositoryError({
          message: `Failed to find user by username: ${username.value}`,
          operation: 'SELECT',
          cause: error,
          context: { username: username.value },
        });
      }

      if (!data) {
        return null;
      }

      return this.fromRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding user by ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding user by username: ${username.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Checks if a user exists by their internal ID.
   */
  async exists(id: UserId): Promise<boolean> {
    try {
      this.logger.debug('Checking if user exists', { userId: id.value });

      const { data, error } = await this.client
        .from(this.tableName)
        .select('id')
        .eq('id', id.value)
        .limit(1);

      if (error) {
        this.logger.error('Failed to check user existence', error);
        throw new RepositoryError({
          message: `Failed to check user existence: ${id.value}`,
          operation: 'SELECT',
          cause: error,
        });
      }

      return data !== null && data.length > 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding user by ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error checking user existence: ${id.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Updates an existing user.
   */
  async update(user: User): Promise<User> {
    try {
      this.logger.debug('Updating user', { userId: user.id.value });

      const record = this.toRecord(user);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableName) as any)
        .update(record)
        .eq('id', user.id.value)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to update user', error);
        throw RepositoryError.updateFailed('User', user.id.value, this.toError(error));
      }

      if (!data) {
        throw RepositoryError.updateFailed('User', user.id.value, new Error('No data returned after update'));
      }

      const updatedUser = this.fromRecord(data);
      this.logger.info('User updated successfully', { userId: updatedUser.id.value });
      return updatedUser;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error updating user', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.updateFailed('User', user.id.value, err instanceof Error ? err : undefined);
    }
  }

  /**
   * Updates the last seen timestamp for a user.
   */
  async updateLastSeen(id: UserId): Promise<User> {
    try {
      this.logger.debug('Updating user last seen', { userId: id.value });

      const now = new Date().toISOString();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableName) as any)
        .update({ last_active_at: now })
        .eq('id', id.value)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to update user last seen', error);
        throw RepositoryError.updateFailed('User', id.value, this.toError(error));
      }

      if (!data) {
        throw RepositoryError.updateFailed('User', id.value, new Error('No data returned after update'));
      }

      const updatedUser = this.fromRecord(data);
      this.logger.debug('User last seen updated', { userId: updatedUser.id.value });
      return updatedUser;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error updating user last seen', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.updateFailed('User', id.value, err instanceof Error ? err : undefined);
    }
  }

  /**
   * Soft deletes a user (sets status to DELETED).
   */
  async softDelete(id: UserId): Promise<void> {
    try {
      this.logger.debug('Soft deleting user', { userId: id.value });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (this.client.from(this.tableName) as any)
        .update({ status: UserStatus.DELETED })
        .eq('id', id.value);

      if (error) {
        this.logger.error('Failed to soft delete user', error);
        throw RepositoryError.deleteFailed('User', id.value, this.toError(error));
      }

      this.logger.info('User soft deleted successfully', { userId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error soft deleting user', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.deleteFailed('User', id.value, err instanceof Error ? err : undefined);
    }
  }

  /**
   * Restores a soft-deleted user.
   */
  async restore(id: UserId): Promise<User> {
    try {
      this.logger.debug('Restoring user', { userId: id.value });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableName) as any)
        .update({ status: UserStatus.ACTIVE })
        .eq('id', id.value)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to restore user', error);
        throw new RepositoryError({
          message: `Failed to restore user: ${id.value}`,
          operation: 'UPDATE',
          cause: this.toError(error),
          context: { userId: id.value },
        });
      }

      if (!data) {
        throw new RepositoryError({
          message: `User not found for restore: ${id.value}`,
          operation: 'UPDATE',
          context: { userId: id.value },
        });
      }

      const restoredUser = this.fromRecord(data);
      this.logger.info('User restored successfully', { userId: restoredUser.id.value });
      return restoredUser;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding user by ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error restoring user: ${id.value}`,
        operation: 'UPDATE',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Lists users with pagination and filtering.
   */
  async list(
    params: PaginationParams,
    filters?: UserFilterParams
  ): Promise<PaginatedResult<User>> {
    try {
      this.logger.debug('Listing users', { params, filters });

      const { page, pageSize, sortBy = 'created_at', sortOrder = SortOrder.DESC } = params;
      const offset = (page - 1) * pageSize;

      let query = this.client.from(this.tableName).select('*', { count: 'exact' });

      query = this.applyFilters(query, filters);

      query = query
        .order(sortBy, { ascending: sortOrder === SortOrder.ASC })
        .range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        this.logger.error('Failed to list users', error);
        throw new RepositoryError({
          message: 'Failed to list users',
          operation: 'SELECT',
          cause: error,
        });
      }

      const users = (data || []).map((record) => this.fromRecord(record));
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      this.logger.debug('Users listed successfully', { count: users.length, total });

      return {
        items: users,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding user by ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: 'Unexpected error listing users',
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Counts total users with optional filtering.
   */
  async count(filters?: UserFilterParams): Promise<number> {
    try {
      this.logger.debug('Counting users', { filters });

      let query = this.client.from(this.tableName).select('*', { count: 'exact', head: true });

      query = this.applyFilters(query, filters);

      const { error, count } = await query;

      if (error) {
        this.logger.error('Failed to count users', error);
        throw new RepositoryError({
          message: 'Failed to count users',
          operation: 'SELECT',
          cause: error as Error | undefined,
        });
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding user by ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: 'Unexpected error counting users',
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  // #region Private Helper Methods
  // ================================================================================

  /**
   * Converts a database record to a User entity.
   */
  private fromRecord(record: unknown): User {
    const userRecord = record as UserRecord;
    return User.fromDatabase(userRecord);
  }

  /**
   * Converts a User entity to a database record.
   */
  private toRecord(user: User): {
    id: string;
    telegram_id: number;
    username: string | null;
    chat_id: number | null;
    notifications_enabled: boolean;
    last_notification_at: string | null;
    last_active_at: string;
    created_at: string;
    updated_at: string;
  } {
    return {
      id: user.id.value,
      telegram_id: user.telegramId.value,
      username: user.username?.value ?? null,
      chat_id: null,
      notifications_enabled: true,
      last_notification_at: null,
      last_active_at: user.lastSeenAt?.toISOString() ?? new Date().toISOString(),
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    };
  }

  /**
   * Applies filters to a query builder.
   */
  private applyFilters(
    query: ReturnType<typeof this.client.from>,
    filters?: UserFilterParams
  ): ReturnType<typeof this.client.from> {
    if (!filters) return query;

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.isPremium !== undefined) {
      query = query.eq('is_premium', filters.isPremium);
    }

    if (filters.languageCode) {
      query = query.eq('language_code', filters.languageCode);
    }

    if (filters.seenAfter) {
      query = query.gte('last_active_at', filters.seenAfter.toISOString());
    }

    if (filters.seenBefore) {
      query = query.lte('last_active_at', filters.seenBefore.toISOString());
    }

    return query;
  }

  /**
   * Checks if an error is a "not found" error.
   */
  private isNotFoundError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) return false;
    const err = error as { code?: string; message?: string };
    return err.code === 'PGRST116' || (typeof err.message === 'string' && err.message.includes('No rows'));
  }

  /**
   * Converts a Supabase error to a standard Error.
   */
  private toError(error: unknown): Error | undefined {
    if (error instanceof Error) return error;
    if (typeof error === 'object' && error !== null) {
      const err = error as { message?: string; code?: string };
      return new Error(err.message || `Database error: ${err.code || 'unknown'}`);
    }
    return undefined;
  }
  // ================================================================================
  // #endregion
}
