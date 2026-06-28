/**
 * Event Publisher Interface
 *
 * Contract for publishing domain events to the event bus.
 */

import type { DomainEvent } from '../entities/DomainEvent';
import type { PublishEventDto } from '../dto/PublishEventDto';
import type { PublishEventResponseDto } from '../dto/PublishEventDto';

/**
 * Event publisher interface.
 * Publishers are responsible for sending events to the event bus.
 */
export interface IEventPublisher {
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
   * Publishes multiple events in a batch.
   * @param events Array of domain events to publish
   * @returns Promise resolving to array of publish responses
   */
  publishBatch(events: DomainEvent[]): Promise<PublishEventResponseDto[]>;
}