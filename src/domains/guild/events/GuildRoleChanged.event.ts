/**
 * Guild Role Changed Event
 *
 * Domain event emitted when a member's role changes within a guild.
 */

import type { GuildRoleType } from '../types/GuildRoleType';

/**
 * Event data for guild role changed.
 */
export interface GuildRoleChangedEventData {
  /** Guild ID */
  guildId: string;
  /** Member ID */
  memberId: string;
  /** Player profile ID */
  playerProfileId: string;
  /** Previous role */
  previousRole: GuildRoleType;
  /** New role */
  newRole: GuildRoleType;
  /** Changed by player profile ID */
  changedByPlayerId: string;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for guild role changed.
 */
export interface GuildRoleChangedEvent {
  /** Event type identifier */
  readonly eventType: 'GuildRoleChanged';
  /** Event data */
  readonly data: GuildRoleChangedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a GuildRoleChangedEvent.
 */
export function createGuildRoleChangedEvent(params: {
  guildId: string;
  memberId: string;
  playerProfileId: string;
  previousRole: GuildRoleType;
  newRole: GuildRoleType;
  changedByPlayerId: string;
}): GuildRoleChangedEvent {
  return {
    eventType: 'GuildRoleChanged',
    version: 1,
    data: {
      guildId: params.guildId,
      memberId: params.memberId,
      playerProfileId: params.playerProfileId,
      previousRole: params.previousRole,
      newRole: params.newRole,
      changedByPlayerId: params.changedByPlayerId,
      occurredAt: new Date(),
    },
  };
}
