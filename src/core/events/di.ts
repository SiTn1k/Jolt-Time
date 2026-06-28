/**
 * Event Bus Domain Dependency Injection Registration
 *
 * Registers all Event Bus services with the DI container.
 */

import type { Container } from '../di';
import { InMemoryEventBus } from './repositories/InMemoryEventBus';
import { EventMapper } from './mappers/EventMapper';
import { EnvelopeMapper } from './mappers/EnvelopeMapper';
import { EventValidator } from './validators/EventValidator';
import { EnvelopeValidator } from './validators/EnvelopeValidator';
import { HandlerValidator } from './validators/HandlerValidator';
import type { IEventHandler } from './interfaces/IEventHandler';
import { EventType } from './value-objects/EventType';

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
  // Built-in Subscriber Handlers
  REWARD_ENGINE_HANDLER: Symbol.for('RewardEngineHandler'),
  ACHIEVEMENT_ENGINE_HANDLER: Symbol.for('AchievementEngineHandler'),
  QUEST_ENGINE_HANDLER: Symbol.for('QuestEngineHandler'),
  ANALYTICS_HANDLER: Symbol.for('AnalyticsHandler'),
  NOTIFICATION_HANDLER: Symbol.for('NotificationHandler'),
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

  // Event Bus (Singleton with injected validators)
  const eventValidator = container.resolve(EventValidator);
  const envelopeValidator = container.resolve(EnvelopeValidator);
  const eventBus = new InMemoryEventBus(eventValidator, envelopeValidator);
  container.registerInstance(InMemoryEventBus, eventBus);
}

/**
 * Setup function for built-in event handlers.
 * These handlers route events to the appropriate subsystems.
 */
export interface BuiltInHandlerSetup {
  rewardEngineHandler: IEventHandler;
  achievementEngineHandler: IEventHandler;
  questEngineHandler: IEventHandler;
  analyticsHandler: IEventHandler;
  notificationHandler: IEventHandler;
}

/**
 * Registers built-in subscriber handlers with the event bus.
 * Call this after eventBus.start() and before publishing events.
 */
export function registerBuiltInHandlers(
  eventBus: InMemoryEventBus,
  handlers?: Partial<BuiltInHandlerSetup>
): void {
  // Register reward engine handler for reward-related events
  if (handlers?.rewardEngineHandler) {
    eventBus.registerHandler(
      EventType.create('Reward.*'),
      handlers.rewardEngineHandler
    );
  }

  // Register achievement engine handler for achievement-related events
  if (handlers?.achievementEngineHandler) {
    eventBus.registerHandler(
      EventType.create('Achievement.*'),
      handlers.achievementEngineHandler
    );
  }

  // Register quest engine handler for quest-related events
  if (handlers?.questEngineHandler) {
    eventBus.registerHandler(
      EventType.create('Quest.*'),
      handlers.questEngineHandler
    );
  }

  // Register analytics handler for all events (for metrics collection)
  if (handlers?.analyticsHandler) {
    eventBus.registerHandler(
      EventType.create('*'),
      handlers.analyticsHandler
    );
  }

  // Register notification handler for notification-triggering events
  if (handlers?.notificationHandler) {
    eventBus.registerHandler(
      EventType.create('Notification.*'),
      handlers.notificationHandler
    );
  }
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
  const eventBus = new InMemoryEventBus(eventValidator, envelopeValidator);

  return {
    eventBus,
    eventMapper,
    envelopeMapper,
    eventValidator,
    envelopeValidator,
    handlerValidator,
  };
}