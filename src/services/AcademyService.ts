/**
 * Academy Service
 *
 * Service layer for Academy domain operations.
 * Handles business logic for research, unlocks, and academy management.
 * Academy does NOT modify Currency, Inventory, Artifacts, Museum, or Player Profile.
 */

import { Academy } from '../domains/academy/entities/Academy';
import { ResearchNode } from '../domains/academy/entities/ResearchNode';
import { ResearchProgress } from '../domains/academy/entities/ResearchProgress';
import type { AcademyStatistics } from '../domains/academy/types/AcademyStatistics';
import type { ResearchCategory } from '../domains/academy/types/ResearchCategory';
import type { ResearchTier } from '../domains/academy/types/ResearchTier';
import type { ResearchStatus } from '../domains/academy/types/ResearchStatus';
import type { UnlockType } from '../domains/academy/types/UnlockType';
import type { AcademyResponseDto, AcademySummaryDto, AcademyDetailDto } from '../domains/academy/dto/AcademyResponse.dto';
import type { ResearchNodeDto, ResearchNodeSummaryDto } from '../domains/academy/dto/ResearchNode.dto';
import type { ResearchProgressDto, ActiveResearchDto } from '../domains/academy/dto/ResearchProgress.dto';
import type { AcademyMetadata } from '../domains/academy/types/AcademyMetadata';
import { AcademyId } from '../domains/academy/value-objects/AcademyId';
import { ResearchNodeId } from '../domains/academy/value-objects/ResearchNodeId';
import { ResearchPoints } from '../domains/academy/value-objects/ResearchPoints';
import { ResearchProgressValue } from '../domains/academy/value-objects/ResearchProgressValue';
import { PlayerProfileId } from '../domains/player-profile/value-objects/PlayerProfileId';
import { createInitialAcademyStatistics } from '../domains/academy/types/AcademyStatistics';
import { ResearchValidator, ResearchPointsValidator, ResearchTreeValidator } from '../domains/academy/validators';
import { AcademyMapper } from '../domains/academy/mappers/AcademyMapper';
import { ResearchMapper } from '../domains/academy/mappers/ResearchMapper';
import { SupabaseAcademyRepository } from '../domains/academy/repositories/SupabaseAcademyRepository';
import { createLogger } from '../core/logging/logger.service';
import { ResearchCategory as ResearchCategoryEnum } from '../domains/academy/types/ResearchCategory';
import { ResearchTier as ResearchTierEnum } from '../domains/academy/types/ResearchTier';
import { ResearchStatus as ResearchStatusEnum } from '../domains/academy/types/ResearchStatus';
import { UnlockType as UnlockTypeEnum } from '../domains/academy/types/UnlockType';

const logger = createLogger('AcademyService');

/**
 * Result of starting a research operation.
 */
export interface StartResearchResult {
  success: boolean;
  progress?: ResearchProgress;
  error?: string;
}

/**
 * Result of completing a research operation.
 */
export interface CompleteResearchResult {
  success: boolean;
  progress?: ResearchProgress;
  unlockedNodeIds?: string[];
  error?: string;
}

/**
 * Result of unlocking a node.
 */
export interface UnlockNodeResult {
  success: boolean;
  nodeId?: string;
  error?: string;
}

/**
 * Technology tree summary.
 */
export interface TechnologyTreeSummary {
  totalNodes: number;
  completedNodes: number;
  inProgressNodes: number;
  availableNodes: number;
  lockedNodes: number;
  nodesByCategory: Record<string, number>;
  nodesByTier: Record<string, number>;
  completionPercentage: number;
}

/**
 * Research summary for a player.
 */
export interface ResearchSummary {
  totalResearch: number;
  completedResearch: number;
  inProgressResearch: number;
  availableResearch: number;
  lockedResearch: number;
  totalPointsSpent: number;
  totalPointsAvailable: number;
  mostResearchedCategory: ResearchCategory | null;
  highestTierCompleted: ResearchTier | null;
}

/**
 * Academy Service for managing research progression.
 */
export class AcademyService {
  private readonly repository: SupabaseAcademyRepository;
  private readonly academyMapper: AcademyMapper;
  private readonly researchMapper: ResearchMapper;
  private readonly researchValidator: ResearchValidator;
  private readonly pointsValidator: ResearchPointsValidator;
  private readonly treeValidator: ResearchTreeValidator;

