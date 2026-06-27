/**
 * Player Profile Metadata Type
 *
 * Metadata about the player profile itself.
 * Contains versioning, source, and tracking information.
 */

/**
 * Possible values for profile creation source.
 */
export type ProfileCreatedVia = 'new_player' | 'tutorial' | 'imported' | 'restored';

/**
 * Possible values for last modification source.
 */
export type ProfileModifiedVia = 'gameplay' | 'tutorial' | 'admin' | 'system' | 'import';

/**
 * Profile metadata including versioning and source tracking.
 */
export interface PlayerProfileMetadata {
  /** Profile version for schema evolution */
  profileVersion: number;

  /** Creation source */
  createdVia: ProfileCreatedVia;

  /** Last modified via */
  modifiedVia: ProfileModifiedVia;

  /** Client app version when last modified */
  lastClientVersion: string | null;

  /** Device platform when last modified */
  lastPlatform: 'ios' | 'android' | 'web' | 'desktop' | null;

  /** Whether profile has been exported */
  wasExported: boolean;

  /** Whether profile has been migrated */
  wasMigrated: boolean;
}

/**
 * Initial metadata for newly created profiles.
 */
export const INITIAL_PROFILE_METADATA: PlayerProfileMetadata = {
  profileVersion: 1,
  createdVia: 'new_player',
  modifiedVia: 'gameplay',
  lastClientVersion: null,
  lastPlatform: null,
  wasExported: false,
  wasMigrated: false,
} as const;