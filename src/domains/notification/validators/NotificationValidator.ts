/**
 * Notification Validator
 *
 * Validates notification data and business rules.
 */

import type { CreateNotificationDto } from '../dto/NotificationDto';
import { NotificationChannelType } from '../types/NotificationChannelType';
import { NotificationStatus } from '../types/NotificationStatus';
import { NotificationPriority } from '../types/NotificationPriority';

/**
 * Validation result with error messages.
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;

  /** List of validation errors */
  errors: string[];
}

/**
 * NotificationValidator class.
 * Validates notification-related input data.
 */
export class NotificationValidator {
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  /**
   * Validates a CreateNotificationDto.
   */
  public validateCreate(dto: CreateNotificationDto): ValidationResult {
    const errors: string[] = [];

    // Validate playerProfileId
    if (!dto.playerProfileId) {
      errors.push('playerProfileId is required');
    } else if (!NotificationValidator.UUID_REGEX.test(dto.playerProfileId)) {
      errors.push('playerProfileId must be a valid UUID');
    }

    // Validate templateId
    if (!dto.templateId) {
      errors.push('templateId is required');
    } else if (!NotificationValidator.UUID_REGEX.test(dto.templateId)) {
      errors.push('templateId must be a valid UUID');
    }

    // Validate channel
    if (!dto.channel) {
      errors.push('channel is required');
    } else if (!this.isValidChannelType(dto.channel)) {
      errors.push(`Invalid channel type: ${dto.channel}`);
    }

    // Validate payload
    if (!dto.payload) {
      errors.push('payload is required');
    } else {
      if (!dto.payload.title || dto.payload.title.trim().length === 0) {
        errors.push('payload.title is required and cannot be empty');
      }
      if (dto.payload.title && dto.payload.title.length > 255) {
        errors.push('payload.title must not exceed 255 characters');
      }
      if (!dto.payload.body || dto.payload.body.trim().length === 0) {
        errors.push('payload.body is required and cannot be empty');
      }
      if (dto.payload.body && dto.payload.body.length > 2000) {
        errors.push('payload.body must not exceed 2000 characters');
      }
    }

    // Validate priority (optional)
    if (dto.priority !== undefined) {
      if (!this.isValidPriority(dto.priority)) {
        errors.push(`Invalid priority: ${dto.priority}`);
      }
    }

    // Validate scheduledAt (optional)
    if (dto.scheduledAt) {
      const scheduledDate = new Date(dto.scheduledAt);
      if (isNaN(scheduledDate.getTime())) {
        errors.push('scheduledAt must be a valid ISO 8601 date string');
      } else if (scheduledDate <= new Date()) {
        errors.push('scheduledAt must be in the future');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a notification ID format.
   */
  public validateNotificationId(id: string): ValidationResult {
    const errors: string[] = [];

    if (!id) {
      errors.push('Notification ID is required');
    } else if (!NotificationValidator.UUID_REGEX.test(id)) {
      errors.push('Notification ID must be a valid UUID');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a player profile ID format.
   */
  public validatePlayerProfileId(playerProfileId: string): ValidationResult {
    const errors: string[] = [];

    if (!playerProfileId) {
      errors.push('Player profile ID is required');
    } else if (!NotificationValidator.UUID_REGEX.test(playerProfileId)) {
      errors.push('Player profile ID must be a valid UUID');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a notification status transition.
   */
  public validateStatusTransition(
    currentStatus: NotificationStatus,
    newStatus: NotificationStatus
  ): ValidationResult {
    const errors: string[] = [];

    // Define valid transitions
    const validTransitions: Record<NotificationStatus, NotificationStatus[]> = {
      [NotificationStatus.PENDING]: [
        NotificationStatus.PROCESSING,
        NotificationStatus.CANCELLED,
      ],
      [NotificationStatus.SCHEDULED]: [
        NotificationStatus.PENDING,
        NotificationStatus.PROCESSING,
        NotificationStatus.CANCELLED,
      ],
      [NotificationStatus.PROCESSING]: [
        NotificationStatus.SENT,
        NotificationStatus.FAILED,
        NotificationStatus.CANCELLED,
      ],
      [NotificationStatus.SENT]: [], // Terminal state
      [NotificationStatus.FAILED]: [
        NotificationStatus.PENDING,
        NotificationStatus.CANCELLED,
      ], // Can retry or cancel
      [NotificationStatus.CANCELLED]: [], // Terminal state
      [NotificationStatus.EXPIRED]: [], // Terminal state
    };

    const allowedTransitions = validTransitions[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      errors.push(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Checks if a channel type is valid.
   */
  private isValidChannelType(channel: string): boolean {
    const validChannels: NotificationChannelType[] = [
      NotificationChannelType.TELEGRAM,
      NotificationChannelType.IN_APP,
      NotificationChannelType.TOAST,
      NotificationChannelType.INBOX,
      NotificationChannelType.PUSH,
      NotificationChannelType.SYSTEM,
    ];
    return validChannels.includes(channel as NotificationChannelType);
  }

  /**
   * Checks if a priority is valid.
   */
  private isValidPriority(priority: number): boolean {
    return Object.values(NotificationPriority).includes(priority as NotificationPriority);
  }
}