  // Predefined research nodes for the technology tree
  private readonly researchNodes: Map<string, ResearchNode> = new Map();

  constructor(repository: SupabaseAcademyRepository) {
    this.repository = repository;
    this.academyMapper = new AcademyMapper();
    this.researchMapper = new ResearchMapper();
    this.researchValidator = new ResearchValidator();
    this.pointsValidator = new ResearchPointsValidator();
    this.treeValidator = new ResearchTreeValidator();

    // Initialize predefined research tree
    this.initializeResearchTree();
  }

  /**
   * Initializes the predefined research tree.
   * This defines all available research nodes in the game.
   */
  private initializeResearchTree(): void {
    // First, create all nodes without prerequisites
    const nodeDefinitions: Array<{
      slug: string;
      title: string;
      description: string;
      category: ResearchCategoryEnum;
      tier: ResearchTierEnum;
      cost: number;
      unlockType: UnlockTypeEnum;
      requiredSlugs: string[];
    }> = [
      // Tier 1 - History
      { slug: 'ancient-egypt', title: 'Ancient Egypt', description: 'Explore the mysteries of ancient Egyptian civilization', category: ResearchCategoryEnum.HISTORY, tier: ResearchTierEnum.TIER_1, cost: 0, unlockType: UnlockTypeEnum.DEFAULT, requiredSlugs: [] },
      { slug: 'mesopotamia', title: 'Mesopotamia', description: 'Study the cradle of civilization', category: ResearchCategoryEnum.HISTORY, tier: ResearchTierEnum.TIER_1, cost: 0, unlockType: UnlockTypeEnum.DEFAULT, requiredSlugs: [] },
      { slug: 'ancient-greece', title: 'Ancient Greece', description: 'Discover Greek philosophy and democracy', category: ResearchCategoryEnum.HISTORY, tier: ResearchTierEnum.TIER_1, cost: 0, unlockType: UnlockTypeEnum.DEFAULT, requiredSlugs: [] },

      // Tier 1 - Science
      { slug: 'basic-mathematics', title: 'Basic Mathematics', description: 'Foundation of numerical understanding', category: ResearchCategoryEnum.SCIENCE, tier: ResearchTierEnum.TIER_1, cost: 0, unlockType: UnlockTypeEnum.DEFAULT, requiredSlugs: [] },
      { slug: 'basic-astronomy', title: 'Basic Astronomy', description: 'Introduction to celestial bodies', category: ResearchCategoryEnum.SCIENCE, tier: ResearchTierEnum.TIER_1, cost: 0, unlockType: UnlockTypeEnum.DEFAULT, requiredSlugs: [] },

      // Tier 1 - Culture
      { slug: 'oral-traditions', title: 'Oral Traditions', description: 'Study of spoken stories and history', category: ResearchCategoryEnum.CULTURE, tier: ResearchTierEnum.TIER_1, cost: 0, unlockType: UnlockTypeEnum.DEFAULT, requiredSlugs: [] },
      { slug: 'cave-paintings', title: 'Cave Paintings', description: 'Early human artistic expression', category: ResearchCategoryEnum.CULTURE, tier: ResearchTierEnum.TIER_1, cost: 0, unlockType: UnlockTypeEnum.DEFAULT, requiredSlugs: [] },

      // Tier 2 - Requires Tier 1
      { slug: 'roman-empire', title: 'Roman Empire', description: 'Study the rise and fall of Rome', category: ResearchCategoryEnum.HISTORY, tier: ResearchTierEnum.TIER_2, cost: 100, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['ancient-egypt', 'ancient-greece'] },
      { slug: 'chinese-civilization', title: 'Chinese Civilization', description: 'Explore ancient Chinese history', category: ResearchCategoryEnum.HISTORY, tier: ResearchTierEnum.TIER_2, cost: 100, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['ancient-egypt'] },
      { slug: 'algebra', title: 'Algebra', description: 'Introduction to algebraic thinking', category: ResearchCategoryEnum.SCIENCE, tier: ResearchTierEnum.TIER_2, cost: 100, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['basic-mathematics'] },
      { slug: 'navigation', title: 'Navigation', description: 'Art of finding direction', category: ResearchCategoryEnum.SCIENCE, tier: ResearchTierEnum.TIER_2, cost: 100, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['basic-astronomy'] },

      // Tier 3 - Requires Tier 2
      { slug: 'medieval-history', title: 'Medieval History', description: 'Study of the Middle Ages', category: ResearchCategoryEnum.HISTORY, tier: ResearchTierEnum.TIER_3, cost: 250, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['roman-empire'] },
      { slug: 'calculus', title: 'Calculus', description: 'Advanced mathematical analysis', category: ResearchCategoryEnum.SCIENCE, tier: ResearchTierEnum.TIER_3, cost: 250, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['algebra'] },
      { slug: 'renaissance-art', title: 'Renaissance Art', description: 'Study of Renaissance artistic achievements', category: ResearchCategoryEnum.CULTURE, tier: ResearchTierEnum.TIER_3, cost: 250, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['cave-paintings'] },

      // Tier 4 - Requires Tier 3
      { slug: 'industrial-revolution', title: 'Industrial Revolution', description: 'Study the age of machines', category: ResearchCategoryEnum.HISTORY, tier: ResearchTierEnum.TIER_4, cost: 500, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['medieval-history'] },
      { slug: 'modern-physics', title: 'Modern Physics', description: 'Quantum mechanics and relativity', category: ResearchCategoryEnum.SCIENCE, tier: ResearchTierEnum.TIER_4, cost: 500, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['calculus'] },
      { slug: 'world-wars', title: 'World Wars', description: 'Study of 20th century conflicts', category: ResearchCategoryEnum.HISTORY, tier: ResearchTierEnum.TIER_4, cost: 500, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['industrial-revolution'] },

      // Tier 5 - Requires Tier 4
      { slug: 'digital-age', title: 'Digital Age', description: 'Understanding the computer era', category: ResearchCategoryEnum.HISTORY, tier: ResearchTierEnum.TIER_5, cost: 1000, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['world-wars'] },
      { slug: 'space-exploration', title: 'Space Exploration', description: 'Humanity reaches for the stars', category: ResearchCategoryEnum.SCIENCE, tier: ResearchTierEnum.TIER_5, cost: 1000, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['modern-physics', 'navigation'] },
      { slug: 'future-studies', title: 'Future Studies', description: 'Predicting and shaping tomorrow', category: ResearchCategoryEnum.HISTORY, tier: ResearchTierEnum.TIER_5, cost: 1000, unlockType: UnlockTypeEnum.RESEARCH_COMPLETION, requiredSlugs: ['digital-age', 'space-exploration'] },
    ];

    // First pass: create all nodes with empty prerequisites and add to map
    for (const def of nodeDefinitions) {
      const node = ResearchNode.create({
        nodeId: ResearchNodeId.generate(),
        slug: def.slug,
        title: def.title,
        description: def.description,
        category: def.category,
        tier: def.tier,
        requiredNodes: [],
        researchCost: def.cost,
        unlockType: def.unlockType,
      });
      this.researchNodes.set(def.slug, node);
    }

    // Second pass: update prerequisites for nodes that need them
    for (const def of nodeDefinitions) {
      if (def.requiredSlugs.length > 0) {
        const node = this.researchNodes.get(def.slug);
        if (node) {
          const requiredNodes = def.requiredSlugs
            .map((s) => {
              const reqNode = this.researchNodes.get(s);
              return reqNode ? reqNode.nodeId : null;
            })
            .filter((id): id is ResearchNodeId => id !== null);

          // Create a new node with the proper prerequisites
          const updatedNode = node.copyWith({ requiredNodes });
          this.researchNodes.set(def.slug, updatedNode);
        }
      }
    }
  }

