/**
 * Guild Member Joined Event
 *
 * Domain event emitted when a member joins a guild.
 */

import type { GuildRoleType } from '../types/GuildRoleType';

/**
 * Event data for guild member joined.
 */
export interface GuildMemberJoinedEventData {
  /** Guild ID */
  guildId: string;
  /** Member ID */
  memberId: string;
  /** Player profile ID */
  playerProfileId: string;
  /** Role assigned */
  role: GuildRoleType;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for guild member joined.
 */
export interface GuildMemberJoinedEvent {
  /** Event type identifier */
  readonly eventType: 'GuildMemberJoined';
  /** Event data */
  readonly data: GuildMemberJoinedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a GuildMemberJoinedEvent.
 */
export function createGuildMemberJoinedEvent(params: {
  guildId: string;
  memberId: string;
  playerProfileId: string;
  role: GuildRoleType;
}): GuildMemberJoinedEvent {
  return {
    eventType: 'GuildMemberJoined',
    version: 1,
    data: {
      guildId: params.guildId,
      memberId: params.memberId,
      playerProfileId: params.playerProfileId,
      role: params.role,
      occurredAt: new Date(),
    },
  };
}
