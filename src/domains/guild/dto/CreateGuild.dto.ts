/**
 * Create Guild DTO
 *
 * Data transfer object for creating a new guild.
 */

import type { GuildPrivacy } from '../types/GuildStatus';
import type { GuildMetadata } from '../types/GuildMetadata';

/**
 * Input for creating a new guild.
 */
export interface CreateGuildDto {
  /** Unique slug identifier */
  slug: string;
  /** Guild name */
  name: string;
  /** Guild description */
  description?: string;
  /** Owner player profile ID */
  ownerPlayerId: string;
  /** Privacy setting */
  privacy?: GuildPrivacy;
  /** Additional metadata */
  metadata?: GuildMetadata;
}

/**
 * Validation rules for CreateGuildDto.
 */
export const CREATE_GUILD_VALIDATION = {
  slug: {
    required: true,
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    minLength: 3,
    maxLength: 24,
    message: 'Slug must be 3-24 lowercase alphanumeric characters with hyphens',
  },
  name: {
    required: true,
    pattern: /^[a-zA-Z0-9\s]+$/,
    minLength: 3,
    maxLength: 24,
    message: 'Name must be 3-24 alphanumeric characters or spaces',
  },
  description: {
    required: false,
    maxLength: 200,
    message: 'Description must be at most 200 characters',
  },
  ownerPlayerId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    message: 'Owner player ID must be a valid UUID',
  },
} as const;
