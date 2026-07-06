/**
 * Alpha Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlphaService } from '../services/AlphaService';
import type { IAlphaRepository } from '../interfaces/IAlphaRepository';
import { AlphaChecklist } from '../entities/AlphaChecklist';
import { AlphaMilestone } from '../entities/AlphaMilestone';
import { AlphaSnapshot } from '../entities/AlphaSnapshot';
import { ChecklistId } from '../value-objects/ChecklistId';
import { MilestoneId } from '../value-objects/MilestoneId';
import { SnapshotId } from '../value-objects/SnapshotId';
import { ChecklistStatus } from '../types/ChecklistStatus';
import { MilestoneStatus } from '../types/MilestoneStatus';

// Mock logger
vi.mock('../../../core/logging/logger.service', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('AlphaService', () => {
  let mockRepository: IAlphaRepository;
  let service: AlphaService;

  beforeEach(() => {
    mockRepository = {
      createChecklist: vi.fn(),
      findChecklistById: vi.fn(),
      updateChecklist: vi.fn(),
      deleteChecklist: vi.fn(),
      listChecklists: vi.fn(),
      countChecklists: vi.fn(),
      createMilestone: vi.fn(),
      findMilestoneById: vi.fn(),
      updateMilestone: vi.fn(),
      deleteMilestone: vi.fn(),
      listMilestones: vi.fn(),
      countMilestones: vi.fn(),
      createSnapshot: vi.fn(),
      findSnapshotById: vi.fn(),
      listSnapshots: vi.fn(),
      deleteSnapshot: vi.fn(),
      countSnapshots: vi.fn(),
    };
    service = new AlphaService(mockRepository);
  });

  describe('Checklist Operations', () => {
    it('should create a checklist', async () => {
      const checklist = AlphaChecklist.create({
        title: 'Test Checklist',
        owner: 'test-owner',
        status: ChecklistStatus.PENDING,
      });

      vi.mocked(mockRepository.createChecklist).mockResolvedValue(checklist);

      const result = await service.createChecklist({
        title: 'Test Checklist',
        owner: 'test-owner',
        status: ChecklistStatus.PENDING,
      });

      expect(result.title).toBe('Test Checklist');
      expect(result.owner).toBe('test-owner');
      expect(mockRepository.createChecklist).toHaveBeenCalled();
    });

    it('should find a checklist by id', async () => {
      const checklist = AlphaChecklist.create({
        title: 'Test Checklist',
      });

      vi.mocked(mockRepository.findChecklistById).mockResolvedValue(checklist);

      const result = await service.findChecklist(checklist.checklistId.value);

      expect(result).toBeDefined();
      expect(result?.title).toBe('Test Checklist');
    });

    it('should return null for non-existent checklist', async () => {
      vi.mocked(mockRepository.findChecklistById).mockResolvedValue(null);

      const result = await service.findChecklist('non-existent-id');

      expect(result).toBeNull();
    });

    it('should list checklists with pagination', async () => {
      const checklists = [
        AlphaChecklist.create({ title: 'Checklist 1' }),
        AlphaChecklist.create({ title: 'Checklist 2' }),
      ];

      vi.mocked(mockRepository.listChecklists).mockResolvedValue({
        items: checklists,
        total: 2,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const result = await service.listChecklists({ page: 1, pageSize: 20 });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should count checklists', async () => {
      vi.mocked(mockRepository.countChecklists).mockResolvedValue(5);

      const result = await service.countChecklists();

      expect(result).toBe(5);
    });

    it('should complete a checklist', async () => {
      const checklist = AlphaChecklist.create({
        title: 'Test Checklist',
        status: ChecklistStatus.PENDING,
      });

      const completedChecklist = checklist.markCompleted();

      vi.mocked(mockRepository.findChecklistById).mockResolvedValue(checklist);
      vi.mocked(mockRepository.updateChecklist).mockResolvedValue(completedChecklist);

      const result = await service.completeChecklist(checklist.checklistId.value);

      expect(result.status).toBe(ChecklistStatus.COMPLETED);
      expect(result.completedAt).toBeDefined();
    });

    it('should delete a checklist', async () => {
      const checklist = AlphaChecklist.create({ title: 'Test Checklist' });

      vi.mocked(mockRepository.deleteChecklist).mockResolvedValue();

      await service.deleteChecklist(checklist.checklistId.value);

      expect(mockRepository.deleteChecklist).toHaveBeenCalled();
    });
  });

  describe('Milestone Operations', () => {
    it('should create a milestone', async () => {
      const milestone = AlphaMilestone.create({
        title: 'Test Milestone',
        status: MilestoneStatus.PLANNED,
      });

      vi.mocked(mockRepository.createMilestone).mockResolvedValue(milestone);

      const result = await service.createMilestone({
        title: 'Test Milestone',
        status: MilestoneStatus.PLANNED,
      });

      expect(result.title).toBe('Test Milestone');
      expect(result.status).toBe(MilestoneStatus.PLANNED);
      expect(mockRepository.createMilestone).toHaveBeenCalled();
    });

    it('should find a milestone by id', async () => {
      const milestone = AlphaMilestone.create({
        title: 'Test Milestone',
      });

      vi.mocked(mockRepository.findMilestoneById).mockResolvedValue(milestone);

      const result = await service.findMilestone(milestone.milestoneId.value);

      expect(result).toBeDefined();
      expect(result?.title).toBe('Test Milestone');
    });

    it('should return null for non-existent milestone', async () => {
      vi.mocked(mockRepository.findMilestoneById).mockResolvedValue(null);

      const result = await service.findMilestone('non-existent-id');

      expect(result).toBeNull();
    });

    it('should list milestones with pagination', async () => {
      const milestones = [
        AlphaMilestone.create({ title: 'Milestone 1' }),
        AlphaMilestone.create({ title: 'Milestone 2' }),
      ];

      vi.mocked(mockRepository.listMilestones).mockResolvedValue({
        items: milestones,
        total: 2,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const result = await service.listMilestones({ page: 1, pageSize: 20 });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should count milestones', async () => {
      vi.mocked(mockRepository.countMilestones).mockResolvedValue(3);

      const result = await service.countMilestones();

      expect(result).toBe(3);
    });

    it('should complete a milestone', async () => {
      const milestone = AlphaMilestone.create({
        title: 'Test Milestone',
        status: MilestoneStatus.IN_PROGRESS,
      });

      const completedMilestone = milestone.markCompleted();

      vi.mocked(mockRepository.findMilestoneById).mockResolvedValue(milestone);
      vi.mocked(mockRepository.updateMilestone).mockResolvedValue(completedMilestone);

      const result = await service.completeMilestone(milestone.milestoneId.value);

      expect(result.status).toBe(MilestoneStatus.COMPLETED);
      expect(result.completedAt).toBeDefined();
    });
  });

  describe('Snapshot Operations', () => {
    it('should create a snapshot', async () => {
      const snapshot = AlphaSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        moduleCount: 10,
      });

      vi.mocked(mockRepository.createSnapshot).mockResolvedValue(snapshot);

      const result = await service.createSnapshot({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        moduleCount: 10,
      });

      expect(result.backendVersion).toBe('1.0.0');
      expect(result.moduleCount).toBe(10);
      expect(mockRepository.createSnapshot).toHaveBeenCalled();
    });

    it('should find a snapshot by id', async () => {
      const snapshot = AlphaSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        moduleCount: 10,
      });

      vi.mocked(mockRepository.findSnapshotById).mockResolvedValue(snapshot);

      const result = await service.findSnapshot(snapshot.snapshotId.value);

      expect(result).toBeDefined();
      expect(result?.backendVersion).toBe('1.0.0');
    });

    it('should list snapshots with pagination', async () => {
      const snapshots = [
        AlphaSnapshot.create({
          backendVersion: '1.0.0',
          databaseVersion: '1.0.0',
          moduleCount: 10,
        }),
      ];

      vi.mocked(mockRepository.listSnapshots).mockResolvedValue({
        items: snapshots,
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const result = await service.listSnapshots({ page: 1, pageSize: 20 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should count snapshots', async () => {
      vi.mocked(mockRepository.countSnapshots).mockResolvedValue(2);

      const result = await service.countSnapshots();

      expect(result).toBe(2);
    });
  });

  describe('Validation Operations', () => {
    it('should validate checklists', async () => {
      vi.mocked(mockRepository.countChecklists).mockResolvedValue(10);
      vi.mocked(mockRepository.countChecklists).mockResolvedValueOnce(10);
      vi.mocked(mockRepository.countChecklists).mockResolvedValueOnce(6);
      vi.mocked(mockRepository.countChecklists).mockResolvedValueOnce(3);
      vi.mocked(mockRepository.countChecklists).mockResolvedValueOnce(1);

      const result = await service.validateChecklists();

      expect(result.total).toBe(10);
      expect(result.completed).toBe(6);
      expect(result.pending).toBe(3);
      expect(result.blocked).toBe(1);
      expect(result.issues).toContain('1 checklist(s) are blocked');
    });

    it('should validate milestones', async () => {
      vi.mocked(mockRepository.countMilestones).mockResolvedValue(5);
      vi.mocked(mockRepository.countMilestones).mockResolvedValueOnce(5);
      vi.mocked(mockRepository.countMilestones).mockResolvedValueOnce(2);
      vi.mocked(mockRepository.countMilestones).mockResolvedValueOnce(2);
      vi.mocked(mockRepository.countMilestones).mockResolvedValueOnce(1);

      vi.mocked(mockRepository.listMilestones).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 100,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const result = await service.validateMilestones();

      expect(result.total).toBe(5);
      expect(result.completed).toBe(2);
      expect(result.planned).toBe(2);
      expect(result.delayed).toBe(1);
    });

    it('should calculate readiness', async () => {
      vi.mocked(mockRepository.countChecklists).mockResolvedValue(10);
      vi.mocked(mockRepository.countChecklists).mockResolvedValueOnce(10);
      vi.mocked(mockRepository.countChecklists).mockResolvedValueOnce(8);
      vi.mocked(mockRepository.countChecklists).mockResolvedValueOnce(2);
      vi.mocked(mockRepository.countChecklists).mockResolvedValueOnce(0);

      vi.mocked(mockRepository.countMilestones).mockResolvedValue(5);
      vi.mocked(mockRepository.countMilestones).mockResolvedValueOnce(5);
      vi.mocked(mockRepository.countMilestones).mockResolvedValueOnce(4);
      vi.mocked(mockRepository.countMilestones).mockResolvedValueOnce(1);
      vi.mocked(mockRepository.countMilestones).mockResolvedValueOnce(0);

      vi.mocked(mockRepository.listMilestones).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 100,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const result = await service.calculateReadiness(['module1', 'module2']);

      expect(result.readinessPercentage).toBeGreaterThan(0);
      expect(result.checklistCompletion).toBe(80);
      expect(result.milestoneCompletion).toBe(80);
    });
  });

  describe('Summary Operations', () => {
    it('should get alpha summary', async () => {
      vi.mocked(mockRepository.countChecklists).mockResolvedValue(10);
      vi.mocked(mockRepository.countChecklists).mockResolvedValueOnce(10);
      vi.mocked(mockRepository.countChecklists).mockResolvedValueOnce(6);
      vi.mocked(mockRepository.countChecklists).mockResolvedValueOnce(4);

      vi.mocked(mockRepository.countMilestones).mockResolvedValue(5);
      vi.mocked(mockRepository.countMilestones).mockResolvedValueOnce(5);
      vi.mocked(mockRepository.countMilestones).mockResolvedValueOnce(3);
      vi.mocked(mockRepository.countMilestones).mockResolvedValueOnce(2);

      vi.mocked(mockRepository.listSnapshots).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      vi.mocked(mockRepository.listMilestones).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 100,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const result = await service.getAlphaSummary();

      expect(result.totalChecklists).toBe(10);
      expect(result.completedChecklists).toBe(6);
      expect(result.totalMilestones).toBe(5);
      expect(result.completedMilestones).toBe(3);
    });
  });

  describe('Configuration', () => {
    it('should have auto snapshot enabled by default', () => {
      expect(service.isAutoSnapshotEnabled()).toBe(true);
    });

    it('should allow disabling auto snapshot', () => {
      const serviceWithConfig = new AlphaService(mockRepository, {
        autoSnapshotEnabled: false,
      });

      expect(serviceWithConfig.isAutoSnapshotEnabled()).toBe(false);
    });
  });
});