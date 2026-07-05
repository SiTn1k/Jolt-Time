/**
 * Infrastructure Type
 *
 * Defines the possible types of infrastructure nodes.
 */

/**
 * Infrastructure type enum.
 */
export enum InfrastructureType {
  /** API server */
  API_SERVER = 'api_server',

  /** Database server */
  DATABASE = 'database',

  /** Cache server */
  CACHE = 'cache',

  /** Message queue */
  QUEUE = 'queue',

  /** Load balancer */
  LOAD_BALANCER = 'load_balancer',

  /** CDN node */
  CDN = 'cdn',

  /** Storage service */
  STORAGE = 'storage',

  /** Monitoring service */
  MONITORING = 'monitoring',

  /** Logging service */
  LOGGING = 'logging',

  /** Container orchestration */
  ORCHESTRATOR = 'orchestrator',
}

/**
 * Infrastructure type information for display and validation.
 */
export const INFRASTRUCTURE_TYPE_INFO: Record<InfrastructureType, { displayName: string; description: string }> = {
  [InfrastructureType.API_SERVER]: {
    displayName: 'API Server',
    description: 'Application programming interface server',
  },
  [InfrastructureType.DATABASE]: {
    displayName: 'Database',
    description: 'Data persistence layer',
  },
  [InfrastructureType.CACHE]: {
    displayName: 'Cache',
    description: 'In-memory caching layer',
  },
  [InfrastructureType.QUEUE]: {
    displayName: 'Queue',
    description: 'Message queue service',
  },
  [InfrastructureType.LOAD_BALANCER]: {
    displayName: 'Load Balancer',
    description: 'Traffic distribution service',
  },
  [InfrastructureType.CDN]: {
    displayName: 'CDN',
    description: 'Content delivery network',
  },
  [InfrastructureType.STORAGE]: {
    displayName: 'Storage',
    description: 'Object/file storage service',
  },
  [InfrastructureType.MONITORING]: {
    displayName: 'Monitoring',
    description: 'Performance monitoring service',
  },
  [InfrastructureType.LOGGING]: {
    displayName: 'Logging',
    description: 'Log aggregation service',
  },
  [InfrastructureType.ORCHESTRATOR]: {
    displayName: 'Orchestrator',
    description: 'Container orchestration platform',
  },
};

/**
 * Gets the display name for an infrastructure type.
 */
export function getInfrastructureTypeDisplayName(type: InfrastructureType): string {
  return INFRASTRUCTURE_TYPE_INFO[type]?.displayName ?? type;
}

/**
 * Gets the description for an infrastructure type.
 */
export function getInfrastructureTypeDescription(type: InfrastructureType): string {
  return INFRASTRUCTURE_TYPE_INFO[type]?.description ?? '';
}

/**
 * Checks if an infrastructure type is valid.
 */
export function isValidInfrastructureType(type: string): type is InfrastructureType {
  return Object.values(InfrastructureType).includes(type as InfrastructureType);
}