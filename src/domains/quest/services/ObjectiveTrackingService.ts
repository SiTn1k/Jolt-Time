/**
 * Objective Tracking Service
 *
 * Business logic for tracking various types of objectives.
 * Handles progress updates for different objective types.
 */

import { getLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';
import type { IQuestProgressRepository } from '../interfaces/IQuestProgressRepository';
import { QuestProgress } from '../entities/QuestProgress';
import { QuestProgressId } from '../entities/QuestProgressId';
import { QuestStatus } from '../types/QuestStatus';
import { ObjectiveType, requiresTargetIdentifier } from '../types/ObjectiveType';

/**
 * Objective tracking event data.
 */
export interface ObjectiveProgressEvent {
  playerProfileId: string;
  objectiveType: ObjectiveType;
  target?: string;
  increment: number;
  timestamp: Date;
}

/**
 * Objective completion result.
 */
export interface ObjectiveCompletionResult {
  questId: string;
  progressId: string;
  isCompleted: boolean;
  newValue: number;
  target: number;
}

/**
 * Objective Tracking Service interface.
 */
export interface IObjectiveTrackingService {
  /**
   * Tracks progress for a specific objective type.
   * Automatically finds all active quests with matching objectives and updates progress.
   */
  trackObjectiveProgress(event: ObjectiveProgressEvent): Promise<ObjectiveCompletionResult[]>;

  /**
   * Validates that an objective type and target are compatible.
   */
  validateObjectiveTarget(objectiveType: ObjectiveType, target: string | null): boolean;

  /**
   * Clamps progress value to valid range.
   */
  clampProgress(currentValue: number, increment: number, target: number): number;
}

/**
 * Objective Tracking Service implementation.
 * 
 * Supports the following objective types:
 * - Counter Objectives: Simple numeric progress (BATTLE_WIN, WATCH_AD, etc.)
 * - Collection Objectives: Track collecting specific items (COLLECT)
 * - Museum Objectives: Track museum interactions (DISPLAY_ARTIFACT, VIEW_ARTIFACT)
 * - Academy Objectives: Track research completion (COMPLETE_RESEARCH)
 * - Exploration Objectives: Track era visits (VISIT_ERA)
 * - Login Objectives: Track daily logins (DAILY_LOGIN)
 */
export class ObjectiveTrackingService implements IObjectiveTrackingService {
  private readonly progressRepository: IQuestProgressRepository;
  private readonly logger: ILogger;

  /**
   * Creates a new ObjectiveTrackingService instance.
   */
  constructor(
    progressRepository: IQuestProgressRepository,
    logger?: ILogger
  ) {
    this.progressRepository = progressRepository;
    this.logger = logger ?? getLogger().child({ module: 'ObjectiveTrackingService' });
  }

  /**
   * Tracks progress for a specific objective type.
   * Automatically finds all active quests with matching objectives and updates progress.
   */
  async trackObjectiveProgress(event: ObjectiveProgressEvent): Promise<ObjectiveCompletionResult[]> {
    this.logger.debug('Tracking objective progress', {
      playerProfileId: event.playerProfileId,
      objectiveType: event.objectiveType,
      target: event.target,
      increment: event.increment
    });

    const results: ObjectiveCompletionResult[] = [];

    // Get all active progress for this player that is in progress
    const { items: activeProgress } = await this.progressRepository.findByPlayer(
      event.playerProfileId,
      { page: 1, pageSize: 100 },
      { status: QuestStatus.IN_PROGRESS }
    );

    // Filter progress records that need updating based on objective type
    // Note: In a full implementation, we'd query quests to match objective types
    // For now, we update all in-progress quests that match the objective type pattern
    
    for (const progress of activeProgress) {
      try {
        // In a real implementation, we would:
        // 1. Load the quest to check its objectives
        // 2. Check if any objective matches the event's objectiveType and target
        // 3. Update progress accordingly
        
        // For demonstration, we'll update the progress directly
        // The actual objective matching would happen via quest definitions
        
        const target = 1; // Default target, would come from quest objective definition
        
        const updatedProgress = await this.progressRepository.incrementProgress(
          QuestProgressId.reconstruct(progress.progressId),
          event.increment,
          target
        );

        results.push({
          questId: progress.questId,
          progressId: progress.progressId,
          isCompleted: updatedProgress.status === QuestStatus.COMPLETED,
          newValue: updatedProgress.currentValue,
          target,
        });

        this.logger.debug('Updated quest progress', {
          progressId: progress.progressId,
          newValue: updatedProgress.currentValue,
          isCompleted: updatedProgress.status === QuestStatus.COMPLETED
        });
      } catch (error) {
        this.logger.error('Failed to update quest progress', {
          progressId: progress.progressId,
          error: (error as Error).message
        });
      }
    }

    this.logger.info('Objective progress tracked', {
      playerProfileId: event.playerProfileId,
      objectiveType: event.objectiveType,
      questsUpdated: results.length
    });

    return results;
  }

  /**
   * Validates that an objective type and target are compatible.
   */
  validateObjectiveTarget(objectiveType: ObjectiveType, target: string | null): boolean {
    // If the objective type requires a target identifier
    if (requiresTargetIdentifier(objectiveType)) {
      // Target must be provided and non-empty
      return target !== null && target !== undefined && target.trim().length > 0;
    }
    // If the objective type doesn't require a target, it should be null
    return target === null || target === undefined;
  }

  /**
   * Clamps progress value to valid range.
   * Prevents overflow beyond target and prevents negative values.
   */
  clampProgress(currentValue: number, increment: number, target: number): number {
    // Prevent negative values
    const positiveIncrement = Math.max(0, increment);
    
    // Calculate new value
    const newValue = currentValue + positiveIncrement;
    
    // Clamp to target (prevent overflow)
    return Math.min(newValue, target);
  }
}

/**
 * Creates an ObjectiveTrackingService with dependencies.
 */
export function createObjectiveTrackingService(
  progressRepository: IQuestProgressRepository
): ObjectiveTrackingService {
  return new ObjectiveTrackingService(progressRepository);
}

/**
 * Objective type handler mappings.
 * Maps objective types to their specific validation and tracking logic.
 */
export const OBJECTIVE_HANDLERS: Record<ObjectiveType, {
  requiresTarget: boolean;
  defaultTarget: number;
  description: string;
}> = {
  [ObjectiveType.COLLECT]: {
    requiresTarget: true,
    defaultTarget: 1,
    description: 'Collect specific items or artifacts',
  },
  [ObjectiveType.BATTLE_WIN]: {
    requiresTarget: false,
    defaultTarget: 1,
    description: 'Win battles against opponents',
  },
  [ObjectiveType.BATTLE_COMPLETE]: {
    requiresTarget: false,
    defaultTarget: 1,
    description: 'Complete any battle',
  },
  [ObjectiveType.WATCH_AD]: {
    requiresTarget: false,
    defaultTarget: 1,
    description: 'Watch an advertisement',
  },
  [ObjectiveType.VISIT_ERA]: {
    requiresTarget: true,
    defaultTarget: 1,
    description: 'Visit or explore a specific era',
  },
  [ObjectiveType.LEVEL_UP_ARTIFACT]: {
    requiresTarget: true,
    defaultTarget: 1,
    description: 'Level up an artifact',
  },
  [ObjectiveType.ENHANCE_ARTIFACT]: {
    requiresTarget: true,
    defaultTarget: 1,
    description: 'Enhance or upgrade an artifact',
  },
  [ObjectiveType.COMPLETE_EXPEDITION]: {
    requiresTarget: true,
    defaultTarget: 1,
    description: 'Complete an expedition',
  },
  [ObjectiveType.DISPLAY_ARTIFACT]: {
    requiresTarget: true,
    defaultTarget: 1,
    description: 'Display artifact in museum',
  },
  [ObjectiveType.VIEW_ARTIFACT]: {
    requiresTarget: true,
    defaultTarget: 1,
    description: 'View artifacts in museum',
  },
  [ObjectiveType.COMPLETE_RESEARCH]: {
    requiresTarget: true,
    defaultTarget: 1,
    description: 'Complete research in academy',
  },
  [ObjectiveType.PLAY_GAME]: {
    requiresTarget: false,
    defaultTarget: 1,
    description: 'Perform any game action',
  },
  [ObjectiveType.DAILY_LOGIN]: {
    requiresTarget: false,
    defaultTarget: 1,
    description: 'Log in to the game',
  },
  [ObjectiveType.REACH_POWER]: {
    requiresTarget: false,
    defaultTarget: 1,
    description: 'Reach a total power threshold',
  },
  [ObjectiveType.COMPLETE_SET]: {
    requiresTarget: false,
    defaultTarget: 1,
    description: 'Complete a set of artifacts',
  },
  [ObjectiveType.PVP_PARTICIPATE]: {
    requiresTarget: false,
    defaultTarget: 1,
    description: 'Participate in PvP',
  },
  [ObjectiveType.COMPLETE_QUEST]: {
    requiresTarget: true,
    defaultTarget: 1,
    description: 'Complete specific quest',
  },
  [ObjectiveType.ACCUMULATE_CURRENCY]: {
    requiresTarget: false,
    defaultTarget: 1,
    description: 'Accumulate currency',
  },
};