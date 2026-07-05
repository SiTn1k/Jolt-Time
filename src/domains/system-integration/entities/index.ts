/**
 * System Integration Entities
 *
 * Exports all entities for the system-integration domain.
 */

export { SystemModule } from './SystemModule';
export type { SystemModuleProps, SystemModuleRecord, SystemModuleJSON, ModuleDependency } from './SystemModule';

export { IntegrationState } from './IntegrationState';
export type { IntegrationStateProps, IntegrationStateRecord, IntegrationStateJSON } from './IntegrationState';

export { IntegrationSnapshot } from './IntegrationSnapshot';
export type { IntegrationSnapshotProps, IntegrationSnapshotRecord, IntegrationSnapshotJSON, ModuleStatusSummary } from './IntegrationSnapshot';
