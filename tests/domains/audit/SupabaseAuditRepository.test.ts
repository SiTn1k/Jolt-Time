/**
 * Audit Repository Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { IAuditRepository, AuditRecordFilterParams } from '../../../src/domains/audit/interfaces/IAuditRepository';
import type { AuditRecord } from '../../../src/domains/audit/entities/AuditRecord';
import type { AuditCategory } from '../../../src/domains/audit/entities/AuditCategory';
import type { AuditActor } from '../../../src/domains/audit/entities/AuditActor';
import type { AuditId } from '../../../src/domains/audit/value-objects/AuditId';
import type { AuditActorId } from '../../../src/domains/audit/value-objects/AuditActorId';
import type { AuditCategoryId } from '../../../src/domains/audit/value-objects/AuditCategoryId';
import type { PaginationParams } from '../../../src/shared/types/base.types';
import { AuditAction } from '../../../src/domains/audit/types/AuditAction';
import { AuditResult } from '../../../src/domains/audit/types/AuditResult';
import { AuditActorType } from '../../../src/domains/audit/types/AuditActorType';

/**
 * Mock implementation of IAuditRepository for testing.
 */
class MockAuditRepository implements IAuditRepository {
  private records: Map<string, AuditRecord> = new Map();
  private categories: Map<string, AuditCategory> = new Map();
  private actors: Map<string, AuditActor> = new Map();

  async storeRecord(record: AuditRecord): Promise<AuditRecord> {
    this.records.set(record.auditId.value, record);
    return record;
  }

  async findRecordById(id: AuditId): Promise<AuditRecord | null> {
    return this.records.get(id.value) || null;
  }

