/**
 * Quest Service
 *
 * Business logic for quest-related operations.
 * Handles quest creation, loading, starting, completing, and resetting.
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
import { QuestStatus } from '../types/QuestStatus';
import { QuestCategory } from '../types/QuestCategory';
import { QuestDifficulty } from '../types/QuestDifficulty';
import { RepeatType } from '../types/RepeatType';
import { QuestMapper } from '../mappers/QuestMapper';
import { ProgressMapper } from '../mappers/ProgressMapper';
import { QuestValidator } from '../validators/QuestValidator';
import { ProgressValidator } from '../validators/ProgressValidator';
import { createQuestStartedEvent } from '../events/QuestStarted.event';
import { createQuestCompletedEvent } from '../events/QuestCompleted.event';
import { createQuestResetEvent } from '../events/QuestReset.event';
import { createRewardClaimedEvent } from '../events/RewardClaimed.event';
import type { CreateQuestDto } from '../dto/CreateQuest.dto';
import type {
  QuestWithProgressResponseDto,
} from '../dto/QuestResponse.dto';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Quest Service interface for dependency injection.
 */
export interface IQuestService {
  /**
   * Creates a new quest.
   */
  createQuest(dto: CreateQuestDto): Promise<Quest>;

  /**
   * Loads a quest by its ID.
   */
  getQuestById(questId: string): Promise<Quest | null>;

  /**
   * Loads a quest by its slug.
   */
  getQuestBySlug(slug: string): Promise<Quest | null>;

  /**
   * Starts a quest for a player.
   */
  startQuest(playerProfileId: string, questId: string): Promise<QuestProgress>;

  /**
   * Updates progress for a player on a quest.
   */
  updateProgress(
    playerProfileId: string,
    questId: string,
    increment: number,
    target: number
  ): Promise<QuestProgress>;

  /**
   * Marks a quest as completed.
   */
  completeQuest(playerProfileId: string, questId: string): Promise<QuestProgress>;

  /**
   * Claims a quest reward.
   */
  claimReward(playerProfileId: string, questId: string): Promise<ReturnType<typeof createRewardClaimedEvent>>;

  /**
   * Resets a quest for a player (daily/weekly reset).
   */
  resetQuest(playerProfileId: string, questId: string): Promise<ReturnType<typeof createQuestResetEvent>>;

  /**
   * Cancels a quest for a player.
   */
  cancelQuest(playerProfileId: string, questId: string): Promise<void>;

  /**
   * Gets player progress for a quest.
   */
  getQuestProgress(playerProfileId: string, questId: string): Promise<QuestProgress | null>;

  /**
   * Gets all active quests for a player with their progress.
   */
  getActiveQuestsWithProgress(
    playerProfileId: string,
    category?: QuestCategory
  ): Promise<QuestWithProgressResponseDto[]>;

  /**
   * Gets quest summary for a player.
   */
  getQuestSummary(playerProfileId: string): Promise<{
    totalQuests: number;
    completedQuests: number;
    claimableRewards: number;
    inProgressQuests: number;
  }>;

  /**
   * Lists quests with pagination.
   */
  listQuests(
    params: PaginationParams,
    filters?: { category?: QuestCategory; difficulty?: QuestDifficulty; isActive?: boolean }
  ): Promise<PaginatedResult<Quest>>;

  /**
   * Counts quests.
   */
  countQuests(
    filters?: { category?: QuestCategory; difficulty?: QuestDifficulty; isActive?: boolean }
  ): Promise<number>;
}

/**
 * Quest Service implementation.
 * 
 * IMPORTANT: This service ONLY tracks objectives and emits events.
 * It NEVER directly modifies Currency, Inventory, Museum, or Academy.
 * Reward distribution is handled by the Reward Engine via events.
 */
export class QuestService implements IQuestService {
  private readonly questRepository: IQuestRepository;
  private readonly progressRepository: IQuestProgressRepository;
  private readonly logger: ILogger;

  /**
   * Creates a new QuestService instance.
   */
  constructor(
    questRepository: IQuestRepository,
    progressRepository: IQuestProgressRepository,
    logger?: ILogger
  ) {
    this.questRepository = questRepository;
    this.progressRepository = progressRepository;
    this.logger = logger ?? getLogger().child({ module: 'QuestService' });
  }

