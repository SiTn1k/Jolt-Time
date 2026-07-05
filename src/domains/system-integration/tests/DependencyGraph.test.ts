/**
 * Dependency Graph Tests
 */

import { describe, it, expect } from 'vitest';
import { DependencyGraph, validateModuleDependencies, detectCircularDependencies, getTopologicalSort } from '../services/DependencyGraph';
import { SystemModule as SystemModuleEntity } from '../entities/SystemModule';
import type { DependencyStatus } from '../types/DependencyStatus';
import type { SystemModule } from '../entities/SystemModule';

describe('DependencyGraph', () => {
  function createModule(name: string, dependencies: Array<{ moduleName: string; status: DependencyStatus; isOptional: boolean }> = []): SystemModule {
    return SystemModuleEntity.create({
      moduleName: name,
      moduleVersion: '1.0.0',
      status: 'registered',
      dependencies: dependencies.map((d) => ({ moduleId: '', ...d })),
      metadata: {},
    });
  }

  describe('constructor', () => {
    it('should create empty graph', () => {
      const graph = new DependencyGraph();
      expect(graph.getAllModules()).toHaveLength(0);
    });

    it('should initialize with modules', () => {
      const modules = [createModule('A'), createModule('B')];
      const graph = new DependencyGraph(modules);
      expect(graph.getAllModules()).toHaveLength(2);
    });
  });

  describe('addModule()', () => {
    it('should add module to graph', () => {
      const graph = new DependencyGraph();
      const module = createModule('Test');
      graph.addModule(module);
      expect(graph.hasModule('Test')).toBe(true);
    });
  });

  describe('removeModule()', () => {
    it('should remove module from graph', () => {
      const module = createModule('Test');
      const graph = new DependencyGraph([module]);
      graph.removeModule('Test');
      expect(graph.hasModule('Test')).toBe(false);
    });
  });

  describe('getDirectDependencies()', () => {
    it('should return direct dependencies', () => {
      const module = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
      const graph = new DependencyGraph([module]);
      const deps = graph.getDirectDependencies('A');
      expect(deps).toHaveLength(1);
      expect(deps[0].moduleName).toBe('B');
    });

    it('should return empty array for module with no dependencies', () => {
      const module = createModule('A');
      const graph = new DependencyGraph([module]);
      expect(graph.getDirectDependencies('A')).toHaveLength(0);
    });
  });

  describe('getAllDependencies()', () => {
    it('should return all transitive dependencies', () => {
      const moduleC = createModule('C');
      const moduleB = createModule('B', [{ moduleName: 'C', status: 'satisfied', isOptional: false }]);
      const moduleA = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
      const graph = new DependencyGraph([moduleA, moduleB, moduleC]);

      const deps = graph.getAllDependencies('A');
      expect(deps).toContain('B');
      expect(deps).toContain('C');
    });
  });

  describe('getDependents()', () => {
    it('should return modules that depend on given module', () => {
      const moduleA = createModule('A');
      const moduleB = createModule('B', [{ moduleName: 'A', status: 'satisfied', isOptional: false }]);
      const moduleC = createModule('C', [{ moduleName: 'A', status: 'satisfied', isOptional: false }]);
      const graph = new DependencyGraph([moduleA, moduleB, moduleC]);

      const dependents = graph.getDependents('A');
      expect(dependents).toContain('B');
      expect(dependents).toContain('C');
    });
  });

  describe('detectCircularDependencies()', () => {
    it('should detect no circular dependencies in valid graph', () => {
      const moduleC = createModule('C');
      const moduleB = createModule('B', [{ moduleName: 'C', status: 'satisfied', isOptional: false }]);
      const moduleA = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
      const graph = new DependencyGraph([moduleA, moduleB, moduleC]);

      const result = graph.detectCircularDependencies();
      expect(result.hasCircularDependencies).toBe(false);
      expect(result.cycles).toHaveLength(0);
    });

    it('should detect simple circular dependency', () => {
      const moduleA = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
      const moduleB = createModule('B', [{ moduleName: 'A', status: 'satisfied', isOptional: false }]);
      const graph = new DependencyGraph([moduleA, moduleB]);

      const result = graph.detectCircularDependencies();
      expect(result.hasCircularDependencies).toBe(true);
      expect(result.cycles.length).toBeGreaterThan(0);
    });

    it('should detect self-referencing module', () => {
      const moduleA = createModule('A', [{ moduleName: 'A', status: 'satisfied', isOptional: false }]);
      const graph = new DependencyGraph([moduleA]);

      const result = graph.detectCircularDependencies();
      expect(result.hasCircularDependencies).toBe(true);
    });
  });

  describe('findMissingDependencies()', () => {
    it('should find missing dependencies', () => {
      const moduleA = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
      const graph = new DependencyGraph([moduleA]);

      const missing = graph.findMissingDependencies();
      expect(missing).toContain('B');
    });

    it('should return empty array when all dependencies exist', () => {
      const moduleB = createModule('B');
      const moduleA = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
      const graph = new DependencyGraph([moduleA, moduleB]);

      const missing = graph.findMissingDependencies();
      expect(missing).toHaveLength(0);
    });
  });

  describe('findDuplicateModules()', () => {
    it('should return empty array when no duplicates', () => {
      const moduleA = createModule('A');
      const moduleB = createModule('B');
      const graph = new DependencyGraph([moduleA, moduleB]);

      const duplicates = graph.findDuplicateModules();
      expect(duplicates).toHaveLength(0);
    });
  });

  describe('validate()', () => {
    it('should validate valid graph', () => {
      const moduleC = createModule('C');
      const moduleB = createModule('B', [{ moduleName: 'C', status: 'satisfied', isOptional: false }]);
      const moduleA = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
      const graph = new DependencyGraph([moduleA, moduleB, moduleC]);

      const result = graph.validate();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect circular dependencies in validation', () => {
      const moduleA = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
      const moduleB = createModule('B', [{ moduleName: 'A', status: 'satisfied', isOptional: false }]);
      const graph = new DependencyGraph([moduleA, moduleB]);

      const result = graph.validate();
      expect(result.isValid).toBe(false);
      expect(result.circularDependencies.length).toBeGreaterThan(0);
    });
  });

  describe('topologicalSort()', () => {
    it('should return correct topological order', () => {
      const moduleC = createModule('C');
      const moduleB = createModule('B', [{ moduleName: 'C', status: 'satisfied', isOptional: false }]);
      const moduleA = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
      const graph = new DependencyGraph([moduleA, moduleB, moduleC]);

      const order = graph.topologicalSort();
      expect(order).not.toBeNull();
      if (order) {
        expect(order.indexOf('C')).toBeLessThan(order.indexOf('B'));
        expect(order.indexOf('B')).toBeLessThan(order.indexOf('A'));
      }
    });

    it('should return null for circular graph', () => {
      const moduleA = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
      const moduleB = createModule('B', [{ moduleName: 'A', status: 'satisfied', isOptional: false }]);
      const graph = new DependencyGraph([moduleA, moduleB]);

      const order = graph.topologicalSort();
      expect(order).toBeNull();
    });
  });
});

