/**
 * SupabaseRewardRepository
 *
 * Production Supabase implementation of IRewardRepository.
 * Handles all persistence operations for reward entities.
 */

import type { SupabaseClient, SupabaseClient as GenericSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { IRewardRepository } from '../interfaces/IRewardRepository';
import { RewardId } from '../value-objects/RewardId';
import { PackageId } from '../value-objects/PackageId';
import { RequestId } from '../value-objects/RequestId';
import { RewardDefinition } from '../entities/RewardDefinition';
import type { RewardDefinitionRecord } from '../entities/RewardDefinition';
import { RewardPackage } from '../entities/RewardPackage';
import type { RewardPackageRecord } from '../entities/RewardPackage';
import { RewardRequest } from '../entities/RewardRequest';
import type { RewardRequestRecord } from '../entities/RewardRequest';
import type {
  RewardDefinitionFilterParams,
  RewardPackageFilterParams,
  RewardRequestFilterParams,
} from '../interfaces/IRewardRepository';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';

const logger = createLogger('SupabaseRewardRepository');

/**
 * Database row types for reward tables.
 */
interface RewardDefinitionRow {
  reward_id: string;
  slug: string;
  title: string;
  description: string;
  reward_type: string;
  amount: number;
  reward_target: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface RewardPackageRow {
  package_id: string;
  title: string;
  description: string;
  reward_ids: string[];
  is_repeatable: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface RewardRequestRow {
  request_id: string;
  player_profile_id: string;
  source_module: string;
  source_id: string;
  package_id: string;
  status: string;
  requested_at: string;
  processed_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * SupabaseRewardRepository class.
 * Production implementation of IRewardRepository using Supabase.
 */
export class SupabaseRewardRepository implements IRewardRepository {
  private readonly definitionsTable = 'reward_definitions';
  private readonly packagesTable = 'reward_packages';
  private readonly requestsTable = 'reward_requests';
  private readonly _client?: SupabaseClient<Database>;

  constructor(client?: SupabaseClient<Database>) {
    this._client = client;
  }

  private get client(): SupabaseClient<Database> {
    return this._client ?? getSupabaseClient();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get genericClient(): GenericSupabaseClient<any> {
    return this._client as GenericSupabaseClient<any> ?? getSupabaseClient() as GenericSupabaseClient<any>;
  }

  private calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.pageSize;
  }

  // =========================================================================
  // Reward Definition Operations
  // =========================================================================

  public async createDefinition(definition: RewardDefinition): Promise<RewardDefinition> {
    logger.debug('Creating reward definition', { rewardId: definition.rewardId.value });

    try {
      const record = definition.toRecord();
      const dbRecord = {
        reward_id: record.rewardId,
        slug: record.slug,
        title: record.title,
        description: record.description,
        reward_type: record.rewardType,
        amount: record.amount,
        reward_target: record.rewardTarget,
        metadata: record.metadata,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      };

      const { data, error } = await this.genericClient
        .from(this.definitionsTable)
        .insert([dbRecord])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw RepositoryError.alreadyExists('RewardDefinition', 'reward_id', definition.rewardId.value, this.definitionsTable);
        }
        throw RepositoryError.createFailed('RewardDefinition', new Error(error.message));
      }

      const row = data as RewardDefinitionRow;
      return this.mapRowToDefinition(row);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to create reward definition', err as Error);
      throw RepositoryError.createFailed('RewardDefinition', err as Error);
    }
  }

  public async findDefinitionById(id: RewardId): Promise<RewardDefinition | null> {
    logger.debug('Finding reward definition by ID', { rewardId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.definitionsTable)
        .select('*')
        .eq('reward_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw RepositoryError.entityNotFound('RewardDefinition', id.value, this.definitionsTable);
      }

      return this.mapRowToDefinition(data as RewardDefinitionRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to find reward definition', err as Error, { rewardId: id.value });
      throw RepositoryError.entityNotFound('RewardDefinition', id.value, this.definitionsTable);
    }
  }

  public async findDefinitionBySlug(slug: string): Promise<RewardDefinition | null> {
    logger.debug('Finding reward definition by slug', { slug });

    try {
      const { data, error } = await this.client
        .from(this.definitionsTable)
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw RepositoryError.entityNotFound('RewardDefinition', slug, this.definitionsTable);
      }

      return this.mapRowToDefinition(data as RewardDefinitionRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to find reward definition by slug', err as Error, { slug });
      throw RepositoryError.entityNotFound('RewardDefinition', slug, this.definitionsTable);
    }
  }

  public async listDefinitions(
    params: PaginationParams,
    filters?: RewardDefinitionFilterParams
  ): Promise<PaginatedResult<RewardDefinition>> {
    logger.debug('Listing reward definitions', { params, filters });

    try {
      let query = this.client
        .from(this.definitionsTable)
        .select('*', { count: 'exact' });

      if (filters?.rewardType) {
        query = query.eq('reward_type', filters.rewardType);
      }

      if (filters?.slugPattern) {
        query = query.like('slug', `%${filters.slugPattern}%`);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('metadata->>limited', filters.isActive ? 'false' : 'true');
      }

      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }

      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const sortBy = params.sortBy || 'created_at';
      const ascending = params.sortOrder === 'asc';
      query = query.order(sortBy, { ascending });

      const offset = this.calculateOffset(params);
      query = query.range(offset, offset + params.pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      const items = (data as RewardDefinitionRow[]).map(row => this.mapRowToDefinition(row));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to list reward definitions', err as Error);
      throw RepositoryError.queryFailed('listDefinitions', err as Error);
    }
  }

  public async updateDefinition(definition: RewardDefinition): Promise<RewardDefinition> {
    logger.debug('Updating reward definition', { rewardId: definition.rewardId.value });

    try {
      const record = definition.toRecord();
      const dbRecord = {
        slug: record.slug,
        title: record.title,
        description: record.description,
        reward_type: record.rewardType,
        amount: record.amount,
        reward_target: record.rewardTarget,
        metadata: record.metadata,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.genericClient
        .from(this.definitionsTable)
        .update(dbRecord)
        .eq('reward_id', definition.rewardId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('RewardDefinition', definition.rewardId.value, new Error(error.message));
      }

      return this.mapRowToDefinition(data as RewardDefinitionRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to update reward definition', err as Error);
      throw RepositoryError.updateFailed('RewardDefinition', definition.rewardId.value, err as Error);
    }
  }

  public async deleteDefinition(id: RewardId): Promise<void> {
    logger.debug('Deleting reward definition', { rewardId: id.value });

    try {
      const { error } = await this.client
        .from(this.definitionsTable)
        .delete()
        .eq('reward_id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('RewardDefinition', id.value, new Error(error.message));
      }

      logger.info('Reward definition deleted', { rewardId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to delete reward definition', err as Error);
      throw RepositoryError.deleteFailed('RewardDefinition', id.value, err as Error);
    }
  }

  private mapRowToDefinition(row: RewardDefinitionRow): RewardDefinition {
    const record: RewardDefinitionRecord = {
      rewardId: row.reward_id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      rewardType: row.reward_type as RewardDefinitionRecord['rewardType'],
      amount: row.amount,
      rewardTarget: row.reward_target as unknown as RewardDefinitionRecord['rewardTarget'],
      metadata: row.metadata as RewardDefinitionRecord['metadata'],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    return RewardDefinition.fromStorage(record);
  }

  // =========================================================================
  // Reward Package Operations
  // =========================================================================

  public async createPackage(pkg: RewardPackage): Promise<RewardPackage> {
    logger.debug('Creating reward package', { packageId: pkg.packageId.value });

    try {
      const record = pkg.toRecord();
      const dbRecord = {
        package_id: record.packageId,
        title: record.title,
        description: record.description,
        reward_ids: record.rewardIds,
        is_repeatable: record.isRepeatable,
        metadata: record.metadata,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      };

      const { data, error } = await this.genericClient
        .from(this.packagesTable)
        .insert([dbRecord])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw RepositoryError.alreadyExists('RewardPackage', 'package_id', pkg.packageId.value, this.packagesTable);
        }
        throw RepositoryError.createFailed('RewardPackage', new Error(error.message));
      }

      const row = data as RewardPackageRow;
      return this.mapRowToPackage(row);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to create reward package', err as Error);
      throw RepositoryError.createFailed('RewardPackage', err as Error);
    }
  }

  public async findPackageById(id: PackageId): Promise<RewardPackage | null> {
    logger.debug('Finding reward package by ID', { packageId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.packagesTable)
        .select('*')
        .eq('package_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw RepositoryError.entityNotFound('RewardPackage', id.value, this.packagesTable);
      }

      return this.mapRowToPackage(data as RewardPackageRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to find reward package', err as Error, { packageId: id.value });
      throw RepositoryError.entityNotFound('RewardPackage', id.value, this.packagesTable);
    }
  }

  public async listPackages(
    params: PaginationParams,
    filters?: RewardPackageFilterParams
  ): Promise<PaginatedResult<RewardPackage>> {
    logger.debug('Listing reward packages', { params, filters });

    try {
      let query = this.client
        .from(this.packagesTable)
        .select('*', { count: 'exact' });

      if (filters?.isRepeatable !== undefined) {
        query = query.eq('is_repeatable', filters.isRepeatable);
      }

      if (filters?.tier) {
        query = query.eq('metadata->>tier', filters.tier);
      }

      if (filters?.eventId) {
        query = query.eq('metadata->>event_id', filters.eventId);
      }

      const sortBy = params.sortBy || 'created_at';
      const ascending = params.sortOrder === 'asc';
      query = query.order(sortBy, { ascending });

      const offset = this.calculateOffset(params);
      query = query.range(offset, offset + params.pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      const items = (data as RewardPackageRow[]).map(row => this.mapRowToPackage(row));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to list reward packages', err as Error);
      throw RepositoryError.queryFailed('listPackages', err as Error);
    }
  }

  public async updatePackage(pkg: RewardPackage): Promise<RewardPackage> {
    logger.debug('Updating reward package', { packageId: pkg.packageId.value });

    try {
      const record = pkg.toRecord();
      const dbRecord = {
        title: record.title,
        description: record.description,
        reward_ids: record.rewardIds,
        is_repeatable: record.isRepeatable,
        metadata: record.metadata,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.genericClient
        .from(this.packagesTable)
        .update(dbRecord)
        .eq('package_id', pkg.packageId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('RewardPackage', pkg.packageId.value, new Error(error.message));
      }

      return this.mapRowToPackage(data as RewardPackageRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to update reward package', err as Error);
      throw RepositoryError.updateFailed('RewardPackage', pkg.packageId.value, err as Error);
    }
  }

  public async deletePackage(id: PackageId): Promise<void> {
    logger.debug('Deleting reward package', { packageId: id.value });

    try {
      const { error } = await this.client
        .from(this.packagesTable)
        .delete()
        .eq('package_id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('RewardPackage', id.value, new Error(error.message));
      }

      logger.info('Reward package deleted', { packageId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to delete reward package', err as Error);
      throw RepositoryError.deleteFailed('RewardPackage', id.value, err as Error);
    }
  }

  private mapRowToPackage(row: RewardPackageRow): RewardPackage {
    const record: RewardPackageRecord = {
      packageId: row.package_id,
      title: row.title,
      description: row.description,
      rewardIds: row.reward_ids,
      isRepeatable: row.is_repeatable,
      metadata: row.metadata as RewardPackageRecord['metadata'],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    return RewardPackage.fromStorage(record);
  }

  // =========================================================================
  // Reward Request Operations
  // =========================================================================

  public async createRequest(request: RewardRequest): Promise<RewardRequest> {
    logger.debug('Creating reward request', { requestId: request.requestId.value });

    try {
      const record = request.toRecord();
      const dbRecord = {
        request_id: record.requestId,
        player_profile_id: record.playerProfileId,
        source_module: record.sourceModule,
        source_id: record.sourceId,
        package_id: record.packageId,
        status: record.status,
        requested_at: record.requestedAt,
        processed_at: record.processedAt ?? null,
        metadata: record.metadata,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      };

      const { data, error } = await this.genericClient
        .from(this.requestsTable)
        .insert([dbRecord])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw RepositoryError.alreadyExists('RewardRequest', 'request_id', request.requestId.value, this.requestsTable);
        }
        throw RepositoryError.createFailed('RewardRequest', new Error(error.message));
      }

      const row = data as RewardRequestRow;
      return this.mapRowToRequest(row);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to create reward request', err as Error);
      throw RepositoryError.createFailed('RewardRequest', err as Error);
    }
  }

  public async findRequestById(id: RequestId): Promise<RewardRequest | null> {
    logger.debug('Finding reward request by ID', { requestId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.requestsTable)
        .select('*')
        .eq('request_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw RepositoryError.entityNotFound('RewardRequest', id.value, this.requestsTable);
      }

      return this.mapRowToRequest(data as RewardRequestRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to find reward request', err as Error, { requestId: id.value });
      throw RepositoryError.entityNotFound('RewardRequest', id.value, this.requestsTable);
    }
  }

  public async findRequestsByPlayer(
    playerProfileId: PlayerProfileId,
    params: PaginationParams
  ): Promise<PaginatedResult<RewardRequest>> {
    logger.debug('Finding reward requests by player', { playerProfileId: playerProfileId.value });

    try {
      let query = this.client
        .from(this.requestsTable)
        .select('*', { count: 'exact' })
        .eq('player_profile_id', playerProfileId.value);

      const sortBy = params.sortBy || 'requested_at';
      const ascending = params.sortOrder === 'asc';
      query = query.order(sortBy, { ascending });

      const offset = this.calculateOffset(params);
      query = query.range(offset, offset + params.pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      const items = (data as RewardRequestRow[]).map(row => this.mapRowToRequest(row));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to find reward requests by player', err as Error);
      throw RepositoryError.queryFailed('findRequestsByPlayer', err as Error);
    }
  }

  public async listRequests(
    params: PaginationParams,
    filters?: RewardRequestFilterParams
  ): Promise<PaginatedResult<RewardRequest>> {
    logger.debug('Listing reward requests', { params, filters });

    try {
      let query = this.client
        .from(this.requestsTable)
        .select('*', { count: 'exact' });

      if (filters?.playerProfileId) {
        query = query.eq('player_profile_id', filters.playerProfileId);
      }

      if (filters?.sourceModule) {
        query = query.eq('source_module', filters.sourceModule);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.packageId) {
        query = query.eq('package_id', filters.packageId);
      }

      if (filters?.requestedAfter) {
        query = query.gte('requested_at', filters.requestedAfter.toISOString());
      }

      if (filters?.requestedBefore) {
        query = query.lte('requested_at', filters.requestedBefore.toISOString());
      }

      const sortBy = params.sortBy || 'requested_at';
      const ascending = params.sortOrder === 'asc';
      query = query.order(sortBy, { ascending });

      const offset = this.calculateOffset(params);
      query = query.range(offset, offset + params.pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      const items = (data as RewardRequestRow[]).map(row => this.mapRowToRequest(row));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to list reward requests', err as Error);
      throw RepositoryError.queryFailed('listRequests', err as Error);
    }
  }

  public async updateRequest(request: RewardRequest): Promise<RewardRequest> {
    logger.debug('Updating reward request', { requestId: request.requestId.value });

    try {
      const record = request.toRecord();
      const dbRecord = {
        status: record.status,
        processed_at: record.processedAt ?? null,
        metadata: record.metadata,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.genericClient
        .from(this.requestsTable)
        .update(dbRecord)
        .eq('request_id', request.requestId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('RewardRequest', request.requestId.value, new Error(error.message));
      }

      return this.mapRowToRequest(data as RewardRequestRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to update reward request', err as Error);
      throw RepositoryError.updateFailed('RewardRequest', request.requestId.value, err as Error);
    }
  }

  public async deleteRequest(id: RequestId): Promise<void> {
    logger.debug('Deleting reward request', { requestId: id.value });

    try {
      const { error } = await this.client
        .from(this.requestsTable)
        .delete()
        .eq('request_id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('RewardRequest', id.value, new Error(error.message));
      }

      logger.info('Reward request deleted', { requestId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to delete reward request', err as Error);
      throw RepositoryError.deleteFailed('RewardRequest', id.value, err as Error);
    }
  }

  private mapRowToRequest(row: RewardRequestRow): RewardRequest {
    const record: RewardRequestRecord = {
      requestId: row.request_id,
      playerProfileId: row.player_profile_id,
      sourceModule: row.source_module as RewardRequestRecord['sourceModule'],
      sourceId: row.source_id,
      packageId: row.package_id,
      status: row.status as RewardRequestRecord['status'],
      requestedAt: row.requested_at,
      processedAt: row.processed_at ?? undefined,
      metadata: row.metadata as RewardRequestRecord['metadata'],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    return RewardRequest.fromStorage(record);
  }

  // =========================================================================
  // Additional Query Methods for Reward Engine
  // =========================================================================

  /**
   * Finds a request by source ID and source module (for duplicate detection).
   */
  public async findBySourceIdAndModule(
    sourceId: string,
    sourceModule: string
  ): Promise<RewardRequest | null> {
    logger.debug('Finding request by source ID and module', { sourceId, sourceModule });

    try {
      const { data, error } = await this.client
        .from(this.requestsTable)
        .select('*')
        .eq('source_id', sourceId)
        .eq('source_module', sourceModule)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw RepositoryError.queryFailed('findBySourceIdAndModule', new Error(error.message));
      }

      return this.mapRowToRequest(data as RewardRequestRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to find request by source ID and module', err as Error);
      throw RepositoryError.queryFailed('findBySourceIdAndModule', err as Error);
    }
  }

  /**
   * Checks if a reward has already been granted to a player.
   */
  public async hasBeenGranted(
    playerProfileId: string,
    packageId: string
  ): Promise<boolean> {
    logger.debug('Checking if reward has been granted', { playerProfileId, packageId });

    try {
      const { error, count } = await this.client
        .from(this.requestsTable)
        .select('*', { count: 'exact', head: true })
        .eq('player_profile_id', playerProfileId)
        .eq('package_id', packageId)
        .eq('status', 'granted');

      if (error) {
        throw RepositoryError.queryFailed('hasBeenGranted', new Error(error.message));
      }

      return (count ?? 0) > 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to check if reward has been granted', err as Error);
      throw RepositoryError.queryFailed('hasBeenGranted', err as Error);
    }
  }

  /**
   * Counts requests by status.
   */
  public async countByStatus(status: string): Promise<number> {
    logger.debug('Counting requests by status', { status });

    try {
      const { error, count } = await this.client
        .from(this.requestsTable)
        .select('*', { count: 'exact', head: true })
        .eq('status', status);

      if (error) {
        throw RepositoryError.queryFailed('countByStatus', new Error(error.message));
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to count requests by status', err as Error);
      throw RepositoryError.queryFailed('countByStatus', err as Error);
    }
  }

  /**
   * Finds expired pending requests that need to be marked as expired.
   */
  public async findExpiredPendingRequests(
    olderThan: Date
  ): Promise<RewardRequest[]> {
    logger.debug('Finding expired pending requests', { olderThan: olderThan.toISOString() });

    try {
      const { data, error } = await this.client
        .from(this.requestsTable)
        .select('*')
        .eq('status', 'pending')
        .lt('requested_at', olderThan.toISOString());

      if (error) {
        throw RepositoryError.queryFailed('findExpiredPendingRequests', new Error(error.message));
      }

      return (data as RewardRequestRow[]).map(row => this.mapRowToRequest(row));
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to find expired pending requests', err as Error);
      throw RepositoryError.queryFailed('findExpiredPendingRequests', err as Error);
    }
  }

  /**
   * Batch update request statuses.
   */
  public async batchUpdateStatus(
    requestIds: string[],
    status: string
  ): Promise<void> {
    logger.debug('Batch updating request statuses', { requestIds: requestIds.length, status });

    try {
      const { error } = await this.genericClient
        .from(this.requestsTable)
        .update({
          status,
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .in('request_id', requestIds);

      if (error) {
        throw RepositoryError.updateFailed('RewardRequest', `batch(${requestIds.length})`, new Error(error.message));
      }

      logger.info('Batch updated request statuses', { count: requestIds.length, status });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Failed to batch update request statuses', err as Error);
      throw RepositoryError.updateFailed('RewardRequest', 'batch', err as Error);
    }
  }
}