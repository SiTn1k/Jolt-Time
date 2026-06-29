/**
 * Analytics Event Subscriber
 *
 * Subscribes to domain events from other modules and records analytics events.
 * Analytics NEVER modifies gameplay - it ONLY observes and records.
 */

import type { IEventBus } from '../../../core/events/interfaces/IEventBus';
import type { IEventHandler } from '../../../core/events/interfaces/IEventHandler';
import type { DomainEvent } from '../../../core/events/entities/DomainEvent';
import { EventType } from '../../../core/events/value-objects/EventType';
import { HandlerId } from '../../../core/events/value-objects/HandlerId';
import { AnalyticsService } from '../services/AnalyticsService';
import { AnalyticsEventType } from '../types/AnalyticsEventType';
import { MetricType, MetricUnit } from '../types/MetricType';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('AnalyticsSubscriber');

/**
 * Maps domain event types to analytics event types.
 */
const EVENT_TYPE_MAP: Record<string, AnalyticsEventType> = {
  // Museum events
  MuseumCreated: AnalyticsEventType.MUSEUM,
  MuseumUpgraded: AnalyticsEventType.MUSEUM,
  ExhibitPlaced: AnalyticsEventType.MUSEUM,
  ExhibitRemoved: AnalyticsEventType.MUSEUM,

  // Academy events
  AcademyCreated: AnalyticsEventType.ACADEMY,
  ResearchStarted: AnalyticsEventType.ACADEMY,
  ResearchCompleted: AnalyticsEventType.ACADEMY,
  ResearchReset: AnalyticsEventType.ACADEMY,

  // Quest events
  QuestCreated: AnalyticsEventType.QUEST,
  QuestStarted: AnalyticsEventType.QUEST,
  QuestCompleted: AnalyticsEventType.QUEST,
  QuestReset: AnalyticsEventType.QUEST,
  RewardClaimed: AnalyticsEventType.QUEST,

  // Achievement events
  AchievementCreated: AnalyticsEventType.ACHIEVEMENT,
  AchievementUnlocked: AnalyticsEventType.ACHIEVEMENT,
  AchievementCompleted: AnalyticsEventType.ACHIEVEMENT,
  AchievementClaimRequested: AnalyticsEventType.ACHIEVEMENT,

  // Reward events
  RewardRequested: AnalyticsEventType.REWARD,
  RewardStarted: AnalyticsEventType.REWARD,
  RewardFailed: AnalyticsEventType.REWARD,
  RewardRejected: AnalyticsEventType.REWARD,

  // Guild events
  GuildCreated: AnalyticsEventType.GUILD,
  GuildDeleted: AnalyticsEventType.GUILD,
  GuildMemberJoined: AnalyticsEventType.GUILD,
  GuildMemberLeft: AnalyticsEventType.GUILD,
  GuildRoleChanged: AnalyticsEventType.GUILD,

  // Notification events
  NotificationSent: AnalyticsEventType.NOTIFICATION,
  NotificationClicked: AnalyticsEventType.NOTIFICATION,
  NotificationDismissed: AnalyticsEventType.NOTIFICATION,

  // Player events
  PlayerProfileCreated: AnalyticsEventType.GAMEPLAY,
  PlayerProfileUpdated: AnalyticsEventType.GAMEPLAY,
  PlayerProfileReset: AnalyticsEventType.GAMEPLAY,

  // Inventory events
  InventoryItemAdded: AnalyticsEventType.GAMEPLAY,
  InventoryItemRemoved: AnalyticsEventType.GAMEPLAY,
  InventoryItemUsed: AnalyticsEventType.GAMEPLAY,

  // Currency events
  WalletCreated: AnalyticsEventType.ECONOMY,
  CurrencyAdded: AnalyticsEventType.ECONOMY,
  CurrencyRemoved: AnalyticsEventType.ECONOMY,
  BalanceChanged: AnalyticsEventType.ECONOMY,

  // System events
  SystemError: AnalyticsEventType.SYSTEM,
  SystemWarning: AnalyticsEventType.SYSTEM,
};

/**
 * Default source module if not extractable from event.
 */
const DEFAULT_SOURCE_MODULE = 'unknown';

/**
 * Extracts player profile ID from event data.
 */
