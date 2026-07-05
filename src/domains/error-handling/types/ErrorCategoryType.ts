/**
 * Error Category Type
 *
 * Defines all supported error category types in the system.
 * Error Handling Foundation ONLY stores errors - it never modifies gameplay.
 */

/**
 * Supported error category types.
 */
export enum ErrorCategoryType {
  /** UI Errors - User interface and rendering issues */
  UI = 'ui',

  /** Validation Errors - Input validation failures */
  Validation = 'validation',

  /** Service Errors - Business logic failures */
  Service = 'service',

  /** Repository Errors - Data access failures */
  Repository = 'repository',

  /** API Errors - External API communication failures */
  API = 'api',

  /** Database Errors - Supabase and database failures */
  Database = 'database',

  /** Telegram Errors - Telegram API failures */
  Telegram = 'telegram',

  /** External Service Errors - Third-party service failures */
  ExternalService = 'external_service',

  /** System Errors - Internal system failures */
  System = 'system',

  /** Security Errors - Security-related failures */
  Security = 'security',

  /** Configuration Errors - Configuration-related failures */
  Configuration = 'configuration',

  /** Network Errors - Network connectivity failures */
  Network = 'network',
}

/**
 * Constraints for error category types.
 */
export const ERROR_CATEGORY_TYPE_CONSTRAINTS = {
  MAX_CATEGORY_TYPE_LENGTH: 32,
} as const;
