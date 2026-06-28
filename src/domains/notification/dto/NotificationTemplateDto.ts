/**
 * Notification Template DTO
 *
 * Data transfer object for notification template data.
 */

import type { NotificationChannelType } from '../types/NotificationChannelType';
import type { NotificationTemplateMetadata } from '../interfaces/INotificationTemplate';

/**
 * Input for creating a notification template.
 */
export interface CreateNotificationTemplateDto {
  /** Human-readable template slug */
  slug: string;

  /** Default notification title */
  title: string;

  /** Default notification body */
  body: string;

  /** Target delivery channel */
  channel: NotificationChannelType;

  /** List of variable names (optional, auto-extracted if not provided) */
  variables?: string[];

  /** Template metadata */
  metadata?: Partial<NotificationTemplateMetadata>;
}

/**
 * Input for updating a notification template.
 */
export interface UpdateNotificationTemplateDto {
  /** Default notification title */
  title?: string;

  /** Default notification body */
  body?: string;

  /** List of variable names */
  variables?: string[];

  /** Template metadata */
  metadata?: Partial<NotificationTemplateMetadata>;
}

/**
 * Query parameters for template search.
 */
export interface QueryNotificationTemplateDto {
  /** Filter by slug */
  slug?: string;

  /** Filter by channel */
  channel?: NotificationChannelType;

  /** Filter by category */
  category?: string;

  /** Filter by active status */
  isActive?: boolean;

  /** Filter by tags */
  tags?: string[];

  /** Maximum number of results (default 50) */
  limit?: number;

  /** Offset for pagination */
  offset?: number;
}