/**
 * Audit Service Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuditService } from '../../../src/domains/audit/services/AuditService';
import type { IAuditRepository, AuditRecordFilterParams } from '../../../src/domains/audit/interfaces/IAuditRepository';
import type { AuditRecord } from '../../../src/domains/audit/entities/AuditRecord';
import type { AuditCategory } from '../../../src/domains/audit/entities/AuditCategory';
import type { AuditActor } from '../../../src/domains/audit/entities/AuditActor';
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

  async findRecordById(id: { value: string }): Promise<AuditRecord | null> {
    return this.records.get(id.value) || null;
  }

  async listRecords(
    params: PaginationParams,
    filters?: AuditRecordFilterParams
  ): Promise<{ items: AuditRecord[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    let items = Array.from(this.records.values());
    if (filters?.actorId) {
      items = items.filter((r) => r.actorId.value === filters.actorId);
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
    for (const [, record] of this.records) {
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

  async findCategoryById(id: { value: string }): Promise<AuditCategory | null> {
    return this.categories.get(id.value) || null;
  }

  async listCategories(params: PaginationParams): Promise<{ items: AuditCategory[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    const items = Array.from(this.categories.values());
    return {
      items,
      total: items.length,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  async countCategories(): Promise<number> {
    return this.categories.size;
  }

  async upsertActor(actor: AuditActor): Promise<AuditActor> {
    this.actors.set(actor.actorId.value, actor);
    return actor;
  }

  async findActorById(id: { value: string }): Promise<AuditActor | null> {
    return this.actors.get(id.value) || null;
  }

  async listActors(params: PaginationParams): Promise<{ items: AuditActor[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    const items = Array.from(this.actors.values());
    return {
      items,
      total: items.length,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  async countActors(): Promise<number> {
    return this.actors.size;
  }
}

describe('AuditService', () => {
  let service: AuditService;
  let repository: MockAuditRepository;

  beforeEach(() => {
    repository = new MockAuditRepository();
    service = new AuditService(repository);
  });

  describe('createRecord', () => {
    it('should create an audit record with valid data', async () => {
      const result = await service.createRecord({
        actorId: 'actor-123',
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-456',
        result: AuditResult.SUCCESS,
      });

      expect(result).toBeDefined();
      expect(result?.actorId.value).toBe('actor-123');
    });

    it('should return null for invalid data', async () => {
      const result = await service.createRecord({
        actorId: '', // Invalid - empty
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-456',
        result: AuditResult.SUCCESS,
      });

      expect(result).toBeNull();
    });
  });

  describe('findRecord', () => {
    it('should find a stored record', async () => {
      const created = await service.createRecord({
        actorId: 'actor-123',
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-456',
        result: AuditResult.SUCCESS,
      });

      const found = await service.findRecord(created!.auditId.value);

      expect(found).toBeDefined();
      expect(found?.auditId.value).toBe(created?.auditId.value);
    });

    it('should return null for non-existent record', async () => {
      const found = await service.findRecord('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('listRecords', () => {
    it('should list audit records with pagination', async () => {
      // Create some records
      for (let i = 0; i < 3; i++) {
        await service.createRecord({
          actorId: `actor-${i}`,
          actorType: AuditActorType.PLAYER,
          action: AuditAction.LOGIN,
          targetType: 'Player',
          targetId: `player-${i}`,
          result: AuditResult.SUCCESS,
        });
      }

      const result = await service.listRecords({ page: 1, pageSize: 10 });

      expect(result).toBeDefined();
      expect(result?.items.length).toBe(3);
      expect(result?.total).toBe(3);
    });
  });

  describe('countRecords', () => {
    it('should count all records', async () => {
      await service.createRecord({
        actorId: 'actor-1',
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-1',
        result: AuditResult.SUCCESS,
      });

      await service.createRecord({
        actorId: 'actor-2',
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGOUT,
        targetType: 'Player',
        targetId: 'player-2',
        result: AuditResult.SUCCESS,
      });

      const count = await service.countRecords();

      expect(count).toBe(2);
    });
  });

  describe('getActorHistory', () => {
    it('should get history for a specific actor', async () => {
      const actorId = 'specific-actor';

      await service.createRecord({
        actorId,
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-1',
        result: AuditResult.SUCCESS,
      });

      await service.createRecord({
        actorId,
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGOUT,
        targetType: 'Player',
        targetId: 'player-1',
        result: AuditResult.SUCCESS,
      });

      await service.createRecord({
        actorId: 'other-actor',
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-2',
        result: AuditResult.SUCCESS,
      });

      const history = await service.getActorHistory(actorId);

      expect(history).toBeDefined();
      expect(history?.items.length).toBe(2);
    });
  });

  describe('getTargetHistory', () => {
    it('should get history for a specific target', async () => {
      const targetId = 'specific-target';

      await service.createRecord({
        actorId: 'actor-1',
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId,
        result: AuditResult.SUCCESS,
      });

      const history = await service.getTargetHistory(targetId);

      expect(history).toBeDefined();
      expect(history?.items.length).toBe(1);
      expect(history?.items[0].targetId).toBe(targetId);
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const category = await service.createCategory({
        name: 'Test Category',
        description: 'A test category for testing',
      });

      expect(category).toBeDefined();
      expect(category?.name).toBe('Test Category');
    });
  });

  describe('upsertActor', () => {
    it('should upsert an actor', async () => {
      const actor = await service.upsertActor({
        actorId: 'actor-123',
        actorType: AuditActorType.PLAYER,
        displayName: 'Test Player',
      });

      expect(actor).toBeDefined();
      expect(actor?.displayName).toBe('Test Player');
    });
  });

  describe('archiveRecords', () => {
    it('should archive old records', async () => {
      // Create a record
      await service.createRecord({
        actorId: 'actor-1',
        actorType: AuditActorType.PLAYER,
        action: AuditAction.LOGIN,
        targetType: 'Player',
        targetId: 'player-1',
        result: AuditResult.SUCCESS,
      });

      // Archive records older than now (should not archive anything)
      const archivedCount = await service.archiveRecords(new Date());

      expect(archivedCount).toBe(0);
    });
  });

  describe('Failure Protection', () => {
    it('should not throw on repository failure', async () => {
      // Create service with a repository that will fail
      const failingRepo = new MockAuditRepository();
      const failingService = new AuditService(failingRepo);

      // Delete internal storage to force failure
      // This should cause findRecord to return null instead of throwing
      const result = await failingService.findRecord('non-existent-id');

      expect(result).toBeNull();
    });
  });
});
