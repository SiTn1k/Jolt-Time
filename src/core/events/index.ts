/**
 * Event Bus Foundation
 *
 * Central event bus system for domain event communication.
 * The Event Bus is the ONLY communication mechanism between domains.
 * Domains MUST NOT call each other directly.
 *
 * @example
 * // Publishing an event
 * const event = DomainEvent.create({
 *   eventType: EventType.create('PlayerProfile.Created'),
 *   aggregateId: AggregateId.create(playerProfile.id.value),
 *   aggregateType: 'PlayerProfile',
 *   sourceModule: EventSource.PLAYER_PROFILE,
 *   payload: { profileId: playerProfile.id.value }
 * });
 *
 * await eventBus.publish(event);
 */

// Core entities
export { DomainEvent } from './entities/DomainEvent';
export type {
  DomainEventProps,
  DomainEventRecord,
  DomainEventJSON,
} from './entities/DomainEvent';
export { EventEnvelope } from './entities/EventEnvelope';
export type {
  EventEnvelopeProps,
  EventEnvelopeMetadata,
  EventEnvelopeRecord,
} from './entities/EventEnvelope';
export { EventHandler } from './entities/EventHandler';
export type {
  EventHandlerProps,
  EventHandlerMetadata,
  EventHandlerRecord,
} from './entities/EventHandler';
export { DEFAULT_HANDLER_METADATA } from './entities/EventHandler';

// Value objects
export { EventId } from './value-objects/EventId';
export { EventType } from './value-objects/EventType';
export { AggregateId } from './value-objects/AggregateId';
export { HandlerId } from './value-objects/HandlerId';

// Types
export { EventStatus } from './types/EventStatus';
export { EventPriority, EVENT_PRIORITY_CONSTRAINTS } from './types/EventPriority';
export { EventSource } from './types/EventSource';
export type { EventMetadataCore, EventMetadataExtended } from './types/EventMetadata';
export { DEFAULT_EVENT_METADATA, DEFAULT_EXTENDED_EVENT_METADATA } from './types/EventMetadata';
export type { EventStatistics, EventTypeStatistics } from './types/EventStatistics';
export { INITIAL_EVENT_STATISTICS } from './types/EventStatistics';

// DTOs
export type { DomainEventDto, DomainEventMetadataDto } from './dto/DomainEventDto';
export type { PublishEventDto, PublishEventResponseDto } from './dto/PublishEventDto';
export type { EventEnvelopeDto, EventEnvelopeSummaryDto } from './dto/EventEnvelopeDto';
export type {
  EventResponseDto,
  EventProcessingResult,
  EventErrorDetails,
  EventStatisticsResponseDto,
  EventListResponseDto,
} from './dto/EventResponseDto';

// Interfaces
export type { IDomainEvent, EventData } from './interfaces/IDomainEvent';
export type {
  IEventHandler,
  EventHandlerCallback,
  AsyncEventHandlerCallback,
} from './interfaces/IEventHandler';
export type { IEventPublisher } from './interfaces/IEventPublisher';
export type { IEventSubscriber } from './interfaces/IEventSubscriber';
export type { IEventBus } from './interfaces/IEventBus';

// Validators
export { EventValidator } from './validators/EventValidator';
export type { ValidationResult as EventValidationResult } from './validators/EventValidator';
export { EnvelopeValidator } from './validators/EnvelopeValidator';
export type { ValidationResult as EnvelopeValidationResult } from './validators/EnvelopeValidator';
export { HandlerValidator } from './validators/HandlerValidator';
export type { ValidationResult as HandlerValidationResult } from './validators/HandlerValidator';

// Mappers
export { EventMapper } from './mappers/EventMapper';
export { EnvelopeMapper } from './mappers/EnvelopeMapper';

// Core events
export type { EventPublishedEvent, EventPublishedEventData } from './events/EventPublished.event';
export { createEventPublishedEvent } from './events/EventPublished.event';
export type { EventReceivedEvent, EventReceivedEventData } from './events/EventReceived.event';
export { createEventReceivedEvent } from './events/EventReceived.event';
export type { EventProcessedEvent, EventProcessedEventData } from './events/EventProcessed.event';
export { createEventProcessedEvent } from './events/EventProcessed.event';
export type { EventFailedEvent, EventFailedEventData } from './events/EventFailed.event';
export { createEventFailedEvent } from './events/EventFailed.event';
export type { EventRetriedEvent, EventRetriedEventData } from './events/EventRetried.event';
export { createEventRetriedEvent } from './events/EventRetried.event';

// Repositories
export { InMemoryEventBus } from './repositories/InMemoryEventBus';

// DI
export { EVENT_BUS_TOKENS, registerEventBusDependencies, setupEventBusDomain } from './di';