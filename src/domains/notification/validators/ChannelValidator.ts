/**
 * Channel Validator
 *
 * Validates notification channel data and business rules.
 */

import type { CreateNotificationChannelDto } from '../dto/NotificationChannelDto';
import { NotificationChannelType } from '../types/NotificationChannelType';

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
 * ChannelValidator class.
 * Validates notification channel-related input data.
 */
export class ChannelValidator {
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  /**
   * Validates a CreateNotificationChannelDto.
   */
  public validateCreate(dto: CreateNotificationChannelDto): ValidationResult {
    const errors: string[] = [];

    // Validate channelType
    if (!dto.channelType) {
      errors.push('channelType is required');
    } else if (!this.isValidChannelType(dto.channelType)) {
      errors.push(`Invalid channel type: ${dto.channelType}`);
    }

    // Validate isEnabled (optional)
    if (dto.isEnabled !== undefined && typeof dto.isEnabled !== 'boolean') {
      errors.push('isEnabled must be a boolean');
    }

    // Validate configuration.batchSize (if provided)
    if (dto.configuration?.batchSize !== undefined) {
      if (typeof dto.configuration.batchSize !== 'number') {
        errors.push('configuration.batchSize must be a number');
      } else if (dto.configuration.batchSize < 1) {
        errors.push('configuration.batchSize must be at least 1');
      } else if (dto.configuration.batchSize > 10000) {
        errors.push('configuration.batchSize must not exceed 10000');
      }
    }

    // Validate configuration.batchIntervalMs (if provided)
    if (dto.configuration?.batchIntervalMs !== undefined) {
      if (typeof dto.configuration.batchIntervalMs !== 'number') {
        errors.push('configuration.batchIntervalMs must be a number');
      } else if (dto.configuration.batchIntervalMs < 1000) {
        errors.push('configuration.batchIntervalMs must be at least 1000');
      } else if (dto.configuration.batchIntervalMs > 3600000) {
        errors.push('configuration.batchIntervalMs must not exceed 3600000 (1 hour)');
      }
    }

    // Validate configuration.maxRetries (if provided)
    if (dto.configuration?.maxRetries !== undefined) {
      if (typeof dto.configuration.maxRetries !== 'number') {
        errors.push('configuration.maxRetries must be a number');
      } else if (dto.configuration.maxRetries < 0) {
        errors.push('configuration.maxRetries must be non-negative');
      } else if (dto.configuration.maxRetries > 10) {
        errors.push('configuration.maxRetries must not exceed 10');
      }
    }

    // Validate configuration.retryDelayMs (if provided)
    if (dto.configuration?.retryDelayMs !== undefined) {
      if (typeof dto.configuration.retryDelayMs !== 'number') {
        errors.push('configuration.retryDelayMs must be a number');
      } else if (dto.configuration.retryDelayMs < 1000) {
        errors.push('configuration.retryDelayMs must be at least 1000');
      } else if (dto.configuration.retryDelayMs > 300000) {
        errors.push('configuration.retryDelayMs must not exceed 300000 (5 minutes)');
      }
    }

    // Validate metadata.name (if provided in metadata)
    if (dto.metadata?.name !== undefined) {
      if (typeof dto.metadata.name !== 'string') {
        errors.push('metadata.name must be a string');
      } else if (dto.metadata.name.length > 128) {
        errors.push('metadata.name must not exceed 128 characters');
      }
    }

    // Validate metadata.rateLimitPerMinute (if provided)
    if (dto.metadata?.rateLimitPerMinute !== undefined) {
      if (typeof dto.metadata.rateLimitPerMinute !== 'number') {
        errors.push('metadata.rateLimitPerMinute must be a number');
      } else if (dto.metadata.rateLimitPerMinute < 1) {
        errors.push('metadata.rateLimitPerMinute must be at least 1');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a channel ID format.
   */
  public validateChannelId(id: string): ValidationResult {
    const errors: string[] = [];

    if (!id) {
      errors.push('Channel ID is required');
    } else if (!ChannelValidator.UUID_REGEX.test(id)) {
      errors.push('Channel ID must be a valid UUID');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a channel type.
   */
  public validateChannelType(channelType: NotificationChannelType): ValidationResult {
    const errors: string[] = [];

    if (!channelType) {
      errors.push('Channel type is required');
    } else if (!this.isValidChannelType(channelType)) {
      errors.push(`Invalid channel type: ${channelType}`);
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
}