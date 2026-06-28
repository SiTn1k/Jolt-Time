/**
 * Notification Statistics
 *
 * Statistics tracking for notification analytics.
 */

/**
 * Notification statistics interface.
 * Tracks delivery and engagement metrics for notifications.
 */
export interface NotificationStatistics {
  /** Number of delivery attempts */
  deliveryAttempts: number;

  /** Number of successful deliveries */
  successfulDeliveries: number;

  /** Number of failed deliveries */
  failedDeliveries: number;

  /** Timestamp of first delivery attempt */
  firstAttemptAt?: string;

  /** Timestamp of successful delivery */
  deliveredAt?: string;

  /** Whether notification was read/viewed */
  isRead: boolean;

  /** Timestamp when notification was read */
  readAt?: string;

  /** Whether notification was clicked/interacted with */
  isClicked: boolean;

  /** Timestamp of first click/interaction */
  clickedAt?: string;

  /** Whether notification was dismissed */
  isDismissed: boolean;

  /** Timestamp when notification was dismissed */
  dismissedAt?: string;
}

/**
 * Initial notification statistics.
 */
export const INITIAL_NOTIFICATION_STATISTICS: NotificationStatistics = {
  deliveryAttempts: 0,
  successfulDeliveries: 0,
  failedDeliveries: 0,
  isRead: false,
  isClicked: false,
  isDismissed: false,
};

/**
 * Aggregated notification statistics for reporting.
 */
export interface NotificationStatisticsSummary {
  /** Total notifications sent */
  totalSent: number;

  /** Total notifications pending */
  totalPending: number;

  /** Total notifications failed */
  totalFailed: number;

  /** Delivery rate as percentage */
  deliveryRate: number;

  /** Open rate as percentage (for read notifications) */
  openRate: number;

  /** Click rate as percentage */
  clickRate: number;

  /** Average delivery time in milliseconds */
  avgDeliveryTimeMs: number;
}