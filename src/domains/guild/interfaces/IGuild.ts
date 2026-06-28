/**
 * IGuild Interface
 *
 * Interface for Guild domain entity.
 */

import type { GuildId } from '../value-objects/GuildId';
import type { GuildSlug } from '../value-objects/GuildSlug';
import type { GuildName } from '../value-objects/GuildName';
import type { GuildLevel } from '../value-objects/GuildLevel';
import type { GuildPrivacy } from '../types/GuildStatus';
import type { GuildMetadata } from '../types/GuildMetadata';
import type { GuildStatistics } from '../types/GuildStatistics';

/**
 * Guild entity interface.
 */
export interface IGuild {
  /** Unique guild identifier */
  readonly guildId: GuildId;
  /** URL-friendly unique identifier */
  readonly slug: GuildSlug;
  /** Guild name */
  readonly name: GuildName;
  /** Guild description */
  readonly description: string;
  /** Owner player profile ID */
  readonly ownerPlayerId: string;
  /** Guild level */
  readonly guildLevel: GuildLevel;
  /** Total guild experience */
  readonly guildExperience: number;
  /** Maximum members allowed */
  readonly memberLimit: number;
  /** Privacy setting */
  readonly privacy: GuildPrivacy;
  /** Guild statistics */
  readonly statistics: GuildStatistics;
  /** Additional metadata */
  readonly metadata: GuildMetadata;
  /** Creation timestamp */
  readonly createdAt: Date;
  /** Last update timestamp */
  readonly updatedAt: Date;

  /**
   * Checks if guild is public.
   */
  isPublic: boolean;

  /**
   * Checks if guild is private.
   */
  isPrivate: boolean;
}
