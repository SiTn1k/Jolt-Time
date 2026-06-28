/**
 * Handler Validator
 *
 * Validates event handler data.
 */

import type { EventHandler } from '../entities/EventHandler';
import type { EventHandlerRecord } from '../entities/EventHandler';
import { HandlerId } from '../value-objects/HandlerId';
import { EventType } from '../value-objects/EventType';
import { EventPriority, EVENT_PRIORITY_CONSTRAINTS } from '../types/EventPriority';

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
 * Handler validator class.
 * Validates event handlers and handler records.
 */
export class HandlerValidator {
  /**
   * Validates an event handler.
   */
  public validateHandler(handler: EventHandler): ValidationResult {
    const errors: string[] = [];

    if (!handler.handlerId) {
      errors.push('Handler ID is required');
    }

    if (!handler.eventType) {
      errors.push('Event type is required');
    } else {
      try {
        EventType.create(handler.eventType.value);
      } catch {
        errors.push(`Invalid event type format: ${handler.eventType.value}`);
      }
    }

    if (!handler.handlerName || handler.handlerName.trim().length === 0) {
      errors.push('Handler name is required');
    }

    if (handler.handlerName.length > 64) {
      errors.push('Handler name cannot exceed 64 characters');
    }

    if (!this.isValidPriority(handler.priority)) {
      errors.push(`Invalid priority: ${handler.priority}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an event handler record.
   */
  public validateHandlerRecord(record: EventHandlerRecord): ValidationResult {
    const errors: string[] = [];

    if (!record.handler_id || record.handler_id.trim().length === 0) {
      errors.push('Handler ID is required');
    } else {
      try {
        HandlerId.create(record.handler_id);
      } catch {
        errors.push(`Invalid handler ID format: ${record.handler_id}`);
      }
    }

    if (!record.event_type || record.event_type.trim().length === 0) {
      errors.push('Event type is required');
    } else {
      try {
        EventType.create(record.event_type);
      } catch {
        errors.push(`Invalid event type format: ${record.event_type}`);
      }
    }

    if (!record.handler_name || record.handler_name.trim().length === 0) {
      errors.push('Handler name is required');
    }

    if (record.handler_name.length > 64) {
      errors.push('Handler name cannot exceed 64 characters');
    }

    if (!this.isValidPriority(record.priority)) {
      errors.push(`Invalid priority: ${record.priority}`);
    }

    if (!Array.isArray(record.tags)) {
      errors.push('Tags must be an array');
    }

    if (typeof record.enabled !== 'boolean') {
      errors.push('Enabled must be a boolean');
    }

    if (typeof record.asynchronous !== 'boolean') {
      errors.push('Asynchronous must be a boolean');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a handler ID.
   */
  public validateHandlerId(handlerId: string): ValidationResult {
    const errors: string[] = [];

    try {
      HandlerId.create(handlerId);
    } catch {
      errors.push(`Invalid handler ID format: ${handlerId}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates handler priority.
   */
  public validatePriority(priority: number): ValidationResult {
    const errors: string[] = [];

    if (!this.isValidPriority(priority)) {
      errors.push(
        `Priority must be between ${EVENT_PRIORITY_CONSTRAINTS.MIN_PRIORITY} and ${EVENT_PRIORITY_CONSTRAINTS.MAX_PRIORITY}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Checks if the given priority is valid.
   */
  private isValidPriority(priority: number): boolean {
    return (
      priority >= EVENT_PRIORITY_CONSTRAINTS.MIN_PRIORITY &&
      priority <= EVENT_PRIORITY_CONSTRAINTS.MAX_PRIORITY
    );
  }
}