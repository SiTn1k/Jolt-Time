/**
 * Museum Repository Interface
 *
 * Interface defining the contract for Museum persistence.
 * All Museum repository implementations must adhere to this interface.
 */

import type { MuseumId } from '../value-objects/MuseumId';
import type { HallId } from '../value-objects/HallId';
import type { ExhibitId } from '../value-objects/ExhibitId';
import type { Museum } from '../entities/Museum';
import type { MuseumHall } from '../entities/MuseumHall';
import type { MuseumExhibit } from '../entities/MuseumExhibit';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying museums.
 */
export interface MuseumFilterParams {
  /** Filter by player profile ID */
  playerProfileId?: string;

  /** Filter by museum type */
  museumType?: string;

  /** Filter by minimum level */
  minLevel?: number;

  /** Filter by maximum level */
  maxLevel?: number;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying halls.
 */
export interface HallFilterParams {
  /** Filter by museum ID */
  museumId?: string;

  /** Filter by hall type */
  hallType?: string;

  /** Filter by position range */
  minPosition?: number;

  /** Filter by position range */
  maxPosition?: number;
}

/**
 * Filter parameters for querying exhibits.
 */
export interface ExhibitFilterParams {
  /** Filter by hall ID */
  hallId?: string;

  /** Filter by artifact ID */
  artifactId?: string;

  /** Filter by inventory item ID */
  inventoryItemId?: string;

  /** Filter by condition */
  condition?: string;

  /** Filter by minimum popularity */
  minPopularity?: number;

  /** Filter by maximum popularity */
  maxPopularity?: number;

  /** Sort by popularity */
  sortByPopularity?: boolean;
}

/**
 * Museum Repository interface.
 * Defines all data access operations for Museum entities.
 */
export interface IMuseumRepository {
  // ==================== Museum Operations ====================

  /**
   * Creates a new museum.
   * @param museum The museum to create
   * @returns The created museum
   */
  create(museum: Museum): Promise<Museum>;

  /**
   * Finds a museum by its internal ID.
   * @param id The museum ID to find
   * @returns The museum if found, null otherwise
   */
  findById(id: MuseumId): Promise<Museum | null>;

  /**
   * Finds a museum by player profile ID.
   * @param playerProfileId The player profile ID to find museum for
   * @returns The museum if found, null otherwise
   */
  findByPlayerProfileId(playerProfileId: string): Promise<Museum | null>;

  /**
   * Checks if a museum exists by ID.
   * @param id The museum ID to check
   * @returns true if museum exists
   */
  exists(id: MuseumId): Promise<boolean>;

  /**
   * Updates an existing museum.
   * @param museum The museum to update
   * @returns The updated museum
   */
  update(museum: Museum): Promise<Museum>;

  /**
   * Deletes a museum.
   * @param id The museum ID to delete
   */
  delete(id: MuseumId): Promise<void>;

  /**
   * Lists museums with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of museums
   */
  list(
    params: PaginationParams,
    filters?: MuseumFilterParams
  ): Promise<PaginatedResult<Museum>>;

  // ==================== Hall Operations ====================

  /**
   * Creates a new hall.
   * @param hall The hall to create
   * @returns The created hall
   */
  createHall(hall: MuseumHall): Promise<MuseumHall>;

  /**
   * Finds a hall by its internal ID.
   * @param id The hall ID to find
   * @returns The hall if found, null otherwise
   */
  findHallById(id: HallId): Promise<MuseumHall | null>;

  /**
   * Finds all halls in a museum.
   * @param museumId The museum ID
   * @returns Array of halls
   */
  findHallsByMuseumId(museumId: MuseumId): Promise<MuseumHall[]>;

  /**
   * Finds a hall by type in a museum.
   * @param museumId The museum ID
   * @param hallType The hall type to find
   * @returns The hall if found, null otherwise
   */
  findHallByType(museumId: MuseumId, hallType: string): Promise<MuseumHall | null>;

  /**
   * Updates an existing hall.
   * @param hall The hall to update
   * @returns The updated hall
   */
  updateHall(hall: MuseumHall): Promise<MuseumHall>;

  /**
   * Deletes a hall.
   * @param id The hall ID to delete
   */
  deleteHall(id: HallId): Promise<void>;

  /**
   * Lists halls with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of halls
   */
  listHalls(
    params: PaginationParams,
    filters?: HallFilterParams
  ): Promise<PaginatedResult<MuseumHall>>;

  // ==================== Exhibit Operations ====================

  /**
   * Creates a new exhibit.
   * @param exhibit The exhibit to create
   * @returns The created exhibit
   */
  createExhibit(exhibit: MuseumExhibit): Promise<MuseumExhibit>;

  /**
   * Finds an exhibit by its internal ID.
   * @param id The exhibit ID to find
   * @returns The exhibit if found, null otherwise
   */
  findExhibitById(id: ExhibitId): Promise<MuseumExhibit | null>;

  /**
   * Finds all exhibits in a hall.
   * @param hallId The hall ID
   * @returns Array of exhibits
   */
  findExhibitsByHallId(hallId: HallId): Promise<MuseumExhibit[]>;

  /**
   * Finds an exhibit by inventory item ID.
   * @param inventoryItemId The inventory item ID
   * @returns The exhibit if found, null otherwise
   */
  findExhibitByInventoryItemId(inventoryItemId: string): Promise<MuseumExhibit | null>;

  /**
   * Updates an existing exhibit.
   * @param exhibit The exhibit to update
   * @returns The updated exhibit
   */
  updateExhibit(exhibit: MuseumExhibit): Promise<MuseumExhibit>;

  /**
   * Deletes an exhibit.
   * @param id The exhibit ID to delete
   */
  deleteExhibit(id: ExhibitId): Promise<void>;

  /**
   * Lists exhibits with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of exhibits
   */
  listExhibits(
    params: PaginationParams,
    filters?: ExhibitFilterParams
  ): Promise<PaginatedResult<MuseumExhibit>>;

  // ==================== Statistics Operations ====================

  /**
   * Gets museum statistics including hall and exhibit counts.
   * @param museumId The museum ID
   * @returns Museum statistics
   */
  getMuseumStatistics(museumId: MuseumId): Promise<MuseumStatisticsResult>;

  /**
   * Gets hall statistics including exhibit counts.
   * @param hallId The hall ID
   * @returns Hall statistics
   */
  getHallStatistics(hallId: HallId): Promise<HallStatisticsResult>;
}

/**
 * Museum statistics result.
 */
export interface MuseumStatisticsResult {
  museumId: string;
  totalExhibits: number;
  totalArtifacts: number;
  hallCount: number;
  averagePopularity: number;
}

/**
 * Hall statistics result.
 */
export interface HallStatisticsResult {
  hallId: string;
  exhibitCount: number;
  utilizationPercentage: number;
  averagePopularity: number;
}