  /**
   * Creates a new quest.
   */
  async createQuest(dto: CreateQuestDto): Promise<Quest> {
    this.logger.debug('Creating quest', { slug: dto.slug });

    // Validate DTO
    QuestValidator.validateOrThrow({
      slug: dto.slug,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      difficulty: dto.difficulty,
      requiredLevel: dto.requiredLevel,
    });

    // Check if slug already exists
    const existingSlug = await this.questRepository.findBySlug(QuestSlug.create(dto.slug));
    if (existingSlug) {
      throw new Error(`Quest with slug '${dto.slug}' already exists`);
    }

    const questId = QuestId.create();

    const quest = Quest.create({
      questId,
      slug: QuestSlug.create(dto.slug),
      title: dto.title,
      description: dto.description,
      category: dto.category,
      difficulty: dto.difficulty,
      repeatType: dto.repeatType,
      requiredLevel: dto.requiredLevel ?? 1,
      requiredResearch: dto.requiredResearch ?? [],
      rewardDefinition: dto.rewardDefinition,
      isActive: dto.isActive ?? true,
      metadata: dto.metadata,
    });

    const createdQuest = await this.questRepository.create(quest);
    this.logger.info('Quest created', { questId: createdQuest.questId.value, slug: createdQuest.slug.value });

    return createdQuest;
  }

  /**
   * Loads a quest by its ID.
   */
  async getQuestById(questId: string): Promise<Quest | null> {
    this.logger.debug('Getting quest by ID', { questId });
    const id = QuestId.reconstruct(questId);
    return this.questRepository.findById(id);
  }

  /**
   * Loads a quest by its slug.
   */
  async getQuestBySlug(slug: string): Promise<Quest | null> {
    this.logger.debug('Getting quest by slug', { slug });
    const questSlug = QuestSlug.create(slug);
    return this.questRepository.findBySlug(questSlug);
  }

  /**
   * Starts a quest for a player.
   */
  async startQuest(playerProfileId: string, questId: string): Promise<QuestProgress> {
    this.logger.debug('Starting quest', { playerProfileId, questId });

    // Validate player profile ID
    if (!ProgressValidator.isValidPlayerProfileId(playerProfileId)) {
      throw new Error('Invalid player profile ID');
    }

    // Load the quest
    const quest = await this.questRepository.findById(QuestId.reconstruct(questId));
    if (!quest) {
      throw new Error(`Quest not found: ${questId}`);
    }

    // Check if player already has progress for this quest
    const existingProgress = await this.progressRepository.findByPlayerAndQuest(playerProfileId, questId);
    if (existingProgress) {
      // Can only start if available, expired, or in_progress
      if (existingProgress.status === QuestStatus.IN_PROGRESS) {
        throw new Error(`Quest already started: ${questId}`);
      }

      // For repeating quests that are completed or claimed, reset and start fresh
      if (quest.isRepeating && 
          (existingProgress.status === QuestStatus.COMPLETED || existingProgress.status === QuestStatus.CLAIMED)) {
        const previousProgressId = existingProgress.progressId;
        const resetProgress = await this.progressRepository.resetProgress(playerProfileId, questId);
        
        // Emit reset event
        const resetEvent = createQuestResetEvent({
          questId: quest.questId.value,
          playerProfileId,
          slug: quest.slug.value,
          category: quest.category,
          repeatType: quest.repeatType,
          previousProgressId,
          newProgressId: resetProgress.progressId,
        });
        
        this.logger.info('Quest reset and restarted', { playerProfileId, questId, resetType: quest.repeatType });
        
        return resetProgress;
      }

      // If not a repeating quest or status is AVAILABLE/EXPIRED, don't allow restart
      throw new Error(`Quest already started: ${questId}`);
    }

    // Create new progress
    const progressId = QuestProgressId.create();
    const progress = QuestProgress.create({
      progressId,
      playerProfileId,
      questId,
      initialValue: 0,
    });

    const createdProgress = await this.progressRepository.create(progress);

    // Emit quest started event
    createQuestStartedEvent({
      questId: quest.questId.value,
      playerProfileId,
      slug: quest.slug.value,
      title: quest.title,
      category: quest.category,
      difficulty: quest.difficulty,
      progressId: createdProgress.progressId,
    });

    this.logger.info('Quest started', {
      playerProfileId,
      questId,
      progressId: createdProgress.progressId,
    });

    return createdProgress;
  }

  /**
   * Updates progress for a player on a quest.
   */
  async updateProgress(
    playerProfileId: string,
    questId: string,
    increment: number,
    target: number
  ): Promise<QuestProgress> {
    this.logger.debug('Updating quest progress', { playerProfileId, questId, increment, target });

    // Validate inputs
    if (increment < 0) {
      throw new Error('Progress increment must be non-negative');
    }

    if (target < 0) {
      throw new Error('Target must be non-negative');
    }

    // Find existing progress
    const progress = await this.progressRepository.findByPlayerAndQuest(playerProfileId, questId);
    if (!progress) {
      throw new Error(`No quest progress found for player ${playerProfileId} on quest ${questId}`);
    }

    // Only update if quest is in progress
    if (progress.status !== QuestStatus.IN_PROGRESS) {
      throw new Error(`Quest is not in progress: ${questId}`);
    }

    // Increment progress with clamping
    const updatedProgress = await this.progressRepository.incrementProgress(
      QuestProgressId.reconstruct(progress.progressId),
      increment,
      target
    );

    this.logger.info('Quest progress updated', {
      playerProfileId,
      questId,
      newValue: updatedProgress.currentValue,
      target,
      isComplete: updatedProgress.status === QuestStatus.COMPLETED,
    });

    return updatedProgress;
  }

