/**
 * Optimization Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OptimizationService } from '../services/OptimizationService';
import type { IOptimizationRepository } from '../interfaces/IOptimizationRepository';
import { PerformanceProfile } from '../entities/PerformanceProfile';
import { OptimizationRule } from '../entities/OptimizationRule';
import { PerformanceSnapshot } from '../entities/PerformanceSnapshot';
import { ProfileId } from '../value-objects/ProfileId';
import { RuleId } from '../value-objects/RuleId';
import { SnapshotId } from '../value-objects/SnapshotId';
import { ProfileType } from '../types/ProfileType';

// Mock logger
vi.mock('../../../core/logging/logger.service', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('OptimizationService', () => {
  let mockRepository: IOptimizationRepository;
  let service: OptimizationService;

  beforeEach(() => {
    mockRepository = {
      createProfile: vi.fn(),
      findProfileById: vi.fn(),
      updateProfile: vi.fn(),
      deleteProfile: vi.fn(),
      listProfiles: vi.fn(),
      countProfiles: vi.fn(),
      createRule: vi.fn(),
      findRuleById: vi.fn(),
      updateRule: vi.fn(),
      deleteRule: vi.fn(),
      listRules: vi.fn(),
      countRules: vi.fn(),
      listEnabledRules: vi.fn(),
      createSnapshot: vi.fn(),
      findSnapshotById: vi.fn(),
      listSnapshots: vi.fn(),
      countSnapshots: vi.fn(),
      deleteSnapshotsBefore: vi.fn(),
    };
    service = new OptimizationService(mockRepository);
  });

  describe('Profile Operations', () => {
    it('should create a profile', async () => {
      const profile = PerformanceProfile.create({
        profileId: ProfileId.generate(),
        moduleName: 'test-module',
        averageExecutionTime: 100,
        peakExecutionTime: 200,
        memoryUsage: 1024,
        cpuUsage: 50,
        profileType: ProfileType.MODULE,
      });

      vi.mocked(mockRepository.createProfile).mockResolvedValue(profile);

      const result = await service.createProfile({
        moduleName: 'test-module',
        averageExecutionTime: 100,
        peakExecutionTime: 200,
        memoryUsage: 1024,
        cpuUsage: 50,
        profileType: ProfileType.MODULE,
      });

      expect(result.moduleName).toBe('test-module');
      expect(mockRepository.createProfile).toHaveBeenCalled();
    });

    it('should find a profile by id', async () => {
      const profile = PerformanceProfile.create({
        profileId: ProfileId.generate(),
        moduleName: 'test-module',
        averageExecutionTime: 100,
        peakExecutionTime: 200,
        memoryUsage: 1024,
        cpuUsage: 50,
        profileType: ProfileType.MODULE,
      });

      vi.mocked(mockRepository.findProfileById).mockResolvedValue(profile);

      const result = await service.findProfile(profile.profileId.value);

      expect(result).toBeDefined();
      expect(result?.moduleName).toBe('test-module');
    });

    it('should return null for non-existent profile', async () => {
      vi.mocked(mockRepository.findProfileById).mockResolvedValue(null);

      const result = await service.findProfile('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('Rule Operations', () => {
    it('should register a rule', async () => {
      const rule = OptimizationRule.create({
        ruleId: RuleId.generate(),
        ruleName: 'test-rule',
        enabled: true,
        priority: 50,
        description: 'Test rule description',
      });

      vi.mocked(mockRepository.createRule).mockResolvedValue(rule);

      const result = await service.registerRule({
        ruleName: 'test-rule',
        description: 'Test rule description',
      });

      expect(result.ruleName).toBe('test-rule');
      expect(mockRepository.createRule).toHaveBeenCalled();
    });

    it('should list enabled rules', async () => {
      const rules = [
        OptimizationRule.create({
          ruleId: RuleId.generate(),
          ruleName: 'rule-1',
          enabled: true,
          priority: 100,
          description: 'Rule 1',
        }),
        OptimizationRule.create({
          ruleId: RuleId.generate(),
          ruleName: 'rule-2',
          enabled: true,
          priority: 50,
          description: 'Rule 2',
        }),
      ];

      vi.mocked(mockRepository.listEnabledRules).mockResolvedValue(rules);

      const result = await service.listEnabledRules();

      expect(result).toHaveLength(2);
      expect(result[0].ruleName).toBe('rule-1');
    });
  });

  describe('Snapshot Operations', () => {
    it('should create a snapshot', async () => {
      const snapshot = PerformanceSnapshot.create({
        snapshotId: SnapshotId.generate(),
        executionTime: 150,
        memoryUsage: 2048,
        cacheHitRate: 85,
        databaseQueries: 10,
      });

      vi.mocked(mockRepository.createSnapshot).mockResolvedValue(snapshot);

      const result = await service.createSnapshot({
        executionTime: 150,
        memoryUsage: 2048,
        cacheHitRate: 85,
        databaseQueries: 10,
      });

      expect(result.executionTime).toBe(150);
      expect(mockRepository.createSnapshot).toHaveBeenCalled();
    });

    it('should cleanup old snapshots', async () => {
      vi.mocked(mockRepository.deleteSnapshotsBefore).mockResolvedValue(5);

      const result = await service.cleanupOldSnapshots(new Date('2024-01-01'));

      expect(result).toBe(5);
      expect(mockRepository.deleteSnapshotsBefore).toHaveBeenCalledWith(new Date('2024-01-01'));
    });
  });

  describe('Summary Operations', () => {
    it('should get optimization summary', async () => {
      const profiles = [
        PerformanceProfile.create({
          profileId: ProfileId.generate(),
          moduleName: 'module-1',
          averageExecutionTime: 100,
          peakExecutionTime: 200,
          memoryUsage: 1024,
          cpuUsage: 50,
          profileType: ProfileType.MODULE,
        }),
      ];

      const rules = [
        OptimizationRule.create({
          ruleId: RuleId.generate(),
          ruleName: 'rule-1',
          enabled: true,
          priority: 50,
          description: 'Rule 1',
        }),
      ];

      const snapshots = [
        PerformanceSnapshot.create({
          snapshotId: SnapshotId.generate(),
          executionTime: 150,
          memoryUsage: 2048,
          cacheHitRate: 85,
          databaseQueries: 10,
        }),
      ];

      vi.mocked(mockRepository.listProfiles).mockResolvedValue({
        items: profiles,
        total: 1,
        page: 1,
        pageSize: 1000,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      vi.mocked(mockRepository.listRules).mockResolvedValue({
        items: rules,
        total: 1,
        page: 1,
        pageSize: 1000,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      vi.mocked(mockRepository.listSnapshots).mockResolvedValue({
        items: snapshots,
        total: 1,
        page: 1,
        pageSize: 100,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      vi.mocked(mockRepository.listEnabledRules).mockResolvedValue(rules);

      const result = await service.getOptimizationSummary();

      expect(result.totalProfiles).toBe(1);
      expect(result.totalRules).toBe(1);
      expect(result.totalSnapshots).toBe(1);
      expect(result.enabledRulesCount).toBe(1);
    });

    it('should get performance summary', async () => {
      const profiles = [
        PerformanceProfile.create({
          profileId: ProfileId.generate(),
          moduleName: 'module-1',
          averageExecutionTime: 100,
          peakExecutionTime: 200,
          memoryUsage: 1024,
          cpuUsage: 50,
          profileType: ProfileType.MODULE,
        }),
      ];

      const snapshots = [
        PerformanceSnapshot.create({
          snapshotId: SnapshotId.generate(),
          executionTime: 150,
          memoryUsage: 2048,
          cacheHitRate: 85,
          databaseQueries: 10,
        }),
      ];

      vi.mocked(mockRepository.listProfiles).mockResolvedValue({
        items: profiles,
        total: 1,
        page: 1,
        pageSize: 1000,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      vi.mocked(mockRepository.listRules).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 100,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      vi.mocked(mockRepository.listSnapshots).mockResolvedValue({
        items: snapshots,
        total: 1,
        page: 1,
        pageSize: 100,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const result = await service.getPerformanceSummary();

      expect(result.profilesAnalyzed).toBe(1);
      expect(result.snapshotsAnalyzed).toBe(1);
      expect(result.statistics.sampleCount).toBeGreaterThan(0);
    });
  });

  describe('Profile Summary', () => {
    it('should get profile summary with statistics', async () => {
      const profiles = [
        PerformanceProfile.create({
          profileId: ProfileId.generate(),
          moduleName: 'module-1',
          averageExecutionTime: 100,
          peakExecutionTime: 200,
          memoryUsage: 1024,
          cpuUsage: 50,
          profileType: ProfileType.MODULE,
        }),
        PerformanceProfile.create({
          profileId: ProfileId.generate(),
          moduleName: 'module-2',
          averageExecutionTime: 150,
          peakExecutionTime: 300,
          memoryUsage: 2048,
          cpuUsage: 75,
          profileType: ProfileType.FUNCTION,
        }),
      ];

      vi.mocked(mockRepository.listProfiles).mockResolvedValue({
        items: profiles,
        total: 2,
        page: 1,
        pageSize: 100,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const result = await service.getProfileSummary({ page: 1, pageSize: 100 });

      expect(result.profiles).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.averageExecutionTime).toBe(125);
      expect(result.peakExecutionTime).toBe(300);
      expect(result.profileTypeDistribution).toEqual({
        [ProfileType.MODULE]: 1,
        [ProfileType.FUNCTION]: 1,
      });
    });
  });
});
