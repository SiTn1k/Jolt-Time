/**
 * Session Status Types
 *
 * Defines all supported security session status values.
 */

/**
 * Supported security session status values.
 */
export enum SessionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  SUSPENDED = 'suspended',
  INVALID = 'invalid',
}

/**
 * Constraints for session status types.
 */
export const SESSION_STATUS_CONSTRAINTS = {
  VALID_STATUSES: Object.values(SessionStatus),
} as const;
