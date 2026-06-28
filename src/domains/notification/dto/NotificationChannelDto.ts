/**
 * Notification Channel DTO
 *
 * Data transfer object for notification channel data.
 */

import type { NotificationChannelType } from '../types/NotificationChannelType';
import type { NotificationChannelConfiguration, NotificationChannelMetadata } from '../interfaces/INotificationChannel';

/**
 * Input for creating a notification channel.
 */
export interface CreateNotificationChannelDto {
  /** Channel type */
  channelType: NotificationChannelType;

  /** Whether this channel is enabled (optional, defaults to true) */
  isEnabled?: boolean;

  /** Channel-specific configuration */
  configuration?: Partial<NotificationChannelConfiguration>;

  /** Channel metadata */
  metadata?: Partial<NotificationChannelMetadata>;
}

/**
 * Input for updating a notification channel.
 */
export interface UpdateNotificationChannelDto {
  /** Whether this channel is enabled */
  isEnabled?: boolean;

  /** Channel-specific configuration */
  configuration?: Partial<NotificationChannelConfiguration>;

  /** Channel metadata */
  metadata?: Partial<NotificationChannelMetadata>;
}

/**
 * Query parameters for channel search.
 */
export interface QueryNotificationChannelDto {
  /** Filter by channel type */
  channelType?: NotificationChannelType;

  /** Filter by enabled status */
  isEnabled?: boolean;

  /** Maximum number of results (default 50) */
  limit?: number;
}