  /**
   * Marks a quest as completed.
   */
  async completeQuest(playerProfileId: string, questId: string): Promise<QuestProgress> {
    this.logger.debug('Completing quest', { playerProfileId, questId });

    // Find existing progress
    const progress = await this.progressRepository.findByPlayerAndQuest(playerProfileId, questId);
    if (!progress) {
      throw new Error(`No quest progress found for player ${playerProfileId} on quest ${questId}`);
    }

    // Load the quest
    const quest = await this.questRepository.findById(QuestId.reconstruct(questId));
    if (!quest) {
      throw new Error(`Quest not found: ${questId}`);
    }

    // Only complete if in progress
    if (progress.status !== QuestStatus.IN_PROGRESS) {
      throw new Error(`Quest is not in progress: ${questId}`);
    }

    // Update status to completed
    const completedProgress = await this.progressRepository.updateStatus(
      QuestProgressId.reconstruct(progress.progressId),
      QuestStatus.COMPLETED
    );

    // Calculate time taken
    const timeTakenSeconds = Math.floor(
      (completedProgress.completedAt!.getTime() - completedProgress.startedAt.getTime()) / 1000
    );

    // Emit quest completed event
    createQuestCompletedEvent({
      questId: quest.questId.value,
      playerProfileId,
      slug: quest.slug.value,
      title: quest.title,
      category: quest.category,
      difficulty: quest.difficulty,
      progressId: completedProgress.progressId,
      timeTakenSeconds,
      rewardDefinition: quest.rewardDefinition,
    });

    this.logger.info('Quest completed', {
      playerProfileId,
      questId,
      timeTakenSeconds,
    });

    return completedProgress;
  }

  /**
   * Claims a quest reward.
   * 
   * IMPORTANT: This method ONLY emits a RewardClaimedEvent.
   * Actual reward distribution is handled by the Reward Engine.
   */
  async claimReward(playerProfileId: string, questId: string): Promise<ReturnType<typeof createRewardClaimedEvent>> {
    this.logger.debug('Claiming quest reward', { playerProfileId, questId });

    // Find existing progress
    const progress = await this.progressRepository.findByPlayerAndQuest(playerProfileId, questId);
    if (!progress) {
      throw new Error(`No quest progress found for player ${playerProfileId} on quest ${questId}`);
    }

    // Load the quest
    const quest = await this.questRepository.findById(QuestId.reconstruct(questId));
    if (!quest) {
      throw new Error(`Quest not found: ${questId}`);
    }

    // Only claim if completed
    if (progress.status !== QuestStatus.COMPLETED) {
      throw new Error(`Quest is not completed: ${questId}`);
    }

    // Update status to claimed
    await this.progressRepository.updateStatus(
      QuestProgressId.reconstruct(progress.progressId),
      QuestStatus.CLAIMED
    );

    // Emit reward claimed event
    // The Reward Engine will listen to this event and distribute rewards
    const rewardClaimedEvent = createRewardClaimedEvent({
      questId: quest.questId.value,
      playerProfileId,
      slug: quest.slug.value,
      title: quest.title,
      category: quest.category,
      difficulty: quest.difficulty,
      progressId: progress.progressId,
      rewardDefinition: quest.rewardDefinition,
    });

    this.logger.info('Quest reward claimed', {
      playerProfileId,
      questId,
      rewards: quest.rewardDefinition,
    });

    return rewardClaimedEvent;
  }

  /**
   * Resets a quest for a player (daily/weekly reset).
   */
  async resetQuest(playerProfileId: string, questId: string): Promise<ReturnType<typeof createQuestResetEvent>> {
    this.logger.debug('Resetting quest', { playerProfileId, questId });

    // Find existing progress
    const progress = await this.progressRepository.findByPlayerAndQuest(playerProfileId, questId);
    if (!progress) {
      throw new Error(`No quest progress found for player ${playerProfileId} on quest ${questId}`);
    }

    // Load the quest
    const quest = await this.questRepository.findById(QuestId.reconstruct(questId));
    if (!quest) {
      throw new Error(`Quest not found: ${questId}`);
    }

    const previousProgressId = progress.progressId;

    // Reset progress
    const resetProgress = await this.progressRepository.resetProgress(playerProfileId, questId);

    // Emit quest reset event
    const resetEvent = createQuestResetEvent({
      questId: quest.questId.value,
      playerProfileId,
      slug: quest.slug.value,
      category: quest.category,
      repeatType: quest.repeatType,
      previousProgressId,
      newProgressId: resetProgress.progressId,
    });

    this.logger.info('Quest reset', {
      playerProfileId,
      questId,
      resetType: quest.repeatType,
    });

    return resetEvent;
  }

