/**
 * Error Metadata Types
 *
 * Defines metadata structures for error tracking.
 * Error Handling Foundation ONLY stores errors - it never modifies gameplay.
 */

/**
 * Error metadata containing additional error context.
 */
export interface ErrorMetadata {
  /** Error source module or component */
  sourceModule?: string;

  /** Error source function or method */
  sourceFunction?: string;

  /** HTTP method if applicable */
  httpMethod?: string;

  /** Request URL if applicable */
  requestUrl?: string;

  /** HTTP status code if applicable */
  httpStatusCode?: number;

  /** External error code from third-party service */
  externalErrorCode?: string;

  /** User agent string */
  userAgent?: string;

  /** Device information */
  deviceInfo?: string;

  /** Platform information (iOS, Android, Web) */
  platform?: string;

  /** Application version */
  appVersion?: string;

  /** Custom metadata fields */
  [key: string]: unknown;
}

/**
 * Initial/empty error metadata.
 */
export const INITIAL_ERROR_METADATA: ErrorMetadata = {};

/**
 * Constraints for error metadata.
 */
export const ERROR_METADATA_CONSTRAINTS = {
  MAX_SOURCE_MODULE_LENGTH: 64,
  MAX_SOURCE_FUNCTION_LENGTH: 128,
  MAX_REQUEST_URL_LENGTH: 2048,
  MAX_USER_AGENT_LENGTH: 512,
  MAX_DEVICE_INFO_LENGTH: 256,
  MAX_PLATFORM_LENGTH: 32,
  MAX_APP_VERSION_LENGTH: 32,
} as const;
