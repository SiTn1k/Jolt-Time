/**
 * Audit Result Types
 *
 * Defines the possible outcomes of auditable actions.
 */

/**
 * Supported audit result types.
 * Results indicate the success or failure of the audited action.
 */
export enum AuditResult {
  /** Action completed successfully */
  SUCCESS = 'success',

  /** Action failed */
  FAILURE = 'failure',

  /** Action was denied due to permissions */
  DENIED = 'denied',

  /** Action is pending completion */
  PENDING = 'pending',

  /** Action was rolled back */
  ROLLED_BACK = 'rolled_back',
}

/**
 * Constraints for audit result types.
 */
export const AUDIT_RESULT_CONSTRAINTS = {
  MAX_ERROR_MESSAGE_LENGTH: 1024,
} as const;
