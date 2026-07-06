/**
 * Production Entity Tests
 *
 * Unit tests for Production domain entities.
 */

import { describe, it, expect } from 'vitest';
import {
  ProductionCertificate,
  ProductionChecklist,
  ProductionSnapshot,
  CertificateId,
  ChecklistId,
  SnapshotId,
} from '../index';
import { CertificationStatus } from '../types/CertificationStatus';
import { ChecklistStatus } from '../types/ChecklistStatus';
import { ProductionStatus } from '../types/ProductionStatus';

describe('ProductionCertificate', () => {
  describe('create', () => {
    it('should create a new certificate with required fields', () => {
      const certificate = ProductionCertificate.create({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      });

      expect(certificate.version).toBe('1.0.0');
      expect(certificate.approvedBy).toBe('admin@test.com');
      expect(certificate.status).toBe(CertificationStatus.NOT_CERTIFIED);
      expect(certificate.productionStatus).toBe(ProductionStatus.NOT_STARTED);
      expect(certificate.certificateId).toBeInstanceOf(CertificateId);
      expect(certificate.issuedAt).toBeInstanceOf(Date);
    });

    it('should create a certificate with optional metadata', () => {
      const certificate = ProductionCertificate.create({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
        metadata: { issuer: 'system', notes: 'Initial certification' },
        expiresAt: new Date('2027-01-01'),
      });

      expect(certificate.metadata.issuer).toBe('system');
      expect(certificate.expiresAt).toEqual(new Date('2027-01-01'));
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct a certificate from a record', () => {
      const now = new Date().toISOString();
      const record = {
        certificateId: '123e4567-e89b-42d3-a456-426614174000',
        version: '1.0.0',
        status: CertificationStatus.CERTIFIED,
        issuedAt: now,
        approvedBy: 'admin@test.com',
        metadata: {},
        productionStatus: ProductionStatus.IN_PRODUCTION,
        expiresAt: null,
        createdAt: now,
        updatedAt: now,
      };

      const certificate = ProductionCertificate.fromStorage(record);

      expect(certificate.certificateId.value).toBe('123e4567-e89b-42d3-a456-426614174000');
      expect(certificate.version).toBe('1.0.0');
      expect(certificate.status).toBe(CertificationStatus.CERTIFIED);
      expect(certificate.productionStatus).toBe(ProductionStatus.IN_PRODUCTION);
    });
  });

  describe('isValid', () => {
    it('should return true for a certified non-expired certificate', () => {
      const certificate = ProductionCertificate.create({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      }).markCertified();

      expect(certificate.isValid).toBe(true);
    });

    it('should return false for a non-certified certificate', () => {
      const certificate = ProductionCertificate.create({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      });

      expect(certificate.isValid).toBe(false);
    });
  });

  describe('markCertified / markRevoked', () => {
    it('should mark certificate as certified', () => {
      const certificate = ProductionCertificate.create({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      });
      const certified = certificate.markCertified();

      expect(certified.status).toBe(CertificationStatus.CERTIFIED);
      expect(certificate.status).toBe(CertificationStatus.NOT_CERTIFIED);
    });

    it('should mark certificate as revoked', () => {
      const certificate = ProductionCertificate.create({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      }).markCertified();
      const revoked = certificate.markRevoked();

      expect(revoked.status).toBe(CertificationStatus.REVOKED);
    });
  });

  describe('toRecord / toJSON', () => {
    it('should convert to record format', () => {
      const certificate = ProductionCertificate.create({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      });
      const record = certificate.toRecord();

      expect(record.certificateId).toBe(certificate.certificateId.value);
      expect(record.version).toBe('1.0.0');
      expect(record.status).toBe(CertificationStatus.NOT_CERTIFIED);
    });

    it('should convert to JSON format', () => {
      const certificate = ProductionCertificate.create({
        version: '1.0.0',
        approvedBy: 'admin@test.com',
      });
      const json = certificate.toJSON();

      expect(json.certificateId).toBe(certificate.certificateId.value);
      expect(json.version).toBe('1.0.0');
      expect(typeof json.issuedAt).toBe('string');
    });
  });
});