describe('validateModuleDependencies()', () => {
  function createModule(name: string, dependencies: Array<{ moduleName: string; status: DependencyStatus; isOptional: boolean }> = []): SystemModule {
    return SystemModuleEntity.create({
      moduleName: name,
      moduleVersion: '1.0.0',
      status: 'registered',
      dependencies: dependencies.map((d) => ({ moduleId: '', ...d })),
      metadata: {},
    });
  }

  it('should validate valid modules', () => {
    const moduleB = createModule('B');
    const moduleA = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
    const modules = [moduleA, moduleB];

    const result = validateModuleDependencies(modules);
    expect(result.isValid).toBe(true);
  });

  it('should detect issues', () => {
    const moduleA = createModule('A', [{ moduleName: 'NonExistent', status: 'satisfied', isOptional: false }]);
    const modules = [moduleA];

    const result = validateModuleDependencies(modules);
    expect(result.isValid).toBe(false);
    expect(result.missingDependencies).toContain('NonExistent');
  });
});

describe('detectCircularDependencies()', () => {
  function createModule(name: string, dependencies: Array<{ moduleName: string; status: DependencyStatus; isOptional: boolean }> = []): SystemModule {
    return SystemModuleEntity.create({
      moduleName: name,
      moduleVersion: '1.0.0',
      status: 'registered',
      dependencies: dependencies.map((d) => ({ moduleId: '', ...d })),
      metadata: {},
    });
  }

  it('should return no cycles for valid graph', () => {
    const moduleB = createModule('B');
    const moduleA = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
    const modules = [moduleA, moduleB];

    const result = detectCircularDependencies(modules);
    expect(result.hasCircularDependencies).toBe(false);
  });
});

describe('getTopologicalSort()', () => {
  function createModule(name: string, dependencies: Array<{ moduleName: string; status: DependencyStatus; isOptional: boolean }> = []): SystemModule {
    return SystemModuleEntity.create({
      moduleName: name,
      moduleVersion: '1.0.0',
      status: 'registered',
      dependencies: dependencies.map((d) => ({ moduleId: '', ...d })),
      metadata: {},
    });
  }

  it('should return sorted order', () => {
    const moduleC = createModule('C');
    const moduleB = createModule('B', [{ moduleName: 'C', status: 'satisfied', isOptional: false }]);
    const moduleA = createModule('A', [{ moduleName: 'B', status: 'satisfied', isOptional: false }]);
    const modules = [moduleA, moduleB, moduleC];

    const order = getTopologicalSort(modules);
    expect(order).not.toBeNull();
    if (order) {
      expect(order).toHaveLength(3);
    }
  });
});
