/**
 * Module Registry
 *
 * Central registry of all system modules in the Jolt Time architecture.
 * Provides module metadata, dependencies, and registration information.
 *
 * This registry is the SINGLE SOURCE OF TRUTH for all module definitions.
 * Used by SystemIntegrationService to register modules and build dependency graphs.
 */

import type { SystemModule } from '../entities/SystemModule';
import type { ModuleDependency } from '../entities/SystemModule';
import { SystemModule as SystemModuleEntity } from '../entities/SystemModule';
import type { ModuleStatus } from '../types/ModuleStatus';

/**
 * Module definition for registration.
 */
export interface ModuleDefinition {
  moduleName: string;
  moduleVersion: string;
  status: ModuleStatus;
  dependencies: ModuleDependency[];
  metadata: Record<string, unknown>;
}

/**
 * Predefined domain modules in the Jolt Time system.
 * Each module represents a distinct architectural component.
 */
export const DOMAIN_MODULES: Record<string, ModuleDefinition> = {
  Authentication: {
    moduleName: 'Authentication',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [],
    metadata: { domain: 'security', layer: 'core' },
  },
  Telegram: {
    moduleName: 'Telegram',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [{ moduleId: '', moduleName: 'Authentication', status: 'satisfied', isOptional: false }],
    metadata: { domain: 'integration', layer: 'platform' },
  },
  Player: {
    moduleName: 'Player',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [{ moduleId: '', moduleName: 'Authentication', status: 'satisfied', isOptional: false }],
    metadata: { domain: 'core', layer: 'domain' },
  },
  Profile: {
    moduleName: 'Profile',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [{ moduleId: '', moduleName: 'Player', status: 'satisfied', isOptional: false }],
    metadata: { domain: 'core', layer: 'domain' },
  },
  Inventory: {
    moduleName: 'Inventory',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [{ moduleId: '', moduleName: 'Player', status: 'satisfied', isOptional: false }],
    metadata: { domain: 'core', layer: 'domain' },
  },
  Currency: {
    moduleName: 'Currency',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [{ moduleId: '', moduleName: 'Player', status: 'satisfied', isOptional: false }],
    metadata: { domain: 'economy', layer: 'domain' },
  },
  Artifact: {
    moduleName: 'Artifact',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [
      { moduleId: '', moduleName: 'Player', status: 'satisfied', isOptional: false },
      { moduleId: '', moduleName: 'Inventory', status: 'satisfied', isOptional: false },
    ],
    metadata: { domain: 'gameplay', layer: 'domain' },
  },
  Museum: {
    moduleName: 'Museum',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [
      { moduleId: '', moduleName: 'Artifact', status: 'satisfied', isOptional: false },
      { moduleId: '', moduleName: 'Player', status: 'satisfied', isOptional: false },
    ],
    metadata: { domain: 'gameplay', layer: 'domain' },
  },
  Academy: {
    moduleName: 'Academy',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [
      { moduleId: '', moduleName: 'Player', status: 'satisfied', isOptional: false },
      { moduleId: '', moduleName: 'Currency', status: 'satisfied', isOptional: false },
    ],
    metadata: { domain: 'gameplay', layer: 'domain' },
  },
  Quest: {
    moduleName: 'Quest',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [
      { moduleId: '', moduleName: 'Player', status: 'satisfied', isOptional: false },
      { moduleId: '', moduleName: 'Inventory', status: 'satisfied', isOptional: true },
    ],
    metadata: { domain: 'gameplay', layer: 'domain' },
  },
  Achievement: {
    moduleName: 'Achievement',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [{ moduleId: '', moduleName: 'Player', status: 'satisfied', isOptional: false }],
    metadata: { domain: 'gameplay', layer: 'domain' },
  },
  Guild: {
    moduleName: 'Guild',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [
      { moduleId: '', moduleName: 'Player', status: 'satisfied', isOptional: false },
      { moduleId: '', moduleName: 'Currency', status: 'satisfied', isOptional: true },
    ],
    metadata: { domain: 'social', layer: 'domain' },
  },
  'Reward Engine': {
    moduleName: 'Reward Engine',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [
      { moduleId: '', moduleName: 'Player', status: 'satisfied', isOptional: false },
      { moduleId: '', moduleName: 'Inventory', status: 'satisfied', isOptional: true },
      { moduleId: '', moduleName: 'Currency', status: 'satisfied', isOptional: true },
    ],
    metadata: { domain: 'economy', layer: 'service' },
  },
  Notification: {
    moduleName: 'Notification',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [
      { moduleId: '', moduleName: 'Player', status: 'satisfied', isOptional: false },
      { moduleId: '', moduleName: 'Telegram', status: 'satisfied', isOptional: false },
    ],
    metadata: { domain: 'infrastructure', layer: 'service' },
  },
  Analytics: {
    moduleName: 'Analytics',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [],
    metadata: { domain: 'infrastructure', layer: 'service' },
  },
  Admin: {
    moduleName: 'Admin',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [
      { moduleId: '', moduleName: 'Authentication', status: 'satisfied', isOptional: false },
      { moduleId: '', moduleName: 'Player', status: 'satisfied', isOptional: false },
    ],
    metadata: { domain: 'operations', layer: 'service' },
  },
  Configuration: {
    moduleName: 'Configuration',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [],
    metadata: { domain: 'infrastructure', layer: 'foundation' },
  },
  Scheduler: {
    moduleName: 'Scheduler',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [],
    metadata: { domain: 'infrastructure', layer: 'service' },
  },
  Audit: {
    moduleName: 'Audit',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [],
    metadata: { domain: 'compliance', layer: 'service' },
  },
  Monitoring: {
    moduleName: 'Monitoring',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [],
    metadata: { domain: 'operations', layer: 'infrastructure' },
  },
  Backup: {
    moduleName: 'Backup',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [],
    metadata: { domain: 'operations', layer: 'infrastructure' },
  },
  Integration: {
    moduleName: 'Integration',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [],
    metadata: { domain: 'integration', layer: 'service' },
  },
  Security: {
    moduleName: 'Security',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [
      { moduleId: '', moduleName: 'Authentication', status: 'satisfied', isOptional: false },
    ],
    metadata: { domain: 'security', layer: 'infrastructure' },
  },
  Cache: {
    moduleName: 'Cache',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [],
    metadata: { domain: 'infrastructure', layer: 'foundation' },
  },
  'API Gateway': {
    moduleName: 'API Gateway',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [
      { moduleId: '', moduleName: 'Authentication', status: 'satisfied', isOptional: false },
      { moduleId: '', moduleName: 'Security', status: 'satisfied', isOptional: false },
    ],
    metadata: { domain: 'infrastructure', layer: 'gateway' },
  },
  'Error Handling': {
    moduleName: 'Error Handling',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [],
    metadata: { domain: 'infrastructure', layer: 'foundation' },
  },
  DevOps: {
    moduleName: 'DevOps',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [],
    metadata: { domain: 'operations', layer: 'infrastructure' },
  },
  Optimization: {
    moduleName: 'Optimization',
    moduleVersion: '1.0.0',
    status: 'registered',
    dependencies: [],
    metadata: { domain: 'infrastructure', layer: 'foundation' },
  },
};

/**
 * Get all registered module names.
 */
export function getAllModuleNames(): string[] {
  return Object.keys(DOMAIN_MODULES);
}

/**
 * Get module definition by name.
 */
export function getModuleDefinition(moduleName: string): ModuleDefinition | undefined {
  return DOMAIN_MODULES[moduleName];
}

/**
 * Create a SystemModule entity from a module definition.
 */
export function createModuleFromDefinition(definition: ModuleDefinition): SystemModule {
  return SystemModuleEntity.create({
    moduleName: definition.moduleName,
    moduleVersion: definition.moduleVersion,
    status: definition.status,
    dependencies: definition.dependencies,
    metadata: definition.metadata,
  });
}

/**
 * Get all modules as SystemModule entities.
 */
export function getAllModuleEntities(): SystemModule[] {
  return Object.values(DOMAIN_MODULES).map(createModuleFromDefinition);
}

/**
 * Count of total registered modules.
 */
export function getModuleCount(): number {
  return Object.keys(DOMAIN_MODULES).length;
}
