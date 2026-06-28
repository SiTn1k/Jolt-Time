/**
 * IGuildMember Interface
 *
 * Interface for GuildMember domain entity.
 */

import type { GuildMemberId } from '../entities/GuildMemberId';
import type { GuildId } from '../value-objects/GuildId';
import type { GuildRoleType } from '../types/GuildRoleType';
import type { GuildMemberStatistics } from '../types/GuildStatistics';

/**
 * Guild member entity interface.
 */
export interface IGuildMember {
  /** Unique member identifier */
  readonly memberId: GuildMemberId;
  /** Guild ID */
  readonly guildId: GuildId;
  /** Player profile ID */
  readonly playerProfileId: string;
  /** Member role */
  readonly role: GuildRoleType;
  /** When the member joined */
  readonly joinedAt: Date;
  /** Last activity timestamp */
  readonly lastActiveAt: Date;
  /** Member statistics */
  readonly statistics: GuildMemberStatistics;
  /** Additional metadata */
  readonly metadata: Record<string, unknown>;

  /**
   * Checks if member is the guild leader.
   */
  isLeader: boolean;

  /**
   * Checks if member is an officer.
   */
  isOfficer: boolean;

  /**
   * Checks if member is a regular member.
   */
  isMember: boolean;

  /**
   * Checks if member has management privileges.
   */
  hasManagementPrivileges: boolean;
}
