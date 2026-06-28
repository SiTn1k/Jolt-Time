/**
 * Guild Response DTO
 *
 * Data transfer object for guild responses.
 */

import type { GuildPrivacy, GuildStatus } from '../types/GuildStatus';
import type { GuildMetadata } from '../types/GuildMetadata';
import type { GuildStatistics } from '../types/GuildStatistics';
import type { GuildMemberSummaryDto } from './GuildMember.dto';

/**
 * Guild response DTO.
 */
export interface GuildResponseDto {
  /** Guild ID */
  guildId: string;
  /** Guild slug */
  slug: string;
  /** Guild name */
  name: string;
  /** Guild description */
  description: string;
  /** Owner player ID */
  ownerPlayerId: string;
  /** Guild level */
  guildLevel: number;
  /** Guild experience */
  guildExperience: number;
  /** Member limit */
  memberLimit: number;
  /** Current member count */
  memberCount: number;
  /** Privacy setting */
  privacy: GuildPrivacy;
  /** Guild status */
  status: GuildStatus;
  /** Guild statistics */
  statistics: GuildStatistics;
  /** Guild metadata */
  metadata: GuildMetadata;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Guild summary DTO (for listings).
 */
export interface GuildSummaryDto {
  /** Guild ID */
  guildId: string;
  /** Guild slug */
  slug: string;
  /** Guild name */
  name: string;
  /** Guild level */
  guildLevel: number;
  /** Member count / limit */
  memberCount: number;
  /** Member limit */
  memberLimit: number;
  /** Privacy setting */
  privacy: GuildPrivacy;
  /** Owner nickname */
  ownerNickname?: string;
  /** Guild icon preset */
  iconPreset?: string;
}

/**
 * Guild list response DTO.
 */
export interface GuildListResponseDto {
  /** Guilds */
  guilds: GuildSummaryDto[];
  /** Total count */
  total: number;
  /** Current page */
  page: number;
  /** Page size */
  pageSize: number;
  /** Total pages */
  totalPages: number;
}

/**
 * Guild detail response DTO (with members).
 */
export interface GuildDetailResponseDto extends GuildResponseDto {
  /** Guild members */
  members: GuildMemberSummaryDto[];
}

/**
 * Guild with leader info DTO.
 */
export interface GuildWithLeaderDto extends GuildResponseDto {
  /** Leader player nickname */
  leaderNickname?: string;
  /** Leader player level */
  leaderLevel?: number;
}
