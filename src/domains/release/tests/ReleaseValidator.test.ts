/**
 * Release Validator Tests
 *
 * Unit tests for ReleaseValidator, ChecklistValidator, and SnapshotValidator.
 */

import { describe, it, expect } from 'vitest';
import {
  ReleaseValidator,
  ChecklistValidator,
  SnapshotValidator,
  ReleaseStatus,
  ReleaseStage,
  ChecklistStatus,
} from '../index';

describe('ReleaseValidator', () => {
  describe('isValidReleaseId', () => {
    it('should validate correct UUID format', () => {
      expect(ReleaseValidator.isValidReleaseId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      expect(ReleaseValidator.isValidReleaseId('invalid-uuid')).toBe(false);
      expect(ReleaseValidator.isValidReleaseId('')).toBe(false);
      expect(ReleaseValidator.isValidReleaseId(null)).toBe(false);
      expect(ReleaseValidator.isValidReleaseId(undefined)).toBe(false);
    });
  });

  describe('isValidVersion', () => {
    it('should validate correct semver format', () => {
      expect(ReleaseValidator.isValidVersion('1.0.0')).toBe(true);
      expect(ReleaseValidator.isValidVersion('1.2.3')).toBe(true);
      expect(ReleaseValidator.isValidVersion('0.0.1')).toBe(true);
      expect(ReleaseValidator.isValidVersion('1.0.0-alpha.1')).toBe(true);
      expect(ReleaseValidator.isValidVersion('1.0.0+build.123')).toBe(true);
      expect(ReleaseValidator.isValidVersion('1.0.0-beta.1+build.123')).toBe(true);
    });

    it('should reject invalid semver format', () => {
      expect(ReleaseValidator.isValidVersion('1.0')).toBe(false);
      expect(ReleaseValidator.isValidVersion('1')).toBe(false);
      expect(ReleaseValidator.isValidVersion('invalid')).toBe(false);
      expect(ReleaseValidator.isValidVersion('')).toBe(false);
      expect(ReleaseValidator.isValidVersion(null)).toBe(false);
      expect(ReleaseValidator.isValidVersion(undefined)).toBe(false);
    });
  });

  describe('isValidStatus', () => {
    it('should validate correct statuses', () => {
      expect(ReleaseValidator.isValidStatus(ReleaseStatus.DRAFT)).toBe(true);
      expect(ReleaseValidator.isValidStatus(ReleaseStatus.PENDING_APPROVAL)).toBe(true);
      expect(ReleaseValidator.isValidStatus(ReleaseStatus.APPROVED)).toBe(true);
      expect(ReleaseValidator.isValidStatus(ReleaseStatus.REJECTED)).toBe(true);
      expect(ReleaseValidator.isValidStatus(ReleaseStatus.PUBLISHED)).toBe(true);
      expect(ReleaseValidator.isValidStatus(ReleaseStatus.ARCHIVED)).toBe(true);
    });

    it('should allow null/undefined (optional)', () => {
      expect(ReleaseValidator.isValidStatus(null)).toBe(true);
      expect(ReleaseValidator.isValidStatus(undefined)).toBe(true);
    });
  });

  describe('isValidStage', () => {
    it('should validate correct stages', () => {
      expect(ReleaseValidator.isValidStage(ReleaseStage.SUPPORT)).toBe(true);
      expect(ReleaseValidator.isValidStage(ReleaseStage.INTERNAL_ALPHA)).toBe(true);
      expect(ReleaseValidator.isValidStage(ReleaseStage.CLOSED_ALPHA)).toBe(true);
      expect(ReleaseValidator.isValidStage(ReleaseStage.OPEN_ALPHA)).toBe(true);
      expect(ReleaseValidator.isValidStage(ReleaseStage.RELEASE_CANDIDATE)).toBe(true);
      expect(ReleaseValidator.isValidStage(ReleaseStage.PRODUCTION)).toBe(true);
    });

    it('should allow null/undefined (optional)', () => {
      expect(ReleaseValidator.isValidStage(null)).toBe(true);
      expect(ReleaseValidator.isValidStage(undefined)).toBe(true);
    });
  });

  describe('validate', () => {
    it('should validate complete valid data', () => {
      const result = ReleaseValidator.validate({
        releaseId: '550e8400-e29b-41d4-a716-446655440000',
        version: '1.0.0',
        status: ReleaseStatus.DRAFT,
        stage: ReleaseStage.RELEASE_CANDIDATE,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate with only required fields', () => {
      const result = ReleaseValidator.validate({
        version: '1.0.0',
      });

      expect(result.isValid).toBe(true);
    });

    it('should report errors for invalid data', () => {
      const result = ReleaseValidator.validate({
        releaseId: 'invalid',
        version: 'invalid',
        status: 'invalid' as ReleaseStatus,
        stage: 'invalid' as ReleaseStage,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate with only required fields', () => {
      // Version is required when provided, but not required when omitted
      const result = ReleaseValidator.validate({
        version: '1.0.0',
      });

      expect(result.isValid).toBe(true);
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid data', () => {
      expect(() => {
        ReleaseValidator.validateOrThrow({
          version: '1.0.0',
        });
      }).not.toThrow();
    });

    it('should throw for invalid data', () => {
      expect(() => {
        ReleaseValidator.validateOrThrow({
          version: 'invalid',
        });
      }).toThrow();
    });
  });
});

describe('ChecklistValidator', () => {
  describe('isValidChecklistId', () => {
    it('should validate correct UUID format', () => {
      expect(ChecklistValidator.isValidChecklistId('550e8400-e29b-41d4-a716-446655440001')).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      expect(ChecklistValidator.isValidChecklistId('invalid-uuid')).toBe(false);
      expect(ChecklistValidator.isValidChecklistId('')).toBe(false);
      expect(ChecklistValidator.isValidChecklistId(null)).toBe(false);
    });
  });

  describe('isValidTitle', () => {
    it('should validate correct title', () => {
      expect(ChecklistValidator.isValidTitle('Valid Title')).toBe(true);
      expect(ChecklistValidator.isValidTitle('A')).toBe(true);
    });

    it('should reject invalid title', () => {
      expect(ChecklistValidator.isValidTitle('')).toBe(false);
      expect(ChecklistValidator.isValidTitle(null)).toBe(false);
      expect(ChecklistValidator.isValidTitle(undefined)).toBe(false);
    });

    it('should reject too long title', () => {
      const longTitle = 'a'.repeat(201);
      expect(ChecklistValidator.isValidTitle(longTitle)).toBe(false);
    });
  });

  describe('isValidOwner', () => {
    it('should validate correct owner', () => {
      expect(ChecklistValidator.isValidOwner('developer@example.com')).toBe(true);
      expect(ChecklistValidator.isValidOwner('A')).toBe(true);
    });

    it('should allow empty owner (optional)', () => {
      expect(ChecklistValidator.isValidOwner('')).toBe(true);
      expect(ChecklistValidator.isValidOwner(null)).toBe(true);
      expect(ChecklistValidator.isValidOwner(undefined)).toBe(true);
    });

    it('should reject too long owner', () => {
      const longOwner = 'a'.repeat(101);
      expect(ChecklistValidator.isValidOwner(longOwner)).toBe(false);
    });
  });

  describe('isValidStatus', () => {
    it('should validate correct statuses', () => {
      expect(ChecklistValidator.isValidStatus(ChecklistStatus.PENDING)).toBe(true);
      expect(ChecklistValidator.isValidStatus(ChecklistStatus.IN_PROGRESS)).toBe(true);
      expect(ChecklistValidator.isValidStatus(ChecklistStatus.COMPLETED)).toBe(true);
      expect(ChecklistValidator.isValidStatus(ChecklistStatus.BLOCKED)).toBe(true);
      expect(ChecklistValidator.isValidStatus(ChecklistStatus.SKIPPED)).toBe(true);
    });

    it('should allow null/undefined (optional)', () => {
      expect(ChecklistValidator.isValidStatus(null)).toBe(true);
      expect(ChecklistValidator.isValidStatus(undefined)).toBe(true);
    });
  });

  describe('validate', () => {
    it('should validate complete valid data', () => {
      const result = ChecklistValidator.validate({
        checklistId: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Test Checklist',
        owner: 'developer@example.com',
        status: ChecklistStatus.PENDING,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate with only required fields', () => {
      const result = ChecklistValidator.validate({
        title: 'Test Checklist',
      });

      expect(result.isValid).toBe(true);
    });

    it('should report errors for invalid data', () => {
      const result = ChecklistValidator.validate({
        title: '',
        owner: 'a'.repeat(101),
        status: 'invalid' as ChecklistStatus,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid data', () => {
      expect(() => {
        ChecklistValidator.validateOrThrow({
          title: 'Valid Title',
        });
      }).not.toThrow();
    });

    it('should throw for invalid data', () => {
      expect(() => {
        ChecklistValidator.validateOrThrow({
          title: '',
        });
      }).toThrow();
    });
  });
});

describe('SnapshotValidator', () => {
  describe('isValidSnapshotId', () => {
    it('should validate correct UUID format', () => {
      expect(SnapshotValidator.isValidSnapshotId('550e8400-e29b-41d4-a716-446655440002')).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      expect(SnapshotValidator.isValidSnapshotId('invalid-uuid')).toBe(false);
      expect(SnapshotValidator.isValidSnapshotId('')).toBe(false);
    });
  });

  describe('isValidGitCommit', () => {
    it('should validate 40-character SHA', () => {
      expect(SnapshotValidator.isValidGitCommit('abc123def456789012345678901234567890abcd')).toBe(true);
    });

    it('should validate 7-character short SHA', () => {
      expect(SnapshotValidator.isValidGitCommit('abc123d')).toBe(true);
    });

    it('should reject invalid commit hash', () => {
      expect(SnapshotValidator.isValidGitCommit('invalid')).toBe(false);
      expect(SnapshotValidator.isValidGitCommit('')).toBe(false);
      expect(SnapshotValidator.isValidGitCommit(null)).toBe(false);
    });
  });

  describe('isValidBackendVersion', () => {
    it('should validate correct version', () => {
      expect(SnapshotValidator.isValidBackendVersion('1.0.0')).toBe(true);
      expect(SnapshotValidator.isValidBackendVersion('1.2.3-beta.1')).toBe(true);
    });

    it('should reject invalid version', () => {
      expect(SnapshotValidator.isValidBackendVersion('')).toBe(false);
      expect(SnapshotValidator.isValidBackendVersion(null)).toBe(false);
    });
  });

  describe('isValidDatabaseVersion', () => {
    it('should validate correct version', () => {
      expect(SnapshotValidator.isValidDatabaseVersion('1.0.0')).toBe(true);
    });

    it('should reject invalid version', () => {
      expect(SnapshotValidator.isValidDatabaseVersion('')).toBe(false);
      expect(SnapshotValidator.isValidDatabaseVersion(null)).toBe(false);
    });
  });

  describe('validate', () => {
    it('should validate complete valid data', () => {
      const result = SnapshotValidator.validate({
        snapshotId: '550e8400-e29b-41d4-a716-446655440002',
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123def456789012345678901234567890abcd',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate with only required fields', () => {
      const result = SnapshotValidator.validate({
        backendVersion: '1.0.0',
        databaseVersion: '1.0.0',
        gitCommit: 'abc123d',
      });

      expect(result.isValid).toBe(true);
    });

    it('should report errors for invalid data', () => {
      const result = SnapshotValidator.validate({
        backendVersion: '',
        databaseVersion: '',
        gitCommit: 'invalid',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid data', () => {
      expect(() => {
        SnapshotValidator.validateOrThrow({
          backendVersion: '1.0.0',
          databaseVersion: '1.0.0',
          gitCommit: 'abc123d',
        });
      }).not.toThrow();
    });

    it('should throw for invalid data', () => {
      expect(() => {
        SnapshotValidator.validateOrThrow({
          backendVersion: '',
          databaseVersion: '',
          gitCommit: 'invalid',
        });
      }).toThrow();
    });
  });
});
