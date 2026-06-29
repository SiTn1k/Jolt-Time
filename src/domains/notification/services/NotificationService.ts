/**
 * Notification Service
 *
 * Core service for notification management including:
 * - Notification creation and scheduling
 * - Template rendering with variable replacement
 * - Delivery routing by channel
 * - Retry logic (memory-only)
 * - Inbox management
 *
 * This service ONLY:
 * - Creates notifications
 * - Formats messages
 * - Routes notifications
 * - Tracks delivery status
 *
 * This service MUST NOT:
 * - Modify Currency, Inventory, Museum, Academy, Quest, Achievement, Guild
 * - Grant Rewards
 * - Send actual messages (that's for infrastructure)
 */

import type { INotificationRepository } from '../interfaces/INotificationRepository';
import type { NotificationPayload } from '../interfaces/INotification';
import { Notification } from '../entities/Notification';
import { NotificationTemplate } from '../entities/NotificationTemplate';
import type { NotificationChannel } from '../entities/NotificationChannel';
import { NotificationId } from '../value-objects/NotificationId';
import { TemplateId } from '../value-objects/TemplateId';
import { NotificationStatus, TERMINAL_STATUSES } from '../types/NotificationStatus';
import { NotificationChannelType } from '../types/NotificationChannelType';
import { NotificationPriority } from '../types/NotificationPriority';
import { NotificationMetadata } from '../types/NotificationMetadata';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('NotificationService');

/**
 * Delivery state for notification lifecycle.
 */
export enum DeliveryState {
  CREATED = 'Created',
  SCHEDULED = 'Scheduled',
  QUEUED = 'Queued',
  SENDING = 'Sending',
  SENT = 'Sent',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
  READ = 'Read',
}

/**
 * Retry configuration for failed notifications.
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelayMs: number;
  failureReason?: string;
}

/**
 * Default retry configuration.
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelayMs: 5000,
};

/**
 * In-memory retry tracker.
 */
interface RetryTracker {
  notificationId: string;
  retryCount: number;
  lastRetryAt: Date;
  failureReason?: string;
}

/**
 * Template rendering result.
 */
export interface RenderedTemplate {
  title: string;
  body: string;
  usedVariables: string[];
  missingVariables: string[];
}

/**
 * Notification summary for inbox display.
 */
export interface NotificationSummary {
  notificationId: string;
  title: string;
  body: string;
  channel: NotificationChannelType;
  status: NotificationStatus;
  isRead: boolean;
  createdAt: Date;
  sentAt: Date | null;
}

/**
 * Inbox result with pagination.
 */
export interface InboxResult {
  notifications: NotificationSummary[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}

/**
 * Notification Service
 */
export class NotificationService {
  private readonly repository: INotificationRepository;
  private readonly retryTracker: Map<string, RetryTracker> = new Map();
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;

  constructor(
    repository: INotificationRepository,
    retryConfig: Partial<RetryConfig> = {}
  ) {
    this.repository = repository;
    this.maxRetries = retryConfig.maxRetries ?? DEFAULT_RETRY_CONFIG.maxRetries;
    this.retryDelayMs = retryConfig.retryDelayMs ?? DEFAULT_RETRY_CONFIG.retryDelayMs;
  }

  // ==================== Notification Creation ====================

  /**
   * Creates a new notification.
   */
  async createNotification(params: {
    playerProfileId: string;
    templateId: string;
    channel: NotificationChannelType;
    payload: NotificationPayload;
    priority?: NotificationPriority;
    metadata?: NotificationMetadata;
  }): Promise<Notification> {
    logger.debug('Creating notification', {
      playerProfileId: params.playerProfileId,
      templateId: params.templateId,
      channel: params.channel,
    });

    const notificationId = NotificationId.generate();
    const priority = params.priority ?? NotificationPriority.NORMAL;

    const notification = Notification.create({
      notificationId,
      playerProfileId: params.playerProfileId,
      templateId: TemplateId.reconstruct(params.templateId),
      channel: params.channel,
      priority,
      payload: params.payload,
      metadata: {
        ...params.metadata,
        deliveryState: DeliveryState.CREATED,
      },
    });

    await this.repository.save(notification);

    logger.info('Notification created', {
      notificationId: notificationId.value,
      playerProfileId: params.playerProfileId,
      channel: params.channel,
    });

    return notification;
  }

