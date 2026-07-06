/**
 * Repository Validation Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RepositoryValidation } from '../services/RepositoryValidation';
import type { RepositoryInfo } from '../services/RepositoryValidation';

// Mock logger
vi.mock('../../../core/logging/logger.service', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('RepositoryValidation', () => {
  let repositoryValidation: RepositoryValidation;

  beforeEach(() => {
    repositoryValidation = new RepositoryValidation();
  });

  describe('Repository Registration', () => {
    it('should register a repository', () => {
      const repoInfo: RepositoryInfo = {
        name: 'test-repository',
        tableName: 'test_table',
        isRegistered: true,
      };

      repositoryValidation.registerRepository(repoInfo);

      expect(repositoryValidation.isRepositoryRegistered('test-repository')).toBe(true);
    });

    it('should track unregistered repositories', () => {
      const repoInfo: RepositoryInfo = {
        name: 'unregistered-repo',
        isRegistered: false,
      };

      repositoryValidation.registerRepository(repoInfo);

      expect(repositoryValidation.isRepositoryRegistered('unregistered-repo')).toBe(false);
    });
  });

  describe('Get Registered Repositories', () => {
    it('should return list of registered repositories', () => {
      repositoryValidation.registerRepository({
        name: 'repo-1',
        isRegistered: true,
      });
      repositoryValidation.registerRepository({
        name: 'repo-2',
        isRegistered: true,
      });
      repositoryValidation.registerRepository({
        name: 'repo-3',
        isRegistered: false,
      });

      const registered = repositoryValidation.getRegisteredRepositories();

      expect(registered).toContain('repo-1');
      expect(registered).toContain('repo-2');
      expect(registered).not.toContain('repo-3');
    });

    it('should return empty list when no repositories registered', () => {
      const registered = repositoryValidation.getRegisteredRepositories();
      expect(registered).toHaveLength(0);
    });
  });

  describe('Validation', () => {
    it('should validate registered repository as connected', async () => {
      repositoryValidation.registerRepository({
        name: 'test-repo',
        tableName: 'test_table',
        isRegistered: true,
      });

      const result = await repositoryValidation.validateAll();

      expect(result.isValid).toBe(true);
    });

    it('should flag unregistered repository as issue', async () => {
      repositoryValidation.registerRepository({
        name: 'unregistered-repo',
        isRegistered: false,
      });

      const result = await repositoryValidation.validateAll();

      const repoIssue = result.issues.find(i => i.repository === 'unregistered-repo');
      expect(repoIssue).toBeDefined();
      expect(repoIssue?.severity).toBeDefined();
    });

    it('should count repositories correctly', async () => {
      repositoryValidation.registerRepository({
        name: 'repo-1',
        isRegistered: true,
      });
      repositoryValidation.registerRepository({
        name: 'repo-2',
        isRegistered: false,
      });

      const result = await repositoryValidation.validateAll();

      expect(result.summary.total).toBe(2);
      expect(result.summary.unregistered).toBe(1);
    });
  });

  describe('CRUD Operations Test', () => {
    it('should test CRUD operations', async () => {
      repositoryValidation.registerRepository({
        name: 'test-repo',
        isRegistered: true,
      });

      const result = await repositoryValidation.testCrudOperations('test-repo');

      expect(result.create).toBe(true);
      expect(result.read).toBe(true);
      expect(result.update).toBe(true);
      expect(result.delete).toBe(true);
    });
  });

  describe('Table Validation', () => {
    it('should validate table exists', async () => {
      repositoryValidation.registerRepository({
        name: 'test-repo',
        tableName: 'test_table',
        isRegistered: true,
      });

      const result = await repositoryValidation.validateTable('test-repo', 'test_table');

      expect(result).toBe(true);
    });

    it('should return false for non-existent table', async () => {
      repositoryValidation.registerRepository({
        name: 'test-repo',
        tableName: 'test_table',
        isRegistered: true,
      });

      const result = await repositoryValidation.validateTable('test-repo', 'wrong_table');

      expect(result).toBe(false);
    });

    it('should return false for unregistered repository', async () => {
      repositoryValidation.registerRepository({
        name: 'unregistered-repo',
        isRegistered: false,
      });

      const result = await repositoryValidation.validateTable('unregistered-repo', 'any_table');

      expect(result).toBe(false);
    });
  });

  describe('Reset', () => {
    it('should clear all registered repositories', () => {
      repositoryValidation.registerRepository({
        name: 'repo-1',
        isRegistered: true,
      });
      repositoryValidation.registerRepository({
        name: 'repo-2',
        isRegistered: true,
      });

      repositoryValidation.reset();

      expect(repositoryValidation.getRegisteredRepositories()).toHaveLength(0);
    });
  });

  describe('Connection Cache', () => {
    it('should clear connection cache', () => {
      repositoryValidation.registerRepository({
        name: 'test-repo',
        isRegistered: true,
      });

      repositoryValidation.clearConnectionCache();

      // Should not throw
      expect(true).toBe(true);
    });
  });
});