  // ==================== Academy Management ====================

  /**
   * Creates a new Academy for a player profile.
   */
  async createAcademy(playerProfileId: string): Promise<Academy> {
    logger.info('Creating academy for player profile', { playerProfileId });

    // Check if academy already exists
    const existingAcademy = await this.repository.findByPlayerProfileId(playerProfileId);
    if (existingAcademy) {
      logger.warn('Academy already exists for player profile', { playerProfileId });
      return existingAcademy;
    }

    // Create new academy with default values
    const academyId = AcademyId.generate();
    const profileId = PlayerProfileId.create(playerProfileId);
    const academy = Academy.create({
      academyId,
      playerProfileId: profileId,
      initialResearchPoints: 0,
      metadata: this.getDefaultMetadata(),
    });

    return this.repository.create(academy);
  }

  /**
   * Gets an academy by ID.
   */
  async getAcademy(academyId: AcademyId): Promise<Academy | null> {
    return this.repository.findById(academyId);
  }

  /**
   * Gets an academy by player profile ID.
   */
  async getAcademyByPlayerProfileId(playerProfileId: string): Promise<Academy | null> {
    return this.repository.findByPlayerProfileId(playerProfileId);
  }

  /**
   * Loads an academy with validation.
   */
  async loadAcademy(academyId: AcademyId): Promise<Academy> {
    const academy = await this.repository.findById(academyId);
    if (!academy) {
      throw new Error(`Academy not found: ${academyId.value}`);
    }
    return academy;
  }

