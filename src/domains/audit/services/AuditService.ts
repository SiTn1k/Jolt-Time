/**
 * Audit Service
 *
 * Service layer for audit operations.
 * Provides business logic for creating, storing, and querying audit records.
 *
 * IMPORTANT: Audit is an IMMUTABLE history layer. It ONLY stores records.
 * Audit MUST NEVER modify gameplay, balances, rewards, inventory, or player state.
 *
 * Failure Protection: Audit failures are logged but never block gameplay.
 */

import type { IAuditRepository, AuditRecordFilterParams } from '../interfaces/IAuditRepository';
import type { AuditAction } from '../types/AuditAction';
import type { AuditResult } from '../types/AuditResult';
import type { AuditActorType } from '../types/AuditActorType';
import type { AuditMetadata } from '../types/AuditMetadata';
import type { PaginationParams } from '../../../shared/types/base.types';
import type { AuditRecordPaginatedResponseDto, AuditStatisticsResponseDto } from '../dto';
import { AuditRecord } from '../entities/AuditRecord';
import { AuditCategory } from '../entities/AuditCategory';
import { AuditActor } from '../entities/AuditActor';
import { AuditId } from '../value-objects/AuditId';
import { AuditActorId } from '../value-objects/AuditActorId';
import { AuditCategoryId } from '../value-objects/AuditCategoryId';
import { AuditValidator, CategoryValidator, ActorValidator } from '../validators';
import { AuditMapper, CategoryMapper } from '../mappers';
import { createLogger } from '../../../core/logging/logger.service';
import { AuditResult as AuditResultEnum } from '../types/AuditResult';

/**
 * Audit Service for managing audit operations.
 * All operations are non-blocking and failure-safe.
 */
export class AuditService {
  private readonly _repository: IAuditRepository;
  private readonly _logger = createLogger('AuditService');

  /**
   * Creates a new AuditService instance.
   * @param repository The audit repository
   */
  constructor(repository: IAuditRepository) {
    this._repository = repository;
  }

  // ============ Record Creation ============

  /**
   * Creates a new audit record.
   * Non-blocking - failures are logged but never block gameplay.
   *
   * @param params Record parameters
   * @returns The created audit record or null if creation failed
   */
  async createRecord(params: {
    actorId: string;
    actorType: AuditActorType;
    action: AuditAction;
    targetType: string;
    targetId: string;
    categoryId?: string;
    result: AuditResult;
    metadata?: AuditMetadata;
  }): Promise<AuditRecord | null> {
    try {
      // Validate record data
      const validation = AuditValidator.validateRecord({
        actorId: params.actorId,
        actorType: params.actorType,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        categoryId: params.categoryId,
        result: params.result,
        metadata: params.metadata,
      });

      if (!validation.isValid) {
        this._logger.warn('Invalid audit record data', { error: validation.error, params });
        return null;
      }

      // Create the audit record entity
      const record = AuditRecord.create({
        actorId: AuditActorId.reconstruct(params.actorId),
        actorType: params.actorType,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        categoryId: params.categoryId ? AuditCategoryId.reconstruct(params.categoryId) : null,
        result: params.result,
        metadata: params.metadata,
      });

      // Store the record
      const stored = await this._repository.storeRecord(record);
      this._logger.debug('Audit record created', { auditId: stored.auditId.value });

      return stored;
    } catch (error) {
      // Log failure but never throw - audit must never block gameplay
      this._logger.error('Failed to create audit record', error as Error, {
        actorId: params.actorId,
        action: params.action,
        targetId: params.targetId,
      });
      return null;
    }
  }

  /**
   * Creates an audit record without validation (for trusted internal use).
   * Non-blocking - failures are logged but never block gameplay.
   *
   * @param record The pre-validated audit record
   * @returns The stored audit record or null if storage failed
   */
  async storeRecord(record: AuditRecord): Promise<AuditRecord | null> {
    try {
      const stored = await this._repository.storeRecord(record);
      this._logger.debug('Audit record stored', { auditId: stored.auditId.value });
      return stored;
    } catch (error) {
      // Log failure but never throw
      this._logger.error('Failed to store audit record', error as Error, {
        auditId: record.auditId.value,
      });
      return null;
    }
  }

