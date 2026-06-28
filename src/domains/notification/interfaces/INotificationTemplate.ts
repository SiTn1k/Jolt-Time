/**
 * Notification Template Interface
 *
 * Interface defining the contract for NotificationTemplate entity.
 * All NotificationTemplate implementations must adhere to this interface.
 */

import type { TemplateId } from '../value-objects/TemplateId';
import type { NotificationChannelType } from '../types/NotificationChannelType';

/**
 * NotificationTemplate entity interface.
 * Represents a reusable notification template.
 */
export interface INotificationTemplate {
  /** Unique template identifier */
  readonly templateId: TemplateId;

  /** Human-readable template slug */
  readonly slug: string;

  /** Default notification title */
  readonly title: string;

  /** Default notification body */
  readonly body: string;

  /** List of variable names used in the template */
  readonly variables: string[];

  /** Target delivery channel */
  readonly channel: NotificationChannelType;

  /** Template metadata */
  readonly metadata: NotificationTemplateMetadata;
}

/**
 * Notification template metadata interface.
 */
export interface NotificationTemplateMetadata {
  /** Human-readable template name */
  name: string;

  /** Template description */
  description?: string;

  /** Template category (e.g., 'marketing', 'transactional', 'system') */
  category: string;

  /** Whether this template is active */
  isActive: boolean;

  /** Default priority for notifications using this template */
  defaultPriority?: number;

  /** Maximum age before template expires (in days) */
  expiresInDays?: number;

  /** Tags for categorization */
  tags?: string[];

  /** Schema version for migrations */
  schemaVersion?: number;
}