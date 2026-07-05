/**
 * DevOps Types Index
 *
 * Exports all DevOps domain types.
 */

export {
  DeploymentStatus,
  isActiveDeploymentStatus,
  isCompletedDeploymentStatus,
  isFailedDeploymentStatus,
  isTerminalDeploymentStatus,
} from './DeploymentStatus';

export {
  EnvironmentType,
  ENVIRONMENT_TYPE_INFO,
  getEnvironmentTypeDisplayName,
  getEnvironmentTypeDescription,
  isValidEnvironmentType,
} from './EnvironmentType';

export {
  InfrastructureType,
  INFRASTRUCTURE_TYPE_INFO,
  getInfrastructureTypeDisplayName,
  getInfrastructureTypeDescription,
  isValidInfrastructureType,
} from './InfrastructureType';

export type { DeploymentMetadata } from './DeploymentMetadata';
export { createDefaultDeploymentMetadata } from './DeploymentMetadata';

export type { InfrastructureStatistics } from './InfrastructureStatistics';
export { createInitialInfrastructureStatistics } from './InfrastructureStatistics';