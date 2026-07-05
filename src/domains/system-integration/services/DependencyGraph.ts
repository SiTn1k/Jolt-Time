/**
 * Dependency Graph Service
 *
 * Service for analyzing module dependencies and detecting issues
 * such as circular dependencies, missing dependencies, and duplicate registrations.
 */

import type { SystemModule } from '../entities/SystemModule';
import type { ModuleDependency } from '../entities/SystemModule';

/**
 * Result of dependency validation.
 */
export interface DependencyValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Circular dependency detection result.
 */
export interface CircularDependencyResult {
  hasCircularDependencies: boolean;
  cycles: string[][];
}

/**
 * Dependency analysis result.
 */
export interface DependencyAnalysisResult {
  isValid: boolean;
  missingDependencies: string[];
  circularDependencies: string[][];
  duplicateModules: string[];
  errors: string[];
  warnings: string[];
}

/**
 * Service for analyzing module dependency graphs.
 */
export class DependencyGraph {
  private modules: Map<string, SystemModule>;

  constructor(modules: SystemModule[] = []) {
    this.modules = new Map();
    modules.forEach((module) => {
      this.modules.set(module.moduleName, module);
    });
  }

  /**
   * Add a module to the graph.
   */
  addModule(module: SystemModule): void {
    this.modules.set(module.moduleName, module);
  }

  /**
   * Remove a module from the graph.
   */
  removeModule(moduleName: string): void {
    this.modules.delete(moduleName);
  }

  /**
   * Get a module by name.
   */
  getModule(moduleName: string): SystemModule | undefined {
    return this.modules.get(moduleName);
  }

  /**
   * Get all modules in the graph.
   */
  getAllModules(): SystemModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Check if a module exists in the graph.
   */
  hasModule(moduleName: string): boolean {
    return this.modules.has(moduleName);
  }

  /**
   * Get direct dependencies of a module.
   */
  getDirectDependencies(moduleName: string): ModuleDependency[] {
    const module = this.modules.get(moduleName);
    return module?.dependencies ?? [];
  }

  /**
   * Get all dependencies (direct and transitive) of a module.
   */
  getAllDependencies(moduleName: string): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (name: string): void => {
      if (visited.has(name)) return;
      visited.add(name);

      const module = this.modules.get(name);
      if (!module) return;

      for (const dep of module.dependencies) {
        if (!visited.has(dep.moduleName)) {
          result.push(dep.moduleName);
          visit(dep.moduleName);
        }
      }
    };

