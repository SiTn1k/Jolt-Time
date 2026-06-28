/**
 * Envelope Validator
 *
 * Validates event envelope data.
 */

import type { EventEnvelope } from '../entities/EventEnvelope';
import type { EventEnvelopeRecord } from '../entities/EventEnvelope';
import type { EventStatus } from '../types/EventStatus';
import { EventStatus as EventStatusEnum } from '../types/EventStatus';
import { EventId } from '../value-objects/EventId';

/**
 * Validation result type.
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;

  /** List of validation errors */
  errors: string[];
}

/**
 * Envelope validator class.
 * Validates event envelopes and envelope records.
 */
export class EnvelopeValidator {
  /**
   * Validates an event envelope.
   */
  public validateEnvelope(envelope: EventEnvelope): ValidationResult {
    const errors: string[] = [];

    if (!envelope.envelopeId) {
      errors.push('Envelope ID is required');
    }

    if (!envelope.eventId) {
      errors.push('Event ID is required');
    }

    if (!envelope.status) {
      errors.push('Status is required');
    } else if (!this.isValidEventStatus(envelope.status)) {
      errors.push(`Invalid status: ${envelope.status}`);
    }

    if (envelope.retryCount < 0) {
      errors.push('Retry count cannot be negative');
    }

    if (envelope.maxRetries < 0) {
      errors.push('Max retries cannot be negative');
    }

    if (envelope.retryCount > envelope.maxRetries) {
      errors.push('Retry count cannot exceed max retries');
    }

    if (!envelope.publishedAt) {
      errors.push('Published at timestamp is required');
    }

    if (envelope.processedAt && envelope.processingStartedAt) {
      if (envelope.processedAt < envelope.processingStartedAt) {
        errors.push('Processed at cannot be before processing started at');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an event envelope record.
   */
  public validateEnvelopeRecord(record: EventEnvelopeRecord): ValidationResult {
    const errors: string[] = [];

    if (!record.envelope_id || record.envelope_id.trim().length === 0) {
      errors.push('Envelope ID is required');
    } else {
      try {
        EventId.create(record.envelope_id);
      } catch {
        errors.push(`Invalid envelope ID format: ${record.envelope_id}`);
      }
    }

    if (!record.event_id || record.event_id.trim().length === 0) {
      errors.push('Event ID is required');
    } else {
      try {
        EventId.create(record.event_id);
      } catch {
        errors.push(`Invalid event ID format: ${record.event_id}`);
      }
    }

    if (!record.status) {
      errors.push('Status is required');
    } else if (!this.isValidEventStatus(record.status)) {
      errors.push(`Invalid status: ${record.status}`);
    }

    if (typeof record.retry_count !== 'number' || record.retry_count < 0) {
      errors.push('Retry count must be a non-negative number');
    }

    if (typeof record.max_retries !== 'number' || record.max_retries < 0) {
      errors.push('Max retries must be a non-negative number');
    }

    if (record.retry_count > record.max_retries) {
      errors.push('Retry count cannot exceed max retries');
    }

    if (!record.published_at) {
      errors.push('Published at timestamp is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an envelope status transition.
   */
  public validateStatusTransition(
    currentStatus: EventStatus,
    newStatus: EventStatus
  ): ValidationResult {
    const errors: string[] = [];

    const validTransitions: Record<EventStatus, EventStatus[]> = {
      [EventStatusEnum.PENDING]: [EventStatusEnum.PUBLISHED, EventStatusEnum.FAILED],
      [EventStatusEnum.PUBLISHED]: [EventStatusEnum.PROCESSING, EventStatusEnum.FAILED],
      [EventStatusEnum.PROCESSING]: [
        EventStatusEnum.PROCESSED,
        EventStatusEnum.FAILED,
        EventStatusEnum.RETRYING,
      ],
      [EventStatusEnum.PROCESSED]: [],
      [EventStatusEnum.FAILED]: [EventStatusEnum.RETRYING, EventStatusEnum.DEAD_LETTERED],
      [EventStatusEnum.RETRYING]: [EventStatusEnum.PROCESSING, EventStatusEnum.FAILED],
      [EventStatusEnum.DEAD_LETTERED]: [],
    };

    const allowedTransitions = validTransitions[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      errors.push(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Checks if the given status is a valid EventStatus.
   */
  private isValidEventStatus(status: EventStatus): boolean {
    return Object.values(EventStatusEnum).includes(status);
  }
}