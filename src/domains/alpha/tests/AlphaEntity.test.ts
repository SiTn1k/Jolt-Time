/**
 * Alpha Entity Tests
 *
 * Tests for AlphaChecklist, AlphaMilestone, and AlphaSnapshot entities.
 */

import { describe, it, expect } from 'vitest';
import { AlphaChecklist } from '../entities/AlphaChecklist';
import { AlphaMilestone } from '../entities/AlphaMilestone';
import { AlphaSnapshot } from '../entities/AlphaSnapshot';
import { ChecklistStatus } from '../types/ChecklistStatus';
import { MilestoneStatus } from '../types/MilestoneStatus';

describe('AlphaChecklist', () => {
  it('should create a checklist with default values', () => {
    const checklist = AlphaChecklist.create({
      title: 'Test Checklist',
    });

    expect(checklist.title).toBe('Test Checklist');
    expect(checklist.status).toBe(ChecklistStatus.PENDING);
    expect(checklist.completedAt).toBeNull();
    expect(checklist.checklistId.value).toBeDefined();
  });

  it('should create a checklist with custom values', () => {
    const checklist = AlphaChecklist.create({
      title: 'Custom Checklist',
      owner: 'test-owner',
      status: ChecklistStatus.IN_PROGRESS,
    });

    expect(checklist.title).toBe('Custom Checklist');
    expect(checklist.owner).toBe('test-owner');
    expect(checklist.status).toBe(ChecklistStatus.IN_PROGRESS);
  });

  it('should mark checklist as completed', () => {
    const checklist = AlphaChecklist.create({
      title: 'Test Checklist',
    });

    const completed = checklist.markCompleted();

    expect(completed.status).toBe(ChecklistStatus.COMPLETED);
    expect(completed.completedAt).toBeDefined();
  });

  it('should copy checklist with new values', () => {
    const checklist = AlphaChecklist.create({
      title: 'Test Checklist',
    });

    const updated = checklist.copyWith({
      title: 'Updated Title',
      status: ChecklistStatus.COMPLETED,
    });

    expect(updated.title).toBe('Updated Title');
    expect(updated.status).toBe(ChecklistStatus.COMPLETED);
    expect(updated.checklistId.value).toBe(checklist.checklistId.value);
  });

  it('should serialize to record', () => {
    const checklist = AlphaChecklist.create({
      title: 'Test Checklist',
      owner: 'owner1',
    });

    const record = checklist.toRecord();

    expect(record.checklistId).toBe(checklist.checklistId.value);
    expect(record.title).toBe('Test Checklist');
    expect(record.owner).toBe('owner1');
  });

  it('should reconstruct from record', () => {
    const original = AlphaChecklist.create({
      title: 'Original',
      owner: 'owner1',
    });

    const record = original.toRecord();
    const reconstructed = AlphaChecklist.fromStorage(record);

    expect(reconstructed.title).toBe(original.title);
    expect(reconstructed.checklistId.value).toBe(original.checklistId.value);
  });

  it('should check isCompleted property', () => {
    const pending = AlphaChecklist.create({ title: 'Pending' });
    const completed = AlphaChecklist.create({
      title: 'Completed',
      status: ChecklistStatus.COMPLETED,
    });

    expect(pending.isCompleted).toBe(false);
    expect(completed.isCompleted).toBe(true);
  });

  it('should check isActive property', () => {
    const pending = AlphaChecklist.create({ title: 'Pending' });
    const completed = AlphaChecklist.create({
      title: 'Completed',
      status: ChecklistStatus.COMPLETED,
    });

    expect(pending.isActive).toBe(true);
    expect(completed.isActive).toBe(false);
  });
});

describe('AlphaMilestone', () => {
  it('should create a milestone with default values', () => {
    const milestone = AlphaMilestone.create({
      title: 'Test Milestone',
    });

    expect(milestone.title).toBe('Test Milestone');
    expect(milestone.status).toBe(MilestoneStatus.PLANNED);
    expect(milestone.milestoneId.value).toBeDefined();
  });

  it('should create a milestone with target date', () => {
    const targetDate = new Date();
    const milestone = AlphaMilestone.create({
      title: 'Dated Milestone',
      targetDate,
    });

    expect(milestone.targetDate).toEqual(targetDate);
  });

  it('should mark milestone as completed', () => {
    const milestone = AlphaMilestone.create({
      title: 'Test Milestone',
    });

    const completed = milestone.markCompleted();

    expect(completed.status).toBe(MilestoneStatus.COMPLETED);
    expect(completed.completedAt).toBeDefined();
  });

  it('should check isOverdue for past target dates', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const overdue = AlphaMilestone.create({
      title: 'Overdue',
      targetDate: pastDate,
      status: MilestoneStatus.IN_PROGRESS,
    });

    expect(overdue.isOverdue).toBe(true);
  });

  it('should not mark completed milestones as overdue', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const completed = AlphaMilestone.create({
      title: 'Completed',
      targetDate: pastDate,
      status: MilestoneStatus.COMPLETED,
    });

    expect(completed.isOverdue).toBe(false);
  });

  it('should serialize to record and reconstruct', () => {
    const milestone = AlphaMilestone.create({
      title: 'Test Milestone',
      status: MilestoneStatus.IN_PROGRESS,
    });

    const record = milestone.toRecord();
    const reconstructed = AlphaMilestone.fromStorage(record);

    expect(reconstructed.title).toBe(milestone.title);
    expect(reconstructed.milestoneId.value).toBe(milestone.milestoneId.value);
  });
});

describe('AlphaSnapshot', () => {
  it('should create a snapshot', () => {
    const snapshot = AlphaSnapshot.create({
      backendVersion: '1.0.0',
      databaseVersion: '1.0.0',
      moduleCount: 25,
    });

    expect(snapshot.backendVersion).toBe('1.0.0');
    expect(snapshot.databaseVersion).toBe('1.0.0');
    expect(snapshot.moduleCount).toBe(25);
    expect(snapshot.snapshotId.value).toBeDefined();
  });

  it('should check environment in metadata', () => {
    const snapshot = AlphaSnapshot.create({
      backendVersion: '1.0.0',
      databaseVersion: '1.0.0',
      moduleCount: 10,
      metadata: { environment: 'production' },
    });

    expect(snapshot.isFromEnvironment('production')).toBe(true);
    expect(snapshot.isFromEnvironment('development')).toBe(false);
  });

  it('should serialize to record and reconstruct', () => {
    const snapshot = AlphaSnapshot.create({
      backendVersion: '2.0.0',
      databaseVersion: '2.0.0',
      moduleCount: 30,
    });

    const record = snapshot.toRecord();
    const reconstructed = AlphaSnapshot.fromStorage(record);

    expect(reconstructed.backendVersion).toBe(snapshot.backendVersion);
    expect(reconstructed.moduleCount).toBe(snapshot.moduleCount);
  });

  it('should create copy with updated values', () => {
    const snapshot = AlphaSnapshot.create({
      backendVersion: '1.0.0',
      databaseVersion: '1.0.0',
      moduleCount: 10,
    });

    const updated = snapshot.copyWith({
      backendVersion: '1.1.0',
      moduleCount: 12,
    });

    expect(updated.backendVersion).toBe('1.1.0');
    expect(updated.moduleCount).toBe(12);
    expect(updated.snapshotId.value).toBe(snapshot.snapshotId.value);
  });
});