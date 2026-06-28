/**
 * Notification Mapper
 *
 * Maps between Notification entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { Notification, type NotificationRecord } from '../entities/Notification';
import type { CreateNotificationDto, UpdateNotificationDto, QueryNotificationDto } from '../dto/NotificationDto';
import type { NotificationResponseDto, NotificationSummaryDto } from '../dto/NotificationResponse.dto';

/**
 * Mapper for converting between Notification entity and DTOs.
 */
export class NotificationMapper {
  /**
   * Converts a Notification entity to NotificationResponseDto.
   */
  public static toResponse(notification: Notification): NotificationResponseDto {
    return {
      notificationId: notification.notificationId.value,
      playerProfileId: notification.playerProfileId,
      templateId: notification.templateId.value,
      channel: notification.channel,
      status: notification.status,
      priority: notification.priority,
      payload: notification.payload,
      createdAt: notification.createdAt.toISOString(),
      scheduledAt: notification.scheduledAt?.toISOString() ?? null,
      sentAt: notification.sentAt?.toISOString() ?? null,
      metadata: notification.metadata,
    };
  }

  /**
   * Converts a Notification entity to NotificationSummaryDto.
   */
  public static toSummary(notification: Notification): NotificationSummaryDto {
    return {
      notificationId: notification.notificationId.value,
      title: notification.payload.title,
      channel: notification.channel,
      status: notification.status,
      priority: notification.priority,
      createdAt: notification.createdAt.toISOString(),
    };
  }

  /**
   * Converts an array of Notification entities to NotificationResponseDto array.
   */
  public static toResponseList(notifications: Notification[]): NotificationResponseDto[] {
    return notifications.map((notification) => this.toResponse(notification));
  }

  /**
   * Converts an array of Notification entities to NotificationSummaryDto array.
   */
  public static toSummaryList(notifications: Notification[]): NotificationSummaryDto[] {
    return notifications.map((notification) => this.toSummary(notification));
  }

  /**
   * Converts a CreateNotificationDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateNotificationDto): Omit<CreateNotificationDto, never> {
    return {
      playerProfileId: dto.playerProfileId,
      templateId: dto.templateId,
      channel: dto.channel,
      priority: dto.priority,
      payload: dto.payload,
      scheduledAt: dto.scheduledAt,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateNotificationDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateNotificationDto): Partial<Notification> {
    return {
      status: dto.status as Notification['status'],
      priority: dto.priority as Notification['priority'],
      payload: dto.payload,
      metadata: dto.metadata,
    } as Partial<Notification>;
  }

  /**
   * Converts a database record to Notification entity.
   */
  public static fromRecord(record: NotificationRecord): Notification {
    return Notification.fromDatabase(record);
  }

  /**
   * Converts a Notification entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(notification: Notification): Omit<NotificationRecord, never> {
    return {
      notification_id: notification.notificationId.value,
      player_profile_id: notification.playerProfileId,
      template_id: notification.templateId.value,
      channel: notification.channel,
      status: notification.status,
      priority: notification.priority,
      payload: notification.payload,
      created_at: notification.createdAt.toISOString(),
      scheduled_at: notification.scheduledAt?.toISOString() ?? null,
      sent_at: notification.sentAt?.toISOString() ?? null,
      metadata: notification.metadata,
    };
  }

  /**
   * Converts a QueryNotificationDto to repository query filters.
   */
  public static toQueryFilters(dto: QueryNotificationDto) {
    return {
      playerProfileId: dto.playerProfileId,
      status: dto.status,
      statuses: dto.statuses,
      channel: dto.channel,
      templateId: dto.templateId,
      createdAfter: dto.createdAfter ? new Date(dto.createdAfter) : undefined,
      createdBefore: dto.createdBefore ? new Date(dto.createdBefore) : undefined,
      limit: dto.limit ?? 50,
      offset: dto.offset ?? 0,
    };
  }
}