/**
 * Event Handler Interface
 *
 * Contract for event handlers that process domain events.
 */

import type { DomainEvent } from '../entities/DomainEvent';
import type { EventType } from '../value-objects/EventType';
import type { HandlerId } from '../value-objects/HandlerId';

/**
 * Event handler interface.
 * All event handlers must implement this interface.
 */
export interface IEventHandler {
  /** Unique handler identifier */
  readonly handlerId: HandlerId;

  /** Event type this handler subscribes to */
  readonly eventType: EventType;

  /** Human-readable handler name */
  readonly handlerName: string;

  /**
   * Handles the given domain event.
   * @param event The domain event to handle
   * @returns Promise resolving to true if handled successfully
   */
  handle(event: DomainEvent): Promise<boolean>;

  /**
   * Checks if this handler can handle the given event type.
   * @param eventType The event type to check
   */
  canHandle(eventType: EventType): boolean;
}

/**
 * Event handler callback function type.
 */
export type EventHandlerCallback = (event: DomainEvent) => Promise<boolean>;

/**
 * Async event handler callback function type.
 */
export type AsyncEventHandlerCallback = (event: DomainEvent) => Promise<void>;