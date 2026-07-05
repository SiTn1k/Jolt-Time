/**
 * System Integration Validators Tests
 */

import { describe, it, expect } from 'vitest';
import { ModuleValidator } from '../validators/ModuleValidator';
import { IntegrationValidator } from '../validators/IntegrationValidator';
import { SnapshotValidator } from '../validators/SnapshotValidator';

describe('ModuleValidator', () => {
  describe('validateName()', () => {
    it('should validate correct module name', () => {
      const result = ModuleValidator.validateName('TestModule');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty name', () => {
      const result = ModuleValidator.validateName('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Module name is required');
    });

    it('should reject name with invalid characters', () => {
      const result = ModuleValidator.validateName('Test@Module');
      expect(result.isValid).toBe(false);
    });

    it('should accept name with spaces, hyphens, underscores', () => {
      const result = ModuleValidator.validateName('Test Module-1_2');
      expect(result.isValid).toBe(true);
    });

    it('should reject name longer than 255 characters', () => {
      const longName = 'A'.repeat(256);
      const result = ModuleValidator.validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('255'))).toBe(true);
    });
  });

  describe('validateVersion()', () => {
    it('should validate correct semver', () => {
      const result = ModuleValidator.validateVersion('1.0.0');
      expect(result.isValid).toBe(true);
    });

    it('should validate semver with pre-release', () => {
      const result = ModuleValidator.validateVersion('1.0.0-beta.1');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid version', () => {
      const result = ModuleValidator.validateVersion('invalid');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('semantic versioning'))).toBe(true);
    });

    it('should reject empty version', () => {
      const result = ModuleValidator.validateVersion('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateStatus()', () => {
    it('should validate correct status', () => {
      const validStatuses = ['registered', 'active', 'error'];
      const result = ModuleValidator.validateStatus('active', validStatuses);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid status', () => {
      const validStatuses = ['registered', 'active', 'error'];
      const result = ModuleValidator.validateStatus('invalid', validStatuses);
      expect(result.isValid).toBe(false);
    });

    it('should reject empty status', () => {
      const result = ModuleValidator.validateStatus('', ['active']);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateDependency()', () => {
    it('should validate correct dependency', () => {
      const result = ModuleValidator.validateDependency({
        moduleId: '123e4567-e89b-42d3-a456-426614174000',
        moduleName: 'TestDep',
        status: 'satisfied',
        isOptional: false,
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject dependency without moduleId', () => {
      const result = ModuleValidator.validateDependency({
        moduleId: '',
        moduleName: 'TestDep',
        status: 'satisfied',
        isOptional: false,
      });
      expect(result.isValid).toBe(false);
    });

    it('should reject dependency without moduleName', () => {
      const result = ModuleValidator.validateDependency({
        moduleId: '123e4567-e89b-42d3-a456-426614174000',
        moduleName: '',
        status: 'satisfied',
        isOptional: false,
      });
      expect(result.isValid).toBe(false);
    });

    it('should reject invalid dependency status', () => {
      const result = ModuleValidator.validateDependency({
        moduleId: '123e4567-e89b-42d3-a456-426614174000',
        moduleName: 'TestDep',
        status: 'invalid' as any,
        isOptional: false,
      });
      expect(result.isValid).toBe(false);
    });

    it('should reject non-boolean isOptional', () => {
      const result = ModuleValidator.validateDependency({
        moduleId: '123e4567-e89b-42d3-a456-426614174000',
        moduleName: 'TestDep',
        status: 'satisfied',
        isOptional: 'false' as any,
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateDependencies()', () => {
    it('should validate array of dependencies', () => {
      const result = ModuleValidator.validateDependencies([
        { moduleId: '123e4567-e89b-42d3-a456-426614174000', moduleName: 'Dep1', status: 'satisfied', isOptional: false },
        { moduleId: '123e4567-e89b-42d3-a456-426614174001', moduleName: 'Dep2', status: 'satisfied', isOptional: true },
      ]);
      expect(result.isValid).toBe(true);
    });

    it('should reject non-array', () => {
      const result = ModuleValidator.validateDependencies('not an array' as any);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateCreate()', () => {
    it('should validate complete create data', () => {
      const result = ModuleValidator.validateCreate({
        moduleName: 'TestModule',
        moduleVersion: '1.0.0',
        dependencies: [],
      });
      expect(result.isValid).toBe(true);
    });

    it('should validate without optional fields', () => {
      const result = ModuleValidator.validateCreate({
        moduleName: 'TestModule',
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid name', () => {
      const result = ModuleValidator.validateCreate({
        moduleName: '',
        moduleVersion: '1.0.0',
      });
      expect(result.isValid).toBe(false);
    });
  });
});

describe('IntegrationValidator', () => {
  describe('validateStatus()', () => {
    it('should validate correct integration status', () => {
      const validStatuses = ['healthy', 'degraded', 'critical_failure'];
      const result = IntegrationValidator.validateStatus('healthy', validStatuses);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid status', () => {
      const validStatuses = ['healthy', 'degraded'];
      const result = IntegrationValidator.validateStatus('invalid', validStatuses);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateModuleId()', () => {
    it('should validate correct UUID', () => {
      const result = IntegrationValidator.validateModuleId('123e4567-e89b-42d3-a456-426614174000');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const result = IntegrationValidator.validateModuleId('invalid-uuid');
      expect(result.isValid).toBe(false);
    });

    it('should reject empty ID', () => {
      const result = IntegrationValidator.validateModuleId('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateMetadata()', () => {
    it('should validate empty metadata', () => {
      const result = IntegrationValidator.validateMetadata({});
      expect(result.isValid).toBe(true);
    });

    it('should validate metadata with counts', () => {
      const result = IntegrationValidator.validateMetadata({
        registeredModulesCount: 10,
        healthyModulesCount: 8,
        failedModulesCount: 2,
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject non-numeric counts', () => {
      const result = IntegrationValidator.validateMetadata({
        registeredModulesCount: 'ten' as any,
      });
      expect(result.isValid).toBe(false);
    });

    it('should validate lastSnapshotAt date', () => {
      const result = IntegrationValidator.validateMetadata({
        lastSnapshotAt: '2024-01-01T00:00:00.000Z',
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid lastSnapshotAt date', () => {
      const result = IntegrationValidator.validateMetadata({
        lastSnapshotAt: 'not-a-date',
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateCreate()', () => {
    it('should validate complete create data', () => {
      const result = IntegrationValidator.validateCreate({
        moduleId: '123e4567-e89b-42d3-a456-426614174000',
        status: 'healthy',
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid module ID', () => {
      const result = IntegrationValidator.validateCreate({
        moduleId: 'invalid',
        status: 'healthy',
      });
      expect(result.isValid).toBe(false);
    });
  });
});

describe('SnapshotValidator', () => {
  describe('validateRegisteredModules()', () => {
    it('should validate array of valid UUIDs', () => {
      const result = SnapshotValidator.validateRegisteredModules([
        '123e4567-e89b-42d3-a456-426614174000',
        '123e4567-e89b-42d3-a456-426614174001',
      ]);
      expect(result.isValid).toBe(true);
    });

    it('should reject non-array', () => {
      const result = SnapshotValidator.validateRegisteredModules('not an array' as any);
      expect(result.isValid).toBe(false);
    });

    it('should reject invalid UUID in array', () => {
      const result = SnapshotValidator.validateRegisteredModules([
        '123e4567-e89b-42d3-a456-426614174000',
        'invalid-uuid',
      ]);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateHealthyModules()', () => {
    it('should validate array of valid UUIDs', () => {
      const result = SnapshotValidator.validateHealthyModules([
        '123e4567-e89b-42d3-a456-426614174000',
      ]);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateFailedModules()', () => {
    it('should validate array of valid UUIDs', () => {
      const result = SnapshotValidator.validateFailedModules([
        '123e4567-e89b-42d3-a456-426614174000',
      ]);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateModuleExclusivity()', () => {
    it('should validate non-overlapping arrays', () => {
      const result = SnapshotValidator.validateModuleExclusivity(
        ['123e4567-e89b-42d3-a456-426614174000'],
        ['123e4567-e89b-42d3-a456-426614174001']
      );
      expect(result.isValid).toBe(true);
    });

    it('should reject overlapping arrays', () => {
      const result = SnapshotValidator.validateModuleExclusivity(
        ['123e4567-e89b-42d3-a456-426614174000'],
        ['123e4567-e89b-42d3-a456-426614174000']
      );
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateMetadata()', () => {
    it('should validate empty metadata', () => {
      const result = SnapshotValidator.validateMetadata({});
      expect(result.isValid).toBe(true);
    });

    it('should reject non-object', () => {
      const result = SnapshotValidator.validateMetadata('not an object' as any);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateCreate()', () => {
    it('should validate complete create data', () => {
      const result = SnapshotValidator.validateCreate({
        registeredModules: ['123e4567-e89b-42d3-a456-426614174000'],
        healthyModules: ['123e4567-e89b-42d3-a456-426614174000'],
        failedModules: [],
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject overlapping healthy and failed', () => {
      const result = SnapshotValidator.validateCreate({
        registeredModules: ['123e4567-e89b-42d3-a456-426614174000'],
        healthyModules: ['123e4567-e89b-42d3-a456-426614174000'],
        failedModules: ['123e4567-e89b-42d3-a456-426614174000'],
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateKeepCount()', () => {
    it('should validate valid keep count', () => {
      const result = SnapshotValidator.validateKeepCount(10);
      expect(result.isValid).toBe(true);
    });

    it('should reject zero', () => {
      const result = SnapshotValidator.validateKeepCount(0);
      expect(result.isValid).toBe(false);
    });

    it('should reject negative', () => {
      const result = SnapshotValidator.validateKeepCount(-1);
      expect(result.isValid).toBe(false);
    });

    it('should reject non-integer', () => {
      const result = SnapshotValidator.validateKeepCount(1.5);
      expect(result.isValid).toBe(false);
    });

    it('should reject too large value', () => {
      const result = SnapshotValidator.validateKeepCount(1001);
      expect(result.isValid).toBe(false);
    });
  });
});
