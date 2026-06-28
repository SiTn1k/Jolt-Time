/**
 * Notification Created Event
 *
 * Domain event emitted when a new notification is created.
 */

import type { NotificationId } from '../value-objects/NotificationId';
import type { NotificationChannelType } from '../types/NotificationChannelType';
import type { NotificationPriority } from '../types/NotificationPriority';

/**
 * Event data for notification creation.
 */
export interface NotificationCreatedEventData {
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

  /** Timestamp when notification was created */
  occurredAt: Date;
}

/**
 * Domain event for notification creation.
 */
export interface NotificationCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'NotificationCreated';

  /** Event data */
  readonly data: NotificationCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a NotificationCreatedEvent.
 */
export function createNotificationCreatedEvent(params: {
  notificationId: NotificationId;
  playerProfileId: string;
  templateId: string;
  channel: NotificationChannelType;
  priority: NotificationPriority;
}): NotificationCreatedEvent {
  return {
    eventType: 'NotificationCreated',
    version: 1,
    data: {
      notificationId: params.notificationId.value,
      playerProfileId: params.playerProfileId,
      templateId: params.templateId,
      channel: params.channel,
      priority: params.priority,
      occurredAt: new Date(),
    },
  };
}