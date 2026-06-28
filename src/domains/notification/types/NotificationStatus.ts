/**
 * Notification Status
 *
 * Status values for notification lifecycle tracking.
 */

/**
 * Notification status enum.
 * Tracks the lifecycle of a notification from creation to delivery.
 */
export enum NotificationStatus {
  /** Notification is queued but not yet processed */
  PENDING = 'Pending',

  /** Notification is scheduled for future delivery */
  SCHEDULED = 'Scheduled',

  /** Notification is currently being processed */
  PROCESSING = 'Processing',

  /** Notification has been sent successfully */
  SENT = 'Sent',

  /** Notification delivery failed */
  FAILED = 'Failed',

  /** Notification was cancelled before delivery */
  CANCELLED = 'Cancelled',

  /** Notification has expired and was not delivered */
  EXPIRED = 'Expired',
}

/**
 * Status categories for grouping.
 */
export enum NotificationStatusCategory {
  /** Notification is waiting to be processed */
  QUEUED = 'Queued',

  /** Notification is actively being processed */
  ACTIVE = 'Active',

  /** Notification has completed its lifecycle */
  TERMINAL = 'Terminal',

  /** Notification was cancelled */
  CANCELLED = 'Cancelled',
}

/**
 * Maps status to its category.
 */
export const STATUS_TO_CATEGORY: Record<NotificationStatus, NotificationStatusCategory> = {
  [NotificationStatus.PENDING]: NotificationStatusCategory.QUEUED,
  [NotificationStatus.SCHEDULED]: NotificationStatusCategory.QUEUED,
  [NotificationStatus.PROCESSING]: NotificationStatusCategory.ACTIVE,
  [NotificationStatus.SENT]: NotificationStatusCategory.TERMINAL,
  [NotificationStatus.FAILED]: NotificationStatusCategory.TERMINAL,
  [NotificationStatus.CANCELLED]: NotificationStatusCategory.CANCELLED,
  [NotificationStatus.EXPIRED]: NotificationStatusCategory.TERMINAL,
};

/**
 * Terminal statuses - once reached, notification lifecycle is complete.
 */
export const TERMINAL_STATUSES: NotificationStatus[] = [
  NotificationStatus.SENT,
  NotificationStatus.FAILED,
  NotificationStatus.CANCELLED,
  NotificationStatus.EXPIRED,
];

/**
 * Queued statuses - notification is waiting to be processed.
 */
export const QUEUED_STATUSES: NotificationStatus[] = [
  NotificationStatus.PENDING,
  NotificationStatus.SCHEDULED,
];