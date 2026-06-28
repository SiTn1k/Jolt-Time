/**
 * Notification Failed Event
 *
 * Domain event emitted when a notification delivery has failed.
 */

import type { NotificationId } from '../value-objects/NotificationId';
import type { NotificationChannelType } from '../types/NotificationChannelType';

/**
 * Event data for notification failure.
 */
export interface NotificationFailedEventData {
  /** Notification ID */
  notificationId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Delivery channel */
  channel: NotificationChannelType;

  /** Error message describing the failure */
  errorMessage: string;

  /** Number of retry attempts made */
  retryCount: number;

  /** Timestamp when notification failed */
  occurredAt: Date;
}

/**
 * Domain event for notification failure.
 */
export interface NotificationFailedEvent {
  /** Event type identifier */
  readonly eventType: 'NotificationFailed';

  /** Event data */
  readonly data: NotificationFailedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a NotificationFailedEvent.
 */
export function createNotificationFailedEvent(params: {
  notificationId: NotificationId;
  playerProfileId: string;
  channel: NotificationChannelType;
  errorMessage: string;
  retryCount?: number;
}): NotificationFailedEvent {
  return {
    eventType: 'NotificationFailed',
    version: 1,
    data: {
      notificationId: params.notificationId.value,
      playerProfileId: params.playerProfileId,
      channel: params.channel,
      errorMessage: params.errorMessage,
      retryCount: params.retryCount ?? 0,
      occurredAt: new Date(),
    },
  };
}