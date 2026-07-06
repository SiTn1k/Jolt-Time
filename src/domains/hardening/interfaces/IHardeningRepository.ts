/**
 * IHardeningRepository Interface
 *
 * Interface for Hardening domain repository.
 * Defines all persistence operations for Hardening entities.
 */

import type {
  HardeningRule,
  HardeningRuleRecord,
} from '../entities/HardeningRule';
import type {
  HardeningChecklist,
  HardeningChecklistRecord,
} from '../entities/HardeningChecklist';
import type { HardeningSnapshot, HardeningSnapshotRecord } from '../entities/HardeningSnapshot';
import type { RuleId } from '../value-objects/RuleId';
import type { ChecklistId } from '../value-objects/ChecklistId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { HardeningStatus } from '../types/HardeningStatus';
import type { ChecklistStatus } from '../types/ChecklistStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for rules.
 */
export interface RuleFilterParams {
  status?: HardeningStatus;
  priority?: number;
  category?: string;
  owner?: string;
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
 * Hardening repository interface.
 * Defines all persistence operations for Hardening entities.
 */
export interface IHardeningRepository {
  // ============ Rule Operations ============

  /**
   * Creates a new hardening rule.
   * @param rule The rule to create
   * @returns The created rule
   */
  createRule(rule: HardeningRule): Promise<HardeningRule>;

  /**
   * Finds a rule by its ID.
   * @param id The rule ID to find
   * @returns The rule if found, null otherwise
   */
  findRuleById(id: RuleId): Promise<HardeningRule | null>;

  /**
   * Updates an existing rule.
   * @param rule The rule to update
   * @returns The updated rule
   */
  updateRule(rule: HardeningRule): Promise<HardeningRule>;

  /**
   * Deletes a rule.
   * @param id The rule ID to delete
   */
  deleteRule(id: RuleId): Promise<void>;

  /**
   * Lists rules with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of rules
   */
  listRules(
    params: PaginationParams,
    filters?: RuleFilterParams
  ): Promise<PaginatedResult<HardeningRule>>;

  /**
   * Counts total rules with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching rules
   */
  countRules(filters?: RuleFilterParams): Promise<number>;

  // ============ Checklist Operations ============

  /**
   * Creates a new checklist item.
   * @param checklist The checklist to create
   * @returns The created checklist
   */
  createChecklist(checklist: HardeningChecklist): Promise<HardeningChecklist>;

  /**
   * Finds a checklist by its ID.
   * @param id The checklist ID to find
   * @returns The checklist if found, null otherwise
   */
  findChecklistById(id: ChecklistId): Promise<HardeningChecklist | null>;

  /**
   * Updates an existing checklist.
   * @param checklist The checklist to update
   * @returns The updated checklist
   */
  updateChecklist(checklist: HardeningChecklist): Promise<HardeningChecklist>;

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
  ): Promise<PaginatedResult<HardeningChecklist>>;

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
  createSnapshot(snapshot: HardeningSnapshot): Promise<HardeningSnapshot>;

  /**
   * Finds a snapshot by its ID.
   * @param id The snapshot ID to find
   * @returns The snapshot if found, null otherwise
   */
  findSnapshotById(id: SnapshotId): Promise<HardeningSnapshot | null>;

  /**
   * Lists all snapshots with pagination.
   * @param params Pagination parameters
   * @returns Paginated result of snapshots
   */
  listSnapshots(params: PaginationParams): Promise<PaginatedResult<HardeningSnapshot>>;

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
