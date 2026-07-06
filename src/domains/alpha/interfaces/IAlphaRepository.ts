/**
 * IAlphaRepository Interface
 *
 * Interface for Alpha domain repository.
 * Defines all persistence operations for Alpha entities.
 */

import type { AlphaChecklist, AlphaChecklistRecord } from '../entities/AlphaChecklist';
import type { AlphaMilestone, AlphaMilestoneRecord } from '../entities/AlphaMilestone';
import type { AlphaSnapshot, AlphaSnapshotRecord } from '../entities/AlphaSnapshot';
import type { ChecklistId } from '../value-objects/ChecklistId';
import type { MilestoneId } from '../value-objects/MilestoneId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { ChecklistStatus } from '../types/ChecklistStatus';
import type { MilestoneStatus } from '../types/MilestoneStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for checklists.
 */
export interface AlphaChecklistFilterParams {
  status?: ChecklistStatus;
  owner?: string;
  category?: string;
}

/**
 * Filter parameters for milestones.
 */
export interface AlphaMilestoneFilterParams {
  status?: MilestoneStatus;
  category?: string;
}

/**
 * Alpha repository interface.
 * Defines all persistence operations for Alpha entities.
 */
export interface IAlphaRepository {
  // ============ Checklist Operations ============

  /**
   * Creates a new checklist item.
   * @param checklist The checklist to create
   * @returns The created checklist
   */
  createChecklist(checklist: AlphaChecklist): Promise<AlphaChecklist>;

  /**
   * Finds a checklist by its ID.
   * @param id The checklist ID to find
   * @returns The checklist if found, null otherwise
   */
  findChecklistById(id: ChecklistId): Promise<AlphaChecklist | null>;

  /**
   * Updates an existing checklist.
   * @param checklist The checklist to update
   * @returns The updated checklist
   */
  updateChecklist(checklist: AlphaChecklist): Promise<AlphaChecklist>;

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
    filters?: AlphaChecklistFilterParams
  ): Promise<PaginatedResult<AlphaChecklist>>;

  /**
   * Counts total checklists with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching checklists
   */
  countChecklists(filters?: AlphaChecklistFilterParams): Promise<number>;

  // ============ Milestone Operations ============

  /**
   * Creates a new milestone.
   * @param milestone The milestone to create
   * @returns The created milestone
   */
  createMilestone(milestone: AlphaMilestone): Promise<AlphaMilestone>;

  /**
   * Finds a milestone by its ID.
   * @param id The milestone ID to find
   * @returns The milestone if found, null otherwise
   */
  findMilestoneById(id: MilestoneId): Promise<AlphaMilestone | null>;

  /**
   * Updates an existing milestone.
   * @param milestone The milestone to update
   * @returns The updated milestone
   */
  updateMilestone(milestone: AlphaMilestone): Promise<AlphaMilestone>;

  /**
   * Deletes a milestone.
   * @param id The milestone ID to delete
   */
  deleteMilestone(id: MilestoneId): Promise<void>;

  /**
   * Lists milestones with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of milestones
   */
  listMilestones(
    params: PaginationParams,
    filters?: AlphaMilestoneFilterParams
  ): Promise<PaginatedResult<AlphaMilestone>>;

  /**
   * Counts total milestones with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching milestones
   */
  countMilestones(filters?: AlphaMilestoneFilterParams): Promise<number>;

  // ============ Snapshot Operations ============

  /**
   * Creates a new snapshot.
   * @param snapshot The snapshot to create
   * @returns The created snapshot
   */
  createSnapshot(snapshot: AlphaSnapshot): Promise<AlphaSnapshot>;

  /**
   * Finds a snapshot by its ID.
   * @param id The snapshot ID to find
   * @returns The snapshot if found, null otherwise
   */
  findSnapshotById(id: SnapshotId): Promise<AlphaSnapshot | null>;

  /**
   * Lists all snapshots with pagination.
   * @param params Pagination parameters
   * @returns Paginated result of snapshots
   */
  listSnapshots(params: PaginationParams): Promise<PaginatedResult<AlphaSnapshot>>;

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
