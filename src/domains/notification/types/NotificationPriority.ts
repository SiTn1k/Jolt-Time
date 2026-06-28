/**
 * Notification Priority
 *
 * Priority levels for notification processing and delivery.
 */

/**
 * Notification priority levels enum.
 * Higher priority notifications are processed first.
 */
export enum NotificationPriority {
  /** Low priority - batched delivery */
  LOW = 0,

  /** Normal priority - standard delivery */
  NORMAL = 1,

  /** High priority - expedited delivery */
  HIGH = 2,

  /** Critical priority - immediate delivery, may interrupt */
  CRITICAL = 3,

  /** System priority - internal notifications only */
  SYSTEM = 4,
}

/**
 * Notification priority configuration.
 */
export interface NotificationPriorityConfig {
  /** Priority level */
  priority: NotificationPriority;

  /** Human-readable label */
  label: string;

  /** Whether this priority bypasses quiet hours */
  bypassQuietHours: boolean;

  /** Whether this priority shows as urgent */
  isUrgent: boolean;
}

/**
 * Default priority configurations.
 */
export const NOTIFICATION_PRIORITY_CONFIGS: Record<NotificationPriority, NotificationPriorityConfig> = {
  [NotificationPriority.LOW]: {
    priority: NotificationPriority.LOW,
    label: 'Low',
    bypassQuietHours: false,
    isUrgent: false,
  },
  [NotificationPriority.NORMAL]: {
    priority: NotificationPriority.NORMAL,
    label: 'Normal',
    bypassQuietHours: false,
    isUrgent: false,
  },
  [NotificationPriority.HIGH]: {
    priority: NotificationPriority.HIGH,
    label: 'High',
    bypassQuietHours: true,
    isUrgent: false,
  },
  [NotificationPriority.CRITICAL]: {
    priority: NotificationPriority.CRITICAL,
    label: 'Critical',
    bypassQuietHours: true,
    isUrgent: true,
  },
  [NotificationPriority.SYSTEM]: {
    priority: NotificationPriority.SYSTEM,
    label: 'System',
    bypassQuietHours: true,
    isUrgent: false,
  },
};