/**
 * Event Bus Domain Dependency Injection Registration
 *
 * Registers all Event Bus services with the DI container.
 */

import { Container } from '../di';
import { InMemoryEventBus } from './repositories/InMemoryEventBus';
import { EventMapper } from './mappers/EventMapper';
import { EnvelopeMapper } from './mappers/EnvelopeMapper';
import { EventValidator } from './validators/EventValidator';
import { EnvelopeValidator } from './validators/EnvelopeValidator';
import { HandlerValidator } from './validators/HandlerValidator';

/**
 * Event Bus DI configuration keys.
 */
export const EVENT_BUS_TOKENS = {
  EVENT_BUS: Symbol.for('IEventBus'),
  EVENT_MAPPER: Symbol.for('EventMapper'),
  ENVELOPE_MAPPER: Symbol.for('EnvelopeMapper'),
  EVENT_VALIDATOR: Symbol.for('EventValidator'),
  ENVELOPE_VALIDATOR: Symbol.for('EnvelopeValidator'),
  HANDLER_VALIDATOR: Symbol.for('HandlerValidator'),
} as const;

/**
 * Register all Event Bus dependencies with the container.
 */
export function registerEventBusDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(EventValidator, new EventValidator());
  container.registerInstance(EnvelopeValidator, new EnvelopeValidator());
  container.registerInstance(HandlerValidator, new HandlerValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(EventMapper, new EventMapper());
  container.registerInstance(EnvelopeMapper, new EnvelopeMapper());

  // Event Bus (Singleton)
  container.registerInstance(InMemoryEventBus, new InMemoryEventBus());
}

/**
 * Quick setup function for Event Bus domain.
 * Creates and configures all Event Bus components.
 */
export function setupEventBusDomain(): {
  eventBus: InMemoryEventBus;
  eventMapper: EventMapper;
  envelopeMapper: EnvelopeMapper;
  eventValidator: EventValidator;
  envelopeValidator: EnvelopeValidator;
  handlerValidator: HandlerValidator;
} {
  const eventValidator = new EventValidator();
  const envelopeValidator = new EnvelopeValidator();
  const handlerValidator = new HandlerValidator();
  const eventMapper = new EventMapper();
  const envelopeMapper = new EnvelopeMapper();
  const eventBus = new InMemoryEventBus();

  return {
    eventBus,
    eventMapper,
    envelopeMapper,
    eventValidator,
    envelopeValidator,
    handlerValidator,
  };
}