  /**
   * Gets the default metadata for a new academy.
   */
  private getDefaultMetadata(): AcademyMetadata {
    return {
      researchSlots: 1,
      totalPointsEarned: 0,
      totalResearchTime: 0,
      categoriesExplored: [],
      highestTierReached: 1,
      researchStreak: 0,
    };
  }

  // ==================== Research Operations ====================

  /**
   * Starts a new research for the academy.
   */
  async startResearch(academyId: AcademyId, nodeSlug: string): Promise<StartResearchResult> {
    logger.info('Starting research', { academyId: academyId.value, nodeSlug });

    // Get academy
    const academy = await this.loadAcademy(academyId);

    // Get research node
    const node = this.researchNodes.get(nodeSlug);
    if (!node) {
      return { success: false, error: `Research node not found: ${nodeSlug}` };
    }

    // Check if research is already in progress
    const existingProgress = await this.repository.findProgressByNodeAndAcademy(academyId, node.nodeId.value);
    if (existingProgress) {
      if (existingProgress.status === 'completed') {
        return { success: false, error: 'Research already completed' };
      }
      if (existingProgress.status === 'in_progress') {
        return { success: false, error: 'Research already in progress' };
      }
    }

    // Get all progress for prerequisite checking
    const allProgress = await this.repository.findProgressByAcademyId(academyId);

    // Validate prerequisites
    if (!ResearchTreeValidator.arePrerequisitesSatisfied(node, this.getCompletedNodeIds(allProgress))) {
      return { success: false, error: 'Prerequisites not met' };
    }

    // Validate level requirement
    if (!ResearchTreeValidator.isLevelRequirementMet(node, academy.academyLevel)) {
      return { success: false, error: 'Academy level too low' };
    }

    // Create new progress entry
    const progress = ResearchProgress.create({
      progressId: `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      academyId,
      nodeId: node.nodeId,
      initialStatus: 'in_progress' as ResearchStatus,
    });

    // Update progress to reflect actual starting state
    const startedProgress = progress.copyWith({
      status: 'in_progress' as ResearchStatus,
      progress: ResearchProgressValue.reconstruct(0),
    });

    const createdProgress = await this.repository.createProgress(startedProgress);

    logger.info('Research started successfully', {
      academyId: academyId.value,
      nodeSlug,
      progressId: createdProgress.progressId,
    });

    return { success: true, progress: createdProgress };
  }

  /**
   * Updates research progress.
   */
  async updateResearchProgress(academyId: AcademyId, nodeSlug: string, progressAmount: number): Promise<ResearchProgress | null> {
    logger.debug('Updating research progress', { academyId: academyId.value, nodeSlug, progressAmount });

    const node = this.researchNodes.get(nodeSlug);
    if (!node) {
      logger.error('Research node not found', undefined, { nodeSlug });
      return null;
    }

    const progress = await this.repository.findProgressByNodeAndAcademy(academyId, node.nodeId.value);
    if (!progress) {
      logger.error('Progress not found', undefined, { academyId: academyId.value, nodeSlug });
      return null;
    }

    if (progress.status !== 'in_progress') {
      logger.error('Research not in progress', undefined, { status: progress.status });
      return null;
    }

    // Calculate new progress
    const currentProgress = progress.progress.value;
    const newProgress = Math.min(100, currentProgress + progressAmount);

    // Update progress
    const updatedProgress = progress.copyWith({
      progress: ResearchProgressValue.reconstruct(newProgress),
    });

    return this.repository.updateProgress(updatedProgress);
  }

  /**
   * Completes a research.
   */
  async completeResearch(academyId: AcademyId, nodeSlug: string): Promise<CompleteResearchResult> {
    logger.info('Completing research', { academyId: academyId.value, nodeSlug });

    const node = this.researchNodes.get(nodeSlug);
    if (!node) {
      return { success: false, error: `Research node not found: ${nodeSlug}` };
    }

    const progress = await this.repository.findProgressByNodeAndAcademy(academyId, node.nodeId.value);
    if (!progress) {
      return { success: false, error: 'Research not found' };
    }

    if (progress.status === 'completed') {
      return { success: false, error: 'Research already completed' };
    }

    // Load academy to get level
    const academy = await this.loadAcademy(academyId);

    // Complete the research
    const completedProgress = progress.copyWith({
      status: 'completed' as ResearchStatus,
      progress: ResearchProgressValue.reconstruct(100),
      completedAt: new Date(),
    });

    const savedProgress = await this.repository.updateProgress(completedProgress);

    // Find newly unlocked nodes
    const allProgress = await this.repository.findProgressByAcademyId(academyId);
    const unlockedNodeIds = this.findUnlockedNodes(allProgress, academy.academyLevel);

    logger.info('Research completed successfully', {
      academyId: academyId.value,
      nodeSlug,
      progressId: savedProgress.progressId,
      unlockedNodes: unlockedNodeIds.length,
    });

    return {
      success: true,
      progress: savedProgress,
      unlockedNodeIds,
    };
  }

  /**
   * Cancels an in-progress research.
   */
  async cancelResearch(academyId: AcademyId, nodeSlug: string): Promise<ResearchProgress | null> {
    logger.info('Cancelling research', { academyId: academyId.value, nodeSlug });

    const node = this.researchNodes.get(nodeSlug);
    if (!node) {
      logger.error('Research node not found', undefined, { nodeSlug });
      return null;
    }

    const progress = await this.repository.findProgressByNodeAndAcademy(academyId, node.nodeId.value);
    if (!progress) {
      logger.error('Progress not found', undefined, { academyId: academyId.value, nodeSlug });
      return null;
    }

    if (progress.status !== 'in_progress') {
      logger.error('Research not in progress', undefined, { status: progress.status });
      return null;
    }

    // Reset progress
    const cancelledProgress = progress.copyWith({
      status: 'available' as ResearchStatus,
      progress: ResearchProgressValue.reconstruct(0),
    });

    return this.repository.updateProgress(cancelledProgress);
  }

  /**
   * Resets a research (allows restarting from beginning).
   */
  async resetResearch(academyId: AcademyId, nodeSlug: string): Promise<ResearchProgress | null> {
    logger.info('Resetting research', { academyId: academyId.value, nodeSlug });

    const node = this.researchNodes.get(nodeSlug);
    if (!node) {
      logger.error('Research node not found', undefined, { nodeSlug });
      return null;
    }

    const progress = await this.repository.findProgressByNodeAndAcademy(academyId, node.nodeId.value);
    if (!progress) {
      logger.error('Progress not found', undefined, { academyId: academyId.value, nodeSlug });
      return null;
    }

    // Reset to initial state
    const resetProgress = progress.copyWith({
      status: 'available' as ResearchStatus,
      progress: ResearchProgressValue.reconstruct(0),
      completedAt: null,
    });

    return this.repository.updateProgress(resetProgress);
  }

  /**
   * Gets all research progress for an academy.
   */
  async listResearch(academyId: AcademyId): Promise<ResearchProgress[]> {
    return this.repository.findProgressByAcademyId(academyId);
  }

  // ==================== Unlock System ====================

  /**
   * Checks and returns nodes that can be unlocked.
   */
  async getUnlockableNodes(academyId: AcademyId): Promise<string[]> {
    const academy = await this.loadAcademy(academyId);
    const allProgress = await this.repository.findProgressByAcademyId(academyId);

    const nodes = Array.from(this.researchNodes.values());
    return ResearchTreeValidator.getUnlockableNodes(nodes, allProgress, academy.academyLevel);
  }

  /**
   * Unlocks a research node (changes status from locked to available).
   */
  async unlockNode(academyId: AcademyId, nodeSlug: string): Promise<UnlockNodeResult> {
    logger.info('Unlocking node', { academyId: academyId.value, nodeSlug });

    const node = this.researchNodes.get(nodeSlug);
    if (!node) {
      return { success: false, error: `Research node not found: ${nodeSlug}` };
    }

    // Check if already unlocked or completed
    const progress = await this.repository.findProgressByNodeAndAcademy(academyId, node.nodeId.value);
    if (progress && (progress.status === 'completed' || progress.status === 'available')) {
      return { success: false, error: 'Node already unlocked or completed' };
    }

    // Validate prerequisites
    const allProgress = await this.repository.findProgressByAcademyId(academyId);
    const completedNodeIds = this.getCompletedNodeIds(allProgress);

    if (!ResearchTreeValidator.arePrerequisitesSatisfied(node, completedNodeIds)) {
      return { success: false, error: 'Prerequisites not met' };
    }

    // Create or update progress to available status
    if (progress) {
      const updatedProgress = progress.copyWith({
        status: 'available' as ResearchStatus,
      });
      await this.repository.updateProgress(updatedProgress);
    } else {
      const newProgress = ResearchProgress.create({
        progressId: `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        academyId,
        nodeId: node.nodeId,
        initialStatus: 'available' as ResearchStatus,
      });
      await this.repository.createProgress(newProgress);
    }

