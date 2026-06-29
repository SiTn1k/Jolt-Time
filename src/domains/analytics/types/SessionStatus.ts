/**
 * Session Status
 *
 * Defines possible states for an analytics session.
 */

/**
 * Supported session statuses.
 */
export enum SessionStatus {
  // Session is active
  ACTIVE = 'active',

  // Session has ended normally
  ENDED = 'ended',

  // Session was abandoned (no explicit end)
  ABANDONED = 'abandoned',

  // Session expired due to timeout
  EXPIRED = 'expired',
}

/**
 * Session constraints.
 */
export const SESSION_CONSTRAINTS = {
  MAX_DURATION_MS: 24 * 60 * 60 * 1000, // 24 hours
  DEFAULT_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  MIN_DURATION_MS: 1000, // 1 second minimum
  MAX_DEVICE_LENGTH: 64,
  MAX_PLATFORM_LENGTH: 32,
} as const;
