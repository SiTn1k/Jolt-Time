/**
 * DevOps Domain Index
 *
 * Main entry point for the DevOps domain module.
 * Exports all public-facing entities, interfaces, types, and utilities.
 *
 * DevOps represents the deployment and operational management layer.
 * DevOps never contains gameplay logic.
 * DevOps Foundation ONLY stores:
 * - Deployments
 * - Environments
 * - Infrastructure metadata
 */

// Value Objects
export { DeploymentId } from './value-objects';
export { EnvironmentId } from './value-objects';
export { NodeId } from './value-objects';

// Types - enums and functions
export {
  DeploymentStatus,
  isActiveDeploymentStatus,
  isCompletedDeploymentStatus,
  isFailedDeploymentStatus,
  isTerminalDeploymentStatus,
} from './types';

export {
  EnvironmentType,
  ENVIRONMENT_TYPE_INFO,
  getEnvironmentTypeDisplayName,
  getEnvironmentTypeDescription,
  isValidEnvironmentType,
} from './types';

export {
  InfrastructureType,
  INFRASTRUCTURE_TYPE_INFO,
  getInfrastructureTypeDisplayName,
  getInfrastructureTypeDescription,
  isValidInfrastructureType,
} from './types';

// Types - interfaces
export type { DeploymentMetadata } from './types';
export { createDefaultDeploymentMetadata } from './types';

export type { InfrastructureStatistics } from './types';
export { createInitialInfrastructureStatistics } from './types';

// Entities
export {
  Deployment,
  type DeploymentProps,
  type DeploymentRecord,
  type DeploymentJSON,
} from './entities';

export {
  Environment,
  type EnvironmentProps,
  type EnvironmentRecord,
  type EnvironmentJSON,
  type EnvironmentConfiguration,
  type EnvironmentMetadata,
} from './entities';

export {
  InfrastructureNode,
  type InfrastructureNodeProps,
  type InfrastructureNodeRecord,
  type InfrastructureNodeJSON,
  type InfrastructureNodeMetadata,
  type NodeStatus,
} from './entities';

// Interfaces
export type { IDeployment } from './interfaces';
export type { IEnvironment, EnvironmentMetadata as IEnvironmentMetadata } from './interfaces';
export type { IInfrastructureNode, InfrastructureNodeMetadata as IInfrastructureNodeMetadata } from './interfaces';
export type {
  IDevOpsRepository,
  DeploymentFilterParams,
  EnvironmentFilterParams,
  InfrastructureNodeFilterParams,
} from './interfaces';

// DTOs
export type {
  DeploymentDto,
  DeploymentSummaryDto,
  DeploymentDetailDto,
} from './dto';

export type {
  EnvironmentDto,
  EnvironmentMetadataDto,
  EnvironmentSummaryDto,
  EnvironmentDetailDto,
} from './dto';

export type {
  InfrastructureNodeDto,
  InfrastructureNodeMetadataDto,
  InfrastructureNodeSummaryDto,
  InfrastructureNodeDetailDto,
} from './dto';

export type {
  DeploymentResponseDto,
  DeploymentSummaryResponseDto,
  DeploymentDetailResponseDto,
  DeploymentPaginatedResponseDto,
} from './dto';

// Validators
export { DeploymentValidator, type DeploymentValidationResult } from './validators';
export { EnvironmentValidator, type EnvironmentValidationResult } from './validators';
export { InfrastructureValidator, type InfrastructureValidationResult } from './validators';

// Events
export type {
  DeploymentCreatedEvent,
  DeploymentCreatedEventData,
} from './events';
export { createDeploymentCreatedEvent } from './events';

export type {
  EnvironmentRegisteredEvent,
  EnvironmentRegisteredEventData,
} from './events';
export { createEnvironmentRegisteredEvent } from './events';

export type {
  InfrastructureNodeAddedEvent,
  InfrastructureNodeAddedEventData,
} from './events';
export { createInfrastructureNodeAddedEvent } from './events';

// Mappers
export { DeploymentMapper } from './mappers';
export { EnvironmentMapper } from './mappers';
export { InfrastructureMapper } from './mappers';

// Repositories
export { SupabaseDevOpsRepository } from './repositories';

// DI
export {
  DEVOPS_TOKENS,
  registerDevOpsDependencies,
  setupDevOpsDomain,
} from './di';