    logger.info('Node unlocked successfully', { academyId: academyId.value, nodeSlug });
    return { success: true, nodeId: node.nodeId.value };
  }

  /**
   * Finds nodes that become unlocked after completing a research.
   */
  private findUnlockedNodes(progress: ResearchProgress[], academyLevel: number): string[] {
    const completedNodeIds = this.getCompletedNodeIds(progress);
    const nodes = Array.from(this.researchNodes.values());
    return ResearchTreeValidator.getUnlockableNodes(nodes, progress, academyLevel);
  }

  /**
   * Gets completed node IDs from progress list.
   */
  private getCompletedNodeIds(progress: ResearchProgress[]): Set<string> {
    const completedNodeIds = new Set<string>();
    for (const p of progress) {
      if (p.status === 'completed') {
        completedNodeIds.add(p.nodeId.value);
      }
    }
    return completedNodeIds;
  }

  // ==================== Statistics and Summaries ====================

  /**
   * Gets research statistics for an academy.
   */
  async getResearchStatistics(academyId: AcademyId): Promise<AcademyStatistics> {
    const academy = await this.loadAcademy(academyId);
    const allProgress = await this.repository.findProgressByAcademyId(academyId);

    const stats = createInitialAcademyStatistics();
    stats.academyLevel = academy.academyLevel;
    stats.currentPoints = academy.researchPoints.amount;

    for (const progress of allProgress) {
      if (progress.status === 'completed') {
        stats.totalResearchCompleted++;
      }
    }

    return stats;
  }

  /**
   * Gets a research summary.
   */
  async getResearchSummary(academyId: AcademyId): Promise<ResearchSummary> {
    const academy = await this.loadAcademy(academyId);
    const allProgress = await this.repository.findProgressByAcademyId(academyId);

    let completedResearch = 0;
    let inProgressResearch = 0;
    let availableResearch = 0;
    let lockedResearch = 0;
    const categoryCount: Partial<Record<ResearchCategory, number>> = {};
    let highestTierCompleted: ResearchTier | null = null;

    for (const progress of allProgress) {
      switch (progress.status) {
        case 'completed':
          completedResearch++;
          break;
        case 'in_progress':
          inProgressResearch++;
          break;
        case 'available':
          availableResearch++;
          break;
        case 'locked':
          lockedResearch++;
          break;
      }

      // Find node details
      const node = this.findNodeById(progress.nodeId.value);
      if (node) {
        categoryCount[node.category] = (categoryCount[node.category] ?? 0) + 1;
        if (progress.status === 'completed' && (!highestTierCompleted || node.tier > highestTierCompleted)) {
          highestTierCompleted = node.tier;
        }
      }
    }

    // Find most researched category
    let mostResearchedCategory: ResearchCategory | null = null;
    let maxCount = 0;
    for (const [category, count] of Object.entries(categoryCount)) {
      if (count > maxCount) {
        mostResearchedCategory = category as ResearchCategory;
        maxCount = count;
      }
    }

    return {
      totalResearch: this.researchNodes.size,
      completedResearch,
      inProgressResearch,
      availableResearch,
      lockedResearch,
      totalPointsSpent: 0, // Calculated from completed research
      totalPointsAvailable: academy.researchPoints.amount,
      mostResearchedCategory,
      highestTierCompleted,
    };
  }

  /**
   * Gets technology tree summary.
   */
  async getTechnologyTreeSummary(academyId: AcademyId): Promise<TechnologyTreeSummary> {
    const academy = await this.loadAcademy(academyId);
    const allProgress = await this.repository.findProgressByAcademyId(academyId);

    let completedNodes = 0;
    let inProgressNodes = 0;
    let availableNodes = 0;
    let lockedNodes = 0;
    const nodesByCategory: Record<string, number> = {};
    const nodesByTier: Record<string, number> = {};

    const nodes = Array.from(this.researchNodes.values());
    const completedNodeIds = this.getCompletedNodeIds(allProgress);
    const inProgressNodeIds = new Set(
      allProgress.filter((p) => p.status === 'in_progress').map((p) => p.nodeId.value)
    );
    const availableNodeIds = new Set(
      allProgress.filter((p) => p.status === 'available').map((p) => p.nodeId.value)
    );

    for (const node of nodes) {
      const nodeId = node.nodeId.value;

      if (completedNodeIds.has(nodeId)) {
        completedNodes++;
      } else if (inProgressNodeIds.has(nodeId)) {
        inProgressNodes++;
      } else if (availableNodeIds.has(nodeId)) {
        availableNodes++;
      } else {
        // Check if prerequisites are met
        if (ResearchTreeValidator.arePrerequisitesSatisfied(node, completedNodeIds) &&
            ResearchTreeValidator.isLevelRequirementMet(node, academy.academyLevel)) {
          availableNodes++;
        } else {
          lockedNodes++;
        }
      }

      nodesByCategory[node.category] = (nodesByCategory[node.category] ?? 0) + 1;
      nodesByTier[String(node.tier)] = (nodesByTier[String(node.tier)] ?? 0) + 1;
    }

    const totalNodes = this.researchNodes.size;
    const completionPercentage = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;

    return {
      totalNodes,
      completedNodes,
      inProgressNodes,
      availableNodes,
      lockedNodes,
      nodesByCategory,
      nodesByTier,
      completionPercentage,
    };
  }

  // ==================== Node Queries ====================

  /**
   * Gets all available research nodes.
   */
  getAllResearchNodes(): ResearchNode[] {
    return Array.from(this.researchNodes.values());
  }

  /**
   * Gets a research node by slug.
   */
  getResearchNode(slug: string): ResearchNode | undefined {
    return this.researchNodes.get(slug);
  }

  /**
   * Finds a node by its ID.
   */
  private findNodeById(nodeId: string): ResearchNode | undefined {
    for (const node of this.researchNodes.values()) {
      if (node.nodeId.value === nodeId) {
        return node;
      }
    }
    return undefined;
  }

  // ==================== DTO Conversions ====================

  /**
   * Converts an academy to a response DTO.
   */
  toAcademyResponse(academy: Academy): AcademyResponseDto {
    return AcademyMapper.toResponse(academy);
  }

  /**
   * Converts an academy to a summary DTO.
   */
  toAcademySummary(academy: Academy): AcademySummaryDto {
    return AcademyMapper.toSummary(academy);
  }

  /**
   * Converts an academy to a detail DTO.
   */
  async toAcademyDetail(academy: Academy): Promise<AcademyDetailDto> {
    const stats = await this.getResearchStatistics(academy.academyId);
    const totalCompleted = stats.totalResearchCompleted;
    return AcademyMapper.toDetail(academy, stats, totalCompleted);
  }

  /**
   * Converts a research node to a DTO.
   */
  toNodeResponse(node: ResearchNode): ResearchNodeDto {
    return ResearchMapper.toNodeResponse(node);
  }

  /**
   * Converts a research node to a summary DTO.
   */
  toNodeSummary(node: ResearchNode): ResearchNodeSummaryDto {
    return ResearchMapper.toNodeSummary(node);
  }

  /**
   * Converts research progress to a DTO.
   */
  toProgressResponse(progress: ResearchProgress): ResearchProgressDto {
    return ResearchMapper.toProgressResponse(progress);
  }

  /**
   * Converts research progress to an active research DTO.
   */
  toActiveResearch(progress: ResearchProgress): ActiveResearchDto | null {
    const node = this.findNodeById(progress.nodeId.value);
    if (!node) return null;
    return ResearchMapper.toActiveResearch(progress, node);
  }
}
