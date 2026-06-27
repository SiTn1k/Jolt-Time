/**
 * Academy Repository Interface
 *
 * Interface defining the contract for Academy persistence.
 * All AcademyRepository implementations must adhere to this interface.
 */

import type { AcademyId } from '../value-objects/AcademyId';
import type { Academy } from '../entities/Academy';
import type { ResearchProgress } from '../entities/ResearchProgress';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying academies.
 */
export interface AcademyFilterParams {
  /** Filter by player profile ID */
  playerProfileId?: string;

  /** Filter by academy level greater than or equal to */
  minLevel?: number;

  /** Filter by academy level less than or equal to */
  maxLevel?: number;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying research progress.
 */
export interface ResearchProgressFilterParams {
  /** Filter by academy ID */
  academyId?: string;

  /** Filter by node ID */
  nodeId?: string;

  /** Filter by status */
  status?: string;

  /** Filter by completed after date */
  completedAfter?: Date;

  /** Filter by completed before date */
  completedBefore?: Date;
}

/**
 * Academy repository interface.
 * Defines all data access operations for Academy and ResearchProgress entities.
 */
export interface IAcademyRepository {
  // Academy operations

  /**
   * Creates a new academy.
   * @param academy The academy to create
   * @returns The created academy
   */
  create(academy: Academy): Promise<Academy>;

  /**
   * Finds an academy by its ID.
   * @param id The academy ID to find
   * @returns The academy if found, null otherwise
   */
  findById(id: AcademyId): Promise<Academy | null>;

  /**
   * Finds an academy by player profile ID.
   * @param playerProfileId The player profile ID
   * @returns The academy if found, null otherwise
   */
  findByPlayerProfileId(playerProfileId: string): Promise<Academy | null>;

  /**
   * Checks if an academy exists by ID.
   * @param id The academy ID to check
   * @returns true if academy exists
   */
  exists(id: AcademyId): Promise<boolean>;

  /**
   * Updates an existing academy.
   * @param academy The academy to update
   * @returns The updated academy
   */
  update(academy: Academy): Promise<Academy>;

  /**
   * Deletes an academy.
   * @param id The academy ID to delete
   */
  delete(id: AcademyId): Promise<void>;

  /**
   * Lists academies with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of academies
   */
  list(
    params: PaginationParams,
    filters?: AcademyFilterParams
  ): Promise<PaginatedResult<Academy>>;

  /**
   * Counts total academies with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching academies
   */
  count(filters?: AcademyFilterParams): Promise<number>;

  // ResearchProgress operations

  /**
   * Creates a new research progress entry.
   * @param progress The research progress to create
   * @returns The created research progress
   */
  createProgress(progress: ResearchProgress): Promise<ResearchProgress>;

  /**
   * Finds research progress by ID.
   * @param progressId The progress ID to find
   * @returns The research progress if found, null otherwise
   */
  findProgressById(progressId: string): Promise<ResearchProgress | null>;

  /**
   * Finds all research progress for an academy.
   * @param academyId The academy ID
   * @returns Array of research progress entries
   */
  findProgressByAcademyId(academyId: AcademyId): Promise<ResearchProgress[]>;

  /**
   * Finds research progress for a specific node in an academy.
   * @param academyId The academy ID
   * @param nodeId The node ID
   * @returns The research progress if found, null otherwise
   */
  findProgressByNodeAndAcademy(academyId: AcademyId, nodeId: string): Promise<ResearchProgress | null>;

  /**
   * Updates research progress.
   * @param progress The research progress to update
   * @returns The updated research progress
   */
  updateProgress(progress: ResearchProgress): Promise<ResearchProgress>;

  /**
   * Deletes research progress.
   * @param progressId The progress ID to delete
   */
  deleteProgress(progressId: string): Promise<void>;

  /**
   * Deletes all research progress for an academy.
   * @param academyId The academy ID
   */
  deleteAllProgressForAcademy(academyId: AcademyId): Promise<void>;

  /**
   * Lists research progress with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of research progress
   */
  listProgress(
    params: PaginationParams,
    filters?: ResearchProgressFilterParams
  ): Promise<PaginatedResult<ResearchProgress>>;
}