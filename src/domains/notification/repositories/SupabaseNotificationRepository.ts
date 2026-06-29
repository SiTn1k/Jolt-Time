/**
 * Supabase Notification Repository
 *
 * Production implementation of the Notification repository.
 * Handles persistence for Notifications, Templates, and Channels.
 *
 * This repository NEVER exposes raw Supabase rows - always returns domain entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  INotificationRepository,
  NotificationQueryFilters,
  TemplateQueryFilters,
  ChannelQueryFilters,
} from '../interfaces/INotificationRepository';
import { Notification } from '../entities/Notification';
import { NotificationTemplate } from '../entities/NotificationTemplate';
import { NotificationChannel } from '../entities/NotificationChannel';
import { NotificationId } from '../value-objects/NotificationId';
import { TemplateId } from '../value-objects/TemplateId';
import { ChannelId } from '../value-objects/ChannelId';
import { NotificationStatus } from '../types/NotificationStatus';
import { NotificationChannelType } from '../types/NotificationChannelType';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';

const logger = createLogger('SupabaseNotificationRepository');

/**
 * Database row types for notifications table.
 */
interface NotificationRow {
  notification_id: string;
  player_profile_id: string;
  template_id: string;
  channel: string;
  status: string;
  priority: number;
  payload: Record<string, unknown>;
  created_at: string;
  scheduled_at: string | null;
  sent_at: string | null;
  metadata: Record<string, unknown>;
}

/**
 * Database row types for templates table.
 */
interface TemplateRow {
  template_id: string;
  slug: string;
  title: string;
  body: string;
  variables: string[] | null;
  channel: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/**
 * Database row types for channels table.
 */
interface ChannelRow {
  channel_id: string;
  channel_type: string;
  is_enabled: boolean;
  configuration: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/**
 * Supabase implementation of the Notification Repository.
 * Implements INotificationRepository for Notification entity persistence.
 */
export class SupabaseNotificationRepository implements INotificationRepository {
  private readonly notificationsTable = 'notifications';
  private readonly templatesTable = 'notification_templates';
  private readonly channelsTable = 'notification_channels';
  private readonly _client?: SupabaseClient;

  constructor(client?: SupabaseClient) {
    this._client = client;
  }

  private get client(): SupabaseClient {
    return this._client ?? getSupabaseClient();
  }

  // ==================== Notification Operations ====================

  /**
   * Finds a notification by ID.
   */
  async findById(notificationId: NotificationId): Promise<Notification | null> {
    try {
      logger.debug('Finding notification by ID', { notificationId: notificationId.value });

      const { data, error } = await this.client
        .from(this.notificationsTable)
        .select('*')
        .eq('notification_id', notificationId.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('Notification', notificationId.value, this.notificationsTable);
      }

      return this.mapRowToNotification(data as NotificationRow);
    } catch (err) {
      logger.error('Failed to find notification by ID', err as Error, { notificationId: notificationId.value });
      throw err;
    }
  }

  /**
   * Finds all notifications matching the given filters.
   */
  async findAll(filters: NotificationQueryFilters): Promise<Notification[]> {
    try {
      logger.debug('Finding notifications with filters', { filters });

      let query = this.client.from(this.notificationsTable).select('*');

      if (filters.playerProfileId) {
        query = query.eq('player_profile_id', filters.playerProfileId);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.statuses && filters.statuses.length > 0) {
        query = query.in('status', filters.statuses);
      }
      if (filters.channel) {
        query = query.eq('channel', filters.channel);
      }
      if (filters.templateId) {
        query = query.eq('template_id', filters.templateId);
      }
      if (filters.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }
      if (filters.scheduledAfter) {
        query = query.gte('scheduled_at', filters.scheduledAfter.toISOString());
      }
      if (filters.scheduledBefore) {
        query = query.lte('scheduled_at', filters.scheduledBefore.toISOString());
      }

      if (filters.sortBy) {
        const orderColumn = this.mapSortField(filters.sortBy);
        query = query.order(orderColumn, { ascending: filters.sortOrder !== 'desc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit ?? 50) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to find notifications: ${error.message}`,
          entityType: 'Notification',
          table: this.notificationsTable,
          operation: 'SELECT',
          cause: error,
        });
      }

      return (data as NotificationRow[]).map((row) => this.mapRowToNotification(row));
    } catch (err) {
      logger.error('Failed to find notifications', err as Error, { filters });
      throw err;
    }
  }