    visit(moduleName);
    return result;
  }

  /**
   * Get all modules that depend on a given module.
   */
  getDependents(moduleName: string): string[] {
    const result: string[] = [];

    for (const module of this.modules.values()) {
      for (const dep of module.dependencies) {
        if (dep.moduleName === moduleName) {
          result.push(module.moduleName);
          break;
        }
      }
    }

    return result;
  }

  /**
   * Detect circular dependencies in the module graph.
   */
  detectCircularDependencies(): CircularDependencyResult {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const path: string[] = [];

    const visit = (moduleName: string): void => {
      visited.add(moduleName);
      recursionStack.add(moduleName);
      path.push(moduleName);

      const module = this.modules.get(moduleName);
      if (module) {
        for (const dep of module.dependencies) {
          if (!this.modules.has(dep.moduleName)) continue;

          if (!visited.has(dep.moduleName)) {
            visit(dep.moduleName);
          } else if (recursionStack.has(dep.moduleName)) {
            const cycleStart = path.indexOf(dep.moduleName);
            if (cycleStart !== -1) {
              cycles.push([...path.slice(cycleStart), dep.moduleName]);
            } else {
              cycles.push([...path, dep.moduleName]);
            }
          }
        }
      }

      path.pop();
      recursionStack.delete(moduleName);
    };

    for (const moduleName of this.modules.keys()) {
      if (!visited.has(moduleName)) {
        visit(moduleName);
      }
    }

    return {
      hasCircularDependencies: cycles.length > 0,
      cycles,
    };
  }

  /**
   * Find missing dependencies (dependencies that don't exist in the graph).
   */
  findMissingDependencies(): string[] {
    const missing: string[] = [];

    for (const module of this.modules.values()) {
      for (const dep of module.dependencies) {
        if (!this.modules.has(dep.moduleName) && !missing.includes(dep.moduleName)) {
          missing.push(dep.moduleName);
        }
      }
    }

    return missing;
  }

  /**
   * Find duplicate module registrations.
   */
  findDuplicateModules(): string[] {
    const nameCount = new Map<string, number>();

    for (const module of this.modules.values()) {
      const count = nameCount.get(module.moduleName) ?? 0;
      nameCount.set(module.moduleName, count + 1);
    }

    return Array.from(nameCount.entries())
      .filter(([, count]) => count > 1)
      .map(([name]) => name);
  }

  /**
   * Validate the entire dependency graph.
   */
  validate(): DependencyAnalysisResult {
    const missingDeps = this.findMissingDependencies();
    const circularResult = this.detectCircularDependencies();
    const duplicates = this.findDuplicateModules();

    const errors: string[] = [];
    const warnings: string[] = [];

    if (circularResult.hasCircularDependencies) {
      errors.push(`Circular dependencies detected: ${circularResult.cycles.map((c) => c.join(' -> ')).join('; ')}`);
    }

    if (missingDeps.length > 0) {
      errors.push(`Missing dependencies: ${missingDeps.join(', ')}`);
    }

    if (duplicates.length > 0) {
      errors.push(`Duplicate module registrations: ${duplicates.join(', ')}`);
    }

    // Check for modules with too many dependencies (potential design issue)
    for (const module of this.modules.values()) {
      if (module.dependencies.length > 10) {
        warnings.push(`Module '${module.moduleName}' has ${module.dependencies.length} dependencies (recommended: max 10)`);
      }
    }

    // Check for orphaned modules (no dependencies, no dependents)
    for (const module of this.modules.values()) {
      const dependents = this.getDependents(module.moduleName);
      if (module.dependencies.length === 0 && dependents.length === 0) {
        warnings.push(`Module '${module.moduleName}' is orphaned (no dependencies and no dependents)`);
      }
    }

    return {
      isValid: errors.length === 0,
      missingDependencies: missingDeps,
      circularDependencies: circularResult.cycles,
      duplicateModules: duplicates,
      errors,
      warnings,
    };
  }

  /**
   * Perform topological sort of modules based on dependencies.
   * Returns null if circular dependencies exist.
   */
  topologicalSort(): string[] | null {
    const result: string[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();

    const visit = (moduleName: string): boolean => {
      if (temp.has(moduleName)) return false;
      if (visited.has(moduleName)) return true;

      temp.add(moduleName);
      const module = this.modules.get(moduleName);
      if (module) {
        for (const dep of module.dependencies) {
          if (this.modules.has(dep.moduleName)) {
            if (!visit(dep.moduleName)) return false;
          }
        }
      }
      temp.delete(moduleName);
      visited.add(moduleName);
      result.push(moduleName);
      return true;
    };

    for (const moduleName of this.modules.keys()) {
      if (!visited.has(moduleName)) {
        if (!visit(moduleName)) return null;
      }
    }

    return result;
  }
}

/**
 * Validate dependencies for a list of modules.
 */
export function validateModuleDependencies(modules: SystemModule[]): DependencyAnalysisResult {
  const graph = new DependencyGraph(modules);
  return graph.validate();
}

/**
 * Detect circular dependencies in a list of modules.
 */
export function detectCircularDependencies(modules: SystemModule[]): CircularDependencyResult {
  const graph = new DependencyGraph(modules);
  return graph.detectCircularDependencies();
}

/**
 * Get topological sort order for a list of modules.
 */
export function getTopologicalSort(modules: SystemModule[]): string[] | null {
  const graph = new DependencyGraph(modules);
  return graph.topologicalSort();
}
