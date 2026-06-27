/**
 * Artifact Repository Interface
 *
 * Interface defining the contract for Artifact persistence.
 * All Artifact repository implementations must adhere to this interface.
 */

import type { ArtifactId } from '../value-objects/ArtifactId';
import type { Artifact } from '../entities/Artifact';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying artifacts.
 */
export interface ArtifactFilterParams {
  /** Filter by category */
  category?: string[];

  /** Filter by rarity */
  rarity?: string[];

  /** Filter by era */
  era?: string[];

  /** Filter by region */
  region?: string[];

  /** Filter by collectible status */
  isCollectible?: boolean;

  /** Filter by museum allowed status */
  isMuseumAllowed?: boolean;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Artifact repository interface.
 * Defines all data access operations for Artifact entities.
 */
export interface IArtifactRepository {
  /**
   * Creates a new artifact.
   * @param artifact The artifact to create
   * @returns The created artifact
   */
  create(artifact: Artifact): Promise<Artifact>;

  /**
   * Finds an artifact by its internal ID.
   * @param id The artifact ID to find
   * @returns The artifact if found, null otherwise
   */
  findById(id: ArtifactId): Promise<Artifact | null>;

  /**
   * Finds an artifact by its slug.
   * @param slug The artifact slug to find
   * @returns The artifact if found, null otherwise
   */
  findBySlug(slug: string): Promise<Artifact | null>;

  /**
   * Checks if an artifact exists by ID.
   * @param id The artifact ID to check
   * @returns true if artifact exists
   */
  exists(id: ArtifactId): Promise<boolean>;

  /**
   * Updates an existing artifact.
   * @param artifact The artifact to update
   * @returns The updated artifact
   */
  update(artifact: Artifact): Promise<Artifact>;

  /**
   * Archives an artifact (soft delete).
   * @param id The artifact ID to archive
   */
  archive(id: ArtifactId): Promise<void>;

  /**
   * Lists artifacts with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of artifacts
   */
  list(
    params: PaginationParams,
    filters?: ArtifactFilterParams
  ): Promise<PaginatedResult<Artifact>>;

  /**
   * Counts total artifacts with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching artifacts
   */
  count(filters?: ArtifactFilterParams): Promise<number>;
}