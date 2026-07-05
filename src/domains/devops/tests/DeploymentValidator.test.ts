/**
 * Deployment Validator Tests
 *
 * Tests for DeploymentValidator.
 */

import { describe, it, expect } from 'vitest';
import { DeploymentValidator } from '../validators/DeploymentValidator';
import { DeploymentStatus } from '../types/DeploymentStatus';

describe('DeploymentValidator', () => {
  describe('isValidVersion', () => {
    it('should reject null version', () => {
      expect(DeploymentValidator.isValidVersion(null)).toBe(false);
    });

    it('should reject undefined version', () => {
      expect(DeploymentValidator.isValidVersion(undefined)).toBe(false);
    });

    it('should reject empty version', () => {
      expect(DeploymentValidator.isValidVersion('')).toBe(false);
    });

    it('should accept valid version with dots and hyphens', () => {
      expect(DeploymentValidator.isValidVersion('1.0.0')).toBe(true);
      expect(DeploymentValidator.isValidVersion('v1.0.0-beta')).toBe(true);
      expect(DeploymentValidator.isValidVersion('release_candidate_1')).toBe(true);
    });

    it('should reject version with invalid characters', () => {
      expect(DeploymentValidator.isValidVersion('v1.0.0+build')).toBe(false);
      expect(DeploymentValidator.isValidVersion('version@1.0')).toBe(false);
    });

    it('should reject version longer than 100 characters', () => {
      const longVersion = 'v' + '1'.repeat(100);
      expect(DeploymentValidator.isValidVersion(longVersion)).toBe(false);
    });

    it('should accept version at max length', () => {
      const maxVersion = 'v' + '1'.repeat(99);
      expect(DeploymentValidator.isValidVersion(maxVersion)).toBe(true);
    });
  });

  describe('isValidEnvironmentId', () => {
    it('should reject null environment ID', () => {
      expect(DeploymentValidator.isValidEnvironmentId(null)).toBe(false);
    });

    it('should reject invalid UUID format', () => {
      expect(DeploymentValidator.isValidEnvironmentId('invalid-uuid')).toBe(false);
      expect(DeploymentValidator.isValidEnvironmentId('12345')).toBe(false);
    });

    it('should accept valid v4 UUID', () => {
      // Valid v4 UUID: version=4 in 3rd segment, variant=8/9/a/b in 4th segment
      expect(DeploymentValidator.isValidEnvironmentId('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
    });
  });

  describe('isValidStatus', () => {
    it('should accept all valid deployment statuses', () => {
      expect(DeploymentValidator.isValidStatus(DeploymentStatus.PENDING)).toBe(true);
      expect(DeploymentValidator.isValidStatus(DeploymentStatus.IN_PROGRESS)).toBe(true);
      expect(DeploymentValidator.isValidStatus(DeploymentStatus.COMPLETED)).toBe(true);
      expect(DeploymentValidator.isValidStatus(DeploymentStatus.FAILED)).toBe(true);
      expect(DeploymentValidator.isValidStatus(DeploymentStatus.ROLLED_BACK)).toBe(true);
      expect(DeploymentValidator.isValidStatus(DeploymentStatus.CANCELLED)).toBe(true);
    });

    it('should reject invalid status', () => {
      expect(DeploymentValidator.isValidStatus('invalid')).toBe(false);
      expect(DeploymentValidator.isValidStatus('')).toBe(false);
    });
  });

  describe('validateDeployment', () => {
    // Valid v4 UUID for testing
    const validEnvId = '123e4567-e89b-42d3-a456-426614174000';

    it('should return valid result for valid deployment data', () => {
      const result = DeploymentValidator.validateDeployment({
        version: '1.0.0',
        environmentId: validEnvId,
        status: DeploymentStatus.PENDING,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid version', () => {
      const result = DeploymentValidator.validateDeployment({
        version: 'invalid version!',
        environmentId: validEnvId,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return errors for invalid environment ID', () => {
      const result = DeploymentValidator.validateDeployment({
        version: '1.0.0',
        environmentId: 'invalid',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Environment ID'))).toBe(true);
    });

    it('should return errors for invalid status', () => {
      const result = DeploymentValidator.validateDeployment({
        version: '1.0.0',
        environmentId: validEnvId,
        status: 'invalid_status',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Status'))).toBe(true);
    });
  });

  describe('validateDeploymentOrThrow', () => {
    // Valid v4 UUID for testing
    const validEnvId = '123e4567-e89b-42d3-a456-426614174000';

    it('should not throw for valid deployment data', () => {
      expect(() =>
        DeploymentValidator.validateDeploymentOrThrow({
          version: '1.0.0',
          environmentId: validEnvId,
        })
      ).not.toThrow();
    });

    it('should throw for invalid deployment data', () => {
      expect(() =>
        DeploymentValidator.validateDeploymentOrThrow({
          version: '',
        })
      ).toThrow();
    });
  });
});
