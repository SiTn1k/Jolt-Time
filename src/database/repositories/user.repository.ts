/**
 * User Repository
 *
 * Repository implementation for user entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database/supabase-types';
import type { UserEntity } from './interfaces';
import type { RepositoryResult } from './base.repository';
import { BaseRepository } from './base.repository';
import { DatabaseTable } from '../types';
import { MapperUtils } from '../mappers';

/**
 * User repository implementation.
 */
export class UserRepository extends BaseRepository {
  constructor(client: SupabaseClient<Database>) {
    super(client, DatabaseTable.USERS);
  }

  /**
   * Find user by telegram ID.
   */
  async findByTelegramId(telegramId: number): Promise<RepositoryResult<UserEntity | null>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, data: null };
        }
        return { success: false, error: { success: false, error: error } } as unknown as RepositoryResult<UserEntity | null>;
      }

      return { success: true, data: this.mapToEntity(data as Record<string, unknown>) };
    } catch (err) {
      return { success: false, error: { success: false, error: err as Error } } as unknown as RepositoryResult<UserEntity | null>;
    }
  }

  /**
   * Map database row to user entity.
   */
  private mapToEntity(row: Record<string, unknown>): UserEntity {
    return {
      id: row.id as string,
      telegramId: row.telegram_id as number | null,
      username: row.username as string | null,
      chatId: row.chat_id as number | null,
      notificationsEnabled: row.notifications_enabled as boolean,
      lastNotificationAt: row.last_notification_at ? new Date(row.last_notification_at as string) : null,
      lastActiveAt: new Date(row.last_active_at as string),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }
}