function extractPlayerProfileId(eventData: Record<string, unknown>): string | null {
  return (
    (eventData.playerProfileId as string) ||
    (eventData.player_profile_id as string) ||
    (eventData.playerId as string) ||
    (eventData.player_id as string) ||
    null
  );
}

/**
 * Extracts session ID from event data.
 */
function extractSessionId(eventData: Record<string, unknown>): string | null {
  return (
    (eventData.sessionId as string) ||
    (eventData.session_id as string) ||
    null
  );
}

/**
 * Extracts source module from event data.
 */
function extractSourceModule(eventData: Record<string, unknown>): string {
  return (
    (eventData.sourceModule as string) ||
    (eventData.source_module as string) ||
    (eventData.source as string) ||
    DEFAULT_SOURCE_MODULE
  );
}

/**
 * Gets the simple event type name from full event type (e.g., "PlayerProfile.Created" -> "PlayerProfileCreated").
 */
function getSimpleEventTypeName(eventTypeValue: string): string {
  return eventTypeValue.replace(/\./g, '').replace(/,/g, '');
}

/**
 * Analytics Event Handler
 *
 * Handles domain events and converts them to analytics events.
 */
class AnalyticsEventHandler implements IEventHandler {
  public readonly handlerId: HandlerId;
  public readonly eventType: EventType;
  public readonly handlerName = 'AnalyticsEventHandler';
  private readonly analyticsService: AnalyticsService;

  constructor(analyticsService: AnalyticsService, eventType: EventType) {
    this.handlerId = HandlerId.create('AnalyticsEventHandler');
    this.eventType = eventType;
    this.analyticsService = analyticsService;
  }

  async handle(event: DomainEvent): Promise<boolean> {
    try {
      const simpleEventType = getSimpleEventTypeName(event.eventType.value);
      const analyticsEventType = EVENT_TYPE_MAP[simpleEventType];
      
      if (!analyticsEventType) {
        logger.debug('No analytics mapping for event type', { eventType: event.eventType.value });
        return true;
      }

      const playerProfileId = extractPlayerProfileId(event.payload);
      const sessionId = extractSessionId(event.payload);
      const sourceModule = extractSourceModule(event.payload);

      if (!playerProfileId) {
        logger.warn('Cannot record analytics: no player profile ID', { eventType: event.eventType.value });
        return true;
      }

      const effectiveSessionId = sessionId || 'system';

      await this.analyticsService.recordEvent({
        eventType: analyticsEventType,
        playerProfileId,
        sessionId: effectiveSessionId,
        sourceModule,
        payload: {
          originalEventType: event.eventType.value,
          eventData: event.payload,
        },
      });

      logger.debug('Domain event recorded as analytics', {
        originalEventType: event.eventType.value,
        analyticsEventType,
        playerProfileId,
      });

      return true;
    } catch (err) {
      logger.error('Failed to handle domain event', err instanceof Error ? err : new Error(String(err)), {
        eventType: event.eventType.value,
      });
      return false;
    }
  }

  canHandle(eventType: EventType): boolean {
    return eventType.value === this.eventType.value;
  }
}

/**
 * Analytics Metric Handler
 *
 * Handles events and extracts metrics for collection.
 */
class AnalyticsMetricHandler implements IEventHandler {
  public readonly handlerId: HandlerId;
  public readonly eventType: EventType;
  public readonly handlerName = 'AnalyticsMetricHandler';
  private readonly analyticsService: AnalyticsService;

  constructor(analyticsService: AnalyticsService, eventType: EventType) {
    this.handlerId = HandlerId.create('AnalyticsMetricHandler');
    this.eventType = eventType;
    this.analyticsService = analyticsService;
  }

