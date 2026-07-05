/**
 * Error Repository Interface
 *
 * Interface defining the contract for error persistence.
 * All error repository implementations must adhere to this interface.
 */

import type { ErrorId } from '../value-objects/ErrorId';
import type { CategoryId } from '../value-objects/CategoryId';
import type { ContextId } from '../value-objects/ContextId';
import type { SystemError } from '../entities/SystemError';
import type { ErrorCategory } from '../entities/ErrorCategory';
import type { ErrorContext } from '../entities/ErrorContext';
import type { ErrorSeverity } from '../types/ErrorSeverity';
import type { ErrorStatus } from '../types/ErrorStatus';
import type { ErrorCategoryType } from '../types/ErrorCategoryType';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying system errors.
 */
export interface SystemErrorFilterParams {
  /** Filter by error code */
  errorCode?: string;

  /** Filter by category */
  category?: ErrorCategoryType;

  /** Filter by severity */
  severity?: ErrorSeverity;

  /** Filter by status */
  status?: ErrorStatus;

  /** Filter by context ID */
  contextId?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying error categories.
 */
export interface ErrorCategoryFilterParams {
  /** Filter by category type */
  categoryType?: ErrorCategoryType;

  /** Filter by active status */
  isActive?: boolean;

  /** Filter by name */
  name?: string;
}

/**
 * Filter parameters for querying error contexts.
 */
export interface ErrorContextFilterParams {
  /** Filter by service */
  service?: string;

  /** Filter by operation */
  operation?: string;

  /** Filter by request ID */
  requestId?: string;

  /** Filter by actor ID */
  actorId?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Error repository interface.
 * Defines all data access operations for error-handling entities.
 */
export interface IErrorRepository {
  // ============ System Error Operations ============

  /**
   * Creates a new system error.
   * @param error The error to create
   * @returns The created error
   */
  createError(error: SystemError): Promise<SystemError>;

  /**
   * Finds an error by its ID.
   * @param id The error ID to find
   * @returns The error if found, null otherwise
   */
  findErrorById(id: ErrorId): Promise<SystemError | null>;

  /**
   * Finds an error by its error code.
   * @param errorCode The error code to find
   * @returns The error if found, null otherwise
   */
  findErrorByCode(errorCode: string): Promise<SystemError | null>;

  /**
   * Updates an existing error.
   * @param error The error to update
   * @returns The updated error
   */
  updateError(error: SystemError): Promise<SystemError>;

  /**
   * Deletes an error by its ID.
   * @param id The error ID to delete
   * @returns True if deleted, false if not found
   */
  deleteError(id: ErrorId): Promise<boolean>;

  /**
   * Lists errors with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of errors
   */
  listErrors(
    params: PaginationParams,
    filters?: SystemErrorFilterParams
  ): Promise<PaginatedResult<SystemError>>;

  /**
   * Counts errors with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching errors
   */
  countErrors(filters?: SystemErrorFilterParams): Promise<number>;

  // ============ Error Category Operations ============

  /**
   * Creates a new error category.
   * @param category The category to create
   * @returns The created category
   */
  createCategory(category: ErrorCategory): Promise<ErrorCategory>;

  /**
   * Finds a category by its ID.
   * @param id The category ID to find
   * @returns The category if found, null otherwise
   */
  findCategoryById(id: CategoryId): Promise<ErrorCategory | null>;

  /**
   * Finds a category by its name.
   * @param name The category name to find
   * @returns The category if found, null otherwise
   */
  findCategoryByName(name: string): Promise<ErrorCategory | null>;

  /**
   * Updates an existing category.
   * @param category The category to update
   * @returns The updated category
   */
  updateCategory(category: ErrorCategory): Promise<ErrorCategory>;

  /**
   * Deletes a category by its ID.
   * @param id The category ID to delete
   * @returns True if deleted, false if not found
   */
  deleteCategory(id: CategoryId): Promise<boolean>;

  /**
   * Lists categories with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of categories
   */
  listCategories(
    params: PaginationParams,
    filters?: ErrorCategoryFilterParams
  ): Promise<PaginatedResult<ErrorCategory>>;

  /**
   * Counts categories with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching categories
   */
  countCategories(filters?: ErrorCategoryFilterParams): Promise<number>;

  // ============ Error Context Operations ============

  /**
   * Creates a new error context.
   * @param context The context to create
   * @returns The created context
   */
  createContext(context: ErrorContext): Promise<ErrorContext>;

  /**
   * Finds a context by its ID.
   * @param id The context ID to find
   * @returns The context if found, null otherwise
   */
  findContextById(id: ContextId): Promise<ErrorContext | null>;

  /**
   * Finds a context by request ID.
   * @param requestId The request ID to find
   * @returns The context if found, null otherwise
   */
  findContextByRequestId(requestId: string): Promise<ErrorContext | null>;

  /**
   * Updates an existing context.
   * @param context The context to update
   * @returns The updated context
   */
  updateContext(context: ErrorContext): Promise<ErrorContext>;

  /**
   * Deletes a context by its ID.
   * @param id The context ID to delete
   * @returns True if deleted, false if not found
   */
  deleteContext(id: ContextId): Promise<boolean>;

  /**
   * Lists contexts with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of contexts
   */
  listContexts(
    params: PaginationParams,
    filters?: ErrorContextFilterParams
  ): Promise<PaginatedResult<ErrorContext>>;

  /**
   * Counts contexts with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching contexts
   */
  countContexts(filters?: ErrorContextFilterParams): Promise<number>;
}
