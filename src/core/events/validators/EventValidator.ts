/**
 * Event Validator
 *
 * Validates domain events and event-related data.
 */

import type { DomainEvent } from '../entities/DomainEvent';
import type { PublishEventDto } from '../dto/PublishEventDto';
import type { EventSource } from '../types/EventSource';
import { EventSource as EventSourceEnum } from '../types/EventSource';
import { EventType } from '../value-objects/EventType';
import { AggregateId } from '../value-objects/AggregateId';
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
 * Event validator class.
 * Validates domain events and event DTOs.
 */
export class EventValidator {
  /**
   * Validates a domain event.
   */
  public validateEvent(event: DomainEvent): ValidationResult {
    const errors: string[] = [];

    if (!event.eventId) {
      errors.push('Event ID is required');
    }

    if (!event.eventType) {
      errors.push('Event type is required');
    } else {
      try {
        EventType.create(event.eventType.value);
      } catch {
        errors.push(`Invalid event type format: ${event.eventType.value}`);
      }
    }

    if (!event.aggregateId) {
      errors.push('Aggregate ID is required');
    }

    if (!event.aggregateType || event.aggregateType.trim().length === 0) {
      errors.push('Aggregate type is required');
    }

    if (!event.sourceModule) {
      errors.push('Source module is required');
    }

    if (!event.occurredAt) {
      errors.push('Occurred at timestamp is required');
    }

    if (!event.payload || typeof event.payload !== 'object') {
      errors.push('Event payload must be a valid object');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a PublishEventDto.
   */
  public validatePublishDto(dto: PublishEventDto): ValidationResult {
    const errors: string[] = [];

    if (!dto.eventType || dto.eventType.trim().length === 0) {
      errors.push('Event type is required');
    } else {
      try {
        EventType.create(dto.eventType);
      } catch {
        errors.push(`Invalid event type format: ${dto.eventType}`);
      }
    }

    if (!dto.aggregateId || dto.aggregateId.trim().length === 0) {
      errors.push('Aggregate ID is required');
    } else {
      try {
        AggregateId.create(dto.aggregateId);
      } catch {
        errors.push(`Invalid aggregate ID format: ${dto.aggregateId}`);
      }
    }

    if (!dto.aggregateType || dto.aggregateType.trim().length === 0) {
      errors.push('Aggregate type is required');
    }

    if (!dto.sourceModule) {
      errors.push('Source module is required');
    } else if (!this.isValidEventSource(dto.sourceModule)) {
      errors.push(`Invalid source module: ${dto.sourceModule}`);
    }

    if (!dto.payload || typeof dto.payload !== 'object') {
      errors.push('Event payload must be a valid object');
    }

    if (dto.priority !== undefined && (dto.priority < 0 || dto.priority > 3)) {
      errors.push('Priority must be between 0 and 3');
    }

    if (dto.maxRetries !== undefined && (dto.maxRetries < 0 || dto.maxRetries > 10)) {
      errors.push('Max retries must be between 0 and 10');
    }

    if (dto.timeoutMs !== undefined && dto.timeoutMs < 0) {
      errors.push('Timeout must be a positive number');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an event ID.
   */
  public validateEventId(eventId: string): ValidationResult {
    const errors: string[] = [];

    try {
      EventId.create(eventId);
    } catch (e) {
      errors.push(`Invalid event ID: ${eventId}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an event type string.
   */
  public validateEventType(eventType: string): ValidationResult {
    const errors: string[] = [];

    try {
      EventType.create(eventType);
    } catch (e) {
      errors.push(`Invalid event type format: ${eventType}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an aggregate ID.
   */
  public validateAggregateId(aggregateId: string): ValidationResult {
    const errors: string[] = [];

    try {
      AggregateId.create(aggregateId);
    } catch {
      errors.push(`Invalid aggregate ID: ${aggregateId}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Checks if the given source is a valid EventSource.
   */
  private isValidEventSource(source: EventSource): boolean {
    return Object.values(EventSourceEnum).includes(source);
  }
}