  /**
   * Cancels a quest for a player.
   */
  async cancelQuest(playerProfileId: string, questId: string): Promise<void> {
    this.logger.debug('Cancelling quest', { playerProfileId, questId });

    // Find existing progress
    const progress = await this.progressRepository.findByPlayerAndQuest(playerProfileId, questId);
    if (!progress) {
      throw new Error(`No quest progress found for player ${playerProfileId} on quest ${questId}`);
    }

    // Only cancel if in progress or available
    if (progress.status !== QuestStatus.IN_PROGRESS && progress.status !== QuestStatus.AVAILABLE) {
      throw new Error(`Quest cannot be cancelled: ${questId} (status: ${progress.status})`);
    }

    // Delete the progress record
    await this.progressRepository.delete(QuestProgressId.reconstruct(progress.progressId));

    this.logger.info('Quest cancelled', { playerProfileId, questId });
  }

  /**
   * Gets player progress for a quest.
   */
  async getQuestProgress(playerProfileId: string, questId: string): Promise<QuestProgress | null> {
    this.logger.debug('Getting quest progress', { playerProfileId, questId });
    return this.progressRepository.findByPlayerAndQuest(playerProfileId, questId);
  }

  /**
   * Gets all active quests for a player with their progress.
   */
  async getActiveQuestsWithProgress(
    playerProfileId: string,
    category?: QuestCategory
  ): Promise<QuestWithProgressResponseDto[]> {
    this.logger.debug('Getting active quests with progress', { playerProfileId, category });

    // Get all active quests
    const activeQuests = await this.questRepository.findActive(category);

    // Get player progress for these quests
    const result: QuestWithProgressResponseDto[] = [];

    for (const quest of activeQuests) {
      const progress = await this.progressRepository.findByPlayerAndQuest(playerProfileId, quest.questId.value);
      const progressDto = progress ? ProgressMapper.toResponse(progress) : undefined;

      // Determine status
      let status: QuestStatus | undefined;
      if (progress) {
        status = progress.status;
      } else if (quest.requiredLevel > 1) {
        status = QuestStatus.LOCKED;
      } else {
        status = QuestStatus.AVAILABLE;
      }

      const questWithProgress = QuestMapper.toWithProgressResponse(
        quest,
        progressDto,
        undefined, // objectives would be loaded separately if needed
        status
      );

      result.push(questWithProgress);
    }

    return result;
  }

  /**
   * Gets quest summary for a player.
   */
  async getQuestSummary(playerProfileId: string): Promise<{
    totalQuests: number;
    completedQuests: number;
    claimableRewards: number;
    inProgressQuests: number;
  }> {
    this.logger.debug('Getting quest summary', { playerProfileId });

    const { items: allProgress } = await this.progressRepository.findByPlayer(
      playerProfileId,
      { page: 1, pageSize: 1000 }
    );

    const claimable = await this.progressRepository.findClaimableByPlayer(playerProfileId);

    const completedQuests = allProgress.filter(
      p => p.status === QuestStatus.COMPLETED || p.status === QuestStatus.CLAIMED
    ).length;

    const inProgressQuests = allProgress.filter(
      p => p.status === QuestStatus.IN_PROGRESS
    ).length;

    return {
      totalQuests: allProgress.length,
      completedQuests,
      claimableRewards: claimable.length,
      inProgressQuests,
    };
  }

  /**
   * Lists quests with pagination.
   */
  async listQuests(
    params: PaginationParams,
    filters?: { category?: QuestCategory; difficulty?: QuestDifficulty; isActive?: boolean }
  ): Promise<PaginatedResult<Quest>> {
    this.logger.debug('Listing quests', { params, filters });
    return this.questRepository.list(params, filters);
  }

  /**
   * Counts quests.
   */
  async countQuests(
    filters?: { category?: QuestCategory; difficulty?: QuestDifficulty; isActive?: boolean }
  ): Promise<number> {
    this.logger.debug('Counting quests', { filters });
    return this.questRepository.count(filters);
  }
}

/**
 * Creates a QuestService with dependencies.
 */
export function createQuestService(
  questRepository: IQuestRepository,
  progressRepository: IQuestProgressRepository
): QuestService {
  return new QuestService(questRepository, progressRepository);
}