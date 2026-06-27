/**
 * User Metadata
 *
 * Metadata associated with a user entity.
 * Contains tracking and profile information.
 */

/**
 * Source of user registration.
 */
export type RegistrationSource = 'telegram_mini_app' | 'telegram_bot' | 'web' | 'imported' | 'system';

/**
 * User metadata interface.
 * Contains tracking and profile information.
 */
export interface UserMetadata {
  /** Where the user registered from */
  registrationSource: RegistrationSource;

  /** Timestamp of last login */
  lastLoginAt: Date | null;

  /** Timestamp of last activity */
  lastSeenAt: Date | null;

  /** Timestamp when user was created */
  createdAt: Date;

  /** Timestamp when user was last updated */
  updatedAt: Date;

  /** Profile version for tracking changes */
  profileVersion: number;
}

/**
 * Default metadata for newly created users.
 */
export function createDefaultUserMetadata(registrationSource: RegistrationSource): UserMetadata {
  const now = new Date();
  return {
    registrationSource,
    lastLoginAt: now,
    lastSeenAt: now,
    createdAt: now,
    updatedAt: now,
    profileVersion: 1,
  };
}