  async handle(event: DomainEvent): Promise<boolean> {
    try {
      const playerProfileId = extractPlayerProfileId(event.payload);
      const metrics: Array<{
        metricName: string;
        metricValue: number;
        metricType: MetricType;
        metricUnit: MetricUnit;
      }> = [];

      // Extract time-based metrics
      if (event.payload.timeTakenSeconds !== undefined) {
        metrics.push({
          metricName: 'quest.time_taken',
          metricValue: Number(event.payload.timeTakenSeconds),
          metricType: MetricType.DURATION,
          metricUnit: MetricUnit.SECONDS,
        });
      }

      // Extract level/rating metrics
      if (event.payload.newLevel !== undefined) {
        metrics.push({
          metricName: 'museum.level',
          metricValue: Number(event.payload.newLevel),
          metricType: MetricType.GAUGE,
          metricUnit: MetricUnit.LEVEL,
        });
      }

      if (event.payload.newRating !== undefined) {
        metrics.push({
          metricName: 'museum.rating',
          metricValue: Number(event.payload.newRating),
          metricType: MetricType.GAUGE,
          metricUnit: MetricUnit.PERCENT,
        });
      }

      // Extract reward metrics
      if (event.payload.rewardValue !== undefined) {
        metrics.push({
          metricName: 'reward.value',
          metricValue: Number(event.payload.rewardValue),
          metricType: MetricType.COUNTER,
          metricUnit: MetricUnit.COUNT,
        });
      }

      // Record all metrics
      for (const metric of metrics) {
        await this.analyticsService.recordMetric({
          ...metric,
          metadata: playerProfileId ? { playerProfileId } : undefined,
        });
      }

      if (metrics.length > 0) {
        logger.debug('Metrics extracted from event', {
          eventType: event.eventType.value,
          metricCount: metrics.length,
        });
      }

      return true;
    } catch (err) {
      logger.error('Failed to extract metrics', err instanceof Error ? err : new Error(String(err)), {
        eventType: event.eventType.value,
      });
      return false;
    }
  }

  canHandle(eventType: EventType): boolean {
    return eventType.value === this.eventType.value;
  }
}

/**
 * Analytics Event Subscriber
 *
 * Subscribes to domain events and records analytics.
 * Analytics NEVER modifies gameplay.
 */
export class AnalyticsEventSubscriber {
  private readonly eventBus: IEventBus;
  private readonly analyticsService: AnalyticsService;
  private readonly handlers: Map<string, IEventHandler[]> = new Map();
  private isSubscribed = false;

  /**
   * Creates a new AnalyticsEventSubscriber.
   */
  constructor(eventBus: IEventBus, analyticsService: AnalyticsService) {
    this.eventBus = eventBus;
    this.analyticsService = analyticsService;
  }

  /**
   * Subscribes to all relevant domain events.
   */
  subscribe(): void {
    if (this.isSubscribed) {
      logger.warn('Analytics subscriber already subscribed');
      return;
    }

    // Subscribe to all mapped event types
    const eventTypes = Object.keys(EVENT_TYPE_MAP);
    
    for (const eventTypeStr of eventTypes) {
      try {
        const eventType = EventType.create(eventTypeStr);
        
        const eventHandler = new AnalyticsEventHandler(this.analyticsService, eventType);
        const metricHandler = new AnalyticsMetricHandler(this.analyticsService, eventType);
        
        this.eventBus.subscribe(eventType, eventHandler);
        this.eventBus.subscribe(eventType, metricHandler);
        
        this.handlers.set(eventTypeStr, [eventHandler, metricHandler]);
      } catch (err) {
        logger.error('Failed to subscribe to event type', err instanceof Error ? err : new Error(String(err)), {
          eventType: eventTypeStr,
        });
      }
    }

    this.isSubscribed = true;
    logger.info('Analytics subscriber subscribed to events', { eventTypeCount: eventTypes.length });
  }

  /**
   * Unsubscribes from all domain events.
   */
  unsubscribe(): void {
    if (!this.isSubscribed) {
      logger.warn('Analytics subscriber not subscribed');
      return;
    }

    for (const [eventTypeStr, handlers] of this.handlers) {
      try {
        const eventType = EventType.create(eventTypeStr);
        for (const handler of handlers) {
          this.eventBus.unsubscribe(eventType, handler.handlerId.value);
        }
      } catch (err) {
        logger.error('Failed to unsubscribe from event type', err instanceof Error ? err : new Error(String(err)), {
          eventType: eventTypeStr,
        });
      }
    }

    this.handlers.clear();
    this.isSubscribed = false;
    logger.info('Analytics subscriber unsubscribed from events');
  }

  /**
   * Checks if subscriber is subscribed.
   */
  isActive(): boolean {
    return this.isSubscribed;
  }
}
