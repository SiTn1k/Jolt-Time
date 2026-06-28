/**
 * Guild Validator
 *
 * Validates guild data according to game rules.
 */

import { GuildSlug } from '../value-objects/GuildSlug';
import { GuildName } from '../value-objects/GuildName';
import { GuildLevel } from '../value-objects/GuildLevel';
import type { GuildPrivacy } from '../types/GuildStatus';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of guild validation.
 */
export interface GuildValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for guild data.
 */
export class GuildValidator {
  /**
   * Validates a guild ID format.
   */
  public static isValidGuildId(guildId: string | null | undefined): boolean {
    if (!guildId || guildId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(guildId);
  }

  /**
   * Validates a guild slug.
   */
  public static isValidSlug(slug: string | null | undefined): boolean {
    return GuildSlug.isValid(slug);
  }

  /**
   * Validates a guild name.
   */
  public static isValidName(name: string | null | undefined): boolean {
    return GuildName.isValid(name);
  }

  /**
   * Validates a guild description.
   */
  public static isValidDescription(description: string | null | undefined): boolean {
    if (description === null || description === undefined) {
      return true; // Optional
    }
    return description.length <= 200;
  }

  /**
   * Validates a guild level.
   */
  public static isValidLevel(level: number | null | undefined): boolean {
    return GuildLevel.isValid(level);
  }

  /**
   * Validates guild experience.
   */
  public static isValidExperience(experience: number | null | undefined): boolean {
    if (experience === null || experience === undefined) {
      return false;
    }
    return Number.isInteger(experience) && experience >= 0;
  }

  /**
   * Validates member limit.
   */
  public static isValidMemberLimit(limit: number | null | undefined): boolean {
    if (limit === null || limit === undefined) {
      return false;
    }
    return Number.isInteger(limit) && limit >= 1 && limit <= 100;
  }

  /**
   * Validates owner player ID.
   */
  public static isValidOwnerPlayerId(playerId: string | null | undefined): boolean {
    if (!playerId || playerId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(playerId);
  }

  /**
   * Validates privacy setting.
   */
  public static isValidPrivacy(privacy: string | null | undefined): boolean {
    return privacy === 'public' || privacy === 'private';
  }

  /**
   * Validates a complete guild.
   */
  public static validate(data: {
    guildId?: string;
    slug?: string;
    name?: string;
    description?: string;
    ownerPlayerId?: string;
    guildLevel?: number;
    guildExperience?: number;
    memberLimit?: number;
    privacy?: GuildPrivacy;
  }): GuildValidationResult {
    const errors: string[] = [];

    if (data.guildId !== undefined) {
      if (!data.guildId || data.guildId.trim().length === 0) {
        errors.push('Guild ID is required');
      } else if (!UUID_REGEX.test(data.guildId)) {
        errors.push('Guild ID must be a valid UUID');
      }
    }

    if (data.slug !== undefined) {
      if (!data.slug || data.slug.trim().length === 0) {
        errors.push('Slug is required');
      } else if (!GuildSlug.isValid(data.slug)) {
        errors.push('Slug must be 3-24 lowercase alphanumeric characters with hyphens');
      }
    }

    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        errors.push('Name is required');
      } else if (!GuildName.isValid(data.name)) {
        errors.push('Name must be 3-24 alphanumeric characters or spaces');
      }
    }

    if (data.description !== undefined && data.description !== null) {
      if (data.description.length > 200) {
        errors.push('Description must be at most 200 characters');
      }
    }

    if (data.ownerPlayerId !== undefined) {
      if (!data.ownerPlayerId || data.ownerPlayerId.trim().length === 0) {
        errors.push('Owner player ID is required');
      } else if (!UUID_REGEX.test(data.ownerPlayerId)) {
        errors.push('Owner player ID must be a valid UUID');
      }
    }

    if (data.guildLevel !== undefined) {
      if (!GuildLevel.isValid(data.guildLevel)) {
        errors.push('Guild level must be between 1 and 7');
      }
    }

    if (data.guildExperience !== undefined) {
      if (!Number.isInteger(data.guildExperience) || data.guildExperience < 0) {
        errors.push('Guild experience must be a non-negative integer');
      }
    }

    if (data.memberLimit !== undefined) {
      if (!Number.isInteger(data.memberLimit) || data.memberLimit < 1 || data.memberLimit > 100) {
        errors.push('Member limit must be between 1 and 100');
      }
    }

    if (data.privacy !== undefined) {
      if (data.privacy !== 'public' && data.privacy !== 'private') {
        errors.push('Privacy must be either public or private');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates guild data and throws if invalid.
   */
  public static validateOrThrow(data: {
    guildId?: string;
    slug?: string;
    name?: string;
    description?: string;
    ownerPlayerId?: string;
    guildLevel?: number;
    guildExperience?: number;
    memberLimit?: number;
    privacy?: GuildPrivacy;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Guild validation failed: ${result.errors.join('; ')}`);
    }
  }
}
