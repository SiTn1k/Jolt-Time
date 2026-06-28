/**
 * Notification DTO
 *
 * Data transfer object for notification data.
 */

import type { NotificationChannelType } from '../types/NotificationChannelType';
import type { NotificationStatus } from '../types/NotificationStatus';
import type { NotificationPriority } from '../types/NotificationPriority';
import type { NotificationMetadata } from '../types/NotificationMetadata';
import type { NotificationPayload } from '../interfaces/INotification';

/**
 * Input for creating a notification.
 */
export interface CreateNotificationDto {
  /** Associated player profile ID */
  playerProfileId: string;

  /** Template ID for this notification */
  templateId: string;

  /** Delivery channel */
  channel: NotificationChannelType;

  /** Priority level (optional, defaults to NORMAL) */
  priority?: NotificationPriority;

  /** Notification payload */
  payload: NotificationPayload;

  /** Scheduled delivery time (optional) */
  scheduledAt?: string;

  /** Notification metadata (optional) */
  metadata?: NotificationMetadata;
}

/**
 * Input for updating a notification.
 */
export interface UpdateNotificationDto {
  /** New status */
  status?: NotificationStatus;

  /** New priority */
  priority?: NotificationPriority;

  /** New payload */
  payload?: NotificationPayload;

  /** New scheduled time */
  scheduledAt?: string;

  /** Updated metadata */
  metadata?: NotificationMetadata;
}

/**
 * Query parameters for notification search.
 */
export interface QueryNotificationDto {
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
  createdAfter?: string;

  /** Filter created before this date */
  createdBefore?: string;

  /** Maximum number of results (default 50) */
  limit?: number;

  /** Offset for pagination */
  offset?: number;
}