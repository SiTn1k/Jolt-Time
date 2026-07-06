/**
 * Production Service Tests
 *
 * Unit tests for ProductionService.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductionService } from '../services/ProductionService';
import { ProductionCertificate } from '../entities/ProductionCertificate';
import { ProductionChecklist } from '../entities/ProductionChecklist';
import { ProductionSnapshot } from '../entities/ProductionSnapshot';
import type { IProductionRepository } from '../interfaces/IProductionRepository';
import type { PaginationParams } from '../../../shared/types/base.types';
import { CertificationStatus } from '../types/CertificationStatus';
import { ChecklistStatus } from '../types/ChecklistStatus';
import { ProductionStatus } from '../types/ProductionStatus';

// Mock repository implementation with proper state management
class MockProductionRepository implements IProductionRepository {
  private certificates: Map<string, ProductionCertificate> = new Map();
  private checklists: Map<string, ProductionChecklist> = new Map();
  private snapshots: Map<string, ProductionSnapshot> = new Map();
  private certificateCount = 0;
  private checklistCount = 0;
  private snapshotCount = 0;

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }

  async createCertificate(certificate: ProductionCertificate): Promise<ProductionCertificate> {
    this.certificateCount++;
    const newCert = ProductionCertificate.create({
      version: certificate.version,
      approvedBy: certificate.approvedBy,
      metadata: certificate.metadata,
      productionStatus: certificate.productionStatus,
      expiresAt: certificate.expiresAt,
    });
    this.certificates.set(newCert.certificateId.value, newCert);
    return newCert;
  }

  async findCertificateById(id): Promise<ProductionCertificate | null> {
    return this.certificates.get(id.value) || null;
  }

  async updateCertificate(certificate: ProductionCertificate): Promise<ProductionCertificate> {
    this.certificates.set(certificate.certificateId.value, certificate);
    return certificate;
  }

  async deleteCertificate(id): Promise<void> {
    this.certificates.delete(id.value);
  }

  async listCertificates(params: PaginationParams, filters?): Promise<any> {
    const items = Array.from(this.certificates.values());
    return { items, total: items.length, page: params.page, pageSize: params.pageSize, totalPages: 1, hasNextPage: false, hasPreviousPage: false };
  }

  async countCertificates(filters?): Promise<number> {
    let items = Array.from(this.certificates.values());
    if (filters?.status) {
      items = items.filter(c => c.status === filters.status);
    }
    return items.length;
  }

  async createChecklist(checklist: ProductionChecklist): Promise<ProductionChecklist> {
    const newChecklist = ProductionChecklist.create({
      title: checklist.title,
      owner: checklist.owner,
      status: checklist.status,
      metadata: checklist.metadata,
    });
    this.checklists.set(newChecklist.checklistId.value, newChecklist);
    return newChecklist;
  }

  async findChecklistById(id): Promise<ProductionChecklist | null> {
    return this.checklists.get(id.value) || null;
  }

  async updateChecklist(checklist: ProductionChecklist): Promise<ProductionChecklist> {
    this.checklists.set(checklist.checklistId.value, checklist);
    return checklist;
  }

  async deleteChecklist(id): Promise<void> {
    this.checklists.delete(id.value);
  }

  async listChecklists(params: PaginationParams, filters?): Promise<any> {
    let items = Array.from(this.checklists.values());
    if (filters?.status) {
      items = items.filter(c => c.status === filters.status);
    }
    return { items, total: items.length, page: params.page, pageSize: params.pageSize, totalPages: 1, hasNextPage: false, hasPreviousPage: false };
  }

  async countChecklists(filters?): Promise<number> {
    let items = Array.from(this.checklists.values());
    if (filters?.status) {
      items = items.filter(c => c.status === filters.status);
    }
    return items.length;
  }

  async createSnapshot(snapshot: ProductionSnapshot): Promise<ProductionSnapshot> {
    const newSnapshot = ProductionSnapshot.create({
      backendVersion: snapshot.backendVersion,
      databaseVersion: snapshot.databaseVersion,
      systemHealth: snapshot.systemHealth,
      metadata: snapshot.metadata,
    });
    this.snapshots.set(newSnapshot.snapshotId.value, newSnapshot);
    return newSnapshot;
  }

  async findSnapshotById(id): Promise<ProductionSnapshot | null> {
    return this.snapshots.get(id.value) || null;
  }

  async listSnapshots(params: PaginationParams): Promise<any> {
    const items = Array.from(this.snapshots.values());
    return { items, total: items.length, page: params.page, pageSize: params.pageSize, totalPages: 1, hasNextPage: false, hasPreviousPage: false };
  }

  async deleteSnapshot(id): Promise<void> {
    this.snapshots.delete(id.value);
  }

  async countSnapshots(): Promise<number> {
    return this.snapshots.size;
  }
}

describe('ProductionService', () => {
  let service: ProductionService;
  let mockRepository: MockProductionRepository;

  beforeEach(() => {
    mockRepository = new MockProductionRepository();
    service = new ProductionService(mockRepository);
  });

  describe('Certificate Operations', () => {
    it('should create a certificate', async () => {
      const certificate = await service.createCertificate({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      });

      expect(certificate.version).toBe('1.0.0');
      expect(certificate.approvedBy).toBe('admin@test.com');
      expect(certificate.status).toBe(CertificationStatus.NOT_CERTIFIED);
    });

    it('should find a certificate by ID', async () => {
      const created = await service.createCertificate({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      });

      const found = await service.findCertificate(created.certificateId.value);
      expect(found).not.toBeNull();
      expect(found?.certificateId.value).toBe(created.certificateId.value);
    });

    it('should return null for non-existent certificate', async () => {
      const found = await service.findCertificate('123e4567-e89b-42d3-a456-426614174999');
      expect(found).toBeNull();
    });

    it('should update a certificate', async () => {
      const created = await service.createCertificate({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      });

      const updated = await service.updateCertificate(created.certificateId.value, {
        version: '1.1.0',
      });

      expect(updated.version).toBe('1.1.0');
      expect(created.version).toBe('1.0.0');
    });

    it('should certify a certificate', async () => {
      const created = await service.createCertificate({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      });

      const certified = await service.certifyCertificate(created.certificateId.value);
      expect(certified.status).toBe(CertificationStatus.CERTIFIED);
    });

    it('should revoke a certificate', async () => {
      const created = await service.createCertificate({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      });

      const revoked = await service.revokeCertificate(created.certificateId.value);
      expect(revoked.status).toBe(CertificationStatus.REVOKED);
    });

    it('should delete a certificate', async () => {
      const created = await service.createCertificate({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      });

      await service.deleteCertificate(created.certificateId.value);
      const found = await service.findCertificate(created.certificateId.value);
      expect(found).toBeNull();
    });

    it('should list certificates', async () => {
      await service.createCertificate({ version: '1.0.0', approvedBy: 'admin@test.com' });
      await service.createCertificate({ version: '2.0.0', approvedBy: 'admin@test.com' });

      const result = await service.listCertificates({ page: 1, pageSize: 10 });
      expect(result.items.length).toBeGreaterThanOrEqual(1);
    });

    it('should count certificates', async () => {
      await service.createCertificate({ version: '1.0.0', approvedBy: 'admin@test.com' });
      await service.createCertificate({ version: '2.0.0', approvedBy: 'admin@test.com' });

      const count = await service.countCertificates();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Checklist Operations', () => {
    it('should create a checklist', async () => {
      const checklist = await service.createChecklist({
        title: 'Deploy to production',
      });

      expect(checklist.title).toBe('Deploy to production');
      expect(checklist.status).toBe(ChecklistStatus.PENDING);
    });

    it('should find a checklist by ID', async () => {
      const created = await service.createChecklist({
        title: 'Test checklist',
      });

      const found = await service.findChecklist(created.checklistId.value);
      expect(found).not.toBeNull();
      expect(found?.title).toBe('Test checklist');
    });

    it('should update a checklist', async () => {
      const created = await service.createChecklist({
        title: 'Original',
      });

      const updated = await service.updateChecklist(created.checklistId.value, {
        title: 'Updated',
        status: ChecklistStatus.IN_PROGRESS,
      });

      expect(updated.title).toBe('Updated');
      expect(updated.status).toBe(ChecklistStatus.IN_PROGRESS);
    });

    it('should complete a checklist', async () => {
      const created = await service.createChecklist({
        title: 'Test checklist',
      });

      const completed = await service.completeChecklist(created.checklistId.value);
      expect(completed.status).toBe(ChecklistStatus.COMPLETED);
      expect(completed.completedAt).toBeInstanceOf(Date);
    });

    it('should delete a checklist', async () => {
      const created = await service.createChecklist({
        title: 'Test checklist',
      });

      await service.deleteChecklist(created.checklistId.value);
      const found = await service.findChecklist(created.checklistId.value);
      expect(found).toBeNull();
    });

    it('should list checklists', async () => {
      await service.createChecklist({ title: 'Checklist 1' });
      await service.createChecklist({ title: 'Checklist 2' });

      const result = await service.listChecklists({ page: 1, pageSize: 10 });
      expect(result.items.length).toBeGreaterThanOrEqual(1);
    });

    it('should count checklists', async () => {
      await service.createChecklist({ title: 'Checklist 1' });
      await service.createChecklist({ title: 'Checklist 2' });

      const count = await service.countChecklists();
      expect(count).toBe(2);
    });
  });

  describe('Snapshot Operations', () => {
    it('should create a snapshot', async () => {
      const snapshot = await service.createSnapshot({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
      });

      expect(snapshot.backendVersion).toBe('1.0.0');
      expect(snapshot.databaseVersion).toBe('1.0.0');
      expect(snapshot.systemHealth.status).toBe('healthy');
    });

    it('should find a snapshot by ID', async () => {
      const created = await service.createSnapshot({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
      });

      const found = await service.findSnapshot(created.snapshotId.value);
      expect(found).not.toBeNull();
      expect(found?.backendVersion).toBe('1.0.0');
    });

    it('should list snapshots', async () => {
      await service.createSnapshot({ backendVersion: '1.0.0', databaseVersion: '1.0.0' });
      await service.createSnapshot({ backendVersion: '2.0.0', databaseVersion: '2.0.0' });

      const result = await service.listSnapshots({ page: 1, pageSize: 10 });
      expect(result.items.length).toBeGreaterThanOrEqual(1);
    });

    it('should delete a snapshot', async () => {
      const created = await service.createSnapshot({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
      });

      await service.deleteSnapshot(created.snapshotId.value);
      const found = await service.findSnapshot(created.snapshotId.value);
      expect(found).toBeNull();
    });

    it('should count snapshots', async () => {
      await service.createSnapshot({ backendVersion: '1.0.0', databaseVersion: '1.0.0' });

      const count = await service.countSnapshots();
      expect(count).toBe(1);
    });
  });

  describe('Validation Operations', () => {
    it('should validate checklists', async () => {
      const checklist = await service.createChecklist({ title: 'Test' });
      await service.completeChecklist(checklist.checklistId.value);

      const result = await service.validateChecklists();
      expect(result.total).toBeGreaterThanOrEqual(1);
    });

    it('should validate certificates', async () => {
      const cert = await service.createCertificate({ version: '1.0.0', approvedBy: 'admin@test.com' });
      await service.certifyCertificate(cert.certificateId.value);

      const result = await service.validateCertificates();
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.active).toBeGreaterThanOrEqual(1);
    });

    it('should calculate readiness', async () => {
      await service.createChecklist({ title: 'Test', status: ChecklistStatus.COMPLETED });
      await service.createCertificate({ version: '1.0.0', approvedBy: 'admin@test.com' });

      const result = await service.calculateReadiness();
      expect(result.readinessPercentage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Summary Operations', () => {
    it('should get production summary', async () => {
      await service.createChecklist({ title: 'Test', status: ChecklistStatus.COMPLETED });
      await service.createCertificate({ version: '1.0.0', approvedBy: 'admin@test.com' });
      await service.createSnapshot({ backendVersion: '1.0.0', databaseVersion: '1.0.0' });

      const summary = await service.getProductionSummary();
      expect(summary.totalChecklists).toBe(1);
      expect(summary.totalCertificates).toBe(1);
      expect(summary.latestSnapshotId).not.toBeNull();
    });

    it('should generate validation report', async () => {
      await service.createChecklist({ title: 'Test', status: ChecklistStatus.COMPLETED });
      await service.createSnapshot({ backendVersion: '1.0.0', databaseVersion: '1.0.0' });

      const report = await service.generateValidationReport({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
      });

      expect(report.backendVersion).toBe('1.0.0');
      expect(report.databaseVersion).toBe('1.0.0');
      expect(report.summary).toBeDefined();
      expect(report.readiness).toBeDefined();
    });

    it('should generate backend summary', async () => {
      await service.createChecklist({ title: 'Test', status: ChecklistStatus.COMPLETED });

      const summary = await service.generateBackendSummary({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123',
        healthyModules: ['core', 'database'],
      });

      expect(summary.backendVersion).toBe('1.0.0');
      expect(summary.gitCommit).toBe('abc123');
      expect(summary.healthyModules).toContain('core');
    });
  });

  describe('Configuration', () => {
    it('should respect autoSnapshotEnabled config', () => {
      const serviceWithSnapshot = new ProductionService(mockRepository, { autoSnapshotEnabled: true });
      const serviceWithoutSnapshot = new ProductionService(mockRepository, { autoSnapshotEnabled: false });

      expect(serviceWithSnapshot.isAutoSnapshotEnabled()).toBe(true);
      expect(serviceWithoutSnapshot.isAutoSnapshotEnabled()).toBe(false);
    });
  });
});
