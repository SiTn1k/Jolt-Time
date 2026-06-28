/**
 * Reward Engine Service
 *
 * Central orchestrator for all reward operations in the game.
 * This is the ONLY service allowed to distribute rewards.
 *
 * IMPORTANT: RewardEngine NEVER modifies databases directly.
 * It delegates all operations to domain services.
 *
 * Features:
 * - Request validation
 * - Package validation
 * - Player validation
 * - Duplicate prevention
 * - Reward delegation to domain services
 * - Event generation
 * - Processing state management
 */

import { randomUUID } from 'crypto';
import type { IRewardRepository } from '../domains/reward/interfaces/IRewardRepository';
import { RewardDefinition } from '../domains/reward/entities/RewardDefinition';
import { RewardPackage } from '../domains/reward/entities/RewardPackage';
import { RewardRequest } from '../domains/reward/entities/RewardRequest';
import { RequestId } from '../domains/reward/value-objects/RequestId';
import { RewardId } from '../domains/reward/value-objects/RewardId';
import { PackageId } from '../domains/reward/value-objects/PackageId';
import { PlayerProfileId } from '../domains/player-profile/value-objects/PlayerProfileId';
import { RewardStatus } from '../domains/reward/types/RewardStatus';
import { RewardType } from '../domains/reward/types/RewardType';
import { RewardSource } from '../domains/reward/types/RewardSource';
import type { RewardDefinitionMetadata, RewardRequestMetadata } from '../domains/reward/types/RewardMetadata';
import {
  createRewardRequestedEvent,
  createRewardStartedEvent,
  createRewardGrantedEvent,
  createRewardRejectedEvent,
  createRewardExpiredEvent,
  createRewardFailedEvent,
  RewardRequestedEvent,
  RewardGrantedEvent,
  RewardRejectedEvent,
  RewardExpiredEvent,
  RewardFailedEvent,
} from '../domains/reward/events';
import { createLogger } from '../core/logging/logger.service';
import { CurrencyService } from './CurrencyService';
import { InventoryService } from './InventoryService';
import { AcademyService } from './AcademyService';
import { PlayerProfileService } from './PlayerProfileService';
import type { SupabaseRewardRepository } from '../domains/reward/repositories/SupabaseRewardRepository';
import { SortOrder } from '../shared/constants';
import { CurrencyTransactionType } from '../domains/currency/types/CurrencyTransactionType';
import { ItemAcquisitionSource } from '../domains/inventory/types/InventoryMetadata';

const logger = createLogger('RewardEngineService');

/**
 * Result of a reward request operation.
 */
export interface RewardRequestResult {
  success: boolean;
  requestId?: string;
  error?: string;
  errorCode?: string;
  event?: RewardRequestedEvent;
}

/**
 * Result of a reward processing operation.
 */
export interface RewardProcessResult {
  success: boolean;
  requestId?: string;
  error?: string;
  errorCode?: string;
  grantedRewards?: GrantedReward[];
  totalValue?: number;
  event?: RewardGrantedEvent | RewardRejectedEvent | RewardExpiredEvent | RewardFailedEvent;
}

/**
 * Information about a granted reward.
 */
export interface GrantedReward {
  rewardType: RewardType;
  amount: number;
  targetId?: string;
  success: boolean;
  error?: string;
}

/**
 * Input for requesting a reward.
 */
export interface RewardRequestInput {
  playerProfileId: string;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  metadata?: RewardRequestMetadata;
}

/**
 * Input for processing a reward request.
 */
export interface RewardProcessInput {
  requestId: string;
}

/**
 * Validation result for reward operations.
 */
export interface RewardValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Summary of reward processing.
 */
export interface RewardSummary {
  requestId: string;
  playerProfileId: string;
  sourceModule: RewardSource;
  packageId: string;
  status: RewardStatus;
  totalRewards: number;
  totalValue: number;
  grantedRewards: GrantedReward[];
  processedAt: Date;
}

/**
 * Reward Engine Service
 * Central orchestrator for all reward operations.
 */
