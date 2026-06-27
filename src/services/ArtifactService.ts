/**
 * Artifact Service
 *
 * Production service for managing artifact operations.
 * This is the SINGLE SOURCE OF TRUTH for artifact catalog management.
 *
 * IMPORTANT: Artifact is IMMUTABLE game content.
 * Artifact Service manages the CATALOG of artifacts, NOT ownership.
 *
 * Features:
 * - Artifact creation (admin)
 * - Artifact retrieval by ID, slug, category, era, region, rarity
 * - Artifact update (admin)
 * - Artifact archive/restore/delete (admin)
 * - Catalog loading and initialization
 * - Search and filtering
 * - Pagination and sorting
 */

import type { IArtifactRepository, ArtifactFilterParams } from '../domains/artifact/interfaces/IArtifactRepository';
import { SupabaseArtifactRepository } from '../domains/artifact/repositories/SupabaseArtifactRepository';
import { Artifact } from '../domains/artifact/entities/Artifact';
import { ArtifactId } from '../domains/artifact/value-objects/ArtifactId';
import { ArtifactSlug } from '../domains/artifact/value-objects/ArtifactSlug';
import { ArtifactTitle } from '../domains/artifact/value-objects/ArtifactTitle';
import { ArtifactDescription } from '../domains/artifact/value-objects/ArtifactDescription';
import {
  ArtifactCategory,
  ArtifactRarity,
  ArtifactEra,
  ArtifactRegion,
} from '../domains/artifact/types';
import type { ArtifactMetadata } from '../domains/artifact/types';
import type { CreateArtifactDto } from '../domains/artifact/dto/CreateArtifact.dto';
import type { UpdateArtifactDto } from '../domains/artifact/dto/UpdateArtifact.dto';
import type { ArtifactResponseDto, ArtifactSummaryDto } from '../domains/artifact/dto/ArtifactResponse.dto';
import { ArtifactMapper } from '../domains/artifact/mappers/ArtifactMapper';
import { ArtifactValidator } from '../domains/artifact/validators/ArtifactValidator';
import type { PaginationParams, PaginatedResult } from '../shared/types/base.types';
import { createLogger } from '../core/logging/logger.service';
import { DEFAULT_PAGINATION } from '../shared/types/base.types';

const logger = createLogger('ArtifactService');

/**
 * Result type for service operations.
 */
export type ArtifactServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Artifact summary for catalog views.
 */
export interface ArtifactCatalogSummary {
  totalArtifacts: number;
  byCategory: Record<ArtifactCategory, number>;
  byRarity: Record<ArtifactRarity, number>;
  byEra: Record<ArtifactEra, number>;
  byRegion: Record<ArtifactRegion, number>;
  collectibleCount: number;
  museumAllowedCount: number;
}

/**
 * Search options for artifact queries.
 */
export interface ArtifactSearchOptions {
  query?: string;
  category?: ArtifactCategory;
  rarity?: ArtifactRarity;
  era?: ArtifactEra;
  region?: ArtifactRegion;
  isCollectible?: boolean;
  isMuseumAllowed?: boolean;
}

/**
 * Artifact Service
 * Single source of truth for all artifact operations in the game.
 */
export class ArtifactService {
  private readonly repository: IArtifactRepository;
  private catalogLoaded = false;
  private cachedCatalog: Artifact[] = [];

  /**
   * Creates a new ArtifactService instance.
   */
  constructor(repository?: IArtifactRepository) {
    this.repository = repository ?? new SupabaseArtifactRepository();
  }

