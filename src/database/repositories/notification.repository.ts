/**
 * Notification Repository
 *
 * Repository implementation for notification entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database/supabase-types';
import type { NotificationEntity, NotificationPreferenceEntity } from './interfaces';
import type { RepositoryResult } from './base.repository';
import { BaseRepository } from './base.repository';
import { DatabaseTable } from '../types';

/**
 * Notification queue repository implementation.
 */
export class NotificationRepository extends BaseRepository {
  constructor(client: SupabaseClient<Database>) {
    super(client, DatabaseTable.NOTIFICATIONS);
  }

  /**
   * Find pending notifications.
   */
  async findPending(limit?: number): Promise<RepositoryResult<NotificationEntity[]>> {
    try {
      let query = this.client
        .from(this.tableName)
        .select('*')
        .eq('status', 'pending');

      if (limit) {
        query = query.limit(limit);
      }

      query = query.order('scheduled_at', { ascending: true, nullsFirst: false });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await query as { data: Record<string, unknown>[] | null; error: Record<string, unknown> | null };

      if (error) {
        return { success: false, error: { success: false, error: error } } as unknown as RepositoryResult<NotificationEntity[]>;
      }

      return {
        success: true,
        data: (data || []).map((row) => this.mapToEntity(row)),
      };
    } catch (err) {
      return { success: false, error: { success: false, error: err as Error } } as unknown as RepositoryResult<NotificationEntity[]>;
    }
  }

  /**
   * Mark notification as sent.
   */
  async markAsSent(id: string): Promise<RepositoryResult<NotificationEntity>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableName) as any)
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single() as { data: Record<string, unknown>; error: Record<string, unknown> | null };

      if (error) {
        return { success: false, error: { success: false, error: error } } as unknown as RepositoryResult<NotificationEntity>;
      }

      return { success: true, data: this.mapToEntity(data) };
    } catch (err) {
      return { success: false, error: { success: false, error: err as Error } } as unknown as RepositoryResult<NotificationEntity>;
    }
  }

  /**
   * Mark notification as failed.
   */
  async markAsFailed(id: string, errorMessage: string): Promise<RepositoryResult<NotificationEntity>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableName) as any)
        .update({
          status: 'failed',
          error_message: errorMessage,
        })
        .eq('id', id)
        .select()
        .single() as { data: Record<string, unknown>; error: Record<string, unknown> | null };

      if (error) {
        return { success: false, error: { success: false, error: error } } as unknown as RepositoryResult<NotificationEntity>;
      }

      return { success: true, data: this.mapToEntity(data) };
    } catch (err) {
      return { success: false, error: { success: false, error: err as Error } } as unknown as RepositoryResult<NotificationEntity>;
    }
  }

  /**
   * Delete old notifications.
   */
  async deleteOld(olderThan: Date): Promise<RepositoryResult<number>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error, count } = await (this.client.from(this.tableName) as any)
        .delete()
        .lt('created_at', olderThan.toISOString()) as { error: Record<string, unknown> | null; count: number | null };

      if (error) {
        return { success: false, error: { success: false, error: error } } as unknown as RepositoryResult<number>;
      }

      return { success: true, data: count || 0 };
    } catch (err) {
      return { success: false, error: { success: false, error: err as Error } } as unknown as RepositoryResult<number>;
    }
  }

  /**
   * Get user preferences.
   */
  async getPreferences(userId: string): Promise<RepositoryResult<NotificationPreferenceEntity | null>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(DatabaseTable.NOTIFICATION_PREFERENCES) as any)
        .select('*')
        .eq('user_id', userId)
        .single() as { data: Record<string, unknown> | null; error: Record<string, unknown> | null };

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return { success: true, data: null };
        }
        return { success: false, error: { success: false, error: error } } as unknown as RepositoryResult<NotificationPreferenceEntity | null>;
      }

      return { success: true, data: data ? this.mapPreferenceToEntity(data) : null };
    } catch (err) {
      return { success: false, error: { success: false, error: err as Error } } as unknown as RepositoryResult<NotificationPreferenceEntity | null>;
    }
  }

  /**
   * Update user preferences.
   */
  async updatePreferences(userId: string, data: Partial<NotificationPreferenceEntity>): Promise<RepositoryResult<NotificationPreferenceEntity>> {
    try {
      const updateData: Record<string, unknown> = {};

      if (data.dailyReminders !== undefined) updateData.daily_reminders = data.dailyReminders;
      if (data.events !== undefined) updateData.events = data.events;
      if (data.researchComplete !== undefined) updateData.research_complete = data.researchComplete;
      if (data.energyRestored !== undefined) updateData.energy_restored = data.energyRestored;
      if (data.buildingComplete !== undefined) updateData.building_complete = data.buildingComplete;
      if (data.marketing !== undefined) updateData.marketing = data.marketing;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: result, error } = await (this.client.from(DatabaseTable.NOTIFICATION_PREFERENCES) as any)
        .upsert({
          user_id: userId,
          ...updateData,
        })
        .select()
        .single() as { data: Record<string, unknown>; error: Record<string, unknown> | null };

      if (error) {
        return { success: false, error: { success: false, error: error } } as unknown as RepositoryResult<NotificationPreferenceEntity>;
      }

      return { success: true, data: this.mapPreferenceToEntity(result) };
    } catch (err) {
      return { success: false, error: { success: false, error: err as Error } } as unknown as RepositoryResult<NotificationPreferenceEntity>;
    }
  }

  /**
   * Map database row to notification entity.
   */
  private mapToEntity(row: Record<string, unknown>): NotificationEntity {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      type: row.type as string,
      title: row.title as string,
      message: row.message as string,
      status: row.status as string,
      scheduledAt: row.scheduled_at ? new Date(row.scheduled_at as string) : null,
      sentAt: row.sent_at ? new Date(row.sent_at as string) : null,
      deduplicationKey: row.deduplication_key as string | null,
      errorMessage: row.error_message as string | null,
      retryCount: row.retry_count as number,
      createdAt: new Date(row.created_at as string),
    };
  }

  /**
   * Map preference row to entity.
   */
  private mapPreferenceToEntity(row: Record<string, unknown>): NotificationPreferenceEntity {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      dailyReminders: row.daily_reminders as boolean,
      events: row.events as boolean,
      researchComplete: row.research_complete as boolean,
      energyRestored: row.energy_restored as boolean,
      buildingComplete: row.building_complete as boolean,
      marketing: row.marketing as boolean,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }
}