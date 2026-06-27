/**
 * Quest Initialization Service
 *
 * Handles initialization of starter quests for new players.
 * Called when a Player Profile is created.
 */

import { getLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';
import type { IQuestRepository } from '../interfaces/IQuestRepository';
import type { IQuestProgressRepository } from '../interfaces/IQuestProgressRepository';
import { Quest } from '../entities/Quest';
import { QuestId } from '../value-objects/QuestId';
import { QuestSlug } from '../value-objects/QuestSlug';
import { QuestProgress } from '../entities/QuestProgress';
import { QuestProgressId } from '../entities/QuestProgressId';
import { QuestCategory } from '../types/QuestCategory';
import { QuestDifficulty } from '../types/QuestDifficulty';
import { RepeatType } from '../types/RepeatType';
import { createQuestStartedEvent } from '../events/QuestStarted.event';

/**
 * Starter quest configuration for new players.
 */
export interface StarterQuestConfig {
  questId: string;
  slug: string;
  title: string;
  description: string;
}

/**
 * Default starter quests for new players.
 */
export const DEFAULT_STARTER_QUESTS: StarterQuestConfig[] = [
  {
    questId: '00000000-0000-4000-8000-000000000001',
    slug: 'tutorial-welcome',
    title: 'Welcome to Jolt Time',
    description: 'Begin your journey through time and discover the wonders of historical artifacts.',
  },
  {
    questId: '00000000-0000-4000-8000-000000000002',
    slug: 'tutorial-first-collection',
    title: 'First Collection',
    description: 'Learn how to collect your first artifact.',
  },
  {
    questId: '00000000-0000-4000-8000-000000000003',
    slug: 'tutorial-museum-basics',
    title: 'Museum Basics',
    description: 'Learn the basics of the Museum and how to display artifacts.',
  },
];

/**
 * Quest Initialization Service interface.
 */
export interface IQuestInitializationService {
  /**
   * Initializes starter quests for a new player.
   * Creates quest definitions if they don't exist and starts them for the player.
   */
  initializeStarterQuests(playerProfileId: string): Promise<ReturnType<typeof createQuestStartedEvent>[]>;

  /**
   * Creates starter quest definitions in the database.
   * Idempotent - won't create duplicates.
   */
  createStarterQuestDefinitions(): Promise<number>;

  /**
   * Starts all available starter quests for a player.
   */
  startStarterQuestsForPlayer(playerProfileId: string): Promise<ReturnType<typeof createQuestStartedEvent>[]>;
}

/**
 * Quest Initialization Service implementation.
 */
export class QuestInitializationService implements IQuestInitializationService {
  private readonly questRepository: IQuestRepository;
  private readonly progressRepository: IQuestProgressRepository;
  private readonly logger: ILogger;

  /**
   * Creates a new QuestInitializationService instance.
   */
  constructor(
    questRepository: IQuestRepository,
    progressRepository: IQuestProgressRepository,
    logger?: ILogger
  ) {
    this.questRepository = questRepository;
    this.progressRepository = progressRepository;
    this.logger = logger ?? getLogger().child({ module: 'QuestInitializationService' });
  }

  /**
   * Initializes starter quests for a new player.
   * Creates quest definitions if they don't exist and starts them for the player.
   */
  async initializeStarterQuests(playerProfileId: string): Promise<ReturnType<typeof createQuestStartedEvent>[]> {
    this.logger.debug('Initializing starter quests', { playerProfileId });

    // First ensure starter quest definitions exist
    await this.createStarterQuestDefinitions();

    // Then start them for the player
    return this.startStarterQuestsForPlayer(playerProfileId);
  }

  /**
   * Creates starter quest definitions in the database.
   * Idempotent - won't create duplicates.
   */
  async createStarterQuestDefinitions(): Promise<number> {
    this.logger.debug('Creating starter quest definitions');

    let createdCount = 0;

    for (const questConfig of DEFAULT_STARTER_QUESTS) {
      const existingQuest = await this.questRepository.findBySlug(
        QuestSlug.create(questConfig.slug)
      );

      if (existingQuest) {
        this.logger.debug('Starter quest already exists', { slug: questConfig.slug });
        continue;
      }

      const questId = QuestId.reconstruct(questConfig.questId);

      // Create a basic starter quest
      const quest = Quest.create({
        questId,
        slug: QuestSlug.create(questConfig.slug),
        title: questConfig.title,
        description: questConfig.description,
        category: QuestCategory.MAIN,
        difficulty: QuestDifficulty.EASY,
        repeatType: RepeatType.NONE,
        requiredLevel: 1,
        requiredResearch: [],
        rewardDefinition: {
          coins: 100,
          gems: 5,
          xp: 50,
        },
        isActive: true,
      });

      try {
        await this.questRepository.create(quest);
        createdCount++;
        this.logger.info('Created starter quest', { slug: questConfig.slug });
      } catch (error) {
        // Handle race condition where another process created the quest
        this.logger.warn('Failed to create starter quest (may already exist)', {
          slug: questConfig.slug,
          error: (error as Error).message
        });
      }
    }

    this.logger.info('Starter quest definitions initialized', { createdCount });
    return createdCount;
  }

  /**
   * Starts all available starter quests for a player.
   */
  async startStarterQuestsForPlayer(playerProfileId: string): Promise<ReturnType<typeof createQuestStartedEvent>[]> {
    this.logger.debug('Starting starter quests for player', { playerProfileId });

    const events: ReturnType<typeof createQuestStartedEvent>[] = [];

    for (const questConfig of DEFAULT_STARTER_QUESTS) {
      try {
        // Check if progress already exists
        const existingProgress = await this.progressRepository.findByPlayerAndQuest(
          playerProfileId,
          questConfig.questId
        );

        if (existingProgress) {
          this.logger.debug('Player already has progress for starter quest', {
            playerProfileId,
            slug: questConfig.slug
          });
          continue;
        }

        // Create new progress
        const progressId = QuestProgressId.create();
        const progress = QuestProgress.create({
          progressId,
          playerProfileId,
          questId: questConfig.questId,
          initialValue: 0,
        });

        await this.progressRepository.create(progress);

        // Create event
        const event = createQuestStartedEvent({
          questId: questConfig.questId,
          playerProfileId,
          slug: questConfig.slug,
          title: questConfig.title,
          category: QuestCategory.MAIN,
          difficulty: QuestDifficulty.EASY,
          progressId: progress.progressId,
        });

        events.push(event);
        this.logger.info('Started starter quest for player', {
          playerProfileId,
          slug: questConfig.slug
        });
      } catch (error) {
        this.logger.error('Failed to start starter quest', {
          playerProfileId,
          slug: questConfig.slug,
          error: (error as Error).message
        });
      }
    }

    this.logger.info('Starter quests initialized for player', {
      playerProfileId,
      questsStarted: events.length
    });

    return events;
  }
}

/**
 * Creates a QuestInitializationService with dependencies.
 */
export function createQuestInitializationService(
  questRepository: IQuestRepository,
  progressRepository: IQuestProgressRepository
): QuestInitializationService {
  return new QuestInitializationService(questRepository, progressRepository);
}