  /**
   * Creates a new artifact (admin operation).
   *
   * @param dto The artifact creation data
   * @returns ArtifactServiceResult with the created artifact
   */
  async createArtifact(dto: CreateArtifactDto): Promise<ArtifactServiceResult<Artifact>> {
    logger.info('Creating artifact', { slug: dto.slug });

    // Validate DTO
    const validation = ArtifactValidator.validateCreate(dto);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join('; ') };
    }

    try {
      // Check if slug already exists
      const existing = await this.repository.findBySlug(dto.slug);
      if (existing) {
        return { success: false, error: `Artifact with slug '${dto.slug}' already exists` };
      }

      // Create value objects
      const artifactId = ArtifactId.generate();
      const slug = ArtifactSlug.reconstruct(dto.slug.toLowerCase().trim());
      const title = ArtifactTitle.reconstruct(dto.title.trim());
      const description = ArtifactDescription.reconstruct(dto.description.trim());

      // Create artifact entity
      const artifact = Artifact.create({
        artifactId,
        slug,
        title,
        description,
        category: dto.category,
        rarity: dto.rarity,
        era: dto.era,
        region: dto.region,
        culture: dto.culture.trim(),
        material: dto.material.trim(),
        condition: dto.condition.trim(),
        image: dto.image.trim(),
        thumbnail: dto.thumbnail.trim(),
        animation: dto.animation?.trim(),
        isCollectible: dto.isCollectible ?? true,
        isMuseumAllowed: dto.isMuseumAllowed ?? true,
        metadata: dto.metadata ?? {},
      });

      // Persist to database
      const created = await this.repository.create(artifact);

      // Invalidate catalog cache
      this.catalogLoaded = false;

      logger.info('Artifact created successfully', {
        artifactId: created.artifactId.value,
        slug: created.slug.value,
      });

      return { success: true, data: created };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create artifact';
      logger.error('Failed to create artifact', err as Error, { slug: dto.slug });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads an artifact by ID.
   *
   * @param id The artifact ID
   * @returns ArtifactServiceResult with the artifact
   */
  async loadArtifact(id: string): Promise<ArtifactServiceResult<Artifact>> {
    logger.debug('Loading artifact', { artifactId: id });

    try {
      const artifactId = ArtifactId.create(id);
      const artifact = await this.repository.findById(artifactId);

      if (!artifact) {
        return { success: false, error: 'Artifact not found' };
      }

      return { success: true, data: artifact };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load artifact';
      logger.error('Failed to load artifact', err as Error, { artifactId: id });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads an artifact by slug.
   *
   * @param slug The artifact slug
   * @returns ArtifactServiceResult with the artifact
   */
  async loadBySlug(slug: string): Promise<ArtifactServiceResult<Artifact>> {
    logger.debug('Loading artifact by slug', { slug });

    try {
      const artifact = await this.repository.findBySlug(slug);

      if (!artifact) {
        return { success: false, error: 'Artifact not found' };
      }

      return { success: true, data: artifact };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load artifact';
      logger.error('Failed to load artifact by slug', err as Error, { slug });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads artifacts by category.
   *
   * @param category The category to filter by
   * @returns ArtifactServiceResult with matching artifacts
   */
  async loadByCategory(category: ArtifactCategory): Promise<ArtifactServiceResult<Artifact[]>> {
    logger.debug('Loading artifacts by category', { category });

    try {
      const artifacts = await this.repository.findByCategory(category);
      return { success: true, data: artifacts };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load artifacts';
      logger.error('Failed to load artifacts by category', err as Error, { category });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads artifacts by era.
   *
   * @param era The era to filter by
   * @returns ArtifactServiceResult with matching artifacts
   */
  async loadByEra(era: ArtifactEra): Promise<ArtifactServiceResult<Artifact[]>> {
    logger.debug('Loading artifacts by era', { era });

    try {
      const artifacts = await this.repository.findByEra(era);
      return { success: true, data: artifacts };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load artifacts';
      logger.error('Failed to load artifacts by era', err as Error, { era });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads artifacts by region.
   *
   * @param region The region to filter by
   * @returns ArtifactServiceResult with matching artifacts
   */
  async loadByRegion(region: ArtifactRegion): Promise<ArtifactServiceResult<Artifact[]>> {
    logger.debug('Loading artifacts by region', { region });

    try {
      const artifacts = await this.repository.findByRegion(region);
      return { success: true, data: artifacts };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load artifacts';
      logger.error('Failed to load artifacts by region', err as Error, { region });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Updates an existing artifact (admin operation).
   *
   * @param id The artifact ID to update
   * @param dto The update data
   * @returns ArtifactServiceResult with the updated artifact
   */
  async updateArtifact(id: string, dto: UpdateArtifactDto): Promise<ArtifactServiceResult<Artifact>> {
    logger.info('Updating artifact', { artifactId: id });

    // Validate DTO
    const validation = ArtifactValidator.validateUpdate(dto);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join('; ') };
    }

    try {
      const artifactId = ArtifactId.create(id);

      // Load existing artifact
      const existing = await this.repository.findById(artifactId);
      if (!existing) {
        return { success: false, error: 'Artifact not found' };
      }

      // Check slug uniqueness if slug is being changed
      if (dto.slug && dto.slug !== existing.slug.value) {
        const slugExists = await this.repository.findBySlug(dto.slug);
        if (slugExists) {
          return { success: false, error: `Artifact with slug '${dto.slug}' already exists` };
        }
      }

      // Create updated artifact using copyWith
      const updatedArtifact = existing.copyWith({
        ...(dto.slug && { slug: ArtifactSlug.reconstruct(dto.slug.toLowerCase().trim()) }),
        ...(dto.title && { title: ArtifactTitle.reconstruct(dto.title.trim()) }),
        ...(dto.description && { description: ArtifactDescription.reconstruct(dto.description.trim()) }),
        ...(dto.category && { category: dto.category }),
        ...(dto.rarity && { rarity: dto.rarity }),
        ...(dto.era && { era: dto.era }),
        ...(dto.region && { region: dto.region }),
        ...(dto.culture && { culture: dto.culture.trim() }),
        ...(dto.material && { material: dto.material.trim() }),
        ...(dto.condition && { condition: dto.condition.trim() }),
        ...(dto.image && { image: dto.image.trim() }),
        ...(dto.thumbnail && { thumbnail: dto.thumbnail.trim() }),
        ...(dto.animation !== undefined && { animation: dto.animation?.trim() }),
        ...(dto.isCollectible !== undefined && { isCollectible: dto.isCollectible }),
        ...(dto.isMuseumAllowed !== undefined && { isMuseumAllowed: dto.isMuseumAllowed }),
        ...(dto.metadata && { metadata: dto.metadata }),
      });

      // Persist update
      const result = await this.repository.update(updatedArtifact);

      // Invalidate catalog cache
      this.catalogLoaded = false;

      logger.info('Artifact updated successfully', {
        artifactId: result.artifactId.value,
        slug: result.slug.value,
      });

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update artifact';
      logger.error('Failed to update artifact', err as Error, { artifactId: id });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Archives an artifact (soft delete).
   *
   * @param id The artifact ID to archive
   * @returns ArtifactServiceResult
   */
  async archiveArtifact(id: string): Promise<ArtifactServiceResult<void>> {
    logger.info('Archiving artifact', { artifactId: id });

    try {
      const artifactId = ArtifactId.create(id);

      // Check if artifact exists
      const existing = await this.repository.findById(artifactId);
      if (!existing) {
        return { success: false, error: 'Artifact not found' };
      }

      await this.repository.archive(artifactId);

      // Invalidate catalog cache
      this.catalogLoaded = false;

      logger.info('Artifact archived successfully', { artifactId: id });
      return { success: true, data: undefined };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to archive artifact';
      logger.error('Failed to archive artifact', err as Error, { artifactId: id });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Restores an archived artifact.
   *
   * @param id The artifact ID to restore
   * @returns ArtifactServiceResult
   */
  async restoreArtifact(id: string): Promise<ArtifactServiceResult<void>> {
    logger.info('Restoring artifact', { artifactId: id });

    try {
      const artifactId = ArtifactId.create(id);
      await this.repository.restore(artifactId);

      // Invalidate catalog cache
      this.catalogLoaded = false;

      logger.info('Artifact restored successfully', { artifactId: id });
      return { success: true, data: undefined };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore artifact';
      logger.error('Failed to restore artifact', err as Error, { artifactId: id });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Permanently deletes an artifact.
   *
   * @param id The artifact ID to delete
   * @returns ArtifactServiceResult
   */
  async deleteArtifact(id: string): Promise<ArtifactServiceResult<void>> {
    logger.info('Deleting artifact', { artifactId: id });

    try {
      const artifactId = ArtifactId.create(id);

      // Check if artifact exists
      const existing = await this.repository.findById(artifactId);
      if (!existing) {
        return { success: false, error: 'Artifact not found' };
      }

      await this.repository.delete(artifactId);

      // Invalidate catalog cache
      this.catalogLoaded = false;

      logger.info('Artifact deleted successfully', { artifactId: id });
      return { success: true, data: undefined };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete artifact';
      logger.error('Failed to delete artifact', err as Error, { artifactId: id });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Lists artifacts with pagination and filtering.
   *
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns ArtifactServiceResult with paginated artifacts
   */
  async listArtifacts(
    params?: PaginationParams,
    filters?: ArtifactFilterParams
  ): Promise<ArtifactServiceResult<PaginatedResult<Artifact>>> {
    logger.debug('Listing artifacts', { params, filters });

    try {
      const pagination = params ?? DEFAULT_PAGINATION;
      const result = await this.repository.list(pagination, filters);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list artifacts';
      logger.error('Failed to list artifacts', err as Error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets artifact summary for catalog overview.
   *
   * @returns ArtifactServiceResult with catalog summary
   */
  async getArtifactSummary(): Promise<ArtifactServiceResult<ArtifactCatalogSummary>> {
    logger.debug('Getting artifact summary');

    try {
      const artifacts = await this.repository.findAll();

      const summary: ArtifactCatalogSummary = {
        totalArtifacts: artifacts.length,
        byCategory: {} as Record<ArtifactCategory, number>,
        byRarity: {} as Record<ArtifactRarity, number>,
        byEra: {} as Record<ArtifactEra, number>,
        byRegion: {} as Record<ArtifactRegion, number>,
        collectibleCount: 0,
        museumAllowedCount: 0,
      };

      // Initialize counts
      Object.keys(ArtifactCategory).forEach((key) => {
        summary.byCategory[key as ArtifactCategory] = 0;
      });
      Object.keys(ArtifactRarity).forEach((key) => {
        summary.byRarity[key as ArtifactRarity] = 0;
      });
      Object.keys(ArtifactEra).forEach((key) => {
        summary.byEra[key as ArtifactEra] = 0;
      });
      Object.keys(ArtifactRegion).forEach((key) => {
        summary.byRegion[key as ArtifactRegion] = 0;
      });

      // Count artifacts
      for (const artifact of artifacts) {
        summary.byCategory[artifact.category]++;
        summary.byRarity[artifact.rarity]++;
        summary.byEra[artifact.era]++;
        summary.byRegion[artifact.region]++;
        if (artifact.isCollectible) summary.collectibleCount++;
        if (artifact.isMuseumAllowed) summary.museumAllowedCount++;
      }

      return { success: true, data: summary };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get artifact summary';
      logger.error('Failed to get artifact summary', err as Error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads the full artifact catalog into cache.
   * Call this at application startup.
   *
   * @param forceReload Force reload even if already loaded
   * @returns ArtifactServiceResult with catalog
   */
  async loadCatalog(forceReload = false): Promise<ArtifactServiceResult<Artifact[]>> {
    if (this.catalogLoaded && !forceReload) {
      logger.debug('Catalog already loaded, returning cached');
      return { success: true, data: this.cachedCatalog };
    }

    logger.info('Loading artifact catalog');

    try {
      const artifacts = await this.repository.findAll();
      this.cachedCatalog = artifacts;
      this.catalogLoaded = true;

      logger.info('Artifact catalog loaded', { count: artifacts.length });
      return { success: true, data: artifacts };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load catalog';
      logger.error('Failed to load artifact catalog', err as Error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets an artifact from catalog cache.
   * Requires catalog to be loaded first.
   *
   * @param id The artifact ID
   * @returns ArtifactServiceResult with artifact
   */
  async getFromCatalog(id: string): Promise<ArtifactServiceResult<Artifact>> {
    if (!this.catalogLoaded) {
      return { success: false, error: 'Catalog not loaded. Call loadCatalog() first.' };
    }

    const artifact = this.cachedCatalog.find((a) => a.artifactId.value === id);
    if (!artifact) {
      return { success: false, error: 'Artifact not found in catalog' };
    }

    return { success: true, data: artifact };
  }

  /**
   * Gets an artifact by slug from catalog cache.
   * Requires catalog to be loaded first.
   *
   * @param slug The artifact slug
   * @returns ArtifactServiceResult with artifact
   */
  async getBySlugFromCatalog(slug: string): Promise<ArtifactServiceResult<Artifact>> {
    if (!this.catalogLoaded) {
      return { success: false, error: 'Catalog not loaded. Call loadCatalog() first.' };
    }

    const artifact = this.cachedCatalog.find((a) => a.slug.value === slug);
    if (!artifact) {
      return { success: false, error: 'Artifact not found in catalog' };
    }

    return { success: true, data: artifact };
  }

  /**
   * Searches artifacts in the catalog.
   * Requires catalog to be loaded first.
   *
   * @param options Search options
   * @returns ArtifactServiceResult with matching artifacts
   */
  async searchInCatalog(options: ArtifactSearchOptions): Promise<ArtifactServiceResult<Artifact[]>> {
    if (!this.catalogLoaded) {
      return { success: false, error: 'Catalog not loaded. Call loadCatalog() first.' };
    }

    let results = this.cachedCatalog;

    if (options.query) {
      const query = options.query.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.value.toLowerCase().includes(query) ||
          a.slug.value.toLowerCase().includes(query) ||
          a.description.value.toLowerCase().includes(query)
      );
    }

    if (options.category) {
      results = results.filter((a) => a.category === options.category);
    }

    if (options.rarity) {
      results = results.filter((a) => a.rarity === options.rarity);
    }

    if (options.era) {
      results = results.filter((a) => a.era === options.era);
    }

    if (options.region) {
      results = results.filter((a) => a.region === options.region);
    }

    if (options.isCollectible !== undefined) {
      results = results.filter((a) => a.isCollectible === options.isCollectible);
    }

    if (options.isMuseumAllowed !== undefined) {
      results = results.filter((a) => a.isMuseumAllowed === options.isMuseumAllowed);
    }

    return { success: true, data: results };
  }

  /**
   * Converts an artifact to response DTO.
   *
   * @param artifact The artifact entity
   * @returns ArtifactResponseDto
   */
  toResponseDto(artifact: Artifact): ArtifactResponseDto {
    return ArtifactMapper.toResponse(artifact);
  }

  /**
   * Converts an artifact to summary DTO.
   *
   * @param artifact The artifact entity
   * @returns ArtifactSummaryDto
   */
  toSummaryDto(artifact: Artifact): ArtifactSummaryDto {
    return ArtifactMapper.toSummary(artifact);
  }

  /**
   * Checks if catalog is loaded.
   */
  isCatalogLoaded(): boolean {
    return this.catalogLoaded;
  }
}

/**
 * Create a new ArtifactService instance.
 */
export function createArtifactService(): ArtifactService {
  return new ArtifactService();
}