/**
 * Profile Type
 *
 * Defines the types of performance profiles.
 */

export enum ProfileType {
  MODULE = 'Module',
  FUNCTION = 'Function',
  API = 'Api',
  DATABASE = 'Database',
  CACHE = 'Cache',
  MEMORY = 'Memory',
  CPU = 'Cpu',
}

/**
 * Constraints for profile type values.
 */
export const PROFILE_TYPE_CONSTRAINTS = {
  MAX_TYPE_LENGTH: 20,
} as const;
