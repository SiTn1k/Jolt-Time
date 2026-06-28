/**
 * Event Bus Built-in Subscribers
 *
 * Interfaces for built-in event subscribers.
 * These are ONLY interfaces - no business logic.
 * Event Bus MUST NEVER know domain logic.
 */

import type { DomainEvent } from '../entities/DomainEvent';

/**
 * Reward Engine subscriber interface.
 * Handles reward-related events.
 * Only interface - actual reward logic belongs to Reward Engine.
 */
export interface IRewardEngineSubscriber {
  /**
   * Handles reward-related events.
   * @param event The domain event to handle
   */
  onRewardEvent(event: DomainEvent): Promise<boolean>;

  /**
   * Gets the subscriber name for logging.
   */
  readonly subscriberName: string;
}

/**
 * Achievement Engine subscriber interface.
 * Handles achievement-related events.
 * Only interface - actual achievement logic belongs to Achievement Engine.
 */
export interface IAchievementEngineSubscriber {
  /**
   * Handles achievement-related events.
   * @param event The domain event to handle
   */
  onAchievementEvent(event: DomainEvent): Promise<boolean>;

  /**
   * Gets the subscriber name for logging.
   */
  readonly subscriberName: string;
}

/**
 * Quest Engine subscriber interface.
 * Handles quest-related events.
 * Only interface - actual quest logic belongs to Quest Engine.
 */
export interface IQuestEngineSubscriber {
  /**
   * Handles quest-related events.
   * @param event The domain event to handle
   */
  onQuestEvent(event: DomainEvent): Promise<boolean>;

  /**
   * Gets the subscriber name for logging.
   */
  readonly subscriberName: string;
}

/**
 * Analytics subscriber interface.
 * Handles analytics event collection.
 * Only interface - actual analytics logic belongs to Analytics module.
 */
export interface IAnalyticsSubscriber {
  /**
   * Handles analytics events.
   * @param event The domain event to handle
   */
  onAnalyticsEvent(event: DomainEvent): Promise<boolean>;

  /**
   * Gets the subscriber name for logging.
   */
  readonly subscriberName: string;
}

/**
 * Notification Service subscriber interface.
 * Handles notification-triggering events.
 * Only interface - actual notification logic belongs to Notification Service.
 */
export interface INotificationSubscriber {
  /**
   * Handles notification-related events.
   * @param event The domain event to handle
   */
  onNotificationEvent(event: DomainEvent): Promise<boolean>;

  /**
   * Gets the subscriber name for logging.
   */
  readonly subscriberName: string;
}

/**
 * Guild subscriber interface.
 * Handles guild-related events.
 * Only interface - actual guild logic belongs to Guild module.
 */
export interface IGuildSubscriber {
  /**
   * Handles guild-related events.
   * @param event The domain event to handle
   */
  onGuildEvent(event: DomainEvent): Promise<boolean>;

  /**
   * Gets the subscriber name for logging.
   */
  readonly subscriberName: string;
}

/**
 * Museum subscriber interface.
 * Handles museum-related events.
 * Only interface - actual museum logic belongs to Museum module.
 */
export interface IMuseumSubscriber {
  /**
   * Handles museum-related events.
   * @param event The domain event to handle
   */
  onMuseumEvent(event: DomainEvent): Promise<boolean>;

  /**
   * Gets the subscriber name for logging.
   */
  readonly subscriberName: string;
}

/**
 * Academy subscriber interface.
 * Handles academy-related events.
 * Only interface - actual academy logic belongs to Academy module.
 */
export interface IAcademySubscriber {
  /**
   * Handles academy-related events.
   * @param event The domain event to handle
   */
  onAcademyEvent(event: DomainEvent): Promise<boolean>;

  /**
   * Gets the subscriber name for logging.
   */
  readonly subscriberName: string;
}

/**
 * All built-in subscriber interfaces exported together.
 */
export type BuiltInSubscriber =
  | IRewardEngineSubscriber
  | IAchievementEngineSubscriber
  | IQuestEngineSubscriber
  | IAnalyticsSubscriber
  | INotificationSubscriber
  | IGuildSubscriber
  | IMuseumSubscriber
  | IAcademySubscriber;