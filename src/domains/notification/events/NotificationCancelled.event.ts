/**
 * Notification Cancelled Event
 *
 * Domain event emitted when a notification has been cancelled.
 */

import type { NotificationId } from '../value-objects/NotificationId';
import type { NotificationChannelType } from '../types/NotificationChannelType';

/**
 * Event data for notification cancellation.
 */
export interface NotificationCancelledEventData {
  /** Notification ID */
  notificationId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Delivery channel */
  channel: NotificationChannelType;

  /** Reason for cancellation */
  reason?: string;

  /** Timestamp when notification was cancelled */
  occurredAt: Date;
}

/**
 * Domain event for notification cancellation.
 */
export interface NotificationCancelledEvent {
  /** Event type identifier */
  readonly eventType: 'NotificationCancelled';

  /** Event data */
  readonly data: NotificationCancelledEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a NotificationCancelledEvent.
 */
export function createNotificationCancelledEvent(params: {
  notificationId: NotificationId;
  playerProfileId: string;
  channel: NotificationChannelType;
  reason?: string;
}): NotificationCancelledEvent {
  return {
    eventType: 'NotificationCancelled',
    version: 1,
    data: {
      notificationId: params.notificationId.value,
      playerProfileId: params.playerProfileId,
      channel: params.channel,
      reason: params.reason,
      occurredAt: new Date(),
    },
  };
}