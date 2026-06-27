/**
 * Supabase Artifact Repository
 *
 * Production Supabase implementation of the Artifact repository.
 * Handles all persistence operations for Artifact entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type {
  IArtifactRepository,
  ArtifactFilterParams,
  ArtifactSortField,
} from '../interfaces/IArtifactRepository';
import { Artifact, ArtifactRecord } from '../entities/Artifact';
import type { ArtifactId } from '../value-objects/ArtifactId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { ArtifactCategory, ArtifactRarity, ArtifactEra, ArtifactRegion } from '../types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';
import { SortOrder } from '../../../shared/constants';

const logger = createLogger('SupabaseArtifactRepository');

/**
 * Database table name for artifacts.
 */
const TABLE_NAME = 'artifacts';

/**
 * Supabase implementation of the Artifact Repository.
 * Implements IArtifactRepository for Artifact entity persistence.
 */
export class SupabaseArtifactRepository implements IArtifactRepository {
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseArtifactRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client;
  }

  /**
   * Get the Supabase client.
   */
  private get client(): SupabaseClient<Database> {
    return this._client ?? getSupabaseClient();
  }

  /**
   * Maps a database row to ArtifactRecord format.
   */
  private mapRowToRecord(row: Record<string, unknown>): ArtifactRecord {
    return {
      artifact_id: row.artifact_id as string,
      slug: row.slug as string,
      title: row.title as string,
      description: row.description as string,
      category: row.category as string,
      rarity: row.rarity as string,
      era: row.era as string,
      region: row.region as string,
      culture: row.culture as string,
      material: row.material as string,
      condition: row.condition as string,
      image: row.image as string,
      thumbnail: row.thumbnail as string,
      animation: row.animation as string | undefined,
      is_collectible: row.is_collectible as boolean,
      is_museum_allowed: row.is_museum_allowed as boolean,
      metadata: (row.metadata as Record<string, unknown>) ?? {},
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  }

  /**
   * Maps a database row to an Artifact entity.
   */
  private mapRowToEntity(row: Record<string, unknown>): Artifact {
    const record = this.mapRowToRecord(row);
    return Artifact.fromDatabase(record);
  }

  /**
   * Converts an Artifact entity to database insert format.
   */
  private toInsertRecord(artifact: Artifact): Record<string, unknown> {
    return {
      artifact_id: artifact.artifactId.value,
      slug: artifact.slug.value,
      title: artifact.title.value,
      description: artifact.description.value,
      category: artifact.category,
      rarity: artifact.rarity,
      era: artifact.era,
      region: artifact.region,
      culture: artifact.culture,
      material: artifact.material,
      condition: artifact.condition,
      image: artifact.image,
      thumbnail: artifact.thumbnail,
      animation: artifact.animation,
      is_collectible: artifact.isCollectible,
      is_museum_allowed: artifact.isMuseumAllowed,
      metadata: artifact.metadata,
      created_at: artifact.createdAt.toISOString(),
      updated_at: artifact.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an Artifact entity to database update format.
   */
  private toUpdateRecord(artifact: Artifact): Record<string, unknown> {
    return {
      slug: artifact.slug.value,
      title: artifact.title.value,
      description: artifact.description.value,
      category: artifact.category,
      rarity: artifact.rarity,
      era: artifact.era,
      region: artifact.region,
      culture: artifact.culture,
      material: artifact.material,
      condition: artifact.condition,
      image: artifact.image,
      thumbnail: artifact.thumbnail,
      animation: artifact.animation,
      is_collectible: artifact.isCollectible,
      is_museum_allowed: artifact.isMuseumAllowed,
      metadata: artifact.metadata,
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Calculates pagination offset from page and pageSize.
   */
  private calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.pageSize;
  }

  /**
   * Maps sort field to actual database column.
   */
  private getSortColumn(sortBy?: string): string {
    const columnMapping: Record<string, string> = {
      title: 'title',
      era: 'era',
      rarity: 'rarity',
      category: 'category',
      created_at: 'created_at',
      slug: 'slug',
    };
    return columnMapping[sortBy ?? 'created_at'] ?? 'created_at';
  }

  /**
   * Applies filter parameters to a query builder.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applyFilters(query: any, filters?: ArtifactFilterParams): void {
    if (!filters) return;

    if (filters.category && filters.category.length > 0) {
      query = query.in('category', filters.category);
    }

    if (filters.rarity && filters.rarity.length > 0) {
      query = query.in('rarity', filters.rarity);
    }

    if (filters.era && filters.era.length > 0) {
      query = query.in('era', filters.era);
    }

    if (filters.region && filters.region.length > 0) {
      query = query.in('region', filters.region);
    }

    if (filters.isCollectible !== undefined) {
      query = query.eq('is_collectible', filters.isCollectible);
    }

    if (filters.isMuseumAllowed !== undefined) {
      query = query.eq('is_museum_allowed', filters.isMuseumAllowed);
    }

    if (filters.createdAfter) {
      query = query.gte('created_at', filters.createdAfter.toISOString());
    }

    if (filters.createdBefore) {
      query = query.lte('created_at', filters.createdBefore.toISOString());
    }

    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,slug.ilike.%${filters.searchQuery}%`);
    }
  }

  /**
   * Creates a new artifact.
   * @param artifact The artifact to create
   * @returns The created artifact
   */
  async create(artifact: Artifact): Promise<Artifact> {
    logger.debug('Creating artifact', { artifactId: artifact.artifactId.value });

    try {
      const record = this.toInsertRecord(artifact);
      const { data, error } = await this.client
        .from(TABLE_NAME)
        .insert(record)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw RepositoryError.alreadyExists('Artifact', 'artifact_id', artifact.artifactId.value, TABLE_NAME);
        }
        logger.error('Failed to create artifact', error);
        throw RepositoryError.createFailed('Artifact', error);
      }

      if (!data) {
        throw RepositoryError.createFailed('Artifact');
      }

      logger.info('Artifact created successfully', {
        artifactId: artifact.artifactId.value,
        slug: artifact.slug.value,
      });

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error creating artifact', err as Error);
      throw RepositoryError.createFailed('Artifact', err as Error);
    }
  }

  /**
   * Finds an artifact by its internal ID.
   * @param id The artifact ID to find
   * @returns The artifact if found, null otherwise
   */
  async findById(id: ArtifactId): Promise<Artifact | null> {
    logger.debug('Finding artifact by ID', { artifactId: id.value });

    try {
      const { data, error } = await this.client
        .from(TABLE_NAME)
        .select('*')
        .eq('artifact_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find artifact by ID', error);
        throw RepositoryError.entityNotFound('Artifact', id.value, TABLE_NAME);
      }

      return data ? this.mapRowToEntity(data as Record<string, unknown>) : null;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding artifact by ID', err as Error);
      throw RepositoryError.entityNotFound('Artifact', id.value, TABLE_NAME);
    }
  }

  /**
   * Finds an artifact by its slug.
   * @param slug The artifact slug to find
   * @returns The artifact if found, null otherwise
   */
  async findBySlug(slug: string): Promise<Artifact | null> {
    logger.debug('Finding artifact by slug', { slug });

    try {
      const { data, error } = await this.client
        .from(TABLE_NAME)
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find artifact by slug', error);
        throw RepositoryError.entityNotFound('Artifact', slug, TABLE_NAME);
      }

      return data ? this.mapRowToEntity(data as Record<string, unknown>) : null;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding artifact by slug', err as Error);
      throw RepositoryError.entityNotFound('Artifact', slug, TABLE_NAME);
    }
  }

  /**
   * Finds all artifacts (non-paginated).
   * Use with caution - returns all artifacts without pagination.
   * @returns Array of all artifacts
   */
  async findAll(): Promise<Artifact[]> {
    logger.debug('Finding all artifacts');

    try {
      const { data, error } = await this.client
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to find all artifacts', error);
        throw RepositoryError.queryFailed('findAll', error);
      }

      const artifacts = (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
      logger.info('Found all artifacts', { count: artifacts.length });

      return artifacts;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding all artifacts', err as Error);
      throw RepositoryError.queryFailed('findAll', err as Error);
    }
  }

  /**
   * Finds artifacts by category.
   * @param category The category to filter by
   * @returns Array of matching artifacts
   */
  async findByCategory(category: ArtifactCategory): Promise<Artifact[]> {
    logger.debug('Finding artifacts by category', { category });

    try {
      const { data, error } = await this.client
        .from(TABLE_NAME)
        .select('*')
        .eq('category', category)
        .order('title', { ascending: true });

      if (error) {
        logger.error('Failed to find artifacts by category', error);
        throw RepositoryError.queryFailed('findByCategory', error);
      }

      const artifacts = (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
      logger.info('Found artifacts by category', { category, count: artifacts.length });

      return artifacts;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding artifacts by category', err as Error);
      throw RepositoryError.queryFailed('findByCategory', err as Error);
    }
  }

  /**
   * Finds artifacts by rarity.
   * @param rarity The rarity to filter by
   * @returns Array of matching artifacts
   */
  async findByRarity(rarity: ArtifactRarity): Promise<Artifact[]> {
    logger.debug('Finding artifacts by rarity', { rarity });

    try {
      const { data, error } = await this.client
        .from(TABLE_NAME)
        .select('*')
        .eq('rarity', rarity)
        .order('title', { ascending: true });

      if (error) {
        logger.error('Failed to find artifacts by rarity', error);
        throw RepositoryError.queryFailed('findByRarity', error);
      }

      const artifacts = (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
      logger.info('Found artifacts by rarity', { rarity, count: artifacts.length });

      return artifacts;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding artifacts by rarity', err as Error);
      throw RepositoryError.queryFailed('findByRarity', err as Error);
    }
  }

  /**
   * Finds artifacts by era.
   * @param era The era to filter by
   * @returns Array of matching artifacts
   */
  async findByEra(era: ArtifactEra): Promise<Artifact[]> {
    logger.debug('Finding artifacts by era', { era });

    try {
      const { data, error } = await this.client
        .from(TABLE_NAME)
        .select('*')
        .eq('era', era)
        .order('title', { ascending: true });

      if (error) {
        logger.error('Failed to find artifacts by era', error);
        throw RepositoryError.queryFailed('findByEra', error);
      }

      const artifacts = (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
      logger.info('Found artifacts by era', { era, count: artifacts.length });

      return artifacts;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding artifacts by era', err as Error);
      throw RepositoryError.queryFailed('findByEra', err as Error);
    }
  }

  /**
   * Finds artifacts by region.
   * @param region The region to filter by
   * @returns Array of matching artifacts
   */
  async findByRegion(region: ArtifactRegion): Promise<Artifact[]> {
    logger.debug('Finding artifacts by region', { region });

    try {
      const { data, error } = await this.client
        .from(TABLE_NAME)
        .select('*')
        .eq('region', region)
        .order('title', { ascending: true });

      if (error) {
        logger.error('Failed to find artifacts by region', error);
        throw RepositoryError.queryFailed('findByRegion', error);
      }

      const artifacts = (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
      logger.info('Found artifacts by region', { region, count: artifacts.length });

      return artifacts;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding artifacts by region', err as Error);
      throw RepositoryError.queryFailed('findByRegion', err as Error);
    }
  }

  /**
   * Checks if an artifact exists by ID.
   * @param id The artifact ID to check
   * @returns true if artifact exists
   */
  async exists(id: ArtifactId): Promise<boolean> {
    logger.debug('Checking if artifact exists', { artifactId: id.value });

    try {
      const { data, error } = await this.client
        .from(TABLE_NAME)
        .select('artifact_id')
        .eq('artifact_id', id.value)
        .limit(1);

      if (error) {
        logger.error('Failed to check artifact existence', error);
        return false;
      }

      return (data?.length ?? 0) > 0;
    } catch (err) {
      logger.error('Unexpected error checking artifact existence', err as Error);
      return false;
    }
  }

  /**
   * Updates an existing artifact.
   * @param artifact The artifact to update
   * @returns The updated artifact
   */
  async update(artifact: Artifact): Promise<Artifact> {
    logger.debug('Updating artifact', { artifactId: artifact.artifactId.value });

    try {
      const record = this.toUpdateRecord(artifact);
      const { data, error } = await this.client
        .from(TABLE_NAME)
        .update(record)
        .eq('artifact_id', artifact.artifactId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update artifact', error);
        throw RepositoryError.updateFailed('Artifact', artifact.artifactId.value, error);
      }

      if (!data) {
        throw RepositoryError.entityNotFound('Artifact', artifact.artifactId.value, TABLE_NAME);
      }

      logger.info('Artifact updated successfully', {
        artifactId: artifact.artifactId.value,
        slug: artifact.slug.value,
      });

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error updating artifact', err as Error);
      throw RepositoryError.updateFailed('Artifact', artifact.artifactId.value, err as Error);
    }
  }

  /**
   * Archives an artifact (soft delete).
   * @param id The artifact ID to archive
   */
  async archive(id: ArtifactId): Promise<void> {
    logger.debug('Archiving artifact', { artifactId: id.value });

    try {
      const { error } = await this.client
        .from(TABLE_NAME)
        .update({
          is_archived: true,
          archived_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('artifact_id', id.value);

      if (error) {
        logger.error('Failed to archive artifact', error);
        throw RepositoryError.updateFailed('Artifact', id.value, error);
      }

      logger.info('Artifact archived successfully', { artifactId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error archiving artifact', err as Error);
      throw RepositoryError.updateFailed('Artifact', id.value, err as Error);
    }
  }

  /**
   * Restores an archived artifact.
   * @param id The artifact ID to restore
   */
  async restore(id: ArtifactId): Promise<void> {
    logger.debug('Restoring artifact', { artifactId: id.value });

    try {
      const { error } = await this.client
        .from(TABLE_NAME)
        .update({
          is_archived: false,
          archived_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('artifact_id', id.value);

      if (error) {
        logger.error('Failed to restore artifact', error);
        throw RepositoryError.updateFailed('Artifact', id.value, error);
      }

      logger.info('Artifact restored successfully', { artifactId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error restoring artifact', err as Error);
      throw RepositoryError.updateFailed('Artifact', id.value, err as Error);
    }
  }

  /**
   * Permanently deletes an artifact.
   * @param id The artifact ID to delete
   */
  async delete(id: ArtifactId): Promise<void> {
    logger.debug('Deleting artifact', { artifactId: id.value });

    try {
      const { error } = await this.client
        .from(TABLE_NAME)
        .delete()
        .eq('artifact_id', id.value);

      if (error) {
        logger.error('Failed to delete artifact', error);
        throw RepositoryError.deleteFailed('Artifact', id.value, error);
      }

      logger.info('Artifact deleted successfully', { artifactId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error deleting artifact', err as Error);
      throw RepositoryError.deleteFailed('Artifact', id.value, err as Error);
    }
  }

  /**
   * Lists artifacts with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of artifacts
   */
  async list(
    params: PaginationParams,
    filters?: ArtifactFilterParams
  ): Promise<PaginatedResult<Artifact>> {
    logger.debug('Listing artifacts', { params, filters });

    try {
      const offset = this.calculateOffset(params);
      let query = this.client
        .from(TABLE_NAME)
        .select('*', { count: 'exact' });

      // Apply filters
      this.applyFilters(query, filters);

      // Apply sorting
      const sortColumn = this.getSortColumn(params.sortBy);
      const sortOrder = params.sortOrder === SortOrder.ASC;
      query = query.order(sortColumn, { ascending: sortOrder });

      // Apply pagination
      const { data, error, count } = await query.range(offset, offset + params.pageSize - 1);

      if (error) {
        logger.error('Failed to list artifacts', error);
        throw RepositoryError.queryFailed('list', error);
      }

      const items = (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
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
      logger.error('Unexpected error listing artifacts', err as Error);
      throw RepositoryError.queryFailed('list', err as Error);
    }
  }

  /**
   * Counts total artifacts with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching artifacts
   */
  async count(filters?: ArtifactFilterParams): Promise<number> {
    logger.debug('Counting artifacts', { filters });

    try {
      let query = this.client
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      this.applyFilters(query, filters);

      const { error, count } = await query;

      if (error) {
        logger.error('Failed to count artifacts', error);
        throw RepositoryError.queryFailed('count', error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error counting artifacts', err as Error);
      throw RepositoryError.queryFailed('count', err as Error);
    }
  }
}