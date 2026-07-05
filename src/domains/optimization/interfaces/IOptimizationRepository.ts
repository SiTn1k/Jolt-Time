/**
 * Optimization Repository Interface
 *
 * Interface defining the contract for Optimization persistence.
 * All optimization repository implementations must adhere to this interface.
 */

import type { ProfileId } from '../value-objects/ProfileId';
import type { RuleId } from '../value-objects/RuleId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { PerformanceProfile } from '../entities/PerformanceProfile';
import type { OptimizationRule } from '../entities/OptimizationRule';
import type { PerformanceSnapshot } from '../entities/PerformanceSnapshot';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying performance profiles.
 */
export interface PerformanceProfileFilterParams {
  /** Filter by module name */
  moduleName?: string;

  /** Filter by profile type */
  profileType?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying optimization rules.
 */
export interface OptimizationRuleFilterParams {
  /** Filter by enabled state */
  enabled?: boolean;

  /** Filter by rule name */
  ruleName?: string;

  /** Filter by minimum priority */
  minPriority?: number;

  /** Filter by maximum priority */
  maxPriority?: number;
}

/**
 * Filter parameters for querying performance snapshots.
 */
export interface PerformanceSnapshotFilterParams {
  /** Filter by execution time greater than */
  executionTimeGreaterThan?: number;

  /** Filter by execution time less than */
  executionTimeLessThan?: number;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Optimization repository interface.
 * Defines all data access operations for optimization entities.
 */
export interface IOptimizationRepository {
  // ============ Profile Operations ============

  /**
   * Creates a new performance profile.
   * @param profile The profile to create
   * @returns The created profile
   */
  createProfile(profile: PerformanceProfile): Promise<PerformanceProfile>;

  /**
   * Finds a profile by its ID.
   * @param id The profile ID to find
   * @returns The profile if found, null otherwise
   */
  findProfileById(id: ProfileId): Promise<PerformanceProfile | null>;

  /**
   * Updates an existing profile.
   * @param profile The profile to update
   * @returns The updated profile
   */
  updateProfile(profile: PerformanceProfile): Promise<PerformanceProfile>;

  /**
   * Deletes a profile.
   * @param id The profile ID to delete
   * @returns void
   */
  deleteProfile(id: ProfileId): Promise<void>;

  /**
   * Lists profiles with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of profiles
   */
  listProfiles(
    params: PaginationParams,
    filters?: PerformanceProfileFilterParams
  ): Promise<PaginatedResult<PerformanceProfile>>;

  /**
   * Counts profiles with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching profiles
   */
  countProfiles(filters?: PerformanceProfileFilterParams): Promise<number>;

  // ============ Rule Operations ============

  /**
   * Creates a new optimization rule.
   * @param rule The rule to create
   * @returns The created rule
   */
  createRule(rule: OptimizationRule): Promise<OptimizationRule>;

  /**
   * Finds a rule by its ID.
   * @param id The rule ID to find
   * @returns The rule if found, null otherwise
   */
  findRuleById(id: RuleId): Promise<OptimizationRule | null>;

  /**
   * Updates an existing rule.
   * @param rule The rule to update
   * @returns The updated rule
   */
  updateRule(rule: OptimizationRule): Promise<OptimizationRule>;

  /**
   * Deletes a rule.
   * @param id The rule ID to delete
   * @returns void
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
    filters?: OptimizationRuleFilterParams
  ): Promise<PaginatedResult<OptimizationRule>>;

  /**
   * Counts rules with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching rules
   */
  countRules(filters?: OptimizationRuleFilterParams): Promise<number>;

  /**
   * Lists enabled rules ordered by priority.
   * @returns List of enabled rules
   */
  listEnabledRules(): Promise<OptimizationRule[]>;

  // ============ Snapshot Operations ============

  /**
   * Creates a new performance snapshot.
   * @param snapshot The snapshot to create
   * @returns The created snapshot
   */
  createSnapshot(snapshot: PerformanceSnapshot): Promise<PerformanceSnapshot>;

  /**
   * Finds a snapshot by its ID.
   * @param id The snapshot ID to find
   * @returns The snapshot if found, null otherwise
   */
  findSnapshotById(id: SnapshotId): Promise<PerformanceSnapshot | null>;

  /**
   * Lists snapshots with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of snapshots
   */
  listSnapshots(
    params: PaginationParams,
    filters?: PerformanceSnapshotFilterParams
  ): Promise<PaginatedResult<PerformanceSnapshot>>;

  /**
   * Counts snapshots with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching snapshots
   */
  countSnapshots(filters?: PerformanceSnapshotFilterParams): Promise<number>;

  /**
   * Deletes old snapshots older than a specified date.
   * @param beforeDate Delete snapshots before this date
   * @returns Number of snapshots deleted
   */
  deleteSnapshotsBefore(beforeDate: Date): Promise<number>;
}
