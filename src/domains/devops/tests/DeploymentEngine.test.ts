/**
 * Deployment Engine Tests
 *
 * Tests for DeploymentEngine.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeploymentEngine } from '../services/DeploymentEngine';
import type { IDevOpsRepository } from '../interfaces/IDevOpsRepository';
import { Deployment } from '../entities/Deployment';
import { DeploymentId } from '../value-objects/DeploymentId';
import { DeploymentStatus } from '../types/DeploymentStatus';

// Mock repository
const createMockRepository = (): IDevOpsRepository => ({
  createDeployment: vi.fn(),
  findDeploymentById: vi.fn(),
  findDeploymentsByEnvironmentId: vi.fn(),
  updateDeployment: vi.fn(),
  deleteDeployment: vi.fn(),
  listDeployments: vi.fn(),
  countDeployments: vi.fn(),
  createEnvironment: vi.fn(),
  findEnvironmentById: vi.fn(),
  findEnvironmentByName: vi.fn(),
  updateEnvironment: vi.fn(),
  deleteEnvironment: vi.fn(),
  listEnvironments: vi.fn(),
  countEnvironments: vi.fn(),
  createInfrastructureNode: vi.fn(),
  findInfrastructureNodeById: vi.fn(),
  findInfrastructureNodesByRegion: vi.fn(),
  findInfrastructureNodesByType: vi.fn(),
  updateInfrastructureNode: vi.fn(),
  deleteInfrastructureNode: vi.fn(),
  listInfrastructureNodes: vi.fn(),
  countInfrastructureNodes: vi.fn(),
});

describe('DeploymentEngine', () => {
  let engine: DeploymentEngine;
  let mockRepository: IDevOpsRepository;

  beforeEach(() => {
    mockRepository = createMockRepository();
    engine = new DeploymentEngine(mockRepository);
  });

  describe('validateDeployment', () => {
    // Valid v4 UUID for testing
    const validEnvId = '123e4567-e89b-42d3-a456-426614174000';

    it('should return valid for correct deployment data', () => {
      const result = engine.validateDeployment({
        version: '1.0.0',
        environmentId: validEnvId,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error for missing version', () => {
      const result = engine.validateDeployment({
        environmentId: validEnvId,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Version is required');
    });

    it('should return error for missing environment ID', () => {
      const result = engine.validateDeployment({
        version: '1.0.0',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Environment ID is required');
    });

    it('should return error for invalid version format', () => {
      const result = engine.validateDeployment({
        version: 'invalid version!',
        environmentId: validEnvId,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('alphanumeric'))).toBe(true);
    });

    it('should return error for invalid environment ID format', () => {
      const result = engine.validateDeployment({
        version: '1.0.0',
        environmentId: 'invalid-uuid',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('UUID'))).toBe(true);
    });

    it('should return warning for invalid commit SHA format', () => {
      const result = engine.validateDeployment({
        version: '1.0.0',
        environmentId: validEnvId,
        metadata: { commitSha: 'invalid' },
      });
      expect(result.warnings.some((w) => w.includes('Commit SHA'))).toBe(true);
    });
  });

  describe('startDeployment', () => {
    // Valid v4 UUID for testing
    const validEnvId = '123e4567-e89b-42d3-a456-426614174000';

    it('should create a new deployment with PENDING status', async () => {
      const mockDeployment = Deployment.create({
        deploymentId: DeploymentId.generate(),
        version: '1.0.0',
        environmentId: validEnvId,
      });

      vi.mocked(mockRepository.createDeployment).mockResolvedValue(mockDeployment);

      const result = await engine.startDeployment({
        version: '1.0.0',
        environmentId: validEnvId,
      });

      expect(mockRepository.createDeployment).toHaveBeenCalled();
      expect(result.status).toBe(DeploymentStatus.PENDING);
      expect(result.version).toBe('1.0.0');
    });

    it('should throw for invalid deployment data', async () => {
      await expect(
        engine.startDeployment({
          version: '',
          environmentId: validEnvId,
        })
      ).rejects.toThrow();
    });
  });

  describe('completeDeployment', () => {
    // Valid v4 UUID for testing
    const validEnvId = '123e4567-e89b-42d3-a456-426614174000';

    it('should complete a PENDING deployment', async () => {
      const mockDeployment = Deployment.create({
        deploymentId: DeploymentId.generate(),
        version: '1.0.0',
        environmentId: validEnvId,
      });

      const completedDeployment = mockDeployment.copyWith({
        status: DeploymentStatus.COMPLETED,
        completedAt: new Date(),
      });

      vi.mocked(mockRepository.findDeploymentById).mockResolvedValue(mockDeployment);
      vi.mocked(mockRepository.updateDeployment).mockResolvedValue(completedDeployment);

      const result = await engine.completeDeployment(mockDeployment.deploymentId.value);

      expect(result.success).toBe(true);
      expect(result.deployment?.status).toBe(DeploymentStatus.COMPLETED);
    });

    it('should return error when deployment not found', async () => {
      vi.mocked(mockRepository.findDeploymentById).mockResolvedValue(null);

      const result = await engine.completeDeployment('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should return error for already completed deployment', async () => {
      const mockDeployment = Deployment.create({
        deploymentId: DeploymentId.generate(),
        version: '1.0.0',
        environmentId: validEnvId,
      }).copyWith({ status: DeploymentStatus.COMPLETED });

      vi.mocked(mockRepository.findDeploymentById).mockResolvedValue(mockDeployment);

      const result = await engine.completeDeployment(mockDeployment.deploymentId.value);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Cannot complete');
    });
  });

  describe('failDeployment', () => {
    // Valid v4 UUID for testing
    const validEnvId = '123e4567-e89b-42d3-a456-426614174000';

    it('should mark deployment as FAILED', async () => {
      const mockDeployment = Deployment.create({
        deploymentId: DeploymentId.generate(),
        version: '1.0.0',
        environmentId: validEnvId,
      });

      const failedDeployment = mockDeployment.copyWith({
        status: DeploymentStatus.FAILED,
        completedAt: new Date(),
      });

      vi.mocked(mockRepository.findDeploymentById).mockResolvedValue(mockDeployment);
      vi.mocked(mockRepository.updateDeployment).mockResolvedValue(failedDeployment);

      const result = await engine.failDeployment(mockDeployment.deploymentId.value, 'Test failure');

      expect(result.success).toBe(true);
      expect(result.deployment?.status).toBe(DeploymentStatus.FAILED);
    });
  });

  describe('cancelDeployment', () => {
    // Valid v4 UUID for testing
    const validEnvId = '123e4567-e89b-42d3-a456-426614174000';

    it('should mark deployment as CANCELLED', async () => {
      const mockDeployment = Deployment.create({
        deploymentId: DeploymentId.generate(),
        version: '1.0.0',
        environmentId: validEnvId,
      });

      const cancelledDeployment = mockDeployment.copyWith({
        status: DeploymentStatus.CANCELLED,
        completedAt: new Date(),
      });

      vi.mocked(mockRepository.findDeploymentById).mockResolvedValue(mockDeployment);
      vi.mocked(mockRepository.updateDeployment).mockResolvedValue(cancelledDeployment);

      const result = await engine.cancelDeployment(mockDeployment.deploymentId.value, 'User cancelled');

      expect(result.success).toBe(true);
      expect(result.deployment?.status).toBe(DeploymentStatus.CANCELLED);
    });
  });

  describe('rollbackDeployment', () => {
    // Valid v4 UUID for testing
    const validEnvId = '123e4567-e89b-42d3-a456-426614174000';

    it('should mark completed deployment as ROLLED_BACK', async () => {
      const mockDeployment = Deployment.create({
        deploymentId: DeploymentId.generate(),
        version: '1.0.0',
        environmentId: validEnvId,
      }).copyWith({ status: DeploymentStatus.COMPLETED });

      const rolledBackDeployment = mockDeployment.copyWith({
        status: DeploymentStatus.ROLLED_BACK,
      });

      vi.mocked(mockRepository.findDeploymentById).mockResolvedValue(mockDeployment);
      vi.mocked(mockRepository.updateDeployment).mockResolvedValue(rolledBackDeployment);

      const result = await engine.rollbackDeployment(mockDeployment.deploymentId.value);

      expect(result.success).toBe(true);
      expect(result.deployment?.status).toBe(DeploymentStatus.ROLLED_BACK);
    });

    it('should return error for non-completed deployment', async () => {
      const mockDeployment = Deployment.create({
        deploymentId: DeploymentId.generate(),
        version: '1.0.0',
        environmentId: validEnvId,
      });

      vi.mocked(mockRepository.findDeploymentById).mockResolvedValue(mockDeployment);

      const result = await engine.rollbackDeployment(mockDeployment.deploymentId.value);

      expect(result.success).toBe(false);
      expect(result.error).toContain('completed');
    });
  });

  describe('getDeploymentHistory', () => {
    // Valid v4 UUID for testing
    const validEnvId = '123e4567-e89b-42d3-a456-426614174000';

    it('should return deployment history entries', async () => {
      const deployments = [
        Deployment.create({
          deploymentId: DeploymentId.generate(),
          version: '1.0.0',
          environmentId: validEnvId,
        }),
        Deployment.create({
          deploymentId: DeploymentId.generate(),
          version: '1.0.1',
          environmentId: validEnvId,
        }),
      ];

      vi.mocked(mockRepository.listDeployments).mockResolvedValue({
        items: deployments,
        total: 2,
        page: 1,
        pageSize: 50,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const history = await engine.getDeploymentHistory();

      expect(history).toHaveLength(2);
      expect(history[0].version).toBe('1.0.0');
      expect(history[1].version).toBe('1.0.1');
    });
  });

  describe('getActiveDeployments', () => {
    // Valid v4 UUID for testing
    const validEnvId = '123e4567-e89b-42d3-a456-426614174000';

    it('should return only active (non-terminal) deployments', async () => {
      const deployments = [
        Deployment.create({
          deploymentId: DeploymentId.generate(),
          version: '1.0.0',
          environmentId: validEnvId,
        }),
        Deployment.create({
          deploymentId: DeploymentId.generate(),
          version: '1.0.1',
          environmentId: validEnvId,
        }).copyWith({ status: DeploymentStatus.COMPLETED }),
      ];

      vi.mocked(mockRepository.listDeployments).mockResolvedValue({
        items: deployments,
        total: 2,
        page: 1,
        pageSize: 1000,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const active = await engine.getActiveDeployments();

      expect(active).toHaveLength(1);
      expect(active[0].version).toBe('1.0.0');
    });
  });
});
