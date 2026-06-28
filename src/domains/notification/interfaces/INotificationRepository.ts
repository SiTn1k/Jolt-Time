/**
 * Notification Repository Interface
 *
 * Interface defining the contract for notification data access.
 * All notification repository implementations must adhere to this interface.
 */

import type { Notification } from '../entities/Notification';
import type { NotificationTemplate } from '../entities/NotificationTemplate';
import type { NotificationChannel } from '../entities/NotificationChannel';
import type { NotificationId } from '../value-objects/NotificationId';
import type { TemplateId } from '../value-objects/TemplateId';
import type { ChannelId } from '../value-objects/ChannelId';
import type { NotificationStatus } from '../types/NotificationStatus';
import type { NotificationChannelType } from '../types/NotificationChannelType';

/**
 * Query filters for notification search.
 */
export interface NotificationQueryFilters {
  /** Filter by player profile ID */
  playerProfileId?: string;

  /** Filter by status */
  status?: NotificationStatus;

  /** Filter by multiple statuses */
  statuses?: NotificationStatus[];

  /** Filter by channel */
  channel?: NotificationChannelType;

  /** Filter by template ID */
  templateId?: string;

  /** Filter created after this date */
  createdAfter?: Date;

  /** Filter created before this date */
  createdBefore?: Date;

  /** Filter scheduled after this date */
  scheduledAfter?: Date;

  /** Filter scheduled before this date */
  scheduledBefore?: Date;

  /** Maximum number of results */
  limit?: number;

  /** Offset for pagination */
  offset?: number;

  /** Sort by field */
  sortBy?: 'createdAt' | 'scheduledAt' | 'priority';

  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Query filters for template search.
 */
export interface TemplateQueryFilters {
  /** Filter by slug */
  slug?: string;

  /** Filter by channel */
  channel?: NotificationChannelType;

  /** Filter by category */
  category?: string;

  /** Filter by active status */
  isActive?: boolean;

  /** Filter by tags */
  tags?: string[];

  /** Maximum number of results */
  limit?: number;

  /** Offset for pagination */
  offset?: number;
}

/**
 * Query filters for channel search.
 */
export interface ChannelQueryFilters {
  /** Filter by channel type */
  channelType?: NotificationChannelType;

  /** Filter by enabled status */
  isEnabled?: boolean;

  /** Maximum number of results */
  limit?: number;
}

/**
 * Notification repository interface.
 * Defines data access operations for notifications.
 */
export interface INotificationRepository {
  // Notification operations

  /**
   * Finds a notification by ID.
   * @param notificationId The notification ID
   * @returns The notification or null if not found
   */
  findById(notificationId: NotificationId): Promise<Notification | null>;

  /**
   * Finds all notifications matching the given filters.
   * @param filters Query filters
   * @returns Array of matching notifications
   */
  findAll(filters: NotificationQueryFilters): Promise<Notification[]>;

  /**
   * Saves a notification (create or update).
   * @param notification The notification to save
   * @returns The saved notification
   */
  save(notification: Notification): Promise<Notification>;

  /**
   * Deletes a notification by ID.
   * @param notificationId The notification ID
   * @returns true if deleted, false if not found
   */
  delete(notificationId: NotificationId): Promise<boolean>;

  /**
   * Updates the status of a notification.
   * @param notificationId The notification ID
   * @param status The new status
   * @returns The updated notification or null if not found
   */
  updateStatus(notificationId: NotificationId, status: NotificationStatus): Promise<Notification | null>;

  /**
   * Counts notifications matching the given filters.
   * @param filters Query filters
   * @returns Count of matching notifications
   */
  count(filters: NotificationQueryFilters): Promise<number>;

  // Template operations

  /**
   * Finds a template by ID.
   * @param templateId The template ID
   * @returns The template or null if not found
   */
  findTemplateById(templateId: TemplateId): Promise<NotificationTemplate | null>;

  /**
   * Finds a template by slug.
   * @param slug The template slug
   * @returns The template or null if not found
   */
  findTemplateBySlug(slug: string): Promise<NotificationTemplate | null>;

  /**
   * Finds all templates matching the given filters.
   * @param filters Query filters
   * @returns Array of matching templates
   */
  findAllTemplates(filters: TemplateQueryFilters): Promise<NotificationTemplate[]>;

  /**
   * Saves a template (create or update).
   * @param template The template to save
   * @returns The saved template
   */
  saveTemplate(template: NotificationTemplate): Promise<NotificationTemplate>;

  /**
   * Deletes a template by ID.
   * @param templateId The template ID
   * @returns true if deleted, false if not found
   */
  deleteTemplate(templateId: TemplateId): Promise<boolean>;

  // Channel operations

  /**
   * Finds a channel by ID.
   * @param channelId The channel ID
   * @returns The channel or null if not found
   */
  findChannelById(channelId: ChannelId): Promise<NotificationChannel | null>;

  /**
   * Finds a channel by type.
   * @param channelType The channel type
   * @returns The channel or null if not found
   */
  findChannelByType(channelType: NotificationChannelType): Promise<NotificationChannel | null>;

  /**
   * Finds all channels matching the given filters.
   * @param filters Query filters
   * @returns Array of matching channels
   */
  findAllChannels(filters: ChannelQueryFilters): Promise<NotificationChannel[]>;

  /**
   * Saves a channel (create or update).
   * @param channel The channel to save
   * @returns The saved channel
   */
  saveChannel(channel: NotificationChannel): Promise<NotificationChannel>;

  /**
   * Deletes a channel by ID.
   * @param channelId The channel ID
   * @returns true if deleted, false if not found
   */
  deleteChannel(channelId: ChannelId): Promise<boolean>;
}