  /**
   * Creates a scheduled notification.
   */
  async scheduleNotification(params: {
    playerProfileId: string;
    templateId: string;
    channel: NotificationChannelType;
    payload: NotificationPayload;
    scheduledAt: Date;
    priority?: NotificationPriority;
    metadata?: NotificationMetadata;
  }): Promise<Notification> {
    logger.debug('Scheduling notification', {
      playerProfileId: params.playerProfileId,
      templateId: params.templateId,
      scheduledAt: params.scheduledAt.toISOString(),
    });

    const notificationId = NotificationId.generate();
    const priority = params.priority ?? NotificationPriority.NORMAL;

    const notification = Notification.schedule({
      notificationId,
      playerProfileId: params.playerProfileId,
      templateId: TemplateId.reconstruct(params.templateId),
      channel: params.channel,
      priority,
      payload: params.payload,
      scheduledAt: params.scheduledAt,
      metadata: {
        ...params.metadata,
        deliveryState: DeliveryState.SCHEDULED,
      },
    });

    await this.repository.save(notification);

    logger.info('Notification scheduled', {
      notificationId: notificationId.value,
      playerProfileId: params.playerProfileId,
      scheduledAt: params.scheduledAt.toISOString(),
    });

    return notification;
  }

  // ==================== Notification Retrieval ====================

  /**
   * Loads a notification by ID.
   */
  async loadNotification(notificationId: string): Promise<Notification | null> {
    return this.repository.findById(NotificationId.reconstruct(notificationId));
  }

  /**
   * Loads notifications for a player.
   */
  async loadNotificationsForPlayer(params: {
    playerProfileId: string;
    status?: NotificationStatus;
    limit?: number;
    offset?: number;
  }): Promise<Notification[]> {
    return this.repository.findAll({
      playerProfileId: params.playerProfileId,
      status: params.status,
      limit: params.limit ?? 50,
      offset: params.offset ?? 0,
    });
  }

  /**
   * Loads pending notifications for processing.
   */
  async loadPendingNotifications(limit: number = 100): Promise<Notification[]> {
    return this.repository.findAll({
      statuses: [NotificationStatus.PENDING, NotificationStatus.SCHEDULED],
      limit,
      sortBy: 'priority',
      sortOrder: 'desc',
    });
  }

