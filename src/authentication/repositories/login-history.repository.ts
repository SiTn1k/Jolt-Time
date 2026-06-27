/**
 * Login History Repository
 *
 * Repository implementation for tracking login history.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database/supabase-types';
import type { LoginHistory, AuthProvider } from '../types';
import type { ILoginHistoryRepository } from '../repositories';
import type { RepositoryResult } from '../../database/repositories';
import { DatabaseTable } from '../../database/types';
import { RepositoryError } from '../../database/errors';

/**
 * Login history repository implementation.
 */
export class LoginHistoryRepository implements ILoginHistoryRepository {
  private readonly client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  /**
   * Find login history by ID.
   */
  async findById(id: string): Promise<RepositoryResult<LoginHistory | null>> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.LOGIN_HISTORY)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, data: null };
        }
        return { success: false, error: new RepositoryError({ message: 'findById failed: ' + error.message, operation: 'findById', cause: error }) };
      }

      return { success: true, data: this.mapToEntity(data) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'findById failed: ' + (err as Error).message, operation: 'findById', cause: err as Error }) };
    }
  }

  /**
   * Find login history for a user.
   */
  async findByUserId(
    userId: string,
    limit = 50
  ): Promise<RepositoryResult<LoginHistory[]>> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.LOGIN_HISTORY)
        .select('*')
        .eq('internal_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: new RepositoryError({ message: 'findByUserId failed: ' + error.message, operation: 'findByUserId', cause: error }) };
      }

      return { success: true, data: data.map((row) => this.mapToEntity(row)) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'findByUserId failed: ' + (err as Error).message, operation: 'findByUserId', cause: err as Error }) };
    }
  }

  /**
   * Find recent login history for a user by Telegram ID.
   */
  async findRecentByTelegramId(
    telegramId: number,
    limit = 10
  ): Promise<RepositoryResult<LoginHistory[]>> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.LOGIN_HISTORY)
        .select('*')
        .eq('telegram_id', telegramId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: new RepositoryError({ message: 'findRecentByTelegramId failed: ' + error.message, operation: 'findRecentByTelegramId', cause: error }) };
      }

      return { success: true, data: data.map((row) => this.mapToEntity(row)) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'findRecentByTelegramId failed: ' + (err as Error).message, operation: 'findRecentByTelegramId', cause: err as Error }) };
    }
  }

  /**
   * Create a login history entry.
   */
  async create(entry: Partial<LoginHistory>): Promise<RepositoryResult<LoginHistory>> {
    try {
      const dbEntry = this.mapToDb(entry);
      const { data, error } = await (this.client
        .from(DatabaseTable.LOGIN_HISTORY) as any)
        .insert(dbEntry)
        .select()
        .single();

      if (error) {
        return { success: false, error: new RepositoryError({ message: 'create failed: ' + error.message, operation: 'create', cause: error }) };
      }

      return { success: true, data: this.mapToEntity(data) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'create failed: ' + (err as Error).message, operation: 'create', cause: err as Error }) };
    }
  }

  /**
   * Delete login history older than the specified date.
   */
  async deleteOld(olderThan: Date): Promise<RepositoryResult<number>> {
    try {
      const { error, count } = await this.client
        .from(DatabaseTable.LOGIN_HISTORY)
        .delete()
        .lt('created_at', olderThan.toISOString());

      if (error) {
        return { success: false, error: new RepositoryError({ message: 'deleteOld failed: ' + error.message, operation: 'deleteOld', cause: error }) };
      }

      return { success: true, data: count ?? 0 };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'deleteOld failed: ' + (err as Error).message, operation: 'deleteOld', cause: err as Error }) };
    }
  }

  /**
   * Map database row to LoginHistory entity.
   */
  private mapToEntity(row: Record<string, unknown>): LoginHistory {
    return {
      id: row.id as string,
      internalUserId: row.internal_user_id as string,
      telegramId: row.telegram_id as number | null,
      provider: row.provider as AuthProvider,
      success: row.success as boolean,
      ipAddress: row.ip_address as string | null,
      userAgent: row.user_agent as string | null,
      deviceInfo: row.device_info as string | null,
      failureReason: row.failure_reason as string | null,
      createdAt: new Date(row.created_at as string),
    };
  }

  /**
   * Map LoginHistory entity to database row.
   */
  private mapToDb(entry: Partial<LoginHistory>): Record<string, unknown> {
    return {
      id: entry.id,
      internal_user_id: entry.internalUserId,
      telegram_id: entry.telegramId,
      provider: entry.provider,
      success: entry.success,
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
      device_info: entry.deviceInfo,
      failure_reason: entry.failureReason,
      created_at: entry.createdAt?.toISOString(),
    };
  }
}
