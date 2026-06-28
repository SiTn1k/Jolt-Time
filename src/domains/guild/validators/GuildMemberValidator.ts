/**
 * Guild Member Validator
 *
 * Validates guild member data according to game rules.
 */

import type { GuildRoleType } from '../types/GuildRoleType';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of guild member validation.
 */
export interface GuildMemberValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for guild member data.
 */
export class GuildMemberValidator {
  /**
   * Validates a member ID format.
   */
  public static isValidMemberId(memberId: string | null | undefined): boolean {
    if (!memberId || memberId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(memberId);
  }

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
   * Validates a player profile ID format.
   */
  public static isValidPlayerProfileId(playerProfileId: string | null | undefined): boolean {
    if (!playerProfileId || playerProfileId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(playerProfileId);
  }

  /**
   * Validates a guild role type.
   */
  public static isValidRole(role: string | null | undefined): boolean {
    return role === 'leader' || role === 'officer' || role === 'member';
  }

  /**
   * Validates a date.
   */
  public static isValidDate(date: Date | string | null | undefined): boolean {
    if (!date) {
      return false;
    }
    const d = typeof date === 'string' ? new Date(date) : date;
    return d instanceof Date && !isNaN(d.getTime());
  }

  /**
   * Validates member statistics.
   */
  public static isValidStatistics(statistics: Record<string, unknown> | null | undefined): boolean {
    if (!statistics) {
      return true; // Optional
    }
    return typeof statistics === 'object';
  }

  /**
   * Validates a complete guild member.
   */
  public static validate(data: {
    memberId?: string;
    guildId?: string;
    playerProfileId?: string;
    role?: GuildRoleType;
    joinedAt?: Date | string;
    lastActiveAt?: Date | string;
  }): GuildMemberValidationResult {
    const errors: string[] = [];

    if (data.memberId !== undefined) {
      if (!data.memberId || data.memberId.trim().length === 0) {
        errors.push('Member ID is required');
      } else if (!UUID_REGEX.test(data.memberId)) {
        errors.push('Member ID must be a valid UUID');
      }
    }

    if (data.guildId !== undefined) {
      if (!data.guildId || data.guildId.trim().length === 0) {
        errors.push('Guild ID is required');
      } else if (!UUID_REGEX.test(data.guildId)) {
        errors.push('Guild ID must be a valid UUID');
      }
    }

    if (data.playerProfileId !== undefined) {
      if (!data.playerProfileId || data.playerProfileId.trim().length === 0) {
        errors.push('Player profile ID is required');
      } else if (!UUID_REGEX.test(data.playerProfileId)) {
        errors.push('Player profile ID must be a valid UUID');
      }
    }

    if (data.role !== undefined) {
      if (!this.isValidRole(data.role)) {
        errors.push('Role must be leader, officer, or member');
      }
    }

    if (data.joinedAt !== undefined) {
      if (!this.isValidDate(data.joinedAt)) {
        errors.push('Joined date must be a valid date');
      }
    }

    if (data.lastActiveAt !== undefined) {
      if (!this.isValidDate(data.lastActiveAt)) {
        errors.push('Last active date must be a valid date');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates guild member data and throws if invalid.
   */
  public static validateOrThrow(data: {
    memberId?: string;
    guildId?: string;
    playerProfileId?: string;
    role?: GuildRoleType;
    joinedAt?: Date | string;
    lastActiveAt?: Date | string;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Guild member validation failed: ${result.errors.join('; ')}`);
    }
  }
}
