/**
 * System Integration Services
 *
 * Exports all services for the system-integration domain.
 */

export { SystemIntegrationService } from './SystemIntegrationService';
export type {
  ModuleRegistrationResult,
  ModuleValidationReport,
  IntegrationSummary,
} from './SystemIntegrationService';

export { DependencyGraph } from './DependencyGraph';
export type {
  DependencyValidationResult,
  CircularDependencyResult,
  DependencyAnalysisResult,
} from './DependencyGraph';

export {
  DOMAIN_MODULES,
  getAllModuleNames,
  getModuleDefinition,
  createModuleFromDefinition,
  getAllModuleEntities,
  getModuleCount,
} from './ModuleRegistry';
export type { ModuleDefinition } from './ModuleRegistry';
