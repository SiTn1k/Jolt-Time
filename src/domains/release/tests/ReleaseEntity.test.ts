/**
 * Release Entity Tests
 *
 * Unit tests for ReleaseCandidate, ReleaseChecklist, and ReleaseSnapshot entities.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  ReleaseCandidate,
  ReleaseChecklist,
  ReleaseSnapshot,
  ReleaseStatus,
  ReleaseStage,
  ChecklistStatus,
} from '../index';
import { ReleaseId } from '../value-objects/ReleaseId';
import { ChecklistId } from '../value-objects/ChecklistId';
import { SnapshotId } from '../value-objects/SnapshotId';

describe('ReleaseCandidate', () => {
  describe('create', () => {
    it('should create a release candidate with default values', () => {
      const release = ReleaseCandidate.create({ version: '1.0.0' });

      expect(release.version).toBe('1.0.0');
      expect(release.status).toBe(ReleaseStatus.DRAFT);
      expect(release.stage).toBe(ReleaseStage.RELEASE_CANDIDATE);
      expect(release.releaseId).toBeInstanceOf(ReleaseId);
      expect(release.approvedAt).toBeNull();
    });

    it('should create a release candidate with custom values', () => {
      const release = ReleaseCandidate.create({
        version: '2.0.0',
        status: ReleaseStatus.APPROVED,
        stage: ReleaseStage.PRODUCTION,
        metadata: { notes: 'Test release', tags: ['v2'] },
      });

      expect(release.version).toBe('2.0.0');
      expect(release.status).toBe(ReleaseStatus.APPROVED);
      expect(release.stage).toBe(ReleaseStage.PRODUCTION);
      expect(release.metadata.notes).toBe('Test release');
      expect(release.metadata.tags).toEqual(['v2']);
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct a release from storage record', () => {
      const now = new Date();
      const record = {
        releaseId: '550e8400-e29b-41d4-a716-446655440000',
        version: '1.0.0',
        status: ReleaseStatus.DRAFT,
        stage: ReleaseStage.RELEASE_CANDIDATE,
        createdAt: now.toISOString(),
        approvedAt: null,
        metadata: { notes: 'Test' },
        updatedAt: now.toISOString(),
      };

      const release = ReleaseCandidate.fromStorage(record);

      expect(release.releaseId.value).toBe(record.releaseId);
      expect(release.version).toBe(record.version);
      expect(release.status).toBe(record.status);
    });
  });

  describe('status helpers', () => {
    it('should correctly identify draft status', () => {
      const release = ReleaseCandidate.create({ version: '1.0.0', status: ReleaseStatus.DRAFT });
      expect(release.isDraft).toBe(true);
      expect(release.isApproved).toBe(false);
      expect(release.isPendingApproval).toBe(false);
      expect(release.isPublished).toBe(false);
    });

    it('should correctly identify approved status', () => {
      const release = ReleaseCandidate.create({ version: '1.0.0', status: ReleaseStatus.APPROVED });
      expect(release.isDraft).toBe(false);
      expect(release.isApproved).toBe(true);
    });

    it('should correctly identify pending approval status', () => {
      const release = ReleaseCandidate.create({ version: '1.0.0', status: ReleaseStatus.PENDING_APPROVAL });
      expect(release.isPendingApproval).toBe(true);
    });

    it('should correctly identify published status', () => {
      const release = ReleaseCandidate.create({ version: '1.0.0', status: ReleaseStatus.PUBLISHED });
      expect(release.isPublished).toBe(true);
    });

    it('should correctly identify terminal states', () => {
      const published = ReleaseCandidate.create({ version: '1.0.0', status: ReleaseStatus.PUBLISHED });
      expect(published.isTerminal).toBe(true);

      const archived = ReleaseCandidate.create({ version: '1.0.0', status: ReleaseStatus.ARCHIVED });
      expect(archived.isTerminal).toBe(true);

      const draft = ReleaseCandidate.create({ version: '1.0.0', status: ReleaseStatus.DRAFT });
      expect(draft.isTerminal).toBe(false);
    });
  });

  describe('copyWith', () => {
    it('should create a copy with updated fields', () => {
      const original = ReleaseCandidate.create({ version: '1.0.0' });
      const copy = original.copyWith({ version: '1.1.0', status: ReleaseStatus.APPROVED });

      expect(copy.version).toBe('1.1.0');
      expect(copy.status).toBe(ReleaseStatus.APPROVED);
      expect(copy.releaseId.value).toBe(original.releaseId.value);
      expect(copy.createdAt).toEqual(original.createdAt);
    });
  });

  describe('markApproved', () => {
    it('should create a copy marked as approved', () => {
      const original = ReleaseCandidate.create({ version: '1.0.0' });
      const approved = original.markApproved('admin@example.com');

      expect(approved.status).toBe(ReleaseStatus.APPROVED);
      expect(approved.approvedAt).toBeInstanceOf(Date);
      expect(approved.metadata.approvedBy).toBe('admin@example.com');
    });
  });

  describe('markPendingApproval', () => {
    it('should create a copy marked as pending approval', () => {
      const original = ReleaseCandidate.create({ version: '1.0.0' });
      const pending = original.markPendingApproval();

      expect(pending.status).toBe(ReleaseStatus.PENDING_APPROVAL);
    });
  });

  describe('markPublished', () => {
    it('should create a copy marked as published', () => {
      const original = ReleaseCandidate.create({ version: '1.0.0' });
      const published = original.markPublished();

      expect(published.status).toBe(ReleaseStatus.PUBLISHED);
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON format', () => {
      const release = ReleaseCandidate.create({ version: '1.0.0' });
      const json = release.toJSON();

      expect(json.releaseId).toBe(release.releaseId.value);
      expect(json.version).toBe('1.0.0');
      expect(json.status).toBe(ReleaseStatus.DRAFT);
      expect(typeof json.createdAt).toBe('string');
    });
  });

  describe('toRecord', () => {
    it('should convert to database record format', () => {
      const release = ReleaseCandidate.create({ version: '1.0.0' });
      const record = release.toRecord();

      expect(record.releaseId).toBe(release.releaseId.value);
      expect(record.version).toBe('1.0.0');
      expect(record.metadata).toBeDefined();
    });
  });
});

describe('ReleaseChecklist', () => {
  describe('create', () => {
    it('should create a checklist with default values', () => {
      const checklist = ReleaseChecklist.create({ title: 'Test checklist' });

      expect(checklist.title).toBe('Test checklist');
      expect(checklist.status).toBe(ChecklistStatus.PENDING);
      expect(checklist.owner).toBe('');
      expect(checklist.completedAt).toBeNull();
      expect(checklist.checklistId).toBeInstanceOf(ChecklistId);
    });

    it('should create a checklist with custom values', () => {
      const checklist = ReleaseChecklist.create({
        title: 'Custom checklist',
        owner: 'developer@example.com',
        status: ChecklistStatus.IN_PROGRESS,
        metadata: { category: 'testing', priority: 5 },
      });

      expect(checklist.title).toBe('Custom checklist');
      expect(checklist.owner).toBe('developer@example.com');
      expect(checklist.status).toBe(ChecklistStatus.IN_PROGRESS);
      expect(checklist.metadata.category).toBe('testing');
      expect(checklist.metadata.priority).toBe(5);
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct a checklist from storage record', () => {
      const now = new Date();
      const record = {
        checklistId: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Stored checklist',
        status: ChecklistStatus.COMPLETED,
        owner: 'admin',
        completedAt: now.toISOString(),
        metadata: { category: 'docs', priority: 3 },
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      const checklist = ReleaseChecklist.fromStorage(record);

      expect(checklist.checklistId.value).toBe(record.checklistId);
      expect(checklist.title).toBe(record.title);
      expect(checklist.status).toBe(ChecklistStatus.COMPLETED);
      expect(checklist.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('status helpers', () => {
    it('should correctly identify completed status', () => {
      const completed = ReleaseChecklist.create({
        title: 'Test',
        status: ChecklistStatus.COMPLETED,
      });
      expect(completed.isCompleted).toBe(true);
      expect(completed.isActive).toBe(false);
    });

    it('should correctly identify active status', () => {
      const pending = ReleaseChecklist.create({
        title: 'Test',
        status: ChecklistStatus.PENDING,
      });
      expect(pending.isActive).toBe(true);
      expect(pending.isCompleted).toBe(false);

      const inProgress = ReleaseChecklist.create({
        title: 'Test',
        status: ChecklistStatus.IN_PROGRESS,
      });
      expect(inProgress.isActive).toBe(true);
    });
  });

  describe('copyWith', () => {
    it('should create a copy with updated fields', () => {
      const original = ReleaseChecklist.create({ title: 'Original' });
      const copy = original.copyWith({ title: 'Updated', status: ChecklistStatus.IN_PROGRESS });

      expect(copy.title).toBe('Updated');
      expect(copy.status).toBe(ChecklistStatus.IN_PROGRESS);
      expect(copy.checklistId.value).toBe(original.checklistId.value);
    });
  });

  describe('markCompleted', () => {
    it('should create a copy marked as completed', () => {
      const original = ReleaseChecklist.create({ title: 'Test' });
      const completed = original.markCompleted();

      expect(completed.status).toBe(ChecklistStatus.COMPLETED);
      expect(completed.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('markInProgress', () => {
    it('should create a copy marked as in progress', () => {
      const original = ReleaseChecklist.create({ title: 'Test' });
      const inProgress = original.markInProgress();

      expect(inProgress.status).toBe(ChecklistStatus.IN_PROGRESS);
    });
  });

  describe('markBlocked', () => {
    it('should create a copy marked as blocked', () => {
      const original = ReleaseChecklist.create({ title: 'Test' });
      const blocked = original.markBlocked();

      expect(blocked.status).toBe(ChecklistStatus.BLOCKED);
    });
  });

  describe('markSkipped', () => {
    it('should create a copy marked as skipped', () => {
      const original = ReleaseChecklist.create({ title: 'Test' });
      const skipped = original.markSkipped();

      expect(skipped.status).toBe(ChecklistStatus.SKIPPED);
      expect(skipped.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('toJSON and toRecord', () => {
    it('should serialize to JSON format', () => {
      const checklist = ReleaseChecklist.create({ title: 'Test' });
      const json = checklist.toJSON();
      const record = checklist.toRecord();

      expect(json.checklistId).toBe(checklist.checklistId.value);
      expect(record.checklistId).toBe(checklist.checklistId.value);
    });
  });
});

describe('ReleaseSnapshot', () => {
  describe('create', () => {
    it('should create a snapshot with required values', () => {
      const snapshot = ReleaseSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
      });

      expect(snapshot.backendVersion).toBe('1.0.0');
      expect(snapshot.databaseVersion).toBe('1.0.0');
      expect(snapshot.gitCommit).toBe('abc123def456789012345678901234567890abcd');
      expect(snapshot.snapshotId).toBeInstanceOf(SnapshotId);
      expect(snapshot.metadata.environment).toBe('production');
    });

    it('should create a snapshot with custom metadata', () => {
      const snapshot = ReleaseSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
        metadata: {
          environment: 'staging',
          buildId: 'build-123',
          branch: 'main',
          changes: ['feat: new feature'],
          testCoverage: 85,
        },
      });

      expect(snapshot.metadata.environment).toBe('staging');
      expect(snapshot.metadata.buildId).toBe('build-123');
      expect(snapshot.metadata.branch).toBe('main');
      expect(snapshot.metadata.changes).toEqual(['feat: new feature']);
      expect(snapshot.metadata.testCoverage).toBe(85);
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct a snapshot from storage record', () => {
      const now = new Date();
      const record = {
        snapshotId: '550e8400-e29b-41d4-a716-446655440002',
        createdAt: now.toISOString(),
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
        metadata: { environment: 'production' },
      };

      const snapshot = ReleaseSnapshot.fromStorage(record);

      expect(snapshot.snapshotId.value).toBe(record.snapshotId);
      expect(snapshot.backendVersion).toBe(record.backendVersion);
      expect(snapshot.gitCommit).toBe(record.gitCommit);
    });
  });

  describe('shortCommit', () => {
    it('should return first 7 characters of commit hash', () => {
      const snapshot = ReleaseSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
      });

      expect(snapshot.shortCommit).toBe('abc123d');
    });
  });

  describe('matchesCommit', () => {
    it('should match full commit hash', () => {
      const snapshot = ReleaseSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
      });

      expect(snapshot.matchesCommit('abc123def456789012345678901234567890abcd')).toBe(true);
    });

    it('should match short commit hash', () => {
      const snapshot = ReleaseSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
      });

      expect(snapshot.matchesCommit('abc123d')).toBe(true);
      expect(snapshot.matchesCommit('abc123def456789012345678901234567890abcd'.slice(0, 7))).toBe(true);
    });

    it('should not match different commit hash', () => {
      const snapshot = ReleaseSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
      });

      expect(snapshot.matchesCommit('xyz789012345678901234567890123456789abcd')).toBe(false);
    });
  });

  describe('toJSON and toRecord', () => {
    it('should serialize to JSON format', () => {
      const snapshot = ReleaseSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
      });

      const json = snapshot.toJSON();
      const record = snapshot.toRecord();

      expect(json.snapshotId).toBe(snapshot.snapshotId.value);
      expect(json.backendVersion).toBe('1.0.0');
      expect(record.snapshotId).toBe(snapshot.snapshotId.value);
    });
  });
});
