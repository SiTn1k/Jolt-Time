/**
 * Event Subscriber Interface
 *
 * Contract for subscribing to domain events from the event bus.
 */

import type { DomainEvent } from '../entities/DomainEvent';
import type { EventType } from '../value-objects/EventType';
import type { IEventHandler } from './IEventHandler';

/**
 * Event subscriber interface.
 * Subscribers register handlers for specific event types.
 */
export interface IEventSubscriber {
  /**
   * Subscribes a handler to an event type.
   * @param eventType The event type to subscribe to
   * @param handler The handler to register
   */
  subscribe(eventType: EventType, handler: IEventHandler): void;

  /**
   * Unsubscribes a handler from an event type.
   * @param eventType The event type to unsubscribe from
   * @param handlerId The handler ID to remove
   */
  unsubscribe(eventType: EventType, handlerId: string): void;

  /**
   * Unsubscribes all handlers from an event type.
   * @param eventType The event type to unsubscribe from
   */
  unsubscribeAll(eventType: EventType): void;

  /**
   * Gets all handlers for a given event type.
   * @param eventType The event type to get handlers for
   * @returns Array of handlers
   */
  getHandlers(eventType: EventType): IEventHandler[];

  /**
   * Checks if there are handlers for a given event type.
   * @param eventType The event type to check
   */
  hasHandlers(eventType: EventType): boolean;
}