  async listRecords(
    params: PaginationParams,
    filters?: AuditRecordFilterParams
  ): Promise<{ items: AuditRecord[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    let items = Array.from(this.records.values());

    // Apply filters
    if (filters?.actorId) {
      items = items.filter((r) => r.actorId.value === filters.actorId);
    }
    if (filters?.action) {
      items = items.filter((r) => r.action === filters.action);
    }
    if (filters?.result) {
      items = items.filter((r) => r.result === filters.result);
    }

    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    const pagedItems = items.slice(start, start + params.pageSize);

    return {
      items: pagedItems,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
      hasNextPage: params.page < Math.ceil(total / params.pageSize),
      hasPreviousPage: params.page > 1,
    };
  }

  async countRecords(filters?: AuditRecordFilterParams): Promise<number> {
    let items = Array.from(this.records.values());
    if (filters?.actorId) {
      items = items.filter((r) => r.actorId.value === filters.actorId);
    }
    if (filters?.result) {
      items = items.filter((r) => r.result === filters.result);
    }
    return items.length;
  }

  async findByActor(actorId: string, params?: PaginationParams): Promise<{ items: AuditRecord[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    return this.listRecords(params ?? { page: 1, pageSize: 20 }, { actorId });
  }

  async findByTarget(targetId: string, params?: PaginationParams): Promise<{ items: AuditRecord[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    return this.listRecords(params ?? { page: 1, pageSize: 20 }, { targetId });
  }

  async findByCategory(categoryId: string, params?: PaginationParams): Promise<{ items: AuditRecord[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    return this.listRecords(params ?? { page: 1, pageSize: 20 }, { categoryId });
  }

  async archive(olderThan: Date): Promise<number> {
    let count = 0;
    for (const [id, record] of this.records) {
      if (record.createdAt < olderThan) {
        count++;
      }
    }
    return count;
  }

  async createCategory(category: AuditCategory): Promise<AuditCategory> {
    this.categories.set(category.categoryId.value, category);
    return category;
  }

  async findCategoryById(id: AuditCategoryId): Promise<AuditCategory | null> {
    return this.categories.get(id.value) || null;
  }

  async listCategories(params: PaginationParams, filters?: { name?: string }): Promise<{ items: AuditCategory[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    let items = Array.from(this.categories.values());
    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    const pagedItems = items.slice(start, start + params.pageSize);
    return {
      items: pagedItems,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
      hasNextPage: params.page < Math.ceil(total / params.pageSize),
      hasPreviousPage: params.page > 1,
    };
  }

  async countCategories(filters?: { name?: string }): Promise<number> {
    return this.categories.size;
  }

  async upsertActor(actor: AuditActor): Promise<AuditActor> {
    this.actors.set(actor.actorId.value, actor);
    return actor;
  }

  async findActorById(id: AuditActorId): Promise<AuditActor | null> {
    return this.actors.get(id.value) || null;
  }

  async listActors(params: PaginationParams, filters?: { actorType?: AuditActorType; displayName?: string }): Promise<{ items: AuditActor[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    let items = Array.from(this.actors.values());
    if (filters?.actorType) {
      items = items.filter((a) => a.actorType === filters.actorType);
    }
    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    const pagedItems = items.slice(start, start + params.pageSize);
    return {
      items: pagedItems,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
      hasNextPage: params.page < Math.ceil(total / params.pageSize),
      hasPreviousPage: params.page > 1,
    };
  }

  async countActors(filters?: { actorType?: AuditActorType; displayName?: string }): Promise<number> {
    return this.actors.size;
  }
}

describe('AuditRepository', () => {
  let repository: MockAuditRepository;

  beforeEach(() => {
    repository = new MockAuditRepository();
  });

  describe('storeRecord', () => {
    it('should store an audit record', async () => {
      const record = AuditRecord.create({
        actorId: { value: 'actor-1' } as unknown as import('../../../src/domains/audit/value-objects/AuditActorId').AuditActorId,
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-123',
        result: AuditResult.SUCCESS,
      });

      const stored = await repository.storeRecord(record);

      expect(stored).toBeDefined();
      expect(stored.auditId.value).toBe(record.auditId.value);
    });
  });

  describe('findRecordById', () => {
    it('should find a stored record by ID', async () => {
      const record = AuditRecord.create({
        actorId: { value: 'actor-1' } as unknown as import('../../../src/domains/audit/value-objects/AuditActorId').AuditActorId,
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-123',
        result: AuditResult.SUCCESS,
      });

      await repository.storeRecord(record);
      const found = await repository.findRecordById(record.auditId);

      expect(found).toBeDefined();
      expect(found?.auditId.value).toBe(record.auditId.value);
    });

    it('should return null for non-existent record', async () => {
      const AuditIdMock = { value: 'non-existent-id' } as unknown as AuditId;
      const found = await repository.findRecordById(AuditIdMock);
      expect(found).toBeNull();
    });
  });

  describe('listRecords', () => {
    it('should list records with pagination', async () => {
      for (let i = 0; i < 5; i++) {
        const record = AuditRecord.create({
          actorId: { value: `actor-${i}` } as unknown as import('../../../src/domains/audit/value-objects/AuditActorId').AuditActorId,
          actorType: AuditActorType.PLAYER,
          action: AuditAction.LOGIN,
          targetType: 'Player',
          targetId: `player-${i}`,
          result: AuditResult.SUCCESS,
        });
        await repository.storeRecord(record);
      }

      const result = await repository.listRecords({ page: 1, pageSize: 3 });

      expect(result.items.length).toBe(3);
      expect(result.total).toBe(5);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(false);
    });
  });

  describe('countRecords', () => {
    it('should count all records', async () => {
      for (let i = 0; i < 3; i++) {
        const record = AuditRecord.create({
          actorId: { value: `actor-${i}` } as unknown as import('../../../src/domains/audit/value-objects/AuditActorId').AuditActorId,
          actorType: AuditActorType.PLAYER,
          action: AuditAction.LOGIN,
          targetType: 'Player',
          targetId: `player-${i}`,
          result: AuditResult.SUCCESS,
        });
        await repository.storeRecord(record);
      }

      const count = await repository.countRecords();

      expect(count).toBe(3);
    });

    it('should count records with filters', async () => {
      const record1 = AuditRecord.create({
        actorId: { value: 'actor-1' } as unknown as import('../../../src/domains/audit/value-objects/AuditActorId').AuditActorId,
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-1',
        result: AuditResult.SUCCESS,
      });

      const record2 = AuditRecord.create({
        actorId: { value: 'actor-2' } as unknown as import('../../../src/domains/audit/value-objects/AuditActorId').AuditActorId,
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-2',
        result: AuditResult.FAILURE,
      });

      await repository.storeRecord(record1);
      await repository.storeRecord(record2);

      const successCount = await repository.countRecords({ result: AuditResult.SUCCESS });
      const failureCount = await repository.countRecords({ result: AuditResult.FAILURE });

      expect(successCount).toBe(1);
      expect(failureCount).toBe(1);
    });
  });

  describe('findByActor', () => {
    it('should find records by actor ID', async () => {
      const actorId = 'specific-actor';

      const record1 = AuditRecord.create({
        actorId: { value: actorId } as unknown as import('../../../src/domains/audit/value-objects/AuditActorId').AuditActorId,
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-1',
        result: AuditResult.SUCCESS,
      });

      const record2 = AuditRecord.create({
        actorId: { value: 'other-actor' } as unknown as import('../../../src/domains/audit/value-objects/AuditActorId').AuditActorId,
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-2',
        result: AuditResult.SUCCESS,
      });

      await repository.storeRecord(record1);
      await repository.storeRecord(record2);

      const result = await repository.findByActor(actorId);

      expect(result.items.length).toBe(1);
      expect(result.items[0].actorId.value).toBe(actorId);
    });
  });

  describe('archive', () => {
    it('should archive old records', async () => {
      const oldRecord = AuditRecord.create({
        actorId: { value: 'actor-1' } as unknown as import('../../../src/domains/audit/value-objects/AuditActorId').AuditActorId,
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-1',
        result: AuditResult.SUCCESS,
      });

      await repository.storeRecord(oldRecord);

      const oldDate = new Date(Date.now() + 1000); // 1 second in future
      const archivedCount = await repository.archive(oldDate);

      expect(archivedCount).toBe(1);
    });
  });
});