  /**
   * Saves a notification (create or update).
   */
  async save(notification: Notification): Promise<Notification> {
    try {
      logger.debug('Saving notification', { notificationId: notification.notificationId.value });

      const row = this.notificationToRow(notification);

      const { data, error } = await this.client
        .from(this.notificationsTable)
        .upsert(row, { onConflict: 'notification_id' })
        .select()
        .single();

      if (error) {
        throw new RepositoryError({
          message: `Failed to save notification: ${error.message}`,
          entityType: 'Notification',
          table: this.notificationsTable,
          operation: 'UPSERT',
          cause: error,
        });
      }

      return this.mapRowToNotification(data as NotificationRow);
    } catch (err) {
      logger.error('Failed to save notification', err as Error, { notificationId: notification.notificationId.value });
      throw err;
    }
  }

  /**
   * Deletes a notification by ID.
   */
  async delete(notificationId: NotificationId): Promise<boolean> {
    try {
      logger.debug('Deleting notification', { notificationId: notificationId.value });

      const { error } = await this.client
        .from(this.notificationsTable)
        .delete()
        .eq('notification_id', notificationId.value);

      if (error) {
        throw new RepositoryError({
          message: `Failed to delete notification: ${error.message}`,
          entityType: 'Notification',
          table: this.notificationsTable,
          operation: 'DELETE',
          cause: error,
        });
      }

      return true;
    } catch (err) {
      logger.error('Failed to delete notification', err as Error, { notificationId: notificationId.value });
      throw err;
    }
  }

  /**
   * Updates the status of a notification.
   */
  async updateStatus(notificationId: NotificationId, status: NotificationStatus): Promise<Notification | null> {
    try {
      logger.debug('Updating notification status', { notificationId: notificationId.value, status });

      const updates: Record<string, unknown> = {
        status,
        metadata: {
          ...(await this.getNotificationMetadata(notificationId)),
          modifiedAt: new Date().toISOString(),
          previousStatus: (await this.findById(notificationId))?.status,
        },
      };

      if (status === NotificationStatus.SENT) {
        updates.sent_at = new Date().toISOString();
      }

      const { data, error } = await this.client
        .from(this.notificationsTable)
        .update(updates)
        .eq('notification_id', notificationId.value)
        .select()
        .single();

      if (error) {
        throw new RepositoryError({
          message: `Failed to update notification status: ${error.message}`,
          entityType: 'Notification',
          table: this.notificationsTable,
          operation: 'UPDATE',
          cause: error,
        });
      }

      return data ? this.mapRowToNotification(data as NotificationRow) : null;
    } catch (err) {
      logger.error('Failed to update notification status', err as Error, { notificationId: notificationId.value, status });
      throw err;
    }
  }

  /**
   * Counts notifications matching the given filters.
   */
  async count(filters: NotificationQueryFilters): Promise<number> {
    try {
      logger.debug('Counting notifications', { filters });

      let query = this.client.from(this.notificationsTable).select('*', { count: 'exact', head: true });

      if (filters.playerProfileId) {
        query = query.eq('player_profile_id', filters.playerProfileId);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.statuses && filters.statuses.length > 0) {
        query = query.in('status', filters.statuses);
      }
      if (filters.channel) {
        query = query.eq('channel', filters.channel);
      }
      if (filters.templateId) {
        query = query.eq('template_id', filters.templateId);
      }
      if (filters.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const { count, error } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to count notifications: ${error.message}`,
          entityType: 'Notification',
          table: this.notificationsTable,
          operation: 'SELECT',
          cause: error,
        });
      }

      return count ?? 0;
    } catch (err) {
      logger.error('Failed to count notifications', err as Error, { filters });
      throw err;
    }
  }

  // ==================== Template Operations ====================

  /**
   * Finds a template by ID.
   */
  async findTemplateById(templateId: TemplateId): Promise<NotificationTemplate | null> {
    try {
      logger.debug('Finding template by ID', { templateId: templateId.value });

      const { data, error } = await this.client
        .from(this.templatesTable)
        .select('*')
        .eq('template_id', templateId.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('NotificationTemplate', templateId.value, this.templatesTable);
      }

      return this.mapRowToTemplate(data as TemplateRow);
    } catch (err) {
      logger.error('Failed to find template by ID', err as Error, { templateId: templateId.value });
      throw err;
    }
  }

  /**
   * Finds a template by slug.
   */
  async findTemplateBySlug(slug: string): Promise<NotificationTemplate | null> {
    try {
      logger.debug('Finding template by slug', { slug });

      const { data, error } = await this.client
        .from(this.templatesTable)
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('NotificationTemplate', slug, this.templatesTable);
      }

      return this.mapRowToTemplate(data as TemplateRow);
    } catch (err) {
      logger.error('Failed to find template by slug', err as Error, { slug });
      throw err;
    }
  }

  /**
   * Finds all templates matching the given filters.
   */
  async findAllTemplates(filters: TemplateQueryFilters): Promise<NotificationTemplate[]> {
    try {
      logger.debug('Finding templates with filters', { filters });

      let query = this.client.from(this.templatesTable).select('*');

      if (filters.slug) {
        query = query.eq('slug', filters.slug);
      }
      if (filters.channel) {
        query = query.eq('channel', filters.channel);
      }
      if (filters.category) {
        query = query.eq('metadata->>category', filters.category);
      }
      if (filters.isActive !== undefined) {
        query = query.eq('metadata->>isActive', String(filters.isActive));
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.contains('metadata->>tags', filters.tags);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit ?? 50) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to find templates: ${error.message}`,
          entityType: 'NotificationTemplate',
          table: this.templatesTable,
          operation: 'SELECT',
          cause: error,
        });
      }

