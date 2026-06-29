/**
 * Configuration Scope Enum
 *
 * Defines the scope/visibility of configuration entries.
 */

export enum ConfigurationScope {
  /** Server-side only configuration */
  SERVER = 'server',

  /** Client-side only configuration */
  CLIENT = 'client',

  /** Shared between server and client */
  SHARED = 'shared',

  /** Environment-specific configuration */
  ENVIRONMENT = 'environment',
}