describe('ProductionChecklist', () => {
  describe('create', () => {
    it('should create a new checklist with required fields', () => {
      const checklist = ProductionChecklist.create({
        title: 'Deploy to production',
      });

      expect(checklist.title).toBe('Deploy to production');
      expect(checklist.status).toBe(ChecklistStatus.PENDING);
      expect(checklist.checklistId).toBeInstanceOf(ChecklistId);
      expect(checklist.completedAt).toBeNull();
    });

    it('should create a checklist with metadata', () => {
      const checklist = ProductionChecklist.create({
        title: 'Security audit',
        owner: 'security-team',
        metadata: { category: 'security', priority: 1 },
      });

      expect(checklist.owner).toBe('security-team');
      expect(checklist.metadata.category).toBe('security');
      expect(checklist.metadata.priority).toBe(1);
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct a checklist from a record', () => {
      const now = new Date().toISOString();
      const record = {
        checklistId: '123e4567-e89b-42d3-a456-426614174001',
        title: 'Test checklist',
        status: ChecklistStatus.COMPLETED,
        completedAt: now,
        owner: 'tester',
        metadata: { category: 'testing', priority: 2 },
        createdAt: now,
        updatedAt: now,
      };

      const checklist = ProductionChecklist.fromStorage(record);

      expect(checklist.checklistId.value).toBe('123e4567-e89b-42d3-a456-426614174001');
      expect(checklist.title).toBe('Test checklist');
      expect(checklist.status).toBe(ChecklistStatus.COMPLETED);
      expect(checklist.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('isCompleted / isActive', () => {
    it('should correctly report completion status', () => {
      const pending = ProductionChecklist.create({ title: 'Test' });
      expect(pending.isCompleted).toBe(false);
      expect(pending.isActive).toBe(true);

      const completed = pending.markCompleted();
      expect(completed.isCompleted).toBe(true);
      expect(completed.isActive).toBe(false);
    });
  });

  describe('markCompleted', () => {
    it('should mark checklist as completed with timestamp', () => {
      const checklist = ProductionChecklist.create({ title: 'Test' });
      const completed = checklist.markCompleted();

      expect(completed.status).toBe(ChecklistStatus.COMPLETED);
      expect(completed.completedAt).toBeInstanceOf(Date);
      expect(checklist.completedAt).toBeNull();
    });
  });

  describe('copyWith', () => {
    it('should create a copy with updated fields', () => {
      const checklist = ProductionChecklist.create({ title: 'Original' });
      const updated = checklist.copyWith({
        title: 'Updated',
        status: ChecklistStatus.IN_PROGRESS,
      });

      expect(updated.title).toBe('Updated');
      expect(updated.status).toBe(ChecklistStatus.IN_PROGRESS);
      expect(checklist.title).toBe('Original');
    });
  });
});

describe('ProductionSnapshot', () => {
  describe('create', () => {
    it('should create a new snapshot with required fields', () => {
      const snapshot = ProductionSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
      });

      expect(snapshot.backendVersion).toBe('1.0.0');
      expect(snapshot.databaseVersion).toBe('1.0.0');
      expect(snapshot.snapshotId).toBeInstanceOf(SnapshotId);
      expect(snapshot.createdAt).toBeInstanceOf(Date);
    });

    it('should create a snapshot with system health', () => {
      const snapshot = ProductionSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        systemHealth: {
          status: 'healthy',
          cpuUsage: 45,
          memoryUsage: 60,
        },
      });

      expect(snapshot.systemHealth.status).toBe('healthy');
      expect(snapshot.systemHealth.cpuUsage).toBe(45);
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct a snapshot from a record', () => {
      const now = new Date().toISOString();
      const record = {
        snapshotId: '123e4567-e89b-42d3-a456-426614174002',
        createdAt: now,
        backendVersion: '2.0.0',
        databaseVersion: '2.0.0',
        systemHealth: { status: 'healthy' },
        metadata: { environment: 'production' },
      };

      const snapshot = ProductionSnapshot.fromStorage(record);

      expect(snapshot.snapshotId.value).toBe('123e4567-e89b-42d3-a456-426614174002');
      expect(snapshot.backendVersion).toBe('2.0.0');
      expect(snapshot.databaseVersion).toBe('2.0.0');
    });
  });

  describe('isHealthy / isDegraded', () => {
    it('should correctly report health status', () => {
      const healthy = ProductionSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        systemHealth: { status: 'healthy' },
      });
      expect(healthy.isHealthy).toBe(true);
      expect(healthy.isDegraded).toBe(false);

      const degraded = ProductionSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        systemHealth: { status: 'degraded' },
      });
      expect(degraded.isHealthy).toBe(false);
      expect(degraded.isDegraded).toBe(true);
    });
  });

  describe('isFromEnvironment', () => {
    it('should check environment in metadata', () => {
      const prod = ProductionSnapshot.create({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        metadata: { environment: 'production' },
      });

      expect(prod.isFromEnvironment('production')).toBe(true);
      expect(prod.isFromEnvironment('staging')).toBe(false);
    });
  });
});
