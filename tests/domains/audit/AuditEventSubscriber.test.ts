/**
 * Audit Event Subscriber Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuditEventSubscriber } from '../../../src/domains/audit/subscribers/AuditEventSubscriber';
import type { IAuditRepository } from '../../../src/domains/audit/interfaces/IAuditRepository';
import type { AuditRecord } from '../../../src/domains/audit/entities/AuditRecord';
import type { AuditCategory } from '../../../src/domains/audit/entities/AuditCategory';
import type { AuditActor } from '../../../src/domains/audit/entities/AuditActor';
import type { DomainEvent } from '../../../src/core/events/entities/DomainEvent';
import { EventId } from '../../../src/core/events/value-objects/EventId';
import { EventType } from '../../../src/core/events/value-objects/EventType';
import { AggregateId } from '../../../src/core/events/value-objects/AggregateId';
import { AuditAction } from '../../../src/domains/audit/types/AuditAction';
import { AuditResult } from '../../../src/domains/audit/types/AuditResult';
import { AuditActorType } from '../../../src/domains/audit/types/AuditActorType';

/**
 * Mock implementation of IAuditRepository for testing.
 */
class MockAuditRepository implements IAuditRepository {
  private records: AuditRecord[] = [];
  private shouldFail = false;

  setShouldFail(fail: boolean): void {
    this.shouldFail = fail;
  }

  async storeRecord(record: AuditRecord): Promise<AuditRecord> {
    if (this.shouldFail) {
      throw new Error('Repository failure');
    }
    this.records.push(record);
    return record;
  }

  async findRecordById(id: { value: string }): Promise<AuditRecord | null> {
    return this.records.find((r) => r.auditId.value === id.value) || null;
  }

