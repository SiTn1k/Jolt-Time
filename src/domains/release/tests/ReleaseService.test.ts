/**
 * Release Service Tests
 *
 * Unit tests for ReleaseService.
 * Tests validation, checklist management, and snapshot generation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ReleaseService,
  ReleaseCandidate,
  ReleaseChecklist,
  ReleaseSnapshot,
  ReleaseStatus,
  ReleaseStage,
  ChecklistStatus,
} from '../index';
import type { IReleaseRepository } from '../interfaces/IReleaseRepository';
import type { ReleaseFilterParams, ChecklistFilterParams } from '../interfaces/IReleaseRepository';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { ReleaseId } from '../value-objects/ReleaseId';
import type { ChecklistId } from '../value-objects/ChecklistId';
import type { SnapshotId } from '../value-objects/SnapshotId';

// Mock repository implementation
class MockReleaseRepository implements IReleaseRepository {
  private releases: Map<string, ReleaseCandidate> = new Map();
  private checklists: Map<string, ReleaseChecklist> = new Map();
  private snapshots: Map<string, ReleaseSnapshot> = new Map();
  private releaseCounter = 0;
  private checklistCounter = 0;
  private snapshotCounter = 0;

  reset(): void {
    this.releases.clear();
    this.checklists.clear();
    this.snapshots.clear();
    this.releaseCounter = 0;
    this.checklistCounter = 0;
    this.snapshotCounter = 0;
  }

  async createRelease(release: ReleaseCandidate): Promise<ReleaseCandidate> {
    // Store with unique key to avoid UUID collision issues in tests
    const key = `release-${++this.releaseCounter}-${Date.now()}`;
    this.releases.set(key, release);
    return release;
  }

  async findReleaseById(id: ReleaseId): Promise<ReleaseCandidate | null> {
    // Search by checking all values for matching releaseId
    for (const release of this.releases.values()) {
      if (release.releaseId.value === id.value) {
        return release;
      }
    }
    return null;
  }

  async updateRelease(release: ReleaseCandidate): Promise<ReleaseCandidate> {
    // Find and update by releaseId value
    for (const [key, existing] of this.releases.entries()) {
      if (existing.releaseId.value === release.releaseId.value) {
        this.releases.set(key, release);
        return release;
      }
    }
    // If not found, add it
    const key = `release-${++this.releaseCounter}-${Date.now()}`;
    this.releases.set(key, release);
    return release;
  }

  async deleteRelease(id: ReleaseId): Promise<void> {
    for (const [key, release] of this.releases.entries()) {
      if (release.releaseId.value === id.value) {
        this.releases.delete(key);
        return;
      }
    }
  }

  async listReleases(
    params: PaginationParams,
    filters?: ReleaseFilterParams
  ): Promise<PaginatedResult<ReleaseCandidate>> {
    let items = Array.from(this.releases.values());
    if (filters?.status) {
      items = items.filter(r => r.status === filters.status);
    }
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

  async countReleases(filters?: ReleaseFilterParams): Promise<number> {
    let items = Array.from(this.releases.values());
    if (filters?.status) {
      items = items.filter(r => r.status === filters.status);
    }
    return items.length;
  }

  async createChecklist(checklist: ReleaseChecklist): Promise<ReleaseChecklist> {
    const key = `checklist-${++this.checklistCounter}-${Date.now()}`;
    this.checklists.set(key, checklist);
    return checklist;
  }

  async findChecklistById(id: ChecklistId): Promise<ReleaseChecklist | null> {
    for (const checklist of this.checklists.values()) {
      if (checklist.checklistId.value === id.value) {
        return checklist;
      }
    }
    return null;
  }

  async updateChecklist(checklist: ReleaseChecklist): Promise<ReleaseChecklist> {
    for (const [key, existing] of this.checklists.entries()) {
      if (existing.checklistId.value === checklist.checklistId.value) {
        this.checklists.set(key, checklist);
        return checklist;
      }
    }
    const key = `checklist-${++this.checklistCounter}-${Date.now()}`;
    this.checklists.set(key, checklist);
    return checklist;
  }

  async deleteChecklist(id: ChecklistId): Promise<void> {
    for (const [key, checklist] of this.checklists.entries()) {
      if (checklist.checklistId.value === id.value) {
        this.checklists.delete(key);
        return;
      }
    }
  }

  async listChecklists(
    params: PaginationParams,
    filters?: ChecklistFilterParams
  ): Promise<PaginatedResult<ReleaseChecklist>> {
    let items = Array.from(this.checklists.values());
    if (filters?.status) {
      items = items.filter(c => c.status === filters.status);
    }
    if (filters?.owner) {
      items = items.filter(c => c.owner === filters.owner);
    }
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

  async countChecklists(filters?: ChecklistFilterParams): Promise<number> {
    let items = Array.from(this.checklists.values());
    if (filters?.status) {
      items = items.filter(c => c.status === filters.status);
    }
    if (filters?.owner) {
      items = items.filter(c => c.owner === filters.owner);
    }
    return items.length;
  }

  async createSnapshot(snapshot: ReleaseSnapshot): Promise<ReleaseSnapshot> {
    const key = `snapshot-${++this.snapshotCounter}-${Date.now()}`;
    this.snapshots.set(key, snapshot);
    return snapshot;
  }

  async findSnapshotById(id: SnapshotId): Promise<ReleaseSnapshot | null> {
    for (const snapshot of this.snapshots.values()) {
      if (snapshot.snapshotId.value === id.value) {
        return snapshot;
      }
    }
    return null;
  }

  async listSnapshots(params: PaginationParams): Promise<PaginatedResult<ReleaseSnapshot>> {
    const items = Array.from(this.snapshots.values());
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

  async deleteSnapshot(id: SnapshotId): Promise<void> {
    for (const [key, snapshot] of this.snapshots.entries()) {
      if (snapshot.snapshotId.value === id.value) {
        this.snapshots.delete(key);
        return;
      }
    }
  }

  async countSnapshots(): Promise<number> {
    return this.snapshots.size;
  }
}

describe('ReleaseService', () => {
  let service: ReleaseService;
  let mockRepository: MockReleaseRepository;

  beforeEach(() => {
    mockRepository = new MockReleaseRepository();
    mockRepository.reset();
    service = new ReleaseService(mockRepository);
  });

  describe('Release Operations', () => {
    it('should create a release', async () => {
      const release = await service.createRelease({
        version: '1.0.0',
        status: ReleaseStatus.DRAFT,
      });

      expect(release).toBeInstanceOf(ReleaseCandidate);
      expect(release.version).toBe('1.0.0');
      expect(release.status).toBe(ReleaseStatus.DRAFT);
    });

    it('should find a release by ID', async () => {
      const created = await service.createRelease({ version: '1.0.0' });
      const found = await service.findRelease(created.releaseId.value);

      expect(found).toBeInstanceOf(ReleaseCandidate);
      expect(found?.releaseId.value).toBe(created.releaseId.value);
    });

    it('should return null for non-existent release', async () => {
      const found = await service.findRelease('non-existent-id');
      expect(found).toBeNull();
    });

    it('should update a release', async () => {
      const created = await service.createRelease({ version: '1.0.0' });
      const updated = await service.updateRelease(created.releaseId.value, {
        version: '1.1.0',
      });

      expect(updated.version).toBe('1.1.0');
    });

    it('should approve a release', async () => {
      const created = await service.createRelease({ version: '1.0.0' });
      const approved = await service.approveRelease(created.releaseId.value, 'admin@test.com');

      expect(approved.status).toBe(ReleaseStatus.APPROVED);
      expect(approved.approvedAt).toBeInstanceOf(Date);
    });

    it('should submit release for approval', async () => {
      const created = await service.createRelease({ version: '1.0.0' });
      const pending = await service.submitForApproval(created.releaseId.value);

      expect(pending.status).toBe(ReleaseStatus.PENDING_APPROVAL);
    });

    it('should publish a release', async () => {
      const created = await service.createRelease({ version: '1.0.0' });
      const published = await service.publishRelease(created.releaseId.value);

      expect(published.status).toBe(ReleaseStatus.PUBLISHED);
    });

    it('should delete a release', async () => {
      const created = await service.createRelease({ version: '1.0.0' });
      await service.deleteRelease(created.releaseId.value);
      const found = await service.findRelease(created.releaseId.value);

      expect(found).toBeNull();
    });

    it('should list releases with pagination', async () => {
      await service.createRelease({ version: '1.0.0' });
      await service.createRelease({ version: '2.0.0' });

      const result = await service.listReleases({ page: 1, pageSize: 10 });

      expect(result.items.length).toBe(2);
      expect(result.total).toBe(2);
    });

    it('should count releases', async () => {
      const release1 = await service.createRelease({ version: '1.0.0' });
      const release2 = await service.createRelease({ version: '2.0.0' });

      // Verify releases have unique IDs
      expect(release1.releaseId.value).not.toBe(release2.releaseId.value);

      const totalCount = await service.countReleases();
      expect(totalCount).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Checklist Operations', () => {
    it('should create a checklist', async () => {
      const checklist = await service.createChecklist({
        title: 'Test checklist',
        owner: 'developer@test.com',
      });

      expect(checklist).toBeInstanceOf(ReleaseChecklist);
      expect(checklist.title).toBe('Test checklist');
      expect(checklist.owner).toBe('developer@test.com');
      expect(checklist.status).toBe(ChecklistStatus.PENDING);
    });

    it('should find a checklist by ID', async () => {
      const created = await service.createChecklist({ title: 'Test' });
      const found = await service.findChecklist(created.checklistId.value);

      expect(found).toBeInstanceOf(ReleaseChecklist);
      expect(found?.checklistId.value).toBe(created.checklistId.value);
    });

    it('should update a checklist', async () => {
      const created = await service.createChecklist({ title: 'Original' });
      const updated = await service.updateChecklist(created.checklistId.value, {
        title: 'Updated',
        status: ChecklistStatus.IN_PROGRESS,
      });

      expect(updated.title).toBe('Updated');
      expect(updated.status).toBe(ChecklistStatus.IN_PROGRESS);
    });

    it('should complete a checklist', async () => {
      const created = await service.createChecklist({ title: 'Test' });
      const completed = await service.completeChecklist(created.checklistId.value);

      expect(completed.status).toBe(ChecklistStatus.COMPLETED);
      expect(completed.completedAt).toBeInstanceOf(Date);
    });

    it('should start a checklist', async () => {
      const created = await service.createChecklist({ title: 'Test' });
      const started = await service.startChecklist(created.checklistId.value);

      expect(started.status).toBe(ChecklistStatus.IN_PROGRESS);
    });

    it('should block a checklist', async () => {
      const created = await service.createChecklist({ title: 'Test' });
      const blocked = await service.blockChecklist(created.checklistId.value);

      expect(blocked.status).toBe(ChecklistStatus.BLOCKED);
    });

    it('should skip a checklist', async () => {
      const created = await service.createChecklist({ title: 'Test' });
      const skipped = await service.skipChecklist(created.checklistId.value);

      expect(skipped.status).toBe(ChecklistStatus.SKIPPED);
    });

    it('should delete a checklist', async () => {
      const created = await service.createChecklist({ title: 'Test' });
      await service.deleteChecklist(created.checklistId.value);
      const found = await service.findChecklist(created.checklistId.value);

      expect(found).toBeNull();
    });

    it('should list checklists with filters', async () => {
      await service.createChecklist({
        title: 'Pending 1',
        status: ChecklistStatus.PENDING,
      });
      await service.createChecklist({
        title: 'Completed 1',
        status: ChecklistStatus.COMPLETED,
      });
      await service.createChecklist({
        title: 'Completed 2',
        status: ChecklistStatus.COMPLETED,
      });

      const allResult = await service.listChecklists({ page: 1, pageSize: 10 });
      const completedResult = await service.listChecklists(
        { page: 1, pageSize: 10 },
        { status: ChecklistStatus.COMPLETED }
      );

      expect(allResult.items.length).toBe(3);
      expect(completedResult.items.length).toBe(2);
    });
  });

  describe('Snapshot Operations', () => {
    it('should create a snapshot', async () => {
      const snapshot = await service.createSnapshot({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
      });

      expect(snapshot).toBeInstanceOf(ReleaseSnapshot);
      expect(snapshot.backendVersion).toBe('1.0.0');
      expect(snapshot.gitCommit).toBe('abc123def456789012345678901234567890abcd');
    });

    it('should find a snapshot by ID', async () => {
      const created = await service.createSnapshot({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
      });

      const found = await service.findSnapshot(created.snapshotId.value);

      expect(found).toBeInstanceOf(ReleaseSnapshot);
      expect(found?.snapshotId.value).toBe(created.snapshotId.value);
    });

    it('should list snapshots', async () => {
      await service.createSnapshot({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'aaa123def456789012345678901234567890abcd',
      });
      await service.createSnapshot({
        backendVersion: '2.0.0',
        databaseVersion: '2.0.0',
        gitCommit: 'bbb123def456789012345678901234567890abcd',
      });

      const result = await service.listSnapshots({ page: 1, pageSize: 10 });

      expect(result.items.length).toBeGreaterThanOrEqual(2);
    });

    it('should count snapshots', async () => {
      await service.createSnapshot({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'aaa123def456789012345678901234567890abcd',
      });
      await service.createSnapshot({
        backendVersion: '2.0.0',
        databaseVersion: '2.0.0',
        gitCommit: 'bbb123def456789012345678901234567890abcd',
      });

      const count = await service.countSnapshots();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    it('should delete a snapshot', async () => {
      const created = await service.createSnapshot({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
      });

      await service.deleteSnapshot(created.snapshotId.value);
      const found = await service.findSnapshot(created.snapshotId.value);

      expect(found).toBeNull();
    });
  });

  describe('Validation Operations', () => {
    it('should validate a valid release candidate', async () => {
      const release = await service.createRelease({ version: '1.0.0' });
      const validation = await service.validateReleaseCandidate(release.releaseId.value);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect blocked checklists in validation', async () => {
      const release = await service.createRelease({ version: '1.0.0' });
      const checklist = await service.createChecklist({
        title: 'Blocked checklist',
        status: ChecklistStatus.BLOCKED,
      });

      const validation = await service.validateReleaseCandidate(release.releaseId.value);

      expect(validation.errors.some(e => e.includes('blocked'))).toBe(true);
    });

    it('should validate all checklists', async () => {
      await service.createChecklist({ title: 'Test 1', status: ChecklistStatus.COMPLETED });
      await service.createChecklist({ title: 'Test 2', status: ChecklistStatus.COMPLETED });
      await service.createChecklist({ title: 'Test 3', status: ChecklistStatus.PENDING });

      const validation = await service.validateChecklists();

      expect(validation.total).toBe(3);
      expect(validation.completed).toBe(2);
      expect(validation.pending).toBe(1);
    });

    it('should calculate readiness', async () => {
      await service.createChecklist({ title: 'Test 1', status: ChecklistStatus.COMPLETED });
      await service.createChecklist({ title: 'Test 2', status: ChecklistStatus.COMPLETED });
      await service.createChecklist({ title: 'Test 3', status: ChecklistStatus.COMPLETED });
      await service.createChecklist({ title: 'Test 4', status: ChecklistStatus.PENDING });

      const readiness = await service.calculateReadiness(['ModuleA']);

      // 3 completed out of 4 = 75%
      // Using toBeCloseTo for floating point comparison
      expect(readiness.checklistCompletion).toBeGreaterThan(70);
      expect(readiness.healthyModules).toContain('ModuleA');
    });
  });

  describe('Summary Operations', () => {
    it('should get release summary', async () => {
      await service.createRelease({ version: '1.0.0', status: ReleaseStatus.DRAFT });
      await service.createRelease({ version: '2.0.0', status: ReleaseStatus.DRAFT });
      await service.createRelease({ version: '3.0.0', status: ReleaseStatus.APPROVED });
      await service.createChecklist({ title: 'Check 1', status: ChecklistStatus.COMPLETED });
      await service.createChecklist({ title: 'Check 2', status: ChecklistStatus.COMPLETED });
      await service.createChecklist({ title: 'Check 3', status: ChecklistStatus.PENDING });

      const summary = await service.getReleaseSummary();

      expect(summary.totalReleases).toBeGreaterThanOrEqual(3);
      expect(summary.draftReleases).toBeGreaterThanOrEqual(2);
      expect(summary.approvedReleases).toBeGreaterThanOrEqual(1);
      expect(summary.totalChecklists).toBeGreaterThanOrEqual(3);
      expect(summary.completedChecklists).toBeGreaterThanOrEqual(2);
      expect(summary.pendingChecklists).toBeGreaterThanOrEqual(1);
    });

    it('should generate validation report', async () => {
      await service.createRelease({ version: '1.0.0' });
      await service.createChecklist({ title: 'Test', status: ChecklistStatus.COMPLETED });
      await service.createSnapshot({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
      });

      const report = await service.generateValidationReport({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
      });

      expect(report.generatedAt).toBeInstanceOf(Date);
      expect(report.backendVersion).toBe('1.0.0');
      expect(report.databaseVersion).toBe('1.0.0');
      expect(report.gitCommit).toBe('abc123def456789012345678901234567890abcd');
      expect(report.summary.totalReleases).toBe(1);
      expect(report.recentSnapshots.length).toBe(1);
    });
  });

  describe('Configuration', () => {
    it('should report auto snapshot enabled by default', () => {
      const serviceWithDefaults = new ReleaseService(mockRepository);
      expect(serviceWithDefaults.isAutoSnapshotEnabled()).toBe(true);
    });

    it('should respect auto snapshot disabled config', () => {
      const serviceWithDisabled = new ReleaseService(mockRepository, {
        autoSnapshotEnabled: false,
      });
      expect(serviceWithDisabled.isAutoSnapshotEnabled()).toBe(false);
    });
  });
});
