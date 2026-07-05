/**
 * System Integration Repository Interface
 *
 * Contract for System Integration data access operations.
 * This interface defines all allowed operations on System Integration storage.
 *
 * Responsibilities:
 * - Define data access contract for System Integration entities
 * - Return strongly typed domain objects
 * - Support pagination for list operations
 * - Handle soft delete semantics
 *
 * This interface does NOT:
 * - Contain any implementation
 * - Contain SQL queries
 * - Contain Supabase types
 * - Contain infrastructure code
 * - Execute any health checks
 * - Perform any dependency resolution
 * - Execute any auto-recovery
 * - Perform any startup validation
 * - Load any modules
 * - Synchronize any runtime state
 */

import type { SystemModule } from '../entities/SystemModule';
import type { IntegrationState } from '../entities/IntegrationState';
import type { IntegrationSnapshot } from '../entities/IntegrationSnapshot';
import type { ModuleId } from '../value-objects/ModuleId';
import type { StateId } from '../value-objects/StateId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { RepositoryError } from '../../../shared/errors/repository.error';
import type { ModuleStatus } from '../types/ModuleStatus';
import type { IntegrationStatus } from '../types/IntegrationStatus';

/**
 * Filter parameters for listing system modules.
 */
export interface ModuleFilterParams {
  /** Filter by module status */
  status?: ModuleStatus;
  /** Filter modules by name pattern */
  namePattern?: string;
  /** Filter modules created after this date */
  createdAfter?: Date;
  /** Filter modules created before this date */
  createdBefore?: Date;
}

/**
 * Filter parameters for listing integration states.
 */
export interface StateFilterParams {
  /** Filter by integration status */
  status?: IntegrationStatus;
  /** Filter states by module ID */
  moduleId?: ModuleId;
  /** Filter states updated after this date */
  updatedAfter?: Date;
  /** Filter states updated before this date */
  updatedBefore?: Date;
}

/**
 * System Integration repository interface.
 * Defines the contract for all System Integration persistence operations.
 */
export interface ISystemIntegrationRepository {
  // ============ System Module Operations ============

  /**
   * Creates a new system module.
   * @param module The system module entity to create
   * @returns The created system module with generated ID
   * @throws RepositoryError if creation fails
   */
  createModule(module: SystemModule): Promise<SystemModule>;

  /**
   * Finds a system module by its ID.
   * @param id The module ID to find
   * @returns The system module if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findModuleById(id: ModuleId): Promise<SystemModule | null>;

  /**
   * Finds a system module by name.
   * @param name The module name to find
   * @returns The system module if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findModuleByName(name: string): Promise<SystemModule | null>;

  /**
   * Checks if a module exists by ID.
   * @param id The module ID to check
   * @returns True if module exists, false otherwise
   * @throws RepositoryError if query fails
   */
  moduleExists(id: ModuleId): Promise<boolean>;

  /**
   * Updates an existing system module.
   * @param module The system module entity with updated data
   * @returns The updated system module
   * @throws RepositoryError if update fails
   */
  updateModule(module: SystemModule): Promise<SystemModule>;

  /**
   * Deletes a system module.
   * @param id The module ID to delete
   * @throws RepositoryError if deletion fails
   */
  deleteModule(id: ModuleId): Promise<void>;

  /**
   * Lists system modules with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of system modules
   * @throws RepositoryError if query fails
   */
  listModules(
    params: PaginationParams,
    filters?: ModuleFilterParams
  ): Promise<PaginatedResult<SystemModule>>;

  /**
   * Counts total system modules with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching system modules
   * @throws RepositoryError if count fails
   */
  countModules(filters?: ModuleFilterParams): Promise<number>;

  // ============ Integration State Operations ============

  /**
   * Creates a new integration state.
   * @param state The integration state entity to create
   * @returns The created integration state with generated ID
   * @throws RepositoryError if creation fails
   */
  createState(state: IntegrationState): Promise<IntegrationState>;

  /**
   * Finds an integration state by its ID.
   * @param id The state ID to find
   * @returns The integration state if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findStateById(id: StateId): Promise<IntegrationState | null>;

  /**
   * Finds an integration state by module ID.
   * @param moduleId The module ID to find state for
   * @returns The integration state if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findStateByModuleId(moduleId: ModuleId): Promise<IntegrationState | null>;

  /**
   * Updates an existing integration state.
   * @param state The integration state entity with updated data
   * @returns The updated integration state
   * @throws RepositoryError if update fails
   */
  updateState(state: IntegrationState): Promise<IntegrationState>;

  /**
   * Deletes an integration state.
   * @param id The state ID to delete
   * @throws RepositoryError if deletion fails
   */
  deleteState(id: StateId): Promise<void>;

  /**
   * Lists integration states with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of integration states
   * @throws RepositoryError if query fails
   */
  listStates(
    params: PaginationParams,
    filters?: StateFilterParams
  ): Promise<PaginatedResult<IntegrationState>>;

  /**
   * Counts total integration states with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching integration states
   * @throws RepositoryError if count fails
   */
  countStates(filters?: StateFilterParams): Promise<number>;

  // ============ Integration Snapshot Operations ============

  /**
   * Creates a new integration snapshot.
   * @param snapshot The integration snapshot entity to create
   * @returns The created integration snapshot with generated ID
   * @throws RepositoryError if creation fails
   */
  createSnapshot(snapshot: IntegrationSnapshot): Promise<IntegrationSnapshot>;

  /**
   * Finds an integration snapshot by its ID.
   * @param id The snapshot ID to find
   * @returns The integration snapshot if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findSnapshotById(id: SnapshotId): Promise<IntegrationSnapshot | null>;

  /**
   * Finds the latest integration snapshot.
   * @returns The latest integration snapshot if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findLatestSnapshot(): Promise<IntegrationSnapshot | null>;

  /**
   * Deletes an integration snapshot.
   * @param id The snapshot ID to delete
   * @throws RepositoryError if deletion fails
   */
  deleteSnapshot(id: SnapshotId): Promise<void>;

  /**
   * Lists integration snapshots with pagination.
   * @param params Pagination parameters
   * @returns Paginated result of integration snapshots
   * @throws RepositoryError if query fails
   */
  listSnapshots(params: PaginationParams): Promise<PaginatedResult<IntegrationSnapshot>>;

  /**
   * Counts total integration snapshots.
   * @returns Total count of integration snapshots
   * @throws RepositoryError if count fails
   */
  countSnapshots(): Promise<number>;

  /**
   * Deletes old snapshots, keeping only the specified number of most recent.
   * @param keepCount Number of recent snapshots to keep
   * @throws RepositoryError if cleanup fails
   */
  cleanupOldSnapshots(keepCount: number): Promise<void>;
}
