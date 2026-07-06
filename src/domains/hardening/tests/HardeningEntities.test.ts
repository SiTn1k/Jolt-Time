/**
 * Hardening Domain Tests
 *
 * Tests for Hardening entities, validators, mappers, and service.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
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
  RuleValidator,
  ChecklistValidator,
  SnapshotValidator,
  HardeningMapper,
  ChecklistMapper,
  SnapshotMapper,
  HardeningService,
  setupHardeningDomain,
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
 * Mock implementation of IHardeningRepository for testing.
 */
class MockHardeningRepository {
  private rules: Map<string, HardeningRule> = new Map();
  private checklists: Map<string, HardeningChecklist> = new Map();
  private snapshots: Map<string, HardeningSnapshot> = new Map();

  async createRule(rule: HardeningRule): Promise<HardeningRule> {
    this.rules.set(rule.ruleId.value, rule);
    return rule;
  }

  async findRuleById(id: RuleId): Promise<HardeningRule | null> {
    return this.rules.get(id.value) || null;
  }

  async updateRule(rule: HardeningRule): Promise<HardeningRule> {
    this.rules.set(rule.ruleId.value, rule);
    return rule;
  }

  async deleteRule(id: RuleId): Promise<void> {
    this.rules.delete(id.value);
  }

  async listRules(
    params: { page: number; pageSize: number; sortBy?: string; sortOrder?: string },
    _filters?: { status?: HardeningStatus; priority?: number; category?: string; owner?: string }
  ): Promise<{ items: HardeningRule[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    const items = Array.from(this.rules.values());
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

  async countRules(_filters?: { status?: HardeningStatus; priority?: number; category?: string; owner?: string }): Promise<number> {
    return this.rules.size;
  }

  async createChecklist(checklist: HardeningChecklist): Promise<HardeningChecklist> {
    this.checklists.set(checklist.checklistId.value, checklist);
    return checklist;
  }

  async findChecklistById(id: ChecklistId): Promise<HardeningChecklist | null> {
    return this.checklists.get(id.value) || null;
  }

  async updateChecklist(checklist: HardeningChecklist): Promise<HardeningChecklist> {
    this.checklists.set(checklist.checklistId.value, checklist);
    return checklist;
  }

  async deleteChecklist(id: ChecklistId): Promise<void> {
    this.checklists.delete(id.value);
  }

  async listChecklists(
    params: { page: number; pageSize: number; sortBy?: string; sortOrder?: string },
    _filters?: { status?: ChecklistStatus; owner?: string; category?: string }
  ): Promise<{ items: HardeningChecklist[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    const items = Array.from(this.checklists.values());
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

  async countChecklists(_filters?: { status?: ChecklistStatus; owner?: string; category?: string }): Promise<number> {
    return this.checklists.size;
  }

  async createSnapshot(snapshot: HardeningSnapshot): Promise<HardeningSnapshot> {
    this.snapshots.set(snapshot.snapshotId.value, snapshot);
    return snapshot;
  }

  async findSnapshotById(id: SnapshotId): Promise<HardeningSnapshot | null> {
    return this.snapshots.get(id.value) || null;
  }

  async listSnapshots(
    params: { page: number; pageSize: number; sortBy?: string; sortOrder?: string }
  ): Promise<{ items: HardeningSnapshot[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }> {
    const items = Array.from(this.snapshots.values());
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

  async deleteSnapshot(id: SnapshotId): Promise<void> {
    this.snapshots.delete(id.value);
  }

  async countSnapshots(): Promise<number> {
    return this.snapshots.size;
  }
}

// =========================================================================
// RULE TESTS
// =========================================================================

describe('HardeningRule', () => {
  describe('create', () => {
    it('should create a rule with default values', () => {
      const rule = HardeningRule.create({
        name: 'Test Rule',
      });

      expect(rule.name).toBe('Test Rule');
      expect(rule.status).toBe(HardeningStatus.PENDING);
      expect(rule.priority).toBe(RulePriority.MEDIUM);
      expect(rule.ruleId).toBeInstanceOf(RuleId);
    });

    it('should create a rule with custom values', () => {
      const rule = HardeningRule.create({
        name: 'Custom Rule',
        status: HardeningStatus.ACTIVE,
        priority: RulePriority.CRITICAL,
        description: 'Test description',
      });

      expect(rule.name).toBe('Custom Rule');
      expect(rule.status).toBe(HardeningStatus.ACTIVE);
      expect(rule.priority).toBe(RulePriority.CRITICAL);
      expect(rule.description).toBe('Test description');
    });

    it('should generate timestamps on creation', () => {
      const before = new Date();
      const rule = HardeningRule.create({ name: 'Timestamp Rule' });
      const after = new Date();

      expect(rule.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(rule.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(rule.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(rule.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct a rule from stored data', () => {
      const record = {
        ruleId: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Stored Rule',
        status: HardeningStatus.ACTIVE,
        priority: RulePriority.HIGH,
        description: 'Stored description',
        metadata: { category: 'security', tags: ['test'], owner: 'team' },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      };

      const rule = HardeningRule.fromStorage(record);

      expect(rule.ruleId.value).toBe(record.ruleId);
      expect(rule.name).toBe(record.name);
      expect(rule.status).toBe(record.status);
      expect(rule.priority).toBe(record.priority);
      expect(rule.description).toBe(record.description);
    });
  });

  describe('status helpers', () => {
    it('should correctly identify active status', () => {
      const rule = HardeningRule.create({ name: 'Active', status: HardeningStatus.ACTIVE });
      expect(rule.isActive).toBe(true);
      expect(rule.isPending).toBe(false);
    });

    it('should correctly identify pending status', () => {
      const rule = HardeningRule.create({ name: 'Pending', status: HardeningStatus.PENDING });
      expect(rule.isPending).toBe(true);
      expect(rule.isActive).toBe(false);
    });

    it('should correctly identify in-progress status', () => {
      const rule = HardeningRule.create({ name: 'In Progress', status: HardeningStatus.IN_PROGRESS });
      expect(rule.isInProgress).toBe(true);
    });

    it('should correctly identify terminal status', () => {
      const deprecatedRule = HardeningRule.create({ name: 'Deprecated', status: HardeningStatus.DEPRECATED });
      const disabledRule = HardeningRule.create({ name: 'Disabled', status: HardeningStatus.DISABLED });

      expect(deprecatedRule.isTerminal).toBe(true);
      expect(disabledRule.isTerminal).toBe(true);
    });
  });

  describe('copyWith', () => {
    it('should create a copy with updated fields', () => {
      const original = HardeningRule.create({ name: 'Original', status: HardeningStatus.PENDING });
      const copy = original.copyWith({ name: 'Updated', status: HardeningStatus.ACTIVE });

      expect(copy.name).toBe('Updated');
      expect(copy.status).toBe(HardeningStatus.ACTIVE);
      expect(copy.ruleId).toBe(original.ruleId);
    });
  });

  describe('toJSON and toRecord', () => {
    it('should serialize to JSON', () => {
      const rule = HardeningRule.create({ name: 'JSON Rule', description: 'Test' });
      const json = rule.toJSON();

      expect(json.name).toBe('JSON Rule');
      expect(json.description).toBe('Test');
      expect(json.ruleId).toBe(rule.ruleId.value);
    });

    it('should convert to database record', () => {
      const rule = HardeningRule.create({ name: 'Record Rule' });
      const record = rule.toRecord();

      expect(record.name).toBe('Record Rule');
      expect(record.ruleId).toBe(rule.ruleId.value);
    });
  });
});

// =========================================================================
// CHECKLIST TESTS
// =========================================================================

describe('HardeningChecklist', () => {
  describe('create', () => {
    it('should create a checklist with default values', () => {
      const checklist = HardeningChecklist.create({
        title: 'Test Checklist',
      });

      expect(checklist.title).toBe('Test Checklist');
      expect(checklist.status).toBe(ChecklistStatus.PENDING);
      expect(checklist.completedAt).toBeNull();
      expect(checklist.checklistId).toBeInstanceOf(ChecklistId);
    });

    it('should create a checklist with custom values', () => {
      const checklist = HardeningChecklist.create({
        title: 'Custom Checklist',
        status: ChecklistStatus.IN_PROGRESS,
        owner: 'security-team',
      });

      expect(checklist.title).toBe('Custom Checklist');
      expect(checklist.status).toBe(ChecklistStatus.IN_PROGRESS);
      expect(checklist.owner).toBe('security-team');
    });
  });

  describe('status helpers', () => {
    it('should correctly identify completed status', () => {
      const checklist = HardeningChecklist.create({
        title: 'Completed',
        status: ChecklistStatus.COMPLETED,
      });
      expect(checklist.isCompleted).toBe(true);
      expect(checklist.isActive).toBe(false);
    });

    it('should correctly identify active status', () => {
      const pending = HardeningChecklist.create({ title: 'Pending' });
      const inProgress = HardeningChecklist.create({ title: 'In Progress', status: ChecklistStatus.IN_PROGRESS });

      expect(pending.isActive).toBe(true);
      expect(inProgress.isActive).toBe(true);
    });
  });

  describe('copyWith', () => {
    it('should create a copy with updated fields', () => {
      const original = HardeningChecklist.create({ title: 'Original' });
      const copy = original.copyWith({ title: 'Updated', status: ChecklistStatus.COMPLETED });

      expect(copy.title).toBe('Updated');
      expect(copy.status).toBe(ChecklistStatus.COMPLETED);
      expect(copy.checklistId).toBe(original.checklistId);
    });
  });
});

// =========================================================================
// SNAPSHOT TESTS
// =========================================================================

describe('HardeningSnapshot', () => {
  describe('create', () => {
    it('should create a snapshot with required values', () => {
      const snapshot = HardeningSnapshot.create({
        systemVersion: '1.0.0',
        moduleCount: 10,
        healthStatus: 'healthy',
      });

      expect(snapshot.systemVersion).toBe('1.0.0');
      expect(snapshot.moduleCount).toBe(10);
      expect(snapshot.healthStatus).toBe('healthy');
      expect(snapshot.snapshotId).toBeInstanceOf(SnapshotId);
    });
  });

  describe('status helpers', () => {
    it('should correctly identify healthy status', () => {
      const snapshot = HardeningSnapshot.create({
        systemVersion: '1.0.0',
        moduleCount: 5,
        healthStatus: 'healthy',
      });
      expect(snapshot.isHealthy).toBe(true);
    });

    it('should correctly identify unhealthy status', () => {
      const snapshot = HardeningSnapshot.create({
        systemVersion: '1.0.0',
        moduleCount: 5,
        healthStatus: 'unhealthy',
      });
      expect(snapshot.isHealthy).toBe(false);
    });
  });

  describe('age', () => {
    it('should calculate age in milliseconds', () => {
      const snapshot = HardeningSnapshot.create({
        systemVersion: '1.0.0',
        moduleCount: 5,
        healthStatus: 'healthy',
      });

      expect(snapshot.age).toBeGreaterThanOrEqual(0);
    });
  });
});

// =========================================================================
// VALIDATOR TESTS
// =========================================================================

describe('RuleValidator', () => {
  describe('isValidRuleId', () => {
    it('should validate correct UUID', () => {
      expect(RuleValidator.isValidRuleId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should reject invalid UUID', () => {
      expect(RuleValidator.isValidRuleId('invalid')).toBe(false);
      expect(RuleValidator.isValidRuleId('')).toBe(false);
      expect(RuleValidator.isValidRuleId(null as unknown as string)).toBe(false);
    });
  });

  describe('isValidName', () => {
    it('should validate correct names', () => {
      expect(RuleValidator.isValidName('Valid Name')).toBe(true);
      expect(RuleValidator.isValidName('Ab')).toBe(false);
    });

    it('should reject invalid names', () => {
      expect(RuleValidator.isValidName('')).toBe(false);
      expect(RuleValidator.isValidName(null as unknown as string)).toBe(false);
    });
  });

  describe('validate', () => {
    it('should validate complete rule data', () => {
      const result = RuleValidator.validate({
        ruleId: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Valid Rule',
        status: HardeningStatus.ACTIVE,
        priority: RulePriority.HIGH,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid data', () => {
      const result = RuleValidator.validate({
        name: '',
        status: 'invalid' as unknown as HardeningStatus,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

describe('ChecklistValidator', () => {
  describe('isValidChecklistId', () => {
    it('should validate correct UUID', () => {
      expect(ChecklistValidator.isValidChecklistId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should reject invalid UUID', () => {
      expect(ChecklistValidator.isValidChecklistId('invalid')).toBe(false);
      expect(ChecklistValidator.isValidChecklistId('')).toBe(false);
    });
  });

  describe('validate', () => {
    it('should validate complete checklist data', () => {
      const result = ChecklistValidator.validate({
        checklistId: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Valid Checklist',
        status: ChecklistStatus.PENDING,
        owner: 'team',
      });

      expect(result.isValid).toBe(true);
    });
  });
});

describe('SnapshotValidator', () => {
  describe('isValidSnapshotId', () => {
    it('should validate correct UUID', () => {
      expect(SnapshotValidator.isValidSnapshotId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should reject invalid UUID', () => {
      expect(SnapshotValidator.isValidSnapshotId('invalid')).toBe(false);
      expect(SnapshotValidator.isValidSnapshotId('')).toBe(false);
    });
  });

  describe('validate', () => {
    it('should validate complete snapshot data', () => {
      const result = SnapshotValidator.validate({
        snapshotId: '550e8400-e29b-41d4-a716-446655440000',
        systemVersion: '1.0.0',
        moduleCount: 10,
        healthStatus: 'healthy',
      });

      expect(result.isValid).toBe(true);
    });
  });
});

// =========================================================================
// MAPPER TESTS
// =========================================================================

describe('HardeningMapper', () => {
  describe('toDto', () => {
    it('should convert rule entity to DTO', () => {
      const rule = HardeningRule.create({
        name: 'Mapper Test',
        status: HardeningStatus.ACTIVE,
      });

      const dto = HardeningMapper.toDto(rule);

      expect(dto.ruleId).toBe(rule.ruleId.value);
      expect(dto.name).toBe('Mapper Test');
      expect(dto.status).toBe(HardeningStatus.ACTIVE);
    });
  });

  describe('toResponse', () => {
    it('should convert rule entity to response DTO', () => {
      const rule = HardeningRule.create({ name: 'Response Test' });
      const response = HardeningMapper.toResponse(rule);

      expect(response.rule).toBeDefined();
      expect(response.rule.name).toBe('Response Test');
    });
  });

  describe('toListResponse', () => {
    it('should convert array of rules to list response', () => {
      const rules = [
        HardeningRule.create({ name: 'Rule 1' }),
        HardeningRule.create({ name: 'Rule 2' }),
      ];

      const response = HardeningMapper.toListResponse(rules, 2, 1, 20);

      expect(response.rules).toHaveLength(2);
      expect(response.total).toBe(2);
      expect(response.totalPages).toBe(1);
    });
  });
});

describe('ChecklistMapper', () => {
  describe('toDto', () => {
    it('should convert checklist entity to DTO', () => {
      const checklist = HardeningChecklist.create({
        title: 'Mapper Test',
        status: ChecklistStatus.COMPLETED,
      });

      const dto = ChecklistMapper.toDto(checklist);

      expect(dto.checklistId).toBe(checklist.checklistId.value);
      expect(dto.title).toBe('Mapper Test');
      expect(dto.status).toBe(ChecklistStatus.COMPLETED);
    });
  });
});

describe('SnapshotMapper', () => {
  describe('toDto', () => {
    it('should convert snapshot entity to DTO', () => {
      const snapshot = HardeningSnapshot.create({
        systemVersion: '2.0.0',
        moduleCount: 15,
        healthStatus: 'healthy',
      });

      const dto = SnapshotMapper.toDto(snapshot);

      expect(dto.snapshotId).toBe(snapshot.snapshotId.value);
      expect(dto.systemVersion).toBe('2.0.0');
      expect(dto.moduleCount).toBe(15);
    });
  });
});

// =========================================================================
// SERVICE TESTS
// =========================================================================

describe('HardeningService', () => {
  let mockRepository: MockHardeningRepository;
  let service: HardeningService;

  beforeEach(() => {
    mockRepository = new MockHardeningRepository();
    service = new HardeningService(mockRepository, {
      systemVersion: '1.0.0-test',
      gitCommit: 'abc123',
    });
  });

  describe('generateSnapshot', () => {
    it('should generate a snapshot with default health status', async () => {
      const snapshot = await service.generateSnapshot(10);

      expect(snapshot.systemVersion).toBe('1.0.0-test');
      expect(snapshot.moduleCount).toBe(10);
      expect(snapshot.healthStatus).toBe('healthy');
    });

    it('should generate a snapshot with custom health status', async () => {
      const snapshot = await service.generateSnapshot(5, 'degraded');

      expect(snapshot.healthStatus).toBe('degraded');
    });

    it('should generate a snapshot with custom metadata', async () => {
      const snapshot = await service.generateSnapshot(5, 'healthy', { customKey: 'customValue' });

      expect(snapshot.metadata.customKey).toBe('customValue');
    });
  });

  describe('validateRule', () => {
    it('should validate a valid rule', async () => {
      const rule = HardeningRule.create({
        name: 'Valid Rule',
        status: HardeningStatus.ACTIVE,
      });

      const check = await service.validateRule(rule);

      expect(check.passed).toBe(true);
      expect(check.name).toContain('Valid Rule');
    });

    it('should fail validation for rule with empty name', async () => {
      const rule = HardeningRule.create({
        name: '',
      });

      const check = await service.validateRule(rule);

      expect(check.passed).toBe(false);
      expect(check.message).toContain('name');
    });

    it('should fail validation for critical rule in pending status', async () => {
      const rule = HardeningRule.create({
        name: 'Critical Rule',
        priority: RulePriority.CRITICAL,
        status: HardeningStatus.PENDING,
      });

      const check = await service.validateRule(rule);

      expect(check.passed).toBe(false);
      expect(check.details?.isBlocking).toBe(true);
    });
  });

  describe('validateAllRules', () => {
    it('should validate all rules when none exist', async () => {
      const result = await service.validateAllRules();

      expect(result.passedCount).toBe(0);
      expect(result.failedCount).toBe(0);
    });

    it('should validate all rules including passes and failures', async () => {
      await mockRepository.createRule(HardeningRule.create({ name: 'Valid Rule', status: HardeningStatus.ACTIVE }));
      await mockRepository.createRule(HardeningRule.create({ name: '', status: HardeningStatus.PENDING }));

      const result = await service.validateAllRules();

      expect(result.passedCount).toBe(1);
      expect(result.failedCount).toBe(1);
    });
  });

  describe('validateSystem', () => {
    it('should return healthy when repository is accessible', async () => {
      await mockRepository.createRule(HardeningRule.create({ name: 'Test Rule' }));

      const result = await service.validateSystem();

      expect(result.overallHealth).toBe('healthy');
      expect(result.isHealthy).toBe(true);
    });

    it('should return degraded when there are warnings', async () => {
      await mockRepository.createChecklist(
        HardeningChecklist.create({ title: '' })
      );

      const result = await service.validateSystem();

      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('generateReport', () => {
    it('should generate a complete hardening report', async () => {
      await mockRepository.createRule(
        HardeningRule.create({ name: 'Test Rule', status: HardeningStatus.ACTIVE })
      );
      await mockRepository.createSnapshot(
        HardeningSnapshot.create({
          systemVersion: '1.0.0',
          moduleCount: 5,
          healthStatus: 'healthy',
        })
      );

      const report = await service.generateReport();

      expect(report.systemVersion).toBe('1.0.0-test');
      expect(report.generatedAt).toBeInstanceOf(Date);
      expect(report.statistics.totalRules).toBe(1);
      expect(report.validationResult).toBeDefined();
      expect(report.recommendations).toBeDefined();
    });
  });

  describe('checkConfiguration', () => {
    it('should check for required environment variables', async () => {
      const result = await service.checkConfiguration();

      // In test environment, env vars are set via setup.ts
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('missingKeys');
      expect(result).toHaveProperty('invalidValues');
    });
  });
});

// =========================================================================
// SETUP FUNCTION TESTS
// =========================================================================

describe('setupHardeningDomain', () => {
  it('should set up all hardening domain components', () => {
    const result = setupHardeningDomain({ systemVersion: '1.0.0' });

    expect(result.hardeningRepository).toBeDefined();
    expect(result.hardeningService).toBeDefined();
    expect(result.ruleValidator).toBeDefined();
    expect(result.checklistValidator).toBeDefined();
    expect(result.snapshotValidator).toBeDefined();
    expect(result.hardeningMapper).toBeDefined();
    expect(result.checklistMapper).toBeDefined();
    expect(result.snapshotMapper).toBeDefined();
  });

  it('should use default system version when not provided', () => {
    const result = setupHardeningDomain();

    expect(result.hardeningService).toBeDefined();
  });
});
