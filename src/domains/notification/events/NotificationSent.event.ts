/**
 * Notification Sent Event
 *
 * Domain event emitted when a notification has been successfully sent.
 */

import type { NotificationId } from '../value-objects/NotificationId';
import type { NotificationChannelType } from '../types/NotificationChannelType';

/**
 * Event data for notification sent.
 */
export interface NotificationSentEventData {
  /** Notification ID */
  notificationId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Delivery channel */
  channel: NotificationChannelType;

  /** Timestamp when notification was sent */
  sentAt: Date;

  /** Timestamp when event was created */
  occurredAt: Date;
}

/**
 * Domain event for notification sent.
 */
export interface NotificationSentEvent {
  /** Event type identifier */
  readonly eventType: 'NotificationSent';

  /** Event data */
  readonly data: NotificationSentEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a NotificationSentEvent.
 */
export function createNotificationSentEvent(params: {
  notificationId: NotificationId;
  playerProfileId: string;
  channel: NotificationChannelType;
}): NotificationSentEvent {
  const now = new Date();
  return {
    eventType: 'NotificationSent',
    version: 1,
    data: {
      notificationId: params.notificationId.value,
      playerProfileId: params.playerProfileId,
      channel: params.channel,
      sentAt: now,
      occurredAt: now,
    },
  };
}