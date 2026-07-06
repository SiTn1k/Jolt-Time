/**
 * IReleaseRepository Interface
 *
 * Interface for Release domain repository.
 * Defines all persistence operations for Release entities.
 */

import type {
  ReleaseCandidate,
  ReleaseCandidateRecord,
} from '../entities/ReleaseCandidate';
import type {
  ReleaseChecklist,
  ReleaseChecklistRecord,
} from '../entities/ReleaseChecklist';
import type { ReleaseSnapshot, ReleaseSnapshotRecord } from '../entities/ReleaseSnapshot';
import type { ReleaseId } from '../value-objects/ReleaseId';
import type { ChecklistId } from '../value-objects/ChecklistId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { ReleaseStatus } from '../types/ReleaseStatus';
import type { ChecklistStatus } from '../types/ChecklistStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for releases.
 */
export interface ReleaseFilterParams {
  status?: ReleaseStatus;
}

/**
 * Filter parameters for checklists.
 */
export interface ChecklistFilterParams {
  status?: ChecklistStatus;
  owner?: string;
  category?: string;
}

/**
 * Release repository interface.
 * Defines all persistence operations for Release entities.
 */
export interface IReleaseRepository {
  // ============ Release Candidate Operations ============

  /**
   * Creates a new release candidate.
   * @param release The release to create
   * @returns The created release
   */
  createRelease(release: ReleaseCandidate): Promise<ReleaseCandidate>;

  /**
   * Finds a release by its ID.
   * @param id The release ID to find
   * @returns The release if found, null otherwise
   */
  findReleaseById(id: ReleaseId): Promise<ReleaseCandidate | null>;

  /**
   * Updates an existing release.
   * @param release The release to update
   * @returns The updated release
   */
  updateRelease(release: ReleaseCandidate): Promise<ReleaseCandidate>;

  /**
   * Deletes a release.
   * @param id The release ID to delete
   */
  deleteRelease(id: ReleaseId): Promise<void>;

  /**
   * Lists releases with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of releases
   */
  listReleases(
    params: PaginationParams,
    filters?: ReleaseFilterParams
  ): Promise<PaginatedResult<ReleaseCandidate>>;

  /**
   * Counts total releases with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching releases
   */
  countReleases(filters?: ReleaseFilterParams): Promise<number>;

  // ============ Checklist Operations ============

  /**
   * Creates a new checklist item.
   * @param checklist The checklist to create
   * @returns The created checklist
   */
  createChecklist(checklist: ReleaseChecklist): Promise<ReleaseChecklist>;

  /**
   * Finds a checklist by its ID.
   * @param id The checklist ID to find
   * @returns The checklist if found, null otherwise
   */
  findChecklistById(id: ChecklistId): Promise<ReleaseChecklist | null>;

  /**
   * Updates an existing checklist.
   * @param checklist The checklist to update
   * @returns The updated checklist
   */
  updateChecklist(checklist: ReleaseChecklist): Promise<ReleaseChecklist>;

  /**
   * Deletes a checklist.
   * @param id The checklist ID to delete
   */
  deleteChecklist(id: ChecklistId): Promise<void>;

  /**
   * Lists checklists with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of checklists
   */
  listChecklists(
    params: PaginationParams,
    filters?: ChecklistFilterParams
  ): Promise<PaginatedResult<ReleaseChecklist>>;

  /**
   * Counts total checklists with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching checklists
   */
  countChecklists(filters?: ChecklistFilterParams): Promise<number>;

  // ============ Snapshot Operations ============

  /**
   * Creates a new snapshot.
   * @param snapshot The snapshot to create
   * @returns The created snapshot
   */
  createSnapshot(snapshot: ReleaseSnapshot): Promise<ReleaseSnapshot>;

  /**
   * Finds a snapshot by its ID.
   * @param id The snapshot ID to find
   * @returns The snapshot if found, null otherwise
   */
  findSnapshotById(id: SnapshotId): Promise<ReleaseSnapshot | null>;

  /**
   * Lists all snapshots with pagination.
   * @param params Pagination parameters
   * @returns Paginated result of snapshots
   */
  listSnapshots(params: PaginationParams): Promise<PaginatedResult<ReleaseSnapshot>>;

  /**
   * Deletes a snapshot.
   * @param id The snapshot ID to delete
   */
  deleteSnapshot(id: SnapshotId): Promise<void>;

  /**
   * Counts total snapshots.
   * @returns Total count of snapshots
   */
  countSnapshots(): Promise<number>;
}