  // ============ Record Queries ============

  /**
   * Finds an audit record by ID.
   *
   * @param auditId The audit ID
   * @returns The audit record or null if not found
   */
  async findRecord(auditId: string): Promise<AuditRecord | null> {
    try {
      return await this._repository.findRecordById(AuditId.reconstruct(auditId));
    } catch (error) {
      this._logger.error('Failed to find audit record', error as Error, { auditId });
      return null;
    }
  }

  /**
   * Lists audit records with pagination and filtering.
   *
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of audit records
   */
  async listRecords(
    params: PaginationParams,
    filters?: AuditRecordFilterParams
  ): Promise<AuditRecordPaginatedResponseDto | null> {
    try {
      const result = await this._repository.listRecords(params, filters);
      return {
        items: result.items.map(AuditMapper.toResponse),
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      };
    } catch (error) {
      this._logger.error('Failed to list audit records', error as Error, { params, filters });
      return null;
    }
  }

  /**
   * Counts audit records with optional filtering.
   *
   * @param filters Optional filter parameters
   * @returns Total count or null if query failed
   */
  async countRecords(filters?: AuditRecordFilterParams): Promise<number | null> {
    try {
      return await this._repository.countRecords(filters);
    } catch (error) {
      this._logger.error('Failed to count audit records', error as Error, { filters });
      return null;
    }
  }

  // ============ Actor History ============

  /**
   * Loads audit history for an actor.
   *
   * @param actorId The actor ID
   * @param params Optional pagination parameters
   * @returns Paginated result of audit records or null if query failed
   */
  async getActorHistory(
    actorId: string,
    params?: PaginationParams
  ): Promise<AuditRecordPaginatedResponseDto | null> {
    try {
      const paginationParams = params ?? { page: 1, pageSize: 20 };
      const result = await this._repository.findByActor(actorId, paginationParams);
      return {
        items: result.items.map(AuditMapper.toResponse),
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      };
    } catch (error) {
      this._logger.error('Failed to get actor history', error as Error, { actorId });
      return null;
    }
  }

  // ============ Target History ============

  /**
   * Loads audit history for a target.
   *
   * @param targetId The target ID
   * @param params Optional pagination parameters
   * @returns Paginated result of audit records or null if query failed
   */
  async getTargetHistory(
    targetId: string,
    params?: PaginationParams
  ): Promise<AuditRecordPaginatedResponseDto | null> {
    try {
      const paginationParams = params ?? { page: 1, pageSize: 20 };
      const result = await this._repository.findByTarget(targetId, paginationParams);
      return {
        items: result.items.map(AuditMapper.toResponse),
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      };
    } catch (error) {
      this._logger.error('Failed to get target history', error as Error, { targetId });
      return null;
    }
  }

  // ============ Category Operations ============

  /**
   * Creates a new audit category.
   *
   * @param params Category parameters
   * @returns The created category or null if creation failed
   */
  async createCategory(params: {
    name: string;
    description: string;
    metadata?: AuditMetadata;
  }): Promise<AuditCategory | null> {
    try {
      // Validate category data
      const validation = CategoryValidator.validateCategory({
        name: params.name,
        description: params.description,
      });

      if (!validation.isValid) {
        this._logger.warn('Invalid category data', { error: validation.error, params });
        return null;
      }

      // Create the category entity
      const category = AuditCategory.create({
        name: params.name,
        description: params.description,
        metadata: params.metadata,
      });

      // Store the category
      return await this._repository.createCategory(category);
    } catch (error) {
      this._logger.error('Failed to create category', error as Error, { name: params.name });
      return null;
    }
  }