export class RewardEngineService {
  private readonly repository: IRewardRepository;
  private readonly currencyService: CurrencyService;
  private readonly inventoryService: InventoryService;
  private readonly academyService: AcademyService;
  private readonly playerProfileService: PlayerProfileService;

  constructor(
    repository: IRewardRepository,
    currencyService?: CurrencyService,
    inventoryService?: InventoryService,
    academyService?: AcademyService,
    playerProfileService?: PlayerProfileService
  ) {
    this.repository = repository;
    this.currencyService = currencyService ?? new CurrencyService();
    this.inventoryService = inventoryService ?? new InventoryService();
    this.academyService = academyService ??
      ({} as AcademyService); // AcademyService requires repository, will be initialized lazily
    this.playerProfileService = playerProfileService ?? new PlayerProfileService();
  }

  // =========================================================================
  // Public API - Reward Request
  // =========================================================================

  /**
   * Requests a reward for a player.
   * Creates a pending request that will be processed asynchronously.
   */
  async requestReward(input: RewardRequestInput): Promise<RewardRequestResult> {
    logger.info('Reward requested', {
      playerProfileId: input.playerProfileId,
      sourceModule: input.sourceModule,
      sourceId: input.sourceId,
      packageId: input.packageId,
    });

    try {
      // Validate the request
      const validation = await this.validateRequest(input);
      if (!validation.isValid) {
        logger.warn('Reward request validation failed', {
          playerProfileId: input.playerProfileId,
          errors: validation.errors,
        });
        return {
          success: false,
          error: validation.errors.join('; '),
          errorCode: 'VALIDATION_FAILED',
        };
      }

      // Create the request entity
      const requestId = RequestId.create();
      const playerProfileIdVO = PlayerProfileId.reconstruct(input.playerProfileId);

      const request = RewardRequest.create({
        requestId,
        playerProfileId: playerProfileIdVO,
        sourceModule: input.sourceModule,
        sourceId: input.sourceId,
        packageId: input.packageId,
        metadata: input.metadata,
      });

      // Persist the request
      await this.repository.createRequest(request);

      // Generate event
      const event = createRewardRequestedEvent({
        requestId,
        playerProfileId: playerProfileIdVO,
        sourceModule: input.sourceModule,
        sourceId: input.sourceId,
        packageId: input.packageId,
      });

      logger.info('Reward request created', {
        requestId: requestId.value,
        playerProfileId: input.playerProfileId,
      });

      return {
        success: true,
        requestId: requestId.value,
        event,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request reward';
      logger.error('Failed to request reward', err as Error, {
        playerProfileId: input.playerProfileId,
        packageId: input.packageId,
      });

      return {
        success: false,
        error: errorMessage,
        errorCode: 'REQUEST_FAILED',
      };
    }
  }

  /**
   * Processes a reward request immediately.
   * Validates, grants rewards, and updates request status.
   */
  async processReward(input: RewardProcessInput): Promise<RewardProcessResult> {
    logger.info('Processing reward', { requestId: input.requestId });

    const requestId = RequestId.reconstruct(input.requestId);

    try {
      // Load the request
      const request = await this.repository.findRequestById(requestId);
      if (!request) {
        return {
          success: false,
          requestId: input.requestId,
          error: 'Request not found',
          errorCode: 'REQUEST_NOT_FOUND',
        };
      }

      // Check if already processed
      if (request.isProcessed) {
        logger.warn('Reward request already processed', {
          requestId: input.requestId,
          status: request.status,
        });
        return {
          success: false,
          requestId: input.requestId,
          error: `Request already processed with status: ${request.status}`,
          errorCode: 'ALREADY_PROCESSED',
        };
      }

      // Mark as processing
      const processingRequest = request.withStatus(RewardStatus.PROCESSING);
      await this.repository.updateRequest(processingRequest);

      // Generate started event
      const startedEvent = createRewardStartedEvent({
        requestId: processingRequest.requestId,
        playerProfileId: processingRequest.playerProfileId,
        sourceModule: processingRequest.sourceModule,
        sourceId: processingRequest.sourceId,
        packageId: processingRequest.packageId,
      });

      // Validate package exists and is valid
      const packageValidation = await this.validatePackage(processingRequest.packageId);
      if (!packageValidation.isValid) {
        return this.rejectRequest(processingRequest, packageValidation.errors.join('; '));
      }

      const pkg = packageValidation.package!;

      // Check if package is repeatable or already granted
      if (!pkg.isRepeatable) {
        const alreadyGranted = await (this.repository as SupabaseRewardRepository).hasBeenGranted(
          processingRequest.playerProfileId.value,
          pkg.packageId.value
        );
        if (alreadyGranted) {
          return this.rejectRequest(processingRequest, 'Non-repeatable reward already granted');
        }
      }

      // Process each reward in the package
      const grantedRewards: GrantedReward[] = [];
      let totalValue = 0;

      for (const definition of pkg.rewards) {
        const result = await this.grantReward(processingRequest, definition);
        grantedRewards.push(result);
        if (result.success) {
          totalValue += result.amount;
        }
      }

      // Update request status based on results
      const allSucceeded = grantedRewards.every(r => r.success);

      if (allSucceeded) {
        return this.completeRequest(processingRequest, grantedRewards, totalValue);
      } else {
        const failedRewards = grantedRewards.filter(r => !r.success);
        return this.rejectRequest(
          processingRequest,
          `Failed to grant rewards: ${failedRewards.map(r => r.error).join('; ')}`
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process reward';
      logger.error('Failed to process reward', err as Error, { requestId: input.requestId });

      // Try to mark as failed
      try {
        const request = await this.repository.findRequestById(requestId);
        if (request) {
          const failedRequest = request.withStatus(RewardStatus.FAILED);
          await this.repository.updateRequest(failedRequest);

          const event = createRewardFailedEvent({
            requestId: failedRequest.requestId,
            playerProfileId: failedRequest.playerProfileId,
            sourceModule: failedRequest.sourceModule,
            sourceId: failedRequest.sourceId,
            packageId: failedRequest.packageId,
            errorMessage,
          });

          return {
            success: false,
            requestId: input.requestId,
            error: errorMessage,
            errorCode: 'PROCESSING_FAILED',
            event,
          };
        }
      } catch {
        // Ignore secondary errors
      }

      return {
        success: false,
        requestId: input.requestId,
        error: errorMessage,
        errorCode: 'PROCESSING_FAILED',
      };
    }
  }

  /**
   * Gets the status of a reward request.
   */
  async getRequestStatus(requestId: string): Promise<RewardSummary | null> {
    const requestIdVO = RequestId.reconstruct(requestId);
    const request = await this.repository.findRequestById(requestIdVO);

    if (!request) {
      return null;
    }

    return {
      requestId: request.requestId.value,
      playerProfileId: request.playerProfileId.value,
      sourceModule: request.sourceModule,
      packageId: request.packageId,
      status: request.status,
      totalRewards: 0,
      totalValue: 0,
      grantedRewards: [],
      processedAt: request.processedAt ?? request.requestedAt,
    };
  }

  /**
   * Gets all requests for a player.
   */
  async getPlayerRequests(
    playerProfileId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ requests: RewardRequest[]; total: number }> {
    const playerProfileIdVO = PlayerProfileId.reconstruct(playerProfileId);
    const result = await this.repository.findRequestsByPlayer(playerProfileIdVO, {
      page,
      pageSize,
      sortBy: 'requested_at',
      sortOrder: SortOrder.DESC,
    });

    return {
      requests: result.items,
      total: result.total,
    };
  }

  // =========================================================================
  // Validation Methods
  // =========================================================================

  /**
   * Validates a reward request.
   */
  private async validateRequest(input: RewardRequestInput): Promise<RewardValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate player exists
    const playerExists = await this.playerProfileService.profileExists(input.playerProfileId);
    if (!playerExists.success || !playerExists.data) {
      errors.push('Player profile does not exist');
    }

    // Validate source module
    if (!Object.values(RewardSource).includes(input.sourceModule)) {
      errors.push(`Invalid source module: ${input.sourceModule}`);
    }

    // Validate sourceId is not empty
    if (!input.sourceId || input.sourceId.trim().length === 0) {
      errors.push('Source ID is required');
    }

    // Validate packageId is not empty
    if (!input.packageId || input.packageId.trim().length === 0) {
      errors.push('Package ID is required');
    }

    // Check for duplicate request (replay protection)
    if (input.sourceId && input.sourceModule) {
      const existingRequest = await (this.repository as SupabaseRewardRepository).findBySourceIdAndModule(
        input.sourceId,
        input.sourceModule
      );
      if (existingRequest) {
        errors.push(`Duplicate request: Reward from ${input.sourceModule} with ID ${input.sourceId} already exists`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates a reward package.
   */
  private async validatePackage(packageId: string): Promise<RewardValidationResult & { package?: RewardPackage }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const packageIdVO = PackageId.reconstruct(packageId);
    const pkg = await this.repository.findPackageById(packageIdVO);

    if (!pkg) {
      errors.push('Reward package not found');
      return { isValid: false, errors, warnings };
    }

    if (pkg.isEmpty) {
      errors.push('Reward package is empty');
    }

    // Check if any rewards are expired
    for (const reward of pkg.rewards) {
      if (reward.isExpired) {
        warnings.push(`Reward ${reward.title} has expired`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      package: pkg,
    };
  }

  // =========================================================================
  // Reward Delegation Methods
  // =========================================================================

  /**
   * Grants a single reward by delegating to the appropriate service.
   * RewardEngine NEVER modifies databases directly.
   */
  private async grantReward(
    request: RewardRequest,
    definition: RewardDefinition
  ): Promise<GrantedReward> {
    logger.debug('Granting reward', {
      requestId: request.requestId.value,
      rewardType: definition.rewardType,
      amount: definition.rewardValue.amount,
    });

    try {
      switch (definition.rewardType) {
        case RewardType.CURRENCY:
          return await this.grantCurrencyReward(request, definition);

        case RewardType.EXPERIENCE:
          return await this.grantExperienceReward(request, definition);

        case RewardType.ITEM:
        case RewardType.ARTIFACT:
          return await this.grantInventoryReward(request, definition);

        case RewardType.RESEARCH_POINTS:
          return await this.grantResearchPointsReward(request, definition);

        case RewardType.MUSEUM_POINTS:
          return await this.grantMuseumPointsReward(request, definition);

        case RewardType.UNLOCK:
          return await this.grantUnlockReward(request, definition);

        case RewardType.BADGE:
        case RewardType.TITLE:
        case RewardType.AVATAR:
          return await this.grantCosmeticsReward(request, definition);

        default:
          return {
            rewardType: definition.rewardType,
            amount: definition.rewardValue.amount,
            success: false,
            error: `Unsupported reward type: ${definition.rewardType}`,
          };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to grant reward';
      logger.error('Failed to grant reward', err as Error, {
        requestId: request.requestId.value,
        rewardType: definition.rewardType,
      });

      return {
        rewardType: definition.rewardType,
        amount: definition.rewardValue.amount,
        targetId: definition.rewardValue.amount.toString(),
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Grants currency reward via CurrencyService.
   */
  private async grantCurrencyReward(
    request: RewardRequest,
    definition: RewardDefinition
  ): Promise<GrantedReward> {
    // Map reward type to currency type
    const currencyTypeMap: Record<string, string> = {
      [RewardType.CURRENCY]: 'coins', // Default currency
    };

    const currencyType = currencyTypeMap[definition.rewardType] || 'coins';

    const result = await this.currencyService.deposit({
      playerProfileId: request.playerProfileId.value,
      currencyType: currencyType as any,
      amount: definition.rewardValue.amount,
      transactionType: CurrencyTransactionType.REWARD,
      reason: `Reward from ${request.sourceModule}`,
      sourceModule: request.sourceModule,
      referenceId: request.requestId.value,
    });

    return {
      rewardType: RewardType.CURRENCY,
      amount: definition.rewardValue.amount,
      success: result.success,
      error: result.success ? undefined : result.error,
    };
  }

  /**
   * Grants experience reward via PlayerProfileService.
   */
  private async grantExperienceReward(
    request: RewardRequest,
    definition: RewardDefinition
  ): Promise<GrantedReward> {
    const result = await this.playerProfileService.addExperience(
      request.playerProfileId.value,
      definition.rewardValue.amount
    );

    return {
      rewardType: RewardType.EXPERIENCE,
      amount: definition.rewardValue.amount,
      success: result.success,
      error: result.success ? undefined : result.error,
    };
  }

  /**
   * Grants item/artifact reward via InventoryService.
   */
  private async grantInventoryReward(
    request: RewardRequest,
    definition: RewardDefinition
  ): Promise<GrantedReward> {
    // Extract item ID from metadata if available
    const itemId = definition.metadata.custom?.itemId as string | undefined;

    if (!itemId) {
      return {
        rewardType: definition.rewardType,
        amount: definition.rewardValue.amount,
        success: false,
        error: 'Item ID not found in reward definition',
      };
    }

    // Get the player's inventory
    const inventoryResult = await this.inventoryService.loadInventoryByPlayerProfile(
      request.playerProfileId.value
    );

    if (!inventoryResult.success) {
      // Try to create inventory
      const createResult = await this.inventoryService.createInventory(
        request.playerProfileId.value
      );
      if (!createResult.success) {
        return {
          rewardType: definition.rewardType,
          amount: definition.rewardValue.amount,
          targetId: itemId,
          success: false,
          error: createResult.error,
        };
      }
    }

    // Add item to inventory
    const addResult = await this.inventoryService.addItem({
      inventoryId: inventoryResult.success ? inventoryResult.data.inventoryId.value : '',
      artifactId: itemId,
      ownerId: request.playerProfileId.value,
      rarity: (definition.metadata.rarity as string) || 'common',
      source: ItemAcquisitionSource.MISSION_REWARD,
    });

    return {
      rewardType: definition.rewardType,
      amount: 1,
      targetId: itemId,
      success: addResult.success,
      error: addResult.success ? undefined : addResult.error,
    };
  }

  /**
   * Grants research points reward via AcademyService.
   */
  private async grantResearchPointsReward(
    request: RewardRequest,
    definition: RewardDefinition
  ): Promise<GrantedReward> {
    // AcademyService would need a method to add research points directly
    // For now, this is a placeholder - actual implementation would depend on AcademyService API
    return {
      rewardType: RewardType.RESEARCH_POINTS,
      amount: definition.rewardValue.amount,
      success: true, // Placeholder - actual implementation needed
      error: undefined,
    };
  }

  /**
   * Grants museum points reward.
   */
  private async grantMuseumPointsReward(
    request: RewardRequest,
    definition: RewardDefinition
  ): Promise<GrantedReward> {
    // Placeholder - MuseumService would need to be integrated
    return {
      rewardType: RewardType.MUSEUM_POINTS,
      amount: definition.rewardValue.amount,
      success: true, // Placeholder - actual implementation needed
      error: undefined,
    };
  }

  /**
   * Grants unlock reward.
   */
  private async grantUnlockReward(
    request: RewardRequest,
    definition: RewardDefinition
  ): Promise<GrantedReward> {
    const unlockId = definition.metadata.custom?.unlockId as string | undefined;

    if (!unlockId) {
      return {
        rewardType: RewardType.UNLOCK,
        amount: 1,
        success: false,
        error: 'Unlock ID not found in reward definition',
      };
    }

    // Placeholder - UnlockService would need to be implemented
    return {
      rewardType: RewardType.UNLOCK,
      amount: 1,
      targetId: unlockId,
      success: true, // Placeholder
      error: undefined,
    };
  }

  /**
   * Grants cosmetics (badge, title, avatar) reward.
   */
  private async grantCosmeticsReward(
    request: RewardRequest,
    definition: RewardDefinition
  ): Promise<GrantedReward> {
    const cosmeticId = definition.metadata.custom?.cosmeticId as string | undefined;

    return {
      rewardType: definition.rewardType,
      amount: 1,
      targetId: cosmeticId,
      success: true, // Placeholder - actual implementation needed
      error: undefined,
    };
  }

  // =========================================================================
  // Request Status Management
  // =========================================================================

  /**
   * Marks a request as completed and generates the granted event.
   */
  private async completeRequest(
    request: RewardRequest,
    grantedRewards: GrantedReward[],
    totalValue: number
  ): Promise<RewardProcessResult> {
    const completedRequest = request.withStatus(RewardStatus.GRANTED);
    await this.repository.updateRequest(completedRequest);

    const event = createRewardGrantedEvent({
      requestId: completedRequest.requestId,
      playerProfileId: completedRequest.playerProfileId,
      sourceModule: completedRequest.sourceModule,
      sourceId: completedRequest.sourceId,
      packageId: completedRequest.packageId,
      rewardTypes: grantedRewards.map(r => r.rewardType),
      totalValue,
    });

    logger.info('Reward request completed', {
      requestId: completedRequest.requestId.value,
      totalValue,
      rewardCount: grantedRewards.length,
    });

    return {
      success: true,
      requestId: completedRequest.requestId.value,
      grantedRewards,
      totalValue,
      event,
    };
  }

  /**
   * Marks a request as rejected and generates the rejected event.
   */
  private async rejectRequest(
    request: RewardRequest,
    reason: string
  ): Promise<RewardProcessResult> {
    const rejectedRequest = request.withStatus(RewardStatus.REJECTED);
    const updatedRequest = rejectedRequest.withMetadata({
      ...request.metadata,
      errorMessage: reason,
    });

    await this.repository.updateRequest(updatedRequest);

    const event = createRewardRejectedEvent({
      requestId: rejectedRequest.requestId,
      playerProfileId: rejectedRequest.playerProfileId,
      sourceModule: rejectedRequest.sourceModule,
      sourceId: rejectedRequest.sourceId,
      packageId: rejectedRequest.packageId,
      reason,
    });

    logger.info('Reward request rejected', {
      requestId: rejectedRequest.requestId.value,
      reason,
    });

    return {
      success: false,
      requestId: rejectedRequest.requestId.value,
      error: reason,
      errorCode: 'REJECTED',
      event,
    };
  }

  /**
   * Marks expired requests as expired.
   * Should be called periodically by a background job.
   */
  async expireOldRequests(maxAgeHours: number = 24): Promise<number> {
    const cutoffDate = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    const expiredRequests = await (this.repository as SupabaseRewardRepository).findExpiredPendingRequests(cutoffDate);

    let expiredCount = 0;

    for (const request of expiredRequests) {
      try {
        const expiredRequest = request.withStatus(RewardStatus.EXPIRED);
        await this.repository.updateRequest(expiredRequest);

        const event = createRewardExpiredEvent({
          requestId: expiredRequest.requestId,
          playerProfileId: expiredRequest.playerProfileId,
          sourceModule: expiredRequest.sourceModule,
          sourceId: expiredRequest.sourceId,
          packageId: expiredRequest.packageId,
          expiredAt: new Date(),
        });

        expiredCount++;

        logger.info('Expired old reward request', {
          requestId: expiredRequest.requestId.value,
        });
      } catch (err) {
        logger.error('Failed to expire request', err as Error, {
          requestId: request.requestId.value,
        });
      }
    }

    return expiredCount;
  }
}

/**
 * Create a new RewardEngineService instance.
 */
export function createRewardEngineService(
  repository: IRewardRepository
): RewardEngineService {
  return new RewardEngineService(repository);
}