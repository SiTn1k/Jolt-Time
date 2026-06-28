/**
 * Notification Response DTO
 *
 * Data transfer objects for API responses.
 */

import type { NotificationChannelType } from '../types/NotificationChannelType';
import type { NotificationStatus } from '../types/NotificationStatus';
import type { NotificationPriority } from '../types/NotificationPriority';
import type { NotificationMetadata } from '../types/NotificationMetadata';
import type { NotificationPayload } from '../interfaces/INotification';
import type { NotificationTemplateMetadata } from '../interfaces/INotificationTemplate';
import type { NotificationChannelMetadata, NotificationChannelConfiguration } from '../interfaces/INotificationChannel';

/**
 * Response DTO for a single notification.
 */
export interface NotificationResponseDto {
  /** Notification ID */
  notificationId: string;

  /** Associated player profile ID */
  playerProfileId: string;

  /** Template ID */
  templateId: string;

  /** Delivery channel */
  channel: NotificationChannelType;

  /** Current status */
  status: NotificationStatus;

  /** Priority level */
  priority: NotificationPriority;

  /** Notification payload */
  payload: NotificationPayload;

  /** Creation timestamp */
  createdAt: string;

  /** Scheduled delivery timestamp */
  scheduledAt: string | null;

  /** Actual delivery timestamp */
  sentAt: string | null;

  /** Notification metadata */
  metadata: NotificationMetadata;
}

/**
 * Summary DTO for notification lists.
 */
export interface NotificationSummaryDto {
  /** Notification ID */
  notificationId: string;

  /** Notification title */
  title: string;

  /** Delivery channel */
  channel: NotificationChannelType;

  /** Current status */
  status: NotificationStatus;

  /** Priority level */
  priority: NotificationPriority;

  /** Creation timestamp */
  createdAt: string;
}

/**
 * Response DTO for a notification template.
 */
export interface NotificationTemplateResponseDto {
  /** Template ID */
  templateId: string;

  /** Template slug */
  slug: string;

  /** Template title */
  title: string;

  /** Template body */
  body: string;

  /** Required variables */
  variables: string[];

  /** Target channel */
  channel: NotificationChannelType;

  /** Template metadata */
  metadata: NotificationTemplateMetadata;
}

/**
 * Summary DTO for template lists.
 */
export interface NotificationTemplateSummaryDto {
  /** Template ID */
  templateId: string;

  /** Template slug */
  slug: string;

  /** Template title */
  title: string;

  /** Target channel */
  channel: NotificationChannelType;

  /** Whether template is active */
  isActive: boolean;
}

/**
 * Response DTO for a notification channel.
 */
export interface NotificationChannelResponseDto {
  /** Channel ID */
  channelId: string;

  /** Channel type */
  channelType: NotificationChannelType;

  /** Whether channel is enabled */
  isEnabled: boolean;

  /** Channel configuration */
  configuration: NotificationChannelConfiguration;

  /** Channel metadata */
  metadata: NotificationChannelMetadata;
}

/**
 * Paginated response wrapper.
 */
export interface PaginatedResponseDto<T> {
  /** Array of items */
  items: T[];

  /** Total count of items */
  total: number;

  /** Current page offset */
  offset: number;

  /** Page limit */
  limit: number;

  /** Whether there are more items */
  hasMore: boolean;
}