  /**
   * Finds a category by ID.
   *
   * @param categoryId The category ID
   * @returns The category or null if not found
   */
  async findCategory(categoryId: string): Promise<AuditCategory | null> {
    try {
      return await this._repository.findCategoryById(AuditCategoryId.reconstruct(categoryId));
    } catch (error) {
      this._logger.error('Failed to find category', error as Error, { categoryId });
      return null;
    }
  }

  /**
   * Lists all categories.
   *
   * @param params Pagination parameters
   * @returns Paginated result of categories or null if query failed
   */
  async listCategories(params: PaginationParams): Promise<{
    items: ReturnType<typeof CategoryMapper.toResponse>[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null> {
    try {
      const result = await this._repository.listCategories(params);
      return {
        items: result.items.map(CategoryMapper.toResponse),
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
      };
    } catch (error) {
      this._logger.error('Failed to list categories', error as Error, { params });
      return null;
    }
  }

  // ============ Actor Operations ============

  /**
   * Creates or updates an audit actor.
   *
   * @param params Actor parameters
   * @returns The created/updated actor or null if operation failed
   */
  async upsertActor(params: {
    actorId: string;
    actorType: AuditActorType;
    displayName: string;
    metadata?: AuditMetadata;
  }): Promise<AuditActor | null> {
    try {
      // Validate actor data
      const validation = ActorValidator.validateActor({
        actorId: params.actorId,
        actorType: params.actorType,
        displayName: params.displayName,
      });

      if (!validation.isValid) {
        this._logger.warn('Invalid actor data', { error: validation.error, params });
        return null;
      }

      // Create the actor entity
      const actor = AuditActor.create({
        actorId: AuditActorId.reconstruct(params.actorId),
        actorType: params.actorType,
        displayName: params.displayName,
        metadata: params.metadata,
      });

      // Upsert the actor
      return await this._repository.upsertActor(actor);
    } catch (error) {
      this._logger.error('Failed to upsert actor', error as Error, { actorId: params.actorId });
      return null;
    }
  }

  /**
   * Finds an actor by ID.
   *
   * @param actorId The actor ID
   * @returns The actor or null if not found
   */
  async findActor(actorId: string): Promise<AuditActor | null> {
    try {
      return await this._repository.findActorById(AuditActorId.reconstruct(actorId));
    } catch (error) {
      this._logger.error('Failed to find actor', error as Error, { actorId });
      return null;
    }
  }

  // ============ Statistics ============

  /**
   * Gets audit statistics.
   *
   * @param filters Optional filter parameters
   * @returns Audit statistics or null if query failed
   */
  async getStatistics(filters?: AuditRecordFilterParams): Promise<AuditStatisticsResponseDto | null> {
    try {
      const [totalRecords, successCount, failureCount, deniedCount] = await Promise.all([
        this._repository.countRecords(filters),
        this._repository.countRecords({ ...filters, result: AuditResultEnum.SUCCESS }),
        this._repository.countRecords({ ...filters, result: AuditResultEnum.FAILURE }),
        this._repository.countRecords({ ...filters, result: AuditResultEnum.DENIED }),
      ]);

      return {
        totalRecords,
        recordsByResult: {
          success: successCount,
          failure: failureCount,
          denied: deniedCount,
          pending: 0,
          rolledBack: 0,
        },
        recordsByCategory: {},
        recordsByActor: {},
        recentActivity: [],
        periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        periodEnd: new Date().toISOString(),
      };
    } catch (error) {
      this._logger.error('Failed to get audit statistics', error as Error, { filters });
      return null;
    }
  }

  // ============ Archive Operations ============

  /**
   * Archives old audit records.
   *
   * @param olderThan Date threshold for archiving
   * @returns Number of archived records or null if operation failed
   */
  async archiveRecords(olderThan: Date): Promise<number | null> {
    try {
      return await this._repository.archive(olderThan);
    } catch (error) {
      this._logger.error('Failed to archive records', error as Error, { olderThan: olderThan.toISOString() });
      return null;
    }
  }
}