      return (data as TemplateRow[]).map((row) => this.mapRowToTemplate(row));
    } catch (err) {
      logger.error('Failed to find templates', err as Error, { filters });
      throw err;
    }
  }

  /**
   * Saves a template (create or update).
   */
  async saveTemplate(template: NotificationTemplate): Promise<NotificationTemplate> {
    try {
      logger.debug('Saving template', { templateId: template.templateId.value, slug: template.slug });

      const row = this.templateToRow(template);

      const { data, error } = await this.client
        .from(this.templatesTable)
        .upsert(row, { onConflict: 'template_id' })
        .select()
        .single();

      if (error) {
        throw new RepositoryError({
          message: `Failed to save template: ${error.message}`,
          entityType: 'NotificationTemplate',
          table: this.templatesTable,
          operation: 'UPSERT',
          cause: error,
        });
      }

      return this.mapRowToTemplate(data as TemplateRow);
    } catch (err) {
      logger.error('Failed to save template', err as Error, { templateId: template.templateId.value });
      throw err;
    }
  }

  /**
   * Deletes a template by ID.
   */
  async deleteTemplate(templateId: TemplateId): Promise<boolean> {
    try {
      logger.debug('Deleting template', { templateId: templateId.value });

      const { error } = await this.client
        .from(this.templatesTable)
        .delete()
        .eq('template_id', templateId.value);

      if (error) {
        throw new RepositoryError({
          message: `Failed to delete template: ${error.message}`,
          entityType: 'NotificationTemplate',
          table: this.templatesTable,
          operation: 'DELETE',
          cause: error,
        });
      }

      return true;
    } catch (err) {
      logger.error('Failed to delete template', err as Error, { templateId: templateId.value });
      throw err;
    }
  }

  // ==================== Channel Operations ====================

  /**
   * Finds a channel by ID.
   */
  async findChannelById(channelId: ChannelId): Promise<NotificationChannel | null> {
    try {
      logger.debug('Finding channel by ID', { channelId: channelId.value });

      const { data, error } = await this.client
        .from(this.channelsTable)
        .select('*')
        .eq('channel_id', channelId.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('NotificationChannel', channelId.value, this.channelsTable);
      }

      return this.mapRowToChannel(data as ChannelRow);
    } catch (err) {
      logger.error('Failed to find channel by ID', err as Error, { channelId: channelId.value });
      throw err;
    }
  }

