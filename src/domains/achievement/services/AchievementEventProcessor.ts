/**
 * Achievement Event Processor
 *
 * Processes domain events and updates achievement progress accordingly.
 * This is NOT the Event Bus - it consumes events through service interfaces.
 */

import { getLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';
import type { IAchievementService } from './AchievementService';

/**
 * Supported event types for achievement processing.
 */
export type AchievementEventType =
  | 'ArtifactOpened'
  | 'ArtifactCollected'
  | 'MuseumExhibitPlaced'
  | 'MuseumCompleted'
  | 'ResearchCompleted'
  | 'QuestCompleted'
  | 'CurrencyEarned'
  | 'InventoryExpanded'
  | 'Login'
  | 'PlaySession';

/**
 * Base interface for achievement-related events.
 */
export interface AchievementEvent {
  type: AchievementEventType;
  playerProfileId: string;
  timestamp: Date;
}

/**
 * Event data for artifact-related events.
 */
export interface ArtifactEvent extends AchievementEvent {
  type: 'ArtifactOpened' | 'ArtifactCollected';
  artifactId: string;
  artifactSlug?: string;
  category?: string;
  rarity?: string;
}

/**
 * Event data for museum-related events.
 */
export interface MuseumEvent extends AchievementEvent {
  type: 'MuseumExhibitPlaced' | 'MuseumCompleted';
  exhibitId?: string;
  museumId?: string;
  category?: string;
}

/**
 * Event data for research completion.
 */
export interface ResearchEvent extends AchievementEvent {
  type: 'ResearchCompleted';
  researchId: string;
  researchName?: string;
  category?: string;
}

/**
 * Event data for quest completion.
 */
export interface QuestEvent extends AchievementEvent {
  type: 'QuestCompleted';
  questId: string;
  questSlug?: string;
  questCategory?: string;
  difficulty?: string;
}

/**
 * Event data for currency earned.
 */
export interface CurrencyEvent extends AchievementEvent {
  type: 'CurrencyEarned';
  currencyType: string;
  amount: number;
  source?: string;
}

/**
 * Event data for inventory expansion.
 */
export interface InventoryEvent extends AchievementEvent {
  type: 'InventoryExpanded';
  newCapacity: number;
  expansionType?: string;
}

/**
 * Event data for login events.
 */
export interface LoginEvent extends AchievementEvent {
  type: 'Login';
  loginCount?: number;
}

/**
 * Event data for play session events.
 */
export interface PlaySessionEvent extends AchievementEvent {
  type: 'PlaySession';
  durationSeconds?: number;
  sessionCount?: number;
}

/**
 * Union type for all achievement events.
 */
export type AchievementDomainEvent =
  | ArtifactEvent
  | MuseumEvent
  | ResearchEvent
  | QuestEvent
  | CurrencyEvent
  | InventoryEvent
  | LoginEvent
  | PlaySessionEvent;

/**
 * Achievement Event Processor interface.
 */
export interface IAchievementEventProcessor {
  /**
   * Processes a domain event and updates achievement progress.
   */
  processEvent(event: AchievementDomainEvent): Promise<void>;

  /**
   * Processes multiple events in batch.
   */
  processEvents(events: AchievementDomainEvent[]): Promise<void>;

  /**
   * Initializes achievements for a player when they first start.
   */
  initializePlayer(playerProfileId: string): Promise<void>;
}

/**
 * Achievement Event Processor implementation.
 * 
 * This processor listens to domain events and updates achievement progress.
 * It does NOT implement the Event Bus - it receives events through method calls.
 */
export class AchievementEventProcessor implements IAchievementEventProcessor {
  private readonly achievementService: IAchievementService;
  private readonly logger: ILogger;

  /**
   * Creates a new AchievementEventProcessor instance.
   */
  constructor(
    achievementService: IAchievementService,
    logger?: ILogger
  ) {
    this.achievementService = achievementService;
    this.logger = logger ?? getLogger().child({ module: 'AchievementEventProcessor' });
  }

  /**
   * Processes a domain event and updates achievement progress.
   */
  async processEvent(event: AchievementDomainEvent): Promise<void> {
    this.logger.debug('Processing achievement event', { 
      type: event.type, 
      playerProfileId: event.playerProfileId 
    });

    try {
      // Convert event to generic format for the service
      const eventData = this.extractEventData(event);

      // Process the event through the achievement service
      await this.achievementService.processEvent(
        event.type,
        event.playerProfileId,
        eventData
      );

      this.logger.info('Achievement event processed', {
        type: event.type,
        playerProfileId: event.playerProfileId,
      });
    } catch (error) {
      this.logger.error('Failed to process achievement event', undefined, {
        type: event.type,
        playerProfileId: event.playerProfileId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      // Don't re-throw - we don't want event processing to break other systems
    }
  }

  /**
   * Processes multiple events in batch.
   */
  async processEvents(events: AchievementDomainEvent[]): Promise<void> {
    this.logger.debug('Processing batch of achievement events', { count: events.length });

    for (const event of events) {
      await this.processEvent(event);
    }

    this.logger.info('Batch achievement events processed', { count: events.length });
  }

  /**
   * Initializes achievements for a player when they first start.
   */
  async initializePlayer(playerProfileId: string): Promise<void> {
    this.logger.debug('Initializing achievements for player', { playerProfileId });

    try {
      await this.achievementService.initializePlayerAchievements(playerProfileId);

      this.logger.info('Player achievements initialized', { playerProfileId });
    } catch (error) {
      this.logger.error('Failed to initialize player achievements', error instanceof Error ? error : undefined, {
        playerProfileId,
      });
      throw error;
    }
  }

  /**
   * Extracts event data into a record format for the achievement service.
   */
  private extractEventData(event: AchievementDomainEvent): Record<string, unknown> {
    const baseData: Record<string, unknown> = {
      timestamp: event.timestamp.toISOString(),
    };

    switch (event.type) {
      case 'ArtifactOpened':
      case 'ArtifactCollected':
        return {
          ...baseData,
          artifactId: event.artifactId,
          artifactSlug: event.artifactSlug,
          category: event.category,
          rarity: event.rarity,
        };

      case 'MuseumExhibitPlaced':
      case 'MuseumCompleted':
        return {
          ...baseData,
          exhibitId: event.exhibitId,
          museumId: event.museumId,
          category: event.category,
        };

      case 'ResearchCompleted':
        return {
          ...baseData,
          researchId: event.researchId,
          researchName: event.researchName,
          category: event.category,
        };

      case 'QuestCompleted':
        return {
          ...baseData,
          questId: event.questId,
          questSlug: event.questSlug,
          questCategory: event.questCategory,
          difficulty: event.difficulty,
        };

      case 'CurrencyEarned':
        return {
          ...baseData,
          currencyType: event.currencyType,
          amount: event.amount,
          source: event.source,
        };

      case 'InventoryExpanded':
        return {
          ...baseData,
          newCapacity: event.newCapacity,
          expansionType: event.expansionType,
        };

      case 'Login':
        return {
          ...baseData,
          loginCount: event.loginCount,
        };

      case 'PlaySession':
        return {
          ...baseData,
          durationSeconds: event.durationSeconds,
          sessionCount: event.sessionCount,
        };

      default:
        return baseData;
    }
  }
}

/**
 * Creates an AchievementEventProcessor with dependencies.
 */
export function createAchievementEventProcessor(
  achievementService: IAchievementService
): AchievementEventProcessor {
  return new AchievementEventProcessor(achievementService);
}
