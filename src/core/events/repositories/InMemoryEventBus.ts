/**
 * In-Memory Event Bus
 *
 * In-memory implementation of the event bus.
 * Skeleton implementation - all methods throw Error with NotImplementedError message.
 * Full implementation in P-178.2.
 */

import type { IEventBus } from '../interfaces/IEventBus';
import type { DomainEvent } from '../entities/DomainEvent';
import type { EventEnvelope } from '../entities/EventEnvelope';
import type { IEventHandler } from '../interfaces/IEventHandler';
import type { EventType } from '../value-objects/EventType';
import type { PublishEventDto } from '../dto/PublishEventDto';
import type { PublishEventResponseDto } from '../dto/PublishEventDto';
import type { EventStatistics } from '../types/EventStatistics';
import type { EventStatus } from '../types/EventStatus';

/**
 * Error class for not yet implemented methods.
 */
class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
  }
}

/**
 * In-memory event bus implementation.
 * This is a skeleton - all methods throw NotImplementedError.
 */
export class InMemoryEventBus implements IEventBus {
  /**
   * Publishes a domain event to the event bus.
   */
  public async publish(_event: DomainEvent): Promise<PublishEventResponseDto> {
    throw new NotImplementedError('Event publishing is not yet implemented');
  }

  /**
   * Publishes an event from a DTO.
   */
  public async publishFromDto(_dto: PublishEventDto): Promise<PublishEventResponseDto> {
    throw new NotImplementedError('Event publishing is not yet implemented');
  }

  /**
   * Subscribes a handler to an event type.
   */
  public subscribe(_eventType: EventType, _handler: IEventHandler): void {
    throw new NotImplementedError('Event subscription is not yet implemented');
  }

  /**
   * Unsubscribes a handler from an event type.
   */
  public unsubscribe(_eventType: EventType, _handlerId: string): void {
    throw new NotImplementedError('Event unsubscription is not yet implemented');
  }

  /**
   * Unsubscribes all handlers from an event type.
   */
  public unsubscribeAll(_eventType: EventType): void {
    throw new NotImplementedError('Event unsubscription is not yet implemented');
  }

  /**
   * Gets all handlers for a given event type.
   */
  public getHandlers(_eventType: EventType): IEventHandler[] {
    throw new NotImplementedError('Handler retrieval is not yet implemented');
  }

  /**
   * Checks if there are handlers for a given event type.
   */
  public hasHandlers(_eventType: EventType): boolean {
    throw new NotImplementedError('Handler check is not yet implemented');
  }

  /**
   * Starts the event bus processing.
   */
  public async start(): Promise<void> {
    throw new NotImplementedError('Event bus startup is not yet implemented');
  }

  /**
   * Stops the event bus processing.
   */
  public async stop(): Promise<void> {
    throw new NotImplementedError('Event bus shutdown is not yet implemented');
  }

  /**
   * Gets the current event statistics.
   */
  public async getStatistics(): Promise<EventStatistics> {
    throw new NotImplementedError('Statistics retrieval is not yet implemented');
  }

  /**
   * Gets envelopes by status.
   */
  public async getEnvelopesByStatus(_status: EventStatus): Promise<EventEnvelope[]> {
    throw new NotImplementedError('Envelope retrieval is not yet implemented');
  }

  /**
   * Gets an envelope by ID.
   */
  public async getEnvelope(_envelopeId: string): Promise<EventEnvelope | null> {
    throw new NotImplementedError('Envelope retrieval is not yet implemented');
  }

  /**
   * Clears all pending events.
   */
  public async clearPending(): Promise<void> {
    throw new NotImplementedError('Event clearing is not yet implemented');
  }
}