  /**
   * Finds a channel by type.
   */
  async findChannelByType(channelType: NotificationChannelType): Promise<NotificationChannel | null> {
    try {
      logger.debug('Finding channel by type', { channelType });

      const { data, error } = await this.client
        .from(this.channelsTable)
        .select('*')
        .eq('channel_type', channelType)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('NotificationChannel', channelType, this.channelsTable);
      }

      return this.mapRowToChannel(data as ChannelRow);
    } catch (err) {
      logger.error('Failed to find channel by type', err as Error, { channelType });
      throw err;
    }
  }

  /**
   * Finds all channels matching the given filters.
   */
  async findAllChannels(filters: ChannelQueryFilters): Promise<NotificationChannel[]> {
    try {
      logger.debug('Finding channels with filters', { filters });

      let query = this.client.from(this.channelsTable).select('*');

      if (filters.channelType) {
        query = query.eq('channel_type', filters.channelType);
      }
      if (filters.isEnabled !== undefined) {
        query = query.eq('is_enabled', filters.isEnabled);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to find channels: ${error.message}`,
          entityType: 'NotificationChannel',
          table: this.channelsTable,
          operation: 'SELECT',
          cause: error,
        });
      }

      return (data as ChannelRow[]).map((row) => this.mapRowToChannel(row));
    } catch (err) {
      logger.error('Failed to find channels', err as Error, { filters });
      throw err;
    }
  }

  /**
   * Saves a channel (create or update).
   */
  async saveChannel(channel: NotificationChannel): Promise<NotificationChannel> {
    try {
      logger.debug('Saving channel', { channelId: channel.channelId.value, channelType: channel.channelType });

      const row = this.channelToRow(channel);

      const { data, error } = await this.client
        .from(this.channelsTable)
        .upsert(row, { onConflict: 'channel_id' })
        .select()
        .single();

      if (error) {
        throw new RepositoryError({
          message: `Failed to save channel: ${error.message}`,
          entityType: 'NotificationChannel',
          table: this.channelsTable,
          operation: 'UPSERT',
          cause: error,
        });
      }

      return this.mapRowToChannel(data as ChannelRow);
    } catch (err) {
      logger.error('Failed to save channel', err as Error, { channelId: channel.channelId.value });
      throw err;
    }
  }

  /**
   * Deletes a channel by ID.
   */
  async deleteChannel(channelId: ChannelId): Promise<boolean> {
    try {
      logger.debug('Deleting channel', { channelId: channelId.value });

      const { error } = await this.client
        .from(this.channelsTable)
        .delete()
        .eq('channel_id', channelId.value);

      if (error) {
        throw new RepositoryError({
          message: `Failed to delete channel: ${error.message}`,
          entityType: 'NotificationChannel',
          table: this.channelsTable,
          operation: 'DELETE',
          cause: error,
        });
      }

      return true;
    } catch (err) {
      logger.error('Failed to delete channel', err as Error, { channelId: channelId.value });
      throw err;
    }
  }

  // ==================== Helper Methods ====================

  private mapRowToNotification(row: NotificationRow): Notification {
    return Notification.fromDatabase({
      notification_id: row.notification_id,
      player_profile_id: row.player_profile_id,
      template_id: row.template_id,
      channel: row.channel,
      status: row.status,
      priority: row.priority,
      payload: row.payload as Notification['payload'],
      created_at: row.created_at,
      scheduled_at: row.scheduled_at,
      sent_at: row.sent_at,
      metadata: row.metadata as Notification['metadata'],
    });
  }

  private mapRowToTemplate(row: TemplateRow): NotificationTemplate {
    return NotificationTemplate.fromDatabase({
      template_id: row.template_id,
      slug: row.slug,
      title: row.title,
      body: row.body,
      variables: row.variables ?? [],
      channel: row.channel,
      metadata: row.metadata as NotificationTemplate['metadata'] | null,
    });
  }

  private mapRowToChannel(row: ChannelRow): NotificationChannel {
    return NotificationChannel.fromDatabase({
      channel_id: row.channel_id,
      channel_type: row.channel_type,
      is_enabled: row.is_enabled,
      configuration: row.configuration as NotificationChannel['configuration'] | null,
      metadata: row.metadata as NotificationChannel['metadata'] | null,
    });
  }

  private notificationToRow(notification: Notification): NotificationRow {
    return {
      notification_id: notification.notificationId.value,
      player_profile_id: notification.playerProfileId,
      template_id: notification.templateId.value,
      channel: notification.channel,
      status: notification.status,
      priority: notification.priority,
      payload: notification.payload as Record<string, unknown>,
      created_at: notification.createdAt.toISOString(),
      scheduled_at: notification.scheduledAt?.toISOString() ?? null,
      sent_at: notification.sentAt?.toISOString() ?? null,
      metadata: notification.metadata as Record<string, unknown>,
    };
  }

  private templateToRow(template: NotificationTemplate): TemplateRow {
    return {
      template_id: template.templateId.value,
      slug: template.slug,
      title: template.title,
      body: template.body,
      variables: template.variables,
      channel: template.channel,
      metadata: template.metadata as Record<string, unknown> | null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  private channelToRow(channel: NotificationChannel): ChannelRow {
    return {
      channel_id: channel.channelId.value,
      channel_type: channel.channelType,
      is_enabled: channel.isEnabled,
      configuration: channel.configuration as Record<string, unknown> | null,
      metadata: channel.metadata as Record<string, unknown> | null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  private mapSortField(field: string): string {
    const fieldMap: Record<string, string> = {
      createdAt: 'created_at',
      scheduledAt: 'scheduled_at',
      priority: 'priority',
    };
    return fieldMap[field] ?? 'created_at';
  }

  private async getNotificationMetadata(notificationId: NotificationId): Promise<Record<string, unknown>> {
    const { data } = await this.client
      .from(this.notificationsTable)
      .select('metadata')
      .eq('notification_id', notificationId.value)
      .single();

    return (data?.metadata as Record<string, unknown>) ?? {};
  }
}