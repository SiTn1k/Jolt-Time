/**
 * Environment Type
 *
 * Defines the possible types of deployment environments.
 */

/**
 * Environment type enum.
 */
export enum EnvironmentType {
  /** Development environment for local testing */
  DEVELOPMENT = 'development',

  /** Testing environment for QA */
  TESTING = 'testing',

  /** Staging environment for pre-production */
  STAGING = 'staging',

  /** Production environment */
  PRODUCTION = 'production',
}

/**
 * Environment type information for display and validation.
 */
export const ENVIRONMENT_TYPE_INFO: Record<EnvironmentType, { displayName: string; description: string }> = {
  [EnvironmentType.DEVELOPMENT]: {
    displayName: 'Development',
    description: 'Local development environment for testing',
  },
  [EnvironmentType.TESTING]: {
    displayName: 'Testing',
    description: 'QA testing environment',
  },
  [EnvironmentType.STAGING]: {
    displayName: 'Staging',
    description: 'Pre-production staging environment',
  },
  [EnvironmentType.PRODUCTION]: {
    displayName: 'Production',
    description: 'Live production environment',
  },
};

/**
 * Gets the display name for an environment type.
 */
export function getEnvironmentTypeDisplayName(type: EnvironmentType): string {
  return ENVIRONMENT_TYPE_INFO[type]?.displayName ?? type;
}

/**
 * Gets the description for an environment type.
 */
export function getEnvironmentTypeDescription(type: EnvironmentType): string {
  return ENVIRONMENT_TYPE_INFO[type]?.description ?? '';
}

/**
 * Checks if an environment type is valid.
 */
export function isValidEnvironmentType(type: string): type is EnvironmentType {
  return Object.values(EnvironmentType).includes(type as EnvironmentType);
}