/**
 * Error Status Types
 *
 * Defines all supported error status values in the system.
 * Error Handling Foundation ONLY stores errors - it never modifies gameplay.
 */

/**
 * Supported error status values.
 */
export enum ErrorStatus {
  /** Error is new and not yet processed */
  New = 'new',

  /** Error is being investigated */
  Investigating = 'investigating',

  /** Error has been acknowledged */
  Acknowledged = 'acknowledged',

  /** Error has been resolved */
  Resolved = 'resolved',

  /** Error has been archived */
  Archived = 'archived',

  /** Error was ignored */
  Ignored = 'ignored',
}

/**
 * Constraints for error status values.
 */
export const ERROR_STATUS_CONSTRAINTS = {
  MAX_STATUS_LENGTH: 16,
} as const;
