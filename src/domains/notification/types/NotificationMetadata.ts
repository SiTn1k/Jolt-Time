/**
 * Notification Metadata
 *
 * Additional metadata for notifications.
 */

/**
 * Notification metadata interface.
 * Stores optional, extensible metadata for notifications.
 */
export interface NotificationMetadata {
  /** Event type that triggered this notification */
  eventType?: string;

  /** Source system or module that created the notification */
  source?: string;

  /** Correlation ID for tracing */
  correlationId?: string;

  /** User ID who initiated the action (if different from recipient) */
  initiatedBy?: string;

  /** Campaign ID for marketing notifications */
  campaignId?: string;

  /** A/B test variant ID */
  variantId?: string;

  /** Custom metadata key-value pairs */
  customFields?: Record<string, string>;

  /** Timestamp when notification was created */
  createdVia?: 'system' | 'user_action' | 'scheduled_job' | 'api';

  /** Timestamp when notification was last modified */
  modifiedAt?: string;

  /** Schema version for migrations */
  schemaVersion?: number;

  /** Delivery state for internal tracking */
  deliveryState?: string;

  /** Source event ID that triggered this notification */
  sourceEventId?: string;

  /** Source event type that triggered this notification */
  sourceEvent?: string;

  /** Timestamp when notification was read */
  readAt?: string;

  /** Retry count for failed notifications */
  retryCount?: number;

  /** Timestamp of last retry attempt */
  lastRetryAt?: string;

  /** Reason for failure if notification failed */
  failureReason?: string;

  /** Previous status before current status */
  previousStatus?: string;

  /** Index signature for additional properties */
  [key: string]: unknown;
}

/**
 * Default notification metadata.
 */
export const DEFAULT_NOTIFICATION_METADATA: NotificationMetadata = {
  schemaVersion: 1,
};