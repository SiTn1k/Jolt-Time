/**
 * Notification Channel Interface
 *
 * Interface defining the contract for NotificationChannel entity.
 * All NotificationChannel implementations must adhere to this interface.
 */

import type { ChannelId } from '../value-objects/ChannelId';
import type { NotificationChannelType } from '../types/NotificationChannelType';

/**
 * NotificationChannel entity interface.
 * Represents a configured notification delivery channel.
 */
export interface INotificationChannel {
  /** Unique channel identifier */
  readonly channelId: ChannelId;

  /** Channel type */
  readonly channelType: NotificationChannelType;

  /** Whether this channel is enabled */
  readonly isEnabled: boolean;

  /** Channel-specific configuration */
  readonly configuration: NotificationChannelConfiguration;

  /** Channel metadata */
  readonly metadata: NotificationChannelMetadata;
}

/**
 * Notification channel configuration interface.
 * Channel-specific settings for delivery.
 */
export interface NotificationChannelConfiguration {
  /** Whether to enable batching */
  enableBatching?: boolean;

  /** Batch size for grouped delivery */
  batchSize?: number;

  /** Batch interval in milliseconds */
  batchIntervalMs?: number;

  /** Whether to retry failed deliveries */
  enableRetries?: boolean;

  /** Maximum retry attempts */
  maxRetries?: number;

  /** Retry delay in milliseconds */
  retryDelayMs?: number;

  /** Whether to track delivery receipts */
  trackReceipts?: boolean;

  /** Channel-specific settings */
  channelSpecific?: Record<string, unknown>;
}

/**
 * Notification channel metadata interface.
 */
export interface NotificationChannelMetadata {
  /** Human-readable channel name */
  name: string;

  /** Channel description */
  description?: string;

  /** Whether this is a system channel */
  isSystem?: boolean;

  /** Rate limit: max notifications per minute */
  rateLimitPerMinute?: number;

  /** Schema version for migrations */
  schemaVersion?: number;
}