  /**
   * Loads inbox for a player.
   */
  async loadInbox(params: {
    playerProfileId: string;
    limit?: number;
    offset?: number;
    includeRead?: boolean;
  }): Promise<InboxResult> {
    const limit = params.limit ?? 20;
    const offset = params.offset ?? 0;

    const notifications = await this.repository.findAll({
      playerProfileId: params.playerProfileId,
      limit: limit + 1,
      offset,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    const hasMore = notifications.length > limit;
    const resultNotifications = hasMore ? notifications.slice(0, limit) : notifications;

    const summaries: NotificationSummary[] = resultNotifications.map((n) => ({
      notificationId: n.notificationId.value,
      title: n.payload.title,
      body: n.payload.body,
      channel: n.channel,
      status: n.status,
      isRead: n.metadata?.readAt !== undefined,
      createdAt: n.createdAt,
      sentAt: n.sentAt,
    }));

    const unreadCount = summaries.filter((s) => !s.isRead).length;
    const total = await this.repository.count({
      playerProfileId: params.playerProfileId,
    });

    return {
      notifications: summaries,
      total,
      unreadCount,
      hasMore,
    };
  }

  /**
   * Gets notification summary for a player.
   */
  async getNotificationSummary(playerProfileId: string): Promise<{
    total: number;
    unread: number;
    byStatus: Record<string, number>;
    byChannel: Record<string, number>;
  }> {
    const notifications = await this.repository.findAll({
      playerProfileId,
      limit: 1000,
    });

    const byStatus: Record<string, number> = {};
    const byChannel: Record<string, number> = {};

    for (const notification of notifications) {
      byStatus[notification.status] = (byStatus[notification.status] ?? 0) + 1;
      byChannel[notification.channel] = (byChannel[notification.channel] ?? 0) + 1;
    }

    const unread = notifications.filter((n) => n.metadata?.readAt === undefined).length;

    return {
      total: notifications.length,
      unread,
      byStatus,
      byChannel,
    };
  }

  // ==================== Status Updates ====================

  /**
   * Marks a notification as scheduled.
   */
  async markScheduled(notificationId: string, scheduledAt: Date): Promise<Notification | null> {
    const notification = await this.repository.findById(NotificationId.reconstruct(notificationId));
    if (!notification) {
      return null;
    }

    const updated = notification.withStatus(NotificationStatus.SCHEDULED);
    return this.repository.save(updated);
  }

  /**
   * Marks a notification as sent.
   */
  async markSent(notificationId: string): Promise<Notification | null> {
    logger.debug('Marking notification as sent', { notificationId });

    const notification = await this.repository.findById(NotificationId.reconstruct(notificationId));
    if (!notification) {
      logger.warn('Notification not found for markSent', { notificationId });
      return null;
    }

    const updated = notification.withStatus(NotificationStatus.SENT);
    const saved = await this.repository.save(updated);

    this.retryTracker.delete(notificationId);

    logger.info('Notification marked as sent', { notificationId });

    return saved;
  }

  /**
   * Marks a notification as failed with retry support.
   */
  async markFailed(notificationId: string, failureReason?: string): Promise<Notification | null> {
    logger.debug('Marking notification as failed', { notificationId, failureReason });

    const notification = await this.repository.findById(NotificationId.reconstruct(notificationId));
    if (!notification) {
      logger.warn('Notification not found for markFailed', { notificationId });
      return null;
    }

    const tracker = this.getOrCreateRetryTracker(notificationId);
    tracker.retryCount++;
    tracker.lastRetryAt = new Date();
    tracker.failureReason = failureReason;

    if (tracker.retryCount >= this.maxRetries) {
      const updated = notification.withStatus(NotificationStatus.FAILED);
      const saved = await this.repository.save(updated);

      logger.warn('Notification failed permanently', {
        notificationId,
        retryCount: tracker.retryCount,
        failureReason,
      });

      this.retryTracker.delete(notificationId);
      return saved;
    }

    const metadata = {
      ...notification.metadata,
      retryCount: tracker.retryCount,
      lastRetryAt: tracker.lastRetryAt.toISOString(),
      failureReason: tracker.failureReason,
    };

    const updated = notification.withStatus(NotificationStatus.FAILED);
    const saved = await this.repository.save(updated);

    logger.info('Notification failed, will retry', {
      notificationId,
      retryCount: tracker.retryCount,
      maxRetries: this.maxRetries,
      failureReason,
    });

    return saved;
  }

  /**
   * Cancels a notification.
   */
  async cancel(notificationId: string): Promise<Notification | null> {
    logger.debug('Cancelling notification', { notificationId });

    const notification = await this.repository.findById(NotificationId.reconstruct(notificationId));
    if (!notification) {
      return null;
    }

    if (TERMINAL_STATUSES.includes(notification.status)) {
      logger.warn('Cannot cancel notification in terminal state', {
        notificationId,
        status: notification.status,
      });
      return notification;
    }

    const updated = notification.withStatus(NotificationStatus.CANCELLED);
    const saved = await this.repository.save(updated);

    this.retryTracker.delete(notificationId);

    logger.info('Notification cancelled', { notificationId });

    return saved;
  }

  /**
   * Archives old notifications.
   */
  async archive(params: {
    beforeDate: Date;
    status?: NotificationStatus;
    playerProfileId?: string;
  }): Promise<number> {
    logger.debug('Archiving notifications', params);

    const notifications = await this.repository.findAll({
      status: params.status ?? NotificationStatus.SENT,
      createdBefore: params.beforeDate,
      playerProfileId: params.playerProfileId,
      limit: 1000,
    });

    let archived = 0;
    for (const notification of notifications) {
      await this.repository.delete(notification.notificationId);
      archived++;
    }

    logger.info('Notifications archived', { count: archived });

    return archived;
  }

  // ==================== Retry Logic ====================

  /**
   * Checks if a notification can be retried.
   */
  canRetry(notificationId: string): boolean {
    const tracker = this.retryTracker.get(notificationId);
    if (!tracker) {
      return true;
    }
    return tracker.retryCount < this.maxRetries;
  }

  /**
   * Gets the retry count for a notification.
   */
  getRetryCount(notificationId: string): number {
    const tracker = this.retryTracker.get(notificationId);
    return tracker?.retryCount ?? 0;
  }

  /**
   * Resets retry state for a notification.
   */
  resetRetry(notificationId: string): void {
    this.retryTracker.delete(notificationId);
  }

  /**
   * Schedules a retry for a failed notification.
   */
  async scheduleRetry(notificationId: string): Promise<Notification | null> {
    if (!this.canRetry(notificationId)) {
      logger.warn('Cannot retry notification, max retries exceeded', { notificationId });
      return null;
    }

    const notification = await this.repository.findById(NotificationId.reconstruct(notificationId));
    if (!notification) {
      return null;
    }

    const updated = notification.withStatus(NotificationStatus.PENDING);
    return this.repository.save(updated);
  }

  /**
   * Gets pending retries.
   */
  getPendingRetries(): Array<{ notificationId: string; retryCount: number; delayMs: number }> {
    const now = Date.now();
    const pending: Array<{ notificationId: string; retryCount: number; delayMs: number }> = [];

    for (const [notificationId, tracker] of this.retryTracker) {
      const delaySinceLastRetry = now - tracker.lastRetryAt.getTime();
      if (delaySinceLastRetry >= this.retryDelayMs) {
        pending.push({
          notificationId,
          retryCount: tracker.retryCount,
          delayMs: this.retryDelayMs,
        });
      }
    }

    return pending;
  }

  // ==================== Template Rendering ====================

  /**
   * Renders a template with variables.
   */
  renderTemplate(
    template: NotificationTemplate,
    variables: Record<string, string>
  ): RenderedTemplate {
    const usedVariables: string[] = [];
    const missingVariables: string[] = [];

    for (const variable of template.variables) {
      if (variable in variables) {
        usedVariables.push(variable);
      } else {
        missingVariables.push(variable);
      }
    }

    const rendered = template.render(variables);

    return {
      title: rendered.title,
      body: rendered.body,
      usedVariables,
      missingVariables,
    };
  }

  /**
   * Validates that all required template variables are provided.
   */
  validateTemplateVariables(
    template: NotificationTemplate,
    variables: Record<string, string>
  ): { isValid: boolean; missingVariables: string[] } {
    const missing: string[] = [];

    for (const variable of template.variables) {
      if (!(variable in variables) || variables[variable].trim() === '') {
        missing.push(variable);
      }
    }

    return {
      isValid: missing.length === 0,
      missingVariables: missing,
    };
  }

  // ==================== Delivery Routing ====================

  /**
   * Routes a notification to the appropriate channel handler.
   * Returns channel routing info without actually sending.
   */
  routeNotification(notification: Notification): {
    channel: NotificationChannelType;
    handler: string;
    canDeliver: boolean;
    reason?: string;
  } {
    const channelHandlers: Record<NotificationChannelType, string> = {
      [NotificationChannelType.TELEGRAM]: 'TelegramHandler',
      [NotificationChannelType.IN_APP]: 'InAppHandler',
      [NotificationChannelType.TOAST]: 'ToastHandler',
      [NotificationChannelType.INBOX]: 'InboxHandler',
      [NotificationChannelType.PUSH]: 'PushHandler',
      [NotificationChannelType.SYSTEM]: 'SystemHandler',
    };

    const handler = channelHandlers[notification.channel] ?? 'UnknownHandler';
    const canDeliver = !TERMINAL_STATUSES.includes(notification.status);

    return {
      channel: notification.channel,
      handler,
      canDeliver,
      reason: canDeliver ? undefined : `Notification is in terminal state: ${notification.status}`,
    };
  }

  /**
   * Gets the delivery state for a notification.
   */
  getDeliveryState(notification: Notification): DeliveryState {
    const metadata = notification.metadata;

    if (metadata?.deliveryState) {
      return metadata.deliveryState as DeliveryState;
    }

    switch (notification.status) {
      case NotificationStatus.PENDING:
        return DeliveryState.CREATED;
      case NotificationStatus.SCHEDULED:
        return DeliveryState.SCHEDULED;
      case NotificationStatus.PROCESSING:
        return DeliveryState.SENDING;
      case NotificationStatus.SENT:
        return DeliveryState.SENT;
      case NotificationStatus.FAILED:
        return DeliveryState.FAILED;
      case NotificationStatus.CANCELLED:
        return DeliveryState.CANCELLED;
      default:
        return DeliveryState.CREATED;
    }
  }

  /**
   * Checks if a channel is enabled for delivery.
   */
  async isChannelEnabled(channelType: NotificationChannelType): Promise<boolean> {
    const channel = await this.repository.findChannelByType(channelType);
    return channel?.isEnabled ?? false;
  }

  /**
   * Gets channel configuration.
   */
  async getChannelConfig(channelType: NotificationChannelType): Promise<NotificationChannel | null> {
    return this.repository.findChannelByType(channelType);
  }

  // ==================== Batch Operations ====================

  /**
   * Processes pending notifications for delivery.
   */
  async processPendingNotifications(batchSize: number = 100): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
  }> {
    const pending = await this.loadPendingNotifications(batchSize);

    let processed = 0;
    let succeeded = 0;
    let failed = 0;
    let skipped = 0;

    for (const notification of pending) {
      if (notification.scheduledAt && notification.scheduledAt > new Date()) {
        skipped++;
        continue;
      }

      processed++;

      const route = this.routeNotification(notification);
      if (!route.canDeliver) {
        skipped++;
        continue;
      }

      if (notification.status === NotificationStatus.SCHEDULED) {
        const updated = notification.withStatus(NotificationStatus.PENDING);
        await this.repository.save(updated);
      }
    }

    return { processed, succeeded, failed: failed, skipped };
  }

  // ==================== Private Helpers ====================

  private getOrCreateRetryTracker(notificationId: string): RetryTracker {
    let tracker = this.retryTracker.get(notificationId);
    if (!tracker) {
      tracker = {
        notificationId,
        retryCount: 0,
        lastRetryAt: new Date(),
      };
      this.retryTracker.set(notificationId, tracker);
    }
    return tracker;
  }
}