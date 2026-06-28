/**
 * Notification Scheduled Event
 *
 * Domain event emitted when a notification is scheduled for future delivery.
 */

import type { NotificationId } from '../value-objects/NotificationId';
import type { NotificationChannelType } from '../types/NotificationChannelType';
import type { NotificationPriority } from '../types/NotificationPriority';

/**
 * Event data for notification scheduling.
 */
export interface NotificationScheduledEventData {
  /** Notification ID */
  notificationId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Template ID */
  templateId: string;

  /** Delivery channel */
  channel: NotificationChannelType;

  /** Priority level */
  priority: NotificationPriority;

  /** Scheduled delivery time */
  scheduledAt: Date;

  /** Timestamp when notification was scheduled */
  occurredAt: Date;
}

/**
 * Domain event for notification scheduling.
 */
export interface NotificationScheduledEvent {
  /** Event type identifier */
  readonly eventType: 'NotificationScheduled';

  /** Event data */
  readonly data: NotificationScheduledEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a NotificationScheduledEvent.
 */
export function createNotificationScheduledEvent(params: {
  notificationId: NotificationId;
  playerProfileId: string;
  templateId: string;
  channel: NotificationChannelType;
  priority: NotificationPriority;
  scheduledAt: Date;
}): NotificationScheduledEvent {
  return {
    eventType: 'NotificationScheduled',
    version: 1,
    data: {
      notificationId: params.notificationId.value,
      playerProfileId: params.playerProfileId,
      templateId: params.templateId,
      channel: params.channel,
      priority: params.priority,
      scheduledAt: params.scheduledAt,
      occurredAt: new Date(),
    },
  };
}