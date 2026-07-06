/**
 * Hardening Repository Tests
 *
 * Tests for SupabaseHardeningRepository with mock Supabase client.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SupabaseHardeningRepository } from '../repositories/SupabaseHardeningRepository';
import {
  HardeningRule,
  HardeningChecklist,
  HardeningSnapshot,
  HardeningStatus,
  RulePriority,
  ChecklistStatus,
  RuleId,
  ChecklistId,
  SnapshotId,
} from '../index';

// Mock logger
vi.mock('../../../src/core/logging/logger.service', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

/**
 * Mock Supabase client for testing.
 */
interface MockSupabaseClient {
  from: ReturnType<typeof vi.fn>;
}

function createMockSupabaseClient() {
  const mockData: Record<string, unknown[]> = {
    hardening_rules: [],
    hardening_checklists: [],
    hardening_snapshots: [],
  };

  const fromMock = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } })),
  });

  return {
    client: {
      from: fromMock,
    },
    mockData,
    reset: () => {
      mockData.hardening_rules = [];
      mockData.hardening_checklists = [];
      mockData.hardening_snapshots = [];
    },
    setupSelect: (table: string, data: unknown[]) => {
      mockData[table] = data;
      fromMock.mockImplementation((tableName: string) => {
        if (tableName === table) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            single: vi.fn().mockImplementation(() => {
              if (data.length > 0) {
                return Promise.resolve({ data: data[0], error: null });
              }
              return Promise.resolve({ data: null, error: { code: 'PGRST116' } });
            }),
            then: vi.fn().mockImplementation(function(this: unknown) {
              return Promise.resolve({ data, error: null });
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          range: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
        };
      });
    },
  };
}

