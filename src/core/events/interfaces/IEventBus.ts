/**
 * Event Bus Interface
 *
 * Main contract for the event bus system.
 * The event bus is the central communication mechanism between domains.
 */

import type { DomainEvent } from '../entities/DomainEvent';
import type { EventEnvelope } from '../entities/EventEnvelope';
import type { IEventSubscriber } from './IEventSubscriber';
import type { IEventHandler } from './IEventHandler';
import type { EventType } from '../value-objects/EventType';
import type { PublishEventDto } from '../dto/PublishEventDto';
import type { PublishEventResponseDto } from '../dto/PublishEventDto';
import type { EventStatistics } from '../types/EventStatistics';
import type { EventStatus } from '../types/EventStatus';

/**
 * Event bus interface.
 * Central system for publishing and subscribing to domain events.
 */
export interface IEventBus extends IEventSubscriber {
  /**
   * Publishes a domain event to the event bus.
   * @param event The domain event to publish
   * @returns Promise resolving to publish response
   */
  publish(event: DomainEvent): Promise<PublishEventResponseDto>;

  /**
   * Publishes an event from a DTO.
   * @param dto The publish event DTO
   * @returns Promise resolving to publish response
   */
  publishFromDto(dto: PublishEventDto): Promise<PublishEventResponseDto>;

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
   * Starts the event bus processing.
   * This method initializes the event processing pipeline.
   */
  start(): Promise<void>;

  /**
   * Stops the event bus processing.
   * This method gracefully shuts down the event processing pipeline.
   */
  stop(): Promise<void>;

  /**
   * Gets the current event statistics.
   * @returns Promise resolving to event statistics
   */
  getStatistics(): Promise<EventStatistics>;

  /**
   * Gets envelopes by status.
   * @param status The status to filter by
   * @returns Promise resolving to array of envelopes
   */
  getEnvelopesByStatus(status: EventStatus): Promise<EventEnvelope[]>;

  /**
   * Gets an envelope by ID.
   * @param envelopeId The envelope ID
   * @returns Promise resolving to envelope or null
   */
  getEnvelope(envelopeId: string): Promise<EventEnvelope | null>;

  /**
   * Clears all pending events (use with caution).
   */
  clearPending(): Promise<void>;
}