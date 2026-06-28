/**
 * Guild Member DTO
 *
 * Data transfer object for guild member information.
 */

import type { GuildRoleType } from '../types/GuildRoleType';
import type { GuildMemberStatistics } from '../types/GuildStatistics';

/**
 * Input for creating/updating a guild member.
 */
export interface GuildMemberDto {
  /** Member ID */
  memberId: string;
  /** Guild ID */
  guildId: string;
  /** Player profile ID */
  playerProfileId: string;
  /** Member role */
  role: GuildRoleType;
  /** When the member joined */
  joinedAt: string;
  /** Last activity timestamp */
  lastActiveAt: string;
  /** Member statistics */
  statistics: GuildMemberStatistics;
}

/**
 * Guild member summary DTO (for listings).
 */
export interface GuildMemberSummaryDto {
  /** Member ID */
  memberId: string;
  /** Player profile ID */
  playerProfileId: string;
  /** Member role */
  role: GuildRoleType;
  /** When the member joined */
  joinedAt: string;
  /** Last activity timestamp */
  lastActiveAt: string;
  /** Player nickname (from player profile) */
  playerNickname?: string;
  /** Player level (from player profile) */
  playerLevel?: number;
}
