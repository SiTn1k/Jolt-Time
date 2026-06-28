/**
 * SupabaseRewardRepository
 *
 * Supabase implementation of IRewardRepository.
 * All methods throw NotImplementedError - implementation belongs to P-177.2.
 */

import type { IRewardRepository } from '../interfaces/IRewardRepository';
import type { RewardId } from '../value-objects/RewardId';
import type { PackageId } from '../value-objects/PackageId';
import type { RequestId } from '../value-objects/RequestId';
import type { RewardDefinition } from '../entities/RewardDefinition';
import type { RewardPackage } from '../entities/RewardPackage';
import type { RewardRequest } from '../entities/RewardRequest';
import type {
  RewardDefinitionFilterParams,
  RewardPackageFilterParams,
  RewardRequestFilterParams,
} from '../interfaces/IRewardRepository';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';

/**
 * NotImplementedError for pending repository methods.
 */
export class NotImplementedError extends Error {
  constructor(methodName: string) {
    super(`Method ${methodName} is not implemented yet. Implementation belongs to P-177.2.`);
    this.name = 'NotImplementedError';
  }
}

/**
 * SupabaseRewardRepository class.
 * Skeleton implementation - all methods throw NotImplementedError.
 */
export class SupabaseRewardRepository implements IRewardRepository {
  // === Reward Definition Operations ===

  /**
   * @throws NotImplementedError
   */
  public async createDefinition(definition: RewardDefinition): Promise<RewardDefinition> {
    throw new NotImplementedError('createDefinition');
  }

  /**
   * @throws NotImplementedError
   */
  public async findDefinitionById(id: RewardId): Promise<RewardDefinition | null> {
    throw new NotImplementedError('findDefinitionById');
  }

  /**
   * @throws NotImplementedError
   */
  public async findDefinitionBySlug(slug: string): Promise<RewardDefinition | null> {
    throw new NotImplementedError('findDefinitionBySlug');
  }

  /**
   * @throws NotImplementedError
   */
  public async listDefinitions(
    params: PaginationParams,
    filters?: RewardDefinitionFilterParams
  ): Promise<PaginatedResult<RewardDefinition>> {
    throw new NotImplementedError('listDefinitions');
  }

  /**
   * @throws NotImplementedError
   */
  public async updateDefinition(definition: RewardDefinition): Promise<RewardDefinition> {
    throw new NotImplementedError('updateDefinition');
  }

  /**
   * @throws NotImplementedError
   */
  public async deleteDefinition(id: RewardId): Promise<void> {
    throw new NotImplementedError('deleteDefinition');
  }

  // === Reward Package Operations ===

  /**
   * @throws NotImplementedError
   */
  public async createPackage(pkg: RewardPackage): Promise<RewardPackage> {
    throw new NotImplementedError('createPackage');
  }

  /**
   * @throws NotImplementedError
   */
  public async findPackageById(id: PackageId): Promise<RewardPackage | null> {
    throw new NotImplementedError('findPackageById');
  }

  /**
   * @throws NotImplementedError
   */
  public async listPackages(
    params: PaginationParams,
    filters?: RewardPackageFilterParams
  ): Promise<PaginatedResult<RewardPackage>> {
    throw new NotImplementedError('listPackages');
  }

  /**
   * @throws NotImplementedError
   */
  public async updatePackage(pkg: RewardPackage): Promise<RewardPackage> {
    throw new NotImplementedError('updatePackage');
  }

  /**
   * @throws NotImplementedError
   */
  public async deletePackage(id: PackageId): Promise<void> {
    throw new NotImplementedError('deletePackage');
  }

  // === Reward Request Operations ===

  /**
   * @throws NotImplementedError
   */
  public async createRequest(request: RewardRequest): Promise<RewardRequest> {
    throw new NotImplementedError('createRequest');
  }

  /**
   * @throws NotImplementedError
   */
  public async findRequestById(id: RequestId): Promise<RewardRequest | null> {
    throw new NotImplementedError('findRequestById');
  }

  /**
   * @throws NotImplementedError
   */
  public async findRequestsByPlayer(
    playerProfileId: PlayerProfileId,
    params: PaginationParams
  ): Promise<PaginatedResult<RewardRequest>> {
    throw new NotImplementedError('findRequestsByPlayer');
  }

  /**
   * @throws NotImplementedError
   */
  public async listRequests(
    params: PaginationParams,
    filters?: RewardRequestFilterParams
  ): Promise<PaginatedResult<RewardRequest>> {
    throw new NotImplementedError('listRequests');
  }

  /**
   * @throws NotImplementedError
   */
  public async updateRequest(request: RewardRequest): Promise<RewardRequest> {
    throw new NotImplementedError('updateRequest');
  }

  /**
   * @throws NotImplementedError
   */
  public async deleteRequest(id: RequestId): Promise<void> {
    throw new NotImplementedError('deleteRequest');
  }
}