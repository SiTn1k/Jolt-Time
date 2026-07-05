/**
 * Stabilization Metadata Type
 *
 * Additional metadata for stabilization entities.
 */

/**
 * Stabilization metadata structure.
 */
export interface StabilizationMetadata {
  /** Additional notes about the entity */
  notes?: string;

  /** Stack trace or error details */
  stackTrace?: string;

  /** Request ID for correlation */
  requestId?: string;

  /** User ID associated with the issue */
  userId?: string;

  /** IP address of the source */
  ipAddress?: string;

  /** Additional tags for categorization */
  tags?: string[];

  /** Arbitrary additional data */
  [key: string]: unknown;
}

/**
 * Initial empty stabilization metadata.
 */
export const INITIAL_STABILIZATION_METADATA: StabilizationMetadata = {};

/**
 * Constraints for stabilization metadata.
 */
export const STABILIZATION_METADATA_CONSTRAINTS = {
  MAX_NOTES_LENGTH: 2000,
  MAX_STACK_TRACE_LENGTH: 10000,
  MAX_REQUEST_ID_LENGTH: 100,
  MAX_USER_ID_LENGTH: 100,
  MAX_IP_ADDRESS_LENGTH: 45,
  MAX_TAGS: 20,
  MAX_TAG_LENGTH: 50,
} as const;