describe('SupabaseHardeningRepository', () => {
  let repository: SupabaseHardeningRepository;
  let mockClient: MockSupabaseClient;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    repository = new SupabaseHardeningRepository(mockClient.client as unknown as ReturnType<typeof vi.fn> extends () => infer R ? R : never);
  });

  describe('Rule Operations', () => {
    const createTestRule = (): HardeningRule => {
      return HardeningRule.create({
        name: 'Test Rule',
        status: HardeningStatus.ACTIVE,
        priority: RulePriority.HIGH,
        description: 'Test description',
      });
    };

    it('should create a rule', async () => {
      const rule = createTestRule();

      // Mock the insert to return the data
      (mockClient.client.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'hardening_rules') {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                rule_id: rule.ruleId.value,
                name: rule.name,
                status: rule.status,
                priority: rule.priority,
                description: rule.description,
                metadata: rule.metadata,
                created_at: rule.createdAt.toISOString(),
                updated_at: rule.updatedAt.toISOString(),
              },
              error: null,
            }),
          };
        }
        return { insert: vi.fn(), select: vi.fn(), single: vi.fn() };
      });

      const result = await repository.createRule(rule);

      expect(result.name).toBe('Test Rule');
    });

    it('should find rule by ID', async () => {
      const rule = createTestRule();

      (mockClient.client.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'hardening_rules') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                rule_id: rule.ruleId.value,
                name: rule.name,
                status: rule.status,
                priority: rule.priority,
                description: rule.description,
                metadata: rule.metadata,
                created_at: rule.createdAt.toISOString(),
                updated_at: rule.updatedAt.toISOString(),
              },
              error: null,
            }),
          };
        }
        return { select: vi.fn(), eq: vi.fn(), single: vi.fn() };
      });

      const result = await repository.findRuleById(rule.ruleId);

      expect(result).not.toBeNull();
    });

    it('should return null when rule not found', async () => {
      const ruleId = RuleId.create();

      (mockClient.client.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'hardening_rules') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' },
            }),
          };
        }
        return { select: vi.fn(), eq: vi.fn(), single: vi.fn() };
      });

      const result = await repository.findRuleById(ruleId);

      expect(result).toBeNull();
    });

    it('should count rules', async () => {
      (mockClient.client.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'hardening_rules') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            then: vi.fn().mockResolvedValue({
              data: null,
              error: null,
              count: 5,
            }),
          };
        }
        return { select: vi.fn(), eq: vi.fn(), then: vi.fn() };
      });

      const count = await repository.countRules();

      expect(count).toBe(5);
    });

    it('should list rules with pagination', async () => {
      const rules = [
        HardeningRule.create({ name: 'Rule 1' }),
        HardeningRule.create({ name: 'Rule 2' }),
      ];

      (mockClient.client.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'hardening_rules') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            then: vi.fn().mockResolvedValue({
              data: rules.map(r => ({
                rule_id: r.ruleId.value,
                name: r.name,
                status: r.status,
                priority: r.priority,
                description: r.description,
                metadata: r.metadata,
                created_at: r.createdAt.toISOString(),
                updated_at: r.updatedAt.toISOString(),
              })),
              error: null,
              count: 2,
            }),
          };
        }
        return { select: vi.fn(), eq: vi.fn(), order: vi.fn(), range: vi.fn(), then: vi.fn() };
      });

      const result = await repository.listRules({ page: 1, pageSize: 10 });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  describe('Checklist Operations', () => {
    const createTestChecklist = (): HardeningChecklist => {
      return HardeningChecklist.create({
        title: 'Test Checklist',
        status: ChecklistStatus.PENDING,
        owner: 'test-team',
      });
    };

    it('should create a checklist', async () => {
      const checklist = createTestChecklist();

      (mockClient.client.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'hardening_checklists') {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                checklist_id: checklist.checklistId.value,
                title: checklist.title,
                status: checklist.status,
                completed_at: null,
                owner: checklist.owner,
                metadata: checklist.metadata,
                created_at: checklist.createdAt.toISOString(),
                updated_at: checklist.updatedAt.toISOString(),
              },
              error: null,
            }),
          };
        }
        return { insert: vi.fn(), select: vi.fn(), single: vi.fn() };
      });

      const result = await repository.createChecklist(checklist);

      expect(result.title).toBe('Test Checklist');
    });

    it('should find checklist by ID', async () => {
      const checklist = createTestChecklist();

      (mockClient.client.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'hardening_checklists') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                checklist_id: checklist.checklistId.value,
                title: checklist.title,
                status: checklist.status,
                completed_at: null,
                owner: checklist.owner,
                metadata: checklist.metadata,
                created_at: checklist.createdAt.toISOString(),
                updated_at: checklist.updatedAt.toISOString(),
              },
              error: null,
            }),
          };
        }
        return { select: vi.fn(), eq: vi.fn(), single: vi.fn() };
      });

      const result = await repository.findChecklistById(checklist.checklistId);

      expect(result).not.toBeNull();
    });

    it('should count checklists', async () => {
      (mockClient.client.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'hardening_checklists') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            then: vi.fn().mockResolvedValue({
              data: null,
              error: null,
              count: 3,
            }),
          };
        }
        return { select: vi.fn(), eq: vi.fn(), then: vi.fn() };
      });

      const count = await repository.countChecklists();

      expect(count).toBe(3);
    });
  });

  describe('Snapshot Operations', () => {
    const createTestSnapshot = (): HardeningSnapshot => {
      return HardeningSnapshot.create({
        systemVersion: '1.0.0',
        moduleCount: 10,
        healthStatus: 'healthy',
      });
    };

    it('should create a snapshot', async () => {
      const snapshot = createTestSnapshot();

      (mockClient.client.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'hardening_snapshots') {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                snapshot_id: snapshot.snapshotId.value,
                created_at: snapshot.createdAt.toISOString(),
                system_version: snapshot.systemVersion,
                module_count: snapshot.moduleCount,
                health_status: snapshot.healthStatus,
                metadata: snapshot.metadata,
              },
              error: null,
            }),
          };
        }
        return { insert: vi.fn(), select: vi.fn(), single: vi.fn() };
      });

      const result = await repository.createSnapshot(snapshot);

      expect(result.systemVersion).toBe('1.0.0');
      expect(result.moduleCount).toBe(10);
    });

    it('should find snapshot by ID', async () => {
      const snapshot = createTestSnapshot();

      (mockClient.client.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'hardening_snapshots') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                snapshot_id: snapshot.snapshotId.value,
                created_at: snapshot.createdAt.toISOString(),
                system_version: snapshot.systemVersion,
                module_count: snapshot.moduleCount,
                health_status: snapshot.healthStatus,
                metadata: snapshot.metadata,
              },
              error: null,
            }),
          };
        }
        return { select: vi.fn(), eq: vi.fn(), single: vi.fn() };
      });

      const result = await repository.findSnapshotById(snapshot.snapshotId);

      expect(result).not.toBeNull();
    });

    it('should count snapshots', async () => {
      (mockClient.client.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'hardening_snapshots') {
          return {
            select: vi.fn().mockReturnThis(),
            then: vi.fn().mockResolvedValue({
              data: null,
              error: null,
              count: 7,
            }),
          };
        }
        return { select: vi.fn(), then: vi.fn() };
      });

      const count = await repository.countSnapshots();

      expect(count).toBe(7);
    });

    it('should list snapshots with pagination', async () => {
      const snapshots = [
        HardeningSnapshot.create({ systemVersion: '1.0.0', moduleCount: 5, healthStatus: 'healthy' }),
        HardeningSnapshot.create({ systemVersion: '1.1.0', moduleCount: 6, healthStatus: 'healthy' }),
      ];

      (mockClient.client.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
        if (table === 'hardening_snapshots') {
          return {
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            then: vi.fn().mockResolvedValue({
              data: snapshots.map(s => ({
                snapshot_id: s.snapshotId.value,
                created_at: s.createdAt.toISOString(),
                system_version: s.systemVersion,
                module_count: s.moduleCount,
                health_status: s.healthStatus,
                metadata: s.metadata,
              })),
              error: null,
              count: 2,
            }),
          };
        }
        return { select: vi.fn(), order: vi.fn(), range: vi.fn(), then: vi.fn() };
      });

      const result = await repository.listSnapshots({ page: 1, pageSize: 10 });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });
});
