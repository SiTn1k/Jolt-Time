/**
 * Achievement Service
 *
 * Business logic for achievement-related operations.
 * Handles achievement loading, progress tracking, completion, claiming, and resetting.
 */

import { getLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';
import type { IAchievementRepository } from '../interfaces/IAchievementRepository';
import type { IAchievementProgressRepository } from '../interfaces/IAchievementProgressRepository';
import { Achievement } from '../entities/Achievement';
import { AchievementId } from '../value-objects/AchievementId';
import { AchievementSlug } from '../value-objects/AchievementSlug';
import { AchievementProgress } from '../entities/AchievementProgress';
import { AchievementProgressId } from '../entities/AchievementProgressId';
import { AchievementStatus } from '../types/AchievementStatus';
import { AchievementCategory } from '../types/AchievementCategory';
import { AchievementMapper } from '../mappers/AchievementMapper';
import { ProgressMapper } from '../mappers/ProgressMapper';
import { AchievementValidator } from '../validators/AchievementValidator';
import { ProgressValidator } from '../validators/ProgressValidator';
import { createAchievementClaimRequestedEvent } from '../events/AchievementClaimRequested.event';
import type { CreateAchievementDto } from '../dto/CreateAchievement.dto';
import type { CreateProgressDto } from '../dto/AchievementProgress.dto';
import type {
  AchievementWithProgressResponseDto,
  AchievementStatisticsResponseDto,
} from '../dto/AchievementResponse.dto';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Achievement Service interface for dependency injection.
 */
export interface IAchievementService {
  /**
   * Creates a new achievement definition.
   */
  createAchievement(dto: CreateAchievementDto): Promise<Achievement>;

  /**
   * Loads an achievement by its ID.
   */
  getAchievementById(achievementId: string): Promise<Achievement | null>;

  /**
   * Loads an achievement by its slug.
   */
  getAchievementBySlug(slug: string): Promise<Achievement | null>;

  /**
   * Gets or creates progress for a player on an achievement.
   */
  getOrCreateProgress(playerProfileId: string, achievementId: string): Promise<AchievementProgress>;

  /**
   * Updates progress for a player on an achievement.
   */
  updateProgress(
    playerProfileId: string,
    achievementId: string,
    increment: number,
    targetValue: number
  ): Promise<AchievementProgress>;

  /**
   * Completes an achievement for a player.
   */
  completeAchievement(playerProfileId: string, achievementId: string): Promise<AchievementProgress>;

  /**
   * Claims an achievement reward.
   * Emits AchievementClaimRequested event - reward distribution handled by Reward Engine.
   */
  claimAchievement(playerProfileId: string, achievementId: string): Promise<ReturnType<typeof createAchievementClaimRequestedEvent>>;

  /**
   * Resets an achievement for a player.
   */
  resetAchievement(playerProfileId: string, achievementId: string): Promise<AchievementProgress>;

  /**
   * Gets player progress for an achievement.
   */
  getAchievementProgress(playerProfileId: string, achievementId: string): Promise<AchievementProgress | null>;

  /**
   * Gets all achievements for a player with their progress.
   */
  getAchievementsWithProgress(
    playerProfileId: string,
    params?: PaginationParams,
    category?: AchievementCategory
  ): Promise<{
    achievements: AchievementWithProgressResponseDto[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;

  /**
   * Gets achievement statistics for a player.
   */
  getAchievementStatistics(playerProfileId: string): Promise<AchievementStatisticsResponseDto>;

  /**
   * Gets claimable achievements for a player.
   */
  getClaimableAchievements(playerProfileId: string): Promise<AchievementProgress[]>;

  /**
   * Initializes achievements for a new player.
   * Creates starter and hidden achievements with default progress.
   */
  initializePlayerAchievements(playerProfileId: string): Promise<AchievementProgress[]>;

  /**
   * Lists achievements with pagination.
   */
  listAchievements(
    params: PaginationParams,
    filters?: { category?: AchievementCategory; isActive?: boolean; isHidden?: boolean }
  ): Promise<PaginatedResult<Achievement>>;

  /**
   * Counts achievements.
   */
  countAchievements(
    filters?: { category?: AchievementCategory; isActive?: boolean }
  ): Promise<number>;

  /**
   * Processes an event to update achievement progress.
   */
  processEvent(
    eventType: string,
    playerProfileId: string,
    eventData: Record<string, unknown>
  ): Promise<void>;
}

/**
 * Achievement Service implementation.
 * 
 * IMPORTANT: This service ONLY tracks achievements and emits events.
 * It NEVER directly modifies Currency, Inventory, Museum, Academy, or Quest.
 * Reward distribution is handled by the Reward Engine via events.
 */
export class AchievementService implements IAchievementService {
  private readonly achievementRepository: IAchievementRepository;
  private readonly progressRepository: IAchievementProgressRepository;
  private readonly logger: ILogger;

  /**
   * Creates a new AchievementService instance.
   */
  constructor(
    achievementRepository: IAchievementRepository,
    progressRepository: IAchievementProgressRepository,
    logger?: ILogger
  ) {
    this.achievementRepository = achievementRepository;
    this.progressRepository = progressRepository;
    this.logger = logger ?? getLogger().child({ module: 'AchievementService' });
  }

  /**
   * Creates a new achievement definition.
   */
  async createAchievement(dto: CreateAchievementDto): Promise<Achievement> {
    this.logger.debug('Creating achievement', { slug: dto.slug });

    // Validate DTO
    AchievementValidator.validateOrThrow({
      slug: dto.slug,
      title: dto.title,
      description: dto.description,
      points: dto.points,
    });

    // Check if slug already exists
    const existingSlug = await this.achievementRepository.findBySlug(AchievementSlug.create(dto.slug));
    if (existingSlug) {
      throw new Error(`Achievement with slug '${dto.slug}' already exists`);
    }

    const achievementId = AchievementId.create();

    const achievement = Achievement.create({
      achievementId,
      slug: AchievementSlug.create(dto.slug),
      title: dto.title,
      description: dto.description,
      category: dto.category,
      rarity: dto.rarity,
      points: dto.points,
      icon: dto.icon,
      rewardDefinition: dto.rewardDefinition,
      isHidden: dto.isHidden,
      isActive: dto.isActive ?? true,
      metadata: dto.metadata,
    });

    const createdAchievement = await this.achievementRepository.create(achievement);
    this.logger.info('Achievement created', { 
      achievementId: createdAchievement.achievementId.value, 
      slug: createdAchievement.slug.value 
    });

    return createdAchievement;
  }

  /**
   * Loads an achievement by its ID.
   */
  async getAchievementById(achievementId: string): Promise<Achievement | null> {
    this.logger.debug('Getting achievement by ID', { achievementId });
    
    if (!AchievementValidator.isValidAchievementId(achievementId)) {
      this.logger.warn('Invalid achievement ID', { achievementId });
      return null;
    }
    
    const id = AchievementId.reconstruct(achievementId);
    return this.achievementRepository.findById(id);
  }

  /**
   * Loads an achievement by its slug.
   */
  async getAchievementBySlug(slug: string): Promise<Achievement | null> {
    this.logger.debug('Getting achievement by slug', { slug });
    const achievementSlug = AchievementSlug.create(slug);
    return this.achievementRepository.findBySlug(achievementSlug);
  }

  /**
   * Gets or creates progress for a player on an achievement.
   */
  async getOrCreateProgress(playerProfileId: string, achievementId: string): Promise<AchievementProgress> {
    this.logger.debug('Getting or creating progress', { playerProfileId, achievementId });

    // Validate inputs
    if (!ProgressValidator.isValidPlayerProfileId(playerProfileId)) {
      throw new Error('Invalid player profile ID');
    }

    if (!ProgressValidator.isValidAchievementId(achievementId)) {
      throw new Error('Invalid achievement ID');
    }

    // Check for existing progress
    const existingProgress = await this.progressRepository.findByPlayerAndAchievement(playerProfileId, achievementId);
    if (existingProgress) {
      return existingProgress;
    }

    // Create new progress
    const progress = AchievementProgress.create({
      progressId: AchievementProgressId.create(),
      playerProfileId,
      achievementId,
      initialValue: 0,
    });

    const createdProgress = await this.progressRepository.create(progress);
    this.logger.info('Created achievement progress', { 
      playerProfileId, 
      achievementId,
      progressId: createdProgress.progressId 
    });

    return createdProgress;
  }

  /**
   * Updates progress for a player on an achievement.
   * Clamps progress to [0, targetValue] and auto-completes when target is reached.
   */
  async updateProgress(
    playerProfileId: string,
    achievementId: string,
    increment: number,
    targetValue: number
  ): Promise<AchievementProgress> {
    this.logger.debug('Updating achievement progress', { 
      playerProfileId, 
      achievementId, 
      increment,
      targetValue 
    });

    // Validate inputs
    if (!ProgressValidator.isValidPlayerProfileId(playerProfileId)) {
      throw new Error('Invalid player profile ID');
    }

    if (!ProgressValidator.isValidAchievementId(achievementId)) {
      throw new Error('Invalid achievement ID');
    }

    if (typeof increment !== 'number' || !Number.isFinite(increment)) {
      throw new Error('Increment must be a finite number');
    }

    if (typeof targetValue !== 'number' || targetValue < 0) {
      throw new Error('Target value must be a non-negative number');
    }

    // Get or create progress
    const progress = await this.getOrCreateProgress(playerProfileId, achievementId);

    // Cannot update claimed achievements
    if (progress.status === AchievementStatus.CLAIMED) {
      this.logger.warn('Cannot update claimed achievement', { playerProfileId, achievementId });
      return progress;
    }

    // Calculate new value with clamping
    const clampedIncrement = Math.max(0, increment);
    const newValue = Math.min(targetValue, Math.max(0, progress.currentValue + clampedIncrement));

    // Check if already completed
    if (progress.status === AchievementStatus.COMPLETED) {
      this.logger.debug('Achievement already completed', { playerProfileId, achievementId });
      return progress;
    }

    // Update progress
    const isComplete = newValue >= targetValue;
    const updatedProgress = progress.copyWith({
      currentValue: newValue,
      status: isComplete ? AchievementStatus.COMPLETED : AchievementStatus.IN_PROGRESS,
      completedAt: isComplete ? new Date() : progress.completedAt,
    });

    const savedProgress = await this.progressRepository.update(updatedProgress);

    this.logger.info('Achievement progress updated', {
      playerProfileId,
      achievementId,
      newValue,
      targetValue,
      isComplete,
    });

    return savedProgress;
  }

  /**
   * Completes an achievement for a player.
   */
  async completeAchievement(playerProfileId: string, achievementId: string): Promise<AchievementProgress> {
    this.logger.debug('Completing achievement', { playerProfileId, achievementId });

    // Get or create progress
    const progress = await this.getOrCreateProgress(playerProfileId, achievementId);

    // Cannot complete already claimed achievements
    if (progress.status === AchievementStatus.CLAIMED) {
      throw new Error('Achievement already claimed');
    }

    // Already completed
    if (progress.status === AchievementStatus.COMPLETED) {
      return progress;
    }

    // Load achievement to get target value
    const achievement = await this.achievementRepository.findById(AchievementId.reconstruct(achievementId));
    if (!achievement) {
      throw new Error(`Achievement not found: ${achievementId}`);
    }

    // Update to completed status
    const updatedProgress = progress.copyWith({
      status: AchievementStatus.COMPLETED,
      completedAt: new Date(),
    });

    const savedProgress = await this.progressRepository.update(updatedProgress);

    this.logger.info('Achievement completed', { playerProfileId, achievementId });

    return savedProgress;
  }

  /**
   * Claims an achievement reward.
   * Emits AchievementClaimRequested event - reward distribution handled by Reward Engine.
   */
  async claimAchievement(
    playerProfileId: string, 
    achievementId: string
  ): Promise<ReturnType<typeof createAchievementClaimRequestedEvent>> {
    this.logger.debug('Claiming achievement reward', { playerProfileId, achievementId });

    // Find existing progress
    const progress = await this.progressRepository.findByPlayerAndAchievement(playerProfileId, achievementId);
    if (!progress) {
      throw new Error(`No achievement progress found for player ${playerProfileId} on achievement ${achievementId}`);
    }

    // Load the achievement
    const achievement = await this.achievementRepository.findById(AchievementId.reconstruct(achievementId));
    if (!achievement) {
      throw new Error(`Achievement not found: ${achievementId}`);
    }

    // Only claim if completed
    if (progress.status !== AchievementStatus.COMPLETED) {
      throw new Error(`Achievement is not completed: ${achievementId}`);
    }

    // Update status to claimed
    const claimedProgress = progress.copyWith({
      status: AchievementStatus.CLAIMED,
      claimedAt: new Date(),
    });

    await this.progressRepository.update(claimedProgress);

    // Emit reward claimed event
    // The Reward Engine will listen to this event and distribute rewards
    const claimEvent = createAchievementClaimRequestedEvent({
      playerProfileId,
      achievementId: achievement.achievementId.value,
      slug: achievement.slug.value,
      title: achievement.title,
      category: achievement.category,
      rarity: achievement.rarity,
      points: achievement.points,
      requestedAt: new Date(),
    });

    this.logger.info('Achievement reward claimed', {
      playerProfileId,
      achievementId,
      points: achievement.points,
    });

    return claimEvent;
  }

  /**
   * Resets an achievement for a player.
   */
  async resetAchievement(playerProfileId: string, achievementId: string): Promise<AchievementProgress> {
    this.logger.debug('Resetting achievement', { playerProfileId, achievementId });

    // Find existing progress
    const progress = await this.progressRepository.findByPlayerAndAchievement(playerProfileId, achievementId);
    if (!progress) {
      throw new Error(`No achievement progress found for player ${playerProfileId} on achievement ${achievementId}`);
    }

    // Reset progress
    const resetProgress = progress.copyWith({
      currentValue: 0,
      status: AchievementStatus.LOCKED,
      completedAt: null,
      claimedAt: null,
    });

    const savedProgress = await this.progressRepository.update(resetProgress);

    this.logger.info('Achievement reset', { playerProfileId, achievementId });

    return savedProgress;
  }

  /**
   * Gets player progress for an achievement.
   */
  async getAchievementProgress(playerProfileId: string, achievementId: string): Promise<AchievementProgress | null> {
    this.logger.debug('Getting achievement progress', { playerProfileId, achievementId });
    return this.progressRepository.findByPlayerAndAchievement(playerProfileId, achievementId);
  }

  /**
   * Gets all achievements for a player with their progress.
   */
  async getAchievementsWithProgress(
    playerProfileId: string,
    params: PaginationParams = { page: 1, pageSize: 20 },
    category?: AchievementCategory
  ): Promise<{
    achievements: AchievementWithProgressResponseDto[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    this.logger.debug('Getting achievements with progress', { playerProfileId, category, params });

    // Get all achievements
    const result = await this.achievementRepository.list(params, { category });
    
    // Get player progress for all achievements
    const allProgress = await this.progressRepository.findByPlayerId(playerProfileId);
    const progressMap = new Map(allProgress.map(p => [p.achievementId, p]));

    // Combine achievements with progress
    const achievementsWithProgress: AchievementWithProgressResponseDto[] = result.items.map(achievement => {
      const progress = progressMap.get(achievement.achievementId.value);
      
      if (!progress) {
        // Player hasn't started this achievement
        return AchievementMapper.toWithProgressResponse(
          achievement,
          undefined, // progress
          undefined, // conditions
          AchievementStatus.LOCKED,
          0 // completionPercentage
        );
      }

      // Calculate completion percentage based on achievement metadata
      const targetValue = achievement.metadata.targetValue ?? 100;
      const completionPercentage = progress.currentValue / targetValue;

      return AchievementMapper.toWithProgressResponse(
        achievement,
        ProgressMapper.toResponse(progress),
        undefined, // conditions
        progress.status,
        completionPercentage
      );
    });

    return {
      achievements: achievementsWithProgress,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  }

  /**
   * Gets achievement statistics for a player.
   */
  async getAchievementStatistics(playerProfileId: string): Promise<AchievementStatisticsResponseDto> {
    this.logger.debug('Getting achievement statistics', { playerProfileId });

    // Get all progress for player
    const allProgress = await this.progressRepository.findByPlayerId(playerProfileId);

    // Get all achievements for category/rarity breakdown
    const allAchievements = await this.achievementRepository.findActive();
    const achievementMap = new Map(allAchievements.map(a => [a.achievementId.value, a]));

    // Calculate statistics
    let totalUnlocked = 0;
    let totalClaimed = 0;
    let totalPoints = 0;
    const byCategory: Record<string, number> = {};
    const byRarity: Record<string, number> = {};
    let currentStreak = 0;
    let longestStreak = 0;
    let lastClaimedAt: string | null = null;

    for (const progress of allProgress) {
      const achievement = achievementMap.get(progress.achievementId);
      if (!achievement) continue;

      if (progress.status === AchievementStatus.COMPLETED || progress.status === AchievementStatus.CLAIMED) {
        totalUnlocked++;
        
        if (progress.status === AchievementStatus.CLAIMED) {
          totalClaimed++;
          totalPoints += achievement.points;
          
          // Track by category
          byCategory[achievement.category] = (byCategory[achievement.category] ?? 0) + 1;
          
          // Track by rarity
          byRarity[achievement.rarity] = (byRarity[achievement.rarity] ?? 0) + 1;

          // Track last claimed
          if (progress.claimedAt) {
            const claimedDate = progress.claimedAt.toISOString();
            if (!lastClaimedAt || claimedDate > lastClaimedAt) {
              lastClaimedAt = claimedDate;
            }
          }
        }
      }
    }

    // Calculate streak (simplified - would need more complex logic for actual streak tracking)
    currentStreak = 0;
    longestStreak = 0;

    return {
      totalUnlocked,
      totalClaimed,
      totalPoints,
      byCategory,
      byRarity,
      currentStreak,
      longestStreak,
      lastClaimedAt,
    };
  }

  /**
   * Gets claimable achievements for a player.
   */
  async getClaimableAchievements(playerProfileId: string): Promise<AchievementProgress[]> {
    this.logger.debug('Getting claimable achievements', { playerProfileId });
    return this.progressRepository.findClaimable(playerProfileId);
  }

  /**
   * Initializes achievements for a new player.
   * Creates starter and hidden achievements with default progress.
   */
  async initializePlayerAchievements(playerProfileId: string): Promise<AchievementProgress[]> {
    this.logger.debug('Initializing player achievements', { playerProfileId });

    // Validate player profile ID
    if (!ProgressValidator.isValidPlayerProfileId(playerProfileId)) {
      throw new Error('Invalid player profile ID');
    }

    // Get all active achievements
    const activeAchievements = await this.achievementRepository.findActive();

    // Get existing progress
    const existingProgress = await this.progressRepository.findByPlayerId(playerProfileId);
    const existingAchievementIds = new Set(existingProgress.map(p => p.achievementId));

    // Create progress for achievements that don't have one
    const newProgress: AchievementProgress[] = [];

    for (const achievement of activeAchievements) {
      if (existingAchievementIds.has(achievement.achievementId.value)) {
        continue;
      }

      const progress = AchievementProgress.create({
        progressId: AchievementProgressId.create(),
        playerProfileId,
        achievementId: achievement.achievementId.value,
        initialValue: 0,
      });

      const created = await this.progressRepository.create(progress);
      newProgress.push(created);
    }

    this.logger.info('Player achievements initialized', { 
      playerProfileId, 
      count: newProgress.length 
    });

    return newProgress;
  }

  /**
   * Lists achievements with pagination.
   */
  async listAchievements(
    params: PaginationParams,
    filters?: { category?: AchievementCategory; isActive?: boolean; isHidden?: boolean }
  ): Promise<PaginatedResult<Achievement>> {
    this.logger.debug('Listing achievements', { params, filters });
    return this.achievementRepository.list(params, filters);
  }

  /**
   * Counts achievements.
   */
  async countAchievements(
    filters?: { category?: AchievementCategory; isActive?: boolean }
  ): Promise<number> {
    this.logger.debug('Counting achievements', { filters });
    return this.achievementRepository.count(filters);
  }

  /**
   * Processes an event to update achievement progress.
   * Supports the following event types:
   * - ArtifactOpened
   * - ArtifactCollected
   * - MuseumExhibitPlaced
   * - MuseumCompleted
   * - ResearchCompleted
   * - QuestCompleted
   * - CurrencyEarned
   * - InventoryExpanded
   * - Login
   * - PlaySession
   */
  async processEvent(
    eventType: string,
    playerProfileId: string,
    eventData: Record<string, unknown>
  ): Promise<void> {
    this.logger.debug('Processing achievement event', { eventType, playerProfileId });

    // Get all active achievements that could be affected by this event
    const activeAchievements = await this.achievementRepository.findActive();

    for (const achievement of activeAchievements) {
      // Check if this achievement is related to the event type
      const isRelated = this.isAchievementRelatedToEvent(achievement, eventType, eventData);
      
      if (!isRelated) {
        continue;
      }

      // Get the target value for this achievement
      const targetValue = achievement.metadata.targetValue ?? 1;

      // Determine the increment based on event type
      const increment = this.getIncrementForEvent(achievement, eventType, eventData);

      if (increment > 0) {
        await this.updateProgress(playerProfileId, achievement.achievementId.value, increment, targetValue);
      }
    }
  }

  /**
   * Checks if an achievement is related to a given event type.
   */
  private isAchievementRelatedToEvent(
    achievement: Achievement,
    eventType: string,
    eventData: Record<string, unknown>
  ): boolean {
    // Check category alignment
    const categoryEventMap: Record<string, string[]> = {
      'collection': ['ArtifactOpened', 'ArtifactCollected', 'InventoryExpanded'],
      'museum': ['MuseumExhibitPlaced', 'MuseumCompleted'],
      'research': ['ResearchCompleted'],
      'economy': ['CurrencyEarned', 'InventoryExpanded'],
      'progression': ['QuestCompleted', 'Login', 'PlaySession'],
      'exploration': ['QuestCompleted', 'PlaySession'],
      'social': [], // Would have social events
      'combat': [], // Would have combat events
      'special': [], // Special events
      'temporal': ['Login', 'PlaySession'], // Time-based
    };

    const relatedEvents = categoryEventMap[achievement.category] ?? [];
    
    if (!relatedEvents.includes(eventType)) {
      return false;
    }

    // Check if achievement has specific target requirements
    const targetCategory = achievement.metadata.targetCategory;
    if (targetCategory && eventData.category) {
      return targetCategory === eventData.category;
    }

    const targetId = achievement.metadata.targetId;
    if (targetId && eventData.targetId) {
      return targetId === eventData.targetId;
    }

    return true;
  }

  /**
   * Gets the increment value for an event.
   */
  private getIncrementForEvent(
    achievement: Achievement,
    eventType: string,
    eventData: Record<string, unknown>
  ): number {
    switch (eventType) {
      case 'ArtifactOpened':
      case 'ArtifactCollected':
      case 'MuseumExhibitPlaced':
      case 'QuestCompleted':
      case 'ResearchCompleted':
      case 'InventoryExpanded':
        return 1;

      case 'CurrencyEarned': {
        // Check if there's a minimum amount requirement
        const minAmount = achievement.metadata.minAmount ?? 0;
        const earnedAmount = (eventData.amount as number) ?? 0;
        return earnedAmount >= minAmount ? 1 : 0;
      }

      case 'Login':
      case 'PlaySession':
        return 1;

      default:
        return 0;
    }
  }
}

/**
 * Creates an AchievementService with dependencies.
 */
export function createAchievementService(
  achievementRepository: IAchievementRepository,
  progressRepository: IAchievementProgressRepository
): AchievementService {
  return new AchievementService(achievementRepository, progressRepository);
}
