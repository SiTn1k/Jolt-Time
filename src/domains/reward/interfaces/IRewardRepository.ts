/**
 * IRewardRepository Interface
 *
 * Interface defining the contract for Reward persistence.
 * All RewardRepository implementations must adhere to this interface.
 */

import type { RewardId } from '../value-objects/RewardId';
import type { PackageId } from '../value-objects/PackageId';
import type { RequestId } from '../value-objects/RequestId';
import type { RewardDefinition } from '../entities/RewardDefinition';
import type { RewardPackage } from '../entities/RewardPackage';
import type { RewardRequest } from '../entities/RewardRequest';
import type { RewardType } from '../types/RewardType';
import type { RewardSource } from '../types/RewardSource';
import type { RewardStatus } from '../types/RewardStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';

/**
 * Filter parameters for querying reward definitions.
 */
export interface RewardDefinitionFilterParams {
  /** Filter by reward type */
  rewardType?: RewardType;

  /** Filter by slug pattern */
  slugPattern?: string;

  /** Filter by active status */
  isActive?: boolean;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying reward packages.
 */
export interface RewardPackageFilterParams {
  /** Filter by repeatable status */
  isRepeatable?: boolean;

  /** Filter by tier */
  tier?: string;

  /** Filter by event ID */
  eventId?: string;
}

/**
 * Filter parameters for querying reward requests.
 */
export interface RewardRequestFilterParams {
  /** Filter by player profile ID */
  playerProfileId?: string;

  /** Filter by source module */
  sourceModule?: RewardSource;

  /** Filter by status */
  status?: RewardStatus;

  /** Filter by package ID */
  packageId?: string;

  /** Filter by request date after */
  requestedAfter?: Date;

  /** Filter by request date before */
  requestedBefore?: Date;
}

/**
 * Reward repository interface.
 * Defines all data access operations for reward entities.
 */
export interface IRewardRepository {
  // === Reward Definition Operations ===

  /**
   * Creates a new reward definition.
   */
  createDefinition(definition: RewardDefinition): Promise<RewardDefinition>;

  /**
   * Finds a reward definition by ID.
   */
  findDefinitionById(id: RewardId): Promise<RewardDefinition | null>;

  /**
   * Finds a reward definition by slug.
   */
  findDefinitionBySlug(slug: string): Promise<RewardDefinition | null>;

  /**
   * Lists reward definitions with pagination.
   */
  listDefinitions(
    params: PaginationParams,
    filters?: RewardDefinitionFilterParams
  ): Promise<PaginatedResult<RewardDefinition>>;

  /**
   * Updates a reward definition.
   */
  updateDefinition(definition: RewardDefinition): Promise<RewardDefinition>;

  /**
   * Deletes a reward definition.
   */
  deleteDefinition(id: RewardId): Promise<void>;

  // === Reward Package Operations ===

  /**
   * Creates a new reward package.
   */
  createPackage(pkg: RewardPackage): Promise<RewardPackage>;

  /**
   * Finds a reward package by ID.
   */
  findPackageById(id: PackageId): Promise<RewardPackage | null>;

  /**
   * Lists reward packages with pagination.
   */
  listPackages(
    params: PaginationParams,
    filters?: RewardPackageFilterParams
  ): Promise<PaginatedResult<RewardPackage>>;

  /**
   * Updates a reward package.
   */
  updatePackage(pkg: RewardPackage): Promise<RewardPackage>;

  /**
   * Deletes a reward package.
   */
  deletePackage(id: PackageId): Promise<void>;

  // === Reward Request Operations ===

  /**
   * Creates a new reward request.
   */
  createRequest(request: RewardRequest): Promise<RewardRequest>;

  /**
   * Finds a reward request by ID.
   */
  findRequestById(id: RequestId): Promise<RewardRequest | null>;

  /**
   * Lists reward requests for a player.
   */
  findRequestsByPlayer(
    playerProfileId: PlayerProfileId,
    params: PaginationParams
  ): Promise<PaginatedResult<RewardRequest>>;

  /**
   * Lists reward requests with filters.
   */
  listRequests(
    params: PaginationParams,
    filters?: RewardRequestFilterParams
  ): Promise<PaginatedResult<RewardRequest>>;

  /**
   * Updates a reward request.
   */
  updateRequest(request: RewardRequest): Promise<RewardRequest>;

  /**
   * Deletes a reward request.
   */
  deleteRequest(id: RequestId): Promise<void>;
}