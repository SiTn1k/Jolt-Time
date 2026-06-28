/**
 * Notification Domain DTOs
 *
 * Exports all DTOs for the notification domain.
 */

export type { CreateNotificationDto, UpdateNotificationDto, QueryNotificationDto } from './NotificationDto';
export type {
  CreateNotificationTemplateDto,
  UpdateNotificationTemplateDto,
  QueryNotificationTemplateDto,
} from './NotificationTemplateDto';
export type {
  CreateNotificationChannelDto,
  UpdateNotificationChannelDto,
  QueryNotificationChannelDto,
} from './NotificationChannelDto';
export type {
  NotificationResponseDto,
  NotificationSummaryDto,
  NotificationTemplateResponseDto,
  NotificationTemplateSummaryDto,
  NotificationChannelResponseDto,
  PaginatedResponseDto,
} from './NotificationResponse.dto';