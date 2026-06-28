/**
 * Notification Entity
 *
 * Domain entity representing a notification to be delivered to a player.
 * Notifications are immutable - status changes create new instances.
 *
 * Notification Entity Responsibilities:
 * - Represent a notification message
 * - Track notification lifecycle status
 * - Store payload data for rendering
 * - Handle scheduling timestamps
 *
 * Notification Entity is NOT:
 * - A delivery mechanism
 * - A template
 * - A channel configuration
 */

import type { INotification, NotificationPayload } from '../interfaces/INotification';
import { NotificationId } from '../value-objects/NotificationId';
import { TemplateId } from '../value-objects/TemplateId';
import { NotificationChannelType } from '../types/NotificationChannelType';
import { NotificationStatus } from '../types/NotificationStatus';
import { NotificationPriority } from '../types/NotificationPriority';
import { NotificationMetadata } from '../types/NotificationMetadata';
import { NotificationStatusCategory, STATUS_TO_CATEGORY } from '../types/NotificationStatus';

/**
 * Notification entity class.
 * Immutable domain entity representing a notification.
 */
export class Notification implements INotification {
  /** Unique notification identifier */
  public readonly notificationId: NotificationId;

  /** Associated player profile ID */
  public readonly playerProfileId: string;

  /** Template ID used for this notification */
  public readonly templateId: TemplateId;

  /** Delivery channel */
  public readonly channel: NotificationChannelType;

  /** Current status */
  public readonly status: NotificationStatus;

  /** Priority level */
  public readonly priority: NotificationPriority;

  /** Notification payload (template variables resolved) */
  public readonly payload: NotificationPayload;

  /** Timestamp when notification was created */
  public readonly createdAt: Date;

  /** Timestamp when notification is scheduled to be sent */
  public readonly scheduledAt: Date | null;

  /** Timestamp when notification was actually sent */
  public readonly sentAt: Date | null;

  /** Notification metadata */
  public readonly metadata: NotificationMetadata;

  /**
   * Creates a new Notification instance.
   * @param props Notification properties
   */
  constructor(props: NotificationProps) {
    this.notificationId = props.notificationId;
    this.playerProfileId = props.playerProfileId;
    this.templateId = props.templateId;
    this.channel = props.channel;
    this.status = props.status;
    this.priority = props.priority;
    this.payload = props.payload;
    this.createdAt = props.createdAt;
    this.scheduledAt = props.scheduledAt ?? null;
    this.sentAt = props.sentAt ?? null;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new Notification for immediate delivery.
   * Factory method for creating notifications that should be sent now.
   */
  public static create(params: {
    notificationId: NotificationId;
    playerProfileId: string;
    templateId: TemplateId;
    channel: NotificationChannelType;
    priority: NotificationPriority;
    payload: NotificationPayload;
    metadata?: NotificationMetadata;
  }): Notification {
    const now = new Date();

    return new Notification({
      notificationId: params.notificationId,
      playerProfileId: params.playerProfileId,
      templateId: params.templateId,
      channel: params.channel,
      status: NotificationStatus.PENDING,
      priority: params.priority,
      payload: params.payload,
      createdAt: now,
      scheduledAt: null,
      sentAt: null,
      metadata: params.metadata ?? {},
    });
  }

  /**
   * Creates a new Notification scheduled for future delivery.
   * Factory method for scheduling notifications.
   */
  public static schedule(params: {
    notificationId: NotificationId;
    playerProfileId: string;
    templateId: TemplateId;
    channel: NotificationChannelType;
    priority: NotificationPriority;
    payload: NotificationPayload;
    scheduledAt: Date;
    metadata?: NotificationMetadata;
  }): Notification {
    const now = new Date();

    return new Notification({
      notificationId: params.notificationId,
      playerProfileId: params.playerProfileId,
      templateId: params.templateId,
      channel: params.channel,
      status: NotificationStatus.SCHEDULED,
      priority: params.priority,
      payload: params.payload,
      createdAt: now,
      scheduledAt: params.scheduledAt,
      sentAt: null,
      metadata: params.metadata ?? {},
    });
  }

  /**
   * Creates a Notification from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: NotificationRecord): Notification {
    return new Notification({
      notificationId: NotificationId.reconstruct(record.notification_id),
      playerProfileId: record.player_profile_id,
      templateId: TemplateId.reconstruct(record.template_id),
      channel: record.channel as NotificationChannelType,
      status: record.status as NotificationStatus,
      priority: record.priority as NotificationPriority,
      payload: record.payload,
      createdAt: new Date(record.created_at),
      scheduledAt: record.scheduled_at ? new Date(record.scheduled_at) : null,
      sentAt: record.sent_at ? new Date(record.sent_at) : null,
      metadata: record.metadata ?? {},
    });
  }

  /**
   * Gets the status category for this notification.
   */
  public get statusCategory(): NotificationStatusCategory {
    return STATUS_TO_CATEGORY[this.status];
  }

  /**
   * Checks if this notification is in a terminal state.
   */
  public get isTerminal(): boolean {
    return this.statusCategory === NotificationStatusCategory.TERMINAL ||
           this.statusCategory === NotificationStatusCategory.CANCELLED;
  }

  /**
   * Creates a copy with updated status.
   * Returns a new Notification instance with the new status.
   */
  public withStatus(newStatus: NotificationStatus): Notification {
    return new Notification({
      notificationId: this.notificationId,
      playerProfileId: this.playerProfileId,
      templateId: this.templateId,
      channel: this.channel,
      status: newStatus,
      priority: this.priority,
      payload: this.payload,
      createdAt: this.createdAt,
      scheduledAt: this.scheduledAt,
      sentAt: newStatus === NotificationStatus.SENT ? new Date() : this.sentAt,
      metadata: {
        ...this.metadata,
        modifiedAt: new Date().toISOString(),
      },
    });
  }

  /**
   * Serializes the Notification to a plain object.
   */
  public toJSON(): NotificationJSON {
    return {
      notificationId: this.notificationId.value,
      playerProfileId: this.playerProfileId,
      templateId: this.templateId.value,
      channel: this.channel,
      status: this.status,
      priority: this.priority,
      payload: this.payload,
      createdAt: this.createdAt.toISOString(),
      scheduledAt: this.scheduledAt?.toISOString() ?? null,
      sentAt: this.sentAt?.toISOString() ?? null,
      metadata: this.metadata,
    };
  }
}

/**
 * Notification properties interface for constructor.
 */
export interface NotificationProps {
  notificationId: NotificationId;
  playerProfileId: string;
  templateId: TemplateId;
  channel: NotificationChannelType;
  status: NotificationStatus;
  priority: NotificationPriority;
  payload: NotificationPayload;
  createdAt: Date;
  scheduledAt: Date | null;
  sentAt: Date | null;
  metadata: NotificationMetadata;
}

/**
 * Database record representation of Notification.
 */
export interface NotificationRecord {
  notification_id: string;
  player_profile_id: string;
  template_id: string;
  channel: string;
  status: string;
  priority: number;
  payload: NotificationPayload;
  created_at: string;
  scheduled_at: string | null;
  sent_at: string | null;
  metadata: NotificationMetadata;
}

/**
 * JSON serialization representation of Notification.
 */
export interface NotificationJSON {
  notificationId: string;
  playerProfileId: string;
  templateId: string;
  channel: NotificationChannelType;
  status: NotificationStatus;
  priority: NotificationPriority;
  payload: NotificationPayload;
  createdAt: string;
  scheduledAt: string | null;
  sentAt: string | null;
  metadata: NotificationMetadata;
}