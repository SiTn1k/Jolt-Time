/**
 * Module Registry Tests
 */

import { describe, it, expect } from 'vitest';
import {
  DOMAIN_MODULES,
  getAllModuleNames,
  getModuleDefinition,
  createModuleFromDefinition,
  getAllModuleEntities,
  getModuleCount,
} from '../services/ModuleRegistry';
import type { ModuleDefinition } from '../services/ModuleRegistry';

describe('ModuleRegistry', () => {
  describe('DOMAIN_MODULES', () => {
    it('should have all required modules defined', () => {
      const requiredModules = [
        'Authentication',
        'Telegram',
        'Player',
        'Profile',
        'Inventory',
        'Currency',
        'Artifact',
        'Museum',
        'Academy',
        'Quest',
        'Achievement',
        'Guild',
        'Reward Engine',
        'Notification',
        'Analytics',
        'Admin',
        'Configuration',
        'Scheduler',
        'Audit',
        'Monitoring',
        'Backup',
        'Integration',
        'Security',
        'Cache',
        'API Gateway',
        'Error Handling',
        'DevOps',
        'Optimization',
      ];

      for (const moduleName of requiredModules) {
        expect(DOMAIN_MODULES).toHaveProperty(moduleName);
        expect(DOMAIN_MODULES[moduleName]).toBeDefined();
        expect(DOMAIN_MODULES[moduleName].moduleName).toBe(moduleName);
      }
    });

    it('should have 28 total modules', () => {
      expect(Object.keys(DOMAIN_MODULES).length).toBe(28);
    });

    it('each module should have required properties', () => {
      for (const [name, module] of Object.entries(DOMAIN_MODULES)) {
        expect(module.moduleName).toBe(name);
        expect(module.moduleVersion).toBeDefined();
        expect(typeof module.moduleVersion).toBe('string');
        expect(module.status).toBeDefined();
        expect(Array.isArray(module.dependencies)).toBe(true);
        expect(module.metadata).toBeDefined();
        expect(typeof module.metadata).toBe('object');
      }
    });

    it('each module should have valid status', () => {
      const validStatuses = ['registered', 'initializing', 'active', 'degraded', 'error', 'stopped', 'unregistered'];
      for (const module of Object.values(DOMAIN_MODULES)) {
        expect(validStatuses).toContain(module.status);
      }
    });
  });

  describe('getAllModuleNames()', () => {
    it('should return all module names', () => {
      const names = getAllModuleNames();
      expect(names).toHaveLength(28);
      expect(names).toContain('Authentication');
      expect(names).toContain('Telegram');
      expect(names).toContain('Player');
    });

    it('should return array of strings', () => {
      const names = getAllModuleNames();
      expect(names.every((n) => typeof n === 'string')).toBe(true);
    });
  });

  describe('getModuleDefinition()', () => {
    it('should return module definition for existing module', () => {
      const definition = getModuleDefinition('Authentication');
      expect(definition).toBeDefined();
      expect(definition?.moduleName).toBe('Authentication');
    });

    it('should return undefined for non-existing module', () => {
      const definition = getModuleDefinition('NonExistentModule');
      expect(definition).toBeUndefined();
    });
  });

  describe('createModuleFromDefinition()', () => {
    it('should create a SystemModule entity from definition', () => {
      const definition: ModuleDefinition = {
        moduleName: 'TestModule',
        moduleVersion: '1.0.0',
        status: 'registered',
        dependencies: [],
        metadata: { domain: 'test' },
      };

      const module = createModuleFromDefinition(definition);

      expect(module.moduleName).toBe('TestModule');
      expect(module.moduleVersion).toBe('1.0.0');
      expect(module.status).toBe('registered');
      expect(module.metadata).toEqual({ domain: 'test' });
    });

    it('should create module with dependencies', () => {
      const definition: ModuleDefinition = {
        moduleName: 'TestModule',
        moduleVersion: '1.0.0',
        status: 'registered',
        dependencies: [
          { moduleId: 'test-id', moduleName: 'Dep1', status: 'satisfied', isOptional: false },
        ],
        metadata: {},
      };

      const module = createModuleFromDefinition(definition);

      expect(module.dependencies).toHaveLength(1);
      expect(module.dependencies[0].moduleName).toBe('Dep1');
    });
  });

  describe('getAllModuleEntities()', () => {
    it('should return array of SystemModule entities', () => {
      const modules = getAllModuleEntities();

      expect(Array.isArray(modules)).toBe(true);
      expect(modules).toHaveLength(28);
    });

    it('each entity should have valid properties', () => {
      const modules = getAllModuleEntities();

      for (const module of modules) {
        expect(module.moduleId).toBeDefined();
        expect(module.moduleName).toBeDefined();
        expect(module.moduleVersion).toBeDefined();
        expect(module.status).toBeDefined();
        expect(Array.isArray(module.dependencies)).toBe(true);
        expect(module.metadata).toBeDefined();
        expect(module.createdAt).toBeInstanceOf(Date);
        expect(module.updatedAt).toBeInstanceOf(Date);
      }
    });
  });

  describe('getModuleCount()', () => {
    it('should return correct count', () => {
      expect(getModuleCount()).toBe(28);
    });
  });
});