  async listRecords(params: never, filters?: never): Promise<{ items: AuditRecord[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    return {
      items: this.records,
      total: this.records.length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  async countRecords(): Promise<number> {
    return this.records.length;
  }

  async findByActor(actorId: string, params?: never): Promise<{ items: AuditRecord[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    return {
      items: this.records.filter((r) => r.actorId.value === actorId),
      total: this.records.filter((r) => r.actorId.value === actorId).length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  async findByTarget(targetId: string, params?: never): Promise<{ items: AuditRecord[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    return {
      items: this.records.filter((r) => r.targetId === targetId),
      total: this.records.filter((r) => r.targetId === targetId).length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  async findByCategory(categoryId: string, params?: never): Promise<{ items: AuditRecord[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    return {
      items: this.records.filter((r) => r.categoryId?.value === categoryId),
      total: this.records.filter((r) => r.categoryId?.value === categoryId).length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  async archive(): Promise<number> {
    return 0;
  }

  async createCategory(category: AuditCategory): Promise<AuditCategory> {
    return category;
  }

  async findCategoryById(): Promise<AuditCategory | null> {
    return null;
  }

  async listCategories(): Promise<{ items: AuditCategory[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  async countCategories(): Promise<number> {
    return 0;
  }

  async upsertActor(actor: AuditActor): Promise<AuditActor> {
    return actor;
  }

  async findActorById(): Promise<AuditActor | null> {
    return null;
  }

  async listActors(): Promise<{ items: AuditActor[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  async countActors(): Promise<number> {
    return 0;
  }
}

/**
 * Helper function to create a mock domain event.
 */
function createMockEvent(params: {
  eventType: string;
  aggregateType?: string;
  aggregateId?: string;
  sourceModule?: string;
  payload?: Record<string, unknown>;
  userId?: string;
}): DomainEvent {
  return {
    eventId: EventId.generate(),
    eventType: EventType.reconstruct(params.eventType),
    aggregateId: AggregateId.reconstruct(params.aggregateId || 'agg-123'),
    aggregateType: params.aggregateType || 'TestEntity',
    sourceModule: params.sourceModule || 'test',
    occurredAt: new Date(),
    payload: params.payload || {},
    metadata: {
      source: params.sourceModule || 'test',
      timestamp: new Date(),
      version: 1,
      userId: params.userId,
    },
  } as unknown as DomainEvent;
}

describe('AuditEventSubscriber', () => {
  let subscriber: AuditEventSubscriber;
  let repository: MockAuditRepository;

  beforeEach(() => {
    repository = new MockAuditRepository();
    subscriber = new AuditEventSubscriber(repository);
  });

  describe('handle', () => {
    it('should create an audit record from a domain event', async () => {
      const event = createMockEvent({
        eventType: 'Player.Created',
        aggregateType: 'PlayerProfile',
        aggregateId: 'player-123',
        sourceModule: 'player',
        payload: { id: 'player-123', name: 'Test Player' },
        userId: 'user-456',
      });

      const result = await subscriber.handle(event);

      expect(result).toBe(true);
      expect(repository.countRecords()).resolves.toBe(1);
    });

    it('should map Player events to gameplay category', async () => {
      const event = createMockEvent({
        eventType: 'Player.Updated',
        aggregateType: 'PlayerProfile',
        aggregateId: 'player-123',
        sourceModule: 'player',
        payload: { id: 'player-123' },
      });

      await subscriber.handle(event);

      const records = await (repository as unknown as { records: AuditRecord[] }).records;
      expect(records.length).toBe(1);
      expect(records[0].categoryId?.value).toBe('gameplay');
    });

    it('should map Admin events to administration category', async () => {
      const event = createMockEvent({
        eventType: 'Admin.Created',
        aggregateType: 'AdminUser',
        aggregateId: 'admin-123',
        sourceModule: 'admin',
        payload: { id: 'admin-123' },
      });

      await subscriber.handle(event);

      const records = await (repository as unknown as { records: AuditRecord[] }).records;
      expect(records.length).toBe(1);
      expect(records[0].categoryId?.value).toBe('administration');
    });

    it('should map Reward events to economy category', async () => {
      const event = createMockEvent({
        eventType: 'Reward.Granted',
        aggregateType: 'Reward',
        aggregateId: 'reward-123',
        sourceModule: 'reward',
        payload: { id: 'reward-123' },
      });

      await subscriber.handle(event);

      const records = await (repository as unknown as { records: AuditRecord[] }).records;
      expect(records.length).toBe(1);
      expect(records[0].categoryId?.value).toBe('economy');
    });

    it('should not block gameplay when repository fails', async () => {
      repository.setShouldFail(true);

      const event = createMockEvent({
        eventType: 'Player.Created',
        aggregateType: 'PlayerProfile',
        aggregateId: 'player-123',
        sourceModule: 'player',
        payload: { id: 'player-123' },
      });

      // Should return false but not throw
      const result = await subscriber.handle(event);

      expect(result).toBe(false);
    });

    it('should handle unknown event types gracefully', async () => {
      const event = createMockEvent({
        eventType: 'Unknown.Event',
        aggregateType: 'UnknownEntity',
        aggregateId: 'unknown-123',
        sourceModule: 'unknown',
        payload: {},
      });

      const result = await subscriber.handle(event);

      // Should still process as generic event
      expect(result).toBe(true);
    });

    it('should use payload id as target id when available', async () => {
      const event = createMockEvent({
        eventType: 'Player.Updated',
        aggregateType: 'PlayerProfile',
        aggregateId: 'agg-123',
        sourceModule: 'player',
        payload: { id: 'payload-id-456' },
      });

      await subscriber.handle(event);

      const records = await (repository as unknown as { records: AuditRecord[] }).records;
      expect(records.length).toBe(1);
      expect(records[0].targetId).toBe('payload-id-456');
    });

    it('should use userId from metadata as actor when available', async () => {
      const event = createMockEvent({
        eventType: 'Player.Updated',
        aggregateType: 'PlayerProfile',
        aggregateId: 'player-123',
        sourceModule: 'player',
        payload: { id: 'player-123' },
        userId: 'specific-user-id',
      });

      await subscriber.handle(event);

      const records = await (repository as unknown as { records: AuditRecord[] }).records;
      expect(records.length).toBe(1);
      expect(records[0].actorId.value).toBe('specific-user-id');
    });

    it('should determine result as failure when payload contains error', async () => {
      const event = createMockEvent({
        eventType: 'Player.Updated',
        aggregateType: 'PlayerProfile',
        aggregateId: 'player-123',
        sourceModule: 'player',
        payload: { id: 'player-123', error: 'Something went wrong' },
      });

      await subscriber.handle(event);

      const records = await (repository as unknown as { records: AuditRecord[] }).records;
      expect(records.length).toBe(1);
      expect(records[0].result).toBe(AuditResult.FAILURE);
    });
  });

  describe('canHandle', () => {
    it('should return true when active', () => {
      expect(subscriber.canHandle(EventType.reconstruct('AnyEvent'))).toBe(true);
    });
  });
});
