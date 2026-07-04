/**
 * Audit Repository Interface
 *
 * Interface defining the contract for Audit persistence.
 * All audit repository implementations must adhere to this interface.
 *
 * NOTE: This is the foundation interface. Query operations (search, filtering,
 * export, compression, retention, streaming) belong to P-184.2.
 */

import type { AuditId } from '../value-objects/AuditId';
import type { AuditActorId } from '../value-objects/AuditActorId';
import type { AuditCategoryId } from '../value-objects/AuditCategoryId';
import type { AuditRecord } from '../entities/AuditRecord';
import type { AuditCategory } from '../entities/AuditCategory';
import type { AuditActor } from '../entities/AuditActor';
import type { AuditAction } from '../types/AuditAction';
import type { AuditResult } from '../types/AuditResult';
import type { AuditActorType } from '../types/AuditActorType';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying audit records.
 */
export interface AuditRecordFilterParams {
  /** Filter by actor ID */
  actorId?: string;

  /** Filter by actor type */
  actorType?: AuditActorType;

  /** Filter by action */
  action?: AuditAction;

  /** Filter by target type */
  targetType?: string;

  /** Filter by target ID */
  targetId?: string;

  /** Filter by result */
  result?: AuditResult;

  /** Filter by category ID */
  categoryId?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying audit categories.
 */
export interface AuditCategoryFilterParams {
  /** Filter by category name */
  name?: string;
}

/**
 * Filter parameters for querying audit actors.
 */
export interface AuditActorFilterParams {
  /** Filter by actor type */
  actorType?: AuditActorType;

  /** Filter by display name (partial match) */
  displayName?: string;
}

/**
 * Audit repository interface.
 * Defines all data access operations for audit entities.
 *
 * IMPORTANT: Audit is an IMMUTABLE history layer. It ONLY stores records.
 * Audit MUST NEVER modify gameplay, balances, rewards, inventory, or player state.
 */
export interface IAuditRepository {
  // ============ Audit Record Operations ============

  /**
   * Stores a new audit record.
   * @param record The audit record to store
   * @returns The stored audit record
   */
  storeRecord(record: AuditRecord): Promise<AuditRecord>;

  /**
   * Finds an audit record by its ID.
   * @param id The audit ID to find
   * @returns The audit record if found, null otherwise
   */
  findRecordById(id: AuditId): Promise<AuditRecord | null>;

  /**
   * Lists audit records with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of audit records
   */
  listRecords(
    params: PaginationParams,
    filters?: AuditRecordFilterParams
  ): Promise<PaginatedResult<AuditRecord>>;

  /**
   * Counts audit records with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching audit records
   */
  countRecords(filters?: AuditRecordFilterParams): Promise<number>;

  /**
   * Finds audit records by actor ID.
   * @param actorId The actor ID to search for
   * @param params Optional pagination parameters
   * @returns Paginated result of audit records
   */
  findByActor(actorId: string, params?: PaginationParams): Promise<PaginatedResult<AuditRecord>>;

  /**
   * Finds audit records by target ID.
   * @param targetId The target ID to search for
   * @param params Optional pagination parameters
   * @returns Paginated result of audit records
   */
  findByTarget(targetId: string, params?: PaginationParams): Promise<PaginatedResult<AuditRecord>>;

  /**
   * Finds audit records by category.
   * @param categoryId The category ID to search for
   * @param params Optional pagination parameters
   * @returns Paginated result of audit records
   */
  findByCategory(categoryId: string, params?: PaginationParams): Promise<PaginatedResult<AuditRecord>>;

  /**
   * Archives audit records older than a given date.
   * @param olderThan Date threshold for archiving
   * @returns Number of records archived
   */
  archive(olderThan: Date): Promise<number>;

  // ============ Audit Category Operations ============

  /**
   * Creates a new audit category.
   * @param category The category to create
   * @returns The created category
   */
  createCategory(category: AuditCategory): Promise<AuditCategory>;

  /**
   * Finds a category by its ID.
   * @param id The category ID to find
   * @returns The category if found, null otherwise
   */
  findCategoryById(id: AuditCategoryId): Promise<AuditCategory | null>;

  /**
   * Lists all categories.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of categories
   */
  listCategories(
    params: PaginationParams,
    filters?: AuditCategoryFilterParams
  ): Promise<PaginatedResult<AuditCategory>>;

  /**
   * Counts categories with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching categories
   */
  countCategories(filters?: AuditCategoryFilterParams): Promise<number>;

  // ============ Audit Actor Operations ============

  /**
   * Creates or updates an audit actor.
   * @param actor The actor to create or update
   * @returns The created or updated actor
   */
  upsertActor(actor: AuditActor): Promise<AuditActor>;

  /**
   * Finds an actor by its ID.
   * @param id The actor ID to find
   * @returns The actor if found, null otherwise
   */
  findActorById(id: AuditActorId): Promise<AuditActor | null>;

  /**
   * Lists actors with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of actors
   */
  listActors(
    params: PaginationParams,
    filters?: AuditActorFilterParams
  ): Promise<PaginatedResult<AuditActor>>;

  /**
   * Counts actors with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching actors
   */
  countActors(filters?: AuditActorFilterParams): Promise<number>;
}
