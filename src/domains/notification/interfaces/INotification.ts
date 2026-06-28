/**
 * Notification Interface
 *
 * Interface defining the contract for Notification entity.
 * All Notification implementations must adhere to this interface.
 */

import type { NotificationId } from '../value-objects/NotificationId';
import type { TemplateId } from '../value-objects/TemplateId';
import type { NotificationChannelType } from '../types/NotificationChannelType';
import type { NotificationStatus } from '../types/NotificationStatus';
import type { NotificationPriority } from '../types/NotificationPriority';
import type { NotificationMetadata } from '../types/NotificationMetadata';

/**
 * Notification entity interface.
 * Represents a notification to be delivered to a player.
 */
export interface INotification {
  /** Unique notification identifier */
  readonly notificationId: NotificationId;

  /** Associated player profile ID */
  readonly playerProfileId: string;

  /** Template ID used for this notification */
  readonly templateId: TemplateId;

  /** Delivery channel */
  readonly channel: NotificationChannelType;

  /** Current status */
  readonly status: NotificationStatus;

  /** Priority level */
  readonly priority: NotificationPriority;

  /** Notification payload (template variables resolved) */
  readonly payload: NotificationPayload;

  /** Timestamp when notification was created */
  readonly createdAt: Date;

  /** Timestamp when notification is scheduled to be sent */
  readonly scheduledAt: Date | null;

  /** Timestamp when notification was actually sent */
  readonly sentAt: Date | null;

  /** Notification metadata */
  readonly metadata: NotificationMetadata;
}

/**
 * Notification payload interface.
 * Contains the resolved content for the notification.
 */
export interface NotificationPayload {
  /** Notification title */
  title: string;

  /** Notification body/message */
  body: string;

  /** Optional action button label */
  actionLabel?: string;

  /** Optional action URL */
  actionUrl?: string;

  /** Optional media URL (image, icon) */
  mediaUrl?: string;

  /** Additional key-value data */
  data?: Record<string, string>;
}