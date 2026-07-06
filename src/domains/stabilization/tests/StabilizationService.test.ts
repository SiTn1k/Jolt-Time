/**
 * Stabilization Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StabilizationService } from '../services/StabilizationService';
import type { IStabilizationRepository } from '../interfaces/IStabilizationRepository';
import { StabilizationIssue } from '../entities/StabilizationIssue';
import { StabilizationReport } from '../entities/StabilizationReport';
import { HealthSnapshot } from '../entities/HealthSnapshot';
import { IssueId } from '../value-objects/IssueId';
import { ReportId } from '../value-objects/ReportId';
import { HealthSnapshotId } from '../value-objects/HealthSnapshotId';
import { IssueSeverity } from '../types/IssueSeverity';
import { IssueStatus } from '../types/IssueStatus';
import { HealthStatus } from '../types/HealthStatus';

// Mock logger
vi.mock('../../../core/logging/logger.service', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('StabilizationService', () => {
  let mockRepository: IStabilizationRepository;
  let service: StabilizationService;

  beforeEach(() => {
    mockRepository = {
      storeIssue: vi.fn(),
      findIssueById: vi.fn(),
      listIssues: vi.fn(),
      updateIssue: vi.fn(),
      countIssues: vi.fn(),
      storeReport: vi.fn(),
      findReportById: vi.fn(),
      listReports: vi.fn(),
      countReports: vi.fn(),
      storeSnapshot: vi.fn(),
      findSnapshotById: vi.fn(),
      listSnapshots: vi.fn(),
      findLatestSnapshot: vi.fn(),
      countSnapshots: vi.fn(),
    };
    service = new StabilizationService(mockRepository);
  });

  describe('Issue Operations', () => {
    it('should create an issue', async () => {
      const issue = StabilizationIssue.create({
        module: 'test-module',
        severity: IssueSeverity.HIGH,
        description: 'Test issue description',
        status: IssueStatus.DETECTED,
      });

      vi.mocked(mockRepository.storeIssue).mockResolvedValue(issue);

      const result = await service.createIssue({
        module: 'test-module',
        severity: IssueSeverity.HIGH,
        description: 'Test issue description',
        status: IssueStatus.DETECTED,
      });

      expect(result.module).toBe('test-module');
      expect(result.severity).toBe(IssueSeverity.HIGH);
      expect(mockRepository.storeIssue).toHaveBeenCalled();
    });

    it('should find an issue by id', async () => {
      const issue = StabilizationIssue.create({
        module: 'test-module',
        severity: IssueSeverity.HIGH,
        description: 'Test issue description',
      });

      vi.mocked(mockRepository.findIssueById).mockResolvedValue(issue);

      const result = await service.findIssue(issue.issueId.value);

      expect(result).toBeDefined();
      expect(result?.module).toBe('test-module');
    });

    it('should return null for non-existent issue', async () => {
      vi.mocked(mockRepository.findIssueById).mockResolvedValue(null);

      const result = await service.findIssue('non-existent-id');

      expect(result).toBeNull();
    });

    it('should list issues with pagination', async () => {
      const issues = [
        StabilizationIssue.create({
          module: 'module-1',
          severity: IssueSeverity.HIGH,
          description: 'Issue 1',
        }),
        StabilizationIssue.create({
          module: 'module-2',
          severity: IssueSeverity.LOW,
          description: 'Issue 2',
        }),
      ];

      vi.mocked(mockRepository.listIssues).mockResolvedValue({
        items: issues,
        total: 2,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const result = await service.listIssues({ page: 1, pageSize: 20 });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should count issues', async () => {
      vi.mocked(mockRepository.countIssues).mockResolvedValue(5);

      const result = await service.countIssues();

      expect(result).toBe(5);
    });

    it('should count issues with filters', async () => {
      vi.mocked(mockRepository.countIssues).mockResolvedValue(2);

      const result = await service.countIssues({ status: IssueStatus.DETECTED });

      expect(result).toBe(2);
      expect(mockRepository.countIssues).toHaveBeenCalledWith({ status: IssueStatus.DETECTED });
    });
  });

  describe('Report Operations', () => {
    it('should create a report', async () => {
      const report = StabilizationReport.create({
        healthyModules: ['module-1', 'module-2'],
        warningModules: ['module-3'],
        failedModules: [],
      });

      vi.mocked(mockRepository.storeReport).mockResolvedValue(report);

      const result = await service.createReport({
        healthyModules: ['module-1', 'module-2'],
        warningModules: ['module-3'],
        failedModules: [],
      });

      expect(result.healthyModules).toHaveLength(2);
      expect(result.warningModules).toHaveLength(1);
      expect(mockRepository.storeReport).toHaveBeenCalled();
    });

    it('should find a report by id', async () => {
      const report = StabilizationReport.create({
        healthyModules: ['module-1'],
        warningModules: [],
        failedModules: [],
      });

      vi.mocked(mockRepository.findReportById).mockResolvedValue(report);

      const result = await service.findReport(report.reportId.value);

      expect(result).toBeDefined();
      expect(result?.healthyModules).toHaveLength(1);
    });

    it('should list reports with pagination', async () => {
      const reports = [
        StabilizationReport.create({
          healthyModules: ['module-1'],
          warningModules: [],
          failedModules: [],
        }),
      ];

      vi.mocked(mockRepository.listReports).mockResolvedValue({
        items: reports,
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const result = await service.listReports({ page: 1, pageSize: 20 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('Health Snapshot Operations', () => {
    it('should create a health snapshot', async () => {
      const snapshot = HealthSnapshot.create({
        memory: HealthStatus.HEALTHY,
        cpu: HealthStatus.HEALTHY,
        database: HealthStatus.HEALTHY,
        cache: HealthStatus.HEALTHY,
        api: HealthStatus.HEALTHY,
      });

      vi.mocked(mockRepository.storeSnapshot).mockResolvedValue(snapshot);

      const result = await service.createSnapshot({
        memory: HealthStatus.HEALTHY,
        cpu: HealthStatus.HEALTHY,
        database: HealthStatus.HEALTHY,
        cache: HealthStatus.HEALTHY,
        api: HealthStatus.HEALTHY,
        overall: HealthStatus.HEALTHY,
      });

      expect(result.memory).toBe(HealthStatus.HEALTHY);
      expect(mockRepository.storeSnapshot).toHaveBeenCalled();
    });

    it('should find a snapshot by id', async () => {
      const snapshot = HealthSnapshot.create({
        memory: HealthStatus.HEALTHY,
        cpu: HealthStatus.HEALTHY,
        database: HealthStatus.HEALTHY,
        cache: HealthStatus.HEALTHY,
        api: HealthStatus.HEALTHY,
      });

      vi.mocked(mockRepository.findSnapshotById).mockResolvedValue(snapshot);

      const result = await service.findSnapshot(snapshot.snapshotId.value);

      expect(result).toBeDefined();
      expect(result?.memory).toBe(HealthStatus.HEALTHY);
    });

    it('should find latest snapshot', async () => {
      const snapshot = HealthSnapshot.create({
        memory: HealthStatus.HEALTHY,
        cpu: HealthStatus.HEALTHY,
        database: HealthStatus.HEALTHY,
        cache: HealthStatus.HEALTHY,
        api: HealthStatus.HEALTHY,
      });

      vi.mocked(mockRepository.findLatestSnapshot).mockResolvedValue(snapshot);

      const result = await service.findLatestSnapshot();

      expect(result).toBeDefined();
      expect(result?.snapshotId.value).toBe(snapshot.snapshotId.value);
    });

    it('should return null when no latest snapshot exists', async () => {
      vi.mocked(mockRepository.findLatestSnapshot).mockResolvedValue(null);

      const result = await service.findLatestSnapshot();

      expect(result).toBeNull();
    });
  });

  describe('Summary Operations', () => {
    it('should get stabilization summary', async () => {
      vi.mocked(mockRepository.countIssues).mockResolvedValue(10);
      vi.mocked(mockRepository.countReports).mockResolvedValue(5);
      vi.mocked(mockRepository.findLatestSnapshot).mockResolvedValue(null);

      const result = await service.getStabilizationSummary();

      expect(result.totalIssues).toBe(10);
      expect(result.totalReports).toBe(5);
      expect(result.healthPercentage).toBe(100);
    });

    it('should calculate health percentage from latest snapshot', async () => {
      const snapshot = HealthSnapshot.create({
        memory: HealthStatus.HEALTHY,
        cpu: HealthStatus.HEALTHY,
        database: HealthStatus.WARNING,
        cache: HealthStatus.HEALTHY,
        api: HealthStatus.HEALTHY,
      });

      vi.mocked(mockRepository.countIssues).mockResolvedValue(5);
      vi.mocked(mockRepository.countReports).mockResolvedValue(2);
      vi.mocked(mockRepository.findLatestSnapshot).mockResolvedValue(snapshot);

      const result = await service.getStabilizationSummary();

      expect(result.totalIssues).toBe(5);
      expect(result.healthPercentage).toBe(80); // 4 out of 5 healthy
    });
  });

  describe('Configuration', () => {
    it('should check if auto snapshot is enabled by default', () => {
      expect(service.isAutoSnapshotEnabled()).toBe(true);
    });

    it('should allow disabling auto snapshot', () => {
      const serviceWithConfig = new StabilizationService(mockRepository, {
        autoSnapshotEnabled: false,
      });
      expect(serviceWithConfig.isAutoSnapshotEnabled()).toBe